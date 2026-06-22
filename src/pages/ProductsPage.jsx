import { useState } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '@/components/ProductCard'
import Reveal from '@/components/Reveal'
import { PRODUCTS } from '@/utils/data'

const FILTERS = [
  { value: 'all',    label: 'All Products' },
  { value: 'window', label: 'Windows' },
  { value: 'door',   label: 'Doors' },
]

export default function ProductsPage() {
  const [filter, setFilter] = useState('all')

  const visible = filter === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === filter)

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="pt-16"
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 to-accent/20 border-b border-[var(--border)] py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="section-label">Our Range</div>
            <h1 className="section-title">Premium uPVC Products</h1>
            <p className="section-sub mb-0">
              Explore our full catalogue. Every product is custom-manufactured to your exact measurements, 
              using European profile systems engineered for Indian conditions.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-10">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                filter === f.value
                  ? 'bg-primary text-white shadow-green'
                  : 'bg-white border border-[var(--border)] text-muted hover:border-primary hover:text-primary'
              }`}
            >
              {f.label}
            </button>
          ))}
          <span className="ml-auto text-sm text-muted self-center">{visible.length} products</span>
        </div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          layout
        >
          {visible.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </motion.div>

        {/* Features comparison */}
        <Reveal className="mt-16">
          <div className="card overflow-hidden">
            <div className="bg-primary/5 border-b border-[var(--border)] px-6 py-4">
              <h3 className="font-display text-xl">Product Comparison</h3>
              <p className="text-sm text-muted mt-1">Key specifications at a glance</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left px-6 py-3 text-muted font-semibold">Product</th>
                    <th className="text-left px-4 py-3 text-muted font-semibold">Profile</th>
                    <th className="text-left px-4 py-3 text-muted font-semibold">U-Value</th>
                    <th className="text-left px-4 py-3 text-muted font-semibold">Sound dB</th>
                    <th className="text-left px-4 py-3 text-muted font-semibold">From Price</th>
                    <th className="text-left px-4 py-3 text-muted font-semibold">Warranty</th>
                  </tr>
                </thead>
                <tbody>
                  {PRODUCTS.map((p, i) => (
                    <tr key={p.id} className={`border-b border-[var(--border)] hover:bg-primary/3 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                      <td className="px-6 py-3 font-semibold text-[var(--text)]">{p.name}</td>
                      <td className="px-4 py-3 text-muted">{p.profileSeries}</td>
                      <td className="px-4 py-3">
                        <span className="badge badge-green text-xs">{p.specs?.['U-Value'] || '—'}</span>
                      </td>
                      <td className="px-4 py-3 text-muted">{p.specs?.['Sound Reduction'] || '—'}</td>
                      <td className="px-4 py-3 font-semibold text-primary">
                        ₹{p.basePrice.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-muted">{p.warranty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </div>
    </motion.div>
  )
}
