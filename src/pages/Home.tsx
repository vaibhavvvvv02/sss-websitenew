import { Helmet } from 'react-helmet-async'
import HeroSection from '../components/home/HeroSection'
import InsuranceSolutions from '../components/home/InsuranceSolutions'
import StatsSection from '../components/home/StatsSection'
import WhyChooseUs from '../components/home/WhyChooseUs'
import HowItWorks from '../components/home/HowItWorks'
import FeaturedProducts from '../components/home/FeaturedProducts'
import PartnersSection from '../components/home/PartnersSection'
import ClaimsSection from '../components/home/ClaimsSection'
import TestimonialsSection from '../components/home/TestimonialsSection'
import InsightsAndFAQ from '../components/home/InsightsAndFAQ'
import CTABanner from '../components/home/CTABanner'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>SSS Risk Management & Insurance Brokers | IRDAI Certified Direct Broker</title>
        <meta name="description" content="SSS Risk Management — IRDAI Certified Direct Broker for Life & General Insurance. Motor, Health, Life, Home, Travel & Commercial Insurance. Trusted by 25,000+ customers." />
      </Helmet>
      <HeroSection />
      <InsuranceSolutions />
      <StatsSection />
      <WhyChooseUs />
      <HowItWorks />
      <FeaturedProducts />
      <PartnersSection />
      <ClaimsSection />
      <TestimonialsSection />
      <InsightsAndFAQ />
      <CTABanner />
    </>
  )
}
