'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type Props = {
  className?: string;
  /** Optional scroll progress (0–1). When provided, drives rotation/deformation. */
  progress?: number;
};

/**
 * Scene3D — abstract sound-wave mesh (icosphere distorted by radial sine waves).
 * Renders as a wireframe with additive blending — reads as light resolving from dark.
 * Intended for dynamic import: `dynamic(() => import('./Scene3D'), { ssr: false })`.
 */
export default function Scene3D({ className, progress = 0 }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'low-power',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Geometry — a high-subdivision icosphere
    const geometry = new THREE.IcosahedronGeometry(1.6, 32);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
      },
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uProgress;
        varying float vDisp;

        // Simple hash noise
        float hash(vec3 p) {
          p = fract(p * vec3(443.897, 441.423, 437.195));
          p += dot(p, p.yzx + 19.19);
          return fract((p.x + p.y) * p.z);
        }

        void main() {
          vec3 pos = position;
          float radial = length(pos);
          float wave = sin(radial * 6.0 - uTime * 1.8) * 0.08;
          float wave2 = sin(pos.y * 4.0 + uTime * 0.9) * 0.05;
          float ripple = hash(pos * 2.0 + uTime * 0.2) * 0.04;
          float disp = (wave + wave2 + ripple) * (0.6 + uProgress * 1.4);
          pos += normal * disp;
          vDisp = disp;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vDisp;
        void main() {
          float intensity = 0.35 + abs(vDisp) * 6.0;
          gl_FragColor = vec4(1.0, 1.0, 1.0, clamp(intensity, 0.08, 0.9));
        }
      `,
      wireframe: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Resize
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    // Animate
    let rafId = 0;
    const clock = new THREE.Clock();
    const uTime = material.uniforms.uTime as THREE.IUniform<number>;
    const uProgress = material.uniforms.uProgress as THREE.IUniform<number>;
    const tick = () => {
      const t = clock.getElapsedTime();
      uTime.value = t;
      uProgress.value = progressRef.current;
      if (!reduced) {
        mesh.rotation.y = t * 0.12 + progressRef.current * Math.PI;
        mesh.rotation.x = Math.sin(t * 0.2) * 0.15 + progressRef.current * 0.4;
      }
      renderer.render(scene, camera);
      if (!reduced) rafId = requestAnimationFrame(tick);
    };
    tick();

    const gl = renderer.getContext();
    const loseExt = gl.getExtension('WEBGL_lose_context');

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (loseExt) loseExt.loseContext();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={className}
      aria-hidden="true"
    />
  );
}
