'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import { ArrowDown, ArrowDownRight, ArrowUpRight, MoveUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const ParticleWorld = dynamic(() => import('@/components/particle-world'), { ssr: false });

const projects = [
  { number: '01', category: 'NETWORKING / LAB NOTES', title: 'Mapping the invisible.', description: 'Exploring the protocols, pathways, and quiet systems that keep a network moving.' },
  { number: '02', category: 'CYBERSECURITY / RESEARCH', title: 'Think like the threat.', description: 'Security thinking grounded in curiosity: understand the surface, test assumptions, build with care.' },
  { number: '03', category: 'ENGINEERING / SYSTEMS', title: 'Make complexity useful.', description: 'Small, considered tools and infrastructure that make complicated problems clearer.' },
];

export default function Home() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const announceProgress = (progress: number) => window.dispatchEvent(new CustomEvent('particle-scroll', { detail: { progress } }));
    const triggers = ScrollTrigger.create({
      trigger: root.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => announceProgress(self.progress),
      onRefresh: (self) => announceProgress(self.progress),
    });
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.content-reveal').forEach((element) => {
        gsap.fromTo(element, { y: 28, opacity: 0.45 }, {
          y: 0, opacity: 1, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        });
      });
      gsap.fromTo('.hero-copy', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', delay: 0.3 });
    }, root);
    return () => {
      triggers.kill();
      context.revert();
    };
  }, []);

  return (
    <main ref={root} className="portfolio-shell">
      <ParticleWorld />
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Cohen Marley, back to top">CM<span>.</span></a>
        <span className="header-status"><i /> OPEN TO WHAT&apos;S NEXT</span>
        <nav className="header-nav" aria-label="Main navigation">
          <a href="#about">ABOUT</a>
          <a href="#work">WORK</a>
          <a href="#contact">CONTACT <ArrowUpRight size={13} /></a>
        </nav>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-meta"><span>COHEN MARLEY</span><span>PORTFOLIO / 2026</span></div>
        <div className="hero-copy">
          <p className="eyebrow"><span className="blue-line" /> CYBERSECURITY / NETWORKING / ENGINEERING</p>
          <h1 id="hero-title">Building<br /><span>what&apos;s</span><br />next<span className="blue-period">.</span></h1>
          <p className="hero-note">A curious mind in a world that never sits still.</p>
        </div>
        <a className="scroll-cue" href="#about"><span>SCROLL TO ENTER</span><ArrowDown size={15} /></a>
        <span className="hero-coordinate">43°39&apos; N&nbsp; / &nbsp;79°23&apos; W</span>
      </section>

      <section className="content-section about-section" id="about">
        <div className="section-index content-reveal"><span>01 — A LITTLE ABOUT ME</span><span>CURIOUS BY DEFAULT</span></div>
        <div className="about-layout content-reveal">
          <h2>I&apos;m Cohen — drawn to where <span>security, systems,</span> and human ingenuity meet.</h2>
          <div className="aside-copy"><i className="blue-line" /><p>I like understanding how things work, asking better questions, and making technology a little more thoughtful. This is a living record of what I&apos;m learning and building.</p><a className="inline-link" href="#contact">START A CONVERSATION <ArrowDownRight size={15} /></a></div>
        </div>
        <p className="ambient-label">SIGNAL / CURIOSITY / CONTINUOUS CHANGE</p>
      </section>

      <section className="work-section content-section" id="work">
        <div className="section-index content-reveal"><span>02 — DIRECTIONS IN MOTION</span><span>NOTHING STANDS STILL</span></div>
        <div className="work-heading content-reveal"><h2>Ideas in<br /><span>progress.</span></h2><p>Not a list of claims — a few directions I&apos;m exploring, with room for the work still to come.</p></div>
        <div className="project-list">
          {projects.map((project) => <article className="project-row content-reveal" key={project.number}>
            <span className="project-number">{project.number}</span>
            <div className="project-main"><span className="project-category">{project.category}</span><h3>{project.title}</h3><p>{project.description}</p></div>
            <span className="project-arrow" aria-hidden="true"><MoveUpRight size={18} /></span>
          </article>)}
        </div>
        <p className="work-footnote"><span className="blue-line" /> THE NEXT CHAPTER IS STILL BEING WRITTEN.</p>
      </section>

      <section className="principle-section content-section">
        <div className="section-index content-reveal"><span>03 — THE APPROACH</span><span>ALWAYS IN MOTION</span></div>
        <div className="principle content-reveal"><span className="quote-mark">“</span><p>Stay curious.<br />Make it <span>matter.</span></p><span className="principle-caption">LEARN DEEPLY. BUILD THOUGHTFULLY. SHARE GENEROUSLY.</span></div>
      </section>

      <footer className="contact-section content-section" id="contact">
        <div className="section-index content-reveal"><span>04 — YOUR TURN</span><span>GOOD THINGS START WITH A CONVERSATION</span></div>
        <div className="contact-main content-reveal"><p className="eyebrow">HAVE A QUESTION, AN IDEA, OR JUST WANT TO SAY HELLO?</p><h2>Let&apos;s<br /><span>connect<span className="blue-period">.</span></span></h2><a className="contact-button" href="mailto:hello@cohenmarley.com">SAY HELLO <ArrowUpRight size={16} /></a></div>
        <div className="footer-bottom"><a className="footer-name" href="#top">COHEN MARLEY<span>.</span></a><span>CYBERSECURITY / NETWORKING / ENGINEERING</span><a href="#top" className="back-top">BACK TO TOP <ArrowDown size={13} /></a><span>© 2026</span></div>
      </footer>
    </main>
  );
}
