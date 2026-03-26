'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'
import Link from 'next/link'

export default function FinalCTA() {
  return (
    <section className="py-24 lg:py-40 bg-[#080b0a] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#1fce7e]/5 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden p-12 lg:p-20 text-center"
          style={{
            background: 'linear-gradient(135deg, #0e1f18 0%, #0a1510 50%, #080b0a 100%)',
            border: '1px solid rgba(31,206,126,0.15)',
            boxShadow: '0 0 120px -20px rgba(31,206,126,0.15), inset 0 1px 0 rgba(31,206,126,0.08)'
          }}
        >
          {/* Corner glow accents */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#1fce7e]/8 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1fce7e]/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1fce7e]/10 border border-[#1fce7e]/20 mb-8"
          >
            <Zap className="h-3.5 w-3.5 text-[#1fce7e]" />
            <span className="text-[#1fce7e] text-xs font-bold tracking-widest uppercase">Start Today, Free</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-4xl lg:text-6xl font-black text-[#eaebe9] tracking-tight mb-6 leading-[1.05]"
          >
            Ready to stop <br />
            <span className="text-[#1fce7e]">losing revenue?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[#a9aca9] mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Join 50+ independent gyms across India who are saving hours of manual work and never missing a single renewal.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/signup"
              className="group flex items-center justify-center gap-2 rounded-full px-10 py-4 text-base font-bold text-[#080b0a] transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #1fce7e, #14ca7a)',
                boxShadow: '0 0 40px rgba(31,206,126,0.4), 0 4px 20px rgba(31,206,126,0.2)'
              }}
            >
              Get Started — It's Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="text-sm font-semibold text-[#a9aca9] hover:text-[#eaebe9] transition-colors duration-200"
            >
              Sign in to existing account →
            </Link>
          </motion.div>

          <div className="mt-12 pt-8 border-t border-white/5">
            <p className="text-xs font-semibold text-[#737674] uppercase tracking-[0.15em]">
              No credit card · 30-day free trial · Cancel anytime
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
