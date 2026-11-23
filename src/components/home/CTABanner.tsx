import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function CTABanner() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      className="relative py-[52px] overflow-hidden"
      style={{ background: 'linear-gradient(135deg, rgba(255,107,0,0.18) 0%, rgba(255,160,60,0.10) 18%, rgba(255,255,255,0.98) 40%, rgba(255,255,255,1) 50%, rgba(220,245,225,0.85) 72%, rgba(46,125,50,0.20) 100%)' }}
      ref={ref}
    >
      <div className="absolute top-[-60px] left-[-60px] w-[280px] h-[280px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.12) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-60px] right-[-60px] w-[280px] h-[280px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(46,125,50,0.12) 0%, transparent 70%)' }} />

      <div className="max-w-[1280px] mx-auto px-6 relative z-10 flex items-center justify-between gap-8 flex-wrap">

        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
        >
          <h2 className="font-poppins font-extrabold text-[clamp(20px,2.5vw,28px)] text-gray-900 mb-2">
            Protect What Matters Most
          </h2>
          <p className="font-inter text-[14.5px] text-gray-500 leading-relaxed max-w-[520px]">
            Let our experts help you find the right insurance protection for you and your loved ones.
          </p>
        </motion.div>

        <motion.div
          className="flex gap-3.5 flex-wrap"
          initial={{ opacity: 0, x: 32 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
        >
          <Link
            to="/get-quote"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange text-white border-2 border-brand-orange rounded-lg font-poppins font-bold text-[13.5px] no-underline transition-all duration-500 ease-smooth hover:bg-brand-orange-dark hover:border-brand-orange-dark hover:-translate-y-1 hover:shadow-orange whitespace-nowrap"
          >
            GET A QUOTE
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-brand-blue border-2 border-brand-blue rounded-lg font-poppins font-bold text-[13.5px] no-underline transition-all duration-500 ease-smooth hover:bg-brand-blue hover:text-white hover:-translate-y-1 whitespace-nowrap"
          >
            TALK TO AN EXPERT
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
