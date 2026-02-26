import { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  LayoutDashboard,
  Globe,
  CalendarCheck,
  Lock,
  Unlock,
  Mail,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
} from 'lucide-react'
import { useLang } from './LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const LOGO_ICON = '/brand_assets/EC Logo Icon Square Gold.png'
const LOGO_FULL = '/brand_assets/EC Logo Transparent Gold.png'

/* ═══════════════════════════════════════════════════════════════
   MAGNETIC BUTTON
   ═══════════════════════════════════════════════════════════════ */

function MagneticButton({ children, className = '', as = 'button', href, ...props }) {
  const ref = useRef(null)

  const handleMouseMove = useCallback((e) => {
    const btn = ref.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    gsap.to(btn, {
      x: Math.max(-8, Math.min(8, x * 0.15)),
      y: Math.max(-8, Math.min(8, y * 0.15)),
      duration: 0.3,
      ease: 'power2.out',
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' })
  }, [])

  const Tag = as === 'a' ? 'a' : 'button'

  return (
    <Tag
      ref={ref}
      className={className}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </Tag>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PARTICLE FIELD (Hero background — gold embers)
   ═══════════════════════════════════════════════════════════════ */

function ParticleField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    const isMobile = window.innerWidth < 768
    const count = isMobile ? 8 : 20

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 0.15 + Math.random() * 0.45,
      opacity: 0.08 + Math.random() * 0.35,
      size: 0.8 + Math.random() * 1.8,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.y -= p.speed
        if (p.y < -10) {
          p.y = canvas.height + 10
          p.x = Math.random() * canvas.width
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200,164,86,${p.opacity})`
        ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />
}

/* ═══════════════════════════════════════════════════════════════
   DIAGNOSTIC SHUFFLER — Card 1 Artifact
   Cycling stack of mini-cards (Client Portal / Dashboard / Booking)
   ═══════════════════════════════════════════════════════════════ */

function DiagnosticShuffler() {
  const { t } = useLang()
  const [order, setOrder] = useState([0, 1, 2])

  const items = [
    { icon: LayoutDashboard, title: t.shufflerClientPortal, desc: t.shufflerClientPortalDesc },
    { icon: Globe, title: t.shufflerDashboard, desc: t.shufflerDashboardDesc },
    { icon: CalendarCheck, title: t.shufflerBooking, desc: t.shufflerBookingDesc },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setOrder((prev) => {
        const next = [...prev]
        next.unshift(next.pop())
        return next
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-48 w-full">
      {order.map((itemIdx, stackPos) => {
        const item = items[itemIdx]
        const Icon = item.icon
        const isTop = stackPos === 0
        return (
          <div
            key={itemIdx}
            className="absolute left-0 right-0 mx-auto max-w-[280px] rounded-[0.75rem] px-4 py-3 flex items-center gap-3 border transition-all"
            style={{
              top: `${stackPos * 16}px`,
              zIndex: 3 - stackPos,
              opacity: isTop ? 1 : 0.6 - stackPos * 0.15,
              transform: `scale(${1 - stackPos * 0.05})`,
              backgroundColor: isTop ? '#1A1A2E' : '#131325',
              borderColor: isTop ? 'rgba(200,164,86,0.3)' : 'rgba(200,164,86,0.06)',
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
              transitionDuration: '500ms',
            }}
          >
            <Icon size={20} className={isTop ? 'text-aureum' : 'text-graphite'} />
            <div>
              <p className={`text-sm font-semibold ${isTop ? 'text-ash' : 'text-graphite'}`}>
                {item.title}
              </p>
              <p className="text-xs text-graphite leading-snug">{item.desc}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   TELEMETRY TYPEWRITER — Card 2 Artifact
   Simulated terminal feed with auto-typing messages
   ═══════════════════════════════════════════════════════════════ */

function TelemetryTypewriter() {
  const { t } = useLang()
  const feedMessages = [t.feedLine1, t.feedLine2, t.feedLine3, t.feedLine4]

  const [lines, setLines] = useState([])
  const [currentText, setCurrentText] = useState('')
  const [msgIdx, setMsgIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const feedRef = useRef(null)
  const messagesRef = useRef(feedMessages)
  messagesRef.current = feedMessages

  useEffect(() => {
    if (!isTyping) return
    const msg = messagesRef.current[msgIdx % messagesRef.current.length]
    if (charIdx < msg.length) {
      const timeout = setTimeout(() => {
        setCurrentText(msg.slice(0, charIdx + 1))
        setCharIdx((c) => c + 1)
      }, 22)
      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => {
        setLines((prev) => [...prev.slice(-3), msg])
        setCurrentText('')
        setCharIdx(0)
        setMsgIdx((i) => (i + 1) % messagesRef.current.length)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [charIdx, msgIdx, isTyping])

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight
    }
  }, [lines, currentText])

  return (
    <div className="rounded-[0.75rem] overflow-hidden" style={{ backgroundColor: '#0D0D0D' }}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
        <span className="font-mono text-[10px] text-graphite tracking-wider">AGENT FEED</span>
        <span className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full bg-green-500"
            style={{ animation: 'pulse-green 2s ease-in-out infinite' }}
          />
          <span className="font-mono text-[10px] text-green-500">LIVE</span>
        </span>
      </div>
      <div ref={feedRef} className="px-3 py-3 h-36 overflow-y-auto font-mono text-xs leading-relaxed">
        {lines.map((line, i) => (
          <p key={i} className="text-graphite mb-1.5">{line}</p>
        ))}
        {currentText && (
          <p className="text-ash mb-1.5">
            {currentText}
            <span className="typewriter-cursor" />
          </p>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   ORBIT DIAGRAM — Card 3 Artifact
   Central node with orbiting service nodes
   ═══════════════════════════════════════════════════════════════ */

const ORBIT_NODES_CONFIG = [
  { key: 'orbitCRM', radius: 80, speed: 0.008, startAngle: 0 },
  { key: 'orbitInvoicing', radius: 80, speed: 0.006, startAngle: 1.26 },
  { key: 'orbitOnboarding', radius: 80, speed: 0.01, startAngle: 2.51 },
  { key: 'orbitReporting', radius: 80, speed: 0.007, startAngle: 3.77 },
  { key: 'orbitScheduling', radius: 80, speed: 0.009, startAngle: 5.03 },
]

function OrbitDiagram() {
  const { t } = useLang()
  const svgRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const anglesRef = useRef(ORBIT_NODES_CONFIG.map((n) => n.startAngle))

  useEffect(() => {
    let animId
    const cx = 150
    const cy = 105

    const animate = () => {
      const svg = svgRef.current
      if (!svg) return

      ORBIT_NODES_CONFIG.forEach((node, i) => {
        const speedMult = hovered ? 0.2 : 1
        anglesRef.current[i] += node.speed * speedMult

        const angle = anglesRef.current[i]
        const x = cx + node.radius * Math.cos(angle)
        const y = cy + node.radius * Math.sin(angle)

        const circle = svg.querySelector(`#orbit-node-${i}`)
        const text = svg.querySelector(`#orbit-text-${i}`)
        const line = svg.querySelector(`#orbit-line-${i}`)
        const status = svg.querySelector(`#orbit-status-${i}`)

        if (circle) {
          circle.setAttribute('cx', x)
          circle.setAttribute('cy', y)
        }
        if (text) {
          text.setAttribute('x', x)
          text.setAttribute('y', y - (hovered ? 14 : 10))
        }
        if (line) {
          line.setAttribute('x1', cx)
          line.setAttribute('y1', cy)
          line.setAttribute('x2', x)
          line.setAttribute('y2', y)
        }
        if (status) {
          status.setAttribute('x', x)
          status.setAttribute('y', y + 14)
          status.style.opacity = hovered ? '1' : '0'
        }
      })
      animId = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(animId)
  }, [hovered])

  return (
    <div
      className="flex justify-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg ref={svgRef} viewBox="0 0 300 210" className="w-full max-w-[300px] h-auto">
        {/* Orbit track */}
        <circle cx="150" cy="105" r="80" fill="none" stroke="rgba(200,164,86,0.08)" strokeWidth="1" />

        {/* Connecting lines */}
        {ORBIT_NODES_CONFIG.map((_, i) => (
          <line
            key={`line-${i}`}
            id={`orbit-line-${i}`}
            stroke="rgba(200,164,86,0.15)"
            strokeWidth="0.5"
          />
        ))}

        {/* Center node */}
        <circle cx="150" cy="105" r="22" fill="#1A1A2E" stroke="#C8A456" strokeWidth="1" />
        <text x="150" y="103" textAnchor="middle" fill="#C8A456" fontSize="6" fontFamily="JetBrains Mono" fontWeight="500">
          {t.orbitCenter1}
        </text>
        <text x="150" y="112" textAnchor="middle" fill="#C8A456" fontSize="6" fontFamily="JetBrains Mono" fontWeight="500">
          {t.orbitCenter2}
        </text>

        {/* Orbiting nodes */}
        {ORBIT_NODES_CONFIG.map((node, i) => (
          <g key={i}>
            <circle
              id={`orbit-node-${i}`}
              r={hovered ? 6 : 5}
              fill="#1A1A2E"
              stroke="#C8A456"
              strokeWidth="1"
              style={{ transition: 'r 0.3s ease-out' }}
            />
            <text
              id={`orbit-text-${i}`}
              textAnchor="middle"
              fill="#E0E0E0"
              fontSize="7"
              fontFamily="JetBrains Mono"
            >
              {t[node.key]}
            </text>
            <text
              id={`orbit-status-${i}`}
              textAnchor="middle"
              fill="#C8A456"
              fontSize="6"
              fontFamily="JetBrains Mono"
              style={{ opacity: 0, transition: 'opacity 0.3s' }}
            >
              {t.orbitSynced}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SCANNER ANIMATION — Process Card 1 Micro-Animation
   Gold laser-line sweeping over a flowchart
   ═══════════════════════════════════════════════════════════════ */

function ScannerAnimation() {
  const { t } = useLang()
  const svgRef = useRef(null)
  const scanRef = useRef(null)

  useEffect(() => {
    const scanLine = scanRef.current
    if (!scanLine) return
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 })
    tl.fromTo(scanLine, { attr: { y1: 10, y2: 10 } }, { attr: { y1: 150, y2: 150 }, duration: 2.5, ease: 'none' })
    return () => tl.kill()
  }, [])

  const nodes = [
    { x: 60, y: 30, label: t.scannerInput },
    { x: 160, y: 30, label: t.scannerReview },
    { x: 260, y: 30, label: t.scannerApprove },
    { x: 60, y: 90, label: t.scannerProcess },
    { x: 160, y: 90, label: t.scannerRoute },
    { x: 260, y: 90, label: t.scannerArchive },
    { x: 110, y: 140, label: t.scannerReport },
    { x: 210, y: 140, label: t.scannerExport },
  ]

  const edges = [
    [0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5], [3, 6], [4, 7], [6, 7],
  ]

  return (
    <svg ref={svgRef} viewBox="0 0 320 160" className="w-full h-auto">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x} y1={nodes[a].y}
          x2={nodes[b].x} y2={nodes[b].y}
          stroke="rgba(200,164,86,0.12)"
          strokeWidth="1"
        />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r="14" fill="#1A1A2E" stroke="rgba(200,164,86,0.2)" strokeWidth="1" />
          <text x={n.x} y={n.y + 3} textAnchor="middle" fill="#6B6B6B" fontSize="6" fontFamily="JetBrains Mono">
            {n.label}
          </text>
        </g>
      ))}
      <line
        ref={scanRef}
        x1="0" y1="10" x2="320" y2="10"
        stroke="#C8A456"
        strokeWidth="1.5"
        opacity="0.6"
      />
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════
   NETWORK ANIMATION — Process Card 2 Micro-Animation
   Scattered dots that connect into a hexagonal network
   ═══════════════════════════════════════════════════════════════ */

