import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { SITE_NAME, CONTACT, COMPANY } from '../config'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EASE: any = [0.22, 1, 0.36, 1]

const sections = [
  {
    title: '1. Information We Collect',
    content: [
      'Personal identification information: Name, phone number, email address, city.',
      'Insurance-related information: Type of insurance required, existing policy details, claim information.',
      'Usage data: Pages visited, time spent, browser type, IP address (collected automatically).',
      'Communication data: Messages sent via contact forms, WhatsApp, or email.',
    ],
  },
  {
    title: '2. How We Use Your Information',
    content: [
      'To provide insurance quotes, policy comparisons, and advisory services.',
      'To process claim requests and coordinate with insurance companies on your behalf.',
      'To respond to your enquiries and provide customer support.',
      'To send relevant insurance updates, renewal reminders, and policy information.',
      'To improve our website and services based on usage patterns.',
      'To comply with legal and regulatory obligations under IRDAI guidelines.',
    ],
  },
  {
    title: '3. Information Sharing',
    content: [
      'Insurance companies: We share your information with IRDAI-registered insurance companies to obtain quotes and process policies on your behalf.',
      'Regulatory authorities: We may disclose information as required by IRDAI, SEBI, or other applicable regulatory bodies.',
      'Service providers: Trusted third-party service providers who assist in operating our website and services, subject to confidentiality agreements.',
      'We do not sell, rent, or trade your personal information to any third party for marketing purposes.',
    ],
  },
  {
    title: '4. Data Security',
    content: [
      'We implement appropriate technical and organizational measures to protect your personal information.',
      'All data transmissions are encrypted using industry-standard SSL/TLS protocols.',
      'Access to personal data is restricted to authorized personnel only.',
      'We regularly review and update our security practices to maintain data protection standards.',
    ],
  },
  {
    title: '5. Cookies',
    content: [
      'Our website uses cookies to enhance your browsing experience and analyze website traffic.',
      'Essential cookies: Required for the website to function properly.',
      'Analytics cookies: Help us understand how visitors interact with our website.',
      'You can control cookie settings through your browser preferences. Disabling cookies may affect website functionality.',
    ],
  },
  {
    title: '6. Your Rights',
    content: [
      'Access: You have the right to request a copy of the personal information we hold about you.',
      'Correction: You can request correction of inaccurate or incomplete personal information.',
      'Deletion: You can request deletion of your personal information, subject to legal and regulatory requirements.',
      'Objection: You can object to the processing of your personal information for marketing purposes.',
      'To exercise these rights, please contact us at ' + CONTACT.email,
    ],
  },
  {
    title: '7. Data Retention',
    content: [
      'We retain your personal information for as long as necessary to provide our services and comply with legal obligations.',
      'Insurance-related records are retained as required by IRDAI regulations and applicable insurance laws.',
      'You may request deletion of your data at any time, subject to legal and regulatory requirements.',
    ],
  },
  {
    title: '8. Third-Party Links',
    content: [
      'Our website may contain links to third-party websites, including insurance company portals.',
      'We are not responsible for the privacy practices or content of third-party websites.',
      'We encourage you to review the privacy policies of any third-party websites you visit.',
    ],
  },
  {
    title: '9. Children\'s Privacy',
    content: [
      'Our services are not directed to individuals under the age of 18.',
      'We do not knowingly collect personal information from minors.',
      'If you believe a minor has provided us with personal information, please contact us immediately.',
    ],
  },
  {
    title: '10. Changes to This Policy',
    content: [
      'We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.',
      'We will notify you of significant changes by posting the updated policy on our website.',
      'Your continued use of our website after changes constitutes acceptance of the updated policy.',
    ],
  },
  {
    title: '11. Contact Us',
    content: [
      `For any privacy-related queries or to exercise your rights, please contact us:`,
      `${COMPANY.fullName}`,
      `Address: ${CONTACT.addressOneLine}`,
      `Email: ${CONTACT.email}`,
      `Phone: ${CONTACT.phone}`,
    ],
  },
]

export default function PrivacyPolicy() {
  return (
    <>
      <style>{`
        @keyframes sssLogoSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
      <Helmet>
        <title>Privacy Policy | {SITE_NAME}</title>
        <meta name="description" content="Privacy Policy of SSS Risk Management & Insurance Brokers. Learn how we collect, use, and protect your personal information." />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-20">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,107,0,0.18) 0%, rgba(255,160,60,0.10) 18%, rgba(255,255,255,0.98) 40%, rgba(255,255,255,1) 50%, rgba(220,245,225,0.85) 72%, rgba(46,125,50,0.20) 100%)' }} />
        <div className="absolute top-[-60px] left-[-60px] w-[320px] h-[320px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.14) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-80px] right-[-80px] w-[380px] h-[380px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(46,125,50,0.14) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-white pointer-events-none z-10" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <img src="/assets/sss.png" alt="" className="w-[360px] h-[360px] object-contain" style={{ opacity: 0.07, animation: 'sssLogoSpin 20s linear infinite' }} />
        </div>
        <div className="relative z-20 text-center px-6 max-w-[720px] mx-auto">
          <motion.span className="inline-block bg-orange-50/80 text-brand-orange font-inter text-[11px] font-bold tracking-[1.5px] uppercase px-3.5 py-1.5 rounded-full mb-4 border border-orange-200"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
            Legal
          </motion.span>
          <div className="overflow-hidden mb-1">
            <motion.h1 className="font-poppins font-extrabold text-[clamp(28px,4vw,46px)] text-[#1B2A4A]"
              initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.1, duration: 0.7, ease: EASE }}>
              Privacy
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-5">
            <motion.h1 className="font-poppins font-extrabold text-[clamp(28px,4vw,46px)] text-brand-orange"
              initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.2, duration: 0.7, ease: EASE }}>
              Policy
            </motion.h1>
          </div>
          <motion.p className="font-inter text-[15px] text-gray-500 leading-relaxed max-w-[520px] mx-auto"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.55, ease: EASE }}>
            Last updated: January 2025. This policy explains how we collect, use, and protect your personal information.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-14 bg-white">
        <div className="max-w-[860px] mx-auto px-6">

          {/* Intro */}
          <motion.div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mb-10"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE }}>
            <p className="font-inter text-[14px] text-gray-700 leading-relaxed">
              <strong className="text-brand-orange">{COMPANY.fullName}</strong> ("SSS", "we", "us", or "our") is an IRDAI Certified Direct Broker (License No. {COMPANY.irdaiLicense}) committed to protecting your privacy. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
          </motion.div>

          {/* Sections */}
          {sections.map((s, i) => (
            <motion.div key={s.title} className="mb-10"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.6, ease: EASE }}>
              <h2 className="font-poppins font-bold text-[18px] text-[#1B2A4A] mb-4 pb-2 border-b border-gray-100">{s.title}</h2>
              <ul className="flex flex-col gap-2.5">
                {s.content.map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5 font-inter text-[14px] text-gray-600 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-orange flex-shrink-0 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* IRDAI notice */}
          <motion.div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mt-10"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE }}>
            <p className="font-inter text-[13px] text-gray-500 leading-relaxed text-center">
              Insurance is the subject matter of solicitation. Visitors are hereby informed that their information submitted on the website may be shared with insurers. The product information for comparison displayed on this website is of the insurers with whom our company has an agreement. Product information is authentic and solely based on the information received from the Insurer.
            </p>
          </motion.div>

          <div className="mt-10 text-center">
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-xl font-poppins font-bold text-[13px] no-underline hover:bg-brand-orange-dark hover:-translate-y-1 transition-all">
              Contact Us for Privacy Queries →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
