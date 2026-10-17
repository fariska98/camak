import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';
import { ArrowUpRight, Building2, CalendarDays, Check, HeartHandshake, Home as HomeIcon, Leaf, MapPin, MessageSquareText, ShieldCheck, Sparkles } from 'lucide-react';
import { Accordion } from '../components/layout';
import { Bubbles, Button, CircleBadge, clipUp, Eyebrow, Heading, Item, Marquee, Reveal, RotatingWord, SectionHead, Spotlight, Stagger, Ticks } from '../components/ui';
import { faqs, services } from '../data';
import { ease, media } from '../lib';

const serviceIcons = [HomeIcon, Building2, Leaf, Sparkles];

export function Hero() {
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 900], [0, 120]);
  const imageScale = useTransform(scrollY, [0, 900], [1.04, 1.16]);
  const copyY = useTransform(scrollY, [0, 700], [0, -70]);
  const enter = (delay: number) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.85, delay, ease } });

  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true"><span className="aurora a1" /><span className="aurora a2" /><span className="aurora a3" /><span className="hero-grid" /></div>
      <Bubbles />
      <div className="container hero-inner">
        <motion.div className="hero-copy" style={{ y: copyY }}>
          <motion.div data-reveal className="hero-badge" {...enter(0.1)}><span className="pulse-dot" />Your local Southland cleaning team</motion.div>
          <Heading as="h1" className="hero-title" lines={['A cleaner space.', 'A brighter']} accent="everyday." delay={0.2} />
          <motion.p data-reveal className="hero-lead" {...enter(0.75)}>
            Thoughtful care for your <RotatingWord words={['home.', 'workplace.', 'windows.', 'fresh start.']} /><br />
            Less time cleaning. More time living.
          </motion.p>
          <motion.div data-reveal className="hero-actions" {...enter(0.9)}>
            <Button to="/contact-us/" className="btn-lime">Get my free quote</Button>
            <Link to="/about-us/" className="link-arrow light">Meet your local team <ArrowUpRight size={17} /></Link>
          </motion.div>
          <motion.div data-reveal className="hero-proof" {...enter(1.05)}>
            <span className="proof-icon"><ShieldCheck size={19} /></span>
            <div><strong>Good people. Great attention to detail.</strong><span>Your space is in caring hands.</span></div>
          </motion.div>
        </motion.div>

        <div className="hero-visual">
          <motion.div data-reveal className="hero-photo" initial={{ clipPath: 'inset(100% 0% 0% 0% round 32px)' }} animate={{ clipPath: 'inset(0% 0% 0% 0% round 32px)' }} transition={{ duration: 1.3, delay: 0.15, ease }}>
            <motion.img src={media('hero.jpg')} alt="Camak cleaning professional caring for a bright modern interior" width="1920" height="1080" fetchPriority="high" style={{ y: imageY, scale: imageScale }} />
          </motion.div>
          <motion.div data-reveal className="float-card fc-main" initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, delay: 1.1, ease }}>
            <div className="bob">
              <span className="fc-icon"><Sparkles size={20} /></span>
              <div><strong>That just-cleaned feeling.</strong><span>We’ll take it from here.</span></div>
              <span className="fc-check"><Check size={14} strokeWidth={3} /></span>
            </div>
          </motion.div>
          <motion.div data-reveal className="float-card fc-chip" initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, delay: 1.3, ease }}>
            <div className="bob slow"><Leaf size={17} /><span>Eco-conscious care</span></div>
          </motion.div>
          <motion.div data-reveal className="hero-circle" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 1.2, ease }}>
            <CircleBadge text="LOCAL ROOTS • A FRESH APPROACH • INVERCARGILL NZ • "><Leaf size={26} /></CircleBadge>
          </motion.div>
        </div>
      </div>
      <QuickBook />
    </section>
  );
}

const quickOptions = [
  { id: 'residential', label: 'For my home', Icon: HomeIcon },
  { id: 'commercial', label: 'For my business', Icon: Building2 },
  { id: 'specialised', label: 'Something specific', Icon: Sparkles },
];

