import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ScrollToTop from './components/layout/ScrollToTop'
import PageLoader from './components/ui/PageLoader'
import { useHashScroll } from './hooks/useHashScroll'
import { Suspense, lazy } from 'react'

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const OurStory = lazy(() => import('./pages/OurStory'))
const OurTeam = lazy(() => import('./pages/OurTeam'))
const Contact = lazy(() => import('./pages/Contact'))
const Claims = lazy(() => import('./pages/Claims'))
const POSP = lazy(() => import('./pages/POSP'))
const Career = lazy(() => import('./pages/Career'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Products = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const GetQuote = lazy(() => import('./pages/GetQuote'))
const NotFound = lazy(() => import('./pages/NotFound'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsConditions = lazy(() => import('./pages/TermsConditions'))

export default function App() {
  useHashScroll()
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/about/story" element={<OurStory />} />
            <Route path="/about/team" element={<OurTeam />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/claims" element={<Claims />} />
            <Route path="/become-a-posp" element={<POSP />} />
            <Route path="/career" element={<Career />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/get-quote" element={<GetQuote />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
