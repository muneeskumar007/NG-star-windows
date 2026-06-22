import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Reveal from '@/components/Reveal'
import ProductCard from '@/components/ProductCard'
import { PRODUCTS, TESTIMONIALS, AI_SUGGESTIONS } from '@/utils/data'
import { useState } from 'react'

// Lazy-load heavy 3D component
const Hero3D = lazy(() => import('@/three/Hero3D'))

// ─── Stat counter ───────────────────────────────────────────
function Stat({ num, label, delay }) {
  return (
    <Reveal delay={delay}>
      <div className="text-center py-2">
        <div className="font-display text-4xl font-bold text-primary mb-1">{num}</div>
        <div className="text-sm text-muted">{label}</div>
      </div>
    </Reveal>
  )
}

// ─── AI Advisor block ────────────────────────────────────────
function AIAdvisor() {
  const [room,   setRoom]   = useState('')
  const [budget, setBudget] = useState('')
  const [result, setResult] = useState(null)

  function suggest() {
    if (!room || !budget) return
    const rec = AI_SUGGESTIONS[room]?.[budget]
    if (!rec) return
    const product = PRODUCTS.find(p => p.id === rec.id)
    setResult({ product, reason: rec.reason })
  }

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden noise"
           style={{ background: 'linear-gradient(135deg, #0d3d2e 0%, #1F7A63 55%, #2ECC71 100%)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 p-8 md:p-12">
          <div className="mb-1 text-white/60 text-xs font-bold tracking-widest uppercase">AI Product Advisor</div>
          <h3 className="font-display text-2xl md:text-3xl text-white mb-2">
            ✦ Find Your Perfect Window
          </h3>
          <p className="text-white/75 mb-8 text-sm md:text-base max-w-lg">
            Tell us your room type and budget — our smart logic recommends the ideal product and auto-loads it in the 3D configurator.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-white/70 text-xs font-semibold mb-2 uppercase tracking-wide">Room Type</label>
              <select
                value={room} onChange={e => { setRoom(e.target.value); setResult(null) }}
                className="w-full px-4 py-3 rounded-xl bg-white/15 border border-white/25 text-white text-sm outline-none focus:border-white/50 transition-colors"
              >
                <option value="" disabled className="text-gray-800">Select room…</option>
                {['bedroom','living','kitchen','bathroom','office','balcony'].map(r => (
                  <option key={r} value={r} className="text-gray-800 capitalize">{r.charAt(0).toUpperCase()+r.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white/70 text-xs font-semibold mb-2 uppercase tracking-wide">Budget Range</label>
              <select
                value={budget} onChange={e => { setBudget(e.target.value); setResult(null) }}
                className="w-full px-4 py-3 rounded-xl bg-white/15 border border-white/25 text-white text-sm outline-none focus:border-white/50 transition-colors"
              >
                <option value="" disabled className="text-gray-800">Select budget…</option>
                <option value="economy" className="text-gray-800">₹10,000 – ₹25,000</option>
                <option value="mid"     className="text-gray-800">₹25,000 – ₹60,000</option>
                <option value="premium" className="text-gray-800">₹60,000 – ₹1,20,000</option>
                <option value="luxury"  className="text-gray-800">₹1,20,000+</option>
              </select>
            </div>
            <button
              onClick={suggest}
              disabled={!room || !budget}
              className="px-6 py-3 bg-white text-primary font-bold rounded-xl text-sm
                         hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Get AI Suggestion ✦
            </button>
          </div>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-white/12 backdrop-blur-sm border border-white/20 rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-start"
            >
              <div className="text-4xl">🪟</div>
              <div className="flex-1">
                <div className="text-white/60 text-xs font-semibold uppercase tracking-wide mb-1">AI Recommends</div>
                <h4 className="text-white font-display text-lg font-semibold mb-1">{result.product.name}</h4>
                <p className="text-white/80 text-sm leading-relaxed mb-3">{result.reason}</p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/configurator?product=${result.product.id}`}
                    className="px-4 py-2 bg-white text-primary text-xs font-bold rounded-lg hover:bg-accent transition-colors"
                  >
                    Customize in 3D →
                  </Link>
                  <Link
                    to={`/products/${result.product.id}`}
                    className="px-4 py-2 bg-white/15 text-white text-xs font-semibold rounded-lg hover:bg-white/25 transition-colors border border-white/20"
                  >
                    View Details
                  </Link>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white/50 text-xs mb-0.5">From</div>
                <div className="font-display text-xl text-white font-bold">
                  ₹{result.product.basePrice.toLocaleString('en-IN')}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ────────────────────────────────────────────
function Testimonials() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="section-label">Customer Stories</div>
          <h2 className="section-title">Trusted Across Tamil Nadu</h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 80}>
              <div className="card p-6 h-full flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <span key={j} className="text-amber-400 text-base">★</span>
                  ))}
                  {[...Array(5 - t.rating)].map((_, j) => (
                    <span key={j} className="text-gray-200 text-base">★</span>
                  ))}
                </div>
                <p className="text-sm text-[var(--text)] leading-relaxed italic flex-1 mb-5">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted">{t.location}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Why Us section ──────────────────────────────────────────
function WhyUs() {
  const items = [
    { icon: '🏭', title: 'German uPVC Profiles', desc: 'We source exclusively from VEKA, Schüco, Rehau and Internorm — the world\'s leading uPVC systems.' },
    { icon: '📐', title: 'Custom Manufacturing', desc: 'Every unit is measured and manufactured to the millimetre. No off-the-shelf compromises.' },
    { icon: '🔧', title: 'Expert Installation', desc: 'Factory-trained technicians with 10+ years of experience ensure a perfect, weatherproof fit.' },
    { icon: '🛡️', title: '10-Year Warranty', desc: 'Comprehensive coverage on frames, hardware, and glass units with a dedicated service team.' },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="section-label">Our Promise</div>
          <h2 className="section-title">Why NG star?</h2>
          <p className="section-sub">
            Over 2,400 projects across TamilNadu. We don't just sell windows — we engineer comfort into your home.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <div className="card card-hover p-6 h-full">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl mb-4">
                  {item.icon}
                </div>
                <h4 className="font-semibold text-base mb-2">{item.title}</h4>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Main HomePage ───────────────────────────────────────────
export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* ── HERO ── */}
      <section className="min-h-[calc(100vh-64px)] grid grid-cols-1 lg:grid-cols-2 gap-0 items-center pt-16">
        {/* Text */}
        <div className="px-6 md:px-12 lg:px-16 py-12 max-w-2xl mx-auto lg:mx-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="badge mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse-dot" />
              Premium uPVC · Made for India
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight mb-5">
              Windows &amp; Doors<br />
              Built for <span className="text-primary">Life</span>
            </h1>

            <p className="text-muted text-base md:text-lg leading-relaxed mb-8 max-w-md">
              Energy-efficient, storm-resistant uPVC windows and doors engineered for the Indian climate.
              European profiles. 10-year warranty. Expert installation.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/configurator" className="btn-primary flex items-center gap-2">
                <span>🎨</span> Customize in 3D
              </Link>
              <Link to="/products" className="btn-outline">
                Explore Products
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-[var(--border)]">
              {['ISO 9001:2015', '10yr Warranty', '2400+ Projects', 'BIS Certified'].map(b => (
                <div key={b} className="flex items-center gap-1.5 text-xs text-muted font-medium">
                  <span className="w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[10px]">✓</span>
                  {b}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 3D Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="h-[50vh] lg:h-[calc(100vh-64px)] canvas-wrapper rounded-none lg:rounded-none relative"
          style={{ background: 'linear-gradient(135deg, #e8f5f0 0%, #d0ebe2 100%)' }}
        >
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-primary text-sm font-medium">Loading 3D Model…</span>
              </div>
            </div>
          }>
            <Hero3D />
          </Suspense>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold text-primary border border-primary/20">
            ↻ Drag to rotate · Pinch to zoom
          </div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-white border-y border-[var(--border)] py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat num="2,400+" label="Projects Completed"  delay={0}   />
          <Stat num="10yr"   label="Warranty Coverage"   delay={100} />
          <Stat num="40%"    label="Energy Savings"      delay={200} />
          <Stat num="98%"    label="Customer Satisfaction" delay={300} />
        </div>
      </section>

      {/* ── PRODUCTS PREVIEW ── */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="section-label">Our Products</div>
          <h2 className="section-title">Engineered for Every Space</h2>
          <p className="section-sub">
            From casement windows to panoramic lift-slide doors — our uPVC range combines thermal efficiency with enduring elegance.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRODUCTS.slice(0, 3).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/products" className="btn-outline px-10">
            View All Products →
          </Link>
        </div>
      </section>

      {/* ── WHY US ── */}
      <WhyUs />

      {/* ── AI ADVISOR ── */}
      <AIAdvisor />

      {/* ── CTA BANNER ── */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="card p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-primary/5 to-accent/30 border-primary/20">
            <div>
              <h3 className="font-display text-2xl md:text-3xl font-semibold mb-2">
                Ready to transform your home?
              </h3>
              <p className="text-muted text-sm">
                Schedule a free site visit. Our experts measure, advise, and quote — zero pressure.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0 flex-wrap">
              <Link to="/contact" className="btn-primary px-8 py-3">Get Free Quote</Link>
              <a
                href="https://wa.me/919876543210?text=Hi%20ClearView!%20I%20am%20interested%20in%20uPVC%20windows%20and%20doors."
                target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-semibold rounded-xl text-sm hover:bg-[#1da851] transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── TESTIMONIALS ── */}
      <Testimonials />
    </motion.div>
  )
}
