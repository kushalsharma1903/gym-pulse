'use client'

import { motion } from 'framer-motion'
import { AlertCircle, Clock, TrendingDown } from 'lucide-react'

const problems = [
  {
    title: "Missed Renewals = Lost Revenue",
    description: "Every time a member's expiry goes unnoticed, you lose money. Manual tracking is the #1 reason for gym revenue leakage.",
    icon: TrendingDown,
    iconBg: "rgba(255,80,80,0.08)",
    iconBorder: "rgba(255,80,80,0.15)",
    iconColor: "#FF5050",
    label: "Revenue risk",
    labelColor: "rgba(255,80,80,0.1)",
    labelText: "#FF5050",
  },
  {
    title: "Manual Tracking is Chaos",
    description: "Registers and Excel sheets are slow, error-prone, and impossible to search quickly when a member walks in.",
    icon: Clock,
    iconBg: "rgba(255,160,40,0.08)",
    iconBorder: "rgba(255,160,40,0.15)",
    iconColor: "#FFA028",
    label: "Time wasted",
    labelColor: "rgba(255,160,40,0.1)",
    labelText: "#FFA028",
  },
  {
    title: "Zero Expiry Visibility",
    description: "If you don't know who is expiring today, tomorrow, or next week — you're always playing catch-up with your own business.",
    icon: AlertCircle,
    iconBg: "rgba(255,255,255,0.04)",
    iconBorder: "rgba(255,255,255,0.08)",
    iconColor: "#a9aca9",
    label: "Blind spots",
    labelColor: "rgba(255,255,255,0.06)",
    labelText: "#a9aca9",
  }
]

export default function PainPoints() {
  return (
    <section id="problem" className="py-24 lg:py-32 relative overflow-hidden bg-[#080b0a]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-white/6 to-transparent" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#FF5050]/3 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="inline-block px-3 py-1 bg-[#FF5050]/10 border border-[#FF5050]/20 text-[#FF5050] text-xs font-bold tracking-widest uppercase rounded-full mb-5">
            The Problem
          </span>
          <h2 className="text-3xl lg:text-5xl font-black text-[#eaebe9] tracking-tight mb-5 leading-tight">
            Running a gym on{" "}
            <span className="text-[#737674] line-through decoration-[#FF5050]/40">registers</span>{" "}
            <br className="hidden lg:block" />
            shouldn't cost you{" "}
            <span className="text-[#FF5050]">thousands</span> every month.
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#a9aca9] max-w-2xl mx-auto text-lg leading-relaxed"
          >
            Manual tracking is more than just inconvenient — it's actively hurting your bottom line.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {problems.map((p, index) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-7 rounded-2xl transition-all duration-300"
              style={{
                background: '#0e1210',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Hover tint */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(ellipse at 0% 0%, ${p.iconBg} 0%, transparent 70%)` }} />

              <div className="relative z-10">
                {/* Label chip */}
                <span
                  className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-5"
                  style={{ background: p.labelColor, color: p.labelText }}
                >
                  {p.label}
                </span>

                {/* Icon */}
                <div
                  className="h-11 w-11 rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-200"
                  style={{ background: p.iconBg, border: `1px solid ${p.iconBorder}` }}
                >
                  <p.icon className="h-5 w-5" style={{ color: p.iconColor }} />
                </div>

                <h3 className="text-base font-bold text-[#eaebe9] mb-3 leading-snug">{p.title}</h3>
                <p className="text-[#a9aca9] text-sm leading-relaxed">{p.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
