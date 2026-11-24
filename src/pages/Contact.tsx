import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, MessageCircle, Loader2, AlertCircle, ShieldCheck, Star } from 'lucide-react'
import { submitContact } from '../services/contactService'
import { CONTACT, SOCIAL, SITE_NAME } from '../config'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EASE: any = [0.22, 1, 0.36, 1]

interface FormState { name: string; phone: string; email: string; subject: string; message: string }
interface FormErrors { name?: string; phone?: string; subject?: string }

function validate(f: FormState): FormErrors {
  const e: FormErrors = {}
  if (!f.name.trim())    e.name    = 'Name is required.'
  if (!f.phone.trim()) {
    e.phone = 'Phone number is required.'
  } else if (!/^[6-9]\d{9}$/.test(f.phone.replace(/[\s\-+]/g, '').replace(/^91/, ''))) {
    e.phone = 'Enter a valid 10-digit Indian mobile number.'
  }
  if (!f.subject.trim()) e.subject = 'Subject is required.'
  return e
}

const contactCards = [
  { icon: Phone,         color: '#FF6B00', bg: '#FFF1E4', label: 'Call Us',   lines: [CONTACT.phone],                             href: CONTACT.phoneHref,          action: 'CALL NOW' },
  { icon: Mail,          color: '#1a5276', bg: '#EBF5FB', label: 'Email Us',  lines: [CONTACT.email],                             href: `mailto:${CONTACT.email}`,  action: 'SEND EMAIL' },
  { icon: MessageCircle, color: '#25D366', bg: '#E7F5EA', label: 'WhatsApp',  lines: [CONTACT.claimPhone],                        href: CONTACT.whatsapp,           action: 'CHAT NOW' },
  { icon: MapPin,        color: '#2E7D32', bg: '#E7F5EA', label: 'Visit Us',  lines: ['1007–1009 Altimus, Ashram Road', 'Ahmedabad, Gujarat 380009'], href: 'https://maps.google.com/?q=Altimus+Ashram+Road+Ahmedabad', action: 'GET DIRECTIONS' },
]

interface Branch {
  city: string
  tag?: string
  isHO?: boolean
  address: string
  mapUrl: string
  email?: string
}

