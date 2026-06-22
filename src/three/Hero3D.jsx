import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei'
import WindowModel from './WindowModel'

function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow
        shadow-mapSize={[1024, 1024]} color="#ffffff" />
      <directionalLight position={[-4, 2, -3]} intensity={0.4} color="#a3e4d7" />
      <pointLight position={[0, -2, 3]} intensity={0.3} color="#2ECC71" />
    </>
  )
}

export default function Hero3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [3, 1.5, 5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Lights />

        <Suspense fallback={null}>
          <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.6}>
            <WindowModel
              frameColor="#F8F8F8"
              glassColor="#a8d8c8"
              glassOpacity={0.35}
              width={1200}
              height={1200}
              productType="casement"
              autoRotate={true}
            />
          </Float>

          <ContactShadows
            position={[0, -1.6, 0]}
            opacity={0.35}
            scale={6}
            blur={2.5}
            far={2}
            color="#1F7A63"
          />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
    </div>
  )
}
