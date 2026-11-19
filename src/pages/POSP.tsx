import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import {
  CheckCircle2, Users, TrendingUp, Shield, BookOpen, Award,
  Loader2, AlertCircle, ChevronDown, Phone, Mail
} from 'lucide-react'
import { submitQuote } from '../services/contactService'
import { CONTACT, SITE_NAME } from '../config'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EASE: any = [0.22, 1, 0.36, 1]

/* ─── Data ─────────────────────────────────────── */
const steps = [
  { num: '01', title: 'Register Online', desc: 'Fill our simple POSP registration form with your basic details.', color: '#FF6B00', bg: '#FFF1E4' },
  { num: '02', title: 'Complete Training', desc: '15-hour IRDAI-mandated training provided free of cost by SSS.', color: '#1a5276', bg: '#EBF5FB' },
  { num: '03', title: 'Pass the Exam',    desc: 'Clear the basic IRDAI certification exam to get your POSP license.', color: '#2E7D32', bg: '#E7F5EA' },
  { num: '04', title: 'Start Earning',    desc: 'Start selling policies and earn attractive commissions from day one.', color: '#FF6B00', bg: '#FFF1E4' },
]

const benefits = [
  { icon: TrendingUp, color: '#FF6B00', bg: '#FFF1E4', title: 'High Earning Potential',   desc: 'Earn up to ₹1 Lakh+ per month with uncapped commissions on every policy sold.' },
  { icon: Shield,     color: '#2E7D32', bg: '#E7F5EA', title: 'IRDAI Licensed',            desc: 'Operate as a fully certified IRDAI Point of Sales Person with legal authority.' },
  { icon: BookOpen,   color: '#1a5276', bg: '#EBF5FB', title: 'Free Training & Support',  desc: '15-hour training, study material, and dedicated support — all provided by SSS.' },
  { icon: Users,      color: '#FF6B00', bg: '#FFF1E4', title: 'Work from Anywhere',        desc: 'No fixed office. Sell policies from home, on the field, or anywhere you prefer.' },
  { icon: Award,      color: '#2E7D32', bg: '#E7F5EA', title: 'Multi-Insurer Products',   desc: 'Access to 30+ insurance companies — Motor, Health, Life and more.' },
  { icon: CheckCircle2, color: '#1a5276', bg: '#EBF5FB', title: 'On-Time Payouts',        desc: 'Commissions credited on time every month. No delays, no hidden deductions.' },
]

const eligibility = [
  'Minimum age: 18 years',
  'Minimum education: 10th pass (SSC)',
  'Valid Aadhaar Card and PAN Card',
  'Active bank account for payout',
  'Smartphone / internet access',
]

const faqs = [
  { q: 'What is a POSP?', a: 'A Point of Sales Person (POSP) is an individual authorized by IRDAI to sell specified insurance products on behalf of an insurance broker or company.' },
  { q: 'Is any investment required?', a: 'No. Becoming a POSP with SSS is completely free. We provide training, study material and certification support at no cost.' },
  { q: 'How much can I earn?', a: 'Commissions vary by product. On average, POSP agents earn 10–25% commission per policy. Top performers earn ₹50,000–₹1,00,000+ per month.' },
  { q: 'Can I do this part-time?', a: 'Absolutely. Many of our POSP agents start part-time and grow it into a full-time business at their own pace.' },
  { q: 'What products can I sell?', a: 'Motor insurance, health insurance, personal accident, travel insurance, home insurance and term life — all under your POSP license.' },
]

interface RegForm { name: string; phone: string; email: string; city: string; occupation: string }
interface RegErrors { name?: string; phone?: string; city?: string }

function validate(f: RegForm): RegErrors {
  const e: RegErrors = {}
  if (!f.name.trim()) e.name = 'Name is required.'
  if (!f.phone.trim()) {
    e.phone = 'Phone is required.'
  } else if (!/^[6-9]\d{9}$/.test(f.phone.replace(/[\s\-+]/g, '').replace(/^91/, ''))) {
    e.phone = 'Enter a valid 10-digit mobile number.'
  }
  if (!f.city.trim()) e.city = 'City is required.'
  return e
}

