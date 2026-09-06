import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {siteSettings} from './schema';
const projectId=process.env.SANITY_STUDIO_PROJECT_ID;
const dataset=process.env.SANITY_STUDIO_DATASET;
if(!projectId || !dataset) throw new Error('Set SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET in studio/.env');
export default defineConfig({name:'mechanika-ciala',title:'Mechanika Ciała — treści',projectId,dataset,plugins:[structureTool()],schema:{types:[siteSettings]}});
