/**
 * Dynamic pricing engine for ClearView uPVC products.
 * Price = (basePrice + glassAdd + colorAdd) × areaM2 × installFactor × typeFactor
 */

const BASE_PRICES = {
  casement:    8500,   // per m²
  sliding:     7200,   // per m²
  'french-door': 32000, // per pair (flat)
  liftslide:   58000,  // per panel (flat)
  bay:         24000,  // per unit (flat)
  'tilt-turn': 9800,   // per m²
}

const GLASS_ADD = {
  clear:   0,
  tinted:  1500,
  frosted: 2000,
  solar:   4500,
  triple:  7000,
}

const COLOR_ADD = {
  'White':          0,
  'Anthracite Grey':1200,
  'Golden Oak':     2500,
  'Dark Brown':     2000,
  'Racing Green':   1200,
  'Navy Blue':      1200,
  'Agate Grey':     800,
  'Jet Black':      1500,
}

const FLAT_PRICE_TYPES = ['french-door', 'liftslide', 'bay']

export function calculatePrice({ productId, widthMm, heightMm, glass, colorName }) {
  const base = BASE_PRICES[productId] ?? 8500
  const gAdd = GLASS_ADD[glass] ?? 0
  const cAdd = COLOR_ADD[colorName] ?? 0

  const isFlat = FLAT_PRICE_TYPES.includes(productId)
  let total

  if (isFlat) {
    // Flat price + addons
    total = base + gAdd + cAdd
    // Size premium for oversized
    const w = widthMm / 1000, h = heightMm / 1000
    if (w * h > 3.0) total *= 1.15   // 15% premium for >3m²
    if (w * h > 5.0) total *= 1.25
  } else {
    // Per m² pricing
    const areaSqFt = (widthMm / 304.8) * (heightMm / 304.8) // convert to sqft
    total = (base + gAdd + cAdd) * Math.max(areaSqFt, 4) // min 4 sqft
  }

  // Installation factor
  total *= 1.18  // 18% installation + hardware

  return Math.round(total)
}

export function getBreakdown({ productId, widthMm, heightMm, glass, colorName }) {
  const base  = BASE_PRICES[productId] ?? 8500
  const gAdd  = GLASS_ADD[glass] ?? 0
  const cAdd  = COLOR_ADD[colorName] ?? 0
  const isFlat = FLAT_PRICE_TYPES.includes(productId)

  const areaSqFt = isFlat ? null : Math.max(
    (widthMm / 304.8) * (heightMm / 304.8), 4
  ).toFixed(2)

  const subtotal = isFlat ? (base + gAdd + cAdd) : (base + gAdd + cAdd) * areaSqFt
  const installCost = Math.round(subtotal * 0.18)
  const total = Math.round(subtotal + installCost)

  return {
    lines: [
      { label: `Frame & Profile (${isFlat ? 'unit' : areaSqFt + ' sq.ft'})`, amount: Math.round(isFlat ? base : base * areaSqFt) },
      { label: `Glass Upgrade (${glass})`,              amount: Math.round(isFlat ? gAdd : gAdd * areaSqFt) },
      { label: `Colour Finish (${colorName})`,           amount: Math.round(isFlat ? cAdd : cAdd * areaSqFt) },
      { label: 'Installation & Hardware (18%)',          amount: installCost },
    ],
    total,
  }
}
