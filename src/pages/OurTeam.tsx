import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Clock } from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EASE: any = [0.22, 1, 0.36, 1]

const leaders = [
  {
    name: 'Ashvin Patel', role: 'Director', bgColor: '#FFF1E4',
    img: '/assets/team/ashwin.jpg.jpeg',
    bio: [
      'Ashvin Patel is an Electrical Engineer from L D College of Engineering. Having an inherent zeal of entrepreneurship, he acquired sizable experience from 1998–2008, working in India, Saudi Arabia, UAE, Oman and Singapore.',
      'He has overseen prestigious projects with ADCO Abu Dhabi, Kuwait Oil Refinery, Qatar Petroleum, Celanese Singapore and Indian clients like ONGC, GAIL, HPCL, BPCL, Larsen & Toubro, and Reliance Industries.',
      'He is the founder of SARK EPC Projects Pvt. Ltd., which employs 150+ technical staff today.',
    ],
  },
  {
    name: 'Satish Nikam', role: 'Principal Officer, CEO & MD', bgColor: '#ffffff',
    img: '/assets/team/satish.jpg',
    bio: [
      'An Electrical Engineer from LD College of Engineering & Gold Medalist in MBA Marketing from Gujarat University. He also holds a Fellowship from Insurance Institute of India.',
      'After working with ISRO, Arvind Mills, and Maruti Udyog for 6 years, he has spent 17+ years in Insurance with ICICI Lombard and SBI General. His last role was National Manager – Retail Broking with SBI Gen.',
      'A thorough professional and visionary leader, his mastery is in understanding market requirements and nurturing talented teams.',
    ],
  },
  {
    name: 'Kirit Panchal', role: 'Director', bgColor: '#E7F5EA',
    img: '/assets/team/kirit.jpg.jpeg',
    bio: [
      'Kirit Panchal is an Electrical Engineer with 21+ years of experience in Oil and Gas construction, specializing in corrosion control. He is a Corrosion Technologist certified by NACE International since 2011.',
      'A founder director of M/s. SARK EPC Projects Pvt. Ltd., with rich experience in project management and quality control across India and globally.',
    ],
  },
]

const teamData: Record<string, { name: string; role: string; experience: number; image: string }[]> = {
  Ahmedabad: [
    { name: 'Manoj Das',      role: 'Head UW & Compliance',       experience: 37, image: '/assets/team/ahmedabad/das.png' },
    { name: 'Pradeep Gandhi', role: 'Head-Claims',                 experience: 38, image: '/assets/team/ahmedabad/pradeep.png' },
    { name: 'Amit Dwivedi',   role: 'Sr. VP - Corporate',          experience: 27, image: '/assets/team/ahmedabad/amit.jpeg' },
    { name: 'Anu Bakshi',     role: 'Team Head',                   experience: 27, image: '/assets/team/ahmedabad/masi.png' },
    { name: 'Krunal Shah',    role: 'Agency Head',                 experience: 23, image: '/assets/team/ahmedabad/kunal.png' },
    { name: 'Sunil Bhadra',   role: 'President',                   experience: 20, image: '/assets/team/ahmedabad/sunil.png' },
    { name: 'Devang Kamdar',  role: 'Finance Manager',             experience: 15, image: '/assets/team/ahmedabad/devang.png' },
    { name: 'Karthik Iyer',   role: 'Sr. Corporate Risk Manager',  experience: 5,  image: '/assets/team/ahmedabad/kartik.png' },
  ],
  Gandhidham: [
    { name: 'Darshan Solanki', role: 'Regional Sales Manager',  experience: 20, image: '/assets/team/gandhidham/darshan.png' },
    { name: 'Dinesh Bhagat',   role: 'Relationship Manager',    experience: 19, image: '' },
  ],
  Rajkot: [
    { name: 'Mayur Bhensdadiya', role: 'Zonal Sales Manager',    experience: 23, image: '/assets/team/rajkot/mayur.png' },
    { name: 'Tejas Lal',         role: 'Relationship Manager',   experience: 19, image: '' },
  ],
  Surat: [
    { name: 'Anil Mohite',   role: 'VP - Public Relationship Officer', experience: 13, image: '/assets/team/surat/anil.png' },
    { name: 'Kalpesh Remje', role: 'Relationship Manager',              experience: 13, image: '/assets/team/surat/kalpesh.png' },
  ],
  Mumbai: [
    { name: 'Sneha Gonsalves', role: 'Vice President',            experience: 17, image: '/assets/team/mumbai/sneha.png' },
    { name: 'Anand Rao',       role: 'Sr. Relationship Manager',  experience: 15, image: '/assets/team/mumbai/aanandrao.png' },
  ],
  Pune: [
  ],
  Kolhapur: [
    { name: 'Rahul Mane',          role: 'Sr. VP - Corporate',          experience: 25, image: '/assets/team/kolhapur/rahul.png' },
    { name: 'Sangram Pawar Medhe', role: 'Sr. Relationship Manager',    experience: 15, image: '' },
  ],
  Kolkata: [
    { name: 'Gitimoni Gogoi',    role: 'AVP - Corporate Risk Management', experience: 21, image: '/assets/team/kolkata/gitimoni.png' },
    { name: 'Kingshuk Chatterjee', role: 'Sr. Corporate Risk Manager',   experience: 20, image: '/assets/team/kolkata/kingshuk.png' },
  ],
  Noida: [
    { name: 'Rajeev Kumar', role: 'Business Head',          experience: 40, image: '/assets/team/noida/rajiv.png' },
    { name: 'Shakti Kumar', role: 'Corporate Risk Manager', experience: 20, image: '' },
  ],
  Bangalore: [
    { name: 'Vasanth Kumar', role: 'Relationship Manager', experience: 20, image: '' },
  ],
}

