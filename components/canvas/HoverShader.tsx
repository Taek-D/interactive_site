'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

type Props = {
  /** Same poster URL used by the underlying <Image> (no double-download). */
  src: string;
  /** 0 → resting, 1 → active (hover). Smoothed internally. */
  active: boolean;
  className?: string;
};

/**
 * HoverShader (R3F edition, Cycle 2)
 * ─────────────────────────────────────────────────────────────────
 * A full-bleed quad mapped to the poster image, distorted by a
 * mouse-tracked ripple + RGB split. Cycle 2 upgrade vs raw Three:
 *   • Declarative R3F graph (no manual renderer/scene/camera lifecycle)
 *   • <EffectComposer> adds a real bloom pass on the chromatic
 *     fringes so they shimmer instead of just splitting.
 *   • Conditional mount still carried over from Cycle 1 — idle
 *     cards spend 0 GPU cycles because this component only exists
 *     in the DOM while its parent card is hovered.
 *
 * Under reduce-motion the parent <Portfolio> doesn't mount this at
 * all (the intent is a kinetic effect, so freezing it would misread
 * as "just the static image").
 */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    // Draw directly in clip space — the orthographic camera below is
    // sized 1:1 with this quad so positions pass through untouched.
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uTime;
  uniform float uActive;
  uniform vec2 uMouse;
  uniform float uAspect;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec2 dUv = uv - uMouse;
    dUv.x *= uAspect;
    float dist = length(dUv);
    float ripple = sin(dist * 22.0 - uTime * 4.2)
                  * 0.014
                  * smoothstep(0.55, 0.0, dist)
                  * uActive;
    vec2 warpedUv = uv + normalize(dUv + vec2(1e-5)) * ripple;

    float split = 0.009 * uActive;
    vec2 dir = normalize(dUv + vec2(1e-5));
    float r = texture2D(uTex, warpedUv + dir * split).r;
    float g = texture2D(uTex, warpedUv).g;
    float b = texture2D(uTex, warpedUv - dir * split).b;

    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

function HoverQuad({ src, activeRef }: { src: string; activeRef: React.MutableRefObject<number> }) {
  const { size, gl } = useThree();
  const mouseTarget = useRef(new THREE.Vector2(0.5, 0.5));
  const smoothedActiveRef = useRef(0);

  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    const t = loader.load(src, () => gl.getContext() && (t.needsUpdate = true));
    t.colorSpace = THREE.SRGBColorSpace;
    t.minFilter = THREE.LinearFilter;
    return t;
  }, [src, gl]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTex: { value: texture },
          uTime: { value: 0 },
          uActive: { value: 0 },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uAspect: { value: size.width / Math.max(1, size.height) },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
      }),
    [texture, size.width, size.height],
  );

  // Extract typed uniform handles once — TS strict rejects the nested
  // `material.uniforms.x.value` chain because it can't prove each step
  // is defined. The aliases below are IUniform instances, so `.value`
  // is guaranteed.
  const uTime = material.uniforms.uTime as THREE.IUniform<number>;
  const uActive = material.uniforms.uActive as THREE.IUniform<number>;
  const uAspect = material.uniforms.uAspect as THREE.IUniform<number>;
  const uMouseUniform = material.uniforms.uMouse as THREE.IUniform<THREE.Vector2>;

  useFrame(({ clock }) => {
    uTime.value = clock.getElapsedTime();
    smoothedActiveRef.current +=
      (activeRef.current - smoothedActiveRef.current) * 0.12;
    uActive.value = smoothedActiveRef.current;
    const m = uMouseUniform.value;
    const t = mouseTarget.current;
    m.x += (t.x - m.x) * 0.08;
    m.y += (t.y - m.y) * 0.08;
    uAspect.value = size.width / Math.max(1, size.height);
  });

  useEffect(() => {
    return () => {
      texture.dispose();
      material.dispose();
    };
  }, [texture, material]);

  return (
    <mesh
      onPointerMove={(e) => {
        const uv = e.uv;
        if (uv) mouseTarget.current.set(uv.x, uv.y);
      }}
    >
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export function HoverShader({ src, active, className }: Props) {
  const activeRef = useRef(active ? 1 : 0);
  activeRef.current = active ? 1 : 0;

  // If reduced-motion is set, Portfolio doesn't render this at all.
  // But keep a defensive short-circuit so the component is safe in
  // isolation too.
  if (typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }

  return (
    <div className={className} aria-hidden="true" style={{ width: '100%', height: '100%' }}>
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], near: 0, far: 1, zoom: 1 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
        dpr={[1, 1.5]}
      >
        <HoverQuad src={src} activeRef={activeRef} />
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.6}
            luminanceThreshold={0.45}
            luminanceSmoothing={0.25}
            mipmapBlur
            blendFunction={BlendFunction.SCREEN}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
