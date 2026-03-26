'use client'

import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'

export default function BrandBadge() {
  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900/60 group hover:border-zinc-500 cursor-default"
    >
      <div className="flex items-center justify-center">
        <Activity className="h-3.5 w-3.5 text-emerald-500 group-hover:text-emerald-400 transition-all duration-200" />
      </div>
      <span className="text-[11px] font-semibold text-zinc-400 tracking-wide group-hover:text-white transition-colors">
        GymPulse
      </span>
    </motion.div>
  )
}
