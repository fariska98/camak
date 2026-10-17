import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Check, ChevronRight, Copy, Mail, MapPin, MessageCircle, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { PageHero } from '../components/layout';
import { Eyebrow, Heading, Item, Reveal, Stagger } from '../components/ui';
import { services } from '../data';
import { contact, ease } from '../lib';

const initial = { firstName: '', lastName: '', email: '', phone: '', location: '', service: '', frequency: 'One-off clean', subject: 'Free cleaning quote', message: '', website: '' };
type Fields = typeof initial;
const required: (keyof Fields)[] = ['firstName', 'lastName', 'email', 'location', 'subject', 'message'];

export function ContactPage() {
  const location = useLocation();
  const reduced = useReducedMotion();
  const [fields, setFields] = useState(initial);
  const [step, setStep] = useState(1);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState(false);
  const [emailBody, setEmailBody] = useState('');
  const [copied, setCopied] = useState(false);
  const [hasBackend, setHasBackend] = useState(false);

  useEffect(() => setHasBackend(!!window.camakForm?.url), []);
  useEffect(() => {
    const service = new URLSearchParams(location.search).get('service');
    if (service && services.some(s => s.id === service)) setFields(f => ({ ...f, service }));
  }, [location.search]);

  const field = (name: keyof Fields) => ({
    name,
    id: name,
    value: fields[name],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setFields({ ...fields, [name]: e.target.value }),
  });

  const sendToBackend = async (form: NonNullable<Window['camakForm']>) => {
    setSending(true);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(form.url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ ...fields, action: 'camak_quote', nonce: form.nonce }),
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.data?.message || 'We could not send your enquiry. Please call or email Camak.');
      setStatus(result.data.message);
      setFields(initial);
      setStep(1);
    } catch (err) {
      setError(true);
      setStatus(err instanceof Error && err.name === 'AbortError'
        ? 'The request timed out. It may have reached Camak; please contact us before sending again.'
        : err instanceof Error ? err.message : 'Please contact Camak directly.');
    } finally {
      clearTimeout(timer);
      setSending(false);
    }
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    if (step === 1) {
      if (!fields.location.trim()) return;
      setStep(2);
      setStatus('');
      setTimeout(() => document.getElementById('firstName')?.focus(), reduced ? 0 : 320);
      return;
    }
    if (required.some(k => !fields[k].trim())) {
      setError(true);
      setStatus('Please complete the required fields with your details.');
      return;
    }
    if (fields.website) return;
    setStatus('');
    setError(false);
    if (window.camakForm?.url) return sendToBackend(window.camakForm);

    const service = services.find(s => s.id === fields.service)?.name || 'Help me choose';
    const body = `Hello Camak,\n\nI would like a cleaning quote.\n\nName: ${fields.firstName.trim()} ${fields.lastName.trim()}\nEmail: ${fields.email}\nPhone: ${fields.phone || 'Not provided'}\nLocation: ${fields.location}\nService: ${service}\nFrequency: ${fields.frequency}\n\n${fields.message.trim()}\n\nThank you!`;
    setEmailBody(body);
    setStatus('Your enquiry is ready. Send it from your email app to complete your request.');
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(fields.subject)}&body=${encodeURIComponent(body)}`;
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(emailBody); setCopied(true); }
    catch { setStatus('Select and copy the enquiry above, then paste it into your email.'); }
  };

  return (
    <>
      <PageHero label="Let’s talk cleaning" title="Your fresh start" accent="starts right here." description="Tell us a little about your space. We’ll get back to you with a free, no-obligation quote." />
      <section className="section contact-section">
        <div className="container contact-grid">
          <div className="contact-info">
            <Reveal y={16}><Eyebrow>A real team. A friendly hello.</Eyebrow></Reveal>
            <Heading lines={['Local people.']} accent="Ready to help." />
            <Reveal delay={0.2}><p>Big job or little refresh, we’d love to hear what you have in mind.</p></Reveal>
            <Stagger className="contact-methods">
              <Item className="contact-method">
                <span className="contact-icon"><Phone size={19} /></span>
                <div><span>Give us a call</span><a href={`tel:${contact.phone}`}>{contact.phoneIntl}</a><a href={`tel:${contact.phone2}`}>{contact.phone2Intl}</a></div>
              </Item>
              <Item className="contact-method">
                <span className="contact-icon"><Mail size={19} /></span>
                <div><span>Drop us a line</span><a href={`mailto:${contact.email}`}>{contact.email}</a></div>
              </Item>
              <Item className="contact-method">
                <span className="contact-icon"><MapPin size={19} /></span>
                <div>
                  <span>Close to home</span>
                  <p>Dee Street, Avenal<br />Invercargill, Southland, New Zealand</p>
                  <a className="link-arrow" href={contact.map} target="_blank" rel="noreferrer">View the area <ArrowUpRight size={15} /></a>
                </div>
              </Item>
              <Item>
                <a className="contact-whatsapp" href={contact.whatsapp} target="_blank" rel="noreferrer">
                  <MessageCircle size={22} /><span>A quick question?<strong>Let’s chat on WhatsApp</strong></span><ArrowUpRight size={20} />
                </a>
              </Item>
            </Stagger>
          </div>

          <Reveal className="quote-card" delay={0.1}>
            <div className="quote-card-top"><span className="quote-spark"><Sparkles size={18} /></span><span>Your space. Your free quote.</span></div>
            <h2>Let’s find your perfect clean.</h2>
            <div className="form-steps" aria-label={`Step ${step} of 2`}>
              <span className={step === 1 ? 'active' : 'done'}><i>{step > 1 ? <Check size={13} strokeWidth={3} /> : 1}</i>Your space</span>
              <div className="form-steps-bar"><motion.span animate={{ scaleX: step === 2 ? 1 : 0 }} transition={{ duration: 0.5, ease }} /></div>
              <span className={step === 2 ? 'active' : ''}><i>2</i>Your details</span>
            </div>
            <form id="quote-form" onSubmit={submit}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.28, ease }}>
                  {step === 1 ? (
                    <>
                      <div className="field">
                        <label htmlFor="service">What can we help with? *</label>
                        <select {...field('service')} required>
                          <option value="">Choose your service</option>
                          {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          <option value="not-sure">Help me choose</option>
                        </select>
                      </div>
                      <div className="field">
                        <label htmlFor="frequency">How often would you like a clean?</label>
                        <select {...field('frequency')}>
                          {['One-off clean', 'Weekly', 'Fortnightly', 'Monthly', 'Let’s discuss'].map(f => <option key={f}>{f}</option>)}
                        </select>
                      </div>
                      <div className="field">
                        <label htmlFor="location">Your suburb or location *</label>
                        <input {...field('location')} required maxLength={150} autoComplete="address-level2" placeholder="e.g. Avenal, Invercargill" />
                      </div>
                      <div className="form-hint"><ShieldCheck size={18} /><p>No commitment. Just a friendly conversation about what you need.</p></div>
                    </>
                  ) : (
                    <>
                      <div className="form-row">
                        <div className="field"><label htmlFor="firstName">First name *</label><input {...field('firstName')} required maxLength={80} autoComplete="given-name" placeholder="First name" /></div>
                        <div className="field"><label htmlFor="lastName">Last name *</label><input {...field('lastName')} required maxLength={80} autoComplete="family-name" placeholder="Last name" /></div>
                      </div>
                      <div className="field"><label htmlFor="email">Email address *</label><input {...field('email')} type="email" required maxLength={180} autoComplete="email" placeholder="you@example.com" /></div>
                      <div className="field"><label htmlFor="phone">Phone number <span>(optional)</span></label><input {...field('phone')} type="tel" maxLength={40} autoComplete="tel" placeholder="Your best contact number" /></div>
                      <div className="field"><label htmlFor="subject">Subject *</label><input {...field('subject')} required maxLength={150} /></div>
                      <div className="field"><label htmlFor="message">A little about your space *</label><textarea {...field('message')} required maxLength={4000} rows={4} placeholder="Tell us about your space, the clean you need and any preferred dates." /></div>
                      <p className="form-note">
                        {hasBackend ? 'Your enquiry is sent to Camak to discuss your cleaning needs. It does not confirm a booking.' : 'This preview prepares an email in your email app. Review it and press Send to contact Camak.'}{' '}
                        <Link to="/privacy-policy/">Privacy information</Link>
                      </p>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
              <div className="honeypot" aria-hidden="true"><label htmlFor="website">Leave this empty</label><input {...field('website')} tabIndex={-1} autoComplete="off" /></div>
              <div className="form-buttons">
                {step === 2 && <button type="button" className="back-button" onClick={() => setStep(1)} disabled={sending}>Back</button>}
                <button className="btn btn-solid form-submit" type="submit" disabled={sending}>
                  <span>{step === 1 ? 'Next, your details' : sending ? 'Sending your enquiry…' : hasBackend ? 'Request my free quote' : 'Prepare my quote email'}</span>
                  <span className="btn-icon">{step === 1 ? <ChevronRight size={18} /> : <ArrowUpRight size={18} />}</span>
                </button>
              </div>
              <p className={`form-status ${error ? 'error' : ''}`} role="status" aria-live="polite">{status}</p>
              {emailBody && (
                <div className="email-fallback">
                  <p>Your message hasn’t been sent by this website. If your email app didn’t open, copy your enquiry and email <a href={`mailto:${contact.email}`}>{contact.email}</a>.</p>
                  <textarea value={emailBody} readOnly aria-label="Prepared enquiry" />
                  <button type="button" className="copy-button" onClick={copy}>{copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied' : 'Copy enquiry'}</button>
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
