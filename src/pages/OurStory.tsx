import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, useInView } from 'framer-motion'
import { Gem, Users, GraduationCap, Handshake, Trophy, Smile, ShieldCheck, CheckCircle2 } from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EASE: any = [0.22, 1, 0.36, 1]

const journeySteps = [
  { year: '2021', label: 'Founded',   color: '#FF6B00', desc: 'SSS was founded with a vision to provide transparent and customer-first insurance solutions.' },
  { year: '2022', label: 'Growth',    color: '#e55f00', desc: 'Expanded our team and strengthened relationships with leading insurers across India.' },
  { year: '2024', label: 'Expansion', color: '#2E7D32', desc: 'Widened our service portfolio and established a pan-India presence across multiple cities.' },
  { year: '2026', label: 'Today',     color: '#1a5226', desc: 'Continuing to protect thousands of lives and businesses every day with trusted guidance.' },
]

const whyCards = [
  { title: 'Customer Centric Approach', desc: 'In every aspect of business, we keep Customer at the center. We focus on creating a Positive Experience by maximizing service and building relationships.', accent: '#2E7D32', bgImage: '/assets/AboutAsset/customer_centric_approach_original_logo_290x260.jpg' },
  { title: 'Harping on Insurer Relationships for Customer Benefit', desc: 'Our strong relations with insurance companies helps us get good deals for our customers.', accent: '#FF6B00', bgImage: '/assets/AboutAsset/insurer_relationships_customer_benefit_290x260.jpg' },
  { title: 'Experienced & Knowledgeable Teams', desc: 'We use our expertise and experience for the benefit of our customers.', accent: '#2E7D32', bgImage: '/assets/AboutAsset/experienced_knowledgeable_teams_logo_text_290x260.jpg' },
  { title: 'Claim Management Expertise', desc: 'We have a trained team to handle claims professionally, ensuring customers get their justified full claim.', accent: '#FF6B00', bgImage: '/assets/AboutAsset/claim_management_expertise_clean_290x260.jpg' },
]

const statData = [
  { icon: Smile,        color: '#FF6B00', bg: '#FFEEDD', ring: '#FFD9B355', value: 25000, suffix: 'K+', divide: 1000, label: 'Happy Customers' },
  { icon: ShieldCheck,  color: '#2E7D32', bg: '#DDF5E8', ring: '#B7E8CB55', value: 35000, suffix: 'K+', divide: 1000, label: 'Policies Issued' },
  { icon: CheckCircle2, color: '#1a5276', bg: '#E1EEFF', ring: '#BBD8FF55', value: 300,   suffix: '+',  divide: 1,    label: 'Collective Experience' },
]

const values = [
  { Icon: Gem,          color: 'orange', title: 'Integrity',     desc: 'We act with transparency and accountability.' },
  { Icon: Users,        color: 'green',  title: 'Customer First',desc: 'Our customers remain at the center of everything we do.' },
  { Icon: GraduationCap,color: 'orange', title: 'Expertise',     desc: 'We combine knowledge and experience to provide better solutions.' },
  { Icon: Handshake,    color: 'green',  title: 'Trust',         desc: 'We build long-term relationships with customers and insurers.' },
  { Icon: Trophy,       color: 'orange', title: 'Excellence',    desc: 'We continuously improve our service.' },
]

const leaders = [
  {
    name: 'Ashvin Patel', role: 'Director', bgColor: '#FFF1E4',
    img: '/assets/team/ashwin.jpg.jpeg',
    bio: [
      'Ashvin Patel is an Electrical Engineer from L D College of Engineering. Having an inherent zeal of entrepreneurship, he acquired sizable experience from 1998 to 2008, working in India, Saudi Arabia, UAE, Oman and Singapore.',
      'He has overseen prestigious projects with ADCO Abu Dhabi, Kuwait Oil Refinery, Qatar Petroleum, Celanese Singapore, and Indian clients like ONGC, GAIL, HPCL, BPCL, Larsen & Toubro, and Reliance Industries.',
    ],
  },
  {
    name: 'Satish Nikam', role: 'Principal Officer, CEO & MD', bgColor: '#ffffff',
    img: '/assets/team/satish.jpg',
    bio: [
      'An Electrical Engineer from LD College of Engineering & Gold Medalist in MBA Marketing from Gujarat University. He also holds a Fellowship from Insurance Institute of India.',
      'After working with ISRO, Arvind Mills, and Maruti Udyog, he spent 17+ years in Insurance with ICICI Lombard and SBI General. His last role was National Manager – Retail Broking at SBI Gen.',
    ],
  },
  {
    name: 'Kirit Panchal', role: 'Director', bgColor: '#E7F5EA',
    img: '/assets/team/kirit.jpg.jpeg',
    bio: [
      'Kirit Panchal is an Electrical Engineer with 21+ years of experience in Oil and Gas construction, specializing in corrosion control. He is a Corrosion Technologist certified by NACE International since 2011.',
      'A founder director of M/s. SARK EPC Projects Pvt. Ltd., he has rich experience in project management and quality control.',
    ],
  },
]

