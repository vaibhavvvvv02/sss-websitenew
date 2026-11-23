import { useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, useInView } from 'framer-motion'
import {
  CheckCircle2, PhoneCall, ArrowLeft, Shield, Star,
  Flame, Waves, Zap, Lock, Banknote, Building2, Scale, Landmark, Briefcase,
  Ship, Globe, FileText, HardHat, Hospital, RefreshCw,
  Package, Handshake, Truck, Microscope, Factory, Settings,
  Wrench, Store, Users, Baby, Car, Bike, Plane,
  Home, Fingerprint, Smartphone, TrendingUp, Heart, Stethoscope, BarChart3,
  Rocket, Link2, Gem, Target, Gift, PiggyBank, DollarSign, Calendar,
  UserCheck, Repeat, Award, Eye, Cpu, ShieldCheck,
  MapPin, Construction, IndianRupee
} from 'lucide-react'
import { getProductBySlug } from '../data/insuranceProducts'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EASE: any = [0.22, 1, 0.36, 1]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ICON_MAP: Record<string, any> = {
  Flame, Waves, Zap, Lock, Banknote, Building2, Scale, Landmark, Briefcase,
  Ship, Globe, FileText, HardHat, Hospital, RefreshCw,
  Package, Handshake, Truck, Microscope, Factory, Settings,
  Wrench, Store, Users, Baby, Car, Bike, Plane,
  Home, Fingerprint, Smartphone, TrendingUp, Heart, Stethoscope, BarChart3,
  Rocket, Link2, Gem, Target, Gift, PiggyBank, DollarSign, Calendar,
  UserCheck, Repeat, Award, Eye, Cpu, ShieldCheck,
  Shield, Star, MapPin, CheckCircle2, Construction, IndianRupee,
}

function HIcon({ name, size = 32, color }: { name: string; size?: number; color?: string }) {
  const Comp = ICON_MAP[name] ?? Shield
  return <Comp size={size} color={color} strokeWidth={1.6} />
}

