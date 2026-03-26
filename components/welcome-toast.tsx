'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

export default function WelcomeToast({ show }: { show: boolean }) {
  const [visible, setVisible] = useState(show)

  useEffect(() => {
    if (!show) return
    const t = setTimeout(() => setVisible(false), 3500)
    return () => clearTimeout(t)
  }, [show])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#0f1a14] shadow-2xl shadow-emerald-900/40 text-sm font-semibold text-emerald-300 whitespace-nowrap"
          style={{ borderLeft: '3px solid #1FCE7E', border: '1px solid rgba(31,206,126,0.3)', borderLeftWidth: 3, borderLeftColor: '#1FCE7E' }}
        >
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          Your gym is ready! Welcome to GymPulse 🎉
          <button
            onClick={() => setVisible(false)}
            aria-label="Dismiss notification"
            className="ml-1 text-emerald-600 hover:text-emerald-400 transition-colors text-xs font-normal"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
