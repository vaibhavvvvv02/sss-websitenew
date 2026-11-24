import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import LogoRollIn from '../ui/LogoRollIn'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EASE: any = [0.22, 1, 0.36, 1]

const trustBadges = [
  'Trusted by 25,000+ Customers',
  'IRDAI Direct Broker',
  '24/7 Customer Support',
]

export default function HeroSection() {
  return (
    <section className="bg-white pt-12 pb-10">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">

        {/* LEFT */}
        <div>
          {/* Brand row */}
          <div className="flex items-start gap-7 flex-wrap mb-7">
            {/* Logo roll-in — same animation as Products/OurStory pages */}
            <div className="-mt-4">
              <LogoRollIn size={140} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="overflow-hidden">
                <motion.h1
                  className="font-poppins font-extrabold text-[clamp(22px,2.6vw,34px)] leading-tight text-[#1B2A4A] mb-0"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
                >
                  SSS Risk Management
                </motion.h1>
              </div>
              <div className="overflow-hidden">
                <motion.h1
                  className="font-poppins font-extrabold text-[clamp(22px,2.6vw,34px)] leading-tight text-[#1B2A4A]"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
                >
                  &amp; Insurance Brokers Pvt Ltd
                </motion.h1>
              </div>
              <motion.p
                className="font-inter text-[14.5px] text-gray-700 mt-2.5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.75, ease: EASE }}
              >
                We are{' '}
                <span className="text-brand-orange font-semibold">IRDAI Certified Direct Broker</span>{' '}
                For Life &amp; General Insurance.
              </motion.p>
            </div>
          </div>

          {/* CTA Buttons */}
          <motion.div
            className="flex gap-3.5 flex-wrap mb-7"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.75, ease: EASE }}
          >
            <Link
              to="/get-quote"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-lg font-poppins font-semibold text-[13.5px] no-underline border-2 border-brand-orange transition-all duration-500 ease-smooth hover:bg-brand-orange-dark hover:border-brand-orange-dark hover:-translate-y-1 shadow-orange"
            >
              GET A QUOTE →
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-brand-blue border-2 border-brand-blue rounded-lg font-poppins font-semibold text-[13.5px] no-underline transition-all duration-500 ease-smooth hover:bg-brand-blue hover:text-white hover:-translate-y-1"
            >
              EXPLORE PRODUCTS
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            className="flex gap-5 flex-wrap"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.75, ease: EASE }}
          >
            {trustBadges.map((t) => (
              <div key={t} className="flex items-center gap-1.5 font-inter text-[12px] font-medium text-gray-600">
                <span className="w-2 h-2 rounded-full bg-brand-green flex-shrink-0" />
                {t}
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT: Hero image */}
        <motion.div
          className="hidden lg:flex justify-center items-center"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease: EASE }}
        >
          <div className="relative w-full max-w-[520px]">
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <img
              src="/assets/HomeAsset/sss_insurance_hero_hd.jpg"
              alt="SSS Insurance - Protecting your family, vehicle and business"
              className="w-full h-auto block"
            />
          </div>
        </motion.div>

      </div>
    </section>
  )
}
