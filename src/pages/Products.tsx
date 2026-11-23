import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { submitQuote } from '../services/contactService'
import {
  Building2, User, HeartPulse, Shield,
  Flame, ShieldAlert, Scale, Anchor, Users, Wrench, HardHat, Cog, Gauge, Package, UserCheck, UsersRound,
  Car, Bike, Truck, PersonStanding, Plane, Home, Lock, Briefcase,
  Cross, HeartHandshake, UserCog, Accessibility, Activity, PlusCircle,
  ShieldCheck, Heart, TrendingUp, Clock, Wallet, PiggyBank,
  Search, ChevronRight, PhoneCall, X, ChevronDown, Star, CheckCircle2, MessageSquare,
} from 'lucide-react'


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EASE: any = [0.22, 1, 0.36, 1]

/* ─── Types ── */
type CategoryId = 'corporate' | 'individual' | 'health' | 'life'
type Product = {
  icon: React.ElementType
  label: string
  detail: string
  features: string[]
  badge?: 'popular' | 'recommended'
}

/* ─── Data ── */
const categories: {
  id: CategoryId; label: string; icon: React.ElementType
  iconColor: string; iconBg: string; count: number; desc: string
}[] = [
  { id:'corporate', label:'Corporate Insurance',  icon:Building2,  iconColor:'#2E7D32', iconBg:'#E7F5EA', count:13, desc:'Protect your business, assets, employees and operations from unexpected risks.' },
  { id:'individual', label:'Individual Insurance', icon:User,       iconColor:'#FF6B00', iconBg:'#FFF1E4', count:7,  desc:'Personalised insurance solutions for your vehicles, travel, property and personal safety.' },
  { id:'health',    label:'Health Insurance',      icon:HeartPulse, iconColor:'#1a5276', iconBg:'#EBF5FB', count:6,  desc:'Complete healthcare coverage for you and your family at every stage of life.' },
  { id:'life',      label:'Life Insurance',        icon:Shield,     iconColor:'#6b21a8', iconBg:'#F3E8FF', count:7,  desc:"Secure your family's future and achieve your long-term financial goals." },
]

