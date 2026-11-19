import { useState, useEffect, useRef, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Images, Trophy, PartyPopper, Heart, Users, Calendar } from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EASE: any = [0.22, 1, 0.36, 1]

type Category = 'all' | 'events' | 'csr' | 'team' | 'awards'
interface GalleryItem { id: string; category: Exclude<Category,'all'>; title: string; img: string; date: string }

const items: GalleryItem[] = [
  { id:'e1', category:'events', title:'5th Foundation Day',         img:'/assets/gallery/Festival/10.jpg',  date:'01 Apr 2026' },
  { id:'e2', category:'events', title:'Independence Day',           img:'/assets/gallery/Festival/9.jpg',   date:'15 Aug 2024' },
  { id:'e3', category:'events', title:'Holi Festival',              img:'/assets/gallery/Festival/8.jpg',   date:'25 Mar 2024' },
  { id:'e4', category:'events', title:'Annual Day Function',        img:'/assets/gallery/Festival/7.jpg',   date:'28 Jan 2024' },
  { id:'e5', category:'events', title:'Diwali Pooja',               img:'/assets/gallery/Festival/6.jpg',   date:'12 Nov 2023' },
  { id:'e6', category:'events', title:'Navratri Celebration',       img:'/assets/gallery/Festival/5.jpg',   date:'20 Oct 2023' },
  { id:'e7', category:'events', title:'Festival Celebration',       img:'/assets/gallery/Festival/11.jpg',  date:'10 Oct 2023' },
  { id:'e8', category:'events', title:'Team Celebration',           img:'/assets/gallery/Festival/12.jpg',  date:'05 Sep 2023' },
  { id:'c1', category:'csr',    title:'Blood Donation Camp',        img:'/assets/gallery/scr/1.jpg',        date:'08 Mar 2024' },
  { id:'c2', category:'csr',    title:'Financial Literacy Drive',   img:'/assets/gallery/scr/2.jpg',        date:'20 Apr 2024' },
  { id:'c3', category:'csr',    title:'Tree Plantation Drive',      img:'/assets/gallery/scr/3.jpg',        date:'18 Jul 2024' },
  { id:'c4', category:'csr',    title:'Rural Awareness Program',    img:'/assets/gallery/scr/4.jpg',        date:'11 Feb 2024' },
  { id:'c5', category:'csr',    title:'Women Empowerment Workshop', img:'/assets/gallery/scr/5.jpg',        date:'22 Mar 2024' },
  { id:'c6', category:'csr',    title:'Old Age Home Visit',         img:'/assets/gallery/scr/6.jpg',        date:'25 Dec 2023' },
  { id:'c7', category:'csr',    title:'Community Health Camp',      img:'/assets/gallery/scr/7.jpg',        date:'14 Feb 2024' },
  { id:'c8', category:'csr',    title:'Education Support Drive',    img:'/assets/gallery/scr/8.jpg',        date:'05 Jan 2024' },
  { id:'t1', category:'team',   title:'Team Outing 2024',           img:'/assets/gallery/Our Team/1.jpg',   date:'12 May 2024' },
  { id:'t2', category:'team',   title:'Annual Strategy Meet',       img:'/assets/gallery/Our Team/4.jpg',   date:'22 Mar 2024' },
  { id:'t3', category:'team',   title:'Leadership Team',            img:'/assets/gallery/Our Team/5.jpg',   date:'22 Mar 2024' },
  { id:'t4', category:'team',   title:'Sales Kick-off',             img:'/assets/gallery/Our Team/6.jpg',   date:'10 Apr 2024' },
  { id:'t5', category:'team',   title:'Quarterly Awards',           img:'/assets/gallery/Our Team/7.jpg',   date:'28 Jun 2024' },
  { id:'t6', category:'team',   title:'Ahmedabad Branch Team',      img:'/assets/gallery/Our Team/8.jpg',   date:'14 Feb 2024' },
  { id:'t7', category:'team',   title:'Team Training Session',      img:'/assets/gallery/Our Team/9.jpg',   date:'12 Apr 2024' },
  { id:'t8', category:'team',   title:'Pan India Team Meet',        img:'/assets/gallery/Our Team/10.jpg',  date:'30 Jan 2024' },
  { id:'a1', category:'awards', title:'Corporate Awards - Gold',    img:'/assets/gallery/Awards/10.jpg',    date:'17 Feb 2024' },
  { id:'a2', category:'awards', title:'Best Broker Award 2024',     img:'/assets/gallery/Awards/11.png',    date:'30 May 2024' },
  { id:'a3', category:'awards', title:'Excellence in Broking',      img:'/assets/gallery/Awards/12.jpeg',   date:'15 Jun 2024' },
  { id:'a4', category:'awards', title:'POSP Training Session',      img:'/assets/gallery/Awards/15.jpeg',   date:'11 Jun 2024' },
  { id:'a5', category:'awards', title:'Industry Recognition',       img:'/assets/gallery/Awards/16.jpeg',   date:'20 Apr 2024' },
  { id:'a6', category:'awards', title:'Partner Award Ceremony',     img:'/assets/gallery/Awards/17.jpeg',   date:'08 Mar 2024' },
  { id:'a7', category:'awards', title:'Branch Excellence Award',    img:'/assets/gallery/Awards/18.jpeg',   date:'15 Jan 2024' },
  { id:'a8', category:'awards', title:'National Broker Award',      img:'/assets/gallery/Awards/19.jpeg',   date:'22 Dec 2023' },
]

