import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { ShieldCheck, ChevronDown, Loader2, AlertCircle } from 'lucide-react'
import { submitQuote } from '../services/contactService'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EASE: any = [0.22, 1, 0.36, 1]

const insuranceTypes = [
  'Motor Insurance', 'Health Insurance', 'Life Insurance',
  'Home Insurance', 'Travel Insurance', 'Commercial Insurance',
  'Personal Accident', 'Cyber Insurance', 'Other',
]

interface FormState {
  name: string
  phone: string
  email: string
  type: string
  message: string
}

interface FormErrors {
  name?: string
  phone?: string
  type?: string
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {}
  if (!form.name.trim()) errors.name = 'Name is required.'
  if (!form.phone.trim()) {
    errors.phone = 'Phone number is required.'
  } else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/[\s\-+]/g, '').replace(/^91/, ''))) {
    errors.phone = 'Enter a valid 10-digit Indian mobile number.'
  }
  if (!form.type) errors.type = 'Please select an insurance type.'
  return errors
}

export default function GetQuote() {
  const [form, setForm] = useState<FormState>({
    name: '', phone: '', email: '', type: '', message: '',
  })
  const [errors, setErrors]       = useState<FormErrors>({})
  const [loading, setLoading]     = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [apiError, setApiError]   = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear field error on change
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')
    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setLoading(true)
    try {
      await submitQuote({
        name:    form.name.trim(),
        phone:   form.phone.trim(),
        email:   form.email.trim() || undefined,
        type:    form.type,
        message: form.message.trim() || undefined,
        source:  'get-quote-page',
      })
      setSubmitted(true)
    } catch {
      setApiError('Something went wrong. Please call us directly or try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @keyframes sssLogoSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
      <style>{`
        .gq-page { font-family: 'Inter', sans-serif; background: #fff; min-height: 60vh; }
        .gq-hero {
          background: linear-gradient(120deg, #1B2A4A 60%, #2E7D32 100%);
          padding: 56px 24px 48px;
          text-align: center;
        }
        .gq-hero-tag {
          display: inline-block; background: rgba(255,107,0,0.18); color: #FF6B00;
          font-size: 11px; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; padding: 5px 14px; border-radius: 50px;
          border: 1px solid rgba(255,107,0,0.35); margin-bottom: 16px;
        }
        .gq-hero-title {
          font-family: 'Poppins', sans-serif; font-weight: 800;
          font-size: clamp(26px, 3.5vw, 42px); color: #fff; margin: 0 0 12px;
        }
        .gq-hero-sub { font-size: 15px; color: rgba(255,255,255,0.75); max-width: 480px; margin: 0 auto; line-height: 1.65; }

        .gq-body { max-width: 720px; margin: 0 auto; padding: 56px 24px; }

        .gq-card {
          background: #fff; border-radius: 20px;
          box-shadow: 0 8px 40px rgba(17,24,39,0.10); padding: 40px;
          border: 1px solid #f0f1f4;
        }
        .gq-card-title {
          font-family: 'Poppins', sans-serif; font-weight: 700;
          font-size: 20px; color: #111827; margin: 0 0 6px;
        }
        .gq-card-sub { font-size: 13px; color: #9ca3af; margin-bottom: 32px; }

        .gq-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .gq-field { display: flex; flex-direction: column; gap: 7px; }
        .gq-field.full { grid-column: 1 / -1; }
        .gq-label { font-size: 13px; font-weight: 600; color: #374151; }
        .gq-label span { color: #FF6B00; }
        .gq-input, .gq-select, .gq-textarea {
          padding: 11px 14px; border: 1.5px solid #e5e7eb; border-radius: 9px;
          font-family: 'Inter', sans-serif; font-size: 14px; color: #111827;
          background: #fafafa; outline: none; transition: border-color 0.2s;
          width: 100%; box-sizing: border-box;
        }
        .gq-input:focus, .gq-select:focus, .gq-textarea:focus { border-color: #FF6B00; background: #fff; }
        .gq-input.error, .gq-select.error { border-color: #dc2626; }
        .gq-select-wrap { position: relative; }
        .gq-select { appearance: none; cursor: pointer; padding-right: 36px; }
        .gq-select-chevron { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; }
        .gq-textarea { resize: vertical; min-height: 100px; }
        .gq-error-msg { font-size: 12px; color: #dc2626; display: flex; align-items: center; gap: 4px; }

        .gq-api-error {
          display: flex; align-items: flex-start; gap: 10px;
          background: #fef2f2; border: 1px solid #fecaca; border-radius: 9px;
          padding: 12px 14px; margin-bottom: 16px;
          font-size: 13.5px; color: #b91c1c; line-height: 1.5;
        }

        .gq-submit {
          width: 100%; padding: 14px; background: #FF6B00; color: #fff;
          border: none; border-radius: 10px; font-family: 'Poppins', sans-serif;
          font-weight: 700; font-size: 15px; cursor: pointer; transition: all 0.2s;
          margin-top: 8px; display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .gq-submit:hover:not(:disabled) { background: #e55f00; transform: translateY(-2px); }
        .gq-submit:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .gq-success { text-align: center; padding: 48px 24px; }
        .gq-success-icon {
          width: 80px; height: 80px; border-radius: 50%;
          background: #E7F5EA; display: flex; align-items: center;
          justify-content: center; margin: 0 auto 20px;
        }
        .gq-success-title {
          font-family: 'Poppins', sans-serif; font-weight: 800;
          font-size: 24px; color: #111827; margin-bottom: 10px;
        }
        .gq-success-sub { font-size: 14px; color: #6b7280; line-height: 1.65; margin-bottom: 28px; }
        .gq-back-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 28px; background: #FF6B00; color: #fff;
          border-radius: 8px; font-family: 'Poppins', sans-serif;
          font-weight: 700; font-size: 13px; text-decoration: none;
        }

        @media (max-width: 560px) {
          .gq-card { padding: 24px 18px; }
          .gq-form-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="gq-page">
        <Helmet>
          <title>Get a Free Quote | SSS Risk Management & Insurance Brokers</title>
          <meta name="description" content="Request a free insurance quote from SSS Risk Management. Motor, Health, Life, Travel and Commercial Insurance. Our experts respond within 24 hours." />
        </Helmet>
        <section className="relative overflow-hidden pt-16 pb-20">
          <div className="absolute inset-0" style={{ background:'linear-gradient(135deg, rgba(255,107,0,0.18) 0%, rgba(255,160,60,0.10) 18%, rgba(255,255,255,0.98) 40%, rgba(255,255,255,1) 50%, rgba(220,245,225,0.85) 72%, rgba(46,125,50,0.20) 100%)' }} />
          <div className="absolute top-[-60px] left-[-60px] w-[320px] h-[320px] rounded-full pointer-events-none" style={{ background:'radial-gradient(circle, rgba(255,107,0,0.14) 0%, transparent 70%)' }} />
          <div className="absolute bottom-[-80px] right-[-80px] w-[380px] h-[380px] rounded-full pointer-events-none" style={{ background:'radial-gradient(circle, rgba(46,125,50,0.14) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-white pointer-events-none z-10" />
        {/* SSS logo watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <img src="/assets/sss.png" alt="" className="w-[360px] h-[360px] object-contain" style={{ opacity: 0.07, animation: 'sssLogoSpin 20s linear infinite' }} />
        </div>
          <div className="relative z-20 text-center px-6 max-w-[720px] mx-auto">
            <motion.span className="inline-block bg-orange-50/80 text-brand-orange font-inter text-[11px] font-bold tracking-[1.5px] uppercase px-3.5 py-1.5 rounded-full mb-4 border border-orange-200"
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, ease:EASE }}>
              FREE QUOTE
            </motion.span>
            <div className="overflow-hidden mb-1">
              <motion.h1 className="font-poppins font-extrabold text-[clamp(28px,4vw,46px)] text-[#1B2A4A]"
                initial={{ y:'110%' }} animate={{ y:0 }} transition={{ delay:0.1, duration:0.7, ease:EASE }}>
                Get a
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-5">
              <motion.h1 className="font-poppins font-extrabold text-[clamp(28px,4vw,46px)] text-brand-orange"
                initial={{ y:'110%' }} animate={{ y:0 }} transition={{ delay:0.2, duration:0.7, ease:EASE }}>
                Free Quote
              </motion.h1>
            </div>
            <motion.p className="font-inter text-[15px] text-gray-500 leading-relaxed max-w-[520px] mx-auto"
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35, duration:0.55, ease:EASE }}>
              Tell us what you need and our experts will get back to you with the best options.
            </motion.p>
          </div>
        </section>

        <div className="gq-body">
          <div className="gq-card">
            {!submitted ? (
              <>
                <div className="gq-card-title">Request a Free Quote</div>
                <div className="gq-card-sub">We'll respond within 24 hours</div>

                {apiError && (
                  <div className="gq-api-error">
                    <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{apiError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="gq-form-grid">
                    <div className="gq-field">
                      <label className="gq-label">Full Name <span>*</span></label>
                      <input
                        className={`gq-input${errors.name ? ' error' : ''}`}
                        name="name" required
                        placeholder="Your full name"
                        value={form.name} onChange={handleChange}
                      />
                      {errors.name && <span className="gq-error-msg"><AlertCircle size={12} />{errors.name}</span>}
                    </div>

                    <div className="gq-field">
                      <label className="gq-label">Phone Number <span>*</span></label>
                      <input
                        className={`gq-input${errors.phone ? ' error' : ''}`}
                        name="phone" type="tel"
                        placeholder="98765 43210"
                        value={form.phone} onChange={handleChange}
                      />
                      {errors.phone && <span className="gq-error-msg"><AlertCircle size={12} />{errors.phone}</span>}
                    </div>

                    <div className="gq-field">
                      <label className="gq-label">Email Address</label>
                      <input
                        className="gq-input"
                        name="email" type="email"
                        placeholder="you@email.com"
                        value={form.email} onChange={handleChange}
                      />
                    </div>

                    <div className="gq-field">
                      <label className="gq-label">Insurance Type <span>*</span></label>
                      <div className="gq-select-wrap">
                        <select
                          className={`gq-select${errors.type ? ' error' : ''}`}
                          name="type"
                          value={form.type} onChange={handleChange}
                        >
                          <option value="">Select insurance type</option>
                          {insuranceTypes.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <ChevronDown size={16} color="#9ca3af" className="gq-select-chevron" />
                      </div>
                      {errors.type && <span className="gq-error-msg"><AlertCircle size={12} />{errors.type}</span>}
                    </div>

                    <div className="gq-field full">
                      <label className="gq-label">Additional Requirements</label>
                      <textarea
                        className="gq-textarea"
                        name="message"
                        placeholder="Tell us more about your insurance needs..."
                        value={form.message} onChange={handleChange}
                      />
                    </div>
                  </div>

                  <button type="submit" className="gq-submit" disabled={loading}>
                    {loading
                      ? <><Loader2 size={18} className="spin" /> Submitting…</>
                      : 'GET MY FREE QUOTE →'
                    }
                  </button>
                </form>
              </>
            ) : (
              <div className="gq-success">
                <div className="gq-success-icon">
                  <ShieldCheck size={36} color="#2E7D32" strokeWidth={1.8} />
                </div>
                <div className="gq-success-title">Quote Request Sent!</div>
                <p className="gq-success-sub">
                  Thank you, <strong>{form.name}</strong>. Our team will review your requirements and
                  contact you at <strong>{form.phone}</strong> within 24 hours with the best options.
                </p>
                <Link to="/" className="gq-back-btn">← BACK TO HOME</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
      `}</style>
    </>
  )
}
