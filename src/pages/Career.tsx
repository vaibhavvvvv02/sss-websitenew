import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Briefcase, MapPin, Clock, ChevronDown, Send, Loader2, AlertCircle, ShieldCheck, TrendingUp, Users, Heart, Star, PartyPopper, Hospital, Plane, Wallet, GraduationCap, Smile, Building2, Handshake } from 'lucide-react'
import { CONTACT, SITE_NAME } from '../config'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EASE: any = [0.22, 1, 0.36, 1]

/* ─── Data ─────────────────────────────────────── */
const openings = [
  {
    id: 1,
    title: 'Head for Non-Motor Business',
    dept: 'Underwriting',
    type: 'Full Time',
    location: 'Ahmedabad',
    exp: '5+ Years',
    desc: 'As a Non-Motor Insurance Underwriter at SSS Risk Management, you have to do Technical analysis of proposals, Liasioning with Insurance company. Team Management / Development, Technical Training to Team members, Quotes within TAT, Negotiation and Bargaining with Insurance company.',
    skills: ['Underwriting', 'Team Management', 'Negotiation', 'Technical Training', 'Insurance Knowledge'],
  },
  {
    id: 2,
    title: 'Corporate Relationship Manager',
    dept: 'Sales',
    type: 'Full Time',
    location: 'Ahmedabad',
    exp: 'Experienced',
    desc: 'A Corporate Relationship Manager in the insurance sector is responsible for cultivating and managing strategic relationships with corporate clients. This role focuses on understanding clients\' unique insurance needs and delivering customized solutions aligned with their business objectives.',
    skills: ['Relationship Management', 'Corporate Sales', 'Insurance Knowledge', 'Client Servicing'],
  },
  {
    id: 3,
    title: 'Relationship Manager',
    dept: 'Sales',
    type: 'Full Time',
    location: 'Ahmedabad',
    exp: 'Fresher & Experienced',
    education: 'MBA',
    desc: 'Manages an organization\'s overall insurance programs. Analysis of insurance needs by identifying risk exposures and analyzing and classifying risks to provide optimum coverage, costs, and claim settlements. Conducts regular policy reviews, research and compile loss trends, and review actuarial estimations.',
    skills: ['Risk Analysis', 'Policy Management', 'MS Office', 'Communication', 'MBA Preferred'],
  },
  {
    id: 4,
    title: 'Insurance Sales Executive',
    dept: 'Sales',
    type: 'Full Time',
    location: 'Ahmedabad',
    exp: '1–3 Years',
    desc: 'Drive individual and corporate insurance sales, build client relationships and achieve monthly targets.',
    skills: ['Communication', 'Insurance Knowledge', 'Client Servicing', 'Goal Oriented'],
  },
  {
    id: 5,
    title: 'Claims Executive',
    dept: 'Claims',
    type: 'Full Time',
    location: 'Ahmedabad',
    exp: '1–4 Years',
    desc: 'Handle end-to-end claim intimation, document collection, coordination with insurers and settlement.',
    skills: ['Claims Processing', 'Documentation', 'Coordination', 'Customer Handling'],
  },
  {
    id: 6,
    title: 'POSP Channel Manager',
    dept: 'Distribution',
    type: 'Full Time',
    location: 'Ahmedabad / Remote',
    exp: '2–5 Years',
    desc: 'Recruit, train and manage POSP agents across regions. Drive onboarding and productivity.',
    skills: ['Team Management', 'Recruitment', 'Training', 'Distribution'],
  },
  {
    id: 7,
    title: 'Marketing Executive',
    dept: 'Marketing',
    type: 'Full Time',
    location: 'Ahmedabad',
    exp: '1–3 Years',
    desc: 'Plan and execute digital and offline marketing campaigns to generate leads and strengthen brand presence.',
    skills: ['Digital Marketing', 'Social Media', 'Content', 'Analytics'],
  },
  {
    id: 8,
    title: 'Insurance Operations Executive',
    dept: 'Operations',
    type: 'Full Time',
    location: 'Ahmedabad',
    exp: '0–2 Years',
    desc: 'Manage policy issuance, renewals, endorsements and coordinate between clients and insurance companies.',
    skills: ['Policy Management', 'Data Entry', 'MS Office', 'Attention to Detail'],
  },
]