const filterTabs: { value: Category; label: string; Icon: React.ElementType }[] = [
  { value:'all',    label:'All',                  Icon: Images     },
  { value:'events', label:'Events',               Icon: PartyPopper },
  { value:'csr',    label:'CSR Activities',       Icon: Heart      },
  { value:'team',   label:'Team Moments',         Icon: Users      },
  { value:'awards', label:'Awards & Achievements',Icon: Trophy     },
]

const galleryStats = [
  { value:'500+', label:'Photos'       },
  { value:'75+',  label:'Events'       },
  { value:'100+', label:'Team Members' },
  { value:'50+',  label:'CSR Activities'},
]

const PAGE_SIZE = 12

/* Lazy image */
function LazyImg({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { ref.current!.src = src; obs.disconnect() }
    }, { rootMargin: '200px' })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [src])
  return (
    <img ref={ref} alt={alt} className={className}
      style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.35s' }}
      onLoad={() => setLoaded(true)} />
  )
}

export default function GalleryPage() {
  const [active, setActive]     = useState<Category>('all')
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null)
  const [lbIndex, setLbIndex]   = useState(0)
  const [visible, setVisible]   = useState(PAGE_SIZE)

  const gridRef  = useRef(null)
  const statsRef = useRef(null)
  const gridInView  = useInView(gridRef,  { once: true, margin: '-60px' })
  const statsInView = useInView(statsRef, { once: true, margin: '-60px' })

  const filtered  = active === 'all' ? items : items.filter(i => i.category === active)
  const displayed = filtered.slice(0, visible)

  const changeFilter = useCallback((cat: Category) => { setActive(cat); setVisible(PAGE_SIZE) }, [])

  const openLightbox = (item: GalleryItem) => {
    setLbIndex(filtered.findIndex(i => i.id === item.id))
    setLightbox(item)
  }

  const prev = useCallback(() => {
    const ni = (lbIndex - 1 + filtered.length) % filtered.length
    setLbIndex(ni); setLightbox(filtered[ni])
  }, [lbIndex, filtered])

  const next = useCallback(() => {
    const ni = (lbIndex + 1) % filtered.length
    setLbIndex(ni); setLightbox(filtered[ni])
  }, [lbIndex, filtered])

  useEffect(() => { document.body.style.overflow = lightbox ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [lightbox])
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (!lightbox) return; if (e.key === 'Escape') setLightbox(null); if (e.key === 'ArrowLeft') prev(); if (e.key === 'ArrowRight') next() }
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h)
  }, [lightbox, prev, next])

  const touchStartX = useRef<number | null>(null)
  const onTouchStart = useCallback((e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }, [])
  const onTouchEnd   = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev()
    touchStartX.current = null
  }, [prev, next])

  return (
    <>
      <style>{`
        @keyframes sssLogoSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
      <Helmet>
        <title>Gallery | SSS Risk Management & Insurance Brokers</title>
        <meta name="description" content="Explore our gallery of events, CSR activities, team moments and award ceremonies." />
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-16 pb-20">
        <div className="absolute inset-0" style={{ background:'linear-gradient(135deg, rgba(255,107,0,0.18) 0%, rgba(255,160,60,0.10) 18%, rgba(255,255,255,0.98) 40%, rgba(255,255,255,1) 50%, rgba(220,245,225,0.85) 72%, rgba(46,125,50,0.20) 100%)' }} />
        <div className="absolute top-[-60px] left-[-60px] w-[320px] h-[320px] rounded-full pointer-events-none" style={{ background:'radial-gradient(circle, rgba(255,107,0,0.14) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-80px] right-[-80px] w-[380px] h-[380px] rounded-full pointer-events-none" style={{ background:'radial-gradient(circle, rgba(46,125,50,0.14) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-white pointer-events-none z-10" />
        {/* SSS logo watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <img src="/assets/sss.png" alt="" className="w-[480px] h-[480px] object-contain" style={{ opacity: 0.07, animation: 'sssLogoSpin 20s linear infinite' }} />
        </div>

        <div className="relative z-20 text-center px-6 max-w-[720px] mx-auto">
          <motion.span
            className="inline-block bg-orange-50/80 text-brand-orange font-inter text-[11px] font-bold tracking-[1.5px] uppercase px-3.5 py-1.5 rounded-full mb-4 border border-orange-200"
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, ease:EASE }}>
            OUR GALLERY
          </motion.span>
          <div className="overflow-hidden mb-1">
            <motion.h1 className="font-poppins font-extrabold text-[clamp(28px,4vw,46px)] text-[#1B2A4A]"
              initial={{ y:'110%' }} animate={{ y:0 }} transition={{ delay:0.1, duration:0.7, ease:EASE }}>
              Moments That
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-5">
            <motion.h1 className="font-poppins font-extrabold text-[clamp(28px,4vw,46px)] text-brand-orange"
              initial={{ y:'110%' }} animate={{ y:0 }} transition={{ delay:0.2, duration:0.7, ease:EASE }}>
              Matter
            </motion.h1>
          </div>
          <motion.p
            className="font-inter text-[15px] text-gray-500 leading-relaxed mb-8 max-w-[520px] mx-auto"
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35, duration:0.55, ease:EASE }}>
            A glimpse of our journey, events, celebrations, CSR activities, and the strong relationships we build every day.
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-3 justify-center"
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5, duration:0.5, ease:EASE }}>
            <button
              onClick={() => { changeFilter('events'); document.getElementById('gal-grid')?.scrollIntoView({ behavior:'smooth' }) }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-xl font-poppins font-bold text-[13.5px] border-2 border-brand-orange cursor-pointer transition-all duration-500 hover:bg-brand-orange-dark hover:-translate-y-1 shadow-orange">
              VIEW OUR EVENTS →
            </button>
            <button
              onClick={() => { changeFilter('team'); document.getElementById('gal-grid')?.scrollIntoView({ behavior:'smooth' }) }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-blue border-2 border-brand-blue rounded-xl font-poppins font-bold text-[13.5px] cursor-pointer transition-all duration-500 hover:bg-brand-blue hover:text-white hover:-translate-y-1">
              JOIN OUR JOURNEY →
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Filter Tabs ── */}
      <div className="bg-white pb-8" id="gal-grid">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex gap-2.5 flex-wrap">
            {filterTabs.map(({ value, label, Icon }) => (
              <motion.button key={value}
                onClick={() => changeFilter(value)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-poppins font-semibold text-[13px] border-[1.5px] cursor-pointer transition-all duration-500 ease-smooth ${
                  active === value
                    ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-brand-orange hover:text-brand-orange'
                }`}
                whileTap={{ scale: 0.97, transition: { duration: 0.2 } }}>
                <Icon size={14} strokeWidth={2} />
                {label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <section className="pb-[72px] bg-white" ref={gridRef}>
        <div className="max-w-[1280px] mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.div key={active}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              transition={{ duration:0.25 }}>
              {displayed.length === 0 ? (
                <div className="col-span-full text-center py-16 font-inter text-[15px] text-gray-400">No photos in this category.</div>
              ) : displayed.map((item, i) => (
                <motion.div key={item.id}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer bg-gray-100 aspect-[4/3]"
                  initial={{ opacity:0, y:20, scale:0.97 }}
                  animate={gridInView ? { opacity:1, y:0, scale:1 } : {}}
                  transition={{ delay: i * 0.04, duration:0.45, ease:EASE }}
                  onClick={() => openLightbox(item)}>
                  <LazyImg src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-[1.06]" />
                  {/* Category badge */}
                  <div className="absolute top-2.5 left-2.5 bg-white/90 text-gray-700 font-inter text-[10.5px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {item.category}
                  </div>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/50 transition-all duration-500 ease-smooth flex flex-col justify-end p-3.5">
                    <div className="translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-smooth">
                      <div className="font-poppins font-bold text-[13px] text-white mb-1">{item.title}</div>
                      <div className="flex items-center gap-1.5 font-inter text-[11.5px] text-white/80">
                        <Calendar size={11} /> {item.date}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Load More */}
          {visible < filtered.length && (
            <motion.div className="text-center mt-10" initial={{ opacity:0 }} animate={{ opacity:1 }}>
              <button
                onClick={() => setVisible(v => v + PAGE_SIZE)}
                className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-brand-orange text-brand-orange rounded-full font-poppins font-bold text-[13px] cursor-pointer transition-all hover:bg-brand-orange hover:text-white hover:-translate-y-1 hover:shadow-orange">
                LOAD MORE PHOTOS ({filtered.length - visible} remaining)
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="py-14 bg-white" ref={statsRef}>
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity:0, x:-32 }} animate={statsInView ? { opacity:1, x:0 } : {}} transition={{ duration:0.6, ease:EASE }}>
            <h2 className="font-poppins font-extrabold text-[clamp(22px,2.5vw,30px)] text-gray-900 mb-2.5">
              A Year Full of <span className="text-brand-orange">Memories</span>
            </h2>
            <p className="font-inter text-[14px] text-gray-500 leading-relaxed mb-7 max-w-[480px]">
              Every photo tells a story of growth, teamwork, and our commitment to the communities we serve.
            </p>
            <div className="flex gap-8 flex-wrap">
              {galleryStats.map((s, i) => (
                <motion.div key={s.label} className="text-center"
                  initial={{ opacity:0, y:16 }} animate={statsInView ? { opacity:1, y:0 } : {}}
                  transition={{ delay: i*0.1, duration:0.5, ease:EASE }}>
                  <div className="font-poppins font-extrabold text-[32px] text-brand-orange leading-none mb-1">{s.value}</div>
                  <div className="font-inter text-[13px] text-gray-500">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div className="hidden lg:flex justify-center items-center"
            initial={{ opacity:0, x:32 }} animate={statsInView ? { opacity:1, x:0 } : {}}
            transition={{ delay:0.2, duration:0.6, ease:EASE }}>
            <div className="grid grid-cols-2 gap-3 max-w-[340px]">
              {items.slice(4, 8).map((item) => (
                <div key={item.id} className="rounded-xl overflow-hidden aspect-[4/3] cursor-pointer group" onClick={() => openLightbox(item)}>
                  <LazyImg src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 bg-black/92 z-[3000] flex items-center justify-center"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:0.2 }}
            onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

            {/* Close */}
            <button onClick={() => setLightbox(null)}
              className="fixed top-4 right-4 w-11 h-11 rounded-full bg-white/20 border-none cursor-pointer flex items-center justify-center text-white hover:bg-white/35 transition-colors z-10">
              <X size={20} />
            </button>

            {/* Prev */}
            <button onClick={prev}
              className="fixed left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 border-none cursor-pointer flex items-center justify-center text-white hover:bg-white/35 transition-colors z-10">
              <ChevronLeft size={22} />
            </button>

            {/* Image */}
            <motion.div className="relative max-w-[90vw] max-h-[88vh] flex flex-col items-center"
              key={lightbox.id}
              initial={{ opacity:0, scale:0.93 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.93 }}
              transition={{ duration:0.22, ease:EASE }}>
              <img src={lightbox.img} alt={lightbox.title}
                className="max-w-full max-h-[75vh] rounded-xl object-contain"
                style={{ boxShadow:'0 24px 64px rgba(0,0,0,0.6)' }} />
              <div className="text-center mt-3.5">
                <div className="font-poppins font-bold text-[16px] text-white mb-1">{lightbox.title}</div>
                <div className="font-inter text-[12.5px] text-white/60 flex items-center justify-center gap-1.5">
                  <Calendar size={12} /> {lightbox.date}
                </div>
              </div>
            </motion.div>

            {/* Next */}
            <button onClick={next}
              className="fixed right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 border-none cursor-pointer flex items-center justify-center text-white hover:bg-white/35 transition-colors z-10">
              <ChevronRight size={22} />
            </button>

            {/* Counter */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 font-inter text-[13px] text-white/60 bg-black/40 px-3 py-1 rounded-full">
              {lbIndex + 1} / {filtered.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
