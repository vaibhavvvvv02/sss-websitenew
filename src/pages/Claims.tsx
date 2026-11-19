import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  FileText, UploadCloud, Search, UserCheck, Banknote, CheckCircle2,
  Globe, Phone, MessageCircle, Mail, ShieldCheck,
  ChevronDown, Car as CarIcon, HeartPulse, Home, Briefcase,
  Plane, Heart, PersonStanding, BookOpen, ClipboardList, Info,
  AlertCircle, Quote, Users, Loader2, X
} from 'lucide-react'
import { submitClaim } from '../services/contactService'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EASE: any = [0.22, 1, 0.36, 1]

/* ─── Data ── */
const processSteps = [
  { num:'01', Icon:FileText,    color:'#FF6B00', bg:'#FFF1E4', label:'Report the Claim',   desc:'Inform us through the claim form or helpline.' },
  { num:'02', Icon:UploadCloud, color:'#1a5276', bg:'#EBF5FB', label:'Submit Documents',   desc:'Upload all necessary documents for verification.' },
  { num:'03', Icon:Search,      color:'#2E7D32', bg:'#E7F5EA', label:'Verification',       desc:'Our team verifies documents and initiates assessment.' },
  { num:'04', Icon:UserCheck,   color:'#FF6B00', bg:'#FFF1E4', label:'Approval',           desc:'Once approved, we process your claim without delay.' },
  { num:'05', Icon:Banknote,    color:'#1a5276', bg:'#EBF5FB', label:'Settlement',         desc:'Claim amount settled via direct bank transfer.' },
  { num:'06', Icon:CheckCircle2,color:'#2E7D32', bg:'#E7F5EA', label:'Claim Closed',       desc:'We ensure complete closure and your satisfaction.' },
]

const intimateChannels = [
  { Icon:Globe,         color:'#2E7D32', bg:'#E7F5EA', label:'Online Claim Form', desc:'Fill our simple online claim form.',       action:'FILE ONLINE',  href:'#claim-form' },
  { Icon:Phone,         color:'#FF6B00', bg:'#FFF1E4', label:'Call Us',           desc:'Speak directly to our claims support.',    action:'CALL NOW',    href:'tel:+917486020672' },
  { Icon:MessageCircle, color:'#25D366', bg:'#E7F5EA', label:'WhatsApp',          desc:'Share your claim details on WhatsApp.',    action:'CHAT NOW',    href:'https://wa.me/917486020672' },
  { Icon:Mail,          color:'#1a5276', bg:'#EBF5FB', label:'Email Us',          desc:'Send claim details and documents by email.',action:'SEND EMAIL',  href:'mailto:claim@sssriskmanagement.com' },
]

const testimonials = [
  { name:'Vaibhav Patel',  rating:5, text:"My car was covered under Tata AIG's full insurance. The SSS claims team gave excellent cooperation — my car was fully repaired in just five days. Highly recommended." },
  { name:'Bhavin Rabari',  rating:5, text:"Thank you for your excellent service! The claims process was smooth and hassle-free. Your team was very supportive and responsive throughout." },
  { name:'Dhaval Parikh',  rating:5, text:"Thank you so much for help and support throughout the claim process. I am fully satisfied and highly recommend SSS Risk Management to everyone." },
]

