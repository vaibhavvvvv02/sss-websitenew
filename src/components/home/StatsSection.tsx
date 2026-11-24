import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Smile, Shield, Trophy, Phone } from 'lucide-react'

const stats = [
  { Icon: Smile, bg: '#FFEEDD', ring: '#FFD9B3', value: 25000, suffix: 'K+', divide: 1000, label: 'Happy Customers', iconColor: '#FF6B00' },
  { Icon: Shield, bg: '#DDF5E8', ring: '#B7E8CB', value: 98, suffix: '%', divide: 1, label: 'Claim Settlement Ratio', iconColor: '#2E7D32' },
  { Icon: Trophy, bg: '#E1EEFF', ring: '#BBD8FF', value: 35000, suffix: 'K+', divide: 1000, label: 'Policies Issued', iconColor: '#1a5276' },
  { Icon: Phone, bg: '#FDE4F3', ring: '#F9C2E4', value: 300, suffix: '+', divide: 1, label: 'Collective Experience', noAnimate: true, iconColor: '#be185d' },
]

function useCountUp(target: number, divide: number, active: boolean, duration = 1400) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    let startTime: number | null = null
    const step = (ts: number) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setVal(Math.floor((eased * target) / divide))
      if (progress < 1) requestAnimationFrame(step)
      else setVal(target / divide)
    }
    requestAnimationFrame(step)
  }, [active, target, divide, duration])
  return val
}

function StatCard({ stat, index, active }: { stat: (typeof stats)[0]; index: number; active: boolean }) {
  const count = useCountUp(stat.value, stat.divide, active)
  const display = stat.noAnimate ? stat.value : count

  return (
    <motion.div
      className="flex-1 min-w-[150px] max-w-[220px] flex items-center gap-4 bg-white rounded-2xl px-5 py-5 border border-gray-100 cursor-default transition-all duration-500 ease-smooth hover:-translate-y-1 hover:shadow-apple-lg hover:border-orange-200"
      initial={{ opacity: 0, y: 18 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
      style={{ boxShadow: '0 2px 10px rgba(17,24,39,0.05), 0 1px 2px rgba(17,24,39,0.04)' }}
    >
      <div
        className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center flex-shrink-0"
        style={{ background: stat.bg, boxShadow: `0 0 0 6px ${stat.ring}55` }}
      >
        <stat.Icon size={24} color={stat.iconColor} strokeWidth={1.8} />
      </div>
      <div>
        <div className="font-poppins font-extrabold text-[27px] text-brand-orange leading-none tabular-nums">
          {display}
          {stat.suffix}
        </div>
        <div className="font-inter text-[13px] text-gray-500 mt-1">{stat.label}</div>
      </div>
    </motion.div>
  )
}

export default function StatsSection() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    if (inView) setActive(true)
  }, [inView])

  return (
    <section
      ref={ref}
      className="relative py-16 px-6 overflow-hidden"
      style={{
        background:
          'linear-gradient(100deg, rgba(255,107,0,0.15) 0%, rgba(255,255,255,1) 35%, rgba(255,255,255,1) 65%, rgba(46,125,50,0.15) 100%)',
      }}
    >
      {/* Top/Bottom fades */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />

      <div className="relative z-20 max-w-[1100px] mx-auto flex justify-center gap-6 flex-wrap">
        {stats.map((s, i) => (
          <StatCard key={s.label} stat={s} index={i} active={active} />
        ))}
      </div>
    </section>
  )
}
