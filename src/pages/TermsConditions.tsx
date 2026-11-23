import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { SITE_NAME, CONTACT, COMPANY } from '../config'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EASE: any = [0.22, 1, 0.36, 1]

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: [
      'By accessing and using the website of SSS Risk Management and Insurance Brokers Private Limited ("SSS", "we", "us", or "our"), you agree to be bound by these Terms and Conditions.',
      'If you do not agree with any part of these terms, please do not use our website or services.',
      'We reserve the right to update these Terms and Conditions at any time. Continued use of our website constitutes acceptance of the updated terms.',
    ],
  },
  {
    title: '2. About SSS Risk Management',
    content: [
      `${COMPANY.fullName} is an IRDAI Certified Direct Broker licensed under License No. ${COMPANY.irdaiLicense}.`,
      `Broker License No.: ${COMPANY.brokerLicenseNo} | License Period: ${COMPANY.licensePeriod}`,
      `CIN: ${COMPANY.cin} | GST: ${COMPANY.gst}`,
      `Principal Officer: ${COMPANY.principalOfficer}`,
      'We act as an intermediary between insurance seekers and IRDAI-registered insurance companies.',
    ],
  },
  {
    title: '3. Services',
    content: [
      'SSS provides insurance brokerage services including policy comparison, advisory, and claim assistance.',
      'We do not underwrite insurance policies. All policies are issued by IRDAI-registered insurance companies.',
      'The information provided on this website is for general informational purposes and does not constitute financial or legal advice.',
      'Insurance coverage is subject to the terms and conditions of the respective insurance company\'s policy document.',
      'Premium amounts, coverage details, and policy terms displayed are indicative and may vary at the time of actual policy issuance.',
    ],
  },
  {
    title: '4. User Responsibilities',
    content: [
      'You must provide accurate, complete, and truthful information when using our services or submitting forms.',
      'You are responsible for maintaining the confidentiality of any account credentials.',
      'You must not use our website for any unlawful purpose or in violation of applicable laws and regulations.',
      'You must not attempt to gain unauthorized access to any part of our website or systems.',
      'Any misrepresentation of information may result in policy cancellation or claim rejection by the insurer.',
    ],
  },
  {
    title: '5. Insurance Disclaimer',
    content: [
      'Insurance is the subject matter of solicitation.',
      'Visitors are hereby informed that their information submitted on the website may be shared with insurers.',
      'The product information for comparison displayed on this website is of the insurers with whom our company has an agreement.',
      'Product information is authentic and solely based on the information received from the Insurer.',
      'Past performance of any insurance product does not guarantee future results.',
      'Please read the policy documents carefully before purchasing any insurance product.',
    ],
  },
  {
    title: '6. Intellectual Property',
    content: [
      'All content on this website including text, graphics, logos, images, and software is the property of SSS Risk Management or its content suppliers.',
      'You may not reproduce, distribute, or create derivative works without our express written permission.',
      'The SSS logo and brand name are registered trademarks and may not be used without authorization.',
    ],
  },
  {
    title: '7. Limitation of Liability',
    content: [
      'SSS shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of our website or services.',
      'We do not guarantee the accuracy, completeness, or timeliness of information provided on our website.',
      'SSS is not responsible for the actions, decisions, or policies of insurance companies.',
      'Our liability in any event shall be limited to the amount of brokerage fees received in the relevant transaction.',
    ],
  },
  {
    title: '8. Third-Party Links',
    content: [
      'Our website may contain links to insurance company portals and other third-party websites.',
      'These links are provided for convenience only and do not constitute an endorsement.',
      'SSS has no control over the content or practices of third-party websites.',
      'We are not responsible for the privacy practices, accuracy, or availability of linked websites.',
    ],
  },
  {
    title: '9. Claims Assistance',
    content: [
      'SSS provides claim assistance services as a facilitator between the policyholder and the insurance company.',
      'Final claim settlement decisions are made solely by the insurance company.',
      'SSS does not guarantee claim approval or settlement amounts.',
      'Timelines for claim settlement are determined by the insurance company as per IRDAI regulations.',
    ],
  },
  {
    title: '10. Privacy',
    content: [
      'Your use of our website is also governed by our Privacy Policy, which is incorporated into these Terms by reference.',
      'Please review our Privacy Policy to understand our practices regarding collection and use of your information.',
    ],
  },
  {
    title: '11. Governing Law',
    content: [
      'These Terms and Conditions shall be governed by and construed in accordance with the laws of India.',
      'Any disputes arising from these terms shall be subject to the exclusive jurisdiction of courts in Ahmedabad, Gujarat.',
      'These terms are subject to applicable IRDAI regulations and insurance laws of India.',
    ],
  },
  {
    title: '12. Grievance Redressal',
    content: [
      `Principal Officer: ${COMPANY.principalOfficer}`,
      `Email: ${CONTACT.email}`,
      `Phone: ${CONTACT.phone}`,
      `Address: ${CONTACT.addressOneLine}`,
      'If you are not satisfied with our response, you may approach IRDAI\'s Integrated Grievance Management System (IGMS) at www.igms.irda.gov.in.',
    ],
  },
  {
    title: '13. Contact Us',
    content: [
      'For any questions regarding these Terms and Conditions, please contact us:',
      `${COMPANY.fullName}`,
      `${CONTACT.addressOneLine}`,
      `Email: ${CONTACT.email}`,
      `Phone: ${CONTACT.phone}`,
    ],
  },
]

export default function TermsConditions() {
  return (
    <>
      <style>{`
        @keyframes sssLogoSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
      <Helmet>
        <title>Terms & Conditions | {SITE_NAME}</title>
        <meta name="description" content="Terms and Conditions of SSS Risk Management & Insurance Brokers. Read our terms of service, insurance disclaimer, and user responsibilities." />
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
              Terms &
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-5">
            <motion.h1 className="font-poppins font-extrabold text-[clamp(28px,4vw,46px)] text-brand-orange"
              initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.2, duration: 0.7, ease: EASE }}>
              Conditions
            </motion.h1>
          </div>
          <motion.p className="font-inter text-[15px] text-gray-500 leading-relaxed max-w-[520px] mx-auto"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.55, ease: EASE }}>
            Last updated: January 2025. Please read these terms carefully before using our services.
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
              These Terms and Conditions govern your use of the website and services of <strong className="text-brand-orange">{COMPANY.fullName}</strong>, an IRDAI Certified Direct Broker. By using our website, you agree to comply with and be bound by the following terms.
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

          {/* Links to other legal pages */}
          <motion.div className="flex flex-wrap gap-4 justify-center mt-10"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE }}>
            <Link to="/privacy-policy" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1B2A4A] border-2 border-[#1B2A4A] rounded-xl font-poppins font-bold text-[13px] no-underline hover:bg-[#1B2A4A] hover:text-white hover:-translate-y-1 transition-all">
              Privacy Policy
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-xl font-poppins font-bold text-[13px] no-underline hover:bg-brand-orange-dark hover:-translate-y-1 transition-all">
              Contact Us →
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
