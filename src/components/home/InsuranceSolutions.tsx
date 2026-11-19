import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const solutions = [
  {
    title: 'Motor Insurance',
    href: '/products#motor',
    bgImage: '/assets/HomeAsset/motor_insurance_background.jpg',
    desc: 'Comprehensive cover for cars, bikes and commercial vehicles against accidents, theft and damage.',
  },
  {
    title: 'Health Insurance',
    href: '/products#health',
    bgImage: '/assets/HomeAsset/health_insurance_background.jpg',
    desc: 'Complete healthcare coverage for individuals and families at every stage of life.',
  },
  {
    title: 'Life Insurance',
    href: '/products#life',
    bgImage: '/assets/HomeAsset/life_insurance_background.jpg',
    desc: "Secure your family's future and achieve your long-term financial goals with confidence.",
  },
  {
    title: 'Home Insurance',
    href: '/products#home',
    bgImage: '/assets/HomeAsset/home_insurance_background.jpg',
    desc: 'Protect your home and valuables against fire, flood, earthquake and other perils.',
  },
  {
    title: 'Travel Insurance',
    href: '/products#travel',
    bgImage: '/assets/HomeAsset/travel_insurance_background.jpg',
    desc: 'Worry-free travel with coverage for trip cancellations, medical emergencies and lost baggage.',
  },
  {
    title: 'Commercial Insurance',
    href: '/products#commercial',
    bgImage: '/assets/HomeAsset/commercial_insurance_background.jpg',
    desc: 'Comprehensive business protection covering assets, employees and operational risks.',
  },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EASE: any = [0.22, 1, 0.36, 1]

export default function InsuranceSolutions() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-[72px] bg-white" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <span className="inline-block bg-orange-50 text-brand-orange font-inter text-[11.5px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-3 border border-orange-200">
            What We Offer
          </span>
          <h2 className="font-poppins font-bold text-[clamp(22px,3vw,32px)] text-gray-900 mb-2.5">
            Our Insurance <span className="text-brand-orange">Solutions</span>
          </h2>
          <p className="font-inter text-[14.5px] text-gray-500 max-w-[520px] mx-auto leading-relaxed">
            We are committed to providing the best insurance solutions with trust, transparency and timely support.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {solutions.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.8, ease: EASE }}
              /*
               * KEY FIX: whileHover on the motion.div wrapper — NOT on the Link.
               * The wrapper keeps its original position in the layout (no reflow),
               * so the cursor never "escapes" the element boundary. This completely
               * eliminates the hover shake.
               */
              whileHover={{ y: -7, transition: { duration: 0.65, ease: [0.34, 1.15, 0.64, 1] } }}
              whileTap={{  y: -2, transition: { duration: 0.2 } }}
              style={{ willChange: 'transform' }}
            >
              <Link
                to={item.href}
                className="group relative block rounded-2xl border-[1.5px] border-gray-200 overflow-hidden min-h-[160px] no-underline"
                style={{ transition: 'border-color 0.55s cubic-bezier(0.4,0,0.2,1), box-shadow 0.55s cubic-bezier(0.4,0,0.2,1)' }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.borderColor = '#FF6B00'
                  el.style.boxShadow = '0 12px 32px rgba(255,107,0,0.22)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.borderColor = ''
                  el.style.boxShadow = ''
                }}
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center pointer-events-none"
                  style={{ backgroundImage: `url(${item.bgImage})` }}
                />

                {/* Dark gradient overlay — lightens slightly on hover via group */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/10 pointer-events-none transition-opacity duration-600 group-hover:from-black/70 group-hover:via-black/30" />

                {/* Content */}
                <div className="relative z-10 p-6 h-full flex flex-col justify-end min-h-[160px]">
                  <div className="font-poppins font-semibold text-[15px] text-white mb-1 drop-shadow">
                    {item.title}
                  </div>

                  {/* Description: hidden by default, revealed on hover with smooth height */}
                  <div className="overflow-hidden max-h-0 group-hover:max-h-20 transition-all duration-600 ease-out">
                    <p className="font-inter text-[12.5px] text-white/85 leading-relaxed pt-1 pb-2">
                      {item.desc}
                    </p>
                  </div>

                  {/* Arrow button */}
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold self-start transition-all duration-500 ease-smooth bg-brand-orange text-white group-hover:bg-white group-hover:text-brand-orange">
                    →
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* More button */}
        <motion.div
          className="text-center mt-9"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.75 }}
        >
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-7 py-3 bg-orange-50 text-brand-orange rounded-full font-poppins font-bold text-[13px] tracking-wide no-underline border-[1.5px] border-brand-orange transition-all duration-600 ease-smooth hover:bg-brand-orange hover:text-white hover:shadow-orange"
          >
            MORE PRODUCTS →
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
