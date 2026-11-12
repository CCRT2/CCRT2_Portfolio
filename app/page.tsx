'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowDownRight, ArrowUpRight, MoveUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const titleLines = ['BUILDING', "WHAT'S", 'NEXT.'];

const explorations = [
  {
    number: '01',
    type: 'NETWORKING / LAB NOTE',
    title: 'Mapping the invisible.',
    description: 'A closer look at the protocols, pathways, and quiet systems that keep a network moving.',
    className: 'project-card--map',
    visual: 'map',
  },
  {
    number: '02',
    type: 'CYBERSECURITY / EXPLORATION',
    title: 'Think like the threat.',
    description: 'Practical security thinking: understand the surface, test assumptions, build with care.',
    className: 'project-card--signal',
    visual: 'signal',
  },
  {
    number: '03',
    type: 'ENGINEERING / SYSTEMS',
    title: 'Make complexity useful.',
    description: 'Small, considered tools and infrastructure that turn complicated problems into clear ones.',
    className: 'project-card--systems',
    visual: 'systems',
  },
];

function splitCharacters(text: string) {
  return Array.from(text).map((character, index) => (
    <span className="char-wrap" aria-hidden="true" key={`${character}-${index}`}>
      <span className="hero-char">{character === ' ' ? '\u00a0' : character}</span>
    </span>
  ));
}

