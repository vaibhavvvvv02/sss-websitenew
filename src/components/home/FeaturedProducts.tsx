import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const motorFeatures = ['Comprehensive Coverage', 'Own Damage Cover', 'Third Party Liability', 'Personal Accident Cover', 'Roadside Assistance']
const healthFeatures = ['Hospitalisation Expenses', 'Pre & Post Hospitalisation', 'Day Care Procedures', 'Domiciliary Treatment', 'Maternity Benefits']

export default function FeaturedProducts() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-[72px] bg-white" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-7">

        {/* Motor Insurance Card */}
        <motion.div
          className="group bg-white rounded-2xl overflow-hidden border-[1.5px] border-gray-200 transition-all duration-500 ease-smooth hover:border-brand-orange hover:shadow-orange"
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] as any }}
        >
          <div className="relative w-full h-[200px] overflow-hidden">
            <img
              src="/assets/HomeAsset/motor_insurance_background_no_text_v2.jpg"
              alt="Motor Insurance"
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
          </div>
          <div className="p-6 pb-7">
            <div className="font-inter text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Protect Your Journey</div>
            <div className="font-poppins font-bold text-[20px] text-gray-900 mb-2">Motor Insurance</div>
            <p className="font-inter text-[13.5px] text-gray-500 leading-relaxed mb-4">
              Drive with confidence knowing your vehicle is comprehensively protected against accidents and emergencies.
            </p>
            <div className="h-px bg-gray-100 mb-4" />
            <ul className="flex flex-col gap-2.5 mb-5">
              {motorFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2.5 font-inter text-[13px] text-gray-700">
                  <span className="w-[18px] h-[18px] rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to="/products#motor"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white rounded-lg font-poppins font-semibold text-[13px] no-underline transition-all duration-500 ease-smooth hover:bg-brand-blue-light hover:-translate-y-1"
            >
              EXPLORE MOTOR INSURANCE →
            </Link>
          </div>
        </motion.div>

        {/* Health Insurance Card */}
        <motion.div
          className="group bg-white rounded-2xl overflow-hidden border-[1.5px] border-gray-200 transition-all duration-500 ease-smooth hover:border-brand-orange hover:shadow-orange"
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] as any }}
        >
          <div className="relative w-full h-[200px] overflow-hidden">
            <img
              src="/assets/HomeAsset/health_insurance_background_no_text.jpg"
              alt="Health Insurance"
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
          </div>
          <div className="p-6 pb-7">
            <div className="font-inter text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Protect Your Health</div>
            <div className="font-poppins font-bold text-[20px] text-gray-900 mb-2">Health Insurance</div>
            <p className="font-inter text-[13.5px] text-gray-500 leading-relaxed mb-4">
              Quality healthcare for you and your loved ones — comprehensive coverage for every medical need.
            </p>
            <div className="h-px bg-gray-100 mb-4" />
            <ul className="flex flex-col gap-2.5 mb-5">
              {healthFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2.5 font-inter text-[13px] text-gray-700">
                  <span className="w-[18px] h-[18px] rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to="/products#health"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-orange text-white rounded-lg font-poppins font-semibold text-[13px] no-underline transition-all duration-500 ease-smooth hover:bg-brand-orange-dark hover:-translate-y-1"
            >
              EXPLORE HEALTH INSURANCE →
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