function NetworkAnimation() {
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const nodes = el.querySelectorAll('.net-node')
    const lines = el.querySelectorAll('.net-line')

    const ctx = gsap.context(() => {
      nodes.forEach((node) => {
        gsap.from(node, {
          attr: {
            cx: 40 + Math.random() * 240,
            cy: 20 + Math.random() * 120,
          },
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        })
      })

      lines.forEach((line, i) => {
        gsap.from(line, {
          attr: { 'stroke-dashoffset': 200 },
          duration: 0.8,
          delay: 0.3 + i * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        })
      })
    })

    return () => ctx.revert()
  }, [])

  const cx = 160, cy = 80, r = 55
  const hexNodes = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  })

  const hexEdges = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
    [0, 3], [1, 4], [2, 5],
  ]

  return (
    <svg ref={containerRef} viewBox="0 0 320 160" className="w-full h-auto">
      {hexEdges.map(([a, b], i) => (
        <line
          key={i}
          className="net-line"
          x1={hexNodes[a].x} y1={hexNodes[a].y}
          x2={hexNodes[b].x} y2={hexNodes[b].y}
          stroke="#C8A456"
          strokeWidth="1"
          opacity="0.3"
          strokeDasharray="200"
          strokeDashoffset="0"
        />
      ))}
      {hexNodes.map((n, i) => (
        <circle
          key={i}
          className="net-node"
          cx={n.x}
          cy={n.y}
          r="5"
          fill="#C8A456"
          opacity="0.8"
        />
      ))}
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PROGRESS BAR ANIMATION — Process Card 3 Micro-Animation
   Three-stage fill with lock snap at 100%
   ═══════════════════════════════════════════════════════════════ */

function ProgressBarAnimation() {
  const barRef = useRef(null)
  const lockRef = useRef(null)
  const [locked, setLocked] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: bar,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        onReverseComplete: () => {
          setProgress(0)
          setLocked(false)
        },
      })

      tl.to(bar, {
        width: '33%',
        duration: 0.6,
        ease: 'back.out(1.4)',
        onComplete: () => setProgress(33),
      })
        .to(bar, {
          width: '66%',
          duration: 0.6,
          delay: 0.3,
          ease: 'back.out(1.4)',
          onComplete: () => setProgress(66),
        })
        .to(bar, {
          width: '100%',
          duration: 0.6,
          delay: 0.3,
          ease: 'back.out(1.4)',
          onComplete: () => {
            setProgress(100)
            setLocked(true)
          },
        })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#0D0D0D' }}>
        <div
          ref={barRef}
          className="h-full rounded-full bg-aureum"
          style={{ width: '0%', transition: 'none' }}
        />
      </div>
      <div
        ref={lockRef}
        className="transition-transform duration-300"
        style={{ transform: locked ? 'scale(1.15)' : 'scale(1)' }}
      >
        {locked ? (
          <Lock size={18} className="text-aureum" />
        ) : (
          <Unlock size={18} className="text-graphite" />
        )}
      </div>
      <span className="font-mono text-xs text-graphite w-8 text-right">{progress}%</span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   DATE & TIME PICKER
   ═══════════════════════════════════════════════════════════════ */

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30',
  '17:00',
]

