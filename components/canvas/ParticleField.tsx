'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { readScrollVelocity } from './useScrollVelocity';

type Props = {
  density?: number;
  /** Opacity multiplier (0–1). */
  opacity?: number;
  /** Rotation speed (rad/frame). Default is very slow. */
  rotationSpeed?: number;
  className?: string;
};

/**
 * ParticleField — Three.js points cloud with additive blending and mouse-reactive drift.
 * Intended to be mounted via `dynamic(() => import('…'), { ssr: false, loading: Fallback })`
 * to keep the initial JS bundle slim.
 */
export default function ParticleField({
  density = 3000,
  opacity = 0.85,
  rotationSpeed = 0.0006,
  className,
}: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Respect reduced motion: render a static frame only.
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      58,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 0, 70);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'low-power',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Adjust particle count by viewport
    const isSmall = window.innerWidth < 768;
    const count = isSmall ? Math.round(density * 0.4) : density;

    // Particle geometry — sphere volume distribution
    const positions = new Float32Array(count * 3);
    const alphas = new Float32Array(count);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const r = Math.cbrt(Math.random()) * 60 + 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      alphas[i] = 0.15 + Math.random() * 0.7;
      sizes[i] = 0.6 + Math.random() * 1.6;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const vertexShader = /* glsl */ `
      attribute float alpha;
      attribute float size;
      uniform vec2 uMouseWorld;
      uniform float uVelocity;
      varying float vAlpha;
      varying float vProximity;
      void main() {
        vec3 pos = position;
        // Mouse attractor — NDC mouse mapped to a world-space anchor
        // at the particle cloud's approximate depth. Particles within
        // the attraction radius drift toward the cursor, giving the
        // field a volumetric cursor-parallax response.
        vec3 mouseAnchor = vec3(uMouseWorld, 0.0);
        vec3 toMouse = mouseAnchor - pos;
        float dist = length(toMouse);
        float attract = smoothstep(38.0, 0.0, dist);
        pos += normalize(toMouse + vec3(1e-5)) * attract * 5.5;
        vProximity = attract;
        vAlpha = alpha;
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        // Velocity-driven size swell — faster scroll → larger, brighter glow.
        float velocityBoost = 1.0 + clamp(abs(uVelocity) * 0.55, 0.0, 2.2);
        gl_PointSize = size * velocityBoost * (260.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;
    const fragmentShader = /* glsl */ `
      varying float vAlpha;
      varying float vProximity;
      uniform float uOpacity;
      void main() {
        vec2 c = gl_PointCoord - vec2(0.5);
        float d = length(c);
        if (d > 0.5) discard;
        // Dual-falloff soft halo — core highlight + outer bloom mimic a
        // bloom pass without an actual post-processing stage.
        float core = smoothstep(0.5, 0.0, d);
        float halo = smoothstep(0.5, 0.15, d);
        float glow = core * 0.72 + halo * 0.38;
        float boost = 1.0 + vProximity * 0.9;
        gl_FragColor = vec4(1.0, 1.0, 1.0, glow * vAlpha * uOpacity * boost);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uOpacity: { value: opacity },
        uMouseWorld: { value: new THREE.Vector2(0, 0) },
        uVelocity: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Mouse reactive drift
    const mouse = new THREE.Vector2(0, 0);
    const mouseTarget = new THREE.Vector2(0, 0);

    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      mouseTarget.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseTarget.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // Resize
    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    // Animation loop
    let rafId = 0;
    let smoothedVelocity = 0;
    const uMouseWorldUniform = material.uniforms.uMouseWorld as THREE.IUniform<THREE.Vector2>;
    const uMouseWorld = uMouseWorldUniform.value;
    const uVelocity = material.uniforms.uVelocity as THREE.IUniform<number>;
    const clock = new THREE.Clock();
    const animate = () => {
      const dt = clock.getDelta();
      mouse.x += (mouseTarget.x - mouse.x) * 0.04;
      mouse.y += (mouseTarget.y - mouse.y) * 0.04;

      // Project NDC mouse to the particle cloud's approximate world plane.
      // 40 × 25 matches the cloud's sphere volume from lines above.
      uMouseWorld.x = mouse.x * 40.0;
      uMouseWorld.y = mouse.y * 25.0;

      // Lenis publishes pixel/frame velocity on window.__lenis.
      // Smoothing keeps the particle-size response from flickering.
      const v = readScrollVelocity();
      smoothedVelocity += (v - smoothedVelocity) * 0.12;
      uVelocity.value = smoothedVelocity;

      if (!reducedMotion) {
        points.rotation.y += rotationSpeed + dt * 0.05;
        points.rotation.x = mouse.y * 0.18;
        points.rotation.z = mouse.x * 0.05;
      }

      renderer.render(scene, camera);
      if (!reducedMotion) rafId = requestAnimationFrame(animate);
    };
    animate();

    // Lose-context guard for aggressive tab switching
    const gl = renderer.getContext();
    const loseExt = gl.getExtension('WEBGL_lose_context');

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (loseExt) loseExt.loseContext();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [density, opacity, rotationSpeed]);

  return (
    <div
      ref={mountRef}
      className={className}
      aria-hidden="true"
    />
  );
}
