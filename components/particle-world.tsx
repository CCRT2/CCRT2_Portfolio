'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  attribute float aSeed;
  attribute float aSize;
  uniform float uTime;
  uniform float uScroll;
  uniform float uAspect;
  uniform float uMotionScale;
  uniform vec2 uPointer;
  varying float vAlpha;
  varying float vBlue;

  float hash(float n) { return fract(sin(n) * 43758.5453123); }

  void main() {
    float i = aSeed;
    float t = uTime * uMotionScale;
    float angle = i * 6.2831853;
    float phase = uScroll * 3.0;
    float radius = 1.1 + hash(i * 19.7) * mix(7.5, 5.2, smoothstep(0.0, 0.35, uScroll));

    vec3 cloud = vec3(cos(angle) * radius, (hash(i * 7.1) - 0.5) * 10.0, sin(angle) * radius * 0.68 + (hash(i * 2.3) - 0.5) * 5.0);
    float sphereAngle = i * 6.2831853 * 5.0;
    float sphereY = hash(i * 11.3) * 2.0 - 1.0;
    float sphereRadius = 3.0 + sin(i * 79.0) * 0.9;
    vec3 orbit = vec3(cos(sphereAngle) * sqrt(1.0 - sphereY * sphereY) * sphereRadius, sphereY * sphereRadius, sin(sphereAngle) * sqrt(1.0 - sphereY * sphereY) * sphereRadius);

    float waveX = (hash(i * 5.9) - 0.5) * 18.0;
    float waveZ = (hash(i * 13.1) - 0.5) * 7.0;
    vec3 wave = vec3(waveX, sin(waveX * 0.72 + waveZ + t * 0.8) * 2.5, waveZ);

    float networkAngle = angle * 5.0 + uScroll * 2.4;
    float networkRadius = 1.0 + hash(i * 17.7) * 5.3;
    vec3 network = vec3(cos(networkAngle) * networkRadius, sin(networkAngle * 1.7) * 2.5, sin(networkAngle) * networkRadius * 0.58);
    vec3 lattice = vec3((hash(i * 3.1) - 0.5) * 12.0, (hash(i * 4.7) - 0.5) * 7.0, (hash(i * 8.9) - 0.5) * 5.0);
    lattice += normalize(lattice + 0.001) * sin(t * 0.4 + i * 35.0) * 0.45;

    vec3 target = mix(cloud, orbit, smoothstep(0.05, 0.46, phase));
    target = mix(target, wave, smoothstep(0.76, 1.42, phase));
    target = mix(target, network, smoothstep(1.66, 2.36, phase));
    target = mix(target, lattice, smoothstep(2.42, 2.95, phase));

    float driftPhase = t + i * 49.0;
    vec3 drift = vec3(sin(driftPhase * 0.31) * 0.58 + cos(driftPhase * 0.17) * 0.22, cos(driftPhase * 0.27) * 0.5 + sin(driftPhase * 0.13) * 0.2, sin(driftPhase * 0.21) * 0.75);
    float swirl = t * (0.045 + hash(i * 3.7) * 0.065) + uScroll * 0.62;
    mat2 rotation = mat2(cos(swirl), -sin(swirl), sin(swirl), cos(swirl));
    target.xy = rotation * target.xy;
    target += drift;

    vec2 pointerWorld = uPointer * vec2(8.5 * min(uAspect, 1.5), 5.2);
    vec2 delta = target.xy - pointerWorld;
    float pointerForce = exp(-dot(delta, delta) * 0.13) * 0.95;
    target.xy += normalize(delta + vec2(0.0001)) * pointerForce;
    target.y += sin(target.x * 0.7 + t * 0.55 + i * 20.0) * (0.15 + uScroll * 0.34);

    vec3 edge = vec3(sign(cos(angle)) * (8.0 + hash(i) * 7.5), sign(sin(angle)) * (5.0 + hash(i * 3.0) * 5.0), (hash(i * 23.0) - 0.5) * 9.0);
    float reveal = smoothstep(0.0, 0.2, uScroll);
    vec3 pos = mix(edge, target, reveal);
    pos.x *= min(uAspect, 1.7);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = clamp(aSize * (35.0 / -mvPosition.z), 0.75, 4.5);
    float twinkle = 0.78 + 0.22 * sin(t * (0.8 + hash(i * 39.0)) + i * 71.0);
    vAlpha = (0.12 + 0.57 * hash(i * 29.0)) * twinkle * smoothstep(0.0, 0.18, uScroll);
    vBlue = smoothstep(0.78, 0.99, hash(i * 31.0) + 0.12 * sin(t + i * 9.0));
  }
