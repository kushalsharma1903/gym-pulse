'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import DashboardNav from './dashboard-nav'
import BrandBadge from './brand-badge'
import { useGym } from './gym-context'

export default function DashboardHeader() {
  const { gymName, logoUrl } = useGym()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="sticky top-0 z-[100] bg-[#080b0a]/80 backdrop-blur-2xl transition-all duration-300"
      style={{
        borderBottom: isScrolled
          ? '1px solid rgba(242,239,233,0.08)'
          : '1px solid transparent',
      }}
    >
      {/* Ultra-thin bottom border using gradient line (Kinetic Obsidian pattern) */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1fce7e]/10 to-transparent pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-[56px] md:h-[60px] flex items-center justify-between gap-4 md:gap-0 relative">
        {/* Logo + Gym Name */}
        <motion.div
          whileHover={{ y: -0.5 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="flex-shrink-0 will-change-transform"
        >
          <Link
            href="/dashboard"
            className="flex items-center gap-2 md:gap-3 transition-opacity hover:opacity-90"
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={gymName || 'Gym Logo'}
                className="h-8 w-8 rounded-lg object-cover border border-white/8"
              />
            ) : (
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#1fce7e] to-[#14ca7a] flex items-center justify-center font-black text-[#080b0a] text-sm shadow-[0_0_12px_rgba(31,206,126,0.3)]">
                {(gymName || 'G')[0]}
              </div>
            )}
            <span className="text-sm md:text-[15px] font-bold text-[#eaebe9] tracking-tight truncate">
              {gymName}
            </span>
          </Link>
        </motion.div>

        {/* Right side: Nav + Brand Badge */}
        <div className="flex items-center gap-2 md:gap-3 ml-auto">
          <div className="relative">
            <DashboardNav />
          </div>
          {/* Thin separator (hidden on mobile) */}
          <div className="hidden md:block w-px h-5 bg-white/6 mx-2" />
          {/* Brand Badge (hidden on mobile, shown on md and up) */}
          <div className="hidden md:flex">
            <BrandBadge />
          </div>
        </div>
      </div>
    </header>
  )
}
