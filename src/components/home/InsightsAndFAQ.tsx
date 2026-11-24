import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const blogs = [
  {
    id: 1,
    title: 'What is Life Insurance and Why Do You Need It?',
    excerpt: "Life insurance provides financial protection to your family in case of your untimely demise. Learn why it's essential for every earning member.",
    date: 'May 20, 2024',
    readTime: '4 min read',
    category: 'Life Insurance',
    img: '/assets/HomeAsset/life_insurance_thumbnail_280x220.jpg',
  },
  {
    id: 2,
    title: 'How Does Health Insurance Work in India?',
    excerpt: 'Understanding your health insurance policy is crucial. We break down coverage, premiums, claims and everything you need to know.',
    date: 'May 18, 2024',
    readTime: '5 min read',
    category: 'Health Insurance',
    img: '/assets/HomeAsset/health_insurance_thumbnail_280x220.jpg',
  },
  {
    id: 3,
    title: '5 Things to Check Before Buying Insurance Policy',
    excerpt: "Don't just buy any policy — know what to look for. Coverage amount, exclusions, claim ratio and more explained simply.",
    date: 'May 17, 2024',
    readTime: '3 min read',
    category: 'Buying Guide',
    img: '/assets/HomeAsset/buying_guide_thumbnail_280x220.jpg',
  },
]

const faqs = [
  { q: 'What is an insurance broker?', a: 'An insurance broker acts as an intermediary between you and insurance companies, helping you find the best coverage at the right price.' },
  { q: 'How can I get an insurance quote?', a: 'Click "Get A Quote" on our website, call us directly, or visit our office. Our experts will guide you through the best options.' },
  { q: 'What types of insurance do you offer?', a: 'Motor, Health, Life, Home, Travel, Commercial insurance and Surety Bonds.' },
  { q: 'How does the claims process work?', a: 'Report your claim to us, submit required documents, and our team handles everything until settlement.' },
  { q: 'How can I contact SSS?', a: 'Call +91 6352 946 430, email customercare@sssriskmanagement.com, or use our contact form. Mon–Sat, 10AM–6PM.' },
]

export default function InsightsAndFAQ() {
  const [open, setOpen] = useState<number | null>(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-[72px] bg-white" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 items-start">

        {/* Insights */}
        <div>
          <motion.div
            className="flex items-center justify-between mb-7 flex-wrap gap-3"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          >
            <div>
              <h2 className="font-poppins font-bold text-[clamp(18px,2.5vw,24px)] text-gray-900">
                Insurance <span className="text-brand-orange">Insights</span>
              </h2>
              <p className="font-inter text-[13px] text-gray-500 mt-1">Stay informed with our latest articles and tips on insurance.</p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 border-[1.5px] border-brand-orange rounded-lg font-poppins font-semibold text-[12.5px] text-brand-orange no-underline transition-all hover:bg-brand-orange hover:text-white whitespace-nowrap"
            >
              CONTACT US →
            </Link>
          </motion.div>

          <div className="flex flex-col gap-4">
            {blogs.map((b, i) => (
              <motion.div
                key={b.id}
                className="group grid overflow-hidden bg-white border-[1.5px] border-gray-200 rounded-xl transition-all duration-500 ease-smooth hover:border-brand-orange hover:shadow-[0_6px_20px_rgba(255,107,0,0.10)] hover:translate-x-1"
                style={{ gridTemplateColumns: 'clamp(90px, 22%, 140px) 1fr', minHeight: 120 }}
                initial={{ opacity: 0, x: -24 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
              >
                <div className="overflow-hidden">
                  <img src={b.img} alt={b.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-inter text-[10.5px] font-bold uppercase tracking-wide text-brand-orange bg-orange-50 px-2 py-0.5 rounded-full">{b.category}</span>
                    <span className="font-inter text-[11px] text-gray-400">{b.date}</span>
                    <span className="text-gray-300 text-[10px]">•</span>
                    <span className="font-inter text-[11px] text-gray-400">{b.readTime}</span>
                  </div>
                  <div className="font-poppins font-semibold text-[14.5px] text-gray-900 leading-tight mb-1.5">{b.title}</div>
                  <p className="font-inter text-[12.5px] text-gray-500 leading-relaxed line-clamp-2">{b.excerpt}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <motion.h2
            className="font-poppins font-bold text-[clamp(18px,2.5vw,24px)] text-gray-900 mb-6"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          >
            Frequently Asked <span className="text-brand-orange">Questions</span>
          </motion.h2>

          <div className="flex flex-col gap-2">
            {faqs.map((f, i) => (
              <motion.div
                key={i}
                className={`border-[1.5px] rounded-xl overflow-hidden transition-colors duration-500 ease-smooth ${open === i ? 'border-brand-orange' : 'border-gray-200'}`}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.75, ease: [0.22, 1, 0.36, 1] as any }}
              >
                <button
                  className="w-full flex items-center justify-between px-4 py-3.5 cursor-pointer bg-white hover:bg-orange-50 transition-colors text-left gap-2.5"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="font-poppins font-medium text-[13px] text-gray-900 leading-snug">{f.q}</span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ease-smooth ${open === i ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <ChevronDown size={13} className={`transition-transform duration-500 ${open === i ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-3.5 pt-2.5 font-inter text-[12.5px] text-gray-600 leading-relaxed border-t border-gray-100">
                        {f.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