const benefits = [
  {
    icon: PartyPopper, color: '#FF6B00', bg: '#FFF1E4',
    title: 'Culture & Engagement',
    items: ['Birthday & anniversary celebrations', 'Team lunches and events', 'Friendly and collaborative work culture', 'Employee engagement activities'],
  },
  {
    icon: Hospital, color: '#2E7D32', bg: '#E7F5EA',
    title: 'Health & Insurance Benefits',
    items: ['GPA — Group Personal Accident Insurance', 'GMC — Group Medical Coverage for employees & dependents', 'WC — Workmen Compensation for workplace injuries', 'Cashless hospitalization at leading hospitals', 'Annual health check-ups', 'Maternity and Paternity Benefits', 'Paid leaves'],
  },
  {
    icon: Plane, color: '#1a5276', bg: '#EBF5FB',
    title: 'Travel & Experiences',
    items: ['Local Employee Trips — Team outings & weekend retreats', 'Foreign Trips — International trips for top performers', 'Annual company offsite events'],
  },
  {
    icon: Wallet, color: '#2E7D32', bg: '#E7F5EA',
    title: 'Work & Life Benefits',
    items: ['Competitive salary packages', 'Paid leaves & holidays', 'Flexible work environment', 'Employee recognition programs', 'Festival celebrations & team events'],
  },
  {
    icon: GraduationCap, color: '#FF6B00', bg: '#FFF1E4',
    title: 'Career Growth & Learning',
    items: ['Opportunities for professional development', 'Training programs and skill enhancement', 'Mentorship from experienced professionals', 'Clear career progression paths'],
  },
]

const perks = [
  { icon: TrendingUp, color: '#FF6B00', bg: '#FFF1E4', title: 'Growth Opportunities', desc: 'Fast-paced career growth with regular appraisals and promotions.' },
  { icon: Users,      color: '#2E7D32', bg: '#E7F5EA', title: 'Collaborative Culture', desc: 'Work with a passionate, experienced and supportive team.' },
  { icon: Heart,      color: '#1a5276', bg: '#EBF5FB', title: 'Employee Wellbeing',   desc: 'Health insurance, flexible timings and work-life balance.' },
  { icon: Star,       color: '#FF6B00', bg: '#FFF1E4', title: 'Recognition & Rewards', desc: 'Incentives, awards and recognition for top performers.' },
]

interface AppForm { name: string; phone: string; email: string; role: string; exp: string; message: string }
interface AppErrors { name?: string; phone?: string; email?: string; role?: string }

function validate(f: AppForm): AppErrors {
  const e: AppErrors = {}
  if (!f.name.trim()) e.name = 'Name is required.'
  if (!f.phone.trim()) {
    e.phone = 'Phone is required.'
  } else if (!/^[6-9]\d{9}$/.test(f.phone.replace(/[\s\-+]/g, '').replace(/^91/, ''))) {
    e.phone = 'Enter a valid 10-digit mobile number.'
  }
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Enter a valid email.'
  if (!f.role) e.role = 'Please select a role.'
  return e
}

