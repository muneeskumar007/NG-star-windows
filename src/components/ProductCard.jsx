import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const TAG_COLORS = {
  green:  'bg-emerald-50 text-emerald-700',
  blue:   'bg-blue-50 text-blue-700',
  amber:  'bg-amber-50 text-amber-700',
  purple: 'bg-purple-50 text-purple-700',
  teal:   'bg-teal-50 text-teal-700',
}

const PRODUCT_ICONS = {
  casement:     '🪟',
  sliding:      '🪟',
  'french-door':'🚪',
  liftslide:    '🚪',
  bay:          '🏠',
  'tilt-turn':  '🪟',
}

export default function ProductCard({ product, index = 0 }) {
  const icon      = PRODUCT_ICONS[product.id] || '🪟'
  const tagClass  = TAG_COLORS[product.tagColor] || TAG_COLORS.green

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="card card-hover flex flex-col overflow-hidden group"
    >
      {/* Visual */}
      <div className="h-48 flex items-center justify-center relative overflow-hidden"
           style={{ background: 'linear-gradient(135deg, #e8f5f0 0%, #d0ebe2 100%)' }}>
        <span className="text-7xl select-none">{icon}</span>
        {/* Hover shimmer */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mb-2 ${tagClass}`}>
          {product.tag}
        </span>
        <h3 className="font-display text-lg font-semibold mb-1.5">{product.name}</h3>
        <p className="text-sm text-muted leading-relaxed flex-1 mb-4">{product.shortDesc}</p>

        {/* Features pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.features.slice(0, 3).map(f => (
            <span key={f} className="text-xs bg-accent/30 text-primary px-2 py-0.5 rounded-full">
              {f}
            </span>
          ))}
        </div>

        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="font-display text-xl text-primary font-bold">
              ₹{product.basePrice.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-muted">{product.unit} onwards</div>
          </div>
          <div className="text-xs text-muted">{product.warranty} warranty</div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <Link
            to={`/products/${product.id}`}
            className="flex-1 btn-outline text-sm py-2 text-center"
          >
            Details
          </Link>
          <Link
            to={`/configurator?product=${product.id}`}
            className="flex-1 btn-primary text-sm py-2 text-center"
          >
            Customize
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