const cities = Object.keys(teamData)

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}
const avatarColors = ['#1a5276', '#2E7D32', '#FF6B00', '#6b21a8', '#0369a1', '#be185d', '#b45309', '#0f766e']
function nameToColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

export default function OurTeam() {
  const [activeCity, setActiveCity] = useState(0)
  const currentMembers = teamData[cities[activeCity]] || []

  const leaderRef = useRef(null)
  const leaderInView = useInView(leaderRef, { once: true, margin: '-80px' })
  const branchRef = useRef(null)
  const branchInView = useInView(branchRef, { once: true, margin: '-80px' })

  return (
    <>
      <style>{`
        @keyframes sssLogoSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
      <Helmet>
        <title>Our Team | SSS Risk Management & Insurance Brokers</title>
        <meta name="description" content="Meet the experienced leadership and expert team behind SSS Risk Management across 10+ branches pan India." />
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
              Meet Our
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-5">
            <motion.h1 className="font-poppins font-extrabold text-[clamp(28px,4vw,46px)] text-brand-orange"
              initial={{ y:'110%' }} animate={{ y:0 }} transition={{ delay:0.2, duration:0.7, ease:EASE }}>
              Expert Team
            </motion.h1>
          </div>
          <motion.p className="font-inter text-[15px] text-gray-500 leading-relaxed mb-8 max-w-[520px] mx-auto"
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35, duration:0.55, ease:EASE }}>
            Experienced professionals across 10+ branches pan India — dedicated to finding the best insurance solutions for you.
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

      {/* ── Leadership ── */}
      <section className="py-[72px] bg-white" ref={leaderRef}>
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div className="text-center mb-12"
            initial={{ opacity: 0, y: 24 }} animate={leaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE }}>
            <span className="inline-block bg-orange-50 text-brand-orange font-inter text-[11.5px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-3 border border-orange-200">
              Founders &amp; Directors
            </span>
            <h2 className="font-poppins font-bold text-[clamp(22px,3vw,32px)] text-gray-900 mb-2">
              Our <span className="text-brand-orange">Leadership</span> Team
            </h2>
            <div className="flex items-center justify-center gap-3 mt-3.5">
              <div className="w-16 h-0.5 bg-brand-orange rounded" />
              <span>🛡️</span>
              <div className="w-16 h-0.5 bg-brand-orange rounded" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leaders.map((l, i) => (
              <motion.div key={l.name}
                className="group bg-white border-[1.5px] border-gray-200 rounded-2xl overflow-hidden transition-all duration-500 ease-smooth hover:border-brand-orange hover:shadow-orange hover:-translate-y-1"
                initial={{ opacity: 0, y: 32 }} animate={leaderInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.6, ease: EASE }}>
                <div className="w-full h-[400px] overflow-hidden" style={{ background: l.bgColor }}>
                  <img src={l.img} alt={l.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
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

      {/* ── Branch Teams ── */}
      <section className="py-[72px] bg-white" ref={branchRef}>
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div className="text-center mb-10"
            initial={{ opacity: 0, y: 24 }} animate={branchInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE }}>
            <span className="inline-block bg-orange-50 text-brand-orange font-inter text-[11.5px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-3 border border-orange-200">
              Pan India Presence
            </span>
            <h2 className="font-poppins font-bold text-[clamp(22px,3vw,32px)] text-gray-900">
              Our <span className="text-brand-orange">Branch Teams</span>
            </h2>
          </motion.div>

          {/* City Tabs */}
          <div className="overflow-x-auto pb-1 mb-10" style={{ scrollbarWidth: 'none' }}>
            <div className="flex flex-wrap justify-start md:justify-center gap-2 w-max md:w-auto">
              {cities.map((city, i) => (
                <motion.button key={city}
                  onClick={() => setActiveCity(i)}
                  className={`px-5 py-2 rounded-full font-poppins font-semibold text-[13px] border-[1.5px] transition-all duration-500 ease-smooth whitespace-nowrap cursor-pointer ${
                    activeCity === i
                      ? 'bg-brand-orange text-white border-brand-orange shadow-orange'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-brand-orange hover:text-brand-orange'
                  }`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={branchInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.04, duration: 0.7, ease: EASE }}>
                  {city}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Member Cards */}
          <AnimatePresence mode="wait">
            <motion.div key={activeCity}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.65, ease: EASE }}>
              {currentMembers.map((m, i) => (
                <motion.div key={m.name}
                  className="group bg-white rounded-2xl p-6 border-[1.5px] border-gray-200 text-center transition-all duration-500 ease-smooth hover:border-brand-orange hover:shadow-orange hover:-translate-y-1"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06, duration: 0.7, ease: EASE }}>
                  {m.image ? (
                    <img src={m.image} alt={m.name}
                      className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-gray-100 group-hover:border-brand-orange transition-colors" />
                  ) : (
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 font-poppins font-bold text-[22px] text-white group-hover:scale-105 transition-transform"
                      style={{ background: nameToColor(m.name) }}>
                      {getInitials(m.name)}
                    </div>
                  )}
                  <div className="font-poppins font-bold text-[14px] text-gray-900 mb-1">{m.name}</div>
                  <div className="font-inter text-[12px] text-gray-500 leading-snug mb-2.5">{m.role}</div>
                  <span className="inline-flex items-center gap-1.5 font-inter text-[11.5px] font-semibold text-brand-orange bg-orange-50 px-3 py-1 rounded-full">
                    <Clock size={11} strokeWidth={2} />
                    {m.experience}+ yrs
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── CTA ── */}
      <motion.section className="relative py-12 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(255,107,0,0.18) 0%, rgba(255,160,60,0.10) 18%, rgba(255,255,255,0.98) 40%, rgba(255,255,255,1) 50%, rgba(220,245,225,0.85) 72%, rgba(46,125,50,0.20) 100%)' }}
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }} viewport={{ once: true }}>
        <div className="absolute top-[-60px] left-[-60px] w-[280px] h-[280px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-60px] right-[-60px] w-[280px] h-[280px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(46,125,50,0.12) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-[1280px] mx-auto flex items-center justify-between gap-8 flex-wrap">
          <div>
            <h3 className="font-poppins font-bold text-[clamp(18px,2.5vw,24px)] text-[#1B2A4A] mb-1.5">
              Let's Find the Right Protection for You
            </h3>
            <p className="font-inter text-[14px] text-gray-500">Talk to our insurance experts and discover suitable solutions.</p>
          </div>
          <div className="flex gap-3.5 flex-wrap">
            <Link to="/get-quote" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-lg font-poppins font-bold text-[13px] no-underline hover:bg-brand-orange-dark hover:-translate-y-1 transition-all whitespace-nowrap">GET A QUOTE →</Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1B2A4A] border-2 border-[#1B2A4A] rounded-lg font-poppins font-bold text-[13px] no-underline hover:bg-[#1B2A4A] hover:text-white hover:-translate-y-1 transition-all whitespace-nowrap">CONTACT US →</Link>
          </div>
        </div>
      </motion.section>
    </>
  )
}
