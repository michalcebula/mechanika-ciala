import {readFile,access} from 'node:fs/promises';
import assert from 'node:assert/strict';
const pages=['index.html','o-mnie/index.html','kontakt/index.html','prywatnosc/index.html','404.html'];
for(const path of pages){
 const html=await readFile('dist/'+path,'utf8');
 assert.match(html,/<html lang="pl"/);
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`one h1: ${path}`);
 assert.match(html,/<meta name="description"/);
 assert.match(html,/id="tresc"/);
 assert(!html.includes('<iframe'), 'No third-party embeds before consent');
 assert(!html.includes('Ponad 300') && !html.includes('+48 123 456 789'),'No invented data');
 for(const [,url] of html.matchAll(/(?:src|href)="(\/[^"#]*)"/g)){
  const clean=url.split('#')[0]; if(!clean)continue;
  await access('dist'+clean+(clean.endsWith('/')?'index.html':''));
 }
}
for(const name of ['kamil','terapia','gabinet','terapia-szyi']){
 const data=await readFile(`public/images/${name}.jpg`);
 assert(data.length>10000 && data[0]===255 && data[1]===216,`Valid JPEG: ${name}`);
}
await access('dist/robots.txt');await access('dist/sitemap.xml');
console.log('PASS: 5 pages, local links/assets, Polish language, headings, metadata, JPEGs, privacy-safe embeds.');
