'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, X } from 'lucide-react'
import Paywall from '@/components/paywall'

export default function TrialBanner({ daysLeft }: { daysLeft: number }) {
  const [showPaywall, setShowPaywall] = useState(false)
  const isUrgent = daysLeft <= 5

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`w-full border-b px-4 py-2.5 flex items-center justify-center gap-3 text-[13px] font-semibold tracking-wide relative z-50 ${
          isUrgent
            ? 'bg-[#ff5050]/8 border-[#ff5050]/20 text-[#ff5050]'
            : 'bg-[#ffa028]/8 border-[#ffa028]/20 text-[#ffa028]'
        }`}
      >
        {/* Pulsing indicator dot */}
        <span className="relative flex h-2 w-2 shrink-0">
          <motion.span
            className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isUrgent ? 'bg-[#ff5050]' : 'bg-[#ffa028]'}`}
            animate={{ scale: [1, 1.8, 1], opacity: [0.75, 0, 0.75] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${isUrgent ? 'bg-[#ff5050]' : 'bg-[#ffa028]'}`} />
        </span>

        <span>
          {isUrgent
            ? `⚡ Only ${daysLeft} day${daysLeft !== 1 ? 's' : ''} left in your trial`
            : `${daysLeft} days left in your free trial`}
          {' — '}
        </span>

        <button
          onClick={() => setShowPaywall(true)}
          className="inline-flex items-center gap-1 font-bold underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          <Zap className="h-3 w-3" />
          Upgrade now
        </button>
      </motion.div>

      {/* Dismissible Paywall Modal — only shown during active trial */}
      <AnimatePresence>
        {showPaywall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-[#080b0a]/95 backdrop-blur-md overflow-y-auto"
          >
            {/* Close button — top RIGHT, clearly separated from the Home/Sign Out which are on the LEFT inside Paywall */}
            <motion.button
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.2 }}
              onClick={() => setShowPaywall(false)}
              className="fixed top-4 right-5 z-[210] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-xs font-semibold"
              aria-label="Back to dashboard"
            >
              <X className="h-3.5 w-3.5" />
              Close
            </motion.button>

            {/* Paywall in upgrade mode — different headline, same pricing */}
            <Paywall mode="upgrade" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
