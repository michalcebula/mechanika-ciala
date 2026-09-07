import {readFile,access} from 'node:fs/promises';
import assert from 'node:assert/strict';
import config from '../astro.config.mjs';
import {currentNavValue} from '../src/lib/navigation.mjs';
const base = (config.base || '/').replace(/\/$/, '') + '/';
const pages=['index.html','o-mnie/index.html','kontakt/index.html','prywatnosc/index.html','404.html'];
let sharedHeader;
let sharedStyles;
for(const path of pages){
 const html=await readFile('dist/'+path,'utf8');
 const header=html.match(/<header\b[^>]*>[\s\S]*?<\/header>/)?.[0].replace(/ aria-current="[^"]*"/g,'');
 assert(header, `Header exists: ${path}`);
 const styles=[...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)].map(m=>m[0]);
 if(sharedHeader) {
  assert.equal(header,sharedHeader,`Shared navigation: ${path}`);
  assert.deepEqual(styles,sharedStyles,`Shared stylesheet: ${path}`);
 } else {sharedHeader=header;sharedStyles=styles;}
 assert.match(html,/<html lang="pl"/);
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`one h1: ${path}`);
 assert.match(html,/<meta name="description"/);
 assert.match(html,/id="tresc"/);
 assert(!html.includes('<iframe'), 'No third-party embeds before consent');
 assert(!html.includes('Ponad 300') && !html.includes('+48 123 456 789'),'No invented data');
 for(const [,url] of html.matchAll(/(?:src|href)="(\/[^"#]*)"/g)){
  assert(url.startsWith(base), `URL must use configured base ${base}: ${url}`);
  const clean=url.slice(base.length).split(/[?#]/)[0];
  await access('dist/'+clean+(!clean || clean.endsWith('/')?'index.html':''));
 }
}
for(const name of ['kamil','terapia','gabinet','terapia-szyi']){
 const data=await readFile(`public/images/${name}.jpg`);
 assert(data.length>10000 && data[0]===255 && data[1]===216,`Valid JPEG: ${name}`);
}
await access('dist/robots.txt');await access('dist/sitemap.xml');
console.log('PASS: 5 pages, local links/assets, Polish language, headings, metadata, JPEGs, privacy-safe embeds.');

const origin='https://example.com';
for(const prefix of ['/', '/mechanika-ciala/']) {
 const links=[prefix,prefix+'#jak-pomagam',prefix+'o-mnie/',prefix+'kontakt/'];
 for(const [location,expected] of [
  [prefix,['page',undefined,undefined,undefined]],
  [prefix+'#jak-pomagam',[undefined,'location',undefined,undefined]],
  [prefix+'o-mnie/',[undefined,undefined,'page',undefined]],
  [prefix+'o-mnie',[undefined,undefined,'page',undefined]],
  [prefix+'kontakt/',[undefined,undefined,undefined,'page']],
  [prefix+'#tresc',['page',undefined,undefined,undefined]],
  [prefix+'prywatnosc/',[undefined,undefined,undefined,undefined]],
 ]) assert.deepEqual(links.map(link=>currentNavValue(link,origin+location)),expected,location);
}
console.log('PASS: shared navigation/styles on all pages, active page and section with and without base path.');
