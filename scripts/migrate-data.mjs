import {readFileSync,writeFileSync} from 'node:fs';
import vm from 'node:vm';
const old=readFileSync('legacy/build.mjs','utf8');
const extract=name=>vm.runInNewContext(old.match(new RegExp(`const ${name}=(\\[[\\s\\S]*?\\n\\]);`))[1]);
const faqs=extract('faqs');const services=extract('services');
writeFileSync('src/data.ts',`export type Service = {id:string;name:string;image:string;alt:string;intro:string;desc:string;items:string[]};\nexport const services:Service[] = ${JSON.stringify(services,null,2)};\nexport const faqs:[string,string,string][] = ${JSON.stringify(faqs,null,2)};\nexport const routes = ['/', '/about-us/', '/services/', '/contact-us/', '/faq/', '/sustainability/', '/blog/', '/privacy-policy/', '/terms-of-service/'];\n`);
