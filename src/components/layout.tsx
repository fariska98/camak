import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { ArrowRight, ArrowUpRight, Check, Leaf, Mail, MapPin, MessageCircle, Phone, ShieldCheck, Sparkles, X } from 'lucide-react';
import { services } from '../data';
import { contact, ease, media } from '../lib';
import { Bubbles, Button, Eyebrow, Heading, maskRise, Reveal } from './ui';

const nav = [['/', 'Home'], ['/about-us/', 'Our story'], ['/services/', 'Services'], ['/faq/', 'FAQs']] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const toggle = useRef<HTMLButtonElement>(null);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 35, restDelta: 0.001 });

  useMotionValueEvent(scrollY, 'change', v => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(v > 24);
    setHidden(v > previous && v > 260);
  });
  useEffect(() => setOpen(false), [location.pathname, location.hash]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    document.documentElement.classList.add('menu-open');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('menu-open');
    };
  }, [open]);
  useEffect(() => {
    const wide = matchMedia('(min-width: 961px)');
    const close = () => setOpen(false);
    wide.addEventListener('change', close);
    return () => wide.removeEventListener('change', close);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <motion.div aria-hidden="true" className="scroll-progress" style={{ scaleX: progress }} />
      <motion.header className={`header ${scrolled ? 'is-scrolled' : ''}`} animate={{ y: hidden && !open ? '-140%' : '0%' }} transition={{ duration: 0.45, ease }}>
        <div className="nav-pill">
          <Link to="/" className="brand" aria-label="Camak home"><img src={media('logo.png')} alt="Camak" width="280" height="80" /></Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {nav.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'}>
                {({ isActive }) => (
                  <>
                    {isActive && <motion.span layoutId="nav-active" className="nav-active" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="nav-actions">
            <a href={`tel:${contact.phone}`} className="nav-phone"><span className="nav-phone-icon"><Phone size={14} /></span><span>{contact.phoneDisplay}</span></a>
            <Button to="/contact-us/" className="btn-small">Free quote</Button>
            <button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>
              <span /><span />
            </button>
          </div>
        </div>
      </motion.header>
      <AnimatePresence>{open && <MobileMenu />}</AnimatePresence>
    </>
  );
}

function MobileMenu() {
  const reduced = useReducedMotion();
  const links = [...nav, ['/contact-us/', 'Get in touch'] as const];
  return (
    <motion.div id="mobile-nav" className="mobile-menu" initial={{ clipPath: 'circle(0% at 90% 44px)' }} animate={{ clipPath: 'circle(150% at 90% 44px)' }} exit={{ clipPath: 'circle(0% at 90% 44px)' }} transition={{ duration: reduced ? 0 : 0.65, ease }}>
      <Bubbles />
      <nav aria-label="Mobile navigation">
        {links.map(([to, label], i) => (
          <motion.div key={to} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease }}>
            <NavLink to={to} end={to === '/'}><small>0{i + 1}</small>{label}<ArrowUpRight /></NavLink>
          </motion.div>
        ))}
      </nav>
      <motion.div className="mobile-meta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <a href={`tel:${contact.phone}`}><Phone size={16} />{contact.phoneIntl}</a>
        <a href={`mailto:${contact.email}`}><Mail size={16} />{contact.email}</a>
      </motion.div>
    </motion.div>
  );
}

export function PageHero({ label, title, accent, description }: { label: string; title: string; accent: string; description: string }) {
  return (
    <section className="page-hero">
      <div className="page-hero-bg" aria-hidden="true"><span className="blob b1" /><span className="blob b2" /><span className="grid-lines" /></div>
      <div className="container">
        <Reveal y={12} className="breadcrumbs"><Link to="/">Home</Link><ArrowRight size={12} /><span>{label}</span></Reveal>
        <Reveal y={12} delay={0.05}><Eyebrow>{label}</Eyebrow></Reveal>
        <Heading as="h1" lines={[title]} accent={accent} delay={0.1} />
        <Reveal delay={0.45}><p className="page-hero-lead">{description}</p></Reveal>
      </div>
      <Sparkles className="page-hero-spark" aria-hidden="true" />
    </section>
  );
}

export function CTA() {
  return (
    <section className="cta-section">
      <div className="container">
        <Reveal className="cta">
          <div className="cta-glow" aria-hidden="true" />
          <Bubbles />
          <div className="cta-copy">
            <Eyebrow light>Less to do. More to enjoy.</Eyebrow>
            <Heading lines={['Make room for']} accent="a fresher feeling." />
            <p>A home you love. A workplace that feels good. Let’s find the right clean for you.</p>
          </div>
          <div className="cta-actions">
            <Button to="/contact-us/" className="btn-lime">Let’s get your space sparkling</Button>
            <a href={`tel:${contact.phone}`} className="cta-phone"><Phone size={15} />Or call us on {contact.phoneDisplay}</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" aria-label="Camak home"><img src={media('logo.png')} width="280" height="80" alt="Camak" /></Link>
            <p className="footer-tagline">A little more care.<br /><span>A whole lot cleaner.</span></p>
            <span>Local people. Thoughtful cleaning.<br />Invercargill &amp; Southland, New Zealand.</span>
          </div>
          <div className="footer-col">
            <h3>Explore</h3>
            <Link to="/about-us/">Our story</Link>
            <Link to="/services/">Our services</Link>
            <Link to="/faq/">FAQs</Link>
            <Link to="/blog/">Our journal</Link>
            <Link to="/sustainability/">Sustainability</Link>
          </div>
          <div className="footer-col">
            <h3>Find your clean</h3>
            {services.map(s => <Link key={s.id} to={`/services/#${s.id}`}>{s.name}</Link>)}
          </div>
          <div className="footer-col footer-contact">
            <h3>Say hello</h3>
            <a href={`tel:${contact.phone}`}><Phone size={15} />{contact.phoneIntl}</a>
            <a href={`tel:${contact.phone2}`}><Phone size={15} />{contact.phone2Intl}</a>
            <a href={`mailto:${contact.email}`}><Mail size={15} />{contact.email}</a>
            <a href={contact.map} target="_blank" rel="noreferrer"><MapPin size={16} /><span>Dee Street, Avenal<br />Invercargill, Southland</span></a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Camak Services Limited.</span>
          <div>
            <Link to="/privacy-policy/">Privacy information</Link>
            <Link to="/terms-of-service/">Service terms</Link>
            <button type="button" onClick={() => window.dispatchEvent(new Event('camak:privacy'))}>Privacy preferences</button>
          </div>
          <span>Made for a fresher everyday <Sparkles size={12} /></span>
        </div>
      </div>
      <motion.div className="footer-wordmark" aria-hidden="true" initial="hidden" whileInView="show" viewport={{ once: true }}>
        {[...'a fresh feeling.'].map((c, i) => (
          <motion.span data-reveal key={i} variants={maskRise} custom={i * 0.035}>{c === ' ' ? ' ' : c}</motion.span>
        ))}
      </motion.div>
    </footer>
  );
}

export function WhatsApp() {
  return (
    <a className="whatsapp" href={contact.whatsapp} target="_blank" rel="noreferrer" aria-label="Chat with Camak on WhatsApp">
      <MessageCircle size={24} /><span>Let’s chat</span>
    </a>
  );
}

const storageKey = 'camak-privacy-v2';
type Preference = { functional: boolean; analytics: boolean; advertising: boolean };
const essential: Preference = { functional: false, analytics: false, advertising: false };

export function PrivacyControls() {
  const [banner, setBanner] = useState(false);
  const [preferences, setPreferences] = useState<Preference>(essential);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (saved) setPreferences(saved); else setBanner(true);
    } catch { setBanner(true); }
    const open = () => { opener.current = document.activeElement as HTMLElement; dialog.current?.showModal(); };
    window.addEventListener('camak:privacy', open);
    return () => window.removeEventListener('camak:privacy', open);
  }, []);

  const save = (p: Preference) => {
    setPreferences(p);
    try { localStorage.setItem(storageKey, JSON.stringify(p)); } catch { /* storage unavailable */ }
    setBanner(false);
    dialog.current?.close();
  };

  return (
    <>
      <AnimatePresence>
        {banner && (
          <motion.aside className="privacy-banner" aria-labelledby="privacy-title" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 1.6, duration: 0.6, ease } }} exit={{ y: 40, opacity: 0 }}>
            <span className="privacy-icon"><ShieldCheck size={20} /></span>
            <div>
              <h2 id="privacy-title">A little care for your privacy.</h2>
              <p>We only store your privacy preferences. No analytics or advertising trackers are added. <Link to="/privacy-policy/">Learn more</Link></p>
              <div className="privacy-actions">
                <button onClick={() => save(essential)}>Essential only</button>
                <button onClick={() => save({ functional: true, analytics: true, advertising: true })}>Accept all</button>
                <button onClick={() => window.dispatchEvent(new Event('camak:privacy'))}>Customise</button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      <dialog className="privacy-dialog" ref={dialog} aria-labelledby="privacy-heading" onClose={() => opener.current?.focus()}>
        <button className="dialog-close" aria-label="Close privacy preferences" onClick={() => dialog.current?.close()}><X /></button>
        <Leaf className="dialog-leaf" />
        <h2 id="privacy-heading">Your privacy.<br />Your preferences.</h2>
        <p>No optional trackers are currently used by this redesign.</p>
        <div className="privacy-row"><div><strong>Necessary storage</strong><p>Remembers the preferences you choose.</p></div><span>Always on</span></div>
        {(['functional', 'analytics', 'advertising'] as const).map(c => (
          <label className="privacy-row" key={c}>
            <span>{c[0].toUpperCase() + c.slice(1)} cookies</span>
            <input type="checkbox" className="switch" checked={preferences[c]} onChange={e => setPreferences({ ...preferences, [c]: e.target.checked })} />
          </label>
        ))}
        <button className="btn btn-solid" onClick={() => save(preferences)}>Save my preferences <Check size={18} /></button>
      </dialog>
    </>
  );
}

export function Accordion({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`accordion ${open ? 'is-open' : ''}`}>
      <h3>
        <button aria-expanded={open} onClick={() => setOpen(!open)}>
          <span>{question}</span>
          <motion.span className="accordion-icon" animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.3, ease }} aria-hidden="true">+</motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="accordion-body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease }}>
            <p>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
