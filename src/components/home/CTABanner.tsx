import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function CTABanner() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      className="relative py-[52px] overflow-hidden border-t border-orange-200"
      style={{ background: 'linear-gradient(135deg, #fff7f0 0%, #fff0e6 100%)' }}
      ref={ref}
    >
      {/* Decorative shield emoji */}
      <div className="absolute right-16 top-1/2 -translate-y-1/2 text-[110px] opacity-[0.12] pointer-events-none select-none">🛡️</div>

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
