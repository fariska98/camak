import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { render } from '../.ssr/entry-server.js';
const pages=[['/','A fresh feeling, every day'],['/about-us/','Our story'],['/services/','Our services'],['/contact-us/','Get a free quote'],['/faq/','Frequently asked questions'],['/blog/','Our journal'],['/sustainability/','Sustainability'],['/privacy-policy/','Privacy information'],['/terms-of-service/','Service information']];
const shell=readFileSync('dist/index.html','utf8');
for(const [route,title] of pages){const dir=`dist${route}`;mkdirSync(dir,{recursive:true});writeFileSync(`${dir}index.html`,shell.replace('<!--app-html-->',render(route)).replace(/<title>.*?<\/title>/,`<title>${title} | Camak Services</title>`));}
writeFileSync('dist/404.html',shell.replace('<!--app-html-->',render('/not-found/')).replace(/<title>.*?<\/title>/,'<title>Page not found | Camak Services</title>'));
writeFileSync('dist/robots.txt','User-agent: *\nDisallow: /\n');
console.log(`Prerendered ${pages.length} React pages and a 404 page.`);
