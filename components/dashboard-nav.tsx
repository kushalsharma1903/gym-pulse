'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Settings, FileText, Menu, X, GitBranch } from 'lucide-react'
import { useState, useEffect } from 'react'
import SidebarBranches from './sidebar-branches'
import { useBranch } from '@/app/context/BranchContext'

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#25D366" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.534 5.857L.057 23.625l5.907-1.547A11.956 11.956 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.214-3.713.973.991-3.624-.235-.373A9.818 9.818 0 1112 21.818z"/>
    </svg>
  )
}

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/messages', label: 'Messages', icon: null, isWhatsApp: true },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText, exact: false },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings, exact: false },
]

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
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-1">
        {links.map((link) => {
          const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href)
          const Icon = link.icon
          return (
            <motion.div
              key={link.href}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              <Link
                href={link.href}
                className={`relative flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ease-out group w-full md:w-auto ${
                  isActive
                    ? 'text-[#1fce7e] bg-[#1fce7e]/8'
                    : 'text-[#a9aca9] hover:text-[#eaebe9] hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-bar-desktop"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-full bg-[#1fce7e]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                {link.isWhatsApp
                  ? <WhatsAppIcon className={`w-[15px] h-[15px] transition-transform duration-200 ${isActive ? '' : 'opacity-60 group-hover:opacity-100'}`} />
                  : Icon && <Icon className={`w-[15px] h-[15px] transition-transform duration-200 ${isActive ? 'text-[#1fce7e]' : ''}`} />
                }
                {link.label}
              </Link>
            </motion.div>
          )
        })}
      </nav>

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
      <SidebarBranches
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

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
                {links.map((link) => {
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
