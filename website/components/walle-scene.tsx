"use client";

import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

function InugamiBody() {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Mesh>(null);

  const spiritMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#d4d0c8",
        roughness: 0.6,
        metalness: 0.1,
        transparent: true,
        opacity: 0.88,
      }),
    []
  );

  const innerGlowMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        emissive: "#ffffff",
        emissiveIntensity: 0.2,
        roughness: 0.3,
        metalness: 0.2,
        transparent: true,
        opacity: 0.35,
      }),
    []
  );

  const eyeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        emissive: "#ffffff",
        emissiveIntensity: 1.0,
        roughness: 0.1,
        metalness: 0.5,
      }),
    []
  );

  const noseMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1a1a1a",
        roughness: 0.8,
        metalness: 0.1,
      }),
    []
  );

  const metalMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#888",
        roughness: 0.3,
        metalness: 0.9,
        transparent: true,
        opacity: 0.7,
      }),
    []
  );

  const woodMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#8B6914",
        roughness: 0.85,
        metalness: 0.1,
        transparent: true,
        opacity: 0.6,
      }),
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.4) * 0.12;
      headRef.current.rotation.x = Math.sin(t * 0.25) * 0.04;
    }
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(t * 1.2) * 0.12;
    }
    if (groupRef.current) {
      groupRef.current.position.y = -0.5 + Math.sin(t * 0.8) * 0.025;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Body */}
      <mesh position={[0, 1.0, 0]} scale={[0.9, 0.7, 0.55]} material={spiritMaterial}>
        <sphereGeometry args={[1, 16, 12]} />
      </mesh>
      <mesh position={[0, 1.0, 0]} scale={[0.7, 0.55, 0.4]} material={innerGlowMaterial}>
        <sphereGeometry args={[1, 12, 8]} />
      </mesh>
      {/* Chest */}
      <mesh position={[0, 0.95, 0.35]} scale={[0.6, 0.55, 0.35]} material={spiritMaterial}>
        <sphereGeometry args={[1, 12, 8]} />
      </mesh>
      {/* Head */}
      <group ref={headRef} position={[0, 1.6, 0.5]}>
        <mesh material={spiritMaterial}>
          <sphereGeometry args={[0.35, 16, 12]} />
        </mesh>
        <mesh position={[0, -0.08, 0.28]} material={spiritMaterial}>
          <boxGeometry args={[0.22, 0.18, 0.3]} />
        </mesh>
        <mesh position={[0, -0.04, 0.44]} material={noseMaterial}>
          <sphereGeometry args={[0.06, 8, 6]} />
        </mesh>
        <mesh position={[-0.12, 0.05, 0.28]} material={eyeMaterial}>
          <sphereGeometry args={[0.06, 8, 6]} />
        </mesh>
        <mesh position={[0.12, 0.05, 0.28]} material={eyeMaterial}>
          <sphereGeometry args={[0.06, 8, 6]} />
        </mesh>
        <mesh position={[-0.2, 0.35, 0.0]} rotation={[0.2, 0, -0.3]}>
          <coneGeometry args={[0.12, 0.3, 4]} />
          <meshStandardMaterial color="#c8c0b0" roughness={0.7} />
        </mesh>
        <mesh position={[0.2, 0.35, 0.0]} rotation={[0.2, 0, 0.3]}>
          <coneGeometry args={[0.12, 0.3, 4]} />
          <meshStandardMaterial color="#c8c0b0" roughness={0.7} />
        </mesh>
      </group>
      {/* Neck */}
      <mesh position={[0, 1.35, 0.3]} rotation={[0.4, 0, 0]} material={spiritMaterial}>
        <cylinderGeometry args={[0.2, 0.25, 0.35, 8]} />
      </mesh>
      {/* Legs */}
      {[[-0.3, 0.4, 0.3], [0.3, 0.4, 0.3], [-0.3, 0.4, -0.3], [0.3, 0.4, -0.3]].map((pos, i) => (
        <mesh key={`leg-${i}`} position={pos as [number, number, number]} material={spiritMaterial}>
          <cylinderGeometry args={[0.08, 0.09, 0.7, 8]} />
        </mesh>
      ))}
      {/* Paw glows */}
      {[[-0.3, 0.05, 0.3], [0.3, 0.05, 0.3], [-0.3, 0.05, -0.3], [0.3, 0.05, -0.3]].map((pos, i) => (
        <mesh key={`paw-${i}`} position={pos as [number, number, number]} material={innerGlowMaterial}>
          <sphereGeometry args={[0.09, 8, 6]} />
        </mesh>
      ))}
      {/* Tail */}
      <mesh ref={tailRef} position={[0, 1.3, -0.65]} rotation={[-0.8, 0, 0]} material={spiritMaterial}>
        <cylinderGeometry args={[0.04, 0.08, 0.5, 8]} />
      </mesh>
      {/* Floating tools */}
      <group position={[-1.2, 1.5, 0.3]} rotation={[0, 0.5, 0.3]}>
        <mesh material={woodMaterial}><cylinderGeometry args={[0.03, 0.03, 0.5, 6]} /></mesh>
        <mesh position={[0, 0.28, 0]} material={metalMaterial}><boxGeometry args={[0.18, 0.1, 0.08]} /></mesh>
      </group>
      <group position={[1.1, 1.3, -0.2]} rotation={[0.2, -0.3, -0.4]}>
        <mesh material={woodMaterial}><cylinderGeometry args={[0.025, 0.025, 0.4, 6]} /></mesh>
        <mesh position={[0, 0.22, 0]} material={metalMaterial}><coneGeometry args={[0.035, 0.12, 4]} /></mesh>
      </group>
    </group>
  );
}

function SpiritParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const { positions, count } = useMemo(() => {
    const n = 120;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = Math.random() * 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    return { positions: pos, count: n };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.01;
      const pos = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < count; i++) {
        const y = pos.getY(i);
        pos.setY(i, y + Math.sin(t * 0.8 + i * 0.5) * 0.002);
        if (pos.getY(i) > 5.5) pos.setY(i, 0);
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.025} transparent opacity={0.3} sizeAttenuation />
    </points>
  );
}

export default function WalleScene() {
  return (
    <div className="absolute inset-0">
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [3.5, 2.5, 5], fov: 42 }}
          className="!absolute inset-0"
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => {
            gl.setClearColor("#000000");
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.0;
          }}
        >
          <fog attach="fog" args={["#000000", 8, 20]} />
          <ambientLight intensity={0.2} color="#ffffff" />
          <pointLight position={[0, 2, 1]} intensity={0.8} color="#ffffff" distance={12} decay={2} />
          <pointLight position={[-3, 3, -2]} intensity={0.3} color="#888888" distance={15} decay={2} />
          <directionalLight position={[1, 6, 2]} intensity={0.3} color="#ffffff" />
          <pointLight position={[0, 2, -4]} intensity={0.15} color="#666666" distance={10} />
          <Float speed={0.8} rotationIntensity={0.05} floatIntensity={0.15}>
            <InugamiBody />
          </Float>
          <SpiritParticles />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]}>
            <planeGeometry args={[30, 30]} />
            <meshStandardMaterial color="#000000" roughness={1} metalness={0} side={THREE.DoubleSide} />
          </mesh>
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 4} />
        </Canvas>
      </Suspense>
    </div>
  );
}