const products: Record<CategoryId, Product[]> = {
  corporate: [
    { icon:Flame,       label:'Fire Insurance',                    detail:'Covers damage or destruction of property caused by fire, lightning, and explosion.', features:['Building & contents cover','Lightning & explosion damage','Loss of profits add-on','Customisable sum insured'] },
    { icon:ShieldAlert, label:'Burglary Insurance',                detail:'Protects your business against theft and burglary losses covering inventory, cash and assets.', features:['Cash & inventory cover','24/7 protection','First loss basis option','Safe burglary extension'] },
    { icon:Scale,       label:'Liability Insurance',               detail:'Covers legal liability arising from bodily injury or property damage caused to third parties.', badge:'popular', features:['Third-party bodily injury','Property damage liability','Legal defence costs','Worldwide coverage option'] },
    { icon:Anchor,      label:'Marine Insurance',                  detail:'Covers loss or damage to cargo and ships during transit by sea, air, or road.', features:['All-risk cargo cover','Sea, air & road transit','Institute cargo clauses','Open cover facility'] },
    { icon:Users,       label:"Workmen's Compensation Insurance",  detail:'Mandatory coverage for employees against work-related injuries, disabilities, or death.', features:['Statutory WC Act cover','Medical expense reimbursement','Permanent disability benefit','Fatal accident cover'] },
    { icon:Wrench,      label:'Project Insurance',                 detail:'All-risk coverage for construction and engineering projects.', features:['Material damage cover','Third-party liability','Testing & commissioning','Existing property cover'] },
    { icon:HardHat,     label:"Contractor's All Risk (CAR)",       detail:'Comprehensive protection for contractors against material damage and third-party liability.', features:['Contract works cover','Construction plant cover','Third-party liability','Maintenance period cover'] },
    { icon:Cog,         label:'Erection All Risk (EAR)',           detail:'Covers machinery and equipment during erection, installation and testing phases.', features:['Sudden & unforeseen damage','Testing & commissioning','Third-party liability','Expediting expenses'] },
    { icon:Gauge,       label:'Plant and Machinery (CPM)',         detail:'Protects owned or leased machinery against sudden and unforeseen physical damage.', features:['Breakdown cover','Electrical damage','Operator error cover','Hired plant extension'] },
    { icon:Flame,       label:'Boiler and Pressure Plant',         detail:'Covers explosion, collapse or damage of boilers and pressure vessels.', features:['Explosion & collapse','Third-party liability','Surrounding property damage','Business interruption option'] },
    { icon:Package,     label:'Package Insurance',                 detail:'A bundled policy covering multiple risks under a single premium.', badge:'recommended', features:['Fire & allied perils','Burglary & theft','Liability cover','Business interruption'] },
    { icon:UserCheck,   label:'Group Health Insurance',            detail:'Employer-provided health coverage for all employees and dependants.', badge:'popular', features:['Cashless hospitalisation','Pre & post hospitalisation','Maternity cover option','Day care procedures'] },
    { icon:UsersRound,  label:'Group Personal Accident Insurance', detail:'Provides compensation for accidental death, permanent or temporary disability.', features:['Accidental death benefit','Permanent disability','Temporary disability','Medical expenses cover'] },
    { icon:Plane,       label:'Group Travel Insurance',           detail:'Coverage for all travelers against accidents, medical emergencies, and trip disruptions.', features:['Medical expense coverage','Trip cancellation cover','Baggage loss cover','24x7 emergency assistance'] },
    { icon:Briefcase,   label:'Entertainment Insurance',          detail:'Protection for film shoots, concerts, and live events covering cancellation and equipment damage.', features:['Event cancellation cover','Cast non-appearance','Equipment & property cover','Public liability'] },
    { icon:ShieldCheck, label:'Surety Bond',                      detail:'Financial guarantee ensuring fulfillment of contractual obligations as an alternative to bank guarantees.', features:['No heavy collateral','Preserves working capital','Faster issuance','Widely accepted'] },
  ],
  individual: [
    { icon:Car,            label:'Four Wheeler Insurance',        detail:'Comprehensive and third-party motor insurance for private cars.', badge:'popular', features:['Own damage cover','Third-party liability','Zero depreciation add-on','Roadside assistance'] },
    { icon:Bike,           label:'Two Wheeler Insurance',         detail:'Covers your bike or scooter against accidents, theft, fire and natural calamities.', features:['Comprehensive cover','Theft protection','Personal accident cover','Cashless garages'] },
    { icon:Truck,          label:'Commercial Vehicle Insurance',  detail:'Insurance for goods vehicles, passenger vehicles and other commercial transport.', features:['Own damage cover','Third-party liability','Goods in transit','Driver accident cover'] },
    { icon:PersonStanding, label:'Personal Accident Insurance',   detail:'Provides lump-sum compensation in case of accidental death or disability.', features:['Accidental death benefit','Permanent disability','Temporary disability income','Medical expenses reimbursement'] },
    { icon:Plane,          label:'Travel Insurance',              detail:'Coverage for trip cancellations, medical emergencies and lost baggage worldwide.', badge:'recommended', features:['Emergency medical cover','Trip cancellation','Lost baggage compensation','Flight delay benefit'] },
    { icon:Home,           label:'Property Insurance',            detail:'Protects your home or commercial property against fire, flood, earthquake and other perils.', features:['Structure & contents','Natural calamity cover','Burglary & theft','Temporary accommodation'] },
    { icon:Lock,           label:'Cyber Fraud Insurance',         detail:'Covers financial losses arising from cyber fraud, identity theft and online scams.', features:['Online fraud cover','Identity theft protection','Phishing attack losses','Legal assistance'] },
  ],
  health: [
    { icon:Cross,          label:'Individual Mediclaim Policy',   detail:'Covers hospitalisation expenses for a single person including room rent, ICU and surgery.', features:['Hospitalisation cover','Pre & post 30/60 days','Day care procedures','Ambulance charges'] },
    { icon:HeartHandshake, label:'Family Health Insurance',       detail:'A floater plan covering the entire family under a single sum insured.', badge:'popular', features:['Entire family covered','Shared sum insured','Maternity benefits','Cashless network hospitals'] },
    { icon:UserCog,        label:'Family Floater Mediclaim',      detail:'A shared pool of cover — any family member can use the full sum insured.', badge:'recommended', features:['Floating sum insured','No sub-limits','New born baby cover','Preventive health check-up'] },
    { icon:Accessibility,  label:'Senior Citizen Mediclaim',      detail:'Specially designed for citizens aged 60+, covering pre-existing diseases and domiciliary care.', features:['Pre-existing disease cover','Domiciliary treatment','No pre-medical test up to 60','Lifetime renewal'] },
    { icon:Activity,       label:'Critical Illness Mediclaim',    detail:'Pays a lump sum on diagnosis of critical illnesses like cancer, heart attack or stroke.', features:['Lump sum on diagnosis','30+ critical illnesses','Income replacement','Waiver of premium'] },
    { icon:PlusCircle,     label:'Top-Up Insurance',              detail:'Enhances your existing health cover by paying claims beyond the base policy threshold.', features:['Super top-up option','Low premium cost','Family floater version','Complements base policy'] },
  ],
  life: [
    { icon:ShieldCheck, label:'Term Life Insurance',        detail:'Pure protection plan providing large cover at low premiums.', badge:'popular', features:['High cover at low cost','Critical illness rider','Accidental death benefit','Premium waiver option'] },
    { icon:Heart,       label:'Whole Life Insurance',       detail:'Lifelong coverage that builds cash value over time.', features:['Lifelong protection','Cash value accumulation','Loan against policy','Participating dividends'] },
    { icon:TrendingUp,  label:'Unit Linked Insurance Plan', detail:'Combines life insurance with investment in equity or debt funds.', features:['Market-linked returns','Fund switching facility','Partial withdrawal','Life cover + investment'] },
    { icon:Clock,       label:'Retirement Plan',            detail:'Accumulate a pension corpus for a comfortable post-retirement life.', badge:'recommended', features:['Guaranteed annuity','Flexible premium payment','Vesting age options','Joint annuity available'] },
    { icon:Users,       label:'Group Insurance Plan',       detail:'Life coverage for employees under a single master policy at group rates.', features:['Group premium rates','No medical underwriting','Gratuity funding option','Flexible benefit design'] },
    { icon:Wallet,      label:'Pension Plan',               detail:'Systematic savings plan that provides regular annuity payments after retirement.', features:['Regular income post-retirement','Deferred & immediate options','Spouse pension option','Tax benefits under 80CCC'] },
    { icon:PiggyBank,   label:'Savings & Investment Plans', detail:'Guaranteed return plans offering both life cover and savings.', features:['Guaranteed returns','Bonus additions','Loan facility','Tax benefits u/s 80C & 10(10D)'] },
  ],
}

