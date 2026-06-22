import { Link } from 'react-router-dom'

const FOOTER_COLS = [
  {
    heading: 'Products',
    links: [
      { label: 'Casement Windows', to: '/products/casement' },
      { label: 'Sliding Windows',  to: '/products/sliding' },
      { label: 'French Doors',     to: '/products/french-door' },
      { label: 'Lift & Slide Doors', to: '/products/liftslide' },
      { label: 'Bay Windows',      to: '/products/bay' },
      { label: 'Tilt & Turn',      to: '/products/tilt-turn' },
    ],
  },
  {
    heading: 'Explore',
    links: [
      { label: '3D Configurator',  to: '/configurator' },
      { label: 'Gallery',          to: '/gallery' },
      { label: 'Get a Quote',      to: '/contact' },
      { label: 'Admin Dashboard',  to: '/admin' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-[#0d2b22] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="font-display text-xl font-bold text-accent mb-3">
              NG star<span className="text-secondary">™</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              Premium uPVC windows and doors engineered for Indian climate. 
              European profiles, local expertise.
            </p>
            <div className="flex gap-3 mt-5">
              {['WA', 'FB', 'IN', 'YT'].map(s => (
                <div key={s} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold hover:bg-primary/50 transition-colors cursor-pointer">
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {FOOTER_COLS.map(col => (
            <div key={col.heading}>
              <h4 className="text-accent text-sm font-semibold mb-4 tracking-wide">{col.heading}</h4>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-white/60 text-sm hover:text-accent transition-colors duration-200">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="text-accent text-sm font-semibold mb-4 tracking-wide">Contact</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <span>📞</span>
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✉</span>
                <span>info@clearview.in</span>
              </li>
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span> tuticorin District, Tamil Nadu — 629 001</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🕐</span>
                <span>Mon–Sat: 9am – 6pm</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Certifications */}
        <div className="border-t border-white/10 pt-6 mb-6 flex flex-wrap gap-4">
          {['ISO 9001:2015', 'BIS Certified', 'GRIHA Partner', 'Energy Star'].map(cert => (
            <span key={cert} className="text-xs text-white/40 border border-white/10 rounded px-3 py-1">{cert}</span>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/35">
          <span>© 2026 NG star uPVC Pvt. Ltd. All rights reserved.</span>
          <span>Crafted with care for Indian homes 🌿</span>
        </div>
      </div>
    </footer>
  )
}
