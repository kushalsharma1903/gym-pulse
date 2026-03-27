'use client'

import { useBranch } from '@/app/context/BranchContext'
import { Plus, Check, MapPin, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { navLinks, WhatsAppIcon } from './nav-config'

interface SidebarBranchesProps {
  /** Mobile-only: whether the overlay is open (controlled by parent) */
  mobileOpen?: boolean
  /** Mobile-only: callback to close the overlay */
  onMobileClose?: () => void
}

export default function SidebarBranches({ mobileOpen = false, onMobileClose }: SidebarBranchesProps) {
  const { currentGym, allGyms, switchBranch, isLoading, subscriptionTier } = useBranch()
  const router = useRouter()
  const pathname = usePathname()
  const [showToast, setShowToast] = useState(false)
  const [isOpen, setIsOpen] = useState(true) // desktop collapsible state

  useEffect(() => {
    // Always start desktop sidebar expanded on page load
    localStorage.setItem('sidebar_open', 'true')
    setIsOpen(true)

    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('branch_added') === '1') {
        setShowToast(true)
        const t = setTimeout(() => setShowToast(false), 4500)
        window.history.replaceState({}, '', '/dashboard')
        return () => clearTimeout(t)
      }
    }
  }, [])

  const toggleDesktop = () => {
    const next = !isOpen
    setIsOpen(next)
    localStorage.setItem('sidebar_open', String(next))
  }

  const isBusiness = subscriptionTier === 'business'
  const reachedLimit = allGyms.length >= 3

  // ─── Shared inner content ────────────────────────────────────────────────────
  const branchList = (alwaysShowLabel = true) => (
    <div className="space-y-1 w-full flex flex-col items-center">
      {allGyms.map((gym) => {
        const isActive = currentGym?.id === gym.id
        return (
          <button
            key={gym.id}
            onClick={() => {
              switchBranch(gym.id)
              onMobileClose?.()
            }}
            title={!alwaysShowLabel ? gym.gym_name : undefined}
            className={`w-full flex items-center ${alwaysShowLabel ? 'justify-between px-3 py-2.5' : 'justify-center py-2.5 px-0'} rounded-lg text-sm transition-all text-left ${
              isActive
                ? 'bg-[#1fce7e]/10 text-[#1fce7e] font-semibold ring-1 ring-[#1fce7e]/20'
                : 'text-[#eaebe9] hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <MapPin className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#1fce7e]' : 'text-[#737674]'}`} />
              {alwaysShowLabel && <span className="truncate">{gym.gym_name}</span>}
            </div>
            {alwaysShowLabel && isActive && <Check className="w-4 h-4 shrink-0 text-[#1fce7e]" />}
          </button>
        )
      })}
    </div>
  )

  const addBranchButton = (fullWidth = true) =>
    isBusiness ? (
      reachedLimit ? (
        fullWidth ? (
          <div className="text-xs text-[#a9aca9] flex items-center gap-2 bg-white/5 px-3 py-2 rounded-md w-full">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0" />
            Branch limit reached (3/3)
          </div>
        ) : (
          <div className="w-full flex justify-center py-2 bg-white/5 rounded-md" title="Branch limit reached (3/3)">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0" />
          </div>
        )
      ) : (
        <button
          onClick={() => {
            router.push('/onboarding/setup?new_branch=true')
            onMobileClose?.()
          }}
          title={!fullWidth ? 'Add Branch' : undefined}
          className={`flex items-center justify-center gap-2 text-sm text-[#1fce7e] font-semibold py-2 hover:bg-[#1fce7e]/10 rounded-lg transition-colors border border-dashed border-[#1fce7e]/30 hover:border-[#1fce7e]/50 ${fullWidth ? 'w-full' : 'w-full px-0'}`}
        >
          <Plus className="w-4 h-4 shrink-0" />
          {fullWidth && 'Add Branch'}
        </button>
      )
    ) : (
      fullWidth ? (
        <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-xs w-full">
          <p className="text-[#a9aca9] mb-2 leading-relaxed">Managing multiple locations?</p>
          <button
            onClick={() => { router.push('/dashboard/settings?upgrade=true'); onMobileClose?.() }}
            className="text-[#1fce7e] font-semibold hover:underline"
          >
            Upgrade for multi-branch
          </button>
        </div>
      ) : (
        <button
          onClick={() => { router.push('/dashboard/settings?upgrade=true'); onMobileClose?.() }}
          title="Upgrade for multi-branch"
          className="w-full flex items-center justify-center py-2 hover:bg-white/5 rounded-lg text-zinc-500 transition-colors border border-white/10"
        >
          <Plus className="w-4 h-4 shrink-0" />
        </button>
      )
    )

  // ─── Loading skeleton ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className={`hidden md:flex flex-col shrink-0 sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto m-0 transition-all duration-300 ease-in-out ${isOpen ? 'w-64 px-4 py-8' : 'w-[80px] px-3 py-8 items-center'}`}>
        <div className="animate-pulse space-y-3 px-2 w-full">
          <div className="h-4 bg-white/5 rounded w-20" />
          <div className="h-8 bg-white/5 rounded-lg w-full" />
        </div>
      </div>
    )
  }

  return (
    <>
      {/* ── MOBILE OVERLAY ────────────────────────────────────────── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          {/* Drawer */}
          <div className="md:hidden fixed top-0 left-0 z-[310] h-screen w-[260px] bg-[#0c0f0e] flex flex-col gap-3 px-4 py-6 shadow-2xl overflow-y-auto">
            {/* Header row */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-[#a9aca9] uppercase tracking-wider">Branches</h3>
              <button
                onClick={onMobileClose}
                className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {branchList(true)}
            <div className="pt-2 w-full">
              {addBranchButton(true)}
            </div>
          </div>
        </>
      )}

      {/* ── DESKTOP SIDEBAR ──────────────────────────────────────── */}
      <div className={`hidden md:flex flex-col shrink-0 sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto m-0 transition-all duration-300 ease-in-out gap-3 overflow-x-hidden ${isOpen ? 'w-64 px-4 py-8' : 'w-[80px] px-3 py-8 items-center'}`}>

        {/* Toggle button & Main Navigation */}
        <div className={`flex items-center mb-2 ${isOpen ? 'justify-between px-2' : 'justify-center w-full'}`}>
          {isOpen && (
            <h3 className="text-xs font-bold text-[#a9aca9] uppercase tracking-wider">Menu</h3>
          )}
          <button
            onClick={toggleDesktop}
            className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            title={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <div className="space-y-1 w-full flex flex-col items-center mb-4">
          {navLinks.map((link) => {
            const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href)
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                title={!isOpen ? link.label : undefined}
                className={`relative flex items-center ${isOpen ? 'justify-start px-3' : 'justify-center px-0'} py-2.5 w-full text-sm font-semibold rounded-lg transition-all duration-200 ease-out group ${
                  isActive
                    ? 'text-[#1fce7e] bg-[#1fce7e]/10 ring-1 ring-[#1fce7e]/20'
                    : 'text-[#a9aca9] hover:text-[#eaebe9] hover:bg-white/5'
                }`}
              >
                {isActive && isOpen && (
                  <motion.span
                    layoutId="sidebar-active-bar"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-full bg-[#1fce7e]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <div className={`flex items-center gap-3 truncate ${!isOpen ? 'justify-center mx-auto' : ''}`}>
                  {link.isWhatsApp
                    ? <WhatsAppIcon className={`w-[16px] h-[16px] shrink-0 transition-transform duration-200 ${isActive ? '' : 'opacity-60 group-hover:opacity-100'}`} />
                    : Icon && <Icon className={`w-[16px] h-[16px] shrink-0 transition-transform duration-200 ${isActive ? 'text-[#1fce7e]' : ''}`} />
                  }
                  {isOpen && <span className="truncate">{link.label}</span>}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Branches Header */}
        {isOpen && (
          <div className="flex items-center justify-between px-2 mb-1 mt-2">
            <h3 className="text-xs font-bold text-[#a9aca9] uppercase tracking-wider">Branches</h3>
          </div>
        )}

        {branchList(isOpen)}

        <div className={`pt-2 w-full flex flex-col items-center flex-shrink-0 ${isOpen ? 'px-2' : ''}`}>
          {addBranchButton(isOpen)}
        </div>
      </div>

      {/* ── TOAST ────────────────────────────────────────────────── */}
      {showToast && (
        <div
          className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#0f1a14] shadow-2xl shadow-emerald-900/40 text-sm font-semibold text-emerald-300"
          style={{ border: '1px solid rgba(31,206,126,0.3)', borderLeftWidth: 3, borderLeftColor: '#1FCE7E' }}
        >
          <Check className="h-5 w-5 text-emerald-400" />
          Branch created! Click it in the sidebar to switch.
        </div>
      )}
    </>
  )
}
