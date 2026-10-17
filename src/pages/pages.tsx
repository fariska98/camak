import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BookOpen, Leaf, Search } from 'lucide-react';
import { Accordion, CTA, PageHero } from '../components/layout';
import { Button, Eyebrow, Heading, Reveal, Spotlight, Ticks } from '../components/ui';
import { Difference, FaqPreview, Hero, MarqueeBand, Process, ServiceCards, ServiceExplorer, Story, Testimonial } from '../sections/sections';
import { faqs } from '../data';
import { contact, ease, media } from '../lib';

export function HomePage() {
  return (
    <>
      <Hero />
      <MarqueeBand />
      <ServiceCards />
      <Story />
      <Difference />
      <Process />
      <Testimonial />
      <FaqPreview />
      <CTA />
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <PageHero label="Our story" title="Local roots." accent="A little more heart." description="Professional cleaning. Personal care. Meet the locally based team looking after homes and businesses across Southland." />
      <Story full />
      <section className="section values">
        <div className="container values-grid">
          <Spotlight className="value-card">
            <Eyebrow>Our mission</Eyebrow>
            <Heading lines={['Better spaces.']} accent="Better days." />
            <p>To deliver reliable, high-quality cleaning that makes Invercargill and Southland homes and businesses healthier, more productive and more enjoyable — every visit.</p>
          </Spotlight>
          <Spotlight className="value-card dark" delay={0.1}>
            <Eyebrow light>Our vision</Eyebrow>
            <Heading lines={['Care that earns']} accent="your confidence." />
            <p>To be Southland’s trusted cleaning partner, known for friendliness, integrity, eco-conscious practices and the attention to detail our clients can rely on.</p>
          </Spotlight>
        </div>
      </section>
      <Difference />
      <CTA />
    </>
  );
}

export function ServicesPage() {
  return (
    <>
      <PageHero label="Our services" title="Every space." accent="A fresh possibility." description="Explore our four cleaning services. Choose the one that suits your space, and we’ll take care of the details." />
      <ServiceExplorer />
      <MarqueeBand />
      <Process />
      <CTA />
    </>
  );
}

const categories = ['All', 'Services', 'Bookings', 'Locations'];

