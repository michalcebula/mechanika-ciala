import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {siteSettings} from './schema';
import {SitePreview} from './SitePreview';
const projectId=process.env.SANITY_STUDIO_PROJECT_ID;
const dataset=process.env.SANITY_STUDIO_DATASET;
if(!projectId || !dataset) throw new Error('Set SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET in studio/.env');
export default defineConfig({
 name:'mechanika-ciala',
 title:'Mechanika Ciała — treści',
 projectId,
 dataset,
 plugins:[structureTool({structure:S=>S.list().title('Mechanika Ciała').items([
  S.listItem().id('siteSettings').title('Treści strony').child(
   S.document().id('siteSettings').schemaType('siteSettings').documentId('siteSettings').title('Treści strony')
    .views([
     S.view.form().id('editor').title('Edycja'),
     S.view.component(SitePreview).id('preview').title('Podgląd strony')
    ])
  )
 ])})],
 schema:{types:[siteSettings],templates:templates=>templates.filter(({schemaType})=>schemaType!=='siteSettings')},
 document:{
  actions:(actions,{schemaType})=>schemaType==='siteSettings'
   ? actions.filter(({action})=>action!=='delete'&&action!=='duplicate')
   : actions,
  newDocumentOptions:(options)=>options.filter(({templateId})=>templateId!=='siteSettings')
 }
});
