import { Link } from 'react-router-dom'
import { Linkedin, Facebook, Instagram } from 'lucide-react'
import { CONTACT, SOCIAL, COMPANY } from '../../config'

const servicesLinks = [
  { label: 'Individual Services', href: '/products#motor' },
  { label: 'Corporate Services', href: '/products#commercial' },
  { label: 'Employee Benefits', href: '/products#commercial' },
  { label: 'Liability Insurance', href: '/products#commercial' },
  { label: 'Credit Insurance', href: '/products#commercial' },
]
const infoLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Career', href: '/career' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white text-[#1a2e4a] pt-14">

      {/* Main grid */}
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.6fr] gap-10">

        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-2.5 no-underline mb-4">
            <img src="/assets/sss.png" alt="SSS Logo" className="w-16 h-16 object-contain flex-shrink-0" />
            <div className="font-poppins font-bold text-[12px] text-[#1a2e4a] leading-snug">
              S S S<br />Risk Management &<br />Insurance Brokers<br />Pvt. Ltd.
            </div>
          </Link>
          <div className="flex gap-2.5 mt-4">
            {[
              { href: SOCIAL.facebook, Icon: Facebook, label: 'Facebook' },
              { href: SOCIAL.instagram, Icon: Instagram, label: 'Instagram' },
              { href: SOCIAL.linkedin, Icon: Linkedin, label: 'LinkedIn' },
            ].map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 no-underline transition-all duration-500 ease-smooth hover:bg-brand-orange hover:text-white hover:-translate-y-1"
              >
                <Icon size={18} strokeWidth={1.8} />
              </a>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <div className="font-poppins font-bold text-[14.5px] text-gray-900 mb-4">Services</div>
          <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
            {servicesLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.href} className="font-inter text-[13px] text-brand-orange no-underline transition-colors hover:text-[#1a2e4a]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Information */}
        <div>
          <div className="font-poppins font-bold text-[14.5px] text-gray-900 mb-4">Information</div>
          <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
            {infoLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.href} className="font-inter text-[13px] text-brand-orange no-underline transition-colors hover:text-[#1a2e4a]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Corporate Address */}
        <address style={{ fontStyle: 'normal' }}>
          <div className="font-poppins font-bold text-[14.5px] text-gray-900 mb-3">Corporate Address</div>
          <p className="font-inter text-[13px] text-gray-600 leading-relaxed mb-2.5 break-words">
            1007 to 1009, Altimus,<br />
            Behind Sales India,<br />
            Ashram Road, Ahmedabad,<br />
            Gujarat - 380009.
          </p>
          <p className="font-inter text-[13px] text-gray-600 mb-2">
            <a href={CONTACT.phoneHref} className="no-underline text-gray-600 hover:text-brand-orange transition-colors">{CONTACT.phone}</a>
          </p>
          <p className="font-inter text-[13px] text-gray-600 break-all">
            <a href={`mailto:${CONTACT.email}`} className="no-underline text-gray-600 hover:text-brand-orange transition-colors">{CONTACT.email}</a>
          </p>
        </address>
      </div>

      {/* Disclaimer */}
      <div className="max-w-[1280px] mx-auto px-6 mt-10 mb-0">
        <p className="font-inter text-[12px] text-gray-400 leading-relaxed text-center">
          Insurance is the subject matter of solicitation. Visitors are hereby informed that their information submitted on the website may be shared with{' '}
          <span className="text-brand-orange">insurers</span>. The product information for comparison displayed on this website is of the insurers with whom our company has an agreement.
          Product information is authentic and solely based on the information received from the Insurer.
        </p>
      </div>

      {/* IRDA Info */}
      <div className="bg-gray-50 border-t border-gray-200 mt-5 px-6 py-5 text-center">
        <p className="font-inter text-[12px] text-gray-600 leading-[1.9]">
          IRDA License Number: {COMPANY.irdaiLicense} &nbsp;|&nbsp; Category: Direct Broker (Life &amp; General)<br />
          Insurance Broker License No: {COMPANY.brokerLicenseNo} &nbsp;|&nbsp; License Period: {COMPANY.licensePeriod}<br />
          CIN Number: {COMPANY.cin} &nbsp;|&nbsp; GST Number: {COMPANY.gst}<br />
          Principal Officer: {COMPANY.principalOfficer}
          <strong className="font-poppins font-bold text-[13.5px] text-[#1a2e4a] block mt-2">{COMPANY.fullName}</strong>
        </p>
      </div>

      {/* Bottom bar */}
      <div className="px-6 py-4 text-center">
        <p className="font-inter text-[12px] text-gray-400">
          © {COMPANY.foundedYear}–{currentYear} {COMPANY.shortName}. All rights reserved.
        </p>
      </div>

    </footer>
  )
}