const faqs: Record<CategoryId, { q: string; a: string }[]> = {
  corporate: [
    { q:'Is Fire Insurance mandatory for businesses?', a:'While not legally mandatory for all businesses, most lenders and landlords require it. It is highly recommended for any business with physical assets.' },
    { q:'What does Liability Insurance not cover?', a:'Intentional acts, contractual liability, professional errors, and criminal fines are generally excluded.' },
    { q:'Can we get a group health policy for less than 10 employees?', a:"Yes. SSS works with insurers who offer group health policies for groups as small as 2–5 employees depending on the insurer's guidelines." },
    { q:"What is the difference between CAR and EAR?", a:"CAR covers civil construction projects like buildings and roads. EAR covers mechanical and electrical installation projects." },
  ],
  individual: [
    { q:'What is the difference between comprehensive and third-party motor insurance?', a:'Third-party covers damage you cause to others (mandatory by law). Comprehensive additionally covers damage to your own vehicle.' },
    { q:'Does travel insurance cover COVID-19?', a:'Most modern travel policies cover COVID-19 related medical emergencies abroad. Trip cancellation due to COVID may be covered depending on the policy terms.' },
    { q:'Is a medical test required for Personal Accident Insurance?', a:'No. Personal Accident Insurance generally does not require a medical examination.' },
    { q:'What documents are needed to buy Four Wheeler Insurance?', a:"You'll need your vehicle's RC, previous policy (for renewal), and a valid driving licence." },
  ],
  health: [
    { q:'What is a waiting period in health insurance?', a:'A waiting period is the time you must wait before certain benefits become active. Pre-existing diseases typically have a 2–4 year waiting period.' },
    { q:'How many hospitals are in the cashless network?', a:'SSS partners with insurers that offer 10,000+ cashless network hospitals across India.' },
    { q:'Can I buy health insurance for my parents?', a:'Yes. You can buy a separate Senior Citizen Mediclaim policy for your parents.' },
    { q:'Does health insurance cover OPD expenses?', a:'Standard policies cover only in-patient hospitalisation. OPD cover is available as an add-on with select insurers.' },
  ],
  life: [
    { q:'How much term cover do I need?', a:"A general rule is 10–15× your annual income. Factor in outstanding loans, dependants' needs and future goals." },
    { q:'Is ULIP better than mutual funds?', a:'Both have merits. ULIPs provide life cover + investment in one product. Mutual funds offer more options and lower charges.' },
    { q:'Can I surrender my life insurance policy?', a:'Yes, most policies can be surrendered after a lock-in period. You receive the surrender value which is lower than total premiums paid.' },
    { q:'Are life insurance premiums tax deductible?', a:'Yes. Premiums are deductible up to ₹1.5 lakh per year under Section 80C. Maturity proceeds are tax-free under Section 10(10D).' },
  ],
}

const colColors: Record<CategoryId, string> = {
  corporate: '#2E7D32', individual: '#FF6B00', health: '#1a5276', life: '#6b21a8',
}
const hashMap: Record<CategoryId, string> = {
  corporate:'commercial', individual:'motor', health:'health', life:'life',
}

const whyItems = [
  { icon:'👨‍💼', title:'Expert Guidance',       desc:'Get advice from experienced insurance professionals.' },
  { icon:'🛡️',  title:'Wide Range of Options', desc:'Choose from multiple insurers and plans.' },
  { icon:'🎧',  title:'Claims Support',         desc:'Hassle-free claim assistance at every step.' },
  { icon:'💙',  title:'Customer First',         desc:'Your satisfaction and security are our top priority.' },
]

const filterTabs: Array<{ label:string; value:CategoryId|'all' }> = [
  { label:'All',        value:'all' },
  { label:'Corporate',  value:'corporate' },
  { label:'Individual', value:'individual' },
  { label:'Health',     value:'health' },
  { label:'Life',       value:'life' },
]

const insuranceTypes = ['Motor Insurance','Health Insurance','Life Insurance','Home Insurance','Travel Insurance','Commercial Insurance','Personal Accident','Cyber Insurance','Other']

const labelToSlug: Record<string, string> = {
  'Fire Insurance':'fire-insurance','Burglary Insurance':'burglary-insurance','Liability Insurance':'liability-insurance','Marine Insurance':'marine-insurance',"Workmen's Compensation Insurance":'workmen-compensation','Project Insurance':'project-insurance',"Contractor's All Risk (CAR)":'contractor-all-risk','Erection All Risk (EAR)':'erection-all-risk','Plant and Machinery (CPM)':'plant-machinery','Boiler and Pressure Plant':'boiler-pressure','Package Insurance':'package-insurance','Group Health Insurance':'group-health-insurance','Group Personal Accident Insurance':'group-personal-accident-insurance','Group Travel Insurance':'group-travel-insurance','Entertainment Insurance':'entertainment-insurance','Surety Bond':'surety-bond','Four Wheeler Insurance':'four-wheeler','Two Wheeler Insurance':'two-wheeler','Commercial Vehicle Insurance':'commercial-vehicle','Personal Accident Insurance':'personal-accident','Travel Insurance':'travel','Property Insurance':'property','Cyber Fraud Insurance':'cyber-fraud','Individual Mediclaim Policy':'individual-mediclaim','Family Health Insurance':'family-health','Family Floater Mediclaim':'family-floater','Senior Citizen Mediclaim':'senior-citizen','Critical Illness Mediclaim':'critical-illness','Top-Up Insurance':'top-up','Term Life Insurance':'term-life','Whole Life Insurance':'whole-life','Unit Linked Insurance Plan':'unit-linked','Retirement Plan':'retirement-plan','Group Insurance Plan':'group-plan','Pension Plan':'pension-plan','Savings & Investment Plans':'savings-investment',
}