export default function Career() {
  const [openJob, setOpenJob]     = useState<number | null>(null)
  const [showForm, setShowForm]   = useState(false)
  const [prefRole, setPrefRole]   = useState('')
  const [form, setForm]           = useState<AppForm>({ name: '', phone: '', email: '', role: '', exp: '', message: '' })
  const [errors, setErrors]       = useState<AppErrors>({})
  const [loading, setLoading]     = useState(false)
  const [sent, setSent]           = useState(false)
  const [apiErr, setApiErr]       = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    if (errors[name as keyof AppErrors]) setErrors(p => ({ ...p, [name]: undefined }))
  }

  const openApply = (role = '') => {
    setPrefRole(role)
    setForm(p => ({ ...p, role }))
    setShowForm(true)
    setTimeout(() => document.getElementById('career-form')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiErr('')
    const errs = validate(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    try {
      // Send as a quote with career source so the backend can route it
      const { submitQuote } = await import('../services/contactService')
      await submitQuote({
        name:    form.name.trim(),
        phone:   form.phone.trim(),
        email:   form.email.trim() || undefined,
        type:    `Career Application – ${form.role}`,
        message: `Experience: ${form.exp || 'Not specified'}. ${form.message}`.trim(),
        source:  'career-page',
      })
      setSent(true)
    } catch {
      setApiErr('Something went wrong. Please email your CV to ' + CONTACT.email)
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
        <title>Careers | {SITE_NAME}</title>
        <meta name="description" content="Join the SSS Risk Management team. Explore open positions in sales, claims, marketing, operations and more. Build your career in insurance." />
      </Helmet>

      <style>{`
        .car-page { font-family: 'Inter', sans-serif; background: #fff; }

        /* Hero */
        .car-hero { background: linear-gradient(120deg, #1B2A4A 60%, #2E7D32 100%); padding: 64px 24px 56px; text-align: center; }
        .car-hero-tag { display: inline-block; background: rgba(255,107,0,0.18); color: #FF6B00; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 5px 14px; border-radius: 50px; border: 1px solid rgba(255,107,0,0.35); margin-bottom: 16px; }
        .car-hero-title { font-family: 'Poppins', sans-serif; font-weight: 800; font-size: clamp(28px,4vw,46px); color: #fff; margin: 0 0 12px; }
        .car-hero-sub { font-size: 15px; color: rgba(255,255,255,0.75); max-width: 520px; margin: 0 auto 28px; line-height: 1.65; }
        .car-hero-btn { display: inline-flex; align-items: center; gap: 8px; padding: 13px 28px; background: #FF6B00; color: #fff; border-radius: 8px; font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 14px; text-decoration: none; cursor: pointer; border: none; transition: all 0.2s; }
        .car-hero-btn:hover { background: #e55f00; transform: translateY(-2px); }

        /* Perks */
        .car-perks { max-width: 1280px; margin: 64px auto 0; padding: 0 24px; }
        .car-sec-tag { display: inline-block; background: #fff0e6; color: #FF6B00; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 5px 14px; border-radius: 50px; border: 1px solid #ffd0a8; margin-bottom: 12px; }
        .car-sec-title { font-family: 'Poppins', sans-serif; font-weight: 800; font-size: clamp(20px,2.5vw,28px); color: #111827; margin: 0 0 40px; }
        .car-sec-title span { color: #FF6B00; }
        .car-perks-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
        .car-perk-card { background: #fff; border-radius: 16px; border: 1.5px solid #e5e7eb; padding: 28px 22px; transition: all 0.25s; }
        .car-perk-card:hover { border-color: #FF6B00; box-shadow: 0 8px 24px rgba(255,107,0,0.08); transform: translateY(-3px); }
        .car-perk-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
        .car-perk-title { font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 14.5px; color: #111827; margin-bottom: 8px; }
        .car-perk-desc { font-size: 13px; color: #6b7280; line-height: 1.65; }

        /* Openings */
        .car-openings { max-width: 1280px; margin: 72px auto 0; padding: 0 24px; }
        .car-job-list { display: flex; flex-direction: column; gap: 14px; margin-top: 0; }
        .car-job-card { border: 1.5px solid #e5e7eb; border-radius: 14px; overflow: hidden; transition: border-color 0.2s; }
        .car-job-card.open { border-color: #FF6B00; }
        .car-job-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; cursor: pointer; gap: 16px; background: #fff; }
        .car-job-header:hover { background: #fffaf7; }
        .car-job-left { flex: 1; }
        .car-job-title { font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 16px; color: #111827; margin-bottom: 8px; }
        .car-job-meta { display: flex; gap: 16px; flex-wrap: wrap; }
        .car-job-tag { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; color: #6b7280; }
        .car-job-dept { display: inline-flex; align-items: center; gap: 5px; background: #fff0e6; color: #FF6B00; font-size: 11px; font-weight: 700; padding: 2px 10px; border-radius: 50px; }
        .car-job-chevron { flex-shrink: 0; transition: transform 0.2s; color: #9ca3af; }
        .car-job-card.open .car-job-chevron { transform: rotate(180deg); color: #FF6B00; }
        .car-job-body { padding: 0 24px 24px; border-top: 1px solid #f3f4f6; }
        .car-job-desc { font-size: 13.5px; color: #4b5563; line-height: 1.75; margin: 16px 0 14px; }
        .car-job-skills { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; }
        .car-job-skill { background: #f3f4f6; color: #374151; font-size: 12px; font-weight: 500; padding: 4px 12px; border-radius: 50px; }
        .car-apply-btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 22px; background: #FF6B00; color: #fff; border-radius: 8px; font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 13px; text-decoration: none; cursor: pointer; border: none; transition: all 0.2s; }
        .car-apply-btn:hover { background: #e55f00; transform: translateY(-2px); }

        /* Application form */
        .car-form-section { max-width: 800px; margin: 72px auto 80px; padding: 0 24px; }
        .car-form-card { background: #fff; border-radius: 20px; box-shadow: 0 8px 40px rgba(17,24,39,0.08); padding: 40px; border: 1px solid #f0f1f4; }
        .car-form-title { font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 22px; color: #111827; margin: 0 0 6px; }
        .car-form-sub { font-size: 13px; color: #9ca3af; margin-bottom: 32px; }
        .car-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .car-field { display: flex; flex-direction: column; gap: 6px; }
        .car-field.full { grid-column: 1/-1; }
        .car-label { font-size: 13px; font-weight: 600; color: #374151; }
        .car-label span { color: #FF6B00; }
        .car-input, .car-select, .car-textarea { padding: 11px 14px; border: 1.5px solid #e5e7eb; border-radius: 9px; font-family: 'Inter', sans-serif; font-size: 14px; color: #111827; background: #fafafa; outline: none; transition: border-color 0.2s; width: 100%; box-sizing: border-box; }
        .car-input:focus, .car-select:focus, .car-textarea:focus { border-color: #FF6B00; background: #fff; }
        .car-input.err, .car-select.err { border-color: #dc2626; }
        .car-textarea { resize: vertical; min-height: 100px; }
        .car-err-msg { font-size: 12px; color: #dc2626; display: flex; align-items: center; gap: 4px; }
        .car-api-err { display: flex; align-items: flex-start; gap: 10px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 9px; padding: 12px 14px; margin-bottom: 16px; font-size: 13.5px; color: #b91c1c; }
        .car-submit { width: 100%; padding: 14px; background: #1B2A4A; color: #fff; border: none; border-radius: 10px; font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 15px; cursor: pointer; transition: all 0.2s; margin-top: 8px; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .car-submit:hover:not(:disabled) { background: #2a3f6a; transform: translateY(-2px); }
        .car-submit:disabled { opacity: 0.75; cursor: not-allowed; transform: none; }
        .car-success { text-align: center; padding: 40px 16px; }
        .car-success-icon { width: 80px; height: 80px; border-radius: 50%; background: #E7F5EA; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
        .car-success-title { font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 22px; color: #111827; margin-bottom: 10px; }
        .car-success-sub { font-size: 14px; color: #6b7280; line-height: 1.65; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }

        @media (max-width: 768px) { .car-perks-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 560px) { .car-perks-grid { grid-template-columns: 1fr; } .car-form-card { padding: 24px 18px; } .car-form-grid { grid-template-columns: 1fr; } }
        @media (max-width: 400px) { .car-job-meta { gap: 8px 12px; } .car-job-header { padding: 16px 16px; } .car-job-body { padding: 0 16px 20px; } }
      `}</style>

      <div className="car-page">

        {/* Hero */}
        <section className="relative overflow-hidden pt-16 pb-20">
          <div className="absolute inset-0" style={{ background:'linear-gradient(135deg, rgba(255,107,0,0.18) 0%, rgba(255,160,60,0.10) 18%, rgba(255,255,255,0.98) 40%, rgba(255,255,255,1) 50%, rgba(220,245,225,0.85) 72%, rgba(46,125,50,0.20) 100%)' }} />
          <div className="absolute top-[-60px] left-[-60px] w-[320px] h-[320px] rounded-full pointer-events-none" style={{ background:'radial-gradient(circle, rgba(255,107,0,0.14) 0%, transparent 70%)' }} />
          <div className="absolute bottom-[-80px] right-[-80px] w-[380px] h-[380px] rounded-full pointer-events-none" style={{ background:'radial-gradient(circle, rgba(46,125,50,0.14) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-white pointer-events-none z-10" />
        {/* SSS logo watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <img src="/assets/sss.png" alt="" className="sss-logo-watermark w-[480px] h-[480px] object-contain" style={{ opacity: 0.07, animation: 'sssLogoSpin 20s linear infinite' }} />
        </div>
          <div className="relative z-20 text-center px-6 max-w-[720px] mx-auto">
            <motion.span className="inline-block bg-orange-50/80 text-brand-orange font-inter text-[11px] font-bold tracking-[1.5px] uppercase px-3.5 py-1.5 rounded-full mb-4 border border-orange-200"
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, ease:EASE }}>
              JOIN OUR TEAM
            </motion.span>
            <div className="overflow-hidden mb-1">
              <motion.h1 className="font-poppins font-extrabold text-[clamp(28px,4vw,46px)] text-[#1B2A4A]"
                initial={{ y:'110%' }} animate={{ y:0 }} transition={{ delay:0.1, duration:0.7, ease:EASE }}>
                Build Your Career
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-5">
              <motion.h1 className="font-poppins font-extrabold text-[clamp(28px,4vw,46px)] text-brand-orange"
                initial={{ y:'110%' }} animate={{ y:0 }} transition={{ delay:0.2, duration:0.7, ease:EASE }}>
                at SSS
              </motion.h1>
            </div>
            <motion.p className="font-inter text-[15px] text-gray-500 leading-relaxed mb-8 max-w-[520px] mx-auto"
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35, duration:0.55, ease:EASE }}>
              Be part of a growing insurance brokerage that puts customers first and invests in its people.
            </motion.p>
            <motion.div className="flex flex-wrap gap-3 justify-center"
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5, duration:0.5, ease:EASE }}>
              <button onClick={() => openApply()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-xl font-poppins font-bold text-[13.5px] border-2 border-brand-orange cursor-pointer transition-all duration-500 hover:bg-brand-orange-dark hover:-translate-y-1 shadow-orange">
                <Send size={16} /> APPLY NOW
              </button>
            </motion.div>
          </div>
        </section>

        {/* Perks */}
        <div className="car-perks">
          <div className="car-sec-tag">WHY WORK WITH US</div>
          <h2 className="car-sec-title">Great Place to <span>Grow</span></h2>
          <div className="car-perks-grid">
            {perks.map(p => {
              const Icon = p.icon
              return (
                <div key={p.title} className="car-perk-card">
                  <div className="car-perk-icon" style={{ background: p.bg }}><Icon size={22} color={p.color} strokeWidth={1.8} /></div>
                  <div className="car-perk-title">{p.title}</div>
                  <div className="car-perk-desc">{p.desc}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Benefits of Joining Us */}
        <div className="max-w-[1280px] mx-auto px-6 py-14">
          <div className="car-sec-tag">EMPLOYEE BENEFITS</div>
          <h2 className="car-sec-title">Benefits of <span>Joining Us</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b, i) => (
              <motion.div key={b.title}
                className="bg-white rounded-2xl border-[1.5px] border-gray-200 p-6 transition-all duration-500 hover:border-brand-orange hover:shadow-apple-lg hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: EASE }}>
                <div className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-3" style={{ background: b.bg }}>
                  <b.icon size={22} color={b.color} strokeWidth={1.8} />
                </div>
                <div className="font-poppins font-bold text-[15px] text-gray-900 mb-3">{b.title}</div>
                <ul className="flex flex-col gap-1.5">
                  {b.items.map(item => (
                    <li key={item} className="flex items-start gap-2 font-inter text-[13px] text-gray-500">
                      <span className="w-4 h-4 rounded-full bg-orange-100 text-brand-orange flex items-center justify-center flex-shrink-0 mt-0.5 text-[9px] font-bold">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Happy Employees Stats */}
        <div className="max-w-[1100px] mx-auto px-6 py-14 flex justify-center gap-6 flex-wrap">
          {[
            { Icon: Smile,       color: '#FF6B00', bg: '#FFEEDD', ring: '#FFD9B3', value: '200+', label: 'Happy Employees' },
            { Icon: Building2,   color: '#2E7D32', bg: '#DDF5E8', ring: '#B7E8CB', value: '10+',  label: 'Branches Pan India' },
            { Icon: GraduationCap, color: '#1a5276', bg: '#E1EEFF', ring: '#BBD8FF', value: '15+', label: 'Years of Expertise' },
            { Icon: Handshake,   color: '#be185d', bg: '#FDE4F3', ring: '#F9C2E4', value: '400+', label: 'POSP Partners' },
          ].map((s, i) => (
            <motion.div key={s.label}
              className="flex-1 min-w-[180px] max-w-[250px] flex items-center gap-4 bg-white rounded-2xl px-5 py-5 border border-gray-100 transition-all duration-500 hover:-translate-y-1 hover:shadow-apple-lg hover:border-orange-200"
              style={{ boxShadow: '0 2px 10px rgba(17,24,39,0.05)' }}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: EASE }}>
              <div className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center flex-shrink-0"
                style={{ background: s.bg, boxShadow: `0 0 0 6px ${s.ring}55` }}>
                <s.Icon size={24} color={s.color} strokeWidth={1.8} />
              </div>
              <div>
                <div className="font-poppins font-extrabold text-[27px] text-brand-orange leading-none">{s.value}</div>
                <div className="font-inter text-[13px] text-gray-500 mt-1">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Happy Employees Testimonials */}
        <div className="max-w-[1280px] mx-auto px-6 py-14">
          <div className="text-center mb-10">
            <span className="inline-block bg-orange-50 text-brand-orange font-inter text-[11px] font-bold tracking-[1.5px] uppercase px-3.5 py-1.5 rounded-full mb-3 border border-orange-200">OUR PEOPLE</span>
            <h2 className="font-poppins font-extrabold text-[clamp(22px,2.8vw,32px)] text-gray-900">Happy <span className="text-brand-orange">Employees</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Reni Sokhdiya', role: 'HR Manager', img: '/assets/reni.jpeg', quote: "I've been with SSS for two years now, and it feels like a second home. The leadership team genuinely cares about employees' well-being and growth. The benefits and career advancement opportunities are unbeatable." },
              { name: 'Devang Kamdar', role: 'Accountant', img: '/assets/devang.webp', quote: "I've been part of the finance team at SSS for over a decade, and I'm proud to say I've grown alongside this company. The financial stability, commitment to ethical practices, and the strong focus on work-life balance have kept me here." },
              { name: 'Sunil Bhadra', role: 'President', img: '/assets/sunil.webp', quote: "I joined SSS a year ago, and it has been an amazing journey so far. The training and support provided have been exceptional, and I've had the chance to interact with fantastic customers every day." },
            ].map((e, i) => (
              <motion.div key={e.name}
                className="bg-white rounded-2xl p-7 border-[1.5px] border-gray-200 flex flex-col gap-5 transition-all duration-500 hover:shadow-apple-lg hover:-translate-y-1 hover:border-brand-orange"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.65, ease: EASE }}>
                <p className="font-inter text-[13.5px] text-gray-600 leading-relaxed italic flex-1">"{e.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={e.img} alt={e.name}
                    className="w-12 h-12 rounded-full object-cover object-top flex-shrink-0 border-2 border-orange-200"
                    onError={(ev) => { (ev.target as HTMLImageElement).src = '/assets/sss_logo.png' }} />
                  <div>
                    <div className="font-poppins font-bold text-[14px] text-gray-900">{e.name}</div>
                    <div className="font-inter text-[12px] text-brand-orange">{e.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Openings */}
        <div className="car-openings" style={{ marginTop: 72 }}>
          <div className="car-sec-tag">OPEN POSITIONS</div>
          <h2 className="car-sec-title">Current <span>Openings</span></h2>
          <div className="car-job-list">
            {openings.map(job => (
              <div key={job.id} className={`car-job-card${openJob === job.id ? ' open' : ''}`}>
                <div className="car-job-header" onClick={() => setOpenJob(openJob === job.id ? null : job.id)}>
                  <div className="car-job-left">
                    <div className="car-job-title">{job.title}</div>
                    <div className="car-job-meta">
                      <span className="car-job-dept"><Briefcase size={11} />{job.dept}</span>
                      <span className="car-job-tag"><MapPin size={12} />{job.location}</span>
                      <span className="car-job-tag"><Clock size={12} />{job.type}</span>
                      <span className="car-job-tag">{job.exp} exp.</span>
                    </div>
                  </div>
                  <ChevronDown size={20} className="car-job-chevron" />
                </div>
                {openJob === job.id && (
                  <div className="car-job-body">
                    <p className="car-job-desc">{job.desc}</p>
                    {'education' in job && job.education && (
                      <div className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-inter text-[12px] font-semibold border border-blue-200">
                        🎓 Education: {job.education}
                      </div>
                    )}
                    <div className="car-job-skills">
                      {job.skills.map(s => <span key={s} className="car-job-skill">{s}</span>)}
                    </div>
                    <button className="car-apply-btn" onClick={() => openApply(job.title)}>
                      APPLY FOR THIS ROLE →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Application Form */}
        <div className="car-form-section" id="career-form">
          {showForm ? (
            <div className="car-form-card">
              {!sent ? (
                <>
                  <div className="car-form-title">Submit Your Application</div>
                  <div className="car-form-sub">{prefRole ? `Applying for: ${prefRole}` : "Send us your details and we'll get in touch."}</div>

                  {apiErr && (
                    <div className="car-api-err">
                      <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{apiErr}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} noValidate>
                    <div className="car-form-grid">
                      <div className="car-field">
                        <label className="car-label">Full Name <span>*</span></label>
                        <input className={`car-input${errors.name ? ' err' : ''}`} name="name" placeholder="Your full name" value={form.name} onChange={handleChange} />
                        {errors.name && <span className="car-err-msg"><AlertCircle size={12} />{errors.name}</span>}
                      </div>
                      <div className="car-field">
                        <label className="car-label">Phone Number <span>*</span></label>
                        <input className={`car-input${errors.phone ? ' err' : ''}`} name="phone" type="tel" placeholder="98765 43210" value={form.phone} onChange={handleChange} />
                        {errors.phone && <span className="car-err-msg"><AlertCircle size={12} />{errors.phone}</span>}
                      </div>
                      <div className="car-field">
                        <label className="car-label">Email Address</label>
                        <input className={`car-input${errors.email ? ' err' : ''}`} name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handleChange} />
                        {errors.email && <span className="car-err-msg"><AlertCircle size={12} />{errors.email}</span>}
                      </div>
                      <div className="car-field">
                        <label className="car-label">Role Applying For <span>*</span></label>
                        <select className={`car-select${errors.role ? ' err' : ''}`} name="role" value={form.role} onChange={handleChange}>
                          <option value="">Select a role</option>
                          {openings.map(j => <option key={j.id} value={j.title}>{j.title}</option>)}
                          <option value="Other / General Application">Other / General Application</option>
                        </select>
                        {errors.role && <span className="car-err-msg"><AlertCircle size={12} />{errors.role}</span>}
                      </div>
                      <div className="car-field">
                        <label className="car-label">Years of Experience</label>
                        <select className="car-select" name="exp" value={form.exp} onChange={handleChange}>
                          <option value="">Select experience</option>
                          <option>Fresher (0–1 Year)</option>
                          <option>1–3 Years</option>
                          <option>3–5 Years</option>
                          <option>5+ Years</option>
                        </select>
                      </div>
                      <div className="car-field">
                        <label className="car-label">Current / Last CTC</label>
                        <input className="car-input" name="message" placeholder="e.g. 3 LPA or Fresher" value={form.message} onChange={handleChange} />
                      </div>
                    </div>
                    <button type="submit" className="car-submit" disabled={loading}>
                      {loading ? <><Loader2 size={18} className="spin" /> Submitting…</> : 'SUBMIT APPLICATION →'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="car-success">
                  <div className="car-success-icon"><ShieldCheck size={36} color="#2E7D32" strokeWidth={1.8} /></div>
                  <div className="car-success-title">Application Received!</div>
                  <p className="car-success-sub">
                    Thank you, <strong>{form.name}</strong>! We've received your application for <strong>{form.role}</strong>.<br />
                    Our HR team will contact you at <strong>{form.phone}</strong> within 3–5 business days.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 24px', background: '#f9fafb', borderRadius: 20, border: '1.5px dashed #e5e7eb' }}>
              <Briefcase size={40} color="#FF6B00" strokeWidth={1.5} style={{ margin: '0 auto 16px' }} />
              <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 20, color: '#111827', marginBottom: 8 }}>Don't See Your Role?</div>
              <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24, lineHeight: 1.65 }}>We're always looking for talented people. Send us your application and we'll reach out when the right role opens up.</p>
              <button className="car-apply-btn" onClick={() => openApply()}>SEND GENERAL APPLICATION →</button>
            </div>
          )}
        </div>

      </div>
    </>
  )
}
