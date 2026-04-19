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

    // Shared shader chunks — FBM noise + view/normal varyings for Fresnel rim.
    // DESIGN.md §6: rim lights at sub-0.1 opacity → implemented directly in
    // fragment via fresnel so the sphere reads as "light resolving from dark."
    const vertexShader = /* glsl */ `
      uniform float uTime;
      uniform float uProgress;
      varying float vDisp;
      varying vec3 vNormal;
      varying vec3 vViewDir;

      float hash(vec3 p) {
        p = fract(p * vec3(443.897, 441.423, 437.195));
        p += dot(p, p.yzx + 19.19);
        return fract((p.x + p.y) * p.z);
      }
      float vnoise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float n000 = hash(i);
        float n100 = hash(i + vec3(1.0, 0.0, 0.0));
        float n010 = hash(i + vec3(0.0, 1.0, 0.0));
        float n110 = hash(i + vec3(1.0, 1.0, 0.0));
        float n001 = hash(i + vec3(0.0, 0.0, 1.0));
        float n101 = hash(i + vec3(1.0, 0.0, 1.0));
        float n011 = hash(i + vec3(0.0, 1.0, 1.0));
        float n111 = hash(i + vec3(1.0, 1.0, 1.0));
        return mix(
          mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
          mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
          f.z
        );
      }
      float fbm(vec3 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 4; i++) {
          v += a * vnoise(p);
          p *= 2.03;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec3 pos = position;
        float radial = length(pos);
        float wave = sin(radial * 6.0 - uTime * 1.8) * 0.08;
        float wave2 = sin(pos.y * 4.0 + uTime * 0.9) * 0.05;
        float turbulence = (fbm(pos * 1.6 + uTime * 0.12) - 0.5) * 0.09;
        float disp = (wave + wave2 + turbulence) * (0.6 + uProgress * 1.4);
        pos += normal * disp;
        vDisp = disp;
        vNormal = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        vViewDir = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `;

    const fragmentShader = /* glsl */ `
      uniform float uTime;
      uniform float uProgress;
      uniform float uEdgeMix;
      varying float vDisp;
      varying vec3 vNormal;
      varying vec3 vViewDir;

      void main() {
        // Fresnel rim-light — DESIGN.md palette: warm off-white core,
        // waveform cyan rim. The rim glows only where normals face away
        // from camera, echoing the "luminous edges on black" philosophy.
        float fres = pow(1.0 - clamp(dot(vNormal, vViewDir), 0.0, 1.0), 2.6);
        vec3 warm = vec3(0.980, 0.951, 0.922);     // #f5f2ef warm off-white
        vec3 cyan = vec3(0.498, 1.000, 1.000);     // #7fffff waveform cyan
        float intensity = 0.26 + abs(vDisp) * 5.2 + uProgress * 0.18;
        vec3 col = mix(warm * intensity, cyan, fres * 0.78);

        // Single-pass chromatic split — scales with fresnel so the edges
        // refract warm-to-cyan without needing a post pass.
        float split = fres * 0.14;
        col.r *= 1.0 + split;
        col.b *= 1.0 + split * 0.55;

        float alpha = clamp(intensity * 0.8 + fres * 0.5, 0.05, 0.92);
        alpha = mix(alpha, 1.0, uEdgeMix * fres * 0.4);
        gl_FragColor = vec4(col, alpha);
      }
    `;

    // Solid inner mesh — warm-toned, fresnel-rim driven body.
    const solidMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uEdgeMix: { value: 0.0 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.FrontSide,
    });

    // Outer wireframe — cyan-biased edges for depth definition.
    const wireMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uEdgeMix: { value: 1.0 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      wireframe: true,
    });

    const mesh = new THREE.Mesh(geometry, solidMaterial);
    const wireMesh = new THREE.Mesh(geometry, wireMaterial);
    wireMesh.scale.setScalar(1.012);
    scene.add(mesh);
    scene.add(wireMesh);

    // Resize
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    // Animate — drive both solid + wire uniforms from a shared clock.
    let rafId = 0;
    const clock = new THREE.Clock();
    const solidUTime = solidMaterial.uniforms.uTime as THREE.IUniform<number>;
    const solidUProgress = solidMaterial.uniforms.uProgress as THREE.IUniform<number>;
    const wireUTime = wireMaterial.uniforms.uTime as THREE.IUniform<number>;
    const wireUProgress = wireMaterial.uniforms.uProgress as THREE.IUniform<number>;
    const tick = () => {
      const t = clock.getElapsedTime();
      const p = progressRef.current;
      solidUTime.value = t;
      solidUProgress.value = p;
      wireUTime.value = t;
      wireUProgress.value = p;
      if (!reduced) {
        const rotY = t * 0.12 + p * Math.PI;
        const rotX = Math.sin(t * 0.2) * 0.15 + p * 0.4;
        mesh.rotation.y = rotY;
        mesh.rotation.x = rotX;
        // Counter-rotate wire ever so slightly for a parallax edge feel.
        wireMesh.rotation.y = rotY * 0.985;
        wireMesh.rotation.x = rotX * 1.02;
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
      solidMaterial.dispose();
      wireMaterial.dispose();
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