function useCountUp(target: number, divide: number, active: boolean, duration = 1400) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    let startTime: number | null = null
    const step = (ts: number) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setVal(Math.floor((eased * target) / divide))
      if (progress < 1) requestAnimationFrame(step)
      else setVal(target / divide)
    }
    requestAnimationFrame(step)
  }, [active, target, divide, duration])
  return val
}

function StatCard({ s, i, active }: { s: (typeof statData)[0]; i: number; active: boolean }) {
  const count = useCountUp(s.value, s.divide, active)
  return (
    <motion.div
      className="flex-1 min-w-[200px] max-w-[240px] flex items-center gap-4 bg-white rounded-2xl px-5 py-5 border border-gray-100 hover:-translate-y-1 hover:shadow-apple-lg hover:border-orange-200 transition-all duration-500 ease-smooth"
      style={{ boxShadow: '0 2px 10px rgba(17,24,39,0.05)' }}
      initial={{ opacity: 0, y: 18 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.12, duration: 0.6, ease: EASE }}
    >
      <div className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center flex-shrink-0" style={{ background: s.bg, boxShadow: `0 0 0 6px ${s.ring}` }}>
        <s.icon size={24} color={s.color} strokeWidth={1.8} />
      </div>
      <div>
        <div className="font-poppins font-extrabold text-[27px] text-brand-orange leading-none tabular-nums">{count}{s.suffix}</div>
        <div className="font-inter text-[13px] text-gray-500 mt-1">{s.label}</div>
      </div>
    </motion.div>
  )
}

