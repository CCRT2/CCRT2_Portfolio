'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  attribute float aSeed;
  attribute float aSize;
  uniform float uTime;
  uniform float uScroll;
  uniform float uAspect;
  uniform float uMotionScale;
  varying float vAlpha;
  varying float vBlue;

  float hash(float n) { return fract(sin(n) * 43758.5453123); }

  void main() {
    float i = aSeed;
    float t = uTime * uMotionScale;
    float angle = i * 6.2831853;
    float radius = 1.0 + hash(i * 19.7) * 7.0;

    vec3 cloud = vec3(
      cos(angle) * radius,
      (hash(i * 7.1) - 0.5) * 10.0,
      sin(angle) * radius * 0.68 + (hash(i * 2.3) - 0.5) * 5.0
    );

    float sphereAngle = i * 6.2831853 * 5.0;
    float sphereY = hash(i * 11.3) * 2.0 - 1.0;
    float sphereRadius = 3.2 + sin(i * 79.0) * 0.8;
    vec3 orbit = vec3(
      cos(sphereAngle) * sqrt(1.0 - sphereY * sphereY) * sphereRadius,
      sphereY * sphereRadius,
      sin(sphereAngle) * sqrt(1.0 - sphereY * sphereY) * sphereRadius
    );

    float waveX = (hash(i * 5.9) - 0.5) * 17.0;
    float waveZ = (hash(i * 13.1) - 0.5) * 6.0;
    vec3 wave = vec3(waveX, sin(waveX * 0.72 + waveZ + t * 0.7) * 2.1, waveZ);

    float ringAngle = angle * 5.0 + uScroll * 2.5;
    float ringRadius = 1.0 + hash(i * 17.7) * 5.1;
    vec3 network = vec3(cos(ringAngle) * ringRadius, sin(ringAngle * 1.7) * 2.4, sin(ringAngle) * ringRadius * 0.55);

    float phase = uScroll * 3.0;
    vec3 target = mix(cloud, orbit, smoothstep(0.08, 0.42, phase));
    target = mix(target, wave, smoothstep(0.8, 1.4, phase));
    target = mix(target, network, smoothstep(1.8, 2.65, phase));

    vec3 drift = vec3(
      sin(t * 0.33 + i * 43.0) * 0.55 + cos(t * 0.17 + i * 9.0) * 0.25,
      cos(t * 0.29 + i * 31.0) * 0.52 + sin(t * 0.13 + i * 17.0) * 0.2,
      sin(t * 0.21 + i * 23.0) * 0.8
    );
    float swirl = t * (0.055 + hash(i * 3.7) * 0.06) + uScroll * 0.7;
    mat2 rotation = mat2(cos(swirl), -sin(swirl), sin(swirl), cos(swirl));
    target.xy = rotation * target.xy;
    target += drift;

    vec3 edge = vec3(sign(cos(angle)) * (8.0 + hash(i) * 7.0),
                     sign(sin(angle)) * (5.0 + hash(i * 3.0) * 5.0),
                     (hash(i * 23.0) - 0.5) * 8.0);
    float reveal = smoothstep(0.0, 0.16, uScroll + min(uTime * 0.001, 0.018));
    vec3 pos = mix(edge, target, reveal);
    pos.x *= min(uAspect, 1.7);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aSize * (34.0 / -mvPosition.z);
    gl_PointSize = clamp(gl_PointSize, 1.0, 5.0);
    vAlpha = (0.16 + 0.58 * hash(i * 29.0)) * (0.72 + 0.28 * sin(t * 1.4 + i * 83.0));
    vAlpha *= smoothstep(0.0, 0.13, uScroll + min(uTime * 0.001, 0.018));
    vBlue = smoothstep(0.78, 0.99, hash(i * 31.0) + 0.1 * sin(t + i * 9.0));
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying float vAlpha;
  varying float vBlue;
  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float d = length(p);
    float core = smoothstep(0.5, 0.03, d);
    float halo = smoothstep(0.5, 0.15, d) * 0.24;
    vec3 silver = vec3(0.78, 0.83, 0.91);
    vec3 blue = vec3(0.28, 0.48, 1.0);
    vec3 color = mix(silver, blue, vBlue * 0.72);
    float pulse = 0.82 + 0.18 * sin(uTime * 1.1 + gl_FragCoord.x * 0.02);
    gl_FragColor = vec4(color * (core + halo) * pulse, (core + halo) * vAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function ParticleField() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const targetScroll = useRef(0);
  const reducedMotion = useRef(false);
  const count = 22000;
  const attributes = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      const seed = (i + 0.5) / count;
      seeds[i] = seed;
      sizes[i] = 0.65 + ((i * 9301) % 100) / 100 * 1.8;
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
    }
    return { positions, seeds, sizes };
  }, []);

  useEffect(() => {
    const onScroll = (event: Event) => {
      const custom = event as CustomEvent<{ progress: number }>;
      targetScroll.current = custom.detail?.progress ?? 0;
    };
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => { reducedMotion.current = motionQuery.matches; };
    window.addEventListener('particle-scroll', onScroll);
    motionQuery.addEventListener('change', updateMotion);
    updateMotion();
    return () => {
      window.removeEventListener('particle-scroll', onScroll);
      motionQuery.removeEventListener('change', updateMotion);
    };
  }, []);

  useFrame(({ clock, size }) => {
    if (!material.current) return;
    const uniforms = material.current.uniforms;
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uScroll.value = THREE.MathUtils.damp(uniforms.uScroll.value, targetScroll.current, 2.4, 1 / 60);
    uniforms.uAspect.value = size.width / Math.max(size.height, 1);
    uniforms.uMotionScale.value = reducedMotion.current ? 0.38 : 1.0;
  });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uAspect: { value: 1 },
    uMotionScale: { value: 1 },
  }), []);

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[attributes.positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[attributes.seeds, 1]} />
        <bufferAttribute attach="attributes-aSize" args={[attributes.sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ParticleWorld() {
  return (
    <div className="particle-world" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 12], fov: 48, near: 0.1, far: 80 }}
        fallback={<div className="particle-fallback" />}
      >
        <ParticleField />
      </Canvas>
    </div>
  );
}