const branches: Branch[] = [
  {
    city: 'Ahmedabad',
    tag: 'Head Office',
    isHO: true,
    address: '1007 to 1009, Altimus, Behind Sales India, Ashram Road, Ahmedabad, Gujarat – 380009',
    mapUrl: 'https://maps.google.com/?q=1007+Altimus+Ashram+Road+Ahmedabad+Gujarat+380009',
    email: 'customercare@sssriskmanagement.com',
  },
  {
    city: 'Noida',
    address: 'G.F-002, F-1, Sector-3, Noida, Uttar Pradesh – 201301',
    mapUrl: 'https://maps.google.com/?q=G.F-002+F-1+Sector-3+Noida+Uttar+Pradesh+201301',
    email: 'rajiv.kumar@sssriskmanagement.com',
  },
  {
    city: 'Mumbai',
    address: '706, 7th Floor, Corporate Avenue, Opp Atalanta Center, Sonawala Road, Goregaon East, Mumbai – 400001',
    mapUrl: 'https://maps.google.com/?q=Corporate+Avenue+Goregaon+East+Mumbai+400001',
    email: 'anandrao.bhosale@sssriskmanagement.com',
  },
  {
    city: 'Kolkata',
    address: 'Benchworks, New Town Square Building, 4M, Chinar Park, Room No. 2B, Rajarhat, Kolkata – 700136',
    mapUrl: 'https://maps.google.com/?q=New+Town+Square+Chinar+Park+Kolkata+700136',
    email: 'chirabrata.sen@sssriskmanagement.com',
  },
  {
    city: 'Gandhidham',
    address: 'Aum Corner, Banking Circle, Gandhidham – 370201',
    mapUrl: 'https://maps.google.com/?q=Banking+Circle+Gandhidham+370201',
    email: 'darshan.solanki@sssriskmanagement.com',
  },
  {
    city: 'Rajkot',
    address: '404, Ganesh Trade Centre, Between KKV Hall & Indira Circle, 150 Feet Ring Road, Rajkot – 360005',
    mapUrl: 'https://maps.google.com/?q=Ganesh+Trade+Centre+150+Feet+Ring+Road+Rajkot+360005',
    email: 'mayur.bhensdadia@sssriskmanagement.com',
  },
  {
    city: 'Pune',
    address: 'Rama Equator, Office No. 611, Near PCMC Metro Station, Pimpri Colony, Pune – 411018',
    mapUrl: 'https://maps.google.com/?q=Rama+Equator+Pimpri+Colony+Pune+411018',
    email: 'reena.tyagi@sssriskmanagement.com',
  },
  {
    city: 'Kolhapur',
    address: 'Lord Vista Building, 836/1, E Ward, 1st Floor, Office No. 108, 4th Lane Shahupuri, Kolhapur – 416001',
    mapUrl: 'https://maps.google.com/?q=Lord+Vista+Building+Shahupuri+Kolhapur+416001',
    email: 'rahul.mane@sssriskmanagement.com',
  },
  {
    city: 'Bangalore',
    address: 'Bangalore — contact us for the latest address.',
    mapUrl: 'https://maps.google.com/?q=Bangalore+Karnataka',
    email: 'customercare@sssriskmanagement.com',
  },
  {
    city: 'Vadodara',
    address: '819, 8th Floor, Samanvay Silver, Behind The Royal Orchid Central Hotel, Akota Mujmahuda Road, Vadodara – 390020',
    mapUrl: 'https://maps.google.com/?q=Samanvay+Silver+Akota+Vadodara+390020',
    email: 'anshu.mangtani@sssriskmanagement.com',
  },
  {
    city: 'Vapi',
    address: 'SB-08, 2nd Floor, Solitaire Business Centre, Opp. DCB Bank, GIDC Char Rasta, Vapi – 396195',
    mapUrl: 'https://maps.google.com/?q=Solitaire+Business+Centre+GIDC+Vapi+396195',
    email: 'anil.mohite@sssriskmanagement.com',
  },
  {
    city: 'Surat',
    address: 'Ground Floor, Shop No. 122, Abhikram Apartment, Opp. Bhulabhavan School, Adajan Gam, Surat – 395009',
    mapUrl: 'https://maps.google.com/?q=Abhikram+Apartment+Adajan+Surat+395009',
    email: 'customercare@sssriskmanagement.com',
  },
]

