import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ClipboardList, Search, ShieldCheck } from 'lucide-react'

const steps = [
  {
    num: '01',
    Icon: ClipboardList,
    iconColor: '#FF6B00',
    title: 'Tell Us What You Need',
    desc: 'Share your requirements with our experts.',
    bgImage: '/assets/HomeAsset/tell_us_what_you_need_background.jpg',
  },
  {
    num: '02',
    Icon: Search,
    iconColor: '#1a5276',
    title: 'Compare & Choose',
    desc: 'We compare the best policies for you.',
    bgImage: '/assets/HomeAsset/compare_choose_background.jpg',
  },
  {
    num: '03',
    Icon: ShieldCheck,
    iconColor: '#2E7D32',
    title: 'Get Protected',
    desc: 'Select your policy and stay protected.',
    bgImage: '/assets/HomeAsset/get_protected_background.jpg',
  },
]

export default function HowItWorks() {
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
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
        >
          <span className="inline-block bg-orange-50 text-brand-orange font-inter text-[11.5px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-3 border border-orange-200">
            Simple Process
          </span>
          <h2 className="font-poppins font-bold text-[clamp(22px,3vw,32px)] text-gray-900 mb-2.5">
            Insurance Made <span className="text-brand-orange">Simple</span>
          </h2>
          <p className="font-inter text-[14.5px] text-gray-500 max-w-[480px] mx-auto leading-relaxed">
            Getting insured has never been easier. Follow three simple steps.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-[60px] left-[calc(16.67%+16px)] right-[calc(16.67%+16px)] h-0.5 bg-gradient-to-r from-brand-orange via-brand-blue to-brand-orange z-0" />

          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              className="group relative bg-white rounded-2xl p-7 border-[1.5px] border-gray-200 text-center overflow-hidden z-10 transition-all duration-500 ease-smooth hover:border-brand-orange hover:shadow-orange hover:-translate-y-1"
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-65 transition-opacity duration-600 pointer-events-none rounded-2xl"
                style={{ backgroundImage: `url(${s.bgImage})` }}
              />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-brand-blue-light rounded-full flex items-center justify-center mx-auto mb-5 font-poppins font-extrabold text-xl text-white shadow-blue relative">
                  {s.num}
                  <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                    <s.Icon size={13} color={s.iconColor} strokeWidth={2} />
                  </div>
                </div>
                <div className="font-poppins font-semibold text-[15px] text-gray-900 mb-2.5">{s.title}</div>
                <p className="font-inter text-[13.5px] text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
