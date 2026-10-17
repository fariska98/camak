import { useEffect, type ReactNode } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { Footer, Header, PrivacyControls, WhatsApp } from './components/layout';
import { AboutPage, BlogPage, FAQPage, HomePage, InfoPage, NotFound, ServicesPage, SustainabilityPage } from './pages/pages';
import { ContactPage } from './pages/ContactPage';
import { ease, easeInOut } from './lib';

const titles: Record<string, string> = {
  '/': 'A fresh feeling, every day',
  '/about-us/': 'Our story',
  '/services/': 'Our services',
  '/contact-us/': 'Get a free quote',
  '/faq/': 'Frequently asked questions',
  '/blog/': 'Our journal',
  '/sustainability/': 'Sustainability',
  '/privacy-policy/': 'Privacy information',
  '/terms-of-service/': 'Service information',
};

/** Wraps each route: a curtain sweeps over on exit and lifts away on enter. Skipped for the first page load. */
function PageTransition({ children, first }: { children: ReactNode; first: boolean }) {
  const reduced = useReducedMotion();
  const location = useLocation();

  // Runs once the previous page has finished leaving, while the curtain still covers the screen.
  useEffect(() => {
    if (first) return;
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'start' });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    const heading = document.querySelector('h1');
    heading?.setAttribute('tabindex', '-1');
    heading?.focus({ preventScroll: true });
  }, []);

  if (reduced) {
    return (
      <motion.div initial={first ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
        {children}
      </motion.div>
    );
  }
  return (
    <div>
      <motion.div initial={first ? false : { opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3, ease } }} exit={{ opacity: 0, y: -24, transition: { duration: 0.35, ease } }}>
        {children}
      </motion.div>
      <motion.div className="curtain curtain-in" aria-hidden="true" initial={first ? false : { scaleY: 1 }} animate={{ scaleY: 0, transition: { duration: 0.65, delay: 0.1, ease: easeInOut } }}>
        <Sparkles />
      </motion.div>
      <motion.div className="curtain curtain-out" aria-hidden="true" initial={{ scaleY: 0 }} animate={{ scaleY: 0 }} exit={{ scaleY: 1, transition: { duration: 0.5, ease: easeInOut } }}>
        <Sparkles />
      </motion.div>
    </div>
  );
}

export function App() {
  const location = useLocation();
  const first = location.key === 'default';

  useEffect(() => {
    document.title = `${titles[location.pathname] || 'Page not found'} | Camak Services`;
  }, [location.pathname]);

  return (
    <MotionConfig reducedMotion="user">
      <Header />
      <main id="main">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname} first={first}>
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about-us/" element={<AboutPage />} />
              <Route path="/services/" element={<ServicesPage />} />
              <Route path="/contact-us/" element={<ContactPage />} />
              <Route path="/faq/" element={<FAQPage />} />
              <Route path="/sustainability/" element={<SustainabilityPage />} />
              <Route path="/blog/" element={<BlogPage />} />
              <Route path="/privacy-policy/" element={<InfoPage />} />
              <Route path="/terms-of-service/" element={<InfoPage terms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
      <WhatsApp />
      <PrivacyControls />
    </MotionConfig>
  );
}
