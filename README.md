# Cohen Marley — The Living Particle Portfolio

A portfolio environment built with Next.js, TypeScript, React Three Fiber, Three.js, GLSL, GSAP ScrollTrigger, and Lenis. Time continuously animates the GPU-rendered particle field; scroll and pointer position influence its evolving compositions.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content

Project entries in `content/projects.ts` are starter directions, not claims about completed work. Replace them with real projects, technologies, repositories, demos, and documentation when ready. Add only experience, qualifications, and contact links that Cohen chooses to publish.

## Experience notes

The particle layer is decorative to assistive technology; the portfolio content remains semantic HTML. The shader continuously animates independently of scrolling, and scroll progress reversibly changes its procedural compositions. Particle count is reduced on narrow or lower-core-count devices. Reduced-motion mode lowers simulation speed; the project information remains available if WebGL is unavailable.