`;

const fragmentShader = `
  varying float vAlpha;
  varying float vBlue;
  void main() {
    vec2 point = gl_PointCoord - 0.5;
    float distanceFromCenter = length(point);
    float core = smoothstep(0.5, 0.04, distanceFromCenter);
    float halo = smoothstep(0.5, 0.16, distanceFromCenter) * 0.2;
    vec3 silver = vec3(0.76, 0.81, 0.9);
    vec3 ice = vec3(0.36, 0.55, 1.0);
    vec3 color = mix(silver, ice, vBlue * 0.72);
    gl_FragColor = vec4(color, (core + halo) * vAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

type ParticleUniforms = {
  uTime: { value: number };
  uScroll: { value: number };
  uAspect: { value: number };
  uMotionScale: { value: number };
  uPointer: { value: THREE.Vector2 };
};

function ParticleField() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const targetScroll = useRef(0);
  const pointer = useRef(new THREE.Vector2(2, 2));
  const reducedMotion = useRef(false);
  const { size } = useThree();
  const count = useMemo(() => {
    const mobile = window.matchMedia('(max-width: 700px)').matches || navigator.hardwareConcurrency < 6;
    return mobile ? 9000 : 30000;
  }, []);
  const attributes = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      seeds[i] = (i + 0.5) / count;
      sizes[i] = 0.55 + ((i * 9301) % 100) / 100 * 1.75;
    }
    return { positions, seeds, sizes };
  }, [count]);

  useEffect(() => {
    const onScroll = (event: Event) => {
      targetScroll.current = (event as CustomEvent<{ progress: number }>).detail?.progress ?? 0;
    };
    const onPointer = (event: PointerEvent) => {
      pointer.current.set((event.clientX / window.innerWidth) * 2 - 1, 1 - (event.clientY / window.innerHeight) * 2);
    };
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => { reducedMotion.current = motionQuery.matches; };
    window.addEventListener('particle-scroll', onScroll);
    window.addEventListener('pointermove', onPointer, { passive: true });
    motionQuery.addEventListener('change', updateMotion);
    updateMotion();
    return () => {
      window.removeEventListener('particle-scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
      motionQuery.removeEventListener('change', updateMotion);
    };
  }, []);

  useFrame(({ clock }) => {
    if (!material.current) return;
    const uniforms = material.current.uniforms as ParticleUniforms;
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uScroll.value = THREE.MathUtils.damp(uniforms.uScroll.value, targetScroll.current, 2.2, 1 / 60);
    uniforms.uAspect.value = size.width / Math.max(size.height, 1);
    uniforms.uMotionScale.value = reducedMotion.current ? 0.3 : 1;
    uniforms.uPointer.value.lerp(pointer.current, 0.06);
  });

  const uniforms = useMemo<ParticleUniforms>(() => ({
    uTime: { value: 0 }, uScroll: { value: 0 }, uAspect: { value: 1 },
    uMotionScale: { value: 1 }, uPointer: { value: new THREE.Vector2(2, 2) },
  }), []);

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[attributes.positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[attributes.seeds, 1]} />
        <bufferAttribute attach="attributes-aSize" args={[attributes.sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial ref={material} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

export default function ParticleWorld() {
  return (
    <div className="particle-world" aria-hidden="true">
      <Canvas dpr={[1, 1.35]} gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }} camera={{ position: [0, 0, 12], fov: 48, near: 0.1, far: 80 }} fallback={<div className="particle-fallback" />}>
        <ParticleField />
      </Canvas>
    </div>
  );
}
