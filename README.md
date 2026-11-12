# Cohen Marley — Continuous Particle-World Portfolio

A continuously evolving portfolio environment built with Next.js, TypeScript, React Three Fiber, Three.js, custom GLSL shaders, GSAP ScrollTrigger, and Tailwind CSS. Its GPU-rendered particle field stays in motion independently of scrolling; scroll progress shifts the particles through procedural orbital, wave, and network-like compositions.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The WebGL canvas is decorative and hidden from assistive technology. Portfolio text and links remain accessible HTML. The simulation adapts to reduced-motion preferences by lowering movement speed while keeping the field alive.
