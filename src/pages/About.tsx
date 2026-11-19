import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EASE: any = [0.22, 1, 0.36, 1]

const cards = [
  {
    to: '/about/story',
    icon: '📖',
    iconBg: 'bg-green-50 border-2 border-green-200',
    title: 'Our Story',
    desc: 'Learn about our journey, mission, values and why thousands of customers trust SSS for their insurance needs.',
    btnClass: 'bg-brand-green hover:bg-green-800 text-white',
    btnText: 'Explore Our Story →',
    delay: 0.1,
  },
  {
    to: '/about/team',
    icon: '👥',
    iconBg: 'bg-orange-50 border-2 border-orange-200',
    title: 'Our Team',
    desc: 'Meet our leadership team and the experienced professionals across our 10+ branches pan India.',
    btnClass: 'bg-brand-orange hover:bg-brand-orange-dark text-white',
    btnText: 'Meet Our Team →',
    delay: 0.2,
  },
]

export default function About() {
  return (
    <>
      <style>{`
        @keyframes sssLogoSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
      <Helmet>
        <title>About Us | SSS Risk Management & Insurance Brokers</title>
        <meta name="description" content="Learn about SSS Risk Management & Insurance Brokers — IRDAI certified direct broker with 15+ years of experience." />
      </Helmet>

      <div className="bg-white min-h-[70vh] font-inter">

        {/* Hero */}
        <section className="relative overflow-hidden pt-16 pb-20">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,107,0,0.18) 0%, rgba(255,160,60,0.10) 18%, rgba(255,255,255,0.98) 40%, rgba(255,255,255,1) 50%, rgba(220,245,225,0.85) 72%, rgba(46,125,50,0.20) 100%)' }} />
          <div className="absolute top-[-60px] left-[-60px] w-[320px] h-[320px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.14) 0%, transparent 70%)' }} />
          <div className="absolute bottom-[-80px] right-[-80px] w-[380px] h-[380px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(46,125,50,0.14) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-white pointer-events-none z-10" />
        {/* SSS logo watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <img src="/assets/sss.png" alt="" className="w-[480px] h-[480px] object-contain" style={{ opacity: 0.07, animation: 'sssLogoSpin 20s linear infinite' }} />
        </div>

          <div className="relative z-20 text-center px-6 max-w-[720px] mx-auto">
            <motion.span
              className="inline-block bg-orange-50/80 text-brand-orange font-inter text-[11px] font-bold tracking-[1.5px] uppercase px-3.5 py-1.5 rounded-full mb-4 border border-orange-200"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
              About Us
            </motion.span>
            <div className="overflow-hidden mb-1">
              <motion.h1 className="font-poppins font-extrabold text-[clamp(28px,4vw,46px)] text-[#1B2A4A]"
                initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.1, duration: 0.7, ease: EASE }}>
                About
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-5">
              <motion.h1 className="font-poppins font-extrabold text-[clamp(28px,4vw,46px)] text-brand-orange"
                initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.2, duration: 0.7, ease: EASE }}>
                SSS
              </motion.h1>
            </div>
            <motion.p className="font-inter text-[15px] text-gray-500 leading-relaxed max-w-[520px] mx-auto"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.55, ease: EASE }}>
              SSS Risk Management &amp; Insurance Brokers Pvt Ltd — IRDAI Certified Direct Broker for Life &amp; General Insurance. Choose a section to learn more.
            </motion.p>
          </div>
        </section>

        {/* Cards */}
        <div className="flex gap-8 justify-center px-6 py-16 flex-wrap">
          {cards.map((c) => (
            <motion.div
              key={c.to}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: c.delay, duration: 0.65, ease: EASE }}
            >
              <Link
                to={c.to}
                className="group block w-[340px] max-w-full bg-white border-2 border-gray-200 rounded-2xl p-12 text-center no-underline transition-all duration-600 ease-smooth hover:border-brand-orange hover:shadow-[0_16px_48px_rgba(255,107,0,0.14)] hover:-translate-y-1.5 relative overflow-hidden"
              >
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-600" />
                <div className="relative z-10">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 transition-all duration-600 ease-smooth ${c.iconBg}`}>
                    {c.icon}
                  </div>
                  <h2 className="font-poppins font-bold text-[22px] text-gray-900 mb-2.5">{c.title}</h2>
                  <p className="font-inter text-[14px] text-gray-500 leading-relaxed mb-7">{c.desc}</p>
                  <span className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-poppins font-semibold text-[13px] no-underline transition-all duration-500 ease-smooth ${c.btnClass}`}>
                    {c.btnText}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </>
  )
}