export default function ProductDetail() {
  const { slug }   = useParams<{ slug: string }>()
  const product    = slug ? getProductBySlug(slug) : undefined
  const accent     = product?.categoryColor ?? '#FF6B00'

  /* ── scroll-reveal refs ── */
  const statsRef     = useRef(null)
  const hlRef        = useRef(null)
  const contentRef   = useRef(null)
  const tableRef     = useRef(null)
  const advisorRef   = useRef(null)
  const statsInView   = useInView(statsRef,   { once: true, margin: '-80px' })
  const hlInView      = useInView(hlRef,      { once: true, margin: '-80px' })
  const contentInView = useInView(contentRef, { once: true, margin: '-80px' })
  const tableInView   = useInView(tableRef,   { once: true, margin: '-80px' })
  const advisorInView = useInView(advisorRef, { once: true, margin: '-80px' })

  /* ── 404 state ── */
  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 font-inter px-6 text-center">
        <div className="text-6xl">🔍</div>
        <h2 className="font-poppins font-extrabold text-[28px] text-[#1B2A4A] m-0">Product Not Found</h2>
        <p className="font-inter text-[15px] text-gray-500">We couldn't find the insurance product you're looking for.</p>
        <Link to="/products"
          className="mt-2 px-7 py-3 bg-brand-orange text-white rounded-xl font-poppins font-bold text-[14px] no-underline transition-all duration-500 hover:bg-brand-orange-dark hover:-translate-y-1">
          ← Back to Products
        </Link>
      </div>
    )
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

        /* ───────────────────────────────────────────
           TABLE — horizontal scroll on all screens
           where it doesn't fit
        ─────────────────────────────────────────── */
        .pd-table-wrap {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          border-radius: 16px;
          border: 1.5px solid #e5e7eb;
          box-shadow: 0 2px 10px rgba(17,24,39,0.06);
        }
        .pd-table-wrap table {
          min-width: 460px;
          width: 100%;
          border-collapse: collapse;
        }
        .pd-table-wrap td:first-child {
          white-space: normal;
          min-width: 120px;
          max-width: 160px;
        }
        .pd-table-wrap td,
        .pd-table-wrap th {
          word-break: break-word;
        }

        /* ───────────────────────────────────────────
           TABLET  768px – 1023px
        ─────────────────────────────────────────── */
        @media (max-width: 1023px) {
          /* content image centers on tablet */
          .pd-content-img {
            justify-content: center !important;
            margin-top: 0 !important;
          }
          .pd-content-img img {
            max-width: 55% !important;
            margin-top: 0 !important;
          }
          /* coverage section two-col stacks on tablet */
          .pd-coverage-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }

        /* ───────────────────────────────────────────
           LARGE MOBILE  481px – 767px
        ─────────────────────────────────────────── */
        @media (max-width: 767px) {
          /* stats strip tighter gap */
          .pd-stats-row { gap: 20px 28px !important; }
          /* highlight cards smaller padding */
          .pd-hl-card { padding: 24px 18px !important; }
          /* content image */
          .pd-content-img img { max-width: 70% !important; }
          /* coverage heading smaller */
          .pd-coverage-title { font-size: 20px !important; }
          /* bottom CTA section padding */
          .pd-bottom-cta { padding: 48px 20px !important; }
          /* advisor row center text */
          .pd-advisor-row { text-align: center !important; }
          .pd-advisor-btns { justify-content: center !important; }
        }

        /* ───────────────────────────────────────────
           MOBILE  ≤ 480px
        ─────────────────────────────────────────── */
        @media (max-width: 480px) {
          /* hero padding */
          .pd-hero { padding-top: 40px !important; padding-bottom: 48px !important; }
          /* hero CTA buttons full-width stack */
          .pd-hero-btns { flex-direction: column !important; align-items: stretch !important; }
          .pd-hero-btns a { width: 100% !important; justify-content: center !important; }
          /* stats */
          .pd-stats-row { gap: 16px 20px !important; }
          .pd-stats-value { font-size: 22px !important; }
          /* highlights */
          .pd-hl-card { padding: 18px 14px !important; }
          .pd-hl-title { font-size: 14px !important; }
          .pd-hl-desc  { font-size: 12.5px !important; }
          /* content section padding */
          .pd-content-section { padding-top: 32px !important; padding-bottom: 32px !important; }
          .pd-content-img img { max-width: 85% !important; }
          /* coverage */
          .pd-coverage-title { font-size: 17px !important; }
          .pd-coverage-section { padding-top: 32px !important; padding-bottom: 32px !important; }
          .pd-addon-title { font-size: 16px !important; }
          .pd-cta-card { padding: 20px 16px !important; }
          /* bottom CTA */
          .pd-bottom-cta { padding: 40px 16px !important; }
          .pd-cta-btns { flex-direction: column !important; align-items: stretch !important; }
          .pd-cta-btns a { width: 100% !important; justify-content: center !important; }
          .pd-trust-badges { gap: 10px 16px !important; }
          /* breadcrumb wrap */
          .pd-breadcrumb { flex-wrap: wrap !important; gap: 4px !important; font-size: 11px !important; }
        }

        /* ───────────────────────────────────────────
           VERY SMALL  ≤ 360px
        ─────────────────────────────────────────── */
        @media (max-width: 360px) {
          .pd-stats-row { flex-direction: column !important; align-items: center !important; gap: 16px !important; }
          .pd-hl-card { padding: 16px 12px !important; }
        }
      `}</style>
      <Helmet>
        <title>{product.name} | SSS Risk Management & Insurance Brokers</title>
        <meta name="description" content={product.shortDescription} />
      </Helmet>

      {/* ── Hero ── */}
      <section className="pd-hero relative overflow-hidden pt-16 pb-20">
        {/* Tricolor background */}
        <div className="absolute inset-0" style={{ background:'linear-gradient(135deg, rgba(255,107,0,0.18) 0%, rgba(255,160,60,0.10) 18%, rgba(255,255,255,0.98) 40%, rgba(255,255,255,1) 50%, rgba(220,245,225,0.85) 72%, rgba(46,125,50,0.20) 100%)' }} />
        {/* Radial blobs */}
        <div className="absolute top-[-60px] left-[-60px] w-[320px] h-[320px] rounded-full pointer-events-none"
          style={{ background:'radial-gradient(circle, rgba(255,107,0,0.14) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-80px] right-[-80px] w-[380px] h-[380px] rounded-full pointer-events-none"
          style={{ background:'radial-gradient(circle, rgba(46,125,50,0.14) 0%, transparent 70%)' }} />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-white pointer-events-none z-10" />
        {/* SSS logo watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <img src="/assets/sss.png" alt="" className="sss-logo-watermark w-[480px] h-[480px] object-contain" style={{ opacity: 0.07, animation: 'sssLogoSpin 20s linear infinite' }} />
        </div>

        {/* Content */}
        <div className="relative z-20 text-center px-6 max-w-[720px] mx-auto">
          {/* Category badge */}
          <motion.div
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-inter text-[11px] font-bold tracking-[1.5px] uppercase mb-4 border"
            style={{ background:`${accent}15`, color:accent, borderColor:`${accent}40` }}
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.05, duration:0.5, ease:EASE }}>
            <Shield size={12} /> {product.category}
          </motion.div>

          {/* Title mask-reveal */}
          <div className="overflow-hidden mb-1">
            <motion.h1
              className="font-poppins font-extrabold text-[clamp(28px,4vw,46px)] text-[#1B2A4A]"
              initial={{ y:'110%' }} animate={{ y:0 }}
              transition={{ delay:0.1, duration:0.7, ease:EASE }}>
              {product.name.split(' ').slice(0, Math.ceil(product.name.split(' ').length / 2)).join(' ')}
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-5">
            <motion.h1
              className="font-poppins font-extrabold text-[clamp(28px,4vw,46px)]"
              style={{ color: accent }}
              initial={{ y:'110%' }} animate={{ y:0 }}
              transition={{ delay:0.2, duration:0.7, ease:EASE }}>
              {product.name.split(' ').slice(Math.ceil(product.name.split(' ').length / 2)).join(' ') || product.category}
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            className="font-inter text-[15px] text-gray-500 leading-relaxed mb-8 max-w-[560px] mx-auto"
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.35, duration:0.55, ease:EASE }}>
            {product.shortDescription}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="pd-hero-btns flex flex-wrap gap-3 justify-center"
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.5, duration:0.5, ease:EASE }}>
            <Link to="/get-quote"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-xl font-poppins font-bold text-[13.5px] no-underline border-2 border-brand-orange transition-all duration-500 hover:bg-brand-orange-dark hover:-translate-y-1 shadow-orange">
              GET A QUOTE →
            </Link>
            <Link to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-blue border-2 border-brand-blue rounded-xl font-poppins font-bold text-[13.5px] no-underline transition-all duration-500 hover:bg-brand-blue hover:text-white hover:-translate-y-1">
              <PhoneCall size={15} /> TALK TO AN EXPERT
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <div className="relative overflow-hidden py-7 bg-white" ref={statsRef}>
        <div className="pd-stats-row max-w-[1200px] mx-auto px-6 flex items-center justify-center gap-16 flex-wrap">
          {product.stats.map((s, i) => (
            <motion.div key={s.label} className="text-center"
              initial={{ opacity: 0, y: 16 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.65, ease: EASE }}>
              <div className="pd-stats-value font-poppins font-extrabold text-[28px] text-brand-orange leading-none mb-1">{s.value}</div>
              <div className="font-inter text-[13px] text-gray-600">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
      {/* ── Highlights ── */}
      <section className="py-14 bg-white" ref={hlRef}>
        <div className="max-w-[1200px] mx-auto px-6">

          {/* Section header */}
          <motion.div className="text-center mb-11"
            initial={{ opacity: 0, y: 24 }}
            animate={hlInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}>
            <span className="inline-block px-3.5 py-1.5 rounded-full font-inter text-[11.5px] font-bold tracking-widest uppercase mb-3"
              style={{ background: `${accent}15`, color: accent }}>
              Key Highlights
            </span>
            <h2 className="font-poppins font-extrabold text-[clamp(20px,2.5vw,28px)] text-gray-900 mb-3">
              Why Choose <span style={{ color: accent }}>{product.name}</span>?
            </h2>
            <div className="flex items-center justify-center gap-2.5">
              <div className="w-12 h-0.5 rounded" style={{ background: accent }} />
              <Star size={14} color={accent} />
              <div className="w-12 h-0.5 rounded" style={{ background: accent }} />
            </div>
          </motion.div>

          {/* Highlight cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.highlights.map((h, i) => (
              <motion.div key={h.title}
                className="pd-hl-card group bg-white border-[1.5px] border-gray-200 rounded-2xl p-8 text-center transition-all duration-500 ease-smooth hover:shadow-apple-lg hover:-translate-y-1"
                style={{ '--hover-border': accent } as React.CSSProperties}
                initial={{ opacity: 0, y: 28 }}
                animate={hlInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.7, ease: EASE }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = accent)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '')}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${accent}15` }}>
                  <HIcon name={h.icon} size={28} color={accent} />
                </div>
                <div className="pd-hl-title font-poppins font-bold text-[16px] text-gray-900 mb-2">{h.title}</div>
                <p className="pd-hl-desc font-inter text-[13.5px] text-gray-500 leading-relaxed">{h.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Two-col: description + features / image ── */}
      <section className="pd-content-section py-14 bg-white" ref={contentRef}>
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-14 items-start">

          {/* Left — description + features + add-ons */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={contentInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE }}>

            <p className="font-inter text-[15.5px] text-gray-600 leading-[1.9] mb-8">
              {product.longDescription}
            </p>

            <h3 className="font-poppins font-bold text-[18px] text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${accent}18` }}>
                <CheckCircle2 size={15} color={accent} />
              </span>
              What's Covered
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
              {product.features.map((f, i) => (
                <motion.div key={f}
                  className="flex items-center gap-2.5 font-inter text-[13.5px] text-gray-700 bg-gray-50 rounded-xl px-3.5 py-2.5 border border-gray-100"
                  initial={{ opacity: 0, y: 8 }}
                  animate={contentInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.04, duration: 0.5, ease: EASE }}>
                  <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `${accent}20` }}>
                    <CheckCircle2 size={10} color={accent} />
                  </span>
                  {f}
                </motion.div>
              ))}
            </div>

            <h3 className="font-poppins font-bold text-[18px] text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${accent}18` }}>
                <Star size={14} color={accent} />
              </span>
              Available Add-Ons
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.addOns.map((a, i) => (
                <motion.span key={a}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-inter text-[12.5px] font-semibold border-[1.5px] transition-all duration-500 hover:-translate-y-0.5"
                  style={{ borderColor: `${accent}50`, color: accent, background: `${accent}08` }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={contentInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.04, duration: 0.4, ease: EASE }}>
                  ✦ {a}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Right — image, aligned top-right */}
          <motion.div
            className="pd-content-img flex items-start justify-end"
            initial={{ opacity: 0, x: 32 }}
            animate={contentInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.8, ease: EASE }}>
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ maxHeight: 280, maxWidth: '80%', objectFit: 'contain', display: 'block', marginTop: '-24px' }}
              onError={e => { (e.target as HTMLImageElement).src = '/assets/sss.png' }}
            />
          </motion.div>

        </div>
      </section>

      {/* ── Coverage Table + CTA ── */}
      <section className="pd-coverage-section py-14 bg-white" ref={tableRef}>
        <div className="max-w-[1200px] mx-auto px-6">

          {/* Section header */}
          <motion.div className="text-center mb-11"
            initial={{ opacity: 0, y: 24 }}
            animate={tableInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}>
            <span className="inline-block px-3.5 py-1.5 rounded-full font-inter text-[11.5px] font-bold tracking-widest uppercase mb-3"
              style={{ background: `${accent}15`, color: accent }}>
              Coverage Details
            </span>
            <h2 className="pd-coverage-title font-poppins font-extrabold text-[clamp(20px,2.5vw,28px)] text-gray-900 mb-3">
              Insurance <span className="text-brand-orange">Categories &amp; Key Features</span>
            </h2>
            <div className="flex items-center justify-center gap-2.5">
              <div className="w-12 h-0.5 rounded" style={{ background: accent }} />
              <Star size={14} color={accent} />
              <div className="w-12 h-0.5 rounded" style={{ background: accent }} />
            </div>
          </motion.div>

          <div className="pd-coverage-grid grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Add-ons + inline CTA */}
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              animate={tableInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.75, ease: EASE }}>
              <h3 className="pd-addon-title font-poppins font-bold text-[20px] text-gray-900 mb-5">Add-Ons for {product.name}</h3>
              <div className="flex flex-wrap gap-2.5 mb-9">
                {product.addOns.map((a, i) => (
                  <motion.div key={a}
                    className="flex items-center gap-2 font-inter text-[13.5px] text-gray-700 bg-gray-50 border-[1.5px] border-gray-200 rounded-xl px-3.5 py-2 transition-all duration-500 hover:-translate-y-0.5"
                    style={{ borderColor: `${accent}30` }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={tableInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: i * 0.04, duration: 0.5, ease: EASE }}>
                    <CheckCircle2 size={13} color={accent} className="flex-shrink-0" />
                    {a}
                  </motion.div>
                ))}
              </div>

              {/* Inline CTA card */}
              <motion.div
                className="pd-cta-card p-7 rounded-2xl border-[1.5px]"
                style={{ background: `linear-gradient(135deg, ${accent}12 0%, ${accent}06 100%)`, borderColor: `${accent}25` }}
                initial={{ opacity: 0, y: 16 }}
                animate={tableInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.7, ease: EASE }}>
                <div className="font-poppins font-bold text-[16px] text-gray-900 mb-2">Ready to get covered?</div>
                <p className="font-inter text-[13.5px] text-gray-500 leading-relaxed mb-5">
                  Talk to our experts and get a tailored quote for {product.name} in minutes.
                </p>
                <Link to="/get-quote"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-orange text-white rounded-xl font-poppins font-bold text-[13px] no-underline transition-all duration-500 hover:bg-brand-orange-dark hover:-translate-y-1">
                  GET FREE QUOTE →
                </Link>
              </motion.div>
            </motion.div>

            {/* Table */}
            <motion.div
              initial={{ opacity: 0, x: 28 }}
              animate={tableInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.75, ease: EASE }}>
              <div className="pd-table-wrap">
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ background: accent }}>
                      <th className="px-5 py-3.5 text-left font-poppins font-bold text-[13px] text-white">Category</th>
                      <th className="px-5 py-3.5 text-left font-poppins font-bold text-[13px] text-white">Key Features</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.tableRows.map((row, i) => (
                      <motion.tr key={i}
                        className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-500"
                        initial={{ opacity: 0, x: 16 }}
                        animate={tableInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: i * 0.05, duration: 0.5, ease: EASE }}>
                        <td className="px-5 py-3.5 font-inter font-semibold text-[13.5px] text-gray-900 align-top">{row.category}</td>
                        <td className="px-5 py-3.5 font-inter text-[13.5px] text-gray-600 align-top leading-relaxed">{row.feature}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA + Advisor ── */}
      <motion.section
        className="pd-bottom-cta relative overflow-hidden py-20 px-6"
        style={{
          background: 'linear-gradient(135deg, rgba(255,107,0,0.18) 0%, rgba(255,160,60,0.10) 18%, rgba(255,255,255,0.98) 40%, rgba(255,255,255,1) 50%, rgba(220,245,225,0.85) 72%, rgba(46,125,50,0.20) 100%)',
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        viewport={{ once: true }}
        ref={advisorRef}>

        {/* Radial blobs */}
        <div className="absolute top-[-60px] left-[-60px] w-[320px] h-[320px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.14) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-80px] right-[-80px] w-[380px] h-[380px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(46,125,50,0.14) 0%, transparent 70%)' }} />

        <div className="max-w-[1100px] mx-auto relative z-10">

          {/* Top — main CTA centered */}
          <motion.div className="text-center mb-14"
            initial={{ opacity: 0, y: 32 }}
            animate={advisorInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}>

            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
              style={{ background: `${accent}18`, border: `2px solid ${accent}35` }}>
              <Shield size={40} color={accent} strokeWidth={1.5} />
            </div>

            <h2 className="font-poppins font-extrabold text-[clamp(24px,3vw,38px)] text-[#1B2A4A] mb-4 leading-tight">
              Ready to Protect What<br />
              <span style={{ color: accent }}>Matters Most?</span>
            </h2>
            <p className="font-inter text-[15px] text-gray-600 leading-relaxed max-w-[520px] mx-auto mb-8">
              Our IRDAI-certified experts will tailor the perfect {product.name} plan for your needs and budget — in minutes.
            </p>

            {/* CTA buttons */}
            <div className="pd-cta-btns flex flex-wrap gap-4 justify-center mb-10">
              <Link to="/get-quote"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-poppins font-bold text-[14px] no-underline transition-all duration-500 hover:-translate-y-1 text-white"
                style={{ background: accent, border: `2px solid ${accent}`, boxShadow: `0 8px 24px ${accent}40` }}>
                GET A FREE QUOTE →
              </Link>
              <Link to="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-brand-blue border-2 border-brand-blue rounded-xl font-poppins font-bold text-[14px] no-underline transition-all duration-500 hover:bg-brand-blue hover:text-white hover:-translate-y-1">
                <PhoneCall size={16} /> TALK TO AN EXPERT
              </Link>
            </div>

            {/* Trust badges */}
            <div className="pd-trust-badges flex flex-wrap gap-6 justify-center">
              {[
                { icon: '🛡️', label: 'IRDAI Certified' },
                { icon: '⚡', label: 'Instant Callback' },
                { icon: '🤝', label: 'No Hidden Charges' },
                { icon: '📋', label: 'Free Consultation' },
              ].map((b, i) => (
                <motion.div key={b.label}
                  className="flex items-center gap-2 font-inter text-[13px] text-gray-600"
                  initial={{ opacity: 0, y: 12 }}
                  animate={advisorInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: EASE }}>
                  <span className="text-[16px]">{b.icon}</span>
                  {b.label}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Divider */}
          <div className="border-t border-gray-200 mb-10" />

          {/* Bottom — advisor + all products */}
          <motion.div
            className="pd-advisor-row flex flex-col md:flex-row items-center justify-between gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={advisorInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.65, ease: EASE }}>
            <div>
              <div className="font-poppins font-bold text-[16px] text-gray-900 mb-1">
                Find a Trusted {product.name} Advisor
              </div>
              <p className="font-inter text-[13.5px] text-gray-500">
                Pan India presence · 10+ branches · IRDAI certified advisors
              </p>
            </div>
            <div className="pd-advisor-btns flex gap-3 flex-wrap">
              <Link to="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-poppins font-bold text-[13px] no-underline transition-all duration-500 hover:-translate-y-1 text-white"
                style={{ background: accent, border: `1.5px solid ${accent}` }}>
                CONTACT AN ADVISOR →
              </Link>
              <Link to="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#1B2A4A] border-[1.5px] border-gray-300 rounded-xl font-poppins font-bold text-[13px] no-underline transition-all duration-500 hover:bg-[#1B2A4A] hover:text-white hover:border-[#1B2A4A] hover:-translate-y-0.5">
                <ArrowLeft size={14} /> ALL PRODUCTS
              </Link>
            </div>
          </motion.div>

        </div>
      </motion.section>

    </>
  )
}
