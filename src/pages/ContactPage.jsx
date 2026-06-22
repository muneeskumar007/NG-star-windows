import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { submitLead } from '@/services/leadsService'
import Reveal from '@/components/Reveal'
import { PRODUCTS } from '@/utils/data'

const BENEFITS = [
  { icon: '📐', title: 'Free Site Survey',    desc: 'We come to you — measure every opening and advise on the best solution. No obligation.' },
  { icon: '🏭', title: 'Factory-Made',         desc: 'Custom manufactured to the millimetre in our Tamil Nadu facility using German profiles.' },
  { icon: '🔧', title: 'Expert Installation',  desc: '2-day installation by factory-trained technicians. Your home is left spotless.' },
  { icon: '🛡️', title: '10-Year Warranty',     desc: 'Comprehensive coverage on all components. One call — we fix it, no questions asked.' },
]

export default function ContactPage() {
  const location = useLocation()
  const state    = location.state || {}

  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      product:   state.productId || '',
      width:     state.width     || '',
      height:    state.height    || '',
    }
  })

  async function onSubmit(data) {
    setSubmitting(true)
    try {
      await submitLead(data)
      setSubmitted(true)
      reset()
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  function buildWhatsApp(data = {}) {
    const msg = `Hi ClearView! I'm ${data.name || 'interested in'} uPVC windows/doors.
Product: ${data.product || 'Not specified'}
Location: ${data.location || 'Not specified'}
Phone: ${data.phone || 'Not provided'}
Message: ${data.message || '—'}`
    return `https://wa.me/919876543210?text=${encodeURIComponent(msg)}`
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="pt-16"
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 to-accent/20 border-b border-[var(--border)] py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="section-label">Get In Touch</div>
            <h1 className="section-title">Request a Free Quote</h1>
            <p className="section-sub mb-0">
              Fill in the form and our team will contact you within 2 hours on business days.
              Site survey is completely free — no commitment required.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* ── FORM ── */}
          <div>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card p-8 text-center"
              >
                <div className="text-5xl mb-4">✅</div>
                <h3 className="font-display text-2xl mb-2">Quote Request Sent!</h3>
                <p className="text-muted text-sm leading-relaxed mb-6">
                  Thank you! Our team will call you within 2 business hours to discuss your requirements and arrange a free site visit.
                </p>
                <button onClick={() => setSubmitted(false)} className="btn-outline px-8">
                  Submit Another Request
                </button>
              </motion.div>
            ) : (
              <div className="card p-6 md:p-8">
                <h2 className="font-display text-xl mb-6">Tell Us About Your Project</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                  {/* Name + Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Full Name *</label>
                      <input
                        {...register('name', { required: 'Name is required' })}
                        className={`form-input ${errors.name ? 'border-red-400' : ''}`}
                        placeholder="Your full name"
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="form-label">Phone Number *</label>
                      <input
                        {...register('phone', {
                          required: 'Phone is required',
                          pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit mobile number' }
                        })}
                        className={`form-input ${errors.phone ? 'border-red-400' : ''}`}
                        placeholder="9876543210"
                        type="tel"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  {/* Email + Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Email Address</label>
                      <input
                        {...register('email', {
                          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter valid email' }
                        })}
                        className={`form-input ${errors.email ? 'border-red-400' : ''}`}
                        placeholder="you@email.com"
                        type="email"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="form-label">City / Location *</label>
                      <input
                        {...register('location', { required: 'Location is required' })}
                        className={`form-input ${errors.location ? 'border-red-400' : ''}`}
                        placeholder="e.g. Nagercoil, Chennai"
                      />
                      {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
                    </div>
                  </div>

                  {/* Product */}
                  <div>
                    <label className="form-label">Product Interest</label>
                    <select {...register('product')} className="form-input">
                      <option value="">Select a product (optional)…</option>
                      {PRODUCTS.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                      <option value="multiple">Multiple Products</option>
                      <option value="unsure">Not Sure — Need Advice</option>
                    </select>
                  </div>

                  {/* Window count + budget */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Number of Windows / Doors</label>
                      <input
                        {...register('quantity')}
                        className="form-input"
                        placeholder="e.g. 6 windows, 2 doors"
                      />
                    </div>
                    <div>
                      <label className="form-label">Approximate Budget</label>
                      <select {...register('budget')} className="form-input">
                        <option value="">Select range…</option>
                        <option value="under-25k">Under ₹25,000</option>
                        <option value="25-75k">₹25,000 – ₹75,000</option>
                        <option value="75k-2l">₹75,000 – ₹2,00,000</option>
                        <option value="above-2l">Above ₹2,00,000</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="form-label">Additional Details</label>
                    <textarea
                      {...register('message')}
                      className="form-input resize-none h-24"
                      placeholder="Tell us about your project — floor level, property type, any special requirements…"
                    />
                  </div>

                  {/* Submit */}
                  <div className="space-y-3 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending…
                        </>
                      ) : (
                        'Send Quote Request →'
                      )}
                    </button>

                    <a
                      href={buildWhatsApp()}
                      target="_blank" rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm
                                 bg-[#25D366] text-white hover:bg-[#1da851] transition-colors"
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Or Chat on WhatsApp
                    </a>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* ── INFO PANEL ── */}
          <div className="space-y-5">
            <h3 className="font-display text-2xl">Why Choose NG Star?</h3>
            <p className="text-muted text-sm leading-relaxed">
              We provide end-to-end service — from site measurement to installation and after-sales support.
              Our uPVC profiles are sourced from Germany's leading manufacturers and processed in our Tamil Nadu facility.
            </p>

            {BENEFITS.map(b => (
              <div key={b.title} className="card p-4 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl flex-shrink-0">
                  {b.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">{b.title}</h4>
                  <p className="text-xs text-muted leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}

            {/* Contact details */}
            <div className="card p-5 space-y-3">
              <h4 className="font-semibold text-sm mb-3">Direct Contact</h4>
              {[
                { icon: '📞', label: 'Phone', value: '+91 98765 43210' },
                { icon: '✉',  label: 'Email', value: 'info@clearview.in' },
                { icon: '📍', label: 'Office', value: 'Nagercoil, Kanyakumari District, Tamil Nadu — 629 001' },
                { icon: '🕐', label: 'Hours',  value: 'Mon–Sat: 9am – 6pm IST' },
              ].map(c => (
                <div key={c.label} className="flex items-start gap-3 text-sm">
                  <span className="text-base">{c.icon}</span>
                  <div>
                    <div className="text-xs text-muted font-medium">{c.label}</div>
                    <div className="font-medium text-[var(--text)]">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="card overflow-hidden">
              <div
                className="h-40 flex items-center justify-center text-center"
                style={{ background: 'linear-gradient(135deg, #e8f5f0 0%, #d0ebe2 100%)' }}
              >
                <div>
                  <div className="text-3xl mb-2">📍</div>
                  <div className="text-sm font-semibold text-primary">Tuticorin</div>
                  <div className="text-xs text-muted mt-0.5">Tamil Nadu, India · Serving All over TamilNadu</div>
                </div>
              </div>
              <div className="px-4 py-3 border-t border-[var(--border)] flex justify-between items-center">
                <span className="text-xs text-muted">Site visits available across Tamil Nadu </span>
                <a
                  href="https://maps.google.com/?q=Nagercoil,Tamil+Nadu"
                  target="_blank" rel="noreferrer"
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  Open in Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
