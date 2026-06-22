import { lazy, Suspense, useState, useEffect, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PRODUCTS, GLASS_OPTIONS, COLOR_OPTIONS } from '@/utils/data'
import { calculatePrice, getBreakdown } from '@/features/estimator/priceEngine'
import Reveal from '@/components/Reveal'

const Configurator3D = lazy(() => import('@/three/Configurator3D'))

// ─── Color Swatch ─────────────────────────────────────────────
function ColorSwatch({ option, active, onClick }) {
  return (
    <button
      onClick={onClick}
      title={option.name}
      className={`w-9 h-9 rounded-xl transition-all duration-200 flex-shrink-0 ${
        active
          ? 'ring-2 ring-primary ring-offset-2 scale-110'
          : 'hover:scale-105 hover:ring-1 hover:ring-primary/50 hover:ring-offset-1'
      }`}
      style={{
        background: option.hex,
        border: option.hex === '#F8F8F8' ? '1px solid #ddd' : 'none',
      }}
    />
  )
}

// ─── Price breakdown panel ────────────────────────────────────
function PricePanel({ breakdown, onQuote }) {
  return (
    <div className="rounded-2xl overflow-hidden"
         style={{ background: 'linear-gradient(135deg, #0d3d2e 0%, #1F7A63 100%)' }}>
      <div className="p-5">
        <div className="text-white/60 text-xs font-semibold uppercase tracking-wide mb-1">Live Estimate</div>
        <div className="font-display text-3xl text-white font-bold mb-0.5">
          ₹{breakdown.total.toLocaleString('en-IN')}
        </div>
        <div className="text-white/50 text-xs mb-5">Includes installation & hardware</div>

        <div className="space-y-2 mb-5">
          {breakdown.lines.map(line => (
            <div key={line.label} className="flex justify-between text-xs">
              <span className="text-white/65">{line.label}</span>
              <span className="text-white font-semibold">
                {line.amount > 0 ? `₹${line.amount.toLocaleString('en-IN')}` : 'Included'}
              </span>
            </div>
          ))}
          <div className="border-t border-white/15 pt-2 flex justify-between text-sm font-bold">
            <span className="text-white">Total</span>
            <span className="text-secondary">₹{breakdown.total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <button
          onClick={onQuote}
          className="w-full py-3 bg-white text-primary font-bold rounded-xl text-sm hover:bg-accent transition-colors"
        >
          Request This Quote →
        </button>
        <div className="text-center text-white/40 text-xs mt-2">
          Estimate only · Final quote after site survey
        </div>
      </div>
    </div>
  )
}

export default function ConfiguratorPage() {
  const [searchParams] = useSearchParams()
  const initialProduct = searchParams.get('product') || 'casement'

  // Config state
  const [productId, setProductId] = useState(initialProduct)
  const [colorIdx,  setColorIdx]  = useState(0)
  const [glassType, setGlassType] = useState('clear')
  const [width,     setWidth]     = useState(1200)
  const [height,    setHeight]    = useState(1200)

  // Animation state
  const [openProgress,    setOpenProgress]    = useState(0)
  const [explodeProgress, setExplodeProgress] = useState(0)
  const [isAnimating,     setIsAnimating]     = useState(false)
  const animRef = useRef(null)

  const selectedColor   = COLOR_OPTIONS[colorIdx]
  const selectedProduct = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0]

  const config = {
    type:     productId,
    frameHex: selectedColor.hex,
    colorName:selectedColor.name,
    glass:    glassType,
    width, height,
  }

  const breakdown = getBreakdown({
    productId, widthMm: width, heightMm: height,
    glass: glassType, colorName: selectedColor.name,
  })

  // Play open animation
  function playOpenAnim() {
    if (isAnimating) {
      // Reset
      setOpenProgress(0)
      setIsAnimating(false)
      if (animRef.current) cancelAnimationFrame(animRef.current)
      return
    }
    setIsAnimating(true)
    setExplodeProgress(0)
    let progress = 0
    const step = () => {
      progress += 0.015
      setOpenProgress(Math.min(progress, 1))
      if (progress < 1) animRef.current = requestAnimationFrame(step)
      else setIsAnimating(false)
    }
    animRef.current = requestAnimationFrame(step)
  }

  // Play explode animation
  function playExplode() {
    setOpenProgress(0)
    setIsAnimating(false)
    if (animRef.current) cancelAnimationFrame(animRef.current)
    let progress = explodeProgress > 0 ? 1 : 0
    const target  = explodeProgress > 0 ? 0 : 1
    const direction = target === 1 ? 1 : -1
    const step = () => {
      progress += direction * 0.02
      const clamped = Math.max(0, Math.min(1, progress))
      setExplodeProgress(clamped)
      if ((direction === 1 && progress < 1) || (direction === -1 && progress > 0)) {
        animRef.current = requestAnimationFrame(step)
      }
    }
    animRef.current = requestAnimationFrame(step)
  }

  function resetView() {
    setOpenProgress(0)
    setExplodeProgress(0)
    setIsAnimating(false)
    if (animRef.current) cancelAnimationFrame(animRef.current)
  }

  // Cleanup
  useEffect(() => () => { if (animRef.current) cancelAnimationFrame(animRef.current) }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="pt-16"
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 to-accent/20 border-b border-[var(--border)] py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="section-label">Interactive Studio</div>
          <h1 className="section-title mb-2">3D Product Configurator</h1>
          <p className="text-muted text-sm max-w-xl">
            Customize every detail in real-time. Change frame colour, glass type, and size — and get an instant price estimate.
          </p>
        </div>
      </div>

      {/* Layout */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">

          {/* ── CONTROL PANEL ── */}
          <div className="space-y-4 lg:sticky lg:top-24">

            {/* Product type */}
            <div className="card p-5">
              <h3 className="font-semibold text-sm mb-4 font-body flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">1</span>
                Product Type
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {PRODUCTS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { setProductId(p.id); resetView() }}
                    className={`text-xs font-medium px-3 py-2.5 rounded-xl border transition-all text-left ${
                      productId === p.id
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white border-[var(--border)] text-[var(--text)] hover:border-primary hover:text-primary'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Frame colour */}
            <div className="card p-5">
              <h3 className="font-semibold text-sm mb-3 font-body flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">2</span>
                Frame Colour
                <span className="ml-auto text-xs text-muted font-normal">{selectedColor.name}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((c, i) => (
                  <ColorSwatch
                    key={c.name}
                    option={c}
                    active={colorIdx === i}
                    onClick={() => setColorIdx(i)}
                  />
                ))}
              </div>
              {selectedColor.addPrice > 0 && (
                <div className="mt-2 text-xs text-muted">
                  Colour premium: <span className="text-primary font-semibold">+₹{selectedColor.addPrice.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            {/* Glass type */}
            <div className="card p-5">
              <h3 className="font-semibold text-sm mb-3 font-body flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">3</span>
                Glass Type
              </h3>
              <div className="space-y-2">
                {GLASS_OPTIONS.map(g => (
                  <button
                    key={g.value}
                    onClick={() => setGlassType(g.value)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                      glassType === g.value
                        ? 'bg-primary/8 border-primary text-primary'
                        : 'bg-white border-[var(--border)] text-[var(--text)] hover:border-primary/50'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{g.label}</div>
                      <div className="text-muted font-normal mt-0.5">{g.desc}</div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      {g.addPrice > 0
                        ? <span className="text-primary font-bold">+₹{g.addPrice.toLocaleString('en-IN')}</span>
                        : <span className="text-muted">Standard</span>
                      }
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Size sliders */}
            <div className="card p-5">
              <h3 className="font-semibold text-sm mb-4 font-body flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">4</span>
                Dimensions
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="font-medium text-muted">Width</span>
                    <span className="font-bold text-primary">{width}mm</span>
                  </div>
                  <input
                    type="range" min={600} max={2400} step={50} value={width}
                    onChange={e => setWidth(+e.target.value)}
                    className="w-full accent-primary h-1.5 rounded cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted mt-1">
                    <span>600mm</span><span>2400mm</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="font-medium text-muted">Height</span>
                    <span className="font-bold text-primary">{height}mm</span>
                  </div>
                  <input
                    type="range" min={600} max={2400} step={50} value={height}
                    onChange={e => setHeight(+e.target.value)}
                    className="w-full accent-primary h-1.5 rounded cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted mt-1">
                    <span>600mm</span><span>2400mm</span>
                  </div>
                </div>
                <div className="text-xs text-muted bg-primary/5 rounded-lg px-3 py-2">
                  Area: {((width/1000)*(height/1000)).toFixed(2)} m² ·{' '}
                  {((width/304.8)*(height/304.8)).toFixed(1)} sq.ft
                </div>
              </div>
            </div>

            {/* Price */}
            <PricePanel
              breakdown={breakdown}
              onQuote={() => window.location.href = '/contact'}
            />
          </div>

          {/* ── 3D VIEWPORT ── */}
          <div className="space-y-4">
            <div className="canvas-wrapper h-[400px] md:h-[520px] lg:h-[580px]">
              <Suspense fallback={
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-primary text-sm font-semibold">Preparing 3D Studio…</span>
                  </div>
                </div>
              }>
                <Configurator3D
                  config={config}
                  openProgress={openProgress}
                  explodeProgress={explodeProgress}
                />
              </Suspense>

              {/* Viewport overlay controls */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2 flex-wrap">
                <button
                  onClick={resetView}
                  className="bg-white/85 backdrop-blur-sm border border-primary/20 text-primary text-xs font-semibold px-4 py-2 rounded-full hover:bg-white transition-colors shadow-sm"
                >
                  🔄 Reset
                </button>
                <button
                  onClick={playOpenAnim}
                  className={`backdrop-blur-sm border text-xs font-semibold px-4 py-2 rounded-full transition-colors shadow-sm ${
                    isAnimating
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white/85 border-primary/20 text-primary hover:bg-white'
                  }`}
                >
                  {isAnimating ? '⏹ Stop' : '▶ Open Animation'}
                </button>
                <button
                  onClick={playExplode}
                  className={`backdrop-blur-sm border text-xs font-semibold px-4 py-2 rounded-full transition-colors shadow-sm ${
                    explodeProgress > 0
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white/85 border-primary/20 text-primary hover:bg-white'
                  }`}
                >
                  {explodeProgress > 0 ? '🔧 Re-assemble' : '💥 Exploded View'}
                </button>
              </div>

              {/* Explode label */}
              <AnimatePresence>
                {explodeProgress > 0.1 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                    Exploded View — Frame / Glass / Seal
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Selected product info strip */}
            <div className="card p-4 flex items-center gap-4">
              <div className="text-3xl">🪟</div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{selectedProduct.name}</div>
                <div className="text-xs text-muted">{selectedProduct.material} · {selectedProduct.profileSeries}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted">Frame</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded border border-[var(--border)]"
                       style={{ background: selectedColor.hex }} />
                  <span className="text-xs font-semibold">{selectedColor.name}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted">Glass</div>
                <div className="text-xs font-semibold">
                  {GLASS_OPTIONS.find(g => g.value === glassType)?.label}
                </div>
              </div>
              <Link
                to="/contact"
                state={{ productId, colorName: selectedColor.name, glassType, width, height }}
                className="btn-primary text-xs py-2 px-4 flex-shrink-0"
              >
                Quote This →
              </Link>
            </div>

            {/* Tips */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { icon: '🖱️', tip: 'Drag to rotate · Scroll to zoom' },
                { icon: '💥', tip: 'Exploded view separates frame, glass & seal' },
                { icon: '▶',  tip: 'Animation shows realistic opening motion' },
              ].map(t => (
                <div key={t.tip} className="text-xs text-muted flex items-center gap-2 bg-white border border-[var(--border)] rounded-xl px-3 py-2.5">
                  <span className="text-base">{t.icon}</span>
                  {t.tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
