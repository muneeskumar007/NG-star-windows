import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getLeads, updateLeadStatus, deleteLead } from '@/services/leadsService'
import { PRODUCTS } from '@/utils/data'

const STATUS_COLORS = {
  new:        'bg-blue-100 text-blue-700',
  contacted:  'bg-yellow-100 text-yellow-700',
  quoted:     'bg-purple-100 text-purple-700',
  converted:  'bg-green-100 text-green-700',
  closed:     'bg-gray-100 text-gray-500',
}

const STATUS_OPTIONS = ['new', 'contacted', 'quoted', 'converted', 'closed']

function StatCard({ label, value, color, icon }) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-2xl p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${color}`}>
        {icon}
      </div>
      <div className="font-display text-2xl font-bold mb-0.5">{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  )
}

function LeadRow({ lead, onStatusChange, onDelete }) {
  const product = PRODUCTS.find(p => p.id === lead.product)
  const date    = new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b border-[var(--border)] hover:bg-primary/2 transition-colors"
    >
      <td className="px-4 py-3">
        <div className="font-semibold text-sm">{lead.name || '—'}</div>
        <div className="text-xs text-muted">{lead.email || ''}</div>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm font-medium">{lead.phone || '—'}</div>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm">{lead.location || '—'}</div>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm">{product?.name || lead.product || 'Not specified'}</div>
      </td>
      <td className="px-4 py-3 text-xs text-muted">{date}</td>
      <td className="px-4 py-3">
        <select
          value={lead.status}
          onChange={e => onStatusChange(lead.id, e.target.value)}
          className={`text-xs font-semibold px-2.5 py-1 rounded-full border-0 outline-none cursor-pointer ${STATUS_COLORS[lead.status]}`}
        >
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s} className="bg-white text-gray-800 capitalize">{s}</option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <a
            href={`https://wa.me/${lead.phone?.replace(/\D/g,'')}?text=Hi%20${encodeURIComponent(lead.name||'')}!%20Following%20up%20on%20your%20ClearView%20quote%20request.`}
            target="_blank" rel="noreferrer"
            className="w-7 h-7 bg-[#25D366]/15 text-[#1da851] rounded-lg flex items-center justify-center text-xs hover:bg-[#25D366]/30 transition-colors"
            title="WhatsApp"
          >
            W
          </a>
          <button
            onClick={() => onDelete(lead.id)}
            className="w-7 h-7 bg-red-50 text-red-500 rounded-lg flex items-center justify-center text-xs hover:bg-red-100 transition-colors"
            title="Delete"
          >
            ✕
          </button>
        </div>
      </td>
    </motion.tr>
  )
}

export default function AdminPage() {
  const [leads,  setLeads]  = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  function reload() { setLeads(getLeads()) }

  useEffect(() => {
    reload()
    // Seed demo leads if empty
    if (getLeads().length === 0) {
      const { saveLeadLocally } = require('@/services/leadsService')
      const demos = [
        { name: 'Rajesh Kumar',  phone: '9876543210', email: 'rajesh@example.com', location: 'Chennai', product: 'casement', budget: '25-75k', message: 'Need 8 windows for my villa', status: 'new' },
        { name: 'Priya Suresh',  phone: '9876500001', email: 'priya@example.com',  location: 'Coimbatore', product: 'french-door', budget: '75k-2l', message: 'Living room door replacement', status: 'contacted' },
        { name: 'Arjun Menon',   phone: '9876500002', email: '',                   location: 'Kanyakumari', product: 'sliding', budget: 'under-25k', message: '3 sliding windows', status: 'quoted' },
        { name: 'Sunita B.',     phone: '9876500003', email: 'sunita@example.com', location: 'Madurai', product: 'liftslide', budget: 'above-2l', message: 'Full villa project, 14 units', status: 'converted' },
      ]
      demos.forEach(d => saveLeadLocally({ ...d, createdAt: new Date().toISOString() }))
      reload()
    }
  }, [])

  function handleStatus(id, status) {
    updateLeadStatus(id, status)
    reload()
  }

  function handleDelete(id) {
    if (window.confirm('Delete this lead?')) { deleteLead(id); reload() }
  }

  const displayed = leads
    .filter(l => filter === 'all' || l.status === filter)
    .filter(l => {
      if (!search) return true
      const q = search.toLowerCase()
      return (l.name||'').toLowerCase().includes(q) ||
             (l.phone||'').includes(q) ||
             (l.location||'').toLowerCase().includes(q)
    })

  const stats = {
    total:     leads.length,
    new:       leads.filter(l => l.status === 'new').length,
    converted: leads.filter(l => l.status === 'converted').length,
    value:     leads.filter(l => l.status === 'converted').length * 28500,
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs text-muted font-bold uppercase tracking-wide mb-1">ClearView Admin</div>
            <h1 className="font-display text-2xl font-semibold">Lead Management Dashboard</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={reload} className="btn-outline text-sm py-2 px-4">🔄 Refresh</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Leads"     value={stats.total}     icon="📋" color="bg-blue-50" />
          <StatCard label="New Leads"        value={stats.new}       icon="🔔" color="bg-amber-50" />
          <StatCard label="Converted"        value={stats.converted} icon="✅" color="bg-green-50" />
          <StatCard label="Est. Revenue"     value={`₹${(stats.value).toLocaleString('en-IN')}`} icon="💰" color="bg-purple-50" />
        </div>

        {/* Filters + Search */}
        <div className="bg-white border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-[var(--border)]">
            <div className="flex gap-1 flex-wrap">
              {['all', ...STATUS_OPTIONS].map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                    filter === s
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-muted hover:bg-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, phone, location…"
              className="ml-auto px-3 py-1.5 border border-[var(--border)] rounded-xl text-sm outline-none focus:border-primary w-56 max-w-full"
            />
          </div>

          {displayed.length === 0 ? (
            <div className="py-16 text-center text-muted text-sm">
              {leads.length === 0 ? 'No leads yet. Quotes submitted on the Contact page will appear here.' : 'No leads match your filter.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-gray-50/50">
                    {['Name', 'Phone', 'Location', 'Product', 'Date', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayed.map(lead => (
                    <LeadRow
                      key={lead.id}
                      lead={lead}
                      onStatusChange={handleStatus}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {displayed.length > 0 && (
            <div className="px-5 py-3 border-t border-[var(--border)] text-xs text-muted">
              Showing {displayed.length} of {leads.length} leads
            </div>
          )}
        </div>

        {/* Product breakdown */}
        <div className="mt-6 bg-white border border-[var(--border)] rounded-2xl p-6">
          <h3 className="font-semibold text-sm mb-4">Enquiries by Product</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {PRODUCTS.map(p => {
              const count = leads.filter(l => l.product === p.id).length
              const pct   = leads.length ? Math.round((count / leads.length) * 100) : 0
              return (
                <div key={p.id} className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="font-display text-xl text-primary font-bold">{count}</div>
                  <div className="text-xs text-muted mt-0.5 leading-tight">{p.name}</div>
                  <div className="w-full h-1 bg-gray-200 rounded-full mt-2">
                    <div className="h-1 bg-primary rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
