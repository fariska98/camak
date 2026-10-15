import {spawn} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const qa=path.join(root,'.qa');mkdirSync(qa,{recursive:true});
const edge=spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--disable-background-networking','--remote-debugging-port=9226',`--user-data-dir=${path.join(qa,'browser')}`,'about:blank'],{windowsHide:true,stdio:'ignore'});
const delay=ms=>new Promise(r=>setTimeout(r,ms));
let socket;
try{
 let tabs;
 for(let i=0;i<60;i++){try{tabs=await(await fetch('http://127.0.0.1:9226/json')).json();break;}catch{await delay(200);}}
 assert.ok(tabs?.length,'Browser CDP started');
 socket=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true});});
 let id=0;const pending=new Map();const errors=[];
 socket.addEventListener('close',event=>{for(const entry of pending.values())entry.reject(new Error(`CDP closed ${event.code}: ${event.reason}`));pending.clear();});
 socket.addEventListener('message',event=>{const message=JSON.parse(event.data);if(message.id){const entry=pending.get(message.id);if(entry){pending.delete(message.id);message.error?entry.reject(new Error(JSON.stringify(message.error))):entry.resolve(message.result);}}if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails.text);});
 const send=(method,params={})=>new Promise((resolve,reject)=>{const requestId=++id;pending.set(requestId,{resolve,reject});socket.send(JSON.stringify({id:requestId,method,params}));});
 const evaluate=async(expression)=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 await send('Page.enable');await send('Runtime.enable');
 const navigate=async(route)=>{await send('Page.navigate',{url:'http://127.0.0.1:4173'+route});for(let i=0;i<50;i++){await delay(100);if(await evaluate('document.readyState === "complete"'))break;}await evaluate('document.fonts.ready.then(()=>true)');await evaluate('Promise.all([...document.images].map(i=>{i.loading="eager";return i.decode().catch(()=>{});})).then(()=>true)');};
 const screenshot=async(name,full=false)=>{const data=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:full});writeFileSync(path.join(qa,name),Buffer.from(data.data,'base64'));};
 await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 await navigate('/');await evaluate('document.querySelector("[data-consent=essential]").click()');await screenshot('desktop-home.png');
 const routes=['/','/services/','/about-us/','/contact-us/','/faq/','/sustainability/','/blog/','/privacy-policy/','/terms-of-service/'];
 const report=[];
 for(const route of routes){await navigate(route);const result=await evaluate(`({title:document.title,h1:document.querySelectorAll('h1').length,overflow:document.documentElement.scrollWidth>innerWidth,brokenImages:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src)})`);assert.equal(result.h1,1,route);assert.equal(result.overflow,false,route+' desktop overflow');assert.deepEqual(result.brokenImages,[],route+' images');report.push({route,...result});}
 await navigate('/faq/');await evaluate(`document.querySelector('[data-filter="Bookings"]').click()`);assert.equal(await evaluate(`document.querySelectorAll('details:not([hidden])').length`),5,'Booking filter');await evaluate(`document.querySelector('#faq-search').value='zzzz';document.querySelector('#faq-search').dispatchEvent(new Event('input'))`);assert.equal(await evaluate(`document.querySelector('#no-results').hidden`),false);await evaluate(`document.querySelector('#faq-search').value='';document.querySelector('#faq-search').dispatchEvent(new Event('input'));document.querySelector('details:not([hidden]) summary').click()`);assert.equal(await evaluate(`document.querySelector('details:not([hidden])').open`),true);
 await navigate('/contact-us/?service=commercial');assert.equal(await evaluate(`document.querySelector('#service').value`),'commercial');assert.equal(await evaluate(`document.querySelector('#quote-form').checkValidity()`),false);
 // Simulate the WordPress transport. No business email or live form is submitted.
 await send('Page.addScriptToEvaluateOnNewDocument',{source:`window.camakForm={url:'/test-only',nonce:'test'};window.fetch=async()=>({ok:true,json:async()=>({success:true,data:{message:'Test transport accepted'}})});`});
 await navigate('/contact-us/?service=residential');await evaluate(`for(const [name,value] of Object.entries({firstName:'Test',lastName:'Visitor',email:'test@example.com',location:'Invercargill',message:'QA simulation only'})){document.querySelector('[name="'+name+'"]').value=value;}document.querySelector('#quote-form').requestSubmit()`);await delay(100);assert.equal(await evaluate(`document.querySelector('#form-status').textContent`),'Test transport accepted');
 await evaluate(`window.fetch=async()=>({ok:false,json:async()=>({success:false,data:{message:'Test delivery error'}})});for(const [name,value] of Object.entries({firstName:'Test',lastName:'Visitor',email:'test@example.com',location:'Invercargill',message:'QA simulation only',service:'residential'})){document.querySelector('[name="'+name+'"]').value=value;}document.querySelector('#quote-form').requestSubmit()`);await delay(100);assert.equal(await evaluate(`document.querySelector('#form-status').textContent`),'Test delivery error');assert.equal(await evaluate(`document.querySelector('[name=message]').value`),'QA simulation only');
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 for(const route of routes){await navigate(route);assert.equal(await evaluate('document.documentElement.scrollWidth>innerWidth'),false,route+' mobile overflow');}
 await navigate('/');await screenshot('mobile-home.png');await evaluate(`document.querySelector('.menu-toggle').click()`);assert.equal(await evaluate(`document.querySelector('.menu-toggle').getAttribute('aria-expanded')`),'true');await screenshot('mobile-menu.png');await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});assert.equal(await evaluate(`document.querySelector('.menu-toggle').getAttribute('aria-expanded')`),'false');
 await evaluate(`document.querySelector('[data-cookie-settings]').click();document.querySelector('#cookie-analytics').checked=true;document.querySelector('#save-preferences').click()`);assert.equal(await evaluate(`JSON.parse(localStorage.getItem('camak-privacy-v1')).analytics`),true);
 await navigate('/contact-us/');await screenshot('mobile-contact.png');await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await navigate('/');await evaluate(`window.scrollTo(0,800)`);await screenshot('desktop-services.png');
 for(const width of [320,768,1024]){await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<681});for(const route of ['/','/services/','/contact-us/','/faq/']){await navigate(route);assert.equal(await evaluate('document.documentElement.scrollWidth>innerWidth'),false,route+' overflow at '+width);}}
 assert.deepEqual(errors,[],'No browser JavaScript exceptions');
 writeFileSync(path.join(qa,'browser-report.json'),JSON.stringify({pages:report,mobileWidth:390,checks:['desktop and mobile layout','all image loads','FAQ filtering and search','FAQ expansion','service preselection','required form validation','simulated form success and failure','mobile menu and Escape','privacy preferences persistence'],errors},null,2));
 console.log('PASS: 9 desktop and mobile pages, images, FAQs, navigation, form validation and simulated transport, privacy preferences. Screenshots in .qa/.');
 await send('Browser.close');
}finally{socket?.close();edge.kill();}
