"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { GlowingEffect } from "@/components/ui/glowing-effect"

const testimonials = [
  {
    quote: "Finally stopped losing track of renewals. GymPulse sends the WhatsApp reminder and I just show up to collect.",
    name: "Rahul Kapoor",
    role: "FitZone Gym",
    location: "Delhi",
    initials: "RK",
  },
  {
    quote: "Setup took less than 5 minutes. Now I can see my entire member list, who's expiring, and my revenue all in one place.",
    name: "Priya Sharma",
    role: "Iron House",
    location: "Gurugram",
    initials: "PS",
  },
  {
    quote: "The revenue reports are exactly what I needed. No more guessing how much came in last month.",
    name: "Amit Verma",
    role: "PowerFit Studio",
    location: "Noida",
    initials: "AV",
  },
]

export default function Testimonials() {
  return (
    <section className="py-24 sm:py-32 bg-[#080b0a] relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-[#1fce7e]/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 bg-[#1fce7e]/10 border border-[#1fce7e]/20 text-[#1fce7e] text-xs font-bold tracking-widest uppercase rounded-full mb-5">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#eaebe9] tracking-tight">
            Gym owners love <span className="text-[#1fce7e]">GymPulse</span>
          </h2>
          <p className="mt-4 text-[#a9aca9] text-lg max-w-xl mx-auto leading-relaxed">
            Real feedback from gym owners across India who switched from spreadsheets.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-2xl overflow-hidden group"
              style={{
                background: '#0e1210',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
              <div className="absolute inset-0 bg-gradient-to-br from-[#1fce7e]/3 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 p-6 flex flex-col h-full">
                {/* Stars */}
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 text-[#1fce7e] fill-[#1fce7e]" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-[#a9aca9] text-sm leading-relaxed mb-6 flex-1">
                  "{t.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-5 border-t border-white/5">
                  <div
                    className="h-9 w-9 rounded-full flex items-center justify-center text-[#080b0a] text-xs font-black flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #1fce7e, #14ca7a)' }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-[#eaebe9] font-semibold text-sm">{t.name}</p>
                    <p className="text-[#737674] text-xs">{t.role} · {t.location}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
