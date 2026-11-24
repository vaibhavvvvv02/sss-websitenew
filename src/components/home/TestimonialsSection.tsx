import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const testimonials = [
  {
    name: 'Vaibhav Patel',
    role: 'Motor Insurance Customer',
    rating: 5,
    text: "My car was covered under Tata AIG's full insurance. After a major accident, the SSS claims team provided excellent cooperation. My car was fully repaired in just five days. Highly recommended.",
  },
  {
    name: 'Bhavin Rabari',
    role: 'Health Insurance Customer',
    rating: 5,
    text: 'Thank you for your excellent service! The claims process was smooth and hassle-free, and your team was very supportive and responsive throughout. I truly appreciate the efficiency and professionalism.',
  },
  {
    name: 'Dhaval Parikh',
    role: 'Insurance Customer',
    rating: 5,
    text: 'Mimansha, thank you so much for your help and support throughout the claim process. I am fully satisfied with your service and highly recommend SSS Risk Management to everyone.',
  },
]

export default function TestimonialsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [active, setActive] = useState(0)

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
            Reviews
          </span>
          <h2 className="font-poppins font-bold text-[clamp(22px,3vw,32px)] text-gray-900 mb-2.5">
            What Our <span className="text-brand-orange">Customers Say</span>
          </h2>
          <p className="font-inter text-[14.5px] text-gray-500 max-w-[480px] mx-auto leading-relaxed">
            Real stories from real customers who trust SSS for their insurance needs.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="group relative bg-white rounded-2xl p-7 border-[1.5px] border-gray-200 shadow-sm transition-all duration-500 ease-smooth hover:-translate-y-1 hover:shadow-apple-lg hover:border-brand-orange cursor-default"
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
            >
              {/* Quote mark */}
              <div className="absolute top-5 right-5 text-[52px] text-gray-100 font-serif leading-none select-none">"</div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-3.5">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <span key={idx} className={`text-[16px] ${idx < t.rating ? 'text-brand-orange' : 'text-gray-200'}`}>★</span>
                ))}
              </div>

              {/* Text */}
              <p className="font-inter text-[13.5px] text-gray-600 leading-[1.75] mb-5">{t.text}</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-brand-blue to-brand-blue-light flex items-center justify-center font-poppins font-bold text-[16px] text-white flex-shrink-0">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-poppins font-semibold text-[14px] text-gray-900">{t.name}</div>
                  <div className="font-inter text-[12px] text-gray-400">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dot indicators */}
        <motion.div
          className="flex justify-center gap-2 mt-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.75 }}
        >
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all duration-600 ease-smooth border-none cursor-pointer p-2 ${
                active === i
                  ? 'w-6 h-2 bg-brand-orange'
                  : 'w-2 h-2 bg-gray-300 hover:bg-brand-orange/50'
              }`}
            />
          ))}
        </motion.div>

      </div>
    </section>
  )
}
