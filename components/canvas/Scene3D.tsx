'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Noise,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';

type Props = {
  className?: string;
  /** Scroll progress (0–1). Drives displacement + color intensity. */
  progress?: number;
};

/**
 * Scene3D (R3F edition, Cycle 2)
 * ─────────────────────────────────────────────────────────────────
 * Raw Three.js has been swapped for a React-Three-Fiber graph:
 *   <Canvas>
 *     <Float>                              ← drei — organic drift
 *       <mesh> solid shader (FBM+Fresnel)
 *       <mesh> wireframe shader (edge rim)
 *     </Float>
 *     <EffectComposer>                     ← @react-three/postprocessing
 *       <Bloom> <ChromaticAberration> <Vignette> <Noise>
 *     </EffectComposer>
 *   </Canvas>
 *
 * The FBM + Fresnel + warm/cyan palette shaders carry over from the
 * Cycle 1 raw-Three implementation unchanged — they're the visual
 * signature. Postprocessing now amplifies the luminous rim into an
 * actual bloom pass, adds a page-wide chromatic fringe, a quiet
 * vignette to anchor the sphere in the void, and film grain.
 *
 * Reduced-motion: we flip Canvas frameloop to "demand" and render a
 * single developed frame (uTime=0.9, uProgress=0.2, pre-rotated group),
 * matching the Cycle 1 reduce-motion fallback.
 */

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
    float fres = pow(1.0 - clamp(dot(vNormal, vViewDir), 0.0, 1.0), 2.6);
    vec3 warm = vec3(0.980, 0.951, 0.922);
    vec3 cyan = vec3(0.498, 1.000, 1.000);
    float intensity = 0.26 + abs(vDisp) * 5.2 + uProgress * 0.18;
    vec3 col = mix(warm * intensity, cyan, fres * 0.78);

    // Per-fragment RGB split now lighter — bloom + CA post pass does
    // the heavy lifting for chromatic fringing in the Cycle 2 build.
    float split = fres * 0.08;
    col.r *= 1.0 + split;
    col.b *= 1.0 + split * 0.55;

    float alpha = clamp(intensity * 0.8 + fres * 0.5, 0.05, 0.92);
    alpha = mix(alpha, 1.0, uEdgeMix * fres * 0.4);
    gl_FragColor = vec4(col, alpha);
  }
`;

function SoundSphere({
  progressRef,
  reduced,
}: {
  progressRef: React.MutableRefObject<number>;
  reduced: boolean;
}) {
  const { invalidate } = useThree();

  const { solidMat, wireMat } = useMemo(() => {
    const make = (edgeMix: number, wireframe: boolean) => {
      const m = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: reduced ? 0.9 : 0 },
          uProgress: { value: reduced ? 0.2 : 0 },
          uEdgeMix: { value: edgeMix },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      m.wireframe = wireframe;
      return m;
    };
    return { solidMat: make(0, false), wireMat: make(1, true) };
  }, [reduced]);

  // TS strict rejects `material.uniforms.x.value` — alias each as
  // IUniform so `.value` is typed non-nullable.
  const solidUTime = solidMat.uniforms.uTime as THREE.IUniform<number>;
  const solidUProgress = solidMat.uniforms.uProgress as THREE.IUniform<number>;
  const wireUTime = wireMat.uniforms.uTime as THREE.IUniform<number>;
  const wireUProgress = wireMat.uniforms.uProgress as THREE.IUniform<number>;

  useFrame(({ clock }) => {
    const t = reduced ? 0.9 : clock.getElapsedTime();
    const p = reduced ? 0.2 : progressRef.current;
    solidUTime.value = t;
    solidUProgress.value = p;
    wireUTime.value = t;
    wireUProgress.value = p;
  });

  useEffect(() => {
    if (reduced) invalidate();
    return () => {
      solidMat.dispose();
      wireMat.dispose();
    };
  }, [reduced, invalidate, solidMat, wireMat]);

  const meshes = (
    <>
      <mesh>
        <icosahedronGeometry args={[1.6, 32]} />
        <primitive object={solidMat} attach="material" />
      </mesh>
      <mesh scale={1.012}>
        <icosahedronGeometry args={[1.6, 32]} />
        <primitive object={wireMat} attach="material" />
      </mesh>
    </>
  );

  if (reduced) {
    // Pre-tilt the group so the single static frame reads as volumetric.
    return <group rotation={[0.18, 0.55, 0]}>{meshes}</group>;
  }

  return (
    <Float speed={1.2} floatIntensity={0.4} rotationIntensity={0.3}>
      {meshes}
    </Float>
  );
}

export default function Scene3D({ className, progress = 0 }: Props) {
  const reduced = useReducedMotion() ?? false;
  const progressRef = useRef(progress);
  progressRef.current = progress;

  return (
    <div className={className} aria-hidden="true" style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        dpr={[1, 1.75]}
        frameloop={reduced ? 'demand' : 'always'}
      >
        <SoundSphere progressRef={progressRef} reduced={reduced} />
        <EffectComposer multisampling={0} enabled={!reduced}>
          <Bloom
            intensity={0.7}
            luminanceThreshold={0.18}
            luminanceSmoothing={0.22}
            mipmapBlur
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={[0.0012, 0.0015] as unknown as THREE.Vector2}
            radialModulation={false}
            modulationOffset={0}
          />
          <Vignette eskil={false} offset={0.1} darkness={0.6} />
          <Noise premultiply opacity={0.04} blendFunction={BlendFunction.SCREEN} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
