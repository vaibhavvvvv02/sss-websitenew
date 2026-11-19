import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Home, Phone } from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EASE: any = [0.22, 1, 0.36, 1]

const quickLinks = [
  { label: 'Motor Insurance',  href: '/products#motor'  },
  { label: 'Health Insurance', href: '/products#health' },
  { label: 'Life Insurance',   href: '/products#life'   },
  { label: 'File a Claim',     href: '/claims'          },
  { label: 'Get a Quote',      href: '/get-quote'       },
]

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 – Page Not Found | SSS Risk Management</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-[88vh] bg-white flex flex-col items-center justify-center px-6 py-20 overflow-hidden relative font-inter">

        {/* Decorative BG blobs */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none translate-x-1/2 translate-y-1/2"
          style={{ background: 'radial-gradient(circle, rgba(46,125,50,0.08) 0%, transparent 70%)' }} />

        {/* 404 number */}
        <motion.div
          className="relative mb-6"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}>
          <div className="font-poppins font-extrabold text-[clamp(80px,18vw,160px)] text-gray-100 leading-none select-none">
            404
          </div>
          {/* Logo overlay on 0 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.img
              src="/assets/sss.png"
              alt="SSS Logo"
              className="w-20 h-20 object-contain"
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </motion.div>

        {/* Text */}
        <motion.div className="text-center max-w-[480px] mb-10 z-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: EASE }}>
          <h1 className="font-poppins font-extrabold text-[clamp(22px,3vw,32px)] text-gray-900 mb-3">
            Oops! Page Not Found
          </h1>
          <p className="font-inter text-[15px] text-gray-500 leading-relaxed">
            The page you're looking for has moved or doesn't exist. Let us help you find the right coverage.
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div className="flex gap-3.5 flex-wrap justify-center mb-12 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8, ease: EASE }}>
          <Link to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-xl font-poppins font-bold text-[13.5px] no-underline border-2 border-brand-orange transition-all hover:bg-brand-orange-dark hover:-translate-y-1 shadow-orange">
            <Home size={16} /> Go Home
          </Link>
          <Link to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-brand-blue border-2 border-brand-blue rounded-xl font-poppins font-bold text-[13.5px] no-underline transition-all hover:bg-brand-blue hover:text-white hover:-translate-y-1">
            <Phone size={16} /> Contact Us
          </Link>
        </motion.div>

        {/* Quick links */}
        <motion.div className="z-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.75 }}>
          <p className="font-inter text-[12.5px] text-gray-400 mb-4 uppercase tracking-widest font-semibold">Quick Links</p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {quickLinks.map((l) => (
              <Link key={l.label} to={l.href}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full font-inter text-[12.5px] text-gray-600 no-underline transition-all hover:border-brand-orange hover:text-brand-orange hover:bg-orange-50">
                {l.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  )
}
