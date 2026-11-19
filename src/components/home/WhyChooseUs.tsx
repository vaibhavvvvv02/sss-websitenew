import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { GraduationCap, Search, ClipboardCheck, Heart } from 'lucide-react'

const features = [
  { Icon: GraduationCap, iconColor: '#FF6B00', title: 'Expert Guidance', desc: 'Get the right insurance solutions based on your needs.', bgImage: '/assets/HomeAsset/expert_guidancee_background.jpg' },
  { Icon: Search, iconColor: '#1a5276', title: 'Multiple Insurers', desc: 'Compare policies from leading insurers and choose the best.', bgImage: '/assets/HomeAsset/multiple_insurers_background_no_text.jpg' },
  { Icon: ClipboardCheck, iconColor: '#2E7D32', title: 'Hassle-Free Claims', desc: 'We assist you at every step of the claim process.', bgImage: '/assets/HomeAsset/hassle_free_claims_background.jpg' },
  { Icon: Heart, iconColor: '#FF6B00', title: 'Customer First', desc: 'Personalised service and support, always putting you first.', bgImage: '/assets/HomeAsset/customer_first_background.jpg' },
]

export default function WhyChooseUs() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-[72px] bg-white" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Visual */}
        <motion.div
          className="hidden lg:flex justify-center items-center"
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as any }}
        >
          <div className="relative w-[340px] h-[340px]">
            <img
              src="/assets/HomeAsset/sss_clipboard_shield_hd.jpg"
              alt="Why Choose SSS"
              className="w-full h-full object-contain"
              style={{ mixBlendMode: 'multiply' }}
            />
            {/* Badge top-right */}
            <div className="absolute -top-2.5 -right-4 bg-white rounded-xl px-4 py-2.5 shadow-apple flex items-center gap-2 font-inter text-[12px] font-semibold text-gray-900 border border-gray-100">
              <span className="w-2 h-2 rounded-full bg-brand-green" />
              IRDAI Licensed Broker
            </div>
            {/* Badge bottom-left */}
            <div className="absolute bottom-12 -left-4 bg-white rounded-xl px-4 py-2.5 shadow-apple flex items-center gap-2 font-inter text-[12px] font-semibold text-gray-900 border border-gray-100">
              <span className="w-2 h-2 rounded-full bg-brand-orange" />
              400+ POSP Partners
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          >
            <span className="inline-block bg-orange-50 text-brand-orange font-inter text-[11.5px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-3 border border-orange-200">
              Our Advantage
            </span>
            <h2 className="font-poppins font-bold text-[clamp(22px,3vw,30px)] text-gray-900 mb-2.5">
              Why Choose <span className="text-brand-orange">SSS?</span>
            </h2>
            <p className="font-inter text-[14px] text-gray-500 leading-relaxed mb-8">
              We are committed to providing the best insurance solutions with trust, transparency and timely support.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="group relative bg-gray-50 rounded-xl p-[18px] border-[1.5px] border-gray-200 overflow-hidden transition-all duration-500 ease-smooth hover:border-brand-orange hover:bg-white hover:shadow-[0_4px_16px_rgba(255,107,0,0.08)]"
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-[0.14] group-hover:opacity-[0.22] transition-opacity duration-600 pointer-events-none"
                  style={{ backgroundImage: `url(${f.bgImage})` }}
                />
                <div className="relative z-10">
                  <div className="mb-2.5">
                    <f.Icon size={22} color={f.iconColor} strokeWidth={1.8} />
                  </div>
                  <div className="font-poppins font-semibold text-[13.5px] text-gray-900 mb-1.5">{f.title}</div>
                  <p className="font-inter text-[12.5px] text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