export default function Home() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const chars = gsap.utils.toArray<HTMLElement>('.hero-char');
      gsap.fromTo(chars, { yPercent: 115, rotate: 5, opacity: 0 }, {
        yPercent: 0,
        rotate: 0,
        opacity: 1,
        duration: 1.15,
        stagger: { each: 0.035, from: 'start' },
        ease: 'power4.out',
        delay: 0.25,
      });
      gsap.fromTo('.hero-meta, .hero-index, .hero-scroll', { y: 16, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.12, delay: 0.9, ease: 'power3.out',
      });
      gsap.to('.hero-title', {
        yPercent: 15,
        opacity: 0.38,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.7 },
      });
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) => {
        gsap.fromTo(element, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>('.project-card').forEach((card, index) => {
        gsap.fromTo(card, { y: 55, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.9, delay: index * 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 86%', once: true },
        });
      });
      gsap.to('.marquee-track', {
        xPercent: -25,
        ease: 'none',
        scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    }, root);
    return () => context.revert();
  }, []);

  return (
    <main ref={root}>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Cohen Marley, back to top">CM<span className="wordmark-dot">.</span></a>
        <span className="header-location"><span className="availability-dot" /> OPEN TO WHAT&apos;S NEXT</span>
        <nav className="header-nav" aria-label="Main navigation">
          <a href="#about">ABOUT</a><a href="#work">EXPLORATIONS</a><a href="#contact">CONTACT <ArrowUpRight size={12} /></a>
        </nav>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-topline"><span>COHEN MARLEY</span><span className="hero-index">PORTFOLIO / 2026</span></div>
        <h1 className="hero-title" id="hero-title" aria-label="Building what's next.">
          {titleLines.map((line) => <span className="title-line" key={line}>{splitCharacters(line)}</span>)}
        </h1>
        <div className="hero-bottomline">
          <p className="hero-meta">CYBERSECURITY <i>/</i> NETWORKING <i>/</i><br className="mobile-break" /> ENGINEERING <i>/</i> TECHNOLOGY</p>
          <a href="#about" className="hero-scroll"><span>SCROLL TO EXPLORE</span><ArrowDown size={15} strokeWidth={1.5} /></a>
        </div>
        <span className="hero-crosshair crosshair-one" aria-hidden="true">+</span>
        <span className="hero-crosshair crosshair-two" aria-hidden="true">+</span>
      </section>

      <section className="intro section-pad" id="about">
        <div className="section-label reveal"><span>01 / A LITTLE ABOUT ME</span><span>CURIOUS BY DEFAULT</span></div>
        <div className="intro-copy reveal">
          <p className="intro-statement">I&apos;m Cohen — drawn to the places where <span>security, systems,</span> and <span>human ingenuity</span> meet.</p>
          <div className="intro-aside"><span className="blue-dash" /><p>I like understanding how things work, asking better questions, and making technology a little more thoughtful. This is a living record of what I&apos;m learning and building.</p><a href="#contact" className="text-link">A BIT MORE ABOUT ME <ArrowDownRight size={15} /></a></div>
        </div>
      </section>

      <section className="marquee" aria-label="Curiosity meets craft">
        <div className="marquee-track" aria-hidden="true">{Array.from({ length: 4 }, (_, i) => <span className="marquee-item" key={i}>CURIOSITY MEETS CRAFT <b>✳</b> BUILD WITH INTENTION <b>✳</b> {i === 3 ? null : ''}</span>)}</div>
      </section>

      <section className="work section-pad" id="work">
        <div className="section-label reveal"><span>02 / SELECTED DIRECTIONS</span><span>THINGS I LIKE TO GET INTO</span></div>
        <div className="work-heading reveal"><h2>Ideas in<br /><span>progress.</span></h2><p>Not a list of claims — a few directions I&apos;m exploring, with room for the work still to come.</p></div>
        <div className="project-grid">
          {explorations.map((item) => <article className={`project-card ${item.className}`} key={item.number}>
            <div className={`project-visual visual-${item.visual}`} aria-hidden="true">
              {item.visual === 'map' && <><div className="map-grid" /><span className="map-route route-a" /><span className="map-route route-b" /><span className="map-node node-a" /><span className="map-node node-b" /><span className="map-node node-c" /><span className="visual-caption">ROUTE / 04—B</span></>}
              {item.visual === 'signal' && <><div className="signal-rings"><span /><span /><span /><i /></div><span className="signal-coordinate">51°30&apos;26.4&quot;N<br />00°07&apos;39.0&quot;W</span><span className="visual-caption">SIGNAL / FOUND</span></>}
              {item.visual === 'systems' && <><div className="system-orbit orbit-a" /><div className="system-orbit orbit-b" /><div className="system-core">CM<span>_</span></div><span className="system-point point-a" /><span className="system-point point-b" /><span className="visual-caption">SYSTEM / 001</span></>}
              <span className="project-number">{item.number}</span><span className="project-open"><MoveUpRight size={17} /></span>
            </div>
            <div className="project-info"><span className="project-type">{item.type}</span><h3>{item.title}</h3><p>{item.description}</p></div>
          </article>)}
        </div>
        <p className="work-footnote reveal"><span className="blue-dash" /> THE NEXT CHAPTER IS STILL BEING WRITTEN.</p>
      </section>

      <section className="principle section-pad">
        <div className="section-label reveal"><span>03 / THE APPROACH</span><span>ALWAYS IN MOTION</span></div>
        <div className="principle-content reveal"><span className="principle-mark">“</span><p>Stay curious.<br />Make it <span>matter.</span></p><span className="principle-caption">LEARN DEEPLY. BUILD THOUGHTFULLY. SHARE GENEROUSLY.</span></div>
      </section>

      <footer className="contact section-pad" id="contact">
        <div className="section-label reveal"><span>04 / YOUR TURN</span><span>GOOD THINGS START WITH A CONVERSATION</span></div>
        <div className="contact-main reveal"><p className="contact-kicker">HAVE A QUESTION, AN IDEA, OR JUST WANT TO SAY HELLO?</p><h2>LET&apos;S<br /><span>CONNECT<span className="blue-period">.</span></span></h2>
          <motion.a className="contact-button" href="mailto:hello@cohenmarley.com" whileHover={{ x: 5 }} whileTap={{ scale: 0.97 }}>SAY HELLO <ArrowUpRight size={17} /></motion.a>
        </div>
        <div className="footer-bottom"><a className="footer-name" href="#top">COHEN MARLEY<span>.</span></a><span>CYBERSECURITY / NETWORKING / ENGINEERING</span><a href="#top" className="back-top">BACK TO TOP <ArrowDown size={13} /></a><span className="copyright">© 2026</span></div>
      </footer>
    </main>
  );
}