export default function OurStory() {
  const [statsActive, setStatsActive] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-80px' })
  const journeyRef = useRef(null)
  const journeyInView = useInView(journeyRef, { once: true, margin: '-80px' })
  const whyRef = useRef(null)
  const whyInView = useInView(whyRef, { once: true, margin: '-80px' })
  const valuesRef = useRef(null)
  const valuesInView = useInView(valuesRef, { once: true, margin: '-80px' })
  const teamRef = useRef(null)
  const teamInView = useInView(teamRef, { once: true, margin: '-80px' })

  useEffect(() => { if (statsInView) setStatsActive(true) }, [statsInView])

  return (
    <>
      <style>{`
        @keyframes sssLogoSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
      <Helmet>
        <title>Our Story | SSS Risk Management & Insurance Brokers</title>
        <meta name="description" content="The story of SSS Risk Management — from our founding in 2021 to protecting 25,000+ customers across India." />
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-16 pb-20">
        <div className="absolute inset-0" style={{ background:'linear-gradient(135deg, rgba(255,107,0,0.18) 0%, rgba(255,160,60,0.10) 18%, rgba(255,255,255,0.98) 40%, rgba(255,255,255,1) 50%, rgba(220,245,225,0.85) 72%, rgba(46,125,50,0.20) 100%)' }} />
        <div className="absolute top-[-60px] left-[-60px] w-[320px] h-[320px] rounded-full pointer-events-none" style={{ background:'radial-gradient(circle, rgba(255,107,0,0.14) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-80px] right-[-80px] w-[380px] h-[380px] rounded-full pointer-events-none" style={{ background:'radial-gradient(circle, rgba(46,125,50,0.14) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-white pointer-events-none z-10" />
        {/* SSS logo watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <img src="/assets/sss.png" alt="" className="w-[480px] h-[480px] object-contain" style={{ opacity: 0.07, animation: 'sssLogoSpin 20s linear infinite' }} />
        </div>
        <div className="relative z-20 text-center px-6 max-w-[720px] mx-auto">
          <motion.span className="inline-block bg-orange-50/80 text-brand-orange font-inter text-[11px] font-bold tracking-[1.5px] uppercase px-3.5 py-1.5 rounded-full mb-4 border border-orange-200"
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05, duration:0.5, ease:EASE }}>
            ABOUT US
          </motion.span>
          <div className="overflow-hidden mb-1">
            <motion.h1 className="font-poppins font-extrabold text-[clamp(28px,4vw,46px)] text-[#1B2A4A]"
              initial={{ y:'110%' }} animate={{ y:0 }} transition={{ delay:0.1, duration:0.7, ease:EASE }}>
              Our Story &amp;
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-5">
            <motion.h1 className="font-poppins font-extrabold text-[clamp(28px,4vw,46px)] text-brand-orange"
              initial={{ y:'110%' }} animate={{ y:0 }} transition={{ delay:0.2, duration:0.7, ease:EASE }}>
              Our Journey
            </motion.h1>
          </div>
          <motion.p className="font-inter text-[15px] text-gray-500 leading-relaxed mb-8 max-w-[520px] mx-auto"
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35, duration:0.55, ease:EASE }}>
            From our founding in 2021 to protecting 25,000+ customers — driven by one goal, protecting what matters most to you.
          </motion.p>
          <motion.div className="flex flex-wrap gap-3 justify-center"
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5, duration:0.5, ease:EASE }}>
            <Link to="/get-quote" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-xl font-poppins font-bold text-[13.5px] no-underline border-2 border-brand-orange transition-all duration-500 hover:bg-brand-orange-dark hover:-translate-y-1 shadow-orange">
              GET A QUOTE →
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-blue border-2 border-brand-blue rounded-xl font-poppins font-bold text-[13.5px] no-underline transition-all duration-500 hover:bg-brand-blue hover:text-white hover:-translate-y-1">
              CONTACT US →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Journey Timeline ── */}
      <section className="py-[72px] bg-white" ref={journeyRef}>
        <div className="max-w-[1100px] mx-auto px-6">
          <motion.div className="text-center max-w-[640px] mx-auto mb-14" initial={{ opacity: 0, y: 24 }} animate={journeyInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }}>
            <h2 className="font-poppins font-extrabold text-[clamp(22px,2.8vw,32px)] text-gray-900 mb-3">
              Our <span className="text-brand-orange">Story</span>
            </h2>
            <p className="font-inter text-[15px] text-gray-500 leading-relaxed">
              From our humble beginning to becoming a trusted insurance partner, our journey has been driven by one goal — protecting what matters most to you.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-0">
            {/* Connector line */}
            <div className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-brand-orange to-brand-green z-0" />
            {journeySteps.map((step, i) => (
              <motion.div
                key={step.year}
                className="text-center relative px-3 mb-8 md:mb-0"
                initial={{ opacity: 0, y: 24 }}
                animate={journeyInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.8, ease: EASE }}
              >
                <div className="flex items-center justify-center mb-5 relative z-10">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center font-poppins font-extrabold text-[13px] text-white shadow-apple-lg" style={{ background: step.color }}>{step.year}</div>
                </div>
                <div className="font-poppins font-bold text-[14px] text-brand-orange mb-1.5">{step.year}</div>
                <div className="font-poppins font-bold text-[14px] text-gray-900 mb-2">{step.label}</div>
                <p className="font-inter text-[12.5px] text-gray-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why SSS ── */}
      <section className="py-[72px] bg-white" ref={whyRef}>
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 24 }} animate={whyInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }}>
            <span className="inline-block bg-orange-50 text-brand-orange font-inter text-[11.5px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-3 border border-orange-200">Why Choose SSS</span>
            <h2 className="font-poppins font-bold text-[clamp(20px,2.5vw,28px)] text-gray-900">
              Why insurance through SSS <span className="text-brand-orange">(Suraksha Samruddhi Samadhan)</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyCards.map((c, i) => (
              <motion.div
                key={c.title}
                className="group relative bg-white rounded-2xl p-7 border-[1.5px] border-gray-200 overflow-hidden transition-all duration-500 ease-smooth hover:border-brand-orange hover:shadow-orange hover:-translate-y-1"
                initial={{ opacity: 0, y: 32 }}
                animate={whyInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.8, ease: EASE }}
              >
                <div className="absolute inset-0 bg-cover bg-center opacity-[0.12] group-hover:opacity-[0.22] transition-opacity pointer-events-none" style={{ backgroundImage: `url(${c.bgImage})` }} />
                <div className="relative z-10">
                  <div className="font-poppins font-bold text-[13.5px] text-gray-900 mb-2.5 leading-snug">{c.title}</div>
                  <p className="font-inter text-[12.5px] text-gray-500 leading-relaxed mb-4">{c.desc}</p>
                  <div className="h-[3px] w-10 rounded-sm" style={{ background: c.accent }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section
        className="relative py-16 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(100deg, rgba(255,107,0,0.15) 0%, rgba(255,255,255,1) 35%, rgba(255,255,255,1) 65%, rgba(46,125,50,0.15) 100%)' }}
        ref={statsRef}
      >
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
        <div className="relative z-20 max-w-[1100px] mx-auto flex justify-center gap-6 flex-wrap">
          {statData.map((s, i) => <StatCard key={s.label} s={s} i={i} active={statsActive} />)}
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-16 bg-white" ref={valuesRef}>
        <div className="max-w-[1180px] mx-auto px-6">
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 24 }} animate={valuesInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }}>
            <span className="inline-block bg-orange-50 text-brand-orange font-inter text-[11.5px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-3 border border-orange-200">What We Stand For</span>
            <h2 className="font-poppins font-bold text-[clamp(20px,2.5vw,28px)] text-gray-900">Our <span className="text-brand-orange">Values</span></h2>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                className="group bg-white rounded-2xl border border-gray-100 p-7 text-center flex flex-col items-center shadow-sm hover:-translate-y-1.5 hover:shadow-apple-lg transition-all duration-500 ease-smooth"
                initial={{ opacity: 0, y: 20 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.8, ease: EASE }}
              >
                <div className={`w-[60px] h-[60px] rounded-2xl flex items-center justify-center mb-4 border-[1.5px] border-transparent group-hover:border-brand-orange transition-all duration-500 ease-smooth group-hover:scale-105 group-hover:-rotate-3 ${v.color === 'orange' ? 'bg-orange-50' : 'bg-green-50'}`}>
                  <v.Icon size={28} color={v.color === 'orange' ? '#FF6B00' : '#2E7D32'} strokeWidth={1.8} />
                </div>
                <div className="font-poppins font-bold text-[15px] text-gray-900 mb-2">{v.title}</div>
                <p className="font-inter text-[13px] text-gray-500 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leaders ── */}
      <section className="py-[72px] bg-white" ref={teamRef}>
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 24 }} animate={teamInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }}>
            <span className="inline-block bg-orange-50 text-brand-orange font-inter text-[11.5px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-3 border border-orange-200">Meet</span>
            <h2 className="font-poppins font-bold text-[clamp(22px,3vw,32px)] text-gray-900 mb-2">Our <span className="text-brand-orange">Leaders</span></h2>
            <div className="flex items-center justify-center gap-3 mt-3.5">
              <div className="w-16 h-0.5 bg-brand-orange rounded" />
              <span>🛡️</span>
              <div className="w-16 h-0.5 bg-brand-orange rounded" />
            </div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leaders.map((l, i) => (
              <motion.div
                key={l.name}
                className="group bg-white border-[1.5px] border-gray-200 rounded-2xl overflow-hidden transition-all duration-500 ease-smooth hover:border-brand-orange hover:shadow-orange hover:-translate-y-1"
                initial={{ opacity: 0, y: 32 }}
                animate={teamInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.6, ease: EASE }}
              >
                <div className="w-full h-[400px] overflow-hidden" style={{ background: l.bgColor }}>
                  <img src={l.img} alt={l.name} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-6 pb-7">
                  <div className="font-poppins font-bold text-[17px] text-brand-orange mb-1">{l.name}</div>
                  <div className="font-inter text-[13px] text-gray-500 mb-3">{l.role}</div>
                  <div className="w-9 h-[2.5px] bg-brand-orange rounded mb-3.5" />
                  {l.bio.map((para, j) => (
                    <p key={j} className="font-inter text-[13px] text-gray-600 leading-[1.75] mb-2.5 last:mb-0">{para}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <motion.section
        className="relative py-12 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(255,107,0,0.18) 0%, rgba(255,160,60,0.10) 18%, rgba(255,255,255,0.98) 40%, rgba(255,255,255,1) 50%, rgba(220,245,225,0.85) 72%, rgba(46,125,50,0.20) 100%)' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        viewport={{ once: true }}
      >
        <div className="absolute top-[-60px] left-[-60px] w-[280px] h-[280px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-60px] right-[-60px] w-[280px] h-[280px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(46,125,50,0.12) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-[1280px] mx-auto flex items-center justify-between gap-8 flex-wrap">
          <div>
            <h3 className="font-poppins font-bold text-[clamp(18px,2.5vw,24px)] text-[#1B2A4A] mb-1.5">Let's Protect What Matters to You</h3>
            <p className="font-inter text-[14px] text-gray-500">Talk to our experts and find the right insurance solution.</p>
          </div>
          <div className="flex gap-3.5 flex-wrap">
            <Link to="/get-quote" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-lg font-poppins font-bold text-[13px] no-underline transition-all hover:bg-brand-orange-dark hover:-translate-y-1 whitespace-nowrap">GET A QUOTE →</Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1B2A4A] border-2 border-[#1B2A4A] rounded-lg font-poppins font-bold text-[13px] no-underline transition-all hover:bg-[#1B2A4A] hover:text-white hover:-translate-y-1 whitespace-nowrap">CONTACT US →</Link>
          </div>
        </div>
      </motion.section>
    </>
  )
}
