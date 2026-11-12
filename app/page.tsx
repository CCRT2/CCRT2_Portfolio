'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import { ArrowDown, ArrowDownRight, ArrowUpRight, MoveUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { projects } from '@/content/projects';

const ParticleWorld = dynamic(() => import('@/components/particle-world'), { ssr: false });

export default function Home() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, anchors: true });
    const updateScroll = () => ScrollTrigger.update();
    const raf = (time: number) => lenis.raf(time * 1000);
    lenis.on('scroll', updateScroll);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const announceProgress = (progress: number) => window.dispatchEvent(new CustomEvent('particle-scroll', { detail: { progress } }));
    const worldTrigger = ScrollTrigger.create({
      trigger: root.current,
      start: 'top top', end: 'bottom bottom',
      onUpdate: (self) => announceProgress(self.progress),
      onRefresh: (self) => announceProgress(self.progress),
    });
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.content-reveal').forEach((element) => {
        gsap.fromTo(element, { y: 25, opacity: 0.5 }, {
          y: 0, opacity: 1, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        });
      });
      gsap.fromTo('.hero-copy', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.25 });
      gsap.to('.hero h1', { letterSpacing: '-.075em', ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.7 } });
    }, root);
    ScrollTrigger.refresh();

    return () => {
      worldTrigger.kill();
      context.revert();
      lenis.off('scroll', updateScroll);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <main ref={root} className="portfolio-shell">
      <ParticleWorld />
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Cohen Marley, back to top">CM<span>.</span></a>
        <span className="header-status"><i /> OPEN TO WHAT&apos;S NEXT</span>
        <nav className="header-nav" aria-label="Main navigation"><a href="#about">ABOUT</a><a href="#disciplines">DISCIPLINES</a><a href="#work">WORK</a><a href="#contact">CONTACT <ArrowUpRight size={13} /></a></nav>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-meta"><span>COHEN MARLEY</span><span>PORTFOLIO / 2026</span></div>
        <div className="hero-copy">
          <p className="eyebrow"><span className="blue-line" /> CYBERSECURITY / NETWORKING / ENGINEERING / TECHNOLOGY</p>
          <h1 id="hero-title">Building<br /><span>what&apos;s</span><br />next<span className="blue-period">.</span></h1>
          <p className="hero-note">A curious mind in a world that never sits still.</p>
        </div>
        <a className="scroll-cue" href="#about"><span>SCROLL TO ENTER</span><ArrowDown size={15} /></a>
        <span className="hero-coordinate">A WORLD IN CONTINUOUS MOTION</span>
      </section>

      <section className="content-section about-section" id="about">
        <div className="section-index content-reveal"><span>01 — IDENTITY</span><span>CURIOUS BY DEFAULT</span></div>
        <div className="about-layout content-reveal">
          <h2>I&apos;m Cohen — drawn to where <span>security, systems,</span> and human ingenuity meet.</h2>
          <div className="aside-copy"><i className="blue-line" /><p>I like understanding how things work, asking better questions, and making technology a little more thoughtful. This portfolio is a living record of the directions I&apos;m exploring.</p><a className="inline-link" href="#contact">START A CONVERSATION <ArrowDownRight size={15} /></a></div>
        </div>
        <p className="ambient-label">SIGNAL / CURIOSITY / CONTINUOUS CHANGE</p>
      </section>

      <section className="discipline-section content-section" id="disciplines">
        <div className="section-index content-reveal"><span>02 — FIELDS OF CURIOSITY</span><span>CONNECTED BY DESIGN</span></div>
        <div className="discipline-grid">
          <article className="discipline-item content-reveal"><span className="discipline-number">01 / SECURITY</span><h2>Cyber<br />security<span>.</span></h2><p>Learning to see systems clearly: their boundaries, assumptions, and the ways they can be made more resilient.</p><a href="#work">EXPLORE DIRECTIONS <MoveUpRight size={14} /></a></article>
          <article className="discipline-item content-reveal"><span className="discipline-number">02 / INFRASTRUCTURE</span><h2>Net<br />working<span>.</span></h2><p>Following the paths that connect devices, services, and people—and understanding what keeps them reliable.</p><a href="#work">EXPLORE DIRECTIONS <MoveUpRight size={14} /></a></article>
          <article className="discipline-item content-reveal"><span className="discipline-number">03 / BUILDING</span><h2>Engin<br />eering<span>.</span></h2><p>Turning questions into experiments, useful tools, and thoughtful systems through iterative making.</p><a href="#work">EXPLORE DIRECTIONS <MoveUpRight size={14} /></a></article>
        </div>
      </section>

      <section className="work-section content-section" id="work">
        <div className="section-index content-reveal"><span>03 — PROJECT DIRECTIONS</span><span>REAL WORK, AS IT DEVELOPS</span></div>
        <div className="work-heading content-reveal"><h2>Ideas in<br /><span>progress.</span></h2><p>Project details will grow here as work is documented. No invented credentials or finished-project claims—just an honest view of what is being explored.</p></div>
        <div className="project-list">
          {projects.map((project) => <article className="project-row content-reveal" key={project.slug}>
            <span className="project-number">{project.number}</span>
            <div className="project-main"><span className="project-category">{project.category}</span><h3>{project.name}</h3><p>{project.description}</p><div className="project-tags">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div></div>
            <span className="project-status">{project.status}</span>
          </article>)}
        </div>
        <p className="work-footnote"><span className="blue-line" /> MORE FIELD NOTES WILL APPEAR AS THEY ARE DOCUMENTED.</p>
      </section>

      <section className="experience-section content-section" id="experience">
        <div className="section-index content-reveal"><span>04 — EXPERIENCE</span><span>THE WORK IS IN PROGRESS</span></div>
        <div className="experience-note content-reveal"><span>OPEN CANVAS</span><p>Education, experience, labs, and milestones belong here when Cohen is ready to share them.</p></div>
      </section>

      <section className="principle-section content-section">
        <div className="section-index content-reveal"><span>05 — THE APPROACH</span><span>ALWAYS IN MOTION</span></div>
        <div className="principle content-reveal"><span className="quote-mark">“</span><p>Stay curious.<br />Make it <span>matter.</span></p><span className="principle-caption">LEARN DEEPLY. BUILD THOUGHTFULLY. SHARE GENEROUSLY.</span></div>
      </section>

      <footer className="contact-section content-section" id="contact">
        <div className="section-index content-reveal"><span>06 — YOUR TURN</span><span>GOOD THINGS START WITH A CONVERSATION</span></div>
        <div className="contact-main content-reveal"><p className="eyebrow">HAVE A QUESTION, AN IDEA, OR JUST WANT TO SAY HELLO?</p><h2>Let&apos;s build<br /><span>something<br />meaningful<span className="blue-period">.</span></span></h2><p className="contact-note">Contact details and external links can be added when you&apos;re ready to share them.</p></div>
        <div className="footer-bottom"><a className="footer-name" href="#top">COHEN MARLEY<span>.</span></a><span>CYBERSECURITY / NETWORKING / ENGINEERING</span><a href="#top" className="back-top">BACK TO TOP <ArrowDown size={13} /></a><span>© 2026</span></div>
      </footer>
    </main>
  );
}