type DocItem = { name: string; isHeader?: boolean }
const docLibrary: Record<string, { icon: React.ElementType; items: DocItem[] }> = {
  'Motor': { icon: CarIcon, items: [
    { name:'For Accident / Damage Claims:', isHeader:true },
    { name:'Duly filled Claim Form' }, { name:'Copy of Driving License' }, { name:'Copy of RC Book' },
    { name:'Copy of Insurance Policy' }, { name:'FIR / Police Report (if applicable)' },
    { name:'Estimate of Repairs from garage' }, { name:'Repair Bills & Payment Receipts' },
    { name:'For Theft Claims:', isHeader:true },
    { name:'FIR Copy (mandatory)' }, { name:'Untraced Report from Police' }, { name:'RC Book, Keys & Policy Copy' },
  ]},
  'Health': { icon: HeartPulse, items: [
    { name:'For Reimbursement Claims:', isHeader:true },
    { name:'Filled and signed Claim Form' }, { name:'Hospital Discharge Summary' },
    { name:'Hospital Bills & Payment Receipts' }, { name:"Doctor's Consultation Papers" },
    { name:'Diagnostic / Lab Reports' }, { name:'Prescriptions and Medicine Bills' },
    { name:'For Cashless Claims:', isHeader:true },
    { name:'Pre-authorization Form (from TPA desk)' }, { name:'Health Card / Policy Copy' }, { name:'ID Proof of Patient' },
  ]},
  'Home': { icon: Home, items: [
    { name:'Claim Form' }, { name:'Policy Copy' }, { name:'FIR / Fire Brigade Report' },
    { name:'Photographs of Damage / Loss' }, { name:'Estimate of Repairs / Replacement Bills' },
    { name:'Invoice or Proof of Ownership for damaged items' }, { name:'Surveyor Report (if applicable)' },
  ]},
  'Commercial': { icon: Briefcase, items: [
    { name:'Claim Form' }, { name:'Policy Copy' }, { name:'FIR / Fire Brigade Report' },
    { name:'Stock Register / Inventory Details' }, { name:'Purchase Bills / Invoices' },
    { name:'Photographs of Damaged Property' }, { name:'Surveyor Report' },
  ]},
  'Travel': { icon: Plane, items: [
    { name:'Claim Form' }, { name:'Policy Copy / Travel Itinerary' }, { name:'Passport & Visa Copy' },
    { name:'Boarding Pass / Tickets' }, { name:'Hospital Bills & Reports (for medical claims)' },
    { name:'Baggage Irregularity Report (PIR) from airline' },
  ]},
  'Life': { icon: Heart, items: [
    { name:'Claim Form (Death Claim)' }, { name:'Original Policy Document' },
    { name:'Death Certificate (issued by municipal authority)' }, { name:'Medical Records / Cause of Death Certificate' },
    { name:'ID Proof & Address Proof of Nominee' }, { name:'FIR / Post-Mortem Report (if accidental death)' },
  ]},
  'Personal Accident': { icon: PersonStanding, items: [
    { name:'Claim Form' }, { name:'Policy Copy' }, { name:'FIR / MLC Report' },
    { name:'Medical Certificates & Hospital Reports' }, { name:'Disability Certificate (if applicable)' },
    { name:'Death Certificate & Post-Mortem Report (for fatal cases)' },
  ]},
}

const expectations = [
  { heading:'1. Acknowledgment',   lines:["You'll receive an acknowledgment via email or SMS with a claim reference number."] },
  { heading:'2. Document Review',  lines:['The insurer will review your claim form and supporting documents. If anything is missing, they\'ll request additional info.'] },
  { heading:'3. Assessment',       lines:['A claim assessor or surveyor may be appointed to verify the loss or damage.'] },
  { heading:'4. Updates',          lines:["You'll receive regular status updates via SMS, email, or the insurer's portal."] },
  { heading:'5. Decision',         lines:['The insurer will Approve or Reject / partially approve the claim with clear reasons.'] },
  { heading:'6. Settlement',       lines:['Approved claims are settled through direct transfer to your registered bank account.'] },
]

const hubCards = [
  { id:'docs',         Icon:BookOpen,      color:'#2E7D32', bg:'#E7F5EA', label:'Documents List',    desc:'Complete checklist for every insurance type.' },
  { id:'form',         Icon:ClipboardList, color:'#FF6B00', bg:'#FFF1E4', label:'Claim Register Form',desc:'File your claim online — quick and easy.' },
  { id:'info',         Icon:Info,          color:'#1a5276', bg:'#EBF5FB', label:'Claim Information',  desc:'Key facts before filing a claim.' },
  { id:'process',      Icon:FileText,      color:'#6b21a8', bg:'#F3E8FF', label:'Claim Process',      desc:'Step-by-step guide to our claims process.' },
  { id:'expectations', Icon:AlertCircle,   color:'#FF6B00', bg:'#FFF1E4', label:'What to Expect',     desc:'Know what happens after you file.' },
  { id:'testimonials', Icon:Quote,         color:'#2E7D32', bg:'#E7F5EA', label:'Testimonials',       desc:'Real stories from customers we helped.' },
  { id:'grievance',    Icon:Users,         color:'#1a5276', bg:'#EBF5FB', label:'Claim Grievance',    desc:'Reach our dedicated claims team directly.' },
]

