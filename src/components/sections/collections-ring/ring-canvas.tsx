"use client";

/*
 * React Three Fiber's frame loop is imperative by design: `useFrame` mutates Three.js objects and
 * a shared motion ref outside React's render phase. The React Compiler immutability rule can't
 * see that boundary, so it's disabled for this file only.
 */
/* eslint-disable react-hooks/immutability */

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type Props = {
  images: string[];
  activeIndex: number;
  onActiveChange: (i: number) => void;
  /** Pause rendering entirely while the section is off screen. */
  running: boolean;
  /** Idle rotation in radians/second. */
  autoSpeed: number;
};

const RADIUS = 3.2;
const HEIGHT = 3;
const GAP = 0.1; // fraction of each slice left empty
const TAU = Math.PI * 2;

/** Route textures through Next's image optimizer: same-origin (no CORS) and right-sized. */
const optimized = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=640&q=75`;

type Motion = { rot: number; vel: number; auto: number; target: number | null; dragging: boolean; lastX: number };

function Panel({ texture, index, count }: { texture: THREE.Texture; index: number; count: number }) {
  const slice = TAU / count;
  const geometry = useMemo(
    () => new THREE.CylinderGeometry(RADIUS, RADIUS, HEIGHT, 24, 1, true, index * slice + (slice * GAP) / 2, slice * (1 - GAP)),
    [index, slice],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry} userData={{ index }}>
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  );
}

function Ring({ images, motion, onFront }: { images: string[]; motion: React.RefObject<Motion>; onFront: (i: number) => void }) {
  const textures = useLoader(THREE.TextureLoader, images.map(optimized));
  const group = useRef<THREE.Group>(null);
  const front = useRef(-1);
  const count = images.length;
  const slice = TAU / count;

  // "Cover" fit each photo onto its curved panel.
  useEffect(() => {
    const panelAspect = (RADIUS * slice * (1 - GAP)) / HEIGHT;
    for (const tex of textures) {
      const img = tex.image as { width: number; height: number };
      const imgAspect = img.width / img.height;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      if (imgAspect > panelAspect) {
        tex.repeat.set(panelAspect / imgAspect, 1);
        tex.offset.set((1 - tex.repeat.x) / 2, 0);
      } else {
        tex.repeat.set(1, imgAspect / panelAspect);
        tex.offset.set(0, (1 - tex.repeat.y) / 2);
      }
      tex.needsUpdate = true;
    }
  }, [textures, slice]);

  useFrame((_, dt) => {
    const m = motion.current;
    const g = group.current;
    if (!m || !g) return;
    const step = Math.min(dt, 1 / 30);
    if (m.target !== null && !m.dragging) {
      m.rot += (m.target - m.rot) * Math.min(1, step * 5);
      if (Math.abs(m.target - m.rot) < 0.001) m.target = null;
    } else if (!m.dragging) {
      m.rot += (m.auto + m.vel) * step;
      m.vel *= Math.pow(0.04, step); // inertia decay
    }
    g.rotation.y = m.rot;

    // Dim panels as they turn away from the camera for depth.
    g.children.forEach((child) => {
      const mesh = child as THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
      const i = mesh.userData.index as number;
      const angle = i * slice + slice / 2 + m.rot;
      const facing = Math.cos(angle); // 1 = facing camera
      mesh.material.color.setScalar(0.18 + 0.82 * Math.max(0, facing) ** 1.4);
    });

    const idx = ((Math.round(((-m.rot % TAU) + TAU) % TAU / slice - 0.5) % count) + count) % count;
    if (idx !== front.current) {
      front.current = idx;
      onFront(idx);
    }
  });

  return (
    <group ref={group} rotation={[0.06, 0, 0]}>
      {textures.map((t, i) => (
        <Panel key={i} texture={t} index={i} count={count} />
      ))}
    </group>
  );
}

export default function RingCanvas({ images, activeIndex, onActiveChange, running, autoSpeed }: Props) {
  const motion = useRef<Motion>({ rot: 0, vel: 0, auto: autoSpeed, target: null, dragging: false, lastX: 0 });
  const emitted = useRef(0);
  const slice = TAU / images.length;
  useEffect(() => {
    motion.current.auto = autoSpeed;
  }, [autoSpeed]);

  // External selection (hovering the list) → rotate that panel to the front by the shortest path.
  useEffect(() => {
    if (activeIndex === emitted.current) return;
    const m = motion.current;
    const desired = -(activeIndex * slice + slice / 2);
    const delta = ((((desired - m.rot) % TAU) + TAU + Math.PI) % TAU) - Math.PI;
    m.target = m.rot + delta;
    m.vel = 0;
    emitted.current = activeIndex;
  }, [activeIndex, slice]);

  const onFront = (i: number) => {
    emitted.current = i;
    onActiveChange(i);
  };

  return (
    <div
      className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
      aria-hidden
      onPointerDown={(e) => {
        const m = motion.current;
        m.dragging = true;
        m.target = null;
        m.lastX = e.clientX;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        const m = motion.current;
        if (!m.dragging) return;
        const dx = e.clientX - m.lastX;
        m.lastX = e.clientX;
        m.rot += dx * 0.006;
        m.vel = dx * 0.35;
      }}
      onPointerUp={() => (motion.current.dragging = false)}
      onPointerCancel={() => (motion.current.dragging = false)}
    >
      <Canvas
        frameloop={running ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.6, 9.5], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        <Suspense fallback={null}>
          <Ring images={images} motion={motion} onFront={onFront} />
        </Suspense>
      </Canvas>
    </div>
  );
}

