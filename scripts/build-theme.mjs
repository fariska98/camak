import {cpSync,mkdirSync,writeFileSync} from 'node:fs';
import {pages,header,footer} from './build.mjs';
const root=new URL('../wordpress/camak-fresh/',import.meta.url);
mkdirSync(root,{recursive:true});mkdirSync(new URL('partials/',root),{recursive:true});
cpSync(new URL('../dist/assets/',import.meta.url),new URL('assets/',root),{recursive:true});
for(const [slug,,html] of pages){
 let content=html;
 if(slug==='privacy-policy')content=content.replace('<h2>How this preview works</h2><p>The preview prepares your enquiry in your email app. It does not submit or save the enquiry on a server. You choose whether to send the email to Camak at <a href="mailto:info@camakservices.co.nz">info@camakservices.co.nz</a>.</p>','<h2>How your enquiry is sent</h2><p>The form sends your enquiry to Camak’s email address using the website’s configured email service. The theme does not create a separate enquiry database. The hosting provider or email service may retain technical logs and delivered messages. A temporary, hashed network identifier is used to limit repeated form submissions.</p>').replace('The published preview’s hosting service','The website’s hosting service');
 writeFileSync(new URL(`partials/${slug||'home'}.html`,root),content);
}
writeFileSync(new URL('partials/header.html',root),header('__wordpress__'));
writeFileSync(new URL('partials/footer.html',root),footer());
console.log('WordPress theme assets and page partials prepared.');
