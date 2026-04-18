'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

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
      varying float vAlpha;
      void main() {
        vAlpha = alpha;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (260.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;
    const fragmentShader = /* glsl */ `
      varying float vAlpha;
      uniform float uOpacity;
      void main() {
        vec2 c = gl_PointCoord - vec2(0.5);
        float d = length(c);
        if (d > 0.5) discard;
        float glow = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(1.0, 1.0, 1.0, glow * vAlpha * uOpacity);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: { uOpacity: { value: opacity } },
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
    const clock = new THREE.Clock();
    const animate = () => {
      const dt = clock.getDelta();
      mouse.x += (mouseTarget.x - mouse.x) * 0.04;
      mouse.y += (mouseTarget.y - mouse.y) * 0.04;

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
