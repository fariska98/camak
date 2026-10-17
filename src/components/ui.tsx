import { Fragment, useEffect, useState, type PointerEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, type Variants } from 'motion/react';
import { ArrowUpRight, Check } from 'lucide-react';
import { ease } from '../lib';

const view = { once: true, amount: 0.15 } as const;

/** Fades and lifts its children into place the first time they scroll into view. */
export function Reveal({ children, className = '', delay = 0, y = 36 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  return (
    <motion.div data-reveal className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.9, delay, ease }}>
      {children}
    </motion.div>
  );
}

const group: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const rise: Variants = { hidden: { opacity: 0, y: 34 }, show: { opacity: 1, y: 0, transition: { duration: 0.85, ease } } };

/** Container whose <Item> children animate in one after another. */
export function Stagger({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div data-reveal className={className} variants={group} initial="hidden" whileInView="show" viewport={view}>
      {children}
    </motion.div>
  );
}

export function Item({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <motion.div data-reveal className={className} variants={rise}>{children}</motion.div>;
}

// Masked children sit outside their clipping box until revealed, so the in-view
// trigger lives on a visible parent and reaches them through these variants.
export const maskRise: Variants = {
  hidden: { y: '115%' },
  show: (delay: number = 0) => ({ y: '0%', transition: { duration: 0.95, delay, ease } }),
};
export const clipUp: Variants = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
  show: (delay: number = 0) => ({ clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1.2, delay, ease } }),
};

/** Splits text into words that slide up from behind a mask. Needs a parent driving the hidden/show variants. */
export function Words({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <Fragment key={i}>
          {i > 0 && ' '}
          <span className="word-mask">
            <motion.span data-reveal className="word" variants={maskRise} custom={delay + i * 0.07}>{word}</motion.span>
          </span>
        </Fragment>
      ))}
    </>
  );
}

/** Headline made of plain lines plus an optional italic accent line. */
export function Heading({ as = 'h2', lines, accent, className = '', delay = 0 }: { as?: 'h1' | 'h2'; lines: string[]; accent?: string; className?: string; delay?: number }) {
  const Tag = as === 'h1' ? motion.h1 : motion.h2;
  let offset = delay;
  const timed = lines.map(line => {
    const start = offset;
    offset += line.split(' ').length * 0.07;
    return [line, start] as const;
  });
  return (
    <Tag className={`heading ${className}`} initial="hidden" whileInView="show" viewport={{ once: true }}>
      {timed.map(([line, start]) => <span className="line" key={line}><Words text={line} delay={start} /></span>)}
      {accent && <span className="line accent"><Words text={accent} delay={offset} /></span>}
    </Tag>
  );
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <div className={`eyebrow ${light ? 'light' : ''}`}><span />{children}</div>;
}

export function SectionHead({ eyebrow, lines, accent, text, center = false, light = false }: { eyebrow: string; lines: string[]; accent?: string; text?: ReactNode; center?: boolean; light?: boolean }) {
  return (
    <div className={`section-head ${center ? 'center' : ''}`}>
      <div>
        <Reveal y={16}><Eyebrow light={light}>{eyebrow}</Eyebrow></Reveal>
        <Heading lines={lines} accent={accent} />
      </div>
      {text && <Reveal delay={0.25}><p>{text}</p></Reveal>}
    </div>
  );
}

/** Pill button that leans toward the cursor and rolls its label on hover. */
export function Button({ children, to, href, className = '', icon = <ArrowUpRight size={18} /> }: { children: ReactNode; to?: string; href?: string; className?: string; icon?: ReactNode }) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 220, damping: 15, mass: 0.4 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);
  const move = (e: PointerEvent<HTMLSpanElement>) => {
    if (reduced || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.2);
    y.set((e.clientY - r.top - r.height / 2) * 0.3);
  };
  const reset = () => { x.set(0); y.set(0); };
  const inner = (
    <>
      <span className="btn-label"><span>{children}</span><span aria-hidden="true">{children}</span></span>
      <span className="btn-icon">{icon}</span>
    </>
  );
  return (
    <motion.span className="magnet" style={{ x: sx, y: sy }} onPointerMove={move} onPointerLeave={reset}>
      {to ? <Link to={to} className={`btn ${className}`}>{inner}</Link> : <a href={href} className={`btn ${className}`}>{inner}</a>}
    </motion.span>
  );
}

export function Ticks({ items }: { items: string[] }) {
  return (
    <ul className="ticks">
      {items.map((item, i) => (
        <motion.li data-reveal key={item} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 + i * 0.06, ease }}>
          <span className="tick"><Check size={13} strokeWidth={3} /></span>{item}
        </motion.li>
      ))}
    </ul>
  );
}

/** Card with a soft light that follows the cursor. */
export function Spotlight({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <motion.div data-reveal className={`spotlight ${className}`} onPointerMove={move} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.85, delay, ease }}>
      {children}
    </motion.div>
  );
}

export function Marquee({ items, reverse = false }: { items: ReactNode[]; reverse?: boolean }) {
  const row = (hidden: boolean) => (
    <div className="marquee-row" aria-hidden={hidden || undefined}>
      {items.map((item, i) => <span className="marquee-item" key={i}>{item}</span>)}
    </div>
  );
  return <div className={`marquee ${reverse ? 'reverse' : ''}`}><div className="marquee-track">{row(false)}{row(true)}</div></div>;
}

// Fixed positions keep server and client markup identical.
const bubbleSpec = [[6, 22, 0, 13], [14, 12, 4, 10], [23, 30, 7, 16], [35, 14, 2, 11], [47, 20, 9, 14], [58, 10, 5, 9], [66, 26, 1, 15], [77, 16, 6, 12], [86, 34, 3, 17], [94, 12, 8, 10]];
export function Bubbles() {
  return (
    <div className="bubbles" aria-hidden="true">
      {bubbleSpec.map(([left, size, delay, duration], i) => (
        <span key={i} style={{ left: `${left}%`, width: size, height: size, animationDelay: `${delay}s`, animationDuration: `${duration}s` }} />
      ))}
    </div>
  );
}

/** Slowly spinning badge with text set around a circle. */
export function CircleBadge({ text, children, className = '' }: { text: string; children: ReactNode; className?: string }) {
  const chars = [...text];
  return (
    <div className={`circle-badge ${className}`} aria-hidden="true">
      <div className="circle-text">
        {chars.map((c, i) => <span key={i} style={{ transform: `rotate(${(i * 360) / chars.length}deg)` }}>{c}</span>)}
      </div>
      <div className="circle-core">{children}</div>
    </div>
  );
}

export function RotatingWord({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => setIndex(i => (i + 1) % words.length), 2400);
    return () => clearInterval(timer);
  }, [reduced, words.length]);
  return (
    <span className="rotator">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={words[index]} initial={{ y: '100%', opacity: 0 }} animate={{ y: '0%', opacity: 1 }} exit={{ y: '-100%', opacity: 0 }} transition={{ duration: 0.45, ease }}>
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
