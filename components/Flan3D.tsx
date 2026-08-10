'use client'

import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { GatedCanvas } from '@/components/three/GatedCanvas'
import { WarmLighting, StudioEnv } from '@/components/three/Lighting'
import { ModelOrFallback } from '@/components/three/ModelOrFallback'
import { asset } from '@/lib/paths'

const APPLE = '#C8402E'
const APPLE_DARK = '#A62E20'
const APPLE_LIGHT = '#D9502F'
const CARAMEL = '#C8894B'
const CARAMEL_TOP = '#D9A36A'
const STEM = '#6B4226'
const LEAF = '#4E9C4E'

const DRIPS = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2 + 0.4
  return {
    angle,
    length: 0.3 + (i % 4) * 0.14,
    radius: 0.05 + (i % 3) * 0.014,
  }
})

function ProceduralCaramelApple() {
  const dripRef = useRef<THREE.Group>(null)
  const appleRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (appleRef.current) {
      appleRef.current.rotation.y += 0.002
      appleRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.04
    }
    if (dripRef.current) {
      const target = 0.5 + Math.sin(state.clock.elapsedTime * 0.8) * 0.22
      dripRef.current.scale.y = THREE.MathUtils.lerp(dripRef.current.scale.y, target, 0.06)
    }
  })

  return (
    <group>
      {/* Apple body */}
      <group ref={appleRef}>
        <mesh position={[0, 0.62, 0]} castShadow scale={[1, 1.12, 1]}>
          <sphereGeometry args={[1.05, 64, 48]} />
          <meshPhysicalMaterial
            color={APPLE}
            roughness={0.28}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
        <mesh position={[-0.12, 0.62, -0.28]} castShadow scale={[1, 1.12, 1]}>
          <sphereGeometry args={[1.05, 64, 48]} />
          <meshPhysicalMaterial
            color={APPLE_LIGHT}
            roughness={0.28}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Stem */}
        <mesh position={[0.05, 1.55, 0]} rotation={[0.2, 0, -0.35]} castShadow>
          <cylinderGeometry args={[0.045, 0.06, 0.5, 12]} />
          <meshPhysicalMaterial color={STEM} roughness={0.6} />
        </mesh>

        {/* Leaf */}
        <mesh position={[0.42, 1.5, 0.06]} rotation={[-0.4, 0.5, -0.6]} castShadow scale={[1, 0.32, 0.55]}>
          <sphereGeometry args={[0.34, 24, 20]} />
          <meshPhysicalMaterial color={LEAF} roughness={0.4} clearcoat={0.4} />
        </mesh>
      </group>

      {/* Caramel cap + dripping caramel */}
      <group ref={dripRef} position={[0, 1.12, 0]}>
        <mesh position={[0, 0.16, 0]} castShadow>
          <cylinderGeometry args={[0.82, 0.9, 0.34, 48]} />
          <meshPhysicalMaterial
            color={CARAMEL}
            roughness={0.14}
            clearcoat={0.95}
            clearcoatRoughness={0.08}
          />
        </mesh>
        <mesh position={[0, 0.24, 0]}>
          <cylinderGeometry args={[0.74, 0.82, 0.16, 48]} />
          <meshPhysicalMaterial
            color={CARAMEL_TOP}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.06}
          />
        </mesh>
        {DRIPS.map((d, i) => {
          const x = Math.cos(d.angle) * 0.84
          const z = Math.sin(d.angle) * 0.84
          const y = 0.18 - d.length / 2
          return (
            <mesh
              key={i}
              position={[x, y, z]}
              rotation={[Math.cos(d.angle) * 0.16, 0, -Math.sin(d.angle) * 0.16]}
              castShadow
            >
              <capsuleGeometry args={[d.radius, d.length]} />
              <meshPhysicalMaterial
                color={CARAMEL}
                roughness={0.12}
                clearcoat={1}
                clearcoatRoughness={0.06}
              />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

/**
 * Hyper zoom-in on activation, then a continuous 360° orbit around the apple.
 */
function OrbitRig() {
  useFrame((state) => {
    const cam = state.camera
    const t = state.clock.elapsedTime
    const zoomT = Math.min(1, t / 2.5)
    const eased = 1 - Math.pow(1 - zoomT, 3)
    const radius = THREE.MathUtils.lerp(8, 4.4, eased)
    const angle = t * 0.75
    const y = 1.9 + Math.sin(t * 0.8) * 0.22
    cam.position.set(Math.sin(angle) * radius, y, Math.cos(angle) * radius)
    cam.lookAt(0, 1.1, 0)
  })
  return null
}

/**
 * Full-screen 3D apple backdrop for the final "reveal" chapter. The Blender GLB
 * floats in a dark studio and the camera orbits around it. Until an
 * `apple.glb` is dropped into `/public/assets/apple/`, a procedural caramel
 * apple is rendered instead.
 *
 * The canvas is transparent (alpha) so the fixed fire/burn layer shows through
 * behind the apple — the setting photo burns away and reveals the orbiting
 * dessert.
 */
export default function Flan3D({ className }: { className?: string }) {
  return (
    <GatedCanvas
      className={className}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      camera={{ position: [0, 1.9, 8], fov: 40 }}
    >
      <WarmLighting />
      <StudioEnv />
      <ModelOrFallback url={asset('/assets/apple/apple.glb')}>
        <group position={[0, 0.4, 0]}>
          <ProceduralCaramelApple />
        </group>
      </ModelOrFallback>
      <OrbitRig />
    </GatedCanvas>
  )
}
