import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const partners = [
  { name: 'HDFC Ergo', img: '/assets/HomeAsset/partners/hdfc.webp' },
  { name: 'ICICI Lombard', img: '/assets/HomeAsset/partners/icici-lombard.webp' },
  { name: 'Bajaj Allianz', img: '/assets/HomeAsset/partners/bajaj.webp' },
  { name: 'SBI General', img: '/assets/HomeAsset/partners/sbi.webp' },
  { name: 'Tata AIA', img: '/assets/HomeAsset/partners/Tata-aia.jpg' },
  { name: 'Kotak', img: '/assets/HomeAsset/partners/kotak.webp' },
  { name: 'Digit', img: '/assets/HomeAsset/partners/digit.webp' },
  { name: 'New India', img: '/assets/HomeAsset/partners/new-india.webp' },
  { name: 'Star Health', img: '/assets/HomeAsset/partners/star-health.png' },
  { name: 'HDFC Life', img: '/assets/HomeAsset/partners/HDFC-Life.png' },
  { name: 'LIC', img: '/assets/HomeAsset/partners/LIC-Logo.jpg' },
  { name: 'Care', img: '/assets/HomeAsset/partners/care.webp' },
]

export default function PartnersSection() {
  const looped = [...partners, ...partners]
  const trackRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const dragStartScroll = useRef(0)
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [autoplay, setAutoplay] = useState(true)

  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const step = () => {
      if (autoplay && !isDragging.current) {
        el.scrollLeft += 0.6
        if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft -= el.scrollWidth / 2
      }
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [autoplay])

  const pauseThenResume = () => {
    setAutoplay(false)
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
    resumeTimer.current = setTimeout(() => setAutoplay(true), 1500)
  }

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true
    setAutoplay(false)
    dragStartX.current = e.pageX
    dragStartScroll.current = trackRef.current!.scrollLeft
    trackRef.current!.style.cursor = 'grabbing'
  }
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return
    e.preventDefault()
    trackRef.current!.scrollLeft = dragStartScroll.current - (e.pageX - dragStartX.current)
  }
  const endDrag = () => {
    if (!isDragging.current) return
    isDragging.current = false
    trackRef.current!.style.cursor = 'grab'
    pauseThenResume()
  }
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    isDragging.current = true
    setAutoplay(false)
    dragStartX.current = e.touches[0].pageX
    dragStartScroll.current = trackRef.current!.scrollLeft
  }
  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging.current) return
    e.preventDefault()
    trackRef.current!.scrollLeft = dragStartScroll.current - (e.touches[0].pageX - dragStartX.current)
  }
  const onTouchEnd = () => { isDragging.current = false; pauseThenResume() }

  return (
    <section className="py-14 px-6 bg-white" ref={ref}>
      <motion.div
        className="text-center max-w-[640px] mx-auto mb-10"
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
      >
        <span className="inline-block bg-orange-50 text-brand-orange font-inter text-[11.5px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-4 border border-orange-200">
          WE WORK WITH
        </span>
        <h2 className="font-poppins font-bold text-[clamp(20px,2.5vw,28px)] text-gray-900 mb-2.5">
          Our Trusted Insurance <span className="text-brand-orange">Partners</span>
        </h2>
        <p className="font-inter text-[14px] text-gray-500 leading-relaxed">
          We partner with India's leading insurance companies to bring you the best options.
        </p>
      </motion.div>

      {/* Carousel */}
      <div
        className="overflow-hidden w-full max-w-[1100px] mx-auto"
        style={{ WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)', maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)' }}
      >
        <div
          ref={trackRef}
          className="flex gap-5 overflow-x-scroll pb-3 pt-2 cursor-grab select-none"
          style={{ scrollbarWidth: 'none', touchAction: 'pan-y' }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {looped.map((p, i) => (
            <div
              key={i}
              title={p.name}
              className="flex-shrink-0 w-[190px] h-[110px] bg-white border-[1.5px] border-gray-200 rounded-2xl flex items-center justify-center p-4 shadow-sm transition-all duration-500 ease-smooth hover:border-brand-orange hover:shadow-apple hover:-translate-y-1"
              style={{ maxWidth: '190px', minWidth: '190px' }}
            >
              <img
                src={p.img}
                alt={p.name}
                loading="lazy"
                className="w-full h-full object-contain pointer-events-none"
                style={{ filter: 'grayscale(20%)' }}
              />
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