export default function Contact() {
  const [form, setForm]       = useState<FormState>({ name: '', phone: '', email: '', subject: '', message: '' })
  const [errors, setErrors]   = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [apiErr, setApiErr]   = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    if (errors[name as keyof FormErrors]) setErrors(p => ({ ...p, [name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiErr('')
    const errs = validate(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    try {
      await submitContact({
        name:    form.name.trim(),
        email:   form.email.trim() || undefined,
        message: `Subject: ${form.subject.trim()}. ${form.message.trim()}`.trim(),
      })
      setSent(true)
    } catch {
      setApiErr('Something went wrong. Please call us directly or try again.')
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
      <Helmet>
        <title>Contact Us | {SITE_NAME}</title>
        <meta name="description" content="Get in touch with SSS Risk Management & Insurance Brokers. 12 branches across India — Ahmedabad, Mumbai, Noida, Pune, Kolkata and more." />
      </Helmet>

      <style>{`
        .ct-page { font-family: 'Inter', sans-serif; background: #fff; }

        /* ── Hero ── */
        .ct-hero { position: relative; overflow: visible; padding: 0; min-height: 260px; }
        .ct-hero-bg {
          position: absolute; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden; z-index: 0;
          background: linear-gradient(135deg,
            rgba(255,107,0,0.18) 0%, rgba(255,160,60,0.10) 18%,
            rgba(255,255,255,0.98) 40%, rgba(255,255,255,1) 50%,
            rgba(220,245,225,0.85) 72%, rgba(46,125,50,0.20) 100%);
        }
        .ct-hero-bg::before { content:''; position:absolute; top:-60px; left:-60px; width:320px; height:320px; border-radius:50%; background:radial-gradient(circle,rgba(255,107,0,0.14) 0%,transparent 70%); }
        .ct-hero-bg::after  { content:''; position:absolute; bottom:-80px; right:-80px; width:380px; height:380px; border-radius:50%; background:radial-gradient(circle,rgba(46,125,50,0.14) 0%,transparent 70%); }
        .ct-hero-content { position:relative; z-index:1; padding:64px 24px 88px; text-align:center; }
        .ct-hero-fade { position:absolute; bottom:0; left:0; right:0; height:80px; background:linear-gradient(to bottom,transparent 0%,#fff 100%); pointer-events:none; z-index:2; }
        .ct-hero-tag { display:inline-block; background:rgba(255,107,0,0.12); color:#e55f00; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; padding:5px 14px; border-radius:50px; border:1px solid rgba(255,107,0,0.30); margin-bottom:16px; }
        .ct-hero-title { font-family:'Poppins',sans-serif; font-weight:800; font-size:clamp(28px,4vw,46px); color:#1B2A4A; margin:0 0 12px; }
        .ct-hero-sub { font-size:15px; color:#4b5563; max-width:520px; margin:0 auto; line-height:1.65; }

        /* ── Quick Contact Cards ── */
        .ct-cards { max-width:1280px; margin:-36px auto 0; padding:0 24px; display:grid; grid-template-columns:repeat(4,1fr); gap:20px; position:relative; z-index:10; }
        .ct-card { background:#fff; border-radius:16px; box-shadow:0 4px 20px rgba(17,24,39,0.09); padding:28px 22px 22px; border:1.5px solid #f0f1f4; transition:all 0.25s; }
        .ct-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(17,24,39,0.13); border-color:#FF6B00; }
        .ct-card-icon { width:52px; height:52px; border-radius:14px; display:flex; align-items:center; justify-content:center; margin-bottom:14px; }
        .ct-card-label { font-family:'Poppins',sans-serif; font-weight:700; font-size:14px; color:#111827; margin-bottom:8px; }
        .ct-card-line { font-size:13px; color:#374151; line-height:1.65; word-break:break-all; }
        .ct-card-link { display:inline-flex; align-items:center; gap:6px; margin-top:14px; font-family:'Poppins',sans-serif; font-weight:700; font-size:12px; text-decoration:none; transition:gap 0.2s; }
        .ct-card-link:hover { gap:10px; }

        /* ── Body grid (form + info) ── */
        .ct-body { max-width:1280px; margin:64px auto 0; padding:0 24px; display:grid; grid-template-columns:1.1fr 0.9fr; gap:56px; align-items:start; }
        .ct-form-card { background:#fff; border-radius:20px; box-shadow:0 8px 40px rgba(17,24,39,0.08); padding:40px; border:1px solid #f0f1f4; }
        .ct-form-title { font-family:'Poppins',sans-serif; font-weight:700; font-size:22px; color:#111827; margin:0 0 6px; }
        .ct-form-sub { font-size:13px; color:#9ca3af; margin-bottom:32px; }
        .ct-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:18px; }
        .ct-field { display:flex; flex-direction:column; gap:6px; }
        .ct-field.full { grid-column:1/-1; }
        .ct-label { font-size:13px; font-weight:600; color:#374151; }
        .ct-label span { color:#FF6B00; }
        .ct-input,.ct-textarea { padding:11px 14px; border:1.5px solid #e5e7eb; border-radius:9px; font-family:'Inter',sans-serif; font-size:14px; color:#111827; background:#fafafa; outline:none; transition:border-color 0.2s; width:100%; box-sizing:border-box; }
        .ct-input:focus,.ct-textarea:focus { border-color:#FF6B00; background:#fff; }
        .ct-input.err { border-color:#dc2626; }
        .ct-textarea { resize:vertical; min-height:110px; }
        .ct-err-msg { font-size:12px; color:#dc2626; display:flex; align-items:center; gap:4px; }
        .ct-api-err { display:flex; align-items:flex-start; gap:10px; background:#fef2f2; border:1px solid #fecaca; border-radius:9px; padding:12px 14px; margin-bottom:16px; font-size:13.5px; color:#b91c1c; line-height:1.5; }
        .ct-submit { width:100%; padding:14px; background:#FF6B00; color:#fff; border:none; border-radius:10px; font-family:'Poppins',sans-serif; font-weight:700; font-size:15px; cursor:pointer; transition:all 0.2s; margin-top:8px; display:flex; align-items:center; justify-content:center; gap:8px; }
        .ct-submit:hover:not(:disabled) { background:#e55f00; transform:translateY(-2px); }
        .ct-submit:disabled { opacity:0.75; cursor:not-allowed; transform:none; }
        .ct-success { text-align:center; padding:40px 16px; }
        .ct-success-icon { width:80px; height:80px; border-radius:50%; background:#E7F5EA; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; }
        .ct-success-title { font-family:'Poppins',sans-serif; font-weight:800; font-size:22px; color:#111827; margin-bottom:10px; }
        .ct-success-sub { font-size:14px; color:#6b7280; line-height:1.65; margin-bottom:24px; }
        .ct-back-btn { display:inline-flex; align-items:center; gap:8px; padding:12px 24px; background:#FF6B00; color:#fff; border-radius:8px; font-family:'Poppins',sans-serif; font-weight:700; font-size:13px; text-decoration:none; }

        /* Info side */
        .ct-info-title { font-family:'Poppins',sans-serif; font-weight:800; font-size:clamp(20px,2.5vw,28px); color:#111827; margin:0 0 10px; }
        .ct-info-title span { color:#FF6B00; }
        .ct-info-sub { font-size:14px; color:#6b7280; line-height:1.7; margin-bottom:32px; }
        .ct-info-block { display:flex; align-items:flex-start; gap:16px; padding:20px; background:#f9fafb; border-radius:14px; margin-bottom:14px; border:1.5px solid #f0f1f4; transition:border-color 0.2s; }
        .ct-info-block:hover { border-color:#FF6B00; }
        .ct-info-icon { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .ct-info-block-label { font-family:'Poppins',sans-serif; font-weight:700; font-size:14px; color:#111827; margin-bottom:4px; }
        .ct-info-block-val { font-size:13px; color:#374151; line-height:1.65; word-break:break-all; }
        .ct-info-block-val a { color:#FF6B00; text-decoration:none; }
        .ct-info-block-val a:hover { text-decoration:underline; }
        .ct-hours { background:#1B2A4A; border-radius:16px; padding:24px; margin-top:24px; }
        .ct-hours-title { font-family:'Poppins',sans-serif; font-weight:700; font-size:15px; color:#fff; margin-bottom:14px; display:flex; align-items:center; gap:8px; }
        .ct-hours-row { display:flex; justify-content:space-between; font-size:13px; color:rgba(255,255,255,0.8); padding:7px 0; border-bottom:1px solid rgba(255,255,255,0.08); }
        .ct-hours-row:last-child { border-bottom:none; }
        .ct-hours-row span:first-child { color:rgba(255,255,255,0.55); }
        .ct-social { display:flex; gap:10px; margin-top:20px; }
        .ct-social-btn { display:inline-flex; align-items:center; gap:8px; padding:10px 18px; background:#f3f4f6; color:#374151; border-radius:8px; font-family:'Poppins',sans-serif; font-weight:600; font-size:12.5px; text-decoration:none; transition:all 0.2s; }
        .ct-social-btn:hover { background:#FF6B00; color:#fff; transform:translateY(-2px); }

        /* ── Branches Section ── */
        .ct-branches { max-width:1280px; margin:80px auto 0; padding:0 24px; }
        .ct-branches-header { margin-bottom:40px; }
        .ct-branches-tag { display:inline-block; background:#fff0e6; color:#FF6B00; font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; padding:5px 14px; border-radius:50px; border:1px solid #ffd0a8; margin-bottom:12px; }
        .ct-branches-title { font-family:'Poppins',sans-serif; font-weight:800; font-size:clamp(22px,2.8vw,32px); color:#111827; margin:0 0 8px; }
        .ct-branches-title span { color:#FF6B00; }
        .ct-branches-sub { font-size:14px; color:#6b7280; line-height:1.65; }
        .ct-branches-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }

        /* HO card — full width, featured */
        .ct-branch-card {
          background: linear-gradient(
            135deg,
            rgba(255,107,0,0.13) 0%,
            rgba(255,160,60,0.07) 20%,
            rgba(255,255,255,1) 45%,
            rgba(255,255,255,1) 55%,
            rgba(220,245,225,0.70) 80%,
            rgba(46,125,50,0.14) 100%
          );
          border-radius:16px; border:1.5px solid #e5e7eb; padding:24px 22px 20px; transition:all 0.25s; position:relative; overflow:hidden;
        }
        /* soft orange blob top-left */
        .ct-branch-card::before {
          content:''; position:absolute; top:-40px; left:-40px;
          width:160px; height:160px; border-radius:50%;
          background:radial-gradient(circle,rgba(255,107,0,0.10) 0%,transparent 70%);
          pointer-events:none;
        }
        /* soft green blob bottom-right */
        .ct-branch-card::after {
          content:''; position:absolute; bottom:-40px; right:-40px;
          width:160px; height:160px; border-radius:50%;
          background:radial-gradient(circle,rgba(46,125,50,0.10) 0%,transparent 70%);
          pointer-events:none;
        }
        .ct-branch-card:hover { border-color:#FF6B00; box-shadow:0 8px 28px rgba(255,107,0,0.12); transform:translateY(-3px); }
        .ct-branch-card.ho {
          grid-column:1/-1;
          background: linear-gradient(
            135deg,
            rgba(255,107,0,0.16) 0%,
            rgba(255,160,60,0.09) 20%,
            rgba(255,255,255,1) 45%,
            rgba(255,255,255,1) 55%,
            rgba(220,245,225,0.80) 80%,
            rgba(46,125,50,0.18) 100%
          );
          border-color:#e5e7eb; display:grid; grid-template-columns:1fr auto; gap:24px; align-items:center;
          border-width:2px;
        }
        .ct-branch-card.ho:hover { border-color:#FF6B00; box-shadow:0 12px 40px rgba(255,107,0,0.14); }
        .ct-branch-ho-badge { display:inline-flex; align-items:center; gap:6px; background:rgba(255,107,0,0.12); color:#e55f00; font-family:'Poppins',sans-serif; font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; padding:4px 12px; border-radius:50px; border:1px solid rgba(255,107,0,0.30); margin-bottom:10px; width:fit-content; }
        .ct-branch-city { font-family:'Poppins',sans-serif; font-weight:800; font-size:22px; color:#1B2A4A; margin-bottom:8px; }
        .ct-branch-city.dark { color:#111827; font-size:17px; }
        .ct-branch-addr { font-size:13px; color:#4b5563; line-height:1.7; margin-bottom:14px; }
        .ct-branch-email { display:flex; align-items:center; gap:7px; font-size:12.5px; color:#6b7280; text-decoration:none; margin-bottom:16px; word-break:break-all; }
        .ct-branch-email:hover { color:#FF6B00; }
        .ct-branch-dir { display:inline-flex; align-items:center; gap:6px; padding:10px 20px; background:#FF6B00; color:#fff; border-radius:8px; font-family:'Poppins',sans-serif; font-weight:700; font-size:12.5px; text-decoration:none; transition:all 0.2s; white-space:nowrap; position:relative; z-index:1; }
        .ct-branch-dir:hover { background:#e55f00; transform:translateY(-2px); }
        .ct-branch-dir.outline { background:transparent; color:#FF6B00; border:1.5px solid #FF6B00; }
        .ct-branch-dir.outline:hover { background:#FF6B00; color:#fff; }
        .ct-branch-icon-wrap { width:48px; height:48px; border-radius:14px; background:rgba(255,107,0,0.10); display:flex; align-items:center; justify-content:center; margin-bottom:14px; position:relative; z-index:1; }

        /* ── Map ── */
        .ct-map { max-width:1280px; margin:56px auto 72px; padding:0 24px; }
        .ct-map-header { margin-bottom:20px; }
        .ct-map-title { font-family:'Poppins',sans-serif; font-weight:700; font-size:18px; color:#111827; display:flex; align-items:center; gap:8px; }
        .ct-map-sub { font-size:13px; color:#6b7280; margin-top:4px; }
        .ct-map-frame { border-radius:16px; overflow:hidden; border:1.5px solid #e5e7eb; }

        @keyframes spin { to { transform:rotate(360deg); } }
        .spin { animation:spin 0.8s linear infinite; }

        @media (max-width:960px) { .ct-cards { grid-template-columns:repeat(2,1fr); } }
        @media (max-width:1024px) { .ct-branches-grid { grid-template-columns:repeat(2,1fr); } .ct-branch-card.ho { grid-template-columns:1fr; } }
        @media (max-width:768px) { .ct-body { grid-template-columns:1fr; } .ct-cards { margin-top:24px; } }
        @media (max-width:560px) { .ct-form-card { padding:24px 18px; } .ct-form-grid { grid-template-columns:1fr; } .ct-cards { grid-template-columns:1fr 1fr; } .ct-branches-grid { grid-template-columns:1fr; } }
        @media (max-width:380px) { .ct-cards { grid-template-columns:1fr; } }
      `}</style>

      <div className="ct-page">

        {/* ── Hero ── */}
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
              GET IN TOUCH
            </motion.span>
            <div className="overflow-hidden mb-1">
              <motion.h1 className="font-poppins font-extrabold text-[clamp(28px,4vw,46px)] text-[#1B2A4A]"
                initial={{ y:'110%' }} animate={{ y:0 }} transition={{ delay:0.1, duration:0.7, ease:EASE }}>
                Contact
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-5">
              <motion.h1 className="font-poppins font-extrabold text-[clamp(28px,4vw,46px)] text-brand-orange"
                initial={{ y:'110%' }} animate={{ y:0 }} transition={{ delay:0.2, duration:0.7, ease:EASE }}>
                Us
              </motion.h1>
            </div>
            <motion.p className="font-inter text-[15px] text-gray-500 leading-relaxed mb-8 max-w-[520px] mx-auto"
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35, duration:0.55, ease:EASE }}>
              We're here to help. Reach out through any channel and our team will respond promptly.
            </motion.p>
          </div>
        </section>

        {/* ── Quick Contact Cards ── */}
        <div className="ct-cards">
          {contactCards.map(card => {
            const Icon = card.icon
            return (
              <div key={card.label} className="ct-card">
                <div className="ct-card-icon" style={{ background: card.bg }}>
                  <Icon size={22} color={card.color} strokeWidth={1.8} />
                </div>
                <div className="ct-card-label">{card.label}</div>
                {card.lines.map((l, i) => <div key={i} className="ct-card-line">{l}</div>)}
                <a href={card.href} target={card.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="ct-card-link" style={{ color: card.color }}>
                  {card.action} →
                </a>
              </div>
            )
          })}
        </div>

        {/* ── Form + Info ── */}
        <div className="ct-body">
          {/* Form */}
          <div className="ct-form-card">
            {!sent ? (
              <>
                <div className="ct-form-title">Send Us a Message</div>
                <div className="ct-form-sub">Fill in the form and we'll get back to you within 24 hours.</div>
                {apiErr && (
                  <div className="ct-api-err">
                    <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{apiErr}</span>
                  </div>
                )}
                <form onSubmit={handleSubmit} noValidate>
                  <div className="ct-form-grid">
                    <div className="ct-field">
                      <label className="ct-label">Full Name <span>*</span></label>
                      <input className={`ct-input${errors.name ? ' err' : ''}`} name="name" placeholder="Your full name" value={form.name} onChange={handleChange} />
                      {errors.name && <span className="ct-err-msg"><AlertCircle size={12} />{errors.name}</span>}
                    </div>
                    <div className="ct-field">
                      <label className="ct-label">Phone Number <span>*</span></label>
                      <input className={`ct-input${errors.phone ? ' err' : ''}`} name="phone" type="tel" placeholder="98765 43210" value={form.phone} onChange={handleChange} />
                      {errors.phone && <span className="ct-err-msg"><AlertCircle size={12} />{errors.phone}</span>}
                    </div>
                    <div className="ct-field">
                      <label className="ct-label">Email Address</label>
                      <input className="ct-input" name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handleChange} />
                    </div>
                    <div className="ct-field">
                      <label className="ct-label">Subject <span>*</span></label>
                      <input className={`ct-input${errors.subject ? ' err' : ''}`} name="subject" placeholder="e.g. Motor Insurance Query" value={form.subject} onChange={handleChange} />
                      {errors.subject && <span className="ct-err-msg"><AlertCircle size={12} />{errors.subject}</span>}
                    </div>
                    <div className="ct-field full">
                      <label className="ct-label">Message</label>
                      <textarea className="ct-textarea" name="message" placeholder="How can we help you?" value={form.message} onChange={handleChange} />
                    </div>
                  </div>
                  <button type="submit" className="ct-submit" disabled={loading}>
                    {loading ? <><Loader2 size={18} className="spin" /> Sending…</> : 'SEND MESSAGE →'}
                  </button>
                </form>
              </>
            ) : (
              <div className="ct-success">
                <div className="ct-success-icon"><ShieldCheck size={36} color="#2E7D32" strokeWidth={1.8} /></div>
                <div className="ct-success-title">Message Sent!</div>
                <p className="ct-success-sub">
                  Thank you, <strong>{form.name}</strong>. We've received your message and will contact you at <strong>{form.phone}</strong> within 24 hours.
                </p>
                <Link to="/" className="ct-back-btn">← BACK TO HOME</Link>
              </div>
            )}
          </div>

          {/* Info Side */}
          <div>
            <h2 className="ct-info-title">We'd Love to <span>Hear from You</span></h2>
            <p className="ct-info-sub">Whether you have questions about insurance, need claims support, or want to partner with us — we're just a message away.</p>
            <div className="ct-info-block">
              <div className="ct-info-icon" style={{ background: '#FFF1E4' }}><Phone size={20} color="#FF6B00" strokeWidth={1.8} /></div>
              <div>
                <div className="ct-info-block-label">Phone</div>
                <div className="ct-info-block-val"><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></div>
              </div>
            </div>
            <div className="ct-info-block">
              <div className="ct-info-icon" style={{ background: '#EBF5FB' }}><Mail size={20} color="#1a5276" strokeWidth={1.8} /></div>
              <div>
                <div className="ct-info-block-label">Email</div>
                <div className="ct-info-block-val"><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></div>
              </div>
            </div>
            <div className="ct-info-block">
              <div className="ct-info-icon" style={{ background: '#E7F5EA' }}><MapPin size={20} color="#2E7D32" strokeWidth={1.8} /></div>
              <div>
                <div className="ct-info-block-label">Head Office</div>
                <div className="ct-info-block-val">1007 to 1009, Altimus, Behind Sales India,<br />Ashram Road, Ahmedabad, Gujarat – 380009</div>
              </div>
            </div>
            <div className="ct-social">
              <a href={SOCIAL.facebook}  target="_blank" rel="noreferrer" className="ct-social-btn">Facebook</a>
              <a href={SOCIAL.instagram} target="_blank" rel="noreferrer" className="ct-social-btn">Instagram</a>
              <a href={SOCIAL.linkedin}  target="_blank" rel="noreferrer" className="ct-social-btn">LinkedIn</a>
            </div>
          </div>
        </div>

        {/* ── Branches ── */}
        <div className="ct-branches">
          <div className="ct-branches-header">
            <div className="ct-branches-tag">PAN INDIA PRESENCE</div>
            <h2 className="ct-branches-title">Our <span>Branches</span></h2>
            <p className="ct-branches-sub">Reach out to the branch nearest you. We're present across 12 cities in India.</p>
          </div>

          <div className="ct-branches-grid">
            {branches.map(branch => (
              branch.isHO ? (
                /* Head Office — featured full-width dark card */
                <div key={branch.city} className="ct-branch-card ho">
                  <div>
                    <div className="ct-branch-ho-badge">
                      <Star size={11} fill="#FF6B00" strokeWidth={0} /> {branch.tag}
                    </div>
                    <div className="ct-branch-city">{branch.city}</div>
                    <div className="ct-branch-addr">{branch.address}</div>
                    <a href={`mailto:${branch.email || CONTACT.email}`} className="ct-branch-email">
                      <Mail size={13} /> {branch.email || CONTACT.email}
                    </a>
                    <a href={branch.mapUrl} target="_blank" rel="noreferrer" className="ct-branch-dir">
                      <MapPin size={14} /> GET DIRECTIONS →
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 80, height: 80, borderRadius: 20, background: 'rgba(255,107,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MapPin size={36} color="#FF6B00" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
              ) : (
                /* Regular branch card */
                <div key={branch.city} className="ct-branch-card">
                  <div className="ct-branch-icon-wrap">
                    <MapPin size={22} color="#FF6B00" strokeWidth={1.8} />
                  </div>
                  <div className="ct-branch-city dark">{branch.city}</div>
                  <div className="ct-branch-addr">{branch.address}</div>
                  <a href={`mailto:${branch.email || CONTACT.email}`} className="ct-branch-email">
                    <Mail size={12} /> {branch.email || CONTACT.email}
                  </a>
                  <a href={branch.mapUrl} target="_blank" rel="noreferrer" className="ct-branch-dir outline">
                    <MapPin size={13} /> DIRECTIONS →
                  </a>
                </div>
              )
            ))}
          </div>
        </div>

        {/* ── HO Map (Ahmedabad) ── */}
        <div className="ct-map">
          <div className="ct-map-header">
            <div className="ct-map-title">
              <MapPin size={20} color="#FF6B00" strokeWidth={1.8} />
              Head Office — Ahmedabad
            </div>
            <div className="ct-map-sub">1007 to 1009, Altimus, Behind Sales India, Ashram Road, Ahmedabad, Gujarat – 380009</div>
          </div>
          <div className="ct-map-frame">
            <iframe
              src="https://maps.google.com/maps?q=Altimus,+Ashram+Road,+Ahmedabad,+Gujarat+380009&t=&z=17&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="400"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="SSS Risk Management Head Office — Ahmedabad"
            />
          </div>
        </div>

      </div>
    </>
  )
}
