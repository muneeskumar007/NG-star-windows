import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Reveal from '@/components/Reveal'
import { GALLERY_ITEMS } from '@/utils/data'

const CATEGORIES = ['All', 'Residential', 'Commercial', 'Luxury', 'Multi-Unit', 'Coastal', 'Restoration']

// Colour palette for gallery cards (procedural, no images needed)
const CARD_GRADIENTS = [
  'linear-gradient(135deg, #d4ede6 0%, #b8ddd4 100%)',
  'linear-gradient(135deg, #e8f5f0 0%, #cce8df 100%)',
  'linear-gradient(135deg, #c8e8e0 0%, #a8d8cc 100%)',
  'linear-gradient(135deg, #dff0eb 0%, #c4e4da 100%)',
  'linear-gradient(135deg, #e2f2ed 0%, #caeae0 100%)',
  'linear-gradient(135deg, #d0ece5 0%, #b5ddd4 100%)',
]

function GalleryCard({ item, index }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className={`card overflow-hidden cursor-pointer group ${item.cols === 2 ? 'md:col-span-2' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Visual */}
      <div
        className="relative overflow-hidden transition-all duration-500"
        style={{
          height: item.cols === 2 ? '280px' : '220px',
          background: CARD_GRADIENTS[index % CARD_GRADIENTS.length],
        }}
      >
        {/* Large icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-8xl opacity-40 select-none">
            {item.category === 'Commercial' ? '🏢' : item.category === 'Luxury' ? '🏛️' : '🏠'}
          </span>
        </div>

        {/* Hover overlay */}
        <motion.div
          initial={false}
          animate={{ opacity: hovered ? 1 : 0 }}
          className="absolute inset-0 flex items-end p-5"
          style={{ background: 'linear-gradient(to top, rgba(15,60,45,0.8) 0%, transparent 60%)' }}
        >
          <div>
            <div className="text-white font-semibold text-base mb-1">{item.title}</div>
            <div className="text-white/70 text-xs">{item.products}</div>
          </div>
        </motion.div>

        {/* Category badge */}
        <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-primary text-xs font-bold px-2.5 py-1 rounded-full">
          {item.category}
        </div>
        <div className="absolute top-3 right-3 bg-primary/80 text-white text-xs font-bold px-2.5 py-1 rounded-full">
          {item.year}
        </div>
      </div>

      {/* Caption */}
      <div className="p-4">
        <div className="font-semibold text-sm mb-1">{item.title}</div>
        <div className="text-xs text-muted flex items-center gap-1 mb-1">
          <span>📍</span> {item.location}
        </div>
        <div className="text-xs text-primary font-medium">{item.products}</div>
      </div>
    </motion.div>
  )
}

// Before/After comparison slider
function BeforeAfter() {
  const [pos, setPos] = useState(50)
  const [dragging, setDragging] = useState(false)

  function handleMove(e) {
    if (!dragging) return
    const rect = e.currentTarget.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
    setPos(pct)
  }

  return (
    <div className="card overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--border)]">
        <h3 className="font-display text-xl">Before / After Installation</h3>
        <p className="text-muted text-xs mt-1">Drag the slider to compare old aluminium windows vs new ClearView uPVC</p>
      </div>
      <div
        className="relative h-64 md:h-80 cursor-col-resize select-none"
        onMouseMove={handleMove}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onTouchMove={handleMove}
        onTouchEnd={() => setDragging(false)}
      >
        {/* Before */}
        <div className="absolute inset-0 flex items-center justify-center"
             style={{ background: 'linear-gradient(135deg, #c8c8c8 0%, #a0a0a0 100%)' }}>
          <div className="text-center">
            <div className="text-6xl mb-2 opacity-60">🪟</div>
            <div className="text-white/70 text-sm font-medium bg-black/30 px-3 py-1 rounded-full">Old Aluminium Frame</div>
          </div>
        </div>

        {/* After (clipped) */}
        <div
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)`, background: 'linear-gradient(135deg, #e8f5f0 0%, #c8e8de 100%)' }}
        >
          <div className="text-center">
            <div className="text-6xl mb-2">🪟</div>
            <div className="text-primary text-sm font-bold bg-white/70 px-3 py-1 rounded-full">ClearView uPVC</div>
          </div>
        </div>

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10 pointer-events-none"
          style={{ left: `${pos}%` }}
        />

        {/* Handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-9 h-9 bg-white rounded-full shadow-xl flex items-center justify-center cursor-col-resize border-2 border-primary"
          style={{ left: `${pos}%` }}
          onMouseDown={() => setDragging(true)}
          onTouchStart={() => setDragging(true)}
        >
          <div className="flex gap-0.5">
            <span className="text-primary text-xs font-bold">◀</span>
            <span className="text-primary text-xs font-bold">▶</span>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute bottom-3 left-3 bg-black/40 text-white text-xs font-semibold px-2 py-0.5 rounded">BEFORE</div>
        <div className="absolute bottom-3 right-3 bg-primary/80 text-white text-xs font-semibold px-2 py-0.5 rounded">AFTER</div>
      </div>
    </div>
  )
}

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(g => g.category === activeCategory)

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="pt-16"
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 to-accent/20 border-b border-[var(--border)] py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="section-label">Installation Gallery</div>
            <h1 className="section-title">Real Projects, Real Results</h1>
            <p className="section-sub mb-0">
              Browse our portfolio of completed installations across Tamil Nadu. Every project is a testament
              to precision manufacturing and expert craftsmanship.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-primary text-white shadow-green'
                  : 'bg-white border border-[var(--border)] text-muted hover:border-primary hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <AnimatePresence>
            {filtered.map((item, i) => (
              <GalleryCard key={item.title} item={item} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Before / After */}
        <Reveal className="mb-12">
          <BeforeAfter />
        </Reveal>

        {/* Stats row */}
        <Reveal>
          <div className="card p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: '6+',    label: 'Districts Covered' },
              { num: '2,400+',label: 'Windows Installed' },
              { num: '180+',  label: 'Commercial Projects' },
              { num: '14',    label: 'Installation Teams' },
            ].map(s => (
              <div key={s.label}>
                <div className="font-display text-2xl text-primary font-bold mb-0.5">{s.num}</div>
                <div className="text-xs text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </motion.div>
  )
}
