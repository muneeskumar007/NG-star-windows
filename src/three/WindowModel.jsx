import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Procedural uPVC window model built from THREE primitives.
 * No external GLB needed — fully code-driven geometry.
 *
 * Props:
 *   frameColor  — hex string
 *   glassOpacity / glassColor — from glass type selection
 *   width / height  — in mm (1200 default)
 *   openProgress    — 0..1  (sash opening animation)
 *   explodeProgress — 0..1  (exploded view)
 *   productType     — 'casement' | 'sliding' | 'door' | 'tilturn'
 *   autoRotate      — boolean
 */
export default function WindowModel({
  frameColor    = '#F8F8F8',
  glassColor    = '#b8ddd4',
  glassOpacity  = 0.32,
  width         = 1200,
  height        = 1200,
  openProgress  = 0,
  explodeProgress = 0,
  productType   = 'casement',
  autoRotate    = true,
}) {
  const groupRef = useRef()

  // Normalised dimensions (Three.js units ≈ metres)
  const W = width  / 600   // 1200mm → 2.0 units
  const H = height / 600

  // Materials — memoised so they don't rebuild on every render
  const frameMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(frameColor), roughness: 0.25, metalness: 0.08,
  }), [frameColor])

  const glassMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(glassColor),
    transparent: true, opacity: glassOpacity,
    roughness: 0, metalness: 0.15,
    side: THREE.DoubleSide,
  }), [glassColor, glassOpacity])

  const sealMat  = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.9 }), [])
  const metalMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#AAAAAA', metalness: 0.9, roughness: 0.1 }), [])

  // Auto-rotate slow drift
  useFrame(({ clock }) => {
    if (!groupRef.current) return
    if (autoRotate) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.3) * 0.35
    }
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.7) * 0.05
  })

  // Explode offsets
  const ex = explodeProgress
  const glassZ  =  ex * 0.35
  const sealZ   =  ex * 0.18
  const sashZ   = -ex * 0.35

  // Open animation
  const openAngle = openProgress * (productType === 'sliding' ? 0 : 1.2)
  const slideX    = productType === 'sliding' ? openProgress * W * 0.9 : 0

  return (
    <group ref={groupRef}>

      {/* ── Outer frame ── */}
      <mesh material={frameMat} castShadow receiveShadow>
        <boxGeometry args={[W * 1.1, H * 1.1, 0.12]} />
      </mesh>

      {/* ── Sash (the moving part) ── */}
      <group
        rotation-y={openAngle}
        position-x={slideX}
        position-z={sashZ}
      >
        {/* Sash frame ring */}
        {['top', 'bottom', 'left', 'right'].map(side => {
          const isH = side === 'top' || side === 'bottom'
          const x   = isH ? 0 : (side === 'left' ? -W * 0.46 : W * 0.46)
          const y   = isH ? (side === 'top' ? H * 0.46 : -H * 0.46) : 0
          return (
            <mesh key={side} position={[x, y, 0.01]} material={frameMat} castShadow>
              <boxGeometry args={isH ? [W * 0.92, 0.07, 0.13] : [0.07, H * 0.92, 0.13]} />
            </mesh>
          )
        })}

        {/* Glass panel */}
        <mesh position={[0, 0, glassZ]} material={glassMat}>
          <boxGeometry args={[W * 0.82, H * 0.82, 0.06]} />
        </mesh>

        {/* Rubber seal */}
        <mesh position={[0, 0, sealZ + 0.07]} material={sealMat}>
          <torusGeometry args={[Math.min(W, H) * 0.38, 0.025, 8, 60]} />
        </mesh>
      </group>

      {/* ── Divider bar (windows only) ── */}
      {(productType === 'casement' || productType === 'sliding' || productType === 'tilturn') && (
        <>
          <mesh position={[0, 0, 0.02]} material={frameMat}>
            <boxGeometry args={[W * 0.82, 0.06, 0.1]} />
          </mesh>
          <mesh position={[0, 0, 0.02]} material={frameMat}>
            <boxGeometry args={[0.06, H * 0.82, 0.1]} />
          </mesh>
        </>
      )}

      {/* ── Handle ── */}
      <group position={[W * 0.35, 0, 0.12 - sashZ]}>
        {/* Base plate */}
        <mesh material={metalMat}>
          <boxGeometry args={[0.05, 0.12, 0.04]} />
        </mesh>
        {/* Lever */}
        <mesh position={[0.06, 0, 0.04]} material={metalMat}>
          <cylinderGeometry args={[0.02, 0.02, 0.22, 12]} />
        </mesh>
      </group>

      {/* ── Hinges (casement / door) ── */}
      {(productType === 'casement' || productType === 'door') && [-0.3, 0.3].map(y => (
        <mesh key={y} position={[-W * 0.5, y, 0.08]} material={metalMat}>
          <boxGeometry args={[0.06, 0.08, 0.04]} />
        </mesh>
      ))}

      {/* ── Sliding track (sliding type) ── */}
      {productType === 'sliding' && (
        <>
          <mesh position={[0, -H * 0.5 - 0.04, 0]} material={metalMat}>
            <boxGeometry args={[W * 1.1, 0.04, 0.08]} />
          </mesh>
          <mesh position={[0, H * 0.5 + 0.04, 0]} material={metalMat}>
            <boxGeometry args={[W * 1.1, 0.04, 0.08]} />
          </mesh>
        </>
      )}

    </group>
  )
}
