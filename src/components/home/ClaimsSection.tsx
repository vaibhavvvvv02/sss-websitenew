import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { PhoneCall, FileText, Search, CheckCircle } from 'lucide-react'

const steps = [
  { num: '01', Icon: PhoneCall, title: 'Report Claim', desc: 'Inform us about the incident.', bgImage: '/assets/HomeAsset/report_claim_background.jpg', color: '#FF6B00' },
  { num: '02', Icon: FileText, title: 'Submit Details', desc: 'Share the required details & documents.', bgImage: '/assets/HomeAsset/submit_details_background.jpg', color: '#1a5276' },
  { num: '03', Icon: Search, title: 'Verification', desc: 'Our team verifies the information.', bgImage: '/assets/HomeAsset/verification_background.jpg', color: '#FF6B00' },
  { num: '04', Icon: CheckCircle, title: 'Claim Settlement', desc: 'We process and settle your claim.', bgImage: '/assets/HomeAsset/claim_settlement_background.jpg', color: '#2E7D32' },
]

export default function ClaimsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-[72px] bg-white" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6">

        {/* Top row */}
        <div className="flex items-end justify-between mb-10 gap-6 flex-wrap">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          >
            <span className="inline-block bg-orange-50 text-brand-orange font-inter text-[11.5px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-3 border border-orange-200">
              Easy Process
            </span>
            <h2 className="font-poppins font-bold text-[clamp(22px,3vw,30px)] text-gray-900 mb-2.5">
              We're With You When It <span className="text-brand-orange">Matters Most</span>
            </h2>
            <p className="font-inter text-[14px] text-gray-500 leading-relaxed max-w-[440px]">
              Our simplified claim process ensures quick support and hassle-free settlements.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          >
            <Link
              to="/claims"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-green text-white rounded-lg font-poppins font-semibold text-[13.5px] no-underline transition-all duration-500 ease-smooth hover:bg-green-800 hover:-translate-y-1 whitespace-nowrap flex-shrink-0"
            >
              SUBMIT YOUR CLAIM →
            </Link>
          </motion.div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              className="group relative bg-gray-50 border-[1.5px] border-gray-200 rounded-2xl p-6 text-center overflow-hidden transition-all duration-500 ease-smooth hover:border-brand-orange hover:bg-white hover:shadow-orange hover:-translate-y-1"
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
            >
              {/* Background */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-75 transition-opacity duration-600 pointer-events-none"
                style={{ backgroundImage: `url(${s.bgImage})` }}
              />
              <div className="relative z-10">
                <div className="font-poppins text-[11px] font-bold text-brand-orange uppercase tracking-widest mb-3">{s.num}</div>
                <div className="w-[52px] h-[52px] bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-3.5 border border-orange-200">
                  <s.Icon size={24} color={s.color} strokeWidth={1.8} />
                </div>
                <div className="font-poppins font-semibold text-[14px] text-gray-900 mb-2">{s.title}</div>
                <p className="font-inter text-[12.5px] text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
