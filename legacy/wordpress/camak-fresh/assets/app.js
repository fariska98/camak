(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  function closeMenu() { nav?.classList.remove('is-open'); menuButton?.setAttribute('aria-expanded','false'); menuButton?.setAttribute('aria-label','Open menu'); }
  menuButton?.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; nav.classList.toggle('is-open',open); menuButton.setAttribute('aria-expanded',String(open)); menuButton.setAttribute('aria-label',open?'Close menu':'Open menu'); });
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{ if(e.key==='Escape' && nav?.classList.contains('is-open')){closeMenu();menuButton.focus();} });
  document.addEventListener('click',e=>{ if(!e.target.closest('.site-header'))closeMenu(); });
  matchMedia('(min-width: 681px)').addEventListener('change',e=>{if(e.matches)closeMenu();});

  const search=document.querySelector('#faq-search');
  let category='All';
  const filterFaq=()=>{let count=0; const term=search.value.trim().toLowerCase();document.querySelectorAll('details[data-category]').forEach(detail=>{const show=(category==='All'||detail.dataset.category===category)&&detail.textContent.toLowerCase().includes(term);detail.hidden=!show;if(show)count++;});document.querySelector('#no-results').hidden=count!==0;document.querySelector('#faq-count').textContent=`${count} matching questions`;};
  search?.addEventListener('input',filterFaq);
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));filterFaq();}));

  const storageKey='camak-privacy-v1';
  const readPreference=()=>{try{return JSON.parse(localStorage.getItem(storageKey));}catch{return null;}};
  const banner=document.querySelector('#cookie-banner');
  const dialog=document.querySelector('#cookie-dialog');
  const categories=['functional','analytics','advertising'];
  const savePreference=p=>{try{localStorage.setItem(storageKey,JSON.stringify({essential:true,...p,savedAt:new Date().toISOString()}));}catch{}if(banner)banner.hidden=true;dialog?.close();};
  if(banner)banner.hidden=!!readPreference();
  document.querySelectorAll('[data-consent]').forEach(b=>b.addEventListener('click',()=>savePreference(Object.fromEntries(categories.map(c=>[c,b.dataset.consent==='all'])))));
  document.querySelectorAll('[data-cookie-settings]').forEach(b=>b.addEventListener('click',()=>{const p=readPreference();categories.forEach(c=>{document.querySelector(`#cookie-${c}`).checked=!!p?.[c];});dialog.showModal();}));
  document.querySelector('.dialog-close')?.addEventListener('click',()=>dialog.close());
  dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  document.querySelector('#save-preferences')?.addEventListener('click',()=>savePreference(Object.fromEntries(categories.map(c=>[c,document.querySelector(`#cookie-${c}`).checked]))));

  const form=document.querySelector('#quote-form');
  if(!form)return;
  const service=document.querySelector('#service');
  const requestedService=new URLSearchParams(location.search).get('service');
  if([...service.options].some(o=>o.value===requestedService))service.value=requestedService;
  const config=window.camakForm;
  if(config?.url){document.querySelector('#submit-label').textContent='Request my free quote';document.querySelector('#form-delivery-note').textContent='Your enquiry is sent to Camak to discuss your cleaning needs. Sending an enquiry does not confirm a booking.';}
  const status=document.querySelector('#form-status');
  const submit=form.querySelector('[type=submit]');
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(!form.reportValidity())return;
    const data=Object.fromEntries(new FormData(form));if(data.website)return;
    const fields=['firstName','lastName','email','location','subject','message'];
    if(fields.some(k=>!data[k]?.trim())){status.className='form-status error';status.textContent='Please complete all required fields with your details.';return;}
    const serviceName=service.selectedOptions[0].textContent;
    if(config?.url){
      submit.disabled=true;status.className='form-status';status.textContent='Sending your enquiry…';
      const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),20000);
      try{
        const response=await fetch(config.url,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({...data,action:'camak_quote',nonce:config.nonce}),signal:controller.signal});
        const result=await response.json();if(!response.ok||!result.success)throw new Error(result.data?.message||'We could not send your enquiry. Please call or email us directly.');
        status.className='form-status success';status.textContent=result.data.message;form.reset();
      }catch(error){status.className='form-status error';status.textContent=error.name==='AbortError'?'The request timed out. Your message may have reached us; please contact Camak before sending again.':error.message;}finally{clearTimeout(timeout);submit.disabled=false;}
      return;
    }
    const body=`Hello Camak,\n\nI would like a cleaning quote.\n\nName: ${data.firstName.trim()} ${data.lastName.trim()}\nEmail: ${data.email.trim()}\nPhone: ${data.phone.trim()||'Not provided'}\nLocation: ${data.location.trim()}\nService: ${serviceName}\nFrequency: ${data.frequency}\n\n${data.message.trim()}\n\nThank you!`;
    document.querySelector('#email-copy').value=body;document.querySelector('#form-followup').hidden=false;status.className='form-status';status.textContent='Your enquiry is ready. Send it from your email app to complete your request.';
    window.location.href=`mailto:info@camakservices.co.nz?subject=${encodeURIComponent(data.subject.trim())}&body=${encodeURIComponent(body)}`;
  });
  document.querySelector('#copy-enquiry')?.addEventListener('click',async event=>{const button=event.currentTarget;const field=document.querySelector('#email-copy');try{await navigator.clipboard.writeText(field.value);button.textContent='Enquiry copied';}catch{field.focus();field.select();status.textContent='Select and copy the enquiry above, then paste it into your email.';}});
})();