function QuickBook() {
  const navigate = useNavigate();
  const [service, setService] = useState('residential');
  return (
    <motion.div data-reveal className="container quick-wrap" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.15, ease }}>
      <div className="quick-book">
        <div className="quick-intro"><span className="quick-spark"><Sparkles size={19} /></span><span>A fresh start<strong>begins right here.</strong></span></div>
        <div className="quick-options" role="group" aria-label="Choose your cleaning service">
          {quickOptions.map(({ id, label, Icon }) => (
            <button key={id} type="button" aria-pressed={service === id} onClick={() => setService(id)}>
              {service === id && <motion.span layoutId="quick-active" className="quick-active" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
              <Icon size={18} /><span>{label}</span>
            </button>
          ))}
        </div>
        <button type="button" className="quick-go" onClick={() => navigate(`/contact-us/?service=${service}`)} aria-label="Get a quote for the selected cleaning service">
          <span>Get a quote</span><ArrowUpRight size={20} />
        </button>
      </div>
    </motion.div>
  );
}

export function MarqueeBand() {
  const words = ['Residential cleaning', 'Commercial cleaning', 'Eco-friendly options', 'Window & glass', 'Move-in & move-out', 'Deep cleaning', 'Oven cleaning', 'Sanitisation'];
  return (
    <div className="marquee-band" aria-label="Services we offer">
      <Marquee items={words.map(w => <>{w}<Sparkles size={18} /></>)} />
    </div>
  );
}

export function ServiceCards() {
  return (
    <section className="section">
      <div className="container">
        <SectionHead eyebrow="A clean for every kind of space" lines={['Your space.']} accent="Our kind of clean." text="From everyday upkeep to a complete fresh start, we’ll find a clean that fits your life." />
        <Stagger className="service-cards">
          {services.map((s, i) => {
            const Icon = serviceIcons[i];
            return (
              <Item key={s.id}>
                <Link to={`/services/#${s.id}`} className="service-card">
                  <img src={media(s.image)} alt={s.alt} width="650" height="520" loading="lazy" />
                  <span className="service-card-top"><span className="service-card-icon"><Icon size={20} /></span><span>0{i + 1}</span></span>
                  <span className="service-card-body">
                    <h3>{s.name}</h3>
                    <span className="service-card-more"><span>{s.intro}</span></span>
                    <span className="service-card-cta">Explore <ArrowUpRight size={16} /></span>
                  </span>
                </Link>
              </Item>
            );
          })}
        </Stagger>
        <Reveal className="service-foot">
          <span><Leaf size={17} />Thoughtful products. Professional equipment. A personal touch.</span>
          <Link to="/services/" className="link-arrow">Explore our services <ArrowUpRight size={16} /></Link>
        </Reveal>
      </div>
    </section>
  );
}

export function ServiceExplorer() {
  const location = useLocation();
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const mounted = useRef(false);
  const selected = services[active];

  useEffect(() => {
    const i = services.findIndex(s => `#${s.id}` === location.hash);
    if (i >= 0) {
      setActive(i);
      if (mounted.current) document.getElementById(services[i].id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    mounted.current = true;
  }, [location.hash]);

  const onKey = (e: React.KeyboardEvent) => {
    const last = services.length - 1;
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!delta && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? last : (active + delta + services.length) % services.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section className="section explorer" id="services">
      <div className="container">
        <SectionHead eyebrow="A clean for every kind of space" lines={['Your space.']} accent="Our kind of clean." text="From everyday upkeep to a complete fresh start, we’ll find a clean that fits your life." />
        <Reveal>
          <div role="tablist" aria-label="Cleaning services" className="explorer-tabs" onKeyDown={onKey}>
            {services.map((s, i) => {
              const Icon = serviceIcons[i];
              return (
                <button key={s.id} ref={el => { tabs.current[i] = el; }} id={s.id} role="tab" aria-selected={active === i} aria-controls={`panel-${s.id}`} tabIndex={active === i ? 0 : -1} onClick={() => setActive(i)}>
                  {active === i && <motion.span className="tab-active" layoutId="tab-active" transition={{ type: 'spring', stiffness: 320, damping: 32 }} />}
                  <Icon size={18} /><span>{s.name.replace(' cleaning', '')}</span>
                </button>
              );
            })}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="explorer-panel">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={selected.id} id={`panel-${selected.id}`} role="tabpanel" aria-labelledby={selected.id} tabIndex={0} className="explorer-inner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <motion.div className="explorer-photo" initial={{ clipPath: 'inset(0% 100% 0% 0%)' }} animate={{ clipPath: 'inset(0% 0% 0% 0%)' }} transition={{ duration: 0.8, ease }}>
                  <motion.img src={media(selected.image)} alt={selected.alt} width="650" height="520" loading="lazy" initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease }} />
                  <span className="explorer-index">0{active + 1}<small>/ 0{services.length}</small></span>
                </motion.div>
                <motion.div className="explorer-copy" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15, ease }}>
                  <span className="tiny-label">{selected.name}</span>
                  <h3>{selected.intro}</h3>
                  <p>{selected.desc}</p>
                  <Ticks items={selected.items} />
                  <Button to={`/contact-us/?service=${selected.id}`} className="btn-solid">Find my {selected.id} clean</Button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
        <Reveal className="service-foot">
          <span><Leaf size={17} />Thoughtful products. Professional equipment. A personal touch.</span>
          <Link to="/contact-us/" className="link-arrow">Talk to our team <ArrowUpRight size={16} /></Link>
        </Reveal>
      </div>
    </section>
  );
}

