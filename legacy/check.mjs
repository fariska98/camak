import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const files=[];
const walk=dir=>{for(const e of readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(p.endsWith('.html'))files.push(p);}};walk(root);
let links=0;
for(const file of files){const html=readFileSync(file,'utf8');assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${file}: exactly one h1`);const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,`${file}: unique IDs`);for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){const href=match[1];if(!href.startsWith('/')&&!href.startsWith('#'))continue;const url=new URL(href,'http://localhost/'+path.relative(root,file).replaceAll('\\','/').replace(/index\.html$/,''));let target=path.join(root,decodeURIComponent(url.pathname));if(url.pathname.endsWith('/'))target=path.join(target,'index.html');assert.ok(existsSync(target),`Missing local target ${href} in ${file}`);if(url.hash&&target.endsWith('.html'))assert.ok(readFileSync(target,'utf8').includes(`id="${url.hash.slice(1)}"`),`Missing anchor ${href}`);links++;}assert.ok(!html.includes('ileeghana')&&!html.includes('+233'),'No unrelated contact details');}
console.log(`PASS: ${files.length} pages; ${links} local links/assets/anchors; unique IDs; headings; verified contact details.`);