export function FAQPage() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const term = search.toLowerCase();
  const filtered = faqs.filter(([cat, q, a]) => (category === 'All' || cat === category) && `${q} ${a}`.toLowerCase().includes(term));
  return (
    <>
      <PageHero label="FAQs" title="Before we clean," accent="let’s clear things up." description="A few helpful answers about our services, booking a clean and caring for your space." />
      <section className="section">
        <div className="container faq-container">
          <Reveal className="faq-tools">
            <div className="faq-filters" role="group" aria-label="Filter questions">
              {categories.map(cat => (
                <button key={cat} aria-pressed={category === cat} onClick={() => setCategory(cat)}>
                  {category === cat && <motion.span layoutId="faq-filter" className="filter-active" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                  <span>{cat}</span>
                </button>
              ))}
            </div>
            <label className="search-field">
              <Search size={18} />
              <input type="search" aria-label="Search questions" value={search} onChange={e => setSearch(e.target.value)} placeholder="Find your answer…" />
            </label>
          </Reveal>
          <p className="results-count" aria-live="polite">{filtered.length} questions</p>
          <motion.div layout className="accordion-list">
            <AnimatePresence mode="popLayout" initial={false}>
              {filtered.map(([, q, a]) => (
                <motion.div layout key={q} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.3, ease }}>
                  <Accordion question={q} answer={a} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          {!filtered.length && (
            <div className="empty-state">
              <Search size={34} />
              <h2>No matching questions.</h2>
              <p>Try a different search or talk to our friendly team.</p>
              <Button to="/contact-us/" className="btn-solid">Let’s talk</Button>
            </div>
          )}
        </div>
      </section>
      <CTA />
    </>
  );
}

export function SustainabilityPage() {
  return (
    <>
      <PageHero label="A thoughtful approach" title="Fresh spaces." accent="A lighter footprint." description="We care about the place we call home. That care is part of the way we clean." />
      <section className="section">
        <div className="container split-grid">
          <Reveal className="feature-photo">
            <img src={media('hero.jpg')} width="1920" height="1080" alt="Camak cleaning a bright interior with living greenery" />
            <div className="feature-photo-tag"><Leaf size={18} /><span>Thoughtful by nature.</span></div>
          </Reveal>
          <div className="story-copy">
            <Reveal y={16}><Eyebrow>Care beyond the clean</Eyebrow></Reveal>
            <Heading lines={['Small choices.']} accent="Made with care." />
            <Reveal delay={0.2}>
              <p className="lead">Our approach brings together eco-conscious cleaning practices and product options that suit the people who use your space.</p>
              <p>Tell us about children, pets, sensitivities or specific preferences. We’ll discuss the products and methods that work for your clean.</p>
            </Reveal>
            <Ticks items={['Eco-friendly product options on request', 'Care for homes, workplaces and indoor air quality', 'A considered approach to our local environment']} />
            <Reveal delay={0.3}><Button to="/contact-us/?service=eco-friendly" className="btn-solid">Find your greener clean</Button></Reveal>
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}

export function BlogPage() {
  return (
    <>
      <PageHero label="The Camak journal" title="Fresh ideas." accent="For everyday living." description="Cleaning tips and updates from your local Camak team." />
      <section className="section">
        <div className="container">
          <Reveal className="empty-state large">
            <motion.span className="empty-icon" animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}><BookOpen size={36} /></motion.span>
            <Eyebrow>A fresh page</Eyebrow>
            <Heading lines={['Good things are']} accent="on their way." />
            <p>There are no articles published yet. In the meantime, discover our services or get answers to your cleaning questions.</p>
            <Button to="/faq/" className="btn-solid">Explore our FAQs</Button>
          </Reveal>
        </div>
      </section>
      <CTA />
    </>
  );
}

export function InfoPage({ terms = false }: { terms?: boolean }) {
  const [wordpress, setWordpress] = useState(false);
  useEffect(() => setWordpress(!!window.camakRuntime?.wordpress), []);
  const email = <a href={`mailto:${contact.email}`}>{contact.email}</a>;
  return (
    <>
      <PageHero
        label={terms ? 'Service information' : 'Privacy information'}
        title={terms ? 'Clear expectations.' : 'Your information.'}
        accent={terms ? 'From the first hello.' : 'Handled thoughtfully.'}
        description={terms ? 'Talk to our team about your quote and service arrangements.' : 'How this redesigned website handles enquiries and privacy preferences.'}
      />
      <section className="section">
        <Reveal className="container prose">
          {terms ? (
            <>
              <h2>Your quote and booking</h2>
              <p>Sending an enquiry requests a quote. It does not confirm a booking, reserve a date or take a payment. Camak will discuss your requirements and availability with you.</p>
              <h2>Confirming the details</h2>
              <p>Before booking, ask our team to confirm the agreed work, price, access arrangements, payment terms and any cancellation conditions. These depend on your service arrangement with Camak.</p>
              <h2>Current terms of service</h2>
              <p>To request Camak’s current terms, email {email} or call <a href={`tel:${contact.phone}`}>{contact.phoneIntl}</a>.</p>
              <p>The existing website did not provide published terms text. This page is not a replacement for Camak’s approved service terms.</p>
            </>
          ) : (
            <>
              <h2>Contacting Camak</h2>
              <p>The quote form asks for your name, email address, location and cleaning needs. Your phone number is optional. Please only include the information needed to discuss your request.</p>
              <h2>How your enquiry works</h2>
              {wordpress
                ? <p>The form sends your enquiry to Camak’s email address through the website’s configured mail service. The theme does not create an enquiry database. A temporary hashed network identifier helps limit repeated submissions; hosting and mail services may retain technical logs and messages.</p>
                : <p>This preview prepares your enquiry in your email app. It does not submit or save your enquiry on a server. You choose whether to send the message to Camak.</p>}
              <h2>Privacy preferences</h2>
              <p>This redesign does not add analytics or advertising trackers. It stores your chosen privacy preferences in your browser. You can reopen the controls from the footer or clear your browser’s site data.</p>
              <h2>External services</h2>
              <p>WhatsApp, Google Maps and email links open external services with their own privacy practices. The hosting service may process technical access information to serve and secure the website.</p>
              <h2>Questions about your information</h2>
              <p>Contact {email} for Camak’s current business privacy policy or questions about information you have shared.</p>
              <p>This page describes the redesign’s behaviour. Camak’s complete approved business privacy policy is needed before the replacement website goes live.</p>
            </>
          )}
          <Button to="/contact-us/" className="btn-solid">Contact Camak</Button>
        </Reveal>
      </section>
    </>
  );
}

export function NotFound() {
  return (
    <>
      <PageHero label="Page not found" title="A little off track?" accent="Let’s start fresh." description="We couldn’t find this page. Your next clean is still just a click away." />
      <section className="section"><div className="container"><Button to="/" className="btn-solid">Back to home</Button></div></section>
    </>
  );
}