export function Story({ full = false }: { full?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yMain = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const ySmall = useTransform(scrollYProgress, [0, 1], [130, -110]);
  const reveal = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.3 } } as const;

  return (
    <section className="section story">
      <div className="container story-grid">
        <div className="story-visual" ref={ref}>
          <motion.div className="story-main" style={{ y: yMain }} {...reveal}>
            <motion.img data-reveal variants={clipUp} custom={0} src={media('window-cleaning.jpg')} width="525" height="525" alt="Camak professional carefully cleaning glass" loading="lazy" />
          </motion.div>
          <motion.div className="story-small" style={{ y: ySmall }} {...reveal}>
            <motion.img data-reveal variants={clipUp} custom={0.2} src={media('floor-cleaning.jpg')} width="500" height="749" alt="Camak floor cleaning" loading="lazy" />
          </motion.div>
          <CircleBadge className="story-badge" text="BIG ON CARE • CLOSE TO HOME • "><Leaf size={24} /></CircleBadge>
        </div>
        <div className="story-copy">
          <Reveal y={16}><Eyebrow>More than a cleaning company</Eyebrow></Reveal>
          <Heading lines={['A little more care.']} accent="A whole lot cleaner." />
          <Reveal delay={0.2}>
            <p className="lead">We’re Camak. A locally based cleaning team with a simple belief: a fresh space makes room for a better day.</p>
            <p>From family homes to busy workplaces, we bring the same care, consistency and attention to detail to every visit. It’s what being a good neighbour looks like to us.</p>
          </Reveal>
          <Stagger className="story-points">
            <Item><span><ShieldCheck size={20} /></span>People you can trust</Item>
            <Item><span><Leaf size={20} /></span>Thoughtful by nature</Item>
          </Stagger>
          <Reveal delay={0.3}><Button to={full ? '/contact-us/' : '/about-us/'} className="btn-outline">{full ? 'Say hello to our team' : 'A little more about us'}</Button></Reveal>
        </div>
      </div>
    </section>
  );
}