interface ClaimFormState { name:string; phone:string; email:string; type:string; desc:string }
interface ClaimFormErrors { name?:string; phone?:string; type?:string }

function validateForm(f: ClaimFormState): ClaimFormErrors {
  const e: ClaimFormErrors = {}
  if (!f.name.trim()) e.name = 'Name is required.'
  if (!f.phone.trim()) { e.phone = 'Phone is required.' }
  else if (!/^[6-9]\d{9}$/.test(f.phone.replace(/[\s\-+]/g,'').replace(/^91/,''))) { e.phone = 'Enter a valid 10-digit Indian mobile number.' }
  if (!f.type) e.type = 'Please select an insurance type.'
  return e
}

/* ── Modal ── */
function ClaimsModal({ label, onClose, children }: { id?: string; label: string; onClose: ()=>void; children: React.ReactNode }) {
  return (
    <motion.div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      transition={{ duration:0.2 }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative bg-white rounded-2xl shadow-apple-xl w-full max-w-[640px] max-h-[88vh] flex flex-col overflow-hidden z-10"
        initial={{ scale:0.93, opacity:0, y:20 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:0.95, opacity:0, y:10 }}
        transition={{ duration:0.25, ease:EASE }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h3 className="font-poppins font-bold text-[17px] text-gray-900">{label}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer border-none transition-colors">
            <X size={16} color="#374151" />
          </button>
        </div>
        {/* Body */}
        <div className="overflow-y-auto p-6 flex-1">{children}</div>
      </motion.div>
    </motion.div>
  )
}

export default function Claims() {
  const [activeDoc,   setActiveDoc]   = useState('Motor')
  const [openExpect,  setOpenExpect]  = useState<number|null>(null)
  const [modal,       setModal]       = useState<string|null>(null)
  const [formData,    setFormData]    = useState<ClaimFormState>({ name:'', phone:'', email:'', type:'', desc:'' })
  const [formErrors,  setFormErrors]  = useState<ClaimFormErrors>({})
  const [formSent,    setFormSent]    = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [formApiErr,  setFormApiErr]  = useState('')

  useEffect(() => { document.body.style.overflow = modal ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [modal])
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setModal(null) }
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h)
  }, [])

  const handleChange = (field: keyof ClaimFormState, val: string) => {
    setFormData(p => ({ ...p, [field]: val }))
    if (formErrors[field as keyof ClaimFormErrors]) setFormErrors(p => ({ ...p, [field]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setFormApiErr('')
    const errs = validateForm(formData)
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return }
    setFormLoading(true)
    try {
      await submitClaim({ name:formData.name.trim(), phone:formData.phone.trim(), email:formData.email.trim()||undefined, type:formData.type, desc:formData.desc.trim()||undefined, source:'claims-page' })
      setFormSent(true)
    } catch { setFormApiErr('Something went wrong. Please call us at +91 74860 20672.') }
    finally { setFormLoading(false) }
  }

  const processRef = useRef(null)
  const hubRef     = useRef(null)
  const chanRef    = useRef(null)
  const testiRef   = useRef(null)
  const processInView = useInView(processRef, { once:true, margin:'-80px' })
  const hubInView     = useInView(hubRef,     { once:true, margin:'-80px' })
  const chanInView    = useInView(chanRef,    { once:true, margin:'-80px' })
  const testiInView   = useInView(testiRef,   { once:true, margin:'-80px' })

  return (
    <>
      <style>{`
        @keyframes sssLogoSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
      <Helmet>
        <title>Claims | SSS Risk Management & Insurance Brokers</title>
        <meta name="description" content="File and track your insurance claim with SSS Risk Management. Hassle-free claims support across motor, health, life and commercial insurance." />
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-16 pb-20">
        <div className="absolute inset-0"
          style={{ background:'linear-gradient(135deg, rgba(255,107,0,0.18) 0%, rgba(255,160,60,0.10) 18%, rgba(255,255,255,0.98) 40%, rgba(255,255,255,1) 50%, rgba(220,245,225,0.85) 72%, rgba(46,125,50,0.20) 100%)' }} />
        <div className="absolute top-[-60px] left-[-60px] w-[320px] h-[320px] rounded-full pointer-events-none"
          style={{ background:'radial-gradient(circle, rgba(255,107,0,0.14) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-80px] right-[-80px] w-[380px] h-[380px] rounded-full pointer-events-none"
          style={{ background:'radial-gradient(circle, rgba(46,125,50,0.14) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-white pointer-events-none z-10" />
        {/* SSS logo watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <img src="/assets/sss.png" alt="" className="w-[480px] h-[480px] object-contain" style={{ opacity: 0.07, animation: 'sssLogoSpin 20s linear infinite' }} />
        </div>
        <div className="relative z-20 text-center px-6 max-w-[720px] mx-auto">
          <motion.span className="inline-block bg-orange-50/80 text-brand-orange font-inter text-[11px] font-bold tracking-[1.5px] uppercase px-3.5 py-1.5 rounded-full mb-4 border border-orange-200"
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, ease:EASE }}>
            CLAIMS SUPPORT
          </motion.span>
          <div className="overflow-hidden mb-1">
            <motion.h1 className="font-poppins font-extrabold text-[clamp(28px,4vw,46px)] text-[#1B2A4A]"
              initial={{ y:'110%' }} animate={{ y:0 }} transition={{ delay:0.1, duration:0.7, ease:EASE }}>
              We're With You
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-4">
            <motion.h1 className="font-poppins font-extrabold text-[clamp(28px,4vw,46px)] text-brand-orange"
              initial={{ y:'110%' }} animate={{ y:0 }} transition={{ delay:0.2, duration:0.7, ease:EASE }}>
              Every Step of the Way
            </motion.h1>
          </div>
          <motion.p className="font-inter text-[15px] text-gray-500 leading-relaxed mb-8 max-w-[520px] mx-auto"
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4, duration:0.55, ease:EASE }}>
            Filing a claim shouldn't be stressful. Our dedicated team handles everything — from paperwork to settlement.
          </motion.p>
          <motion.div className="flex flex-wrap gap-3 justify-center"
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5, duration:0.5, ease:EASE }}>
            <button onClick={() => setModal('form')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-xl font-poppins font-bold text-[13.5px] border-2 border-brand-orange cursor-pointer transition-all hover:bg-brand-orange-dark hover:-translate-y-1 shadow-orange">
              <ClipboardList size={16} /> FILE A CLAIM NOW
            </button>
            <a href="tel:+917486020672"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-blue border-2 border-brand-blue rounded-xl font-poppins font-bold text-[13.5px] no-underline transition-all hover:bg-brand-blue hover:text-white hover:-translate-y-1">
              <Phone size={16} /> CALL CLAIMS HELPLINE
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Intimate Channels ── */}
      <section className="py-12 bg-white" ref={chanRef}>
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-5">
          {intimateChannels.map((c, i) => (
            <motion.a key={c.label} href={c.href}
              className="group bg-white border-[1.5px] border-gray-200 rounded-2xl p-6 no-underline transition-all duration-500 ease-smooth hover:border-brand-orange hover:shadow-orange hover:-translate-y-1"
              initial={{ opacity:0, y:24 }} animate={chanInView ? { opacity:1, y:0 } : {}}
              transition={{ delay:i*0.1, duration:0.55, ease:EASE }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3.5" style={{ background:c.bg }}>
                <c.Icon size={22} color={c.color} strokeWidth={1.8} />
              </div>
              <div className="font-poppins font-bold text-[14px] text-gray-900 mb-1.5">{c.label}</div>
              <p className="font-inter text-[12.5px] text-gray-500 leading-relaxed mb-3">{c.desc}</p>
              <span className="font-poppins font-bold text-[12px] flex items-center gap-1 transition-all group-hover:gap-2" style={{ color:c.color }}>
                {c.action} →
              </span>
            </motion.a>
          ))}
        </div>
      </section>

      {/* ── Process Steps ── */}
      <section className="py-[72px] bg-white" ref={processRef}>
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div className="text-center mb-12"
            initial={{ opacity:0, y:24 }} animate={processInView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.55, ease:EASE }}>
            <span className="inline-block bg-orange-50 text-brand-orange font-inter text-[11.5px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-3 border border-orange-200">
              Easy Process
            </span>
            <h2 className="font-poppins font-bold text-[clamp(22px,3vw,32px)] text-gray-900">
              How the <span className="text-brand-orange">Claims Process Works</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {processSteps.map((s, i) => (
              <motion.div key={s.num}
                className="group bg-white rounded-2xl p-5 border-[1.5px] border-gray-200 text-center transition-all duration-500 ease-smooth hover:border-brand-orange hover:shadow-orange hover:-translate-y-1"
                initial={{ opacity:0, y:24 }} animate={processInView ? { opacity:1, y:0 } : {}}
                transition={{ delay:i*0.08, duration:0.55, ease:EASE }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background:s.bg }}>
                  <s.Icon size={22} color={s.color} strokeWidth={1.8} />
                </div>
                <div className="font-poppins font-bold text-[10.5px] uppercase tracking-widest mb-1.5" style={{ color:s.color }}>{s.num}</div>
                <div className="font-poppins font-semibold text-[13px] text-gray-900 mb-1.5">{s.label}</div>
                <p className="font-inter text-[11.5px] text-gray-500 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hub Cards ── */}
      <section className="py-[72px] bg-white" ref={hubRef}>
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div className="text-center mb-12"
            initial={{ opacity:0, y:24 }} animate={hubInView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.55, ease:EASE }}>
            <span className="inline-block bg-orange-50 text-brand-orange font-inter text-[11.5px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-3 border border-orange-200">
              Claims Hub
            </span>
            <h2 className="font-poppins font-bold text-[clamp(22px,3vw,32px)] text-gray-900">
              Everything You Need to <span className="text-brand-orange">Know</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {hubCards.map((c, i) => (
              <motion.button key={c.id}
                onClick={() => setModal(c.id)}
                className="group bg-white rounded-2xl p-6 border-[1.5px] border-gray-200 text-left cursor-pointer transition-all duration-500 ease-smooth hover:border-brand-orange hover:shadow-orange hover:-translate-y-1 w-full"
                initial={{ opacity:0, y:32 }} animate={hubInView ? { opacity:1, y:0 } : {}}
                transition={{ delay:i*0.08, duration:0.55, ease:EASE }}
                whileTap={{ scale:0.98 }}>
                <div className="w-[52px] h-[52px] rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ background:c.bg }}>
                  <c.Icon size={24} color={c.color} strokeWidth={1.8} />
                </div>
                <div className="font-poppins font-bold text-[14px] text-gray-900 mb-1.5">{c.label}</div>
                <p className="font-inter text-[12.5px] text-gray-500 leading-relaxed">{c.desc}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-[72px] bg-white" ref={testiRef}>
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div className="text-center mb-12"
            initial={{ opacity:0, y:24 }} animate={testiInView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.55, ease:EASE }}>
            <span className="inline-block bg-orange-50 text-brand-orange font-inter text-[11.5px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-3 border border-orange-200">
              Customer Stories
            </span>
            <h2 className="font-poppins font-bold text-[clamp(22px,3vw,32px)] text-gray-900">
              Real <span className="text-brand-orange">Claims. Real Results.</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name}
                className="group bg-white rounded-2xl p-7 border-[1.5px] border-gray-200 shadow-sm transition-all duration-500 ease-smooth hover:-translate-y-1 hover:border-brand-orange hover:shadow-orange"
                initial={{ opacity:0, y:32 }} animate={testiInView ? { opacity:1, y:0 } : {}}
                transition={{ delay:i*0.12, duration:0.6, ease:EASE }}>
                <div className="absolute top-5 right-5 text-[52px] text-gray-100 font-serif leading-none select-none">"</div>
                <div className="flex gap-0.5 mb-3.5">
                  {Array.from({ length:5 }).map((_, j) => (
                    <span key={j} className={`text-[16px] ${j < t.rating ? 'text-brand-orange' : 'text-gray-200'}`}>★</span>
                  ))}
                </div>
                <p className="font-inter text-[13.5px] text-gray-600 leading-[1.75] mb-5 relative z-10">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue to-brand-blue-light flex items-center justify-center font-poppins font-bold text-[15px] text-white flex-shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-poppins font-semibold text-[14px] text-gray-900">{t.name}</div>
                    <div className="font-inter text-[12px] text-gray-400">Verified Customer</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <motion.section className="py-14 px-6 bg-[#1B2A4A]"
        initial={{ opacity:0 }} whileInView={{ opacity:1 }}
        transition={{ duration:0.6, ease:EASE }} viewport={{ once:true }}>
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-8 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2.5">
              <ShieldCheck size={28} color="#FF6B00" strokeWidth={1.8} />
              <h3 className="font-poppins font-bold text-[clamp(18px,2.5vw,24px)] text-white">Need Help With Your Claim?</h3>
            </div>
            <p className="font-inter text-[14px] text-white/70">Our dedicated claims team is ready to assist you — 24/7 support available.</p>
          </div>
          <div className="flex gap-3.5 flex-wrap">
            <button onClick={() => setModal('form')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-lg font-poppins font-bold text-[13px] cursor-pointer border-none transition-all hover:bg-brand-orange-dark hover:-translate-y-1 whitespace-nowrap">
              FILE A CLAIM →
            </button>
            <Link to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-white border-2 border-white/50 rounded-lg font-poppins font-bold text-[13px] no-underline transition-all hover:bg-white/10 hover:-translate-y-1 whitespace-nowrap">
              CONTACT US →
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ── Modals ── */}
      <AnimatePresence>
        {/* Documents */}
        {modal === 'docs' && (
          <ClaimsModal id="docs" label="Documents Checklist" onClose={() => setModal(null)}>
            <div className="flex flex-wrap gap-2 mb-5">
              {Object.keys(docLibrary).map(cat => (
                <button key={cat} onClick={() => setActiveDoc(cat)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-poppins font-semibold text-[12px] border-[1.5px] cursor-pointer transition-all ${
                    activeDoc === cat ? 'bg-brand-orange text-white border-brand-orange' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-orange hover:text-brand-orange'
                  }`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {docLibrary[activeDoc].items.map((item, i) => item.isHeader ? (
                <div key={i} className="font-poppins font-bold text-[12px] text-brand-orange uppercase tracking-wider mt-3 first:mt-0 pb-1 border-b border-orange-100">{item.name}</div>
              ) : (
                <div key={i} className="flex items-start gap-2.5 font-inter text-[13.5px] text-gray-700 py-1.5 border-b border-gray-50 last:border-b-0">
                  <CheckCircle2 size={15} color="#2E7D32" strokeWidth={2} className="flex-shrink-0 mt-0.5" />
                  {item.name}
                </div>
              ))}
            </div>
          </ClaimsModal>
        )}

        {/* Claim Form */}
        {modal === 'form' && (
          <ClaimsModal id="form" label="Register Your Claim" onClose={() => setModal(null)}>
            {!formSent ? (
              <form onSubmit={handleSubmit} noValidate>
                {formApiErr && (
                  <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl p-3.5 mb-4 font-inter text-[13px] text-red-700">
                    <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />{formApiErr}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-inter text-[13px] font-semibold text-gray-700">Full Name <span className="text-brand-orange">*</span></label>
                    <input className={`px-3.5 py-2.5 border-[1.5px] rounded-xl font-inter text-[14px] text-gray-900 bg-gray-50 outline-none transition-colors focus:border-brand-orange focus:bg-white ${formErrors.name ? 'border-red-500' : 'border-gray-200'}`}
                      placeholder="Your name" value={formData.name} onChange={e => handleChange('name', e.target.value)} />
                    {formErrors.name && <span className="font-inter text-[11.5px] text-red-600">{formErrors.name}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-inter text-[13px] font-semibold text-gray-700">Phone <span className="text-brand-orange">*</span></label>
                    <input className={`px-3.5 py-2.5 border-[1.5px] rounded-xl font-inter text-[14px] text-gray-900 bg-gray-50 outline-none transition-colors focus:border-brand-orange focus:bg-white ${formErrors.phone ? 'border-red-500' : 'border-gray-200'}`}
                      type="tel" placeholder="98765 43210" value={formData.phone} onChange={e => handleChange('phone', e.target.value)} />
                    {formErrors.phone && <span className="font-inter text-[11.5px] text-red-600">{formErrors.phone}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-inter text-[13px] font-semibold text-gray-700">Email</label>
                    <input className="px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-xl font-inter text-[14px] text-gray-900 bg-gray-50 outline-none transition-colors focus:border-brand-orange focus:bg-white"
                      type="email" placeholder="you@email.com" value={formData.email} onChange={e => handleChange('email', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-inter text-[13px] font-semibold text-gray-700">Insurance Type <span className="text-brand-orange">*</span></label>
                    <select className={`px-3.5 py-2.5 border-[1.5px] rounded-xl font-inter text-[14px] text-gray-900 bg-gray-50 outline-none transition-colors focus:border-brand-orange focus:bg-white ${formErrors.type ? 'border-red-500' : 'border-gray-200'}`}
                      value={formData.type} onChange={e => handleChange('type', e.target.value)}>
                      <option value="">Select type</option>
                      {['Motor Insurance','Health Insurance','Life Insurance','Home Insurance','Travel Insurance','Commercial Insurance','Personal Accident','Other'].map(t => <option key={t}>{t}</option>)}
                    </select>
                    {formErrors.type && <span className="font-inter text-[11.5px] text-red-600">{formErrors.type}</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 mb-5">
                  <label className="font-inter text-[13px] font-semibold text-gray-700">Describe the Incident</label>
                  <textarea className="px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-xl font-inter text-[14px] text-gray-900 bg-gray-50 outline-none transition-colors focus:border-brand-orange focus:bg-white resize-y min-h-[90px]"
                    placeholder="Brief description of the incident..." value={formData.desc} onChange={e => handleChange('desc', e.target.value)} />
                </div>
                <button type="submit" disabled={formLoading}
                  className="w-full py-3.5 bg-brand-orange text-white rounded-xl font-poppins font-bold text-[15px] border-none cursor-pointer flex items-center justify-center gap-2 transition-all hover:bg-brand-orange-dark disabled:opacity-75 disabled:cursor-not-allowed">
                  {formLoading ? <><Loader2 size={18} className="animate-spin" /> Submitting…</> : 'SUBMIT CLAIM REQUEST →'}
                </button>
              </form>
            ) : (
              <div className="text-center py-4">
                <div className="text-5xl mb-4">✅</div>
                <div className="font-poppins font-bold text-[18px] text-gray-900 mb-2">Claim Request Received!</div>
                <p className="font-inter text-[13.5px] text-gray-500 leading-relaxed mb-5">
                  Thank you, <strong>{formData.name}</strong>. Our team will contact you at <strong>{formData.phone}</strong> within 2 hours.
                </p>
                <button onClick={() => { setFormSent(false); setFormData({ name:'',phone:'',email:'',type:'',desc:'' }); setFormErrors({}) }}
                  className="font-poppins font-bold text-[13px] text-brand-orange bg-transparent border-none cursor-pointer hover:underline">
                  Submit another →
                </button>
              </div>
            )}
          </ClaimsModal>
        )}

        {/* Info */}
        {modal === 'info' && (
          <ClaimsModal id="info" label="Claim Information" onClose={() => setModal(null)}>
            <div className="flex flex-col gap-3">
              {['Claims must be notified immediately after the incident.',
                'Ensure you provide complete documentation for faster processing.',
                'Claims can be settled through Cashless or Reimbursement mode.',
                'For assistance, contact our 24/7 Claim Helpline.',
                'Keep all original bills and documents safe for submission.',
              ].map((b, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-6 h-6 rounded-full bg-brand-orange/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="font-poppins font-bold text-[11px] text-brand-orange">{i+1}</span>
                  </div>
                  <p className="font-inter text-[13.5px] text-gray-700 leading-relaxed">{b}</p>
                </div>
              ))}
            </div>
          </ClaimsModal>
        )}

        {/* Process */}
        {modal === 'process' && (
          <ClaimsModal id="process" label="Claim Process" onClose={() => setModal(null)}>
            <div className="flex flex-col gap-3">
              {processSteps.map((s) => (
                <div key={s.num} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:s.bg }}>
                    <s.Icon size={20} color={s.color} strokeWidth={1.8} />
                  </div>
                  <div>
                    <div className="font-poppins font-bold text-[13px] text-gray-900 mb-1">{s.num}. {s.label}</div>
                    <p className="font-inter text-[12.5px] text-gray-500 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ClaimsModal>
        )}

        {/* Expectations */}
        {modal === 'expectations' && (
          <ClaimsModal id="expectations" label="What to Expect" onClose={() => setModal(null)}>
            <div className="flex flex-col gap-2">
              {expectations.map((e, i) => (
                <div key={i} className={`border-[1.5px] rounded-xl overflow-hidden transition-colors ${openExpect===i ? 'border-brand-orange' : 'border-gray-200'}`}>
                  <button onClick={() => setOpenExpect(openExpect===i ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-3.5 cursor-pointer bg-white hover:bg-orange-50 transition-colors text-left gap-2.5">
                    <span className="font-poppins font-semibold text-[13px] text-gray-900">{e.heading}</span>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${openExpect===i ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <ChevronDown size={13} className={`transition-transform ${openExpect===i ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {openExpect === i && (
                      <motion.div key="body"
                        initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
                        transition={{ duration:0.22 }} className="overflow-hidden">
                        <div className="px-4 pb-3.5 pt-2.5 font-inter text-[12.5px] text-gray-600 leading-relaxed border-t border-gray-100">
                          {e.lines.join(' ')}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </ClaimsModal>
        )}

        {/* Testimonials */}
        {modal === 'testimonials' && (
          <ClaimsModal id="testimonials" label="Customer Testimonials" onClose={() => setModal(null)}>
            <div className="flex flex-col gap-4">
              {testimonials.map((t) => (
                <div key={t.name} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="flex gap-0.5 mb-2.5">
                    {Array.from({length:5}).map((_,j) => <span key={j} className="text-brand-orange">★</span>)}
                  </div>
                  <p className="font-inter text-[13.5px] text-gray-700 leading-relaxed mb-3 italic">"{t.text}"</p>
                  <div className="font-poppins font-semibold text-[13px] text-gray-900">— {t.name}</div>
                </div>
              ))}
            </div>
          </ClaimsModal>
        )}

        {/* Grievance */}
        {modal === 'grievance' && (
          <ClaimsModal id="grievance" label="Claim Grievance" onClose={() => setModal(null)}>
            <div className="flex flex-col gap-4">
              {[
                { label:'Claims Helpline', val:'+91 74860 20672', href:'tel:+917486020672', Icon:Phone, color:'#FF6B00', bg:'#FFF1E4' },
                { label:'Email Claims',    val:'claim@sssriskmanagement.com', href:'mailto:claim@sssriskmanagement.com', Icon:Mail, color:'#1a5276', bg:'#EBF5FB' },
                { label:'WhatsApp Claims', val:'+91 74860 20672', href:'https://wa.me/917486020672', Icon:MessageCircle, color:'#25D366', bg:'#E7F5EA' },
              ].map(c => (
                <a key={c.label} href={c.href} target="_blank" rel="noreferrer"
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 no-underline hover:border-brand-orange hover:bg-orange-50 transition-all group">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:c.bg }}>
                    <c.Icon size={22} color={c.color} strokeWidth={1.8} />
                  </div>
                  <div>
                    <div className="font-poppins font-bold text-[14px] text-gray-900">{c.label}</div>
                    <div className="font-inter text-[13px] text-gray-500 mt-0.5 group-hover:text-brand-orange transition-colors">{c.val}</div>
                  </div>
                </a>
              ))}
              <div className="mt-2 p-4 bg-orange-50 rounded-xl border border-orange-200">
                <p className="font-inter text-[12.5px] text-gray-600 leading-relaxed">
                  <strong className="text-brand-orange">Principal Officer:</strong> Mr. Satish Nikam<br />
                  <strong className="text-brand-orange">Email:</strong> principal@sssriskmanagement.com
                </p>
              </div>
            </div>
          </ClaimsModal>
        )}
      </AnimatePresence>
    </>
  )
}
