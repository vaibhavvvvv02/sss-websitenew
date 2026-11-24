import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const individualFeatures = ['Motor Insurance', 'Health & Mediclaim', 'Life & Term Insurance', 'Travel Insurance', 'Personal Accident Cover', 'Cyber Fraud Protection', 'Property Insurance']
const corporateFeatures = ['Fire & Allied Perils', 'Marine Insurance', 'Liability Insurance', 'Workmen\'s Compensation', 'Project & CAR/EAR Insurance', 'Group Health Insurance', 'Package Insurance']

export default function FeaturedProducts() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-[72px] bg-white" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-7">

        {/* Individual Insurance Card */}
        <motion.div
          className="group bg-white rounded-2xl overflow-hidden border-[1.5px] border-gray-200 transition-all duration-500 ease-smooth hover:border-brand-orange hover:shadow-orange"
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] as any }}
        >
          <div className="relative w-full h-[200px] overflow-hidden">
            <img
              src="/assets/HomeAsset/individual_insurance_banner.png"
              alt="Individual Insurance"
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              style={{ filter: 'brightness(1.0) saturate(0.9)' }}
            />
            <div className="absolute inset-0" style={{ background: 'rgba(255,255,255,0.15)' }} />
          </div>
          <div className="p-6 pb-7">
            <div className="font-inter text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Protect Yourself & Family</div>
            <div className="font-poppins font-bold text-[20px] text-gray-900 mb-2">Individual Insurance</div>
            <p className="font-inter text-[13.5px] text-gray-500 leading-relaxed mb-4">
              Comprehensive protection plans for individuals and families — covering life, health, motor, travel and more.
            </p>
            <div className="h-px bg-gray-100 mb-4" />
            <ul className="flex flex-col gap-2.5 mb-5">
              {individualFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2.5 font-inter text-[13px] text-gray-700">
                  <span className="w-[18px] h-[18px] rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white rounded-lg font-poppins font-semibold text-[13px] no-underline transition-all duration-500 ease-smooth hover:bg-brand-blue-light hover:-translate-y-1 w-full text-center justify-center"
            >
              EXPLORE INDIVIDUAL INSURANCE →
            </Link>
          </div>
        </motion.div>

        {/* Corporate Insurance Card */}
        <motion.div
          className="group bg-white rounded-2xl overflow-hidden border-[1.5px] border-gray-200 transition-all duration-500 ease-smooth hover:border-brand-orange hover:shadow-orange"
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] as any }}
        >
          <div className="relative w-full h-[200px] overflow-hidden">
            <img
              src="/assets/HomeAsset/corporate_insurance_banner.png"
              alt="Corporate Insurance"
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              style={{ filter: 'brightness(1.0) saturate(0.9)' }}
            />
            <div className="absolute inset-0" style={{ background: 'rgba(255,255,255,0.15)' }} />
          </div>
          <div className="p-6 pb-7">
            <div className="font-inter text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Protect Your Business</div>
            <div className="font-poppins font-bold text-[20px] text-gray-900 mb-2">Corporate Insurance</div>
            <p className="font-inter text-[13.5px] text-gray-500 leading-relaxed mb-4">
              Tailored insurance solutions for businesses of all sizes — protecting assets, employees and operations.
            </p>
            <div className="h-px bg-gray-100 mb-4" />
            <ul className="flex flex-col gap-2.5 mb-5">
              {corporateFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2.5 font-inter text-[13px] text-gray-700">
                  <span className="w-[18px] h-[18px] rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-orange text-white rounded-lg font-poppins font-semibold text-[13px] no-underline transition-all duration-500 ease-smooth hover:bg-brand-orange-dark hover:-translate-y-1 w-full text-center justify-center"
            >
              EXPLORE CORPORATE INSURANCE →
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
