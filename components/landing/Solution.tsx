'use client'

import { motion } from 'framer-motion'
import { MessageSquare, LayoutDashboard, Zap, Check } from 'lucide-react'

const solutions = [
  {
    title: "Auto WhatsApp Reminders",
    description: "Send professional renewal reminders in one click directly to members' WhatsApp. No manual messaging ever again.",
    icon: MessageSquare,
  },
  {
    title: "Expiry Command Center",
    description: "A single, clear dashboard that tells you exactly who is expiring today. No more digging through papers.",
    icon: LayoutDashboard,
  },
  {
    title: "One-Click Renewals",
    description: "Click renew, update the date, and you're done. Revenue tracking and member logs update instantly.",
    icon: Zap,
  }
]

export default function Solution() {
  return (
    <section id="solution" className="py-24 lg:py-32 bg-[#0c0f0e] relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-[#1fce7e]/15 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          {/* Left: Content */}
          <div className="w-full lg:w-1/2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-full border border-[#1fce7e]/20 bg-[#1fce7e]/8 px-4 py-1.5"
            >
              <Check className="h-3 w-3 text-[#1fce7e]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#1fce7e]">The Solution</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-6xl font-black text-[#eaebe9] tracking-tight leading-[1.05]"
            >
              Run your gym like <br className="hidden lg:block" />
              a <span className="text-[#1fce7e]">business</span>,
              <br className="hidden lg:block" /> not a register.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-[#a9aca9] max-w-xl leading-relaxed"
            >
              GymPulse gives independent gyms the tools to run professionally — from automated follow-ups to daily revenue tracking.
            </motion.p>

            <div className="space-y-5 pt-2">
              {solutions.map((s, index) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + (index * 0.1) }}
                  className="flex items-start gap-4 group"
                >
                  <div
                    className="mt-0.5 h-9 w-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 group-hover:shadow-[0_0_16px_rgba(31,206,126,0.2)]"
                    style={{
                      background: 'rgba(31,206,126,0.08)',
                      border: '1px solid rgba(31,206,126,0.15)',
                    }}
                  >
                    <s.icon className="h-4 w-4 text-[#1fce7e]" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-[#eaebe9] mb-1">{s.title}</h3>
                    <p className="text-sm text-[#a9aca9] leading-relaxed">{s.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Visual mockup */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative p-2 rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(31,206,126,0.04)',
                border: '1px solid rgba(31,206,126,0.12)',
                boxShadow: '0 0 80px -20px rgba(31,206,126,0.15)'
              }}
            >
              {/* macOS dots */}
              <div
                className="rounded-xl overflow-hidden"
                style={{ background: '#0e1210' }}
              >
                <div className="flex items-center gap-1.5 px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }} />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginLeft: 8 }}>GymPulse Dashboard</span>
                </div>

                <div className="p-5 flex flex-col gap-3">
                  {/* KPI card */}
                  <div
                    className="rounded-xl p-4"
                    style={{ background: 'rgba(31,206,126,0.06)', border: '1px solid rgba(31,206,126,0.15)' }}
                  >
                    <div style={{ fontSize: 9, color: '#737674', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Expiring Today</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#eaebe9', lineHeight: 1 }}>
                      12 <span style={{ fontSize: 13, fontWeight: 500, color: '#1fce7e' }}>members</span>
                    </div>
                  </div>

                  {/* Member rows */}
                  {[
                    { name: 'Nikhil Sharma', plan: 'Premium', status: 'Expiring', color: '#FFA028', bg: 'rgba(255,160,40,0.1)' },
                    { name: 'Rahul Verma', plan: 'Standard', status: 'Active', color: '#1fce7e', bg: 'rgba(31,206,126,0.1)' },
                    { name: 'Meera Gupta', plan: 'Premium', status: 'Expired', color: '#FF5050', bg: 'rgba(255,80,80,0.1)' },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          style={{
                            width: 28, height: 28, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #1fce7e, #14ca7a)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 10, fontWeight: 700, color: '#080b0a', flexShrink: 0
                          }}
                        >
                          {row.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#eaebe9' }}>{row.name}</div>
                          <div style={{ fontSize: 10, color: '#737674' }}>{row.plan}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 10, fontWeight: 600, color: row.color, background: row.bg, padding: '2px 8px', borderRadius: 4 }}>
                          {row.status}
                        </span>
                        <div
                          style={{ fontSize: 10, color: '#25D366', padding: '3px 8px', background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
                        >
                          WA
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