/* ── Component ── */
export default function Products() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<CategoryId|'all'>('all')
  const [search,       setSearch]       = useState('')
  const [modal,        setModal]        = useState<{ cat:CategoryId; product:Product }|null>(null)
  const [openFaq,      setOpenFaq]      = useState<string|null>(null)
  const [activeFaqCat, setActiveFaqCat] = useState<CategoryId>('health')
  const [showFloat,    setShowFloat]    = useState(false)
  const [qqForm,       setQqForm]       = useState({ name:'', phone:'', type:'' })
  const [qqSent,       setQqSent]       = useState(false)
  const [qqLoading,    setQqLoading]    = useState(false)
  const [qqError,      setQqError]      = useState('')
  const [videoOverlay, setVideoOverlay] = useState(false)
  const [pendingModal, setPendingModal] = useState<{ cat:CategoryId; product:Product }|null>(null)
  const [videoProgress,setVideoProgress]= useState(0)
  const videoTimerRef = React.useRef<ReturnType<typeof setInterval>|null>(null)

  const catRef   = useRef(null); const catInView   = useInView(catRef,   { once:true, margin:'-80px' })
  const gridRef  = useRef(null); const gridInView  = useInView(gridRef,  { once:true, margin:'-80px' })
  const whyRef   = useRef(null); const whyInView   = useInView(whyRef,   { once:true, margin:'-80px' })
  const faqRef   = useRef(null); const faqInView   = useInView(faqRef,   { once:true, margin:'-80px' })
  const quoteRef = useRef(null); const quoteInView = useInView(quoteRef, { once:true, margin:'-80px' })

  const handleProductClick = (cat:CategoryId, product:Product) => {
    setPendingModal({ cat, product })
    setVideoOverlay(true)
    setVideoProgress(0)
    let elapsed = 0
    videoTimerRef.current = setInterval(() => {
      elapsed += 100
      setVideoProgress(Math.min((elapsed/10000)*100, 100))
      if (elapsed >= 10000) {
        clearInterval(videoTimerRef.current!)
        setVideoOverlay(false)
        setVideoProgress(0)
        const slug = labelToSlug[product.label]
        if (slug) navigate(`/products/${slug}`)
        else setModal({ cat, product })
      }
    }, 100)
  }

  const skipVideo = () => {
    if (videoTimerRef.current) clearInterval(videoTimerRef.current)
    setVideoOverlay(false)
    setVideoProgress(0)
    if (pendingModal) {
      const slug = labelToSlug[pendingModal.product.label]
      if (slug) navigate(`/products/${slug}`)
      else setModal(pendingModal)
    }
  }

  useEffect(() => {
    const onScroll = () => setShowFloat(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { document.body.style.overflow = modal ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [modal])
  useEffect(() => {
    const h = (e:KeyboardEvent) => { if (e.key === 'Escape') setModal(null) }
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h)
  }, [])

  const searchActive      = search.trim().length > 0
  const visibleCategories = activeFilter === 'all' ? categories : categories.filter(c => c.id === activeFilter)
  const displayCategories = searchActive ? categories : visibleCategories

  const filteredItems = (id:CategoryId) => {
    const q = search.trim().toLowerCase()
    if (!q) return products[id]
    return products[id].filter(p => p.label.toLowerCase().includes(q) || p.detail.toLowerCase().includes(q))
  }

  const catForModal = modal ? categories.find(c => c.id === modal.cat)! : null

  return (
    <>
      <style>{`
        @keyframes sssLogoSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
      <Helmet>
        <title>Insurance Products | SSS Risk Management & Insurance Brokers</title>
        <meta name="description" content="Explore comprehensive insurance products — Motor, Health, Life, Home, Travel, Commercial and more. Compare and get a free quote from SSS Risk Management." />
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-16 pb-20">
        {/* Tricolor background */}
        <div className="absolute inset-0" style={{ background:'linear-gradient(135deg, rgba(255,107,0,0.18) 0%, rgba(255,160,60,0.10) 18%, rgba(255,255,255,0.98) 40%, rgba(255,255,255,1) 50%, rgba(220,245,225,0.85) 72%, rgba(46,125,50,0.20) 100%)' }} />
        {/* Radial blobs */}
        <div className="absolute top-[-60px] left-[-60px] w-[320px] h-[320px] rounded-full pointer-events-none"
          style={{ background:'radial-gradient(circle, rgba(255,107,0,0.14) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-80px] right-[-80px] w-[380px] h-[380px] rounded-full pointer-events-none"
          style={{ background:'radial-gradient(circle, rgba(46,125,50,0.14) 0%, transparent 70%)' }} />
        {/* Bottom fade into white */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-white pointer-events-none z-10" />
        {/* SSS logo watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <img
            src="/assets/sss.png"
            alt=""
            className="w-[480px] h-[480px] object-contain"
            style={{ opacity: 0.07, animation: 'sssLogoSpin 20s linear infinite' }}
          />
        </div>

        {/* Content — centered like Claims */}
        <div className="relative z-20 text-center px-6 max-w-[720px] mx-auto">
          <motion.span
            className="inline-block bg-orange-50/80 text-brand-orange font-inter text-[11px] font-bold tracking-[1.5px] uppercase px-3.5 py-1.5 rounded-full mb-4 border border-orange-200"
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, ease:EASE }}>
            INSURANCE PRODUCTS
          </motion.span>

          <div className="overflow-hidden mb-1">
            <motion.h1
              className="font-poppins font-extrabold text-[clamp(28px,4vw,46px)] text-[#1B2A4A]"
              initial={{ y:'110%' }} animate={{ y:0 }} transition={{ delay:0.1, duration:0.7, ease:EASE }}>
              Explore Our
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-5">
            <motion.h1
              className="font-poppins font-extrabold text-[clamp(28px,4vw,46px)] text-brand-orange"
              initial={{ y:'110%' }} animate={{ y:0 }} transition={{ delay:0.2, duration:0.7, ease:EASE }}>
              Insurance Solutions
            </motion.h1>
          </div>

          <motion.p
            className="font-inter text-[15px] text-gray-500 leading-relaxed mb-8 max-w-[520px] mx-auto"
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4, duration:0.55, ease:EASE }}>
            Comprehensive coverage for <span className="text-brand-orange font-semibold">individuals</span>, <span className="text-brand-green font-semibold">families</span> and businesses — trusted by 25,000+ customers.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-3 justify-center"
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5, duration:0.5, ease:EASE }}>
            <Link to="/get-quote"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-xl font-poppins font-bold text-[13.5px] no-underline border-2 border-brand-orange transition-all duration-500 hover:bg-brand-orange-dark hover:-translate-y-1 shadow-orange">
              GET A QUOTE →
            </Link>
            <Link to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-blue border-2 border-brand-blue rounded-xl font-poppins font-bold text-[13.5px] no-underline transition-all duration-500 hover:bg-brand-blue hover:text-white hover:-translate-y-1">
              TALK TO AN EXPERT →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Category Cards ── */}
      <section className="py-10 bg-white" ref={catRef}>
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat, i) => {
              const CatIcon = cat.icon
              return (
                <motion.button key={cat.id}
                  onClick={() => { setActiveFilter(cat.id); document.getElementById('prod-explore')?.scrollIntoView({ behavior:'smooth' }) }}
                  className="group bg-white border-[1.5px] border-gray-200 rounded-2xl p-7 text-left cursor-pointer transition-all duration-500 ease-smooth hover:border-[color:var(--hover-border)] hover:shadow-apple-lg hover:-translate-y-1 w-full"
                  style={{ '--hover-border': cat.iconColor } as React.CSSProperties}
                  initial={{ opacity:0, y:28 }} animate={catInView ? { opacity:1, y:0 } : {}}
                  transition={{ delay:i*0.1, duration:0.7, ease:EASE }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110" style={{ background:cat.iconBg }}>
                    <CatIcon size={24} color={cat.iconColor} strokeWidth={1.8} />
                  </div>
                  <div className="font-poppins font-bold text-[16px] text-gray-900 mb-2">{cat.label}</div>
                  <p className="font-inter text-[13px] text-gray-500 leading-relaxed mb-4">{cat.desc}</p>
                  <span className="inline-flex items-center gap-1.5 font-poppins font-bold text-[13px] transition-all duration-500 group-hover:gap-3" style={{ color:cat.iconColor }}>
                    Explore {cat.count} Products <ChevronRight size={14} />
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Search + Filter + Products Grid ── */}
      <section className="py-10 pb-[72px] bg-white" id="prod-explore" ref={gridRef}>
        <div className="max-w-[1280px] mx-auto px-6">

          {/* Section header */}
          <motion.div className="text-center mb-10"
            initial={{ opacity:0, y:24 }} animate={gridInView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.7, ease:EASE }}>
            <span className="inline-block bg-orange-50 text-brand-orange font-inter text-[11.5px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-3 border border-orange-200">
              All Products
            </span>
            <h2 className="font-poppins font-extrabold text-[clamp(22px,2.5vw,30px)] text-gray-900 mb-2">
              Explore Our <span className="text-brand-orange">Insurance Products</span>
            </h2>
            <div className="flex items-center justify-center gap-3 mt-3">
              <div className="w-12 h-0.5 bg-brand-orange rounded" />
              <span>🛡️</span>
              <div className="w-12 h-0.5 bg-brand-orange rounded" />
            </div>
          </motion.div>

          {/* Search + Filter bar */}
          <motion.div className="flex items-center gap-4 flex-wrap mb-9"
            initial={{ opacity:0, y:16 }} animate={gridInView ? { opacity:1, y:0 } : {}}
            transition={{ delay:0.1, duration:0.7, ease:EASE }}>
            {/* Search */}
            <div className="flex-1 min-w-[220px] max-w-[400px] flex items-center gap-2.5 bg-gray-50 border-[1.5px] border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-brand-orange transition-colors duration-500">
              <Search size={16} color="#9ca3af" />
              <input type="text" placeholder="Search across all products..."
                className="border-none bg-transparent font-inter text-[14px] text-gray-700 w-full outline-none"
                value={search} onChange={e => setSearch(e.target.value)} />
              {search && (
                <button onClick={() => setSearch('')} className="bg-transparent border-none cursor-pointer flex p-0">
                  <X size={14} color="#9ca3af" />
                </button>
              )}
            </div>
            {searchActive && <p className="font-inter text-[12px] text-gray-400 w-full -mt-2">Showing results across all categories</p>}
            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap">
              {filterTabs.map(tab => (
                <motion.button key={tab.value}
                  onClick={() => { setActiveFilter(tab.value); setSearch('') }}
                  className={`px-5 py-2 rounded-full font-poppins font-semibold text-[13px] border-[1.5px] cursor-pointer transition-all duration-500 ease-smooth whitespace-nowrap ${
                    !searchActive && activeFilter === tab.value
                      ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-brand-orange hover:text-brand-orange'
                  }`}
                  whileTap={{ scale:0.97 }}>
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Products columns */}
          <AnimatePresence mode="wait">
            <motion.div key={activeFilter + search}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
              transition={{ duration:0.45, ease:EASE }}>
              {displayCategories.map((cat, ci) => {
                const CatIcon = cat.icon
                const items   = filteredItems(cat.id)
                const color   = colColors[cat.id]
                return (
                  <motion.div key={cat.id} id={hashMap[cat.id]}
                    className="bg-white border-[1.5px] border-gray-200 rounded-2xl overflow-hidden transition-all duration-500 ease-smooth hover:border-[color:var(--c)] hover:shadow-apple-lg"
                    style={{ '--c': color } as React.CSSProperties}
                    initial={{ opacity:0, y:24 }} animate={gridInView ? { opacity:1, y:0 } : {}}
                    transition={{ delay:ci*0.08, duration:0.7, ease:EASE }}>
                    {/* Column header */}
                    <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:cat.iconBg }}>
                        <CatIcon size={18} color={cat.iconColor} strokeWidth={1.8} />
                      </div>
                      <span className="font-poppins font-bold text-[14.5px]" style={{ color }}>{cat.label}</span>
                    </div>
                    {/* Items */}
                    <div>
                      {items.map((item) => {
                        const ItemIcon = item.icon
                        return (
                          <button key={item.label}
                            onClick={() => handleProductClick(cat.id, item)}
                            className="group flex items-center justify-between w-full px-5 py-2.5 font-inter text-[13px] text-gray-700 bg-transparent border-none cursor-pointer text-left transition-all duration-500 ease-smooth hover:bg-gray-50 hover:pl-6">
                            <div className="flex items-center gap-2.5 flex-1">
                              <ItemIcon size={14} color={cat.iconColor} strokeWidth={1.8} className="flex-shrink-0" />
                              <span>{item.label}</span>
                              {item.badge && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                                  item.badge === 'popular'
                                    ? 'bg-orange-50 text-brand-orange'
                                    : 'bg-green-50 text-brand-green'
                                }`}>
                                  {item.badge === 'popular' ? '★ Popular' : '✓ Recommended'}
                                </span>
                              )}
                            </div>
                            <ChevronRight size={13} color="#d1d5db" className="flex-shrink-0 transition-transform duration-500 group-hover:translate-x-1" />
                          </button>
                        )
                      })}
                      {items.length === 0 && (
                        <p className="px-5 py-4 font-inter text-[13px] text-gray-400">No products match your search</p>
                      )}
                    </div>
                    {/* Footer */}
                    <div className="px-5 py-3.5 border-t border-gray-100">
                      <button
                        onClick={() => { setActiveFilter(cat.id); setSearch('') }}
                        className="inline-flex items-center gap-1.5 font-poppins font-bold text-[12px] bg-transparent border-[1.5px] rounded-lg px-4 py-2 cursor-pointer transition-all duration-500 ease-smooth hover:opacity-80 hover:-translate-y-0.5"
                        style={{ color, borderColor:color }}>
                        VIEW ALL {cat.count} PRODUCTS →
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Why SSS ── */}
      <section className="py-14 bg-white" ref={whyRef}>
        <div className="max-w-[1280px] mx-auto px-6 flex items-center gap-12 flex-wrap">
          <motion.h2 className="font-poppins font-extrabold text-[clamp(18px,2vw,24px)] text-gray-900 min-w-[200px]"
            initial={{ opacity:0, x:-24 }} animate={whyInView ? { opacity:1, x:0 } : {}}
            transition={{ duration:0.7, ease:EASE }}>
            Why Choose <span className="text-brand-orange">SSS</span><br />for Your Insurance?
          </motion.h2>
          <div className="flex gap-8 flex-wrap flex-1">
            {whyItems.map((item, i) => (
              <motion.div key={item.title} className="flex items-start gap-3.5 flex-1 min-w-[150px]"
                initial={{ opacity:0, y:20 }} animate={whyInView ? { opacity:1, y:0 } : {}}
                transition={{ delay:i*0.1, duration:0.7, ease:EASE }}>
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[22px] flex-shrink-0 shadow-sm">
                  {item.icon}
                </div>
                <div>
                  <div className="font-poppins font-bold text-[13.5px] text-gray-900 mb-1">{item.title}</div>
                  <p className="font-inter text-[12px] text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-[72px] bg-white" ref={faqRef}>
        <div className="max-w-[900px] mx-auto px-6">
          <motion.div className="text-center mb-10"
            initial={{ opacity:0, y:24 }} animate={faqInView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.7, ease:EASE }}>
            <span className="inline-flex items-center gap-1.5 bg-orange-50 text-brand-orange font-inter text-[11.5px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-3 border border-orange-200">
              <MessageSquare size={12} /> FAQs
            </span>
            <h2 className="font-poppins font-extrabold text-[clamp(20px,2.5vw,28px)] text-gray-900">
              Frequently Asked <span className="text-brand-orange">Questions</span>
            </h2>
          </motion.div>

          {/* Category tabs */}
          <motion.div className="flex gap-2 justify-center flex-wrap mb-9"
            initial={{ opacity:0 }} animate={faqInView ? { opacity:1 } : {}}
            transition={{ delay:0.1, duration:0.6, ease:EASE }}>
            {categories.map(cat => (
              <button key={cat.id}
                onClick={() => { setActiveFaqCat(cat.id); setOpenFaq(null) }}
                className={`px-5 py-2 rounded-full font-poppins font-semibold text-[12.5px] border-[1.5px] cursor-pointer transition-all duration-500 ease-smooth ${
                  activeFaqCat === cat.id
                    ? 'bg-brand-orange text-white border-brand-orange'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-brand-orange hover:text-brand-orange'
                }`}>
                {cat.label}
              </button>
            ))}
          </motion.div>

          {/* FAQ items */}
          <AnimatePresence mode="wait">
            <motion.div key={activeFaqCat} className="flex flex-col gap-2.5"
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              transition={{ duration:0.4, ease:EASE }}>
              {faqs[activeFaqCat].map((faq, i) => {
                const key = `${activeFaqCat}-${i}`
                const isOpen = openFaq === key
                return (
                  <motion.div key={key}
                    className={`border-[1.5px] rounded-2xl overflow-hidden transition-colors duration-500 ${isOpen ? 'border-brand-orange' : 'border-gray-200'}`}
                    initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                    transition={{ delay:i*0.07, duration:0.55, ease:EASE }}>
                    <button onClick={() => setOpenFaq(isOpen ? null : key)}
                      className="w-full flex items-center justify-between px-5 py-4 cursor-pointer bg-white hover:bg-orange-50 transition-colors duration-500 text-left gap-3">
                      <span className="font-poppins font-semibold text-[14px] text-gray-900">{faq.q}</span>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${isOpen ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-500'}`}>
                        <ChevronDown size={14} className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
                          transition={{ duration:0.35, ease:EASE }} className="overflow-hidden">
                          <div className="px-5 pb-4 pt-2 font-inter text-[13.5px] text-gray-600 leading-[1.75] border-t border-gray-100">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Quick Quote ── */}
      <section
        className="py-[72px] relative overflow-hidden"
        style={{
          background: `linear-gradient(
            135deg,
            rgba(255, 107, 0, 0.18)   0%,
            rgba(255, 160, 60, 0.10)  18%,
            rgba(255, 255, 255, 0.98) 40%,
            rgba(255, 255, 255, 1)    50%,
            rgba(220, 245, 225, 0.85) 72%,
            rgba(46,  125, 50, 0.20) 100%
          )`,
        }}
        ref={quoteRef}>
        {/* Orange radial blob — top left */}
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.12) 0%, transparent 65%)' }} />
        {/* Green radial blob — bottom right */}
        <div className="absolute -bottom-24 -right-24 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(46,125,50,0.12) 0%, transparent 65%)' }} />
        <div className="max-w-[960px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity:0, x:-32 }} animate={quoteInView ? { opacity:1, x:0 } : {}}
            transition={{ duration:0.8, ease:EASE }}>
            <h2 className="font-poppins font-extrabold text-[clamp(22px,2.5vw,32px)] text-[#1B2A4A] mb-3">
              Get a <span className="text-brand-orange">Free Quote</span><br />in 30 Seconds
            </h2>
            <p className="font-inter text-[14px] text-gray-600 leading-relaxed mb-6">
              Tell us what you need and our experts will reach out with the best options tailored for you.
            </p>
            <div className="flex flex-col gap-2.5">
              {['No hidden charges','Compare multiple insurers','Expert guidance included','Instant callback available'].map((pt, i) => (
                <motion.div key={pt} className="flex items-center gap-2.5 font-inter text-[13.5px] text-gray-700"
                  initial={{ opacity:0, x:-16 }} animate={quoteInView ? { opacity:1, x:0 } : {}}
                  transition={{ delay:0.1 + i*0.08, duration:0.6, ease:EASE }}>
                  <CheckCircle2 size={16} color="#FF6B00" strokeWidth={2} className="flex-shrink-0" />{pt}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity:0, x:32 }} animate={quoteInView ? { opacity:1, x:0 } : {}}
            transition={{ delay:0.15, duration:0.8, ease:EASE }}>
            <div className="bg-white rounded-2xl p-8 shadow-apple-xl">
              {!qqSent ? (
                <>
                  <div className="font-poppins font-bold text-[17px] text-gray-900 mb-1">Quick Quote Request</div>
                  <div className="font-inter text-[12.5px] text-gray-400 mb-6">We'll call you back within 2 hours</div>
                  <form onSubmit={async e => {
                    e.preventDefault()
                    if (!qqForm.name.trim() || !qqForm.phone.trim() || !qqForm.type) return
                    setQqError(''); setQqLoading(true)
                    try {
                      await submitQuote({ name:qqForm.name.trim(), phone:qqForm.phone.trim(), type:qqForm.type, source:'products-quick-quote' })
                      setQqSent(true)
                    } catch { setQqError('Something went wrong. Please call us directly.') }
                    finally { setQqLoading(false) }
                  }}>
                    {[
                      { label:'Your Name *',     field:'name',  type:'text', placeholder:'Full name'         },
                      { label:'Phone Number *',  field:'phone', type:'tel',  placeholder:'+91 98765 43210'   },
                    ].map(({ label, field, type, placeholder }) => (
                      <div key={field} className="flex flex-col gap-1.5 mb-4">
                        <label className="font-inter text-[12.5px] font-semibold text-gray-700">{label}</label>
                        <input type={type} required placeholder={placeholder}
                          className="px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-xl font-inter text-[14px] text-gray-900 bg-gray-50 outline-none transition-colors duration-500 focus:border-brand-orange focus:bg-white w-full"
                          value={qqForm[field as 'name'|'phone']} onChange={e => setQqForm(p => ({ ...p, [field]:e.target.value }))} />
                      </div>
                    ))}
                    <div className="flex flex-col gap-1.5 mb-5">
                      <label className="font-inter text-[12.5px] font-semibold text-gray-700">Insurance Type *</label>
                      <select required
                        className="px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-xl font-inter text-[14px] text-gray-900 bg-gray-50 outline-none transition-colors duration-500 focus:border-brand-orange focus:bg-white w-full cursor-pointer"
                        value={qqForm.type} onChange={e => setQqForm(p => ({ ...p, type:e.target.value }))}>
                        <option value="">Select type</option>
                        {insuranceTypes.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    {qqError && <p className="font-inter text-[12px] text-red-600 mb-3">{qqError}</p>}
                    <button type="submit" disabled={qqLoading}
                      className="w-full py-3.5 bg-brand-orange text-white rounded-xl font-poppins font-bold text-[14px] border-none cursor-pointer flex items-center justify-center gap-2 transition-all duration-500 hover:bg-brand-orange-dark disabled:opacity-75">
                      {qqLoading ? '⏳ Submitting…' : 'GET FREE QUOTE →'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="text-5xl mb-4">✅</div>
                  <div className="font-poppins font-bold text-[18px] text-gray-900 mb-2">Request Received!</div>
                  <p className="font-inter text-[13px] text-gray-500 leading-relaxed mb-5">
                    Thanks <strong>{qqForm.name}</strong>! Our team will call you at <strong>{qqForm.phone}</strong> within 2 hours.
                  </p>
                  <button onClick={() => { setQqSent(false); setQqForm({ name:'',phone:'',type:'' }) }}
                    className="font-poppins font-bold text-[13px] text-brand-orange bg-transparent border-none cursor-pointer hover:underline">
                    Submit another →
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <motion.section
        className="py-10 px-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(
            135deg,
            rgba(255, 107, 0, 0.18)   0%,
            rgba(255, 160, 60, 0.10)  18%,
            rgba(255, 255, 255, 0.98) 40%,
            rgba(255, 255, 255, 1)    50%,
            rgba(220, 245, 225, 0.85) 72%,
            rgba(46,  125, 50, 0.20) 100%
          )`,
          borderTop: '1px solid rgba(0,0,0,0.06)',
        }}
        initial={{ opacity:0 }} whileInView={{ opacity:1 }}
        transition={{ duration:0.7, ease:EASE }} viewport={{ once:true }}>
        {/* Radial blobs */}
        <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.10) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(46,125,50,0.10) 0%, transparent 70%)' }} />
        <div className="max-w-[1280px] mx-auto flex items-center gap-8 flex-wrap relative z-10">
          <div className="w-16 h-16 bg-brand-orange/10 border-2 border-brand-orange/20 rounded-full flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={32} color="#FF6B00" strokeWidth={1.8} />
          </div>
          <div className="flex-1">
            <div className="font-poppins font-extrabold text-[clamp(16px,2vw,22px)] text-[#1B2A4A] mb-1.5">
              Not Sure Which Insurance Is Right for You?
            </div>
            <p className="font-inter text-[14px] text-gray-600">Our experts can help you find the perfect coverage for your needs.</p>
          </div>
          <div className="flex gap-3.5 flex-wrap">
            <Link to="/get-quote"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange text-white border-2 border-brand-orange rounded-lg font-poppins font-bold text-[13px] no-underline transition-all duration-500 hover:bg-brand-orange-dark hover:-translate-y-1 whitespace-nowrap shadow-orange">
              GET A QUOTE →
            </Link>
            <Link to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-[#1B2A4A] border-2 border-[#1B2A4A] rounded-lg font-poppins font-bold text-[13px] no-underline transition-all duration-500 hover:bg-[#1B2A4A] hover:text-white hover:-translate-y-1 whitespace-nowrap">
              <PhoneCall size={15} /> TALK TO AN EXPERT →
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ── Floating CTA ── */}
      <AnimatePresence>
        {showFloat && (
          <motion.div
            initial={{ y:80, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:80, opacity:0 }}
            transition={{ duration:0.5, ease:EASE }}
            className="fixed bottom-7 right-7 z-[1500]">
            <Link to="/get-quote"
              className="flex items-center gap-2 px-6 py-3.5 bg-brand-orange text-white rounded-full font-poppins font-bold text-[13px] no-underline shadow-orange transition-all duration-500 hover:bg-brand-orange-dark hover:-translate-y-1">
              <Star size={15} /> GET A QUOTE
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Video Intro Overlay ── */}
      {videoOverlay && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center">
          <video src="/assets/ProductsAsset/watermark-removed-A_premium_10-15_second_3D_20261005115827.mp4"
            autoPlay muted playsInline onEnded={skipVideo}
            className="absolute inset-0 w-full h-full object-cover" />
          <button onClick={skipVideo}
            className="absolute bottom-10 right-8 bg-black/55 text-white border border-white/40 rounded-full px-6 py-2.5 font-poppins font-semibold text-[13px] cursor-pointer z-10 backdrop-blur-sm flex items-center gap-2 transition-all duration-500 hover:bg-black/80">
            Skip →
          </button>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-10">
            <div className="h-full transition-all duration-100" style={{ width:`${videoProgress}%`, background:'linear-gradient(90deg, #FF9933, #138808)', borderRadius:2 }} />
          </div>
        </div>
      )}

      {/* ── Product Detail Modal ── */}
      <AnimatePresence>
        {modal && catForModal && (
          <motion.div
            className="fixed inset-0 bg-black/55 z-[2000] flex items-center justify-center p-6 overflow-y-auto"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:0.3, ease:EASE }}
            onClick={() => setModal(null)}>
            <motion.div
              className="bg-white rounded-2xl max-w-[500px] w-full shadow-apple-xl overflow-hidden"
              initial={{ opacity:0, scale:0.93, y:20 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.95 }}
              transition={{ duration:0.4, ease:EASE }}
              onClick={e => e.stopPropagation()}>
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background:catForModal.iconBg }}>
                    {React.createElement(modal.product.icon, { size:24, color:catForModal.iconColor, strokeWidth:1.8 })}
                  </div>
                  <div>
                    <div className="font-inter text-[11px] font-bold uppercase tracking-widest mb-0.5" style={{ color:colColors[modal.cat] }}>
                      {catForModal.label}
                    </div>
                    <div className="font-poppins font-bold text-[18px] text-gray-900">{modal.product.label}</div>
                  </div>
                </div>
                <button onClick={() => setModal(null)}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer border-none transition-colors duration-500">
                  <X size={18} color="#374151" />
                </button>
              </div>
              <div className="h-px bg-gray-100" />
              <div className="px-6 py-5">
                <p className="font-inter text-[14px] text-gray-600 leading-[1.75] mb-4">{modal.product.detail}</p>
                <div className="font-poppins font-bold text-[13px] text-gray-900 mb-3">Key Features</div>
                <div className="grid grid-cols-2 gap-2">
                  {modal.product.features.map(f => (
                    <div key={f} className="flex items-start gap-2 font-inter text-[12.5px] text-gray-700">
                      <CheckCircle2 size={14} color="#2E7D32" strokeWidth={2} className="flex-shrink-0 mt-0.5" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-6 pb-6 flex gap-3">
                <Link to="/get-quote"
                  className="flex-1 inline-flex items-center justify-content-center gap-2 py-3 px-5 bg-brand-orange text-white rounded-xl font-poppins font-bold text-[13px] no-underline transition-all duration-500 hover:bg-brand-orange-dark justify-center">
                  GET A QUOTE
                </Link>
                <button onClick={() => setModal(null)}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 bg-transparent text-[#1B2A4A] border-2 border-[#1B2A4A] rounded-xl font-poppins font-bold text-[13px] cursor-pointer transition-all duration-500 hover:bg-[#1B2A4A] hover:text-white">
                  CLOSE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
