import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EASE: any = [0.22, 1, 0.36, 1]

const navLinks = [
  { label: 'Home', href: '/' },
  {
    label: 'About Us', href: '/about',
    children: [
      { label: 'Our Story', href: '/about/story' },
      { label: 'Our Team',  href: '/about/team'  },
    ],
  },
  { label: 'Products', href: '/products' },
  { label: 'Claims',   href: '/claims'   },
  { label: 'Gallery',  href: '/gallery'  },
  { label: 'Contact',  href: '/contact'  },
]

export default function Navbar() {
  const [scrolled,        setScrolled]        = useState(false)
  const [mobileOpen,      setMobileOpen]      = useState(false)
  const [activeDropdown,  setActiveDropdown]  = useState<string | null>(null)
  const [mobileExpanded,  setMobileExpanded]  = useState<string | null>(null)
  const location = useLocation()
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setActiveDropdown(null)
    setMobileExpanded(null)
  }, [location.pathname])

  const handleMouseEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setActiveDropdown(label)
  }
  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 200)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className={`fixed top-0 left-0 right-0 z-[1000] bg-white transition-shadow duration-700 ease-smooth ${
          scrolled ? 'shadow-apple' : ''
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0 ml-4 lg:ml-8">
            <img src="/assets/sss_logo.png" alt="SSS Logo" className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 object-contain" />
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center list-none m-0 p-0">
            {navLinks.map((item) => (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to={item.href}
                  className={`flex items-center gap-1 px-3 font-inter text-[13.5px] font-medium h-20 transition-colors duration-500 ease-smooth whitespace-nowrap ${
                    location.pathname === item.href || location.pathname.startsWith(item.href + '/')
                      ? 'text-brand-orange'
                      : 'text-gray-700 hover:text-brand-orange'
                  }`}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown
                      size={13}
                      className={`text-gray-400 transition-transform duration-500 ease-smooth ${
                        activeDropdown === item.label ? 'rotate-180 text-brand-orange' : ''
                      }`}
                    />
                  )}
                </Link>

                <AnimatePresence>
                  {item.children && activeDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0,   scale: 1    }}
                      exit={{    opacity: 0, y: -10, scale: 0.96 }}
                      transition={{ duration: 0.65, ease: EASE }}
                      className="absolute top-full left-0 pt-2 min-w-[210px] z-[200]"
                      onMouseEnter={() => handleMouseEnter(item.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="bg-white rounded-xl shadow-apple-lg py-1.5 border border-gray-100">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.href}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center gap-2 px-4 py-2.5 font-inter text-[13px] text-gray-700 transition-all duration-500 ease-smooth hover:bg-orange-50 hover:text-brand-orange hover:pl-5 group whitespace-nowrap"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0 group-hover:bg-brand-orange transition-colors duration-500 ease-smooth" />
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>

          {/* CTA buttons */}
          <div className="hidden lg:flex items-center gap-2.5 flex-shrink-0">
            <Link
              to="/become-a-posp"
              className="px-4 py-2 bg-transparent text-brand-blue rounded-lg font-poppins font-semibold text-[12px] border-[1.5px] border-brand-blue transition-all duration-500 ease-smooth whitespace-nowrap hover:bg-brand-blue hover:text-white"
            >
              BECOME A POSP
            </Link>
            <Link
              to="/get-quote"
              className="px-4 py-2 bg-brand-orange text-white rounded-lg font-poppins font-semibold text-[12px] border-[1.5px] border-brand-orange transition-all duration-500 ease-smooth whitespace-nowrap hover:bg-brand-orange-dark hover:border-brand-orange-dark"
            >
              GET A QUOTE
            </Link>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            className="lg:hidden flex flex-col gap-1.5 cursor-pointer p-1.5 bg-transparent border-none"
          >
            {[
              mobileOpen ? { y: 7,  rotate: 45  } : { y: 0, rotate: 0 },
              mobileOpen ? { opacity: 0          } : { opacity: 1      },
              mobileOpen ? { y: -7, rotate: -45 } : { y: 0, rotate: 0 },
            ].map((anim, idx) => (
              <motion.span
                key={idx}
                animate={anim}
                transition={{ duration: 0.75, ease: EASE }}
                className="block bg-brand-blue rounded-sm"
                style={{ width: 22, height: 2 }}
              />
            ))}
          </button>
        </div>
      </motion.nav>

      {/* Tricolor stripe */}
      <div className="fixed top-20 left-0 right-0 z-[1001] flex flex-col h-[10px] pointer-events-none">
        <div className="h-1   bg-brand-orange" />
        <div className="h-0.5 bg-white"        />
        <div className="h-1   bg-brand-green"  />
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{    opacity: 0, height: 0      }}
            transition={{ duration: 0.75, ease: EASE }}
            className="fixed top-[80px] left-0 right-0 bg-white shadow-apple-lg z-[999] overflow-hidden border-t border-gray-100"
            style={{ maxHeight: 'calc(100vh - 80px)', overflowY: 'auto' }}
          >
            {navLinks.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <div className="flex items-center border-b border-gray-50">
                      <Link
                        to={item.href}
                        className={`flex-1 px-6 py-3.5 font-inter text-[14.5px] font-medium transition-all duration-500 ease-smooth ${
                          location.pathname === item.href ? 'text-brand-orange bg-orange-50' : 'text-gray-700'
                        }`}
                      >
                        {item.label}
                      </Link>
                      <button
                        onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                        className="px-4 py-3.5 bg-transparent border-l border-gray-100 cursor-pointer hover:bg-orange-50 transition-colors duration-500 ease-smooth"
                      >
                        <ChevronDown
                          size={14}
                          className={`text-gray-400 transition-transform duration-500 ${
                            mobileExpanded === item.label ? 'rotate-180 text-brand-orange' : ''
                          }`}
                        />
                      </button>
                    </div>
                    <AnimatePresence>
                      {mobileExpanded === item.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{    height: 0, opacity: 0      }}
                          transition={{ duration: 0.7, ease: EASE }}
                          className="bg-gray-50 border-b border-gray-100 overflow-hidden"
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              to={child.href}
                              className="block px-6 py-2.5 pl-9 font-inter text-[13px] text-gray-500 border-b border-gray-100 last:border-b-0 transition-all duration-500 ease-smooth hover:text-brand-orange hover:bg-orange-50"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className={`flex items-center px-6 py-3.5 font-inter text-[14.5px] font-medium border-b border-gray-50 transition-all duration-500 ease-smooth ${
                      location.pathname === item.href
                        ? 'text-brand-orange bg-orange-50'
                        : 'text-gray-700 hover:text-brand-orange hover:bg-orange-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="flex gap-2.5 p-4">
              <Link to="/become-a-posp" className="flex-1 text-center px-4 py-2 bg-transparent text-brand-blue rounded-lg font-poppins font-semibold text-[12px] border-[1.5px] border-brand-blue transition-all duration-500 ease-smooth hover:bg-brand-blue hover:text-white">
                BECOME A POSP
              </Link>
              <Link to="/get-quote" className="flex-1 text-center px-4 py-2 bg-brand-orange text-white rounded-lg font-poppins font-semibold text-[12px] transition-all duration-500 ease-smooth hover:bg-brand-orange-dark">
                GET A QUOTE
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-[80px]" />
    </>
  )
}