function DateTimePicker({ selectedDate, selectedTime, onDateChange, onTimeChange }) {
  const { t } = useLang()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  // Build calendar grid (Monday-start)
  const firstDay = new Date(viewYear, viewMonth, 1)
  const lastDay = new Date(viewYear, viewMonth + 1, 0)
  // getDay: 0=Sun. Convert to Mon=0 start
  const startOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = lastDay.getDate()

  const prevMonthLastDay = new Date(viewYear, viewMonth, 0).getDate()

  const cells = []

  // Previous month trailing days
  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({ day: prevMonthLastDay - i, outside: true, disabled: true, date: null })
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(viewYear, viewMonth, d)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    const isPast = date < today
    cells.push({
      day: d,
      outside: false,
      disabled: isPast || isWeekend,
      date,
      isToday: date.getTime() === today.getTime(),
    })
  }

  // Next month leading days to fill grid
  const remaining = 7 - (cells.length % 7)
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      cells.push({ day: d, outside: true, disabled: true, date: null })
    }
  }

  const isPrevDisabled = viewYear === today.getFullYear() && viewMonth <= today.getMonth()

  const isSelectedDate = (cell) => {
    if (!selectedDate || !cell.date) return false
    return selectedDate.getTime() === cell.date.getTime()
  }

  return (
    <div>
      <label className="block text-xs font-mono tracking-wider text-graphite uppercase mb-3">
        {t.pickerLabel}
      </label>

      <div
        className="rounded-xl p-4 md:p-5"
        style={{ backgroundColor: '#0D0D0D', border: '1px solid rgba(200,164,86,0.1)' }}
      >
        {/* Calendar */}
        <div className="mb-4">
          <p className="text-[11px] font-mono text-graphite uppercase tracking-wider mb-3">
            {t.pickerSelectDate}
          </p>

          {/* Month nav */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={prevMonth}
              disabled={isPrevDisabled}
              className="w-7 h-7 flex items-center justify-center rounded-md text-graphite hover:text-aureum transition-colors duration-200 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-semibold text-ash">
              {t.pickerMonths[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="w-7 h-7 flex items-center justify-center rounded-md text-graphite hover:text-aureum transition-colors duration-200 cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {t.pickerDays.map((d) => (
              <div
                key={d}
                className="text-center text-[10px] font-mono text-graphite uppercase tracking-wider py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((cell, i) => (
              <button
                key={i}
                type="button"
                disabled={cell.disabled}
                onClick={() => cell.date && onDateChange(cell.date)}
                className={[
                  'cal-day',
                  cell.outside && 'cal-day--outside',
                  cell.disabled && 'cal-day--disabled',
                  cell.isToday && 'cal-day--today',
                  isSelectedDate(cell) && 'cal-day--selected',
                ].filter(Boolean).join(' ')}
              >
                {cell.day}
              </button>
            ))}
          </div>
        </div>

        {/* Time slots — shown after date is selected */}
        {selectedDate && (
          <div>
            <div className="h-px my-4" style={{ backgroundColor: 'rgba(200,164,86,0.08)' }} />
            <div className="flex items-center gap-2 mb-3">
              <Clock size={12} className="text-graphite" />
              <p className="text-[11px] font-mono text-graphite uppercase tracking-wider">
                {t.pickerSelectTime}
              </p>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => onTimeChange(slot)}
                  className={[
                    'time-slot',
                    selectedTime === slot && 'time-slot--selected',
                  ].filter(Boolean).join(' ')}
                >
                  {slot}
                </button>
              ))}
            </div>
            <p className="text-[10px] font-mono text-graphite mt-2 text-right">
              {t.pickerTimeZone}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   CONTACT MODAL
   ═══════════════════════════════════════════════════════════════ */

