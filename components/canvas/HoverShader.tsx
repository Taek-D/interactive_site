'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type Props = {
  /** Source URL for the image to distort — expected to be the same poster
   * used by <Image> so there's no double-download. */
  src: string;
  /** 0 → resting, 1 → active (hover). Smoothed internally. */
  active: boolean;
  className?: string;
};

/**
 * HoverShader — a minimal full-bleed orthographic quad that maps the poster
 * image as a texture and applies a mouse-tracked ripple + RGB split in a
 * single fragment-shader pass. Mounted conditionally (only while the card
 * is hovered) so the page never holds more than one extra WebGL context.
 *
 * Reduced-motion: renders nothing (returns an empty aria-hidden div),
 * relying on the underlying <Image> layer to handle the visual.
 */
export function HoverShader({ src, active, className }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef(active ? 1 : 0);
  activeRef.current = active ? 1 : 0;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    const texture = loader.load(src);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTex: { value: texture },
        uTime: { value: 0 },
        uActive: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uAspect: { value: mount.clientWidth / mount.clientHeight },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uTex;
        uniform float uTime;
        uniform float uActive;
        uniform vec2 uMouse;
        uniform float uAspect;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv;
          // Normalize so the mouse-distance field is circular regardless of
          // card aspect (landscape/portrait/wide/square all present here).
          vec2 dUv = uv - uMouse;
          dUv.x *= uAspect;
          float dist = length(dUv);

          // Expanding ripple centered on the cursor — fades with distance
          // and scales entirely by uActive so resting state is pristine.
          float ripple = sin(dist * 22.0 - uTime * 4.2)
                        * 0.014
                        * smoothstep(0.55, 0.0, dist)
                        * uActive;
          vec2 warpedUv = uv + normalize(dUv + vec2(1e-5)) * ripple;

          // Chromatic split — also scaled by uActive. Direction follows
          // the cursor vector so the fringe "leans" toward the pointer.
          float split = 0.008 * uActive;
          vec2 dir = normalize(dUv + vec2(1e-5));
          float r = texture2D(uTex, warpedUv + dir * split).r;
          float g = texture2D(uTex, warpedUv).g;
          float b = texture2D(uTex, warpedUv - dir * split).b;

          gl_FragColor = vec4(r, g, b, 1.0);
        }
      `,
      transparent: true,
    });

    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    // Pointer tracking in UV space (0..1).
    const mouse = { x: 0.5, y: 0.5 };
    const onPointerMove = (e: PointerEvent) => {
      const r = mount.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) / r.width;
      mouse.y = 1 - (e.clientY - r.top) / r.height;
    };
    mount.addEventListener('pointermove', onPointerMove, { passive: true });

    const uAspect = material.uniforms.uAspect as THREE.IUniform<number>;
    const onResize = () => {
      if (!mount) return;
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      uAspect.value = mount.clientWidth / mount.clientHeight;
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    // Render loop — smooths mouse + activity for soft-feeling motion.
    const clock = new THREE.Clock();
    let rafId = 0;
    const uTime = material.uniforms.uTime as THREE.IUniform<number>;
    const uActive = material.uniforms.uActive as THREE.IUniform<number>;
    const uMouseUniform = material.uniforms.uMouse as THREE.IUniform<THREE.Vector2>;
    const uMouse = uMouseUniform.value;
    let smoothedActive = 0;
    const tick = () => {
      uTime.value = clock.getElapsedTime();
      smoothedActive += (activeRef.current - smoothedActive) * 0.12;
      uActive.value = smoothedActive;
      uMouse.x += (mouse.x - uMouse.x) * 0.08;
      uMouse.y += (mouse.y - uMouse.y) * 0.08;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };
    tick();

    const gl = renderer.getContext();
    const loseExt = gl.getExtension('WEBGL_lose_context');

    return () => {
      cancelAnimationFrame(rafId);
      mount.removeEventListener('pointermove', onPointerMove);
      ro.disconnect();
      texture.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (loseExt) loseExt.loseContext();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [src]);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
