'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Settings, FileText, Menu, X, GitBranch } from 'lucide-react'
import { useState, useEffect } from 'react'
import SidebarBranches from './sidebar-branches'
import { useBranch } from '@/app/context/BranchContext'
import { navLinks, WhatsAppIcon } from './nav-config'

export default function DashboardNav() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const { subscriptionTier } = useBranch()
  const isBusiness = subscriptionTier === 'business'

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  return (
    <>


      {/* Mobile Hamburger Button */}
      <motion.button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-white/5 transition-colors"
        aria-label="Toggle navigation menu"
      >
        <AnimatePresence mode="wait">
          {mobileMenuOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-5 h-5 text-[#eaebe9]" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-5 h-5 text-[#eaebe9]" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Mobile Branch Sidebar toggle — Business plan only */}
      {isBusiness && (
        <motion.button
          onClick={() => setMobileSidebarOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Switch branch"
          title="Switch branch"
        >
          <GitBranch className="w-5 h-5 text-[#a9aca9]" />
        </motion.button>
      )}

      {/* Mobile Sidebar Overlay */}
      <div className="md:hidden">
        <SidebarBranches
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />
      </div>

      {/* Mobile Menu — fixed full-width panel below the header */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 z-[200] bg-black/60"
            />
            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="md:hidden fixed top-[60px] left-0 right-0 z-[210] bg-[#0c0f0e] border-b border-white/8 shadow-2xl overflow-y-auto"
              style={{ maxHeight: 'calc(100vh - 60px)' }}
            >
              <div className="flex flex-col gap-1 p-4">
                {navLinks.map((link) => {
                  const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href)
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`relative flex items-center gap-2 px-3.5 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ease-out group w-full ${
                        isActive
                          ? 'text-[#1fce7e] bg-[#1fce7e]/8'
                          : 'text-[#a9aca9] hover:text-[#eaebe9] hover:bg-white/5'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-full bg-[#1fce7e]" />
                      )}
                      {link.isWhatsApp
                        ? <WhatsAppIcon className={`w-[15px] h-[15px] ${isActive ? '' : 'opacity-60'}`} />
                        : Icon && <Icon className={`w-[15px] h-[15px] ${isActive ? 'text-[#1fce7e]' : ''}`} />
                      }
                      {link.label}
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
