import { lazy, Suspense } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PRODUCTS, GLASS_OPTIONS } from '@/utils/data'
import Reveal from '@/components/Reveal'
import ProductCard from '@/components/ProductCard'

const Hero3D = lazy(() => import('@/three/Hero3D'))

export default function ProductDetail() {
  const { id } = useParams()
  const product = PRODUCTS.find(p => p.id === id)

  if (!product) return <Navigate to="/products" replace />

  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== id).slice(0, 3)

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="pt-16"
    >
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-2">
        <nav className="text-xs text-muted flex items-center gap-2">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
          <span>/</span>
          <span className="text-[var(--text)] font-medium">{product.name}</span>
        </nav>
      </div>

      {/* Hero grid */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

        {/* 3D Canvas */}
        <div className="canvas-wrapper h-[380px] lg:h-[480px] sticky top-20">
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            <Hero3D />
          </Suspense>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full text-xs font-semibold text-primary border border-primary/20">
            ↻ Drag to rotate
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="badge mb-3">{product.tag}</div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold mb-2">{product.name}</h1>
          <div className="flex items-center gap-3 mb-5">
            <span className="font-display text-2xl text-primary font-bold">
              ₹{product.basePrice.toLocaleString('en-IN')}
            </span>
            <span className="text-sm text-muted">{product.unit} onwards</span>
            <span className="badge badge-green text-xs">{product.warranty} warranty</span>
          </div>

          <p className="text-muted text-sm leading-relaxed mb-6 whitespace-pre-line">
            {product.longDesc}
          </p>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            {product.features.map(f => (
              <span key={f} className="flex items-center gap-1 text-xs font-medium text-primary bg-primary/8 border border-primary/15 rounded-full px-3 py-1">
                <span className="text-secondary">✓</span> {f}
              </span>
            ))}
          </div>

          {/* Profile info */}
          <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 mb-6 text-sm">
            <div className="text-muted mb-1 text-xs font-semibold uppercase tracking-wide">Profile System</div>
            <div className="font-semibold text-[var(--text)]">{product.material}</div>
            <div className="text-muted">{product.profileSeries} · {product.thicknessMm}mm sash depth</div>
          </div>

          {/* CTAs */}
          <div className="flex gap-3 flex-wrap mb-8">
            <Link to={`/configurator?product=${product.id}`} className="btn-primary flex items-center gap-2">
              🎨 Customize in 3D
            </Link>
            <Link to="/contact" className="btn-outline">
              Get Quote
            </Link>
            <a
              href={`https://wa.me/919876543210?text=Hi!%20I%20am%20interested%20in%20the%20${encodeURIComponent(product.name)}.%20Please%20share%20more%20details.`}
              target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-[#25D366]/10 text-[#1da851] border border-[#25D366]/30 font-semibold rounded-xl text-sm hover:bg-[#25D366]/20 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Full Specs Table */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <Reveal>
          <div className="card overflow-hidden mb-12">
            <div className="px-6 py-4 border-b border-[var(--border)] bg-primary/5">
              <h3 className="font-display text-xl">Technical Specifications</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2">
              {Object.entries(product.specs).map(([key, val], i) => (
                <div key={key} className={`flex justify-between px-6 py-3 text-sm border-b border-[var(--border)] last:border-0 ${i % 2 === 0 ? '' : 'md:border-l'}`}>
                  <span className="text-muted font-medium">{key}</span>
                  <span className="font-semibold text-[var(--text)]">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Glass options info */}
        <Reveal>
          <div className="mb-12">
            <h3 className="font-display text-xl mb-5">Available Glass Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {GLASS_OPTIONS.map(g => (
                <div key={g.value} className="card p-4 text-center">
                  <div className="w-10 h-10 rounded-xl mx-auto mb-2 border-2 border-[var(--border)]"
                       style={{ background: g.color, opacity: 0.85 }} />
                  <div className="text-xs font-semibold mb-1">{g.label}</div>
                  <div className="text-xs text-muted mb-2">{g.desc}</div>
                  {g.addPrice > 0 && (
                    <div className="text-xs text-primary font-bold">+₹{g.addPrice.toLocaleString('en-IN')}</div>
                  )}
                  {g.addPrice === 0 && (
                    <div className="text-xs text-muted">Included</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Related Products */}
        {related.length > 0 && (
          <Reveal>
            <h3 className="font-display text-xl mb-5">Related Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </Reveal>
        )}
      </div>
    </motion.div>
  )
}
