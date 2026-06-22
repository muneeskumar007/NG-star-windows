import { Suspense, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Grid, Html } from '@react-three/drei'
import WindowModel from './WindowModel'
import { GLASS_OPTIONS } from '@/utils/data'

/**
 * The animated wrapper that responds to configurator state.
 * openProgress and explodeProgress are driven by parent via refs/props.
 */
function AnimatedWindow({ config, openProgress, explodeProgress }) {
  const glassOpt = GLASS_OPTIONS.find(g => g.value === config.glass) || GLASS_OPTIONS[0]

  return (
    <WindowModel
      frameColor={config.frameHex}
      glassColor={glassOpt.color}
      glassOpacity={glassOpt.opacity}
      width={config.width}
      height={config.height}
      openProgress={openProgress}
      explodeProgress={explodeProgress}
      productType={config.type}
      autoRotate={false}
    />
  )
}

function SceneSetup() {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight
        position={[6, 9, 6]} intensity={1.1}
        castShadow shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5} shadow-camera-far={30}
        shadow-camera-left={-8} shadow-camera-right={8}
        shadow-camera-top={8} shadow-camera-bottom={-8}
      />
      <directionalLight position={[-5, 3, -4]} intensity={0.35} color="#a3e4d7" />
      <pointLight position={[2, -1, 4]} intensity={0.2} color="#2ECC71" />
      <Grid
        renderOrder={-1}
        position={[0, -1.7, 0]}
        infiniteGrid
        cellSize={0.5}
        cellThickness={0.5}
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#1F7A63"
        cellColor="#c8e0d8"
        fadeDistance={12}
        fadeStrength={2}
      />
      <ContactShadows
        position={[0, -1.65, 0]}
        opacity={0.4}
        scale={8}
        blur={3}
        far={2.5}
        color="#1F7A63"
      />
    </>
  )
}

export default function Configurator3D({ config, openProgress, explodeProgress }) {
  return (
    <div className="w-full h-full min-h-[500px]">
      <Canvas
        shadows
        camera={{ position: [4, 2, 6], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <SceneSetup />

        <Suspense fallback={
          <Html center>
            <div className="text-primary text-sm font-semibold bg-white/80 px-4 py-2 rounded-xl">
              Loading 3D model…
            </div>
          </Html>
        }>
          <AnimatedWindow
            config={config}
            openProgress={openProgress}
            explodeProgress={explodeProgress}
          />
        </Suspense>

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.7}
          minDistance={3}
          maxDistance={10}
          autoRotate={false}
          dampingFactor={0.08}
          enableDamping
        />
      </Canvas>
    </div>
  )
}