export default function POSP() {
  const [form, setForm]       = useState<RegForm>({ name: '', phone: '', email: '', city: '', occupation: '' })
  const [errors, setErrors]   = useState<RegErrors>({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [apiErr, setApiErr]   = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    if (errors[name as keyof RegErrors]) setErrors(p => ({ ...p, [name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiErr('')
    const errs = validate(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    try {
      await submitQuote({
        name:    form.name.trim(),
        phone:   form.phone.trim(),
        email:   form.email.trim() || undefined,
        type:    'POSP Registration',
        message: `City: ${form.city}. Occupation: ${form.occupation || 'Not specified'}`,
        source:  'posp-page',
      })
      setSent(true)
    } catch {
      setApiErr('Something went wrong. Please call us at ' + CONTACT.phone)
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
        @media (prefers-reduced-motion: reduce) {
          .sss-logo-watermark { animation: none !important; }
        }
      `}</style>
      <Helmet>
        <title>Become a POSP | {SITE_NAME}</title>
        <meta name="description" content="Become an IRDAI certified Point of Sales Person (POSP) with SSS Risk Management. Free training, multi-insurer access, and high commissions. Register today." />
      </Helmet>

      <style>{`
        .posp-page { font-family: 'Inter', sans-serif; background: #fff; }

        /* Hero — faded tricolor: orange → white → green */
        .posp-hero {
          background: linear-gradient(
            135deg,
            rgba(255, 107, 0, 0.18) 0%,
            rgba(255, 160, 60, 0.10) 18%,
            rgba(255, 255, 255, 0.98) 40%,
            rgba(255, 255, 255, 1) 50%,
            rgba(220, 245, 225, 0.85) 72%,
            rgba(46, 125, 50, 0.20) 100%
          );
          padding: 72px 24px 80px;
          position: relative;
          overflow: hidden;
        }
        .posp-hero::before {
          content: '';
          position: absolute;
          top: -60px; left: -60px;
          width: 320px; height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,107,0,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .posp-hero::after {
          content: '';
          position: absolute;
          bottom: -80px; right: -80px;
          width: 380px; height: 380px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(46,125,50,0.13) 0%, transparent 70%);
          pointer-events: none;
        }
        .posp-hero-inner { max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; position: relative; z-index: 1; }
        .posp-hero-tag { display: inline-block; background: rgba(255,107,0,0.12); color: #e55f00; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 5px 14px; border-radius: 50px; border: 1px solid rgba(255,107,0,0.30); margin-bottom: 16px; }
        .posp-hero-title { font-family: 'Poppins', sans-serif; font-weight: 800; font-size: clamp(28px,3.5vw,46px); color: #1B2A4A; margin: 0 0 16px; line-height: 1.18; }
        .posp-hero-title span { color: #FF6B00; }
        .posp-hero-sub { font-size: 15px; color: #4b5563; line-height: 1.7; margin-bottom: 28px; max-width: 480px; }
        .posp-hero-checks { display: flex; flex-direction: column; gap: 10px; margin-bottom: 32px; }
        .posp-hero-check { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #374151; }

        /* Registration card (hero right) */
        .posp-reg-card { background: #fff; border-radius: 20px; box-shadow: 0 24px 64px rgba(0,0,0,0.18); padding: 36px 32px; }
        .posp-reg-title { font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 20px; color: #111827; margin: 0 0 6px; }
        .posp-reg-sub { font-size: 13px; color: #9ca3af; margin-bottom: 24px; }
        .posp-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
        .posp-label { font-size: 12.5px; font-weight: 600; color: #374151; }
        .posp-label span { color: #FF6B00; }
        .posp-input, .posp-select { padding: 11px 14px; border: 1.5px solid #e5e7eb; border-radius: 9px; font-family: 'Inter', sans-serif; font-size: 14px; color: #111827; background: #fafafa; outline: none; transition: border-color 0.2s; width: 100%; box-sizing: border-box; }
        .posp-input:focus, .posp-select:focus { border-color: #FF6B00; background: #fff; }
        .posp-input.err, .posp-select.err { border-color: #dc2626; }
        .posp-err-msg { font-size: 11.5px; color: #dc2626; display: flex; align-items: center; gap: 4px; }
        .posp-api-err { display: flex; align-items: flex-start; gap: 10px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 9px; padding: 10px 12px; margin-bottom: 12px; font-size: 13px; color: #b91c1c; }
        .posp-submit { width: 100%; padding: 14px; background: #FF6B00; color: #fff; border: none; border-radius: 10px; font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 15px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .posp-submit:hover:not(:disabled) { background: #e55f00; transform: translateY(-2px); }
        .posp-submit:disabled { opacity: 0.75; cursor: not-allowed; transform: none; }
        .posp-reg-note { font-size: 11.5px; color: #9ca3af; text-align: center; margin-top: 12px; }

        /* Sections */
        .posp-sec { max-width: 1280px; margin: 0 auto; padding: 72px 24px 0; }
        .posp-sec-tag { display: inline-block; background: #fff0e6; color: #FF6B00; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 5px 14px; border-radius: 50px; border: 1px solid #ffd0a8; margin-bottom: 12px; }
        .posp-sec-title { font-family: 'Poppins', sans-serif; font-weight: 800; font-size: clamp(20px,2.5vw,28px); color: #111827; margin: 0 0 40px; }
        .posp-sec-title span { color: #FF6B00; }

        /* Steps */
        .posp-steps { display: grid; grid-template-columns: repeat(4,1fr); gap: 0; position: relative; }
        .posp-steps::before { content: ''; position: absolute; top: 27px; left: 12.5%; right: 12.5%; height: 2px; background: linear-gradient(90deg,#FF6B00,#2E7D32); z-index: 0; }
        .posp-step { text-align: center; position: relative; z-index: 1; padding: 0 12px; }
        .posp-step-dot { width: 54px; height: 54px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 16px; color: #fff; margin: 0 auto 16px; box-shadow: 0 4px 14px rgba(0,0,0,0.12); }
        .posp-step-title { font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 14px; color: #111827; margin-bottom: 8px; }
        .posp-step-desc { font-size: 12.5px; color: #6b7280; line-height: 1.65; }

        /* Benefits */
        .posp-benefits-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        .posp-benefit-card { border: 1.5px solid #e5e7eb; border-radius: 16px; padding: 26px 22px; transition: all 0.25s; }
        .posp-benefit-card:hover { border-color: #FF6B00; box-shadow: 0 8px 24px rgba(255,107,0,0.08); transform: translateY(-3px); }
        .posp-benefit-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
        .posp-benefit-title { font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 14.5px; color: #111827; margin-bottom: 8px; }
        .posp-benefit-desc { font-size: 13px; color: #6b7280; line-height: 1.65; }

        /* Eligibility */
        .posp-elig { background: #f9fafb; margin: 64px 0 0; padding: 56px 0; }
        .posp-elig-inner { max-width: 1280px; margin: 0 auto; padding: 0 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
        .posp-elig-list { display: flex; flex-direction: column; gap: 12px; margin-top: 8px; }
        .posp-elig-item { display: flex; align-items: center; gap: 12px; font-size: 14px; color: #374151; }
        .posp-elig-cta { background: #1B2A4A; border-radius: 16px; padding: 36px 32px; }
        .posp-elig-cta-title { font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 20px; color: #fff; margin-bottom: 8px; }
        .posp-elig-cta-sub { font-size: 14px; color: rgba(255,255,255,0.7); margin-bottom: 20px; line-height: 1.65; }
        .posp-elig-contact { display: flex; align-items: center; gap: 10px; font-size: 13.5px; color: rgba(255,255,255,0.9); margin-bottom: 10px; }
        .posp-elig-contact a { color: #FF6B00; text-decoration: none; }
        .posp-elig-contact a:hover { text-decoration: underline; }

        /* FAQ */
        .posp-faq-list { display: flex; flex-direction: column; gap: 10px; }
        .posp-faq-item { border: 1.5px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
        .posp-faq-item.open { border-color: #FF6B00; }
        .posp-faq-q { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; cursor: pointer; background: none; border: none; width: 100%; text-align: left; gap: 12px; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 14px; color: #111827; }
        .posp-faq-chevron { flex-shrink: 0; transition: transform 0.2s; color: #9ca3af; }
        .posp-faq-item.open .posp-faq-chevron { transform: rotate(180deg); color: #FF6B00; }
        .posp-faq-a { padding: 0 20px 16px; font-size: 13.5px; color: #4b5563; line-height: 1.75; border-top: 1px solid #f3f4f6; padding-top: 12px; }

        /* Success */
        .posp-success { text-align: center; padding: 16px 0; }
        .posp-success-icon { font-size: 48px; margin-bottom: 12px; }
        .posp-success-title { font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 19px; color: #111827; margin-bottom: 8px; }
        .posp-success-sub { font-size: 13.5px; color: #6b7280; line-height: 1.65; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }

        @media (max-width: 1024px) { .posp-benefits-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 900px) { .posp-hero-inner { grid-template-columns: 1fr; } .posp-steps { grid-template-columns: 1fr 1fr; } .posp-steps::before { display: none; } .posp-elig-inner { grid-template-columns: 1fr; } }
        @media (max-width: 560px) { .posp-benefits-grid { grid-template-columns: 1fr; } .posp-steps { grid-template-columns: 1fr; } .posp-reg-card { padding: 24px 18px; } }
        @media (max-width: 400px) { .posp-sec { padding-left: 16px; padding-right: 16px; } }
      `}</style>

      <div className="posp-page">

        {/* Hero + Registration */}
        <section className="relative overflow-hidden pt-14 pb-20">
          <div className="absolute inset-0" style={{ background:'linear-gradient(135deg, rgba(255,107,0,0.18) 0%, rgba(255,160,60,0.10) 18%, rgba(255,255,255,0.98) 40%, rgba(255,255,255,1) 50%, rgba(220,245,225,0.85) 72%, rgba(46,125,50,0.20) 100%)' }} />
          <div className="absolute top-[-60px] left-[-60px] w-[320px] h-[320px] rounded-full pointer-events-none" style={{ background:'radial-gradient(circle, rgba(255,107,0,0.14) 0%, transparent 70%)' }} />
          <div className="absolute bottom-[-80px] right-[-80px] w-[380px] h-[380px] rounded-full pointer-events-none" style={{ background:'radial-gradient(circle, rgba(46,125,50,0.14) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-white pointer-events-none z-10" />
        {/* SSS logo watermark */}
        <div className="absolute pointer-events-none z-10" style={{ top: '50%', left: '25%', transform: 'translate(-50%, -50%)' }}>
          <img src="/assets/sss.png" alt="" className="sss-logo-watermark w-[420px] h-[420px] object-contain" style={{ opacity: 0.07, animation: 'sssLogoSpin 20s linear infinite' }} />
        </div>
          <div className="relative z-20 max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            {/* Left — text */}
            <div className="text-center lg:text-left">
              <motion.span className="inline-block bg-orange-50/80 text-brand-orange font-inter text-[11px] font-bold tracking-[1.5px] uppercase px-3.5 py-1.5 rounded-full mb-4 border border-orange-200"
                initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, ease:EASE }}>
                BECOME A POSP
              </motion.span>
              <div className="overflow-hidden mb-1">
                <motion.h1 className="font-poppins font-extrabold text-[clamp(28px,3.5vw,46px)] text-[#1B2A4A] leading-tight"
                  initial={{ y:'110%' }} animate={{ y:0 }} transition={{ delay:0.1, duration:0.7, ease:EASE }}>
                  Earn Big as an
                </motion.h1>
              </div>
              <div className="overflow-hidden mb-5">
                <motion.h1 className="font-poppins font-extrabold text-[clamp(28px,3.5vw,46px)] text-brand-orange leading-tight"
                  initial={{ y:'110%' }} animate={{ y:0 }} transition={{ delay:0.2, duration:0.7, ease:EASE }}>
                  Insurance POSP
                </motion.h1>
              </div>
              <motion.p className="font-inter text-[15px] text-gray-600 leading-relaxed mb-7 max-w-[480px] lg:mx-0 mx-auto"
                initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35, duration:0.55, ease:EASE }}>
                Start your own insurance business with zero investment. Get certified, sell policies, and earn high commissions working with SSS.
              </motion.p>
              <motion.div className="flex flex-col gap-2.5"
                initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5, duration:0.5, ease:EASE }}>
                {['Zero investment — completely free', '15-hour free IRDAI training', 'Commissions up to ₹1L+/month', 'Work from home or field — your choice'].map(t => (
                  <div key={t} className="flex items-center gap-2.5 font-inter text-[14px] text-gray-700 justify-center lg:justify-start">
                    <CheckCircle2 size={18} color="#2E7D32" strokeWidth={2} className="flex-shrink-0" />{t}
                  </div>
                ))}
              </motion.div>
            </div>
            {/* Right — registration card (kept as-is) */}
            <div>
              <div className="posp-reg-card">
                {!sent ? (
                  <>
                    <div className="posp-reg-title">Register as POSP</div>
                    <div className="posp-reg-sub">Free registration — takes less than 2 minutes</div>

                    {apiErr && (
                      <div className="posp-api-err">
                        <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 2 }} /><span>{apiErr}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                      <div className="posp-field">
                        <label className="posp-label">Full Name <span>*</span></label>
                        <input className={`posp-input${errors.name ? ' err' : ''}`} name="name" placeholder="Your full name" value={form.name} onChange={handleChange} />
                        {errors.name && <span className="posp-err-msg"><AlertCircle size={12} />{errors.name}</span>}
                      </div>
                      <div className="posp-field">
                        <label className="posp-label">Mobile Number <span>*</span></label>
                        <input className={`posp-input${errors.phone ? ' err' : ''}`} name="phone" type="tel" placeholder="98765 43210" value={form.phone} onChange={handleChange} />
                        {errors.phone && <span className="posp-err-msg"><AlertCircle size={12} />{errors.phone}</span>}
                      </div>
                      <div className="posp-field">
                        <label className="posp-label">Email Address</label>
                        <input className="posp-input" name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handleChange} />
                      </div>
                      <div className="posp-field">
                        <label className="posp-label">City <span>*</span></label>
                        <input className={`posp-input${errors.city ? ' err' : ''}`} name="city" placeholder="Your city" value={form.city} onChange={handleChange} />
                        {errors.city && <span className="posp-err-msg"><AlertCircle size={12} />{errors.city}</span>}
                      </div>
                      <div className="posp-field">
                        <label className="posp-label">Current Occupation</label>
                        <select className="posp-select" name="occupation" value={form.occupation} onChange={handleChange}>
                          <option value="">Select occupation</option>
                          <option>Student</option>
                          <option>Homemaker</option>
                          <option>Salaried Employee</option>
                          <option>Self Employed / Business</option>
                          <option>Retired</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <button type="submit" className="posp-submit" disabled={loading}>
                        {loading ? <><Loader2 size={18} className="spin" /> Registering…</> : 'REGISTER NOW — FREE →'}
                      </button>
                    </form>
                    <p className="posp-reg-note">Our team will call you within 24 hours to guide you through the next steps.</p>
                  </>
                ) : (
                  <div className="posp-success">
                    <div className="posp-success-icon">🎉</div>
                    <div className="posp-success-title">Registration Successful!</div>
                    <p className="posp-success-sub">
                      Welcome, <strong>{form.name}</strong>! Our team will call you at <strong>{form.phone}</strong> within 24 hours to guide your POSP onboarding.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        {/* How it Works */}
        <div className="posp-sec">
          <div className="posp-sec-tag">HOW IT WORKS</div>
          <h2 className="posp-sec-title">4 Simple Steps to <span>Get Started</span></h2>
          <div className="posp-steps">
            {steps.map(s => (
              <div key={s.num} className="posp-step">
                <div className="posp-step-dot" style={{ background: s.color }}>{s.num}</div>
                <div className="posp-step-title">{s.title}</div>
                <p className="posp-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="posp-sec" style={{ paddingBottom: 0 }}>
          <div className="posp-sec-tag">WHY CHOOSE SSS</div>
          <h2 className="posp-sec-title">Why Become a POSP with <span>SSS?</span></h2>
          <div className="posp-benefits-grid">
            {benefits.map(b => {
              const Icon = b.icon
              return (
                <div key={b.title} className="posp-benefit-card">
                  <div className="posp-benefit-icon" style={{ background: b.bg }}><Icon size={22} color={b.color} strokeWidth={1.8} /></div>
                  <div className="posp-benefit-title">{b.title}</div>
                  <p className="posp-benefit-desc">{b.desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Eligibility */}
        <div className="posp-elig">
          <div className="posp-elig-inner">
            <div>
              <div className="posp-sec-tag">ELIGIBILITY</div>
              <h2 className="posp-sec-title" style={{ marginBottom: 24 }}>Who Can <span>Apply?</span></h2>
              <div className="posp-elig-list">
                {eligibility.map(item => (
                  <div key={item} className="posp-elig-item">
                    <CheckCircle2 size={18} color="#2E7D32" strokeWidth={2} style={{ flexShrink: 0 }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="posp-elig-cta">
              <div className="posp-elig-cta-title">Ready to Start?</div>
              <p className="posp-elig-cta-sub">Register above or call our POSP helpline for a quick walkthrough. Our team will handle everything for you.</p>
              <div className="posp-elig-contact"><Phone size={14} color="#FF6B00" /><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></div>
              <div className="posp-elig-contact"><Mail size={14} color="#FF6B00" /><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="posp-sec" style={{ paddingBottom: 80 }}>
          <div className="posp-sec-tag">FAQS</div>
          <h2 className="posp-sec-title">Common <span>Questions</span></h2>
          <div className="posp-faq-list">
            {faqs.map((f, i) => (
              <div key={i} className={`posp-faq-item${openFaq === i ? ' open' : ''}`}>
                <button className="posp-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{f.q}</span>
                  <ChevronDown size={18} className="posp-faq-chevron" />
                </button>
                {openFaq === i && <div className="posp-faq-a">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  )
}