const days = ['M', 'T', 'W', 'T', 'F'];
function MiniCalendar() {
  const [day, setDay] = useState(2);
  useEffect(() => {
    const timer = setInterval(() => setDay(d => (d + 1) % days.length), 1600);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="mini-calendar" aria-hidden="true">
      {days.map((d, i) => (
        <span key={i}>
          {day === i && <motion.i layoutId="cal-day" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
          <b>{day === i ? <Check size={13} strokeWidth={3} /> : d}</b>
        </span>
      ))}
    </div>
  );
}

export function Difference() {
  return (
    <section className="section difference">
      <div className="container">
        <SectionHead eyebrow="It’s the little things" lines={['Not just clean.']} accent="Camak clean." text={<>Care you can see.<br />Consistency you can feel.</>} />
        <div className="bento">
          <Spotlight className="bento-local">
            <div className="radar" aria-hidden="true"><span /><span /><span /><MapPin size={26} /></div>
            <span className="bento-tag"><span className="pulse-dot" />Rooted in Southland</span>
            <div>
              <h3>Your local team.<br />Your kind of people.</h3>
              <p>Based in Avenal, Invercargill. Looking after our neighbours, one clean at a time.</p>
              <Link to="/about-us/" className="link-arrow light">Get to know us <ArrowUpRight size={17} /></Link>
            </div>
          </Spotlight>
          <Spotlight className="bento-card bento-eco" delay={0.08}>
            <span className="bento-icon"><Leaf size={24} /></span>
            <div>
              <h3>A little greener.<br />A lot more thoughtful.</h3>
              <p>Eco-conscious practices and product options that care for your space.</p>
            </div>
            <Link to="/sustainability/" className="bento-link" aria-label="Our sustainability approach"><ArrowUpRight size={20} /></Link>
          </Spotlight>
          <Spotlight className="bento-card bento-schedule" delay={0.16}>
            <span className="bento-icon"><CalendarDays size={24} /></span>
            <div>
              <h3>Your routine.<br />Our reliability.</h3>
              <p>One-off, weekly, fortnightly or monthly. We work around you.</p>
              <MiniCalendar />
            </div>
          </Spotlight>
          <Spotlight className="bento-wide" delay={0.1}>
            <span className="bento-icon"><HeartHandshake size={24} /></span>
            <div><strong>Every corner counts.</strong><p>Friendly people, clear communication and a trained team that takes pride in the details.</p></div>
            <ShieldCheck size={26} className="bento-wide-end" />
          </Spotlight>
        </div>
      </div>
    </section>
  );
}

const steps = [
  ['01', 'Tell us about your space', 'A home, a workplace, a fresh start. Share what you need and what works for you.', MessageSquareText],
  ['02', 'We’ll make a plan', 'Get a free, personalised quote and a cleaning plan built around your space.', CalendarDays],
  ['03', 'Come back to the fresh feeling', 'We take care of the clean. You get on with the things that matter.', Sparkles],
] as const;

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 55%'] });
  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <section className="section process">
      <div className="container">
        <SectionHead center eyebrow="Easy from the first hello" lines={['Your next clean.']} accent="As simple as one, two, three." />
        <div className="process-track" ref={ref}>
          <div className="process-line" aria-hidden="true"><motion.span style={{ scaleX: line }} /></div>
          <Stagger className="process-grid">
            {steps.map(([n, title, text, Icon]) => (
              <Item className="process-step" key={n}>
                <span className="process-num"><Icon size={22} /></span>
                <span className="process-index">Step {n}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </Item>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

const quote = 'We’ve been impressed by the quality and consistency of Camak’s cleaning services. Their professionalism and dependable schedule make them a trusted partner for our business.';

function ScrollWord({ progress, range, children }: { progress: MotionValue<number>; range: [number, number]; children: string }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return <><motion.span data-reveal style={{ opacity }}>{children}</motion.span>{' '}</>;
}

export function Testimonial() {
  const ref = useRef<HTMLQuoteElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 50%'] });
  const words = quote.split(' ');
  return (
    <section className="testimonial">
      <div className="testimonial-glow" aria-hidden="true" />
      <div className="container">
        <Reveal y={16}><Eyebrow light>Kind words. Clean spaces.</Eyebrow></Reveal>
        <span className="quote-mark" aria-hidden="true">“</span>
        <blockquote ref={ref}>
          {words.map((w, i) => <ScrollWord key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{w}</ScrollWord>)}
        </blockquote>
        <Reveal className="quote-source">
          <span className="quote-avatar">C</span>
          <p>Camak client feedback<small>Shared on the original Camak website</small></p>
          <ShieldCheck size={20} />
        </Reveal>
      </div>
    </section>
  );
}

export function FaqPreview() {
  return (
    <section className="section">
      <div className="container faq-split">
        <div>
          <Reveal y={16}><Eyebrow>A little clarity</Eyebrow></Reveal>
          <Heading lines={['Good questions.']} accent="Clear answers." />
          <Reveal delay={0.2}>
            <p>Everything you need to feel good about your next clean.</p>
            <Button to="/faq/" className="btn-outline">Explore all FAQs</Button>
          </Reveal>
        </div>
        <Stagger className="accordion-list">
          {[faqs[1], faqs[2], faqs[3], faqs[5]].map(([, q, a]) => <Item key={q}><Accordion question={q} answer={a} /></Item>)}
        </Stagger>
      </div>
    </section>
  );
}