const WEB3FORMS_KEY = 'YOUR_ACCESS_KEY_HERE' // Replace with key from web3forms.com

function ContactModal({ isOpen, onClose }) {
  const { t } = useLang()
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const backdropRef = useRef(null)

  // Animate in after mount
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        backdropRef.current?.classList.add('modal-open')
      })
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen])

  const handleClose = () => {
    backdropRef.current?.classList.remove('modal-open')
    setTimeout(() => {
      onClose()
      setStatus('idle')
      setFormData({ name: '', email: '', phone: '', message: '' })
      setSelectedDate(null)
      setSelectedTime(null)
    }, 300)
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          preferred_date: selectedDate ? selectedDate.toLocaleDateString('en-GB') : 'Not specified',
          preferred_time: selectedTime || 'Not specified',
          subject: `New inquiry from ${formData.name} — Emmoni Consulting`,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setStatus('success')
        setTimeout(handleClose, 3000)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={backdropRef}
      className="modal-backdrop fixed inset-0 z-[100] flex flex-col items-center px-4 overflow-y-auto"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => {
        if (e.target === backdropRef.current || e.target.dataset.modalSpacer) handleClose()
      }}
    >
      {/* Spacer: centers panel vertically when modal fits, collapses when it doesn't */}
      <div className="shrink grow min-h-8 md:min-h-12" data-modal-spacer="true" />
      <div
        className="modal-panel relative w-full max-w-xl rounded-2xl p-5 md:p-10 shrink-0"
        style={{
          backgroundColor: '#1A1A2E',
          border: '1px solid rgba(200,164,86,0.15)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(200,164,86,0.04)',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-graphite hover:text-aureum transition-colors duration-200 cursor-pointer"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h3
            className="text-xl md:text-3xl font-bold text-ash mb-2"
            style={{ letterSpacing: '-0.02em' }}
          >
            {t.modalTitle}
          </h3>
          <p className="text-sm text-graphite">{t.modalSubtitle}</p>
        </div>

        {/* Success state */}
        {status === 'success' ? (
          <div className="text-center py-12">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: 'rgba(200,164,86,0.1)', border: '1px solid rgba(200,164,86,0.3)' }}
            >
              <span className="text-aureum text-2xl">&#10003;</span>
            </div>
            <p className="text-ash font-semibold mb-1">{t.formSuccess}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-mono tracking-wider text-graphite uppercase mb-2">
                {t.formName}
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder={t.formNamePlaceholder}
                className="modal-input w-full px-4 py-3 rounded-lg text-sm font-heading"
              />
            </div>

            {/* Email + Phone row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono tracking-wider text-graphite uppercase mb-2">
                  {t.formEmail}
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t.formEmailPlaceholder}
                  className="modal-input w-full px-4 py-3 rounded-lg text-sm font-heading"
                />
              </div>
              <div>
                <label className="block text-xs font-mono tracking-wider text-graphite uppercase mb-2">
                  {t.formPhone}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t.formPhonePlaceholder}
                  className="modal-input w-full px-4 py-3 rounded-lg text-sm font-heading"
                />
              </div>
            </div>

            {/* Date & Time Picker */}
            <DateTimePicker
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onDateChange={setSelectedDate}
              onTimeChange={setSelectedTime}
            />

            {/* Message */}
            <div>
              <label className="block text-xs font-mono tracking-wider text-graphite uppercase mb-2">
                {t.formMessage}
              </label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder={t.formMessagePlaceholder}
                className="modal-input w-full px-4 py-3 rounded-lg text-sm font-heading resize-none"
              />
            </div>

            {/* Error message */}
            {status === 'error' && (
              <p className="text-sm text-red-400">{t.formError}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full bg-aureum text-obsidian font-semibold py-4 rounded-full text-sm md:text-base cursor-pointer transition-opacity duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'sending' ? t.formSending : t.formSubmit}
            </button>

            {/* Disclaimer */}
            <p className="text-xs text-graphite text-center">{t.formDisclaimer}</p>
          </form>
        )}
      </div>
      <div className="shrink grow min-h-8 md:min-h-12" data-modal-spacer="true" />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   LANGUAGE TOGGLE BUTTON
   ═══════════════════════════════════════════════════════════════ */

function LanguageToggle() {
  const { lang, toggleLang } = useLang()

  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider cursor-pointer transition-colors duration-300"
      style={{
        border: '1px solid rgba(200,164,86,0.25)',
        color: '#C8A456',
        backgroundColor: 'rgba(200,164,86,0.06)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(200,164,86,0.15)'
        e.currentTarget.style.borderColor = 'rgba(200,164,86,0.5)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(200,164,86,0.06)'
        e.currentTarget.style.borderColor = 'rgba(200,164,86,0.25)'
      }}
      aria-label={lang === 'sr' ? 'Switch to English' : 'Prebaci na srpski'}
    >
      <span style={{ opacity: lang === 'sr' ? 1 : 0.4, fontWeight: lang === 'sr' ? 700 : 400 }}>SR</span>
      <span style={{ color: 'rgba(200,164,86,0.3)' }}>/</span>
      <span style={{ opacity: lang === 'en' ? 1 : 0.4, fontWeight: lang === 'en' ? 700 : 400 }}>EN</span>
    </button>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN APP COMPONENT
   ═══════════════════════════════════════════════════════════════ */

function App() {
  const { lang, t } = useLang()
  const [navScrolled, setNavScrolled] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  // Refs for GSAP hero timeline
  const heroGoldLine = useRef(null)
  const heroPrehead = useRef(null)
  const heroLine1 = useRef(null)
  const heroLine2 = useRef(null)
  const heroSub = useRef(null)
  const heroBtn1 = useRef(null)
  const heroBtn2 = useRef(null)
  const heroParticles = useRef(null)

  // Refs for process stacking
  const processCards = useRef([])

  // ── Update document title on language change ──
  useEffect(() => {
    document.title = t.pageTitle
    document.documentElement.lang = lang
  }, [lang, t.pageTitle])

  // ── Navbar scroll morph ──
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > window.innerHeight * 0.8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Hero entrance GSAP timeline ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 })

      // 1. Gold line scales in
      tl.fromTo(heroGoldLine.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.6, ease: 'power2.out' }
      )

      // 2. Pre-headline fades up
      .from(heroPrehead.current, {
        y: 20, opacity: 0, duration: 0.5, ease: 'power2.out',
      }, '+=0.1')

      // 3. Line 1 clips in from bottom
      .fromTo(heroLine1.current,
        { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', duration: 0.7, ease: 'power3.out' },
        '-=0.2'
      )

      // 4. Line 2 clips in from bottom + gold shimmer on "Obsess"
      .fromTo(heroLine2.current,
        { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', duration: 0.7, ease: 'power3.out' },
        '-=0.3'
      )

      // 5. Sub-headline fades up
      .from(heroSub.current, {
        y: 20, opacity: 0, duration: 0.5, ease: 'power2.out',
      }, '-=0.1')

      // 6. Buttons stagger in
      .from([heroBtn1.current, heroBtn2.current], {
        y: 20, opacity: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out',
      }, '-=0.1')

      // 7. Particles fade in
      .to(heroParticles.current, {
        opacity: 1, duration: 0.8, ease: 'power1.in',
      }, '-=0.3')
    })

    return () => ctx.revert()
  }, [])

  // ── Process stacking cards ScrollTrigger ──
  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (isMobile) return // No stacking on mobile

    const ctx = gsap.context(() => {
      processCards.current.forEach((card, i) => {
        if (i === processCards.current.length - 1) return // Last card doesn't stack

        ScrollTrigger.create({
          trigger: processCards.current[i + 1],
          start: 'top 85%',
          end: 'top 20%',
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress
            gsap.set(card, {
              scale: 1 - p * 0.08,
              filter: `blur(${p * 8}px)`,
              opacity: 1 - p * 0.6,
            })
          },
        })
      })
    })

    return () => ctx.revert()
  }, [])

  // ── Section entrance animations ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.section-animate').forEach((el) => {
        gsap.from(el, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        })
      })
    })
    return () => ctx.revert()
  }, [])

  // Footer nav links
  const footerLinks = [
    { label: t.footerNavServices, href: '#services' },
    { label: t.footerNavProcess, href: '#process' },
    { label: t.footerNavContact, href: '#contact' },
    { label: t.footerNavPrivacy, href: '#' },
  ]

  return (
    <div className="min-h-screen bg-obsidian text-ash font-heading">

      {/* ═══════ NAVBAR ═══════ */}
      <nav
        className="fixed top-5 left-1/2 z-50 flex items-center justify-between px-4 md:px-6 py-3 rounded-full"
        style={{
          transform: 'translateX(-50%)',
          maxWidth: navScrolled ? '56rem' : '60rem',
          width: '92%',
          backgroundColor: navScrolled ? 'rgba(10,10,10,0.85)' : 'transparent',
          backdropFilter: navScrolled ? 'blur(20px)' : 'none',
          border: navScrolled ? '1px solid rgba(200,164,86,0.15)' : '1px solid transparent',
          transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <a href="#" className="flex items-center gap-2">
          <img src={LOGO_ICON} alt="Emmoni" className="h-7 w-7 object-contain" />
        </a>
        <div className="hidden md:flex items-center gap-6 text-sm text-ash absolute left-1/2 -translate-x-1/2">
          <a href="#services" className="hover:text-aureum transition-colors duration-300">{t.navServices}</a>
          <a href="#process" className="hover:text-aureum transition-colors duration-300">{t.navProcess}</a>
          <a href="#contact" className="hover:text-aureum transition-colors duration-300">{t.navContact}</a>
        </div>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <MagneticButton
            className="shimmer-btn bg-aureum text-obsidian text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-5 sm:py-2 rounded-full cursor-pointer"
            onClick={() => setModalOpen(true)}
          >
            {t.navCta}
          </MagneticButton>
        </div>
      </nav>

      {/* ═══════ HERO SECTION ═══════ */}
      <section className="h-dvh flex items-center justify-center text-center relative overflow-hidden hero-scanlines">
        {/* Radial gold glow */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 120%, rgba(200,164,86,0.08) 0%, transparent 60%)',
          }}
        />

        {/* Particles (initially hidden, faded in by GSAP) */}
        <div ref={heroParticles} className="absolute inset-0" style={{ opacity: 0 }}>
          <ParticleField />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-5 px-4">
          {/* Gold line */}
          <div
            ref={heroGoldLine}
            className="w-10 h-px bg-aureum"
            style={{ transformOrigin: 'center', transform: 'scaleX(0)' }}
          />

          {/* Pre-headline */}
          <p
            ref={heroPrehead}
            className="font-mono text-sm tracking-[0.3em] text-graphite uppercase"
          >
            {t.heroPrehead}
          </p>

          {/* Main headline */}
          <h1 className="flex flex-col items-center gap-1">
            <span
              ref={heroLine1}
              className="block font-heading font-bold text-3xl md:text-6xl text-ash"
              style={{ letterSpacing: '-0.02em', clipPath: 'inset(100% 0 0 0)' }}
            >
              {t.heroLine1}
            </span>
            <span
              ref={heroLine2}
              className="block font-drama italic text-3xl sm:text-5xl md:text-7xl text-aureum mt-1"
              style={{ clipPath: 'inset(100% 0 0 0)' }}
            >
              {t.heroLine2ItalicPre}<em>{t.heroLine2ItalicEm}</em>
            </span>
          </h1>

          {/* Sub-headline */}
          <p
            ref={heroSub}
            className="font-heading text-base md:text-lg text-graphite max-w-xl leading-relaxed"
          >
            {t.heroSub}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div ref={heroBtn1}>
              <MagneticButton
                className="bg-aureum text-obsidian font-semibold px-6 py-3 md:px-8 md:py-4 rounded-full text-sm cursor-pointer w-full sm:w-auto"
                onClick={() => setModalOpen(true)}
              >
                {t.heroCta1}
              </MagneticButton>
            </div>
            <div ref={heroBtn2}>
              <MagneticButton
                className="slide-fill border border-aureum text-aureum font-semibold px-6 py-3 md:px-8 md:py-4 rounded-full text-sm cursor-pointer w-full sm:w-auto"
                onClick={() => document.getElementById('process').scrollIntoView({ behavior: 'smooth' })}
              >
                {t.heroCta2}
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════ FEATURES / SERVICES — "The Arsenal" ═══════ */}
      <section id="services" className="py-16 md:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16 section-animate">
            <p className="font-mono text-sm tracking-[0.2em] text-graphite uppercase mb-4">
              {t.servicesPrehead}
            </p>
            <h2 className="text-2xl md:text-5xl font-bold" style={{ letterSpacing: '-0.02em' }}>
              {t.servicesHeadline}
              <span className="font-drama italic text-aureum">{t.servicesHeadlineAccent}</span>
            </h2>
          </div>

          {/* 3-column card grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 — Custom Apps & Websites */}
            <div className="section-animate group rounded-[1.25rem] p-6 transition-all duration-300"
              style={{
                backgroundColor: '#1A1A2E',
                border: '1px solid rgba(200,164,86,0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(200,164,86,0.3)'
                e.currentTarget.style.boxShadow = '0 0 30px rgba(200,164,86,0.06)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(200,164,86,0.08)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <h3 className="font-mono text-xs tracking-wider text-aureum mb-4 uppercase">
                {t.serviceCard1Title}
              </h3>
              <div className="mb-6">
                <DiagnosticShuffler />
              </div>
              <p className="text-sm text-graphite leading-relaxed">
                {t.serviceCard1Desc}
              </p>
            </div>

            {/* Card 2 — AI Employees & Agents */}
            <div className="section-animate group rounded-[1.25rem] p-6 transition-all duration-300"
              style={{
                backgroundColor: '#1A1A2E',
                border: '1px solid rgba(200,164,86,0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(200,164,86,0.3)'
                e.currentTarget.style.boxShadow = '0 0 30px rgba(200,164,86,0.06)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(200,164,86,0.08)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <h3 className="font-mono text-xs tracking-wider text-aureum mb-4 uppercase">
                {t.serviceCard2Title}
              </h3>
              <div className="mb-6">
                <TelemetryTypewriter />
              </div>
              <p className="text-sm text-graphite leading-relaxed">
                {t.serviceCard2Desc}
              </p>
            </div>

            {/* Card 3 — Agentic Workflows */}
            <div className="section-animate group rounded-[1.25rem] p-6 transition-all duration-300"
              style={{
                backgroundColor: '#1A1A2E',
                border: '1px solid rgba(200,164,86,0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(200,164,86,0.3)'
                e.currentTarget.style.boxShadow = '0 0 30px rgba(200,164,86,0.06)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(200,164,86,0.08)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <h3 className="font-mono text-xs tracking-wider text-aureum mb-4 uppercase">
                {t.serviceCard3Title}
              </h3>
              <div className="mb-6">
                <OrbitDiagram />
              </div>
              <p className="text-sm text-graphite leading-relaxed">
                {t.serviceCard3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════ PROCESS — "The Protocol Stack" ═══════ */}
      <section id="process" className="py-16 md:py-32 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16 section-animate">
            <p className="font-mono text-sm tracking-[0.2em] text-graphite uppercase mb-4">
              {t.processPrehead}
            </p>
            <h2 className="text-2xl md:text-5xl font-bold" style={{ letterSpacing: '-0.02em' }}>
              {t.processHeadline}
              <span className="font-drama italic text-aureum">{t.processHeadlineAccent}</span>
            </h2>
          </div>

          {/* Stacking process cards */}
          <div className="flex flex-col gap-8 md:gap-12">
            {/* Card 1 — Diagnose */}
            <div
              ref={(el) => (processCards.current[0] = el)}
              className="section-animate relative rounded-[1.25rem] p-5 sm:p-6 md:p-12 overflow-hidden md:sticky md:top-24"
              style={{ backgroundColor: '#1A1A2E' }}
            >
              <span className="absolute top-4 right-4 md:right-6 font-mono text-[5rem] md:text-[10rem] leading-none font-bold text-aureum/[0.06] select-none pointer-events-none">
                01
              </span>
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="font-mono text-sm text-aureum mb-3">01</p>
                  <h3 className="text-xl md:text-3xl font-bold mb-4" style={{ letterSpacing: '-0.02em' }}>
                    {t.processCard1Title}
                  </h3>
                  <p className="text-graphite leading-relaxed">
                    {t.processCard1Desc}
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <ScannerAnimation />
                </div>
              </div>
            </div>

            {/* Card 2 — Architect */}
            <div
              ref={(el) => (processCards.current[1] = el)}
              className="section-animate relative rounded-[1.25rem] p-5 sm:p-6 md:p-12 overflow-hidden md:sticky md:top-24"
              style={{ backgroundColor: '#1A1A2E' }}
            >
              <span className="absolute top-4 right-4 md:right-6 font-mono text-[5rem] md:text-[10rem] leading-none font-bold text-aureum/[0.06] select-none pointer-events-none">
                02
              </span>
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="font-mono text-sm text-aureum mb-3">02</p>
                  <h3 className="text-xl md:text-3xl font-bold mb-4" style={{ letterSpacing: '-0.02em' }}>
                    {t.processCard2Title}
                  </h3>
                  <p className="text-graphite leading-relaxed">
                    {t.processCard2Desc}
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <NetworkAnimation />
                </div>
              </div>
            </div>

            {/* Card 3 — Deploy & Iterate */}
            <div
              ref={(el) => (processCards.current[2] = el)}
              className="section-animate relative rounded-[1.25rem] p-5 sm:p-6 md:p-12 overflow-hidden md:sticky md:top-24"
              style={{ backgroundColor: '#1A1A2E' }}
            >
              <span className="absolute top-4 right-4 md:right-6 font-mono text-[5rem] md:text-[10rem] leading-none font-bold text-aureum/[0.06] select-none pointer-events-none">
                03
              </span>
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="font-mono text-sm text-aureum mb-3">03</p>
                  <h3 className="text-xl md:text-3xl font-bold mb-4" style={{ letterSpacing: '-0.02em' }}>
                    {t.processCard3Title}
                  </h3>
                  <p className="text-graphite leading-relaxed">
                    {t.processCard3Desc}
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-full max-w-xs">
                    <ProgressBarAnimation />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════ CTA — "The Ignition" ═══════ */}
      <section id="contact" className="relative py-20 md:py-40 px-4 overflow-hidden">
        {/* Radial gold glow from top (inverted hero) */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'radial-gradient(ellipse at 50% -20%, rgba(200,164,86,0.08) 0%, transparent 60%)',
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-6 section-animate">
          <p className="font-mono text-sm tracking-[0.2em] text-aureum uppercase">
            {t.ctaPrehead}
          </p>
          <h2 className="text-2xl md:text-5xl font-bold" style={{ letterSpacing: '-0.02em' }}>
            {t.ctaHeadline}
            <span className="font-drama italic text-aureum">{t.ctaHeadlineAccent}</span>
          </h2>
          <p className="text-base md:text-lg text-graphite max-w-2xl leading-relaxed">
            {t.ctaDesc}
          </p>

          {/* Oversized CTA with gold ping on hover */}
          <div className="relative mt-4 group">
            <span
              className="absolute inset-0 rounded-full bg-aureum opacity-0 group-hover:opacity-100 pointer-events-none"
              style={{ animation: 'gold-ping 0.6s ease-out forwards' }}
              key={undefined}
            />
            <MagneticButton
              className="relative bg-aureum text-obsidian font-semibold px-8 py-4 md:px-10 md:py-5 text-sm md:text-lg rounded-full cursor-pointer"
              onClick={() => setModalOpen(true)}
            >
              {t.ctaButton}
            </MagneticButton>
          </div>

          <p className="text-sm text-graphite">
            {t.ctaDisclaimer}
          </p>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════ FOOTER — "Ground Control" ═══════ */}
      <footer className="bg-obsidian rounded-t-[2rem] pt-16 pb-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mb-12">
            {/* Column 1 — Logo & tagline */}
            <div>
              <img src={LOGO_FULL} alt="Emmoni Consulting" className="h-20 mb-5 object-contain" />
              <p className="text-base text-graphite leading-relaxed">
                {t.footerTagline}
              </p>
            </div>

            {/* Column 2 — Navigation */}
            <div className="text-center">
              <p className="font-mono text-xs tracking-wider text-graphite uppercase mb-4">{t.footerNavTitle}</p>
              <ul className="space-y-2">
                {footerLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-ash hover:text-aureum transition-colors duration-300 relative group"
                    >
                      {link.label}
                      <span className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-px w-0 bg-aureum transition-all duration-300 group-hover:w-full" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 — Contact & Status */}
            <div className="text-center">
              <p className="font-mono text-xs tracking-wider text-graphite uppercase mb-4">{t.footerContactTitle}</p>
              <div className="space-y-2 mb-6">
                <a href="mailto:hello@emmoni.com" className="inline-flex items-center gap-2 text-sm text-ash hover:text-aureum transition-colors duration-300">
                  <Mail size={14} className="text-graphite" />
                  hello@emmoni.com
                </a>
              </div>
              <div className="inline-flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full bg-green-500"
                  style={{ animation: 'pulse-green 2s ease-in-out infinite' }}
                />
                <span className="font-mono text-xs text-graphite">{t.footerStatus}</span>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="pt-6 text-center"
            style={{ borderTop: '1px solid rgba(200,164,86,0.1)' }}
          >
            <p className="text-xs text-graphite">
              {t.footerCopyright}
            </p>
          </div>
        </div>
      </footer>

      {/* ═══════ CONTACT MODAL ═══════ */}
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}

export default App
