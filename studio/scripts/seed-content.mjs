import {createClient} from '@sanity/client';
import {defaults} from '../../src/lib/defaults.ts';

const token = process.env.SANITY_AUTH_TOKEN;
const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
if (!token || !projectId || !dataset) throw new Error('Missing Sanity deployment configuration.');

const client = createClient({projectId, dataset, token, apiVersion: '2026-09-19', useCdn: false, perspective: 'raw'});

function withKeys(value) {
  if (Array.isArray(value)) return value.map((item, index) => item && typeof item === 'object' ? {...withKeys(item), _key: item._key || `item${index}`} : item);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, withKeys(item)]));
  return value;
}

function mergeMissing(base, existing) {
  if (existing === undefined || existing === null) return base;
  if (Array.isArray(base)) return Array.isArray(existing) ? existing : base;
  if (base && typeof base === 'object' && existing && typeof existing === 'object' && !Array.isArray(existing)) {
    return Object.fromEntries(Object.entries(base).map(([key, value]) => [key, mergeMissing(value, existing[key])]));
  }
  return existing;
}

function editableFields(document = {}) {
  const {_id, _rev, _createdAt, _updatedAt, _type, copy: legacyCopy, ...fields} = document;
  return {...fields, ...(legacyCopy || {})};
}

const {
  heroImage,
  portraitImage,
  clinicImage,
  treatmentImage,
  copy,
  ...contentDefaults
} = defaults;
const trainers = contentDefaults.trainers.map(({image, ...trainer}) => trainer);
const seed = withKeys({...contentDefaults, trainers, ...copy});
const documents = await client.fetch('*[_id in $ids]', {ids: ['siteSettings', 'drafts.siteSettings']});
const published = documents.find(document => document._id === 'siteSettings');
const draft = documents.find(document => document._id === 'drafts.siteSettings');

if (published) {
  const addMissingFields = async document => {
    const missing = Object.fromEntries(Object.entries(seed).filter(([key]) => document[key] === undefined || document[key] === null));
    if (Object.keys(missing).length) await client.patch(document._id).setIfMissing(missing).commit();
  };
  await addMissingFields(published);
  if (draft) await addMissingFields(draft);
  console.log('Added newly available fields while leaving existing editor values unchanged.');
} else {
  const content = mergeMissing(seed, editableFields(draft));
  await client.createOrReplace({_id: 'siteSettings', _type: 'siteSettings', ...content});
  if (draft) await client.createOrReplace({_id: 'drafts.siteSettings', _type: 'siteSettings', ...content});
  console.log('Published current website content as the editable siteSettings document.');
}
