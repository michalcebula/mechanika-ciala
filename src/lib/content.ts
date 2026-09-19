import {mergeContent} from './merge-content.mjs';
import { withBase } from './paths';
import { createClient } from '@sanity/client';
import {defaults} from './defaults';
export const fallback = {...defaults,
  heroImage: withBase(defaults.heroImage),
  portraitImage: withBase(defaults.portraitImage),
  clinicImage: withBase(defaults.clinicImage),
  treatmentImage: withBase(defaults.treatmentImage)
};
export type Content = typeof fallback;
let cached: Promise<Content> | undefined;
export function getContent(): Promise<Content> {
  return cached ??= load();
}
async function load(): Promise<Content> {
  const projectId = import.meta.env.SANITY_PROJECT_ID;
  const dataset = import.meta.env.SANITY_DATASET;
  if (!projectId && !dataset) return fallback;
  if (!projectId || !dataset) throw new Error('Set both SANITY_PROJECT_ID and SANITY_DATASET.');
  const client = createClient({ projectId, dataset, apiVersion: '2025-02-19', useCdn: false, perspective: 'published', token: import.meta.env.SANITY_READ_TOKEN || undefined });
  const doc = await client.fetch('*[_id == "siteSettings"][0]{..., "heroImage":heroImage.asset->url,"portraitImage":portraitImage.asset->url,"clinicImage":clinicImage.asset->url,"treatmentImage":treatmentImage.asset->url}');
  if (!doc) throw new Error('Publish a siteSettings document in Sanity before building.');
  const data = mergeContent(fallback, doc) as Content;
  for (const key of ['booksyUrl', 'googleUrl', 'facebookUrl'] as const) {
    if (!data[key].startsWith('https://')) throw new Error(`Invalid HTTPS link: ${key}`);
  }
  for (const review of data.reviews) {
    if (!review || typeof review.name !== 'string' || typeof review.text !== 'string') throw new Error('Invalid review in Sanity.');
  }
  for (const credential of data.credentials) {
    if (!credential || typeof credential.title !== 'string' || typeof credential.institution !== 'string') throw new Error('Invalid credential in Sanity.');
  }
  if (data.privacyText.some(value => typeof value !== 'string')) throw new Error('Invalid privacy paragraph in Sanity.');
  return data;
}
