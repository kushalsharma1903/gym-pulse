'use client'

import { useBranch } from '@/app/context/BranchContext'
import { motion } from 'framer-motion'
import { Plus, Check, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SidebarBranches() {
  const { currentGym, allGyms, switchBranch, isLoading, subscriptionTier } = useBranch()
  const router = useRouter()
  const [showToast, setShowToast] = useState(false)
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    // restore sidebar state
    const saved = localStorage.getItem('sidebar_open')
    if (saved !== null) setIsOpen(saved === 'true')

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

  const toggleSidebar = () => {
    const next = !isOpen
    setIsOpen(next)
    localStorage.setItem('sidebar_open', String(next))
  }

  if (isLoading) {
    return (
      <div className={`hidden md:flex flex-col shrink-0 border-r border-white/8 sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto m-0 transition-all duration-300 ease-in-out ${isOpen ? 'w-64 px-4 py-8' : 'w-[80px] px-3 py-8 items-center'}`}>
        <div className="animate-pulse space-y-3 px-2 w-full">
          <div className="h-4 bg-white/5 rounded w-20" />
          <div className="h-8 bg-white/5 rounded-lg w-full" />
        </div>
      </div>
    )
  }

  const isBusiness = subscriptionTier === 'business'
  const reachedLimit = allGyms.length >= 3

  return (
    <div className={`hidden md:flex flex-col shrink-0 border-r border-white/8 sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto m-0 transition-all duration-300 ease-in-out gap-3 relative overflow-x-hidden ${isOpen ? 'w-64 px-4 py-8' : 'w-[80px] px-3 py-8 items-center'}`}>
      
      {/* Toggle Button */}
      <div className={`flex items-center mb-2 ${isOpen ? 'justify-between px-2' : 'justify-center w-full'}`}>
        {isOpen && (
          <h3 className="text-xs font-bold text-[#a9aca9] uppercase tracking-wider">
            Branches
          </h3>
        )}
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
      
      <div className="space-y-1 w-full flex flex-col items-center">
        {allGyms.map((gym) => {
          const isActive = currentGym?.id === gym.id
          return (
            <button
              key={gym.id}
              onClick={() => switchBranch(gym.id)}
              title={!isOpen ? gym.gym_name : undefined}
              className={`w-full flex items-center ${isOpen ? 'justify-between px-3 py-2.5' : 'justify-center py-2.5 px-0'} rounded-lg text-sm transition-all text-left ${
                isActive 
                  ? 'bg-[#1fce7e]/10 text-[#1fce7e] font-semibold ring-1 ring-[#1fce7e]/20' 
                  : 'text-[#eaebe9] hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <MapPin className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#1fce7e]' : 'text-[#737674]'}`} />
                {isOpen && <span className="truncate">{gym.gym_name}</span>}
              </div>
              {isOpen && isActive && <Check className="w-4 h-4 shrink-0 text-[#1fce7e]" />}
            </button>
          )
        })}
      </div>

      {/* Add Branch Button or Upgrade Prompt */}
      <div className={`pt-2 w-full flex flex-col items-center flex-shrink-0 ${isOpen ? 'px-2' : ''}`}>
        {isBusiness ? (
          reachedLimit ? (
            isOpen ? (
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
              onClick={() => router.push('/onboarding/setup?new_branch=true')}
              title={!isOpen ? "Add Branch" : undefined}
              className={`flex items-center justify-center gap-2 text-sm text-[#1fce7e] font-semibold py-2 hover:bg-[#1fce7e]/10 rounded-lg transition-colors border border-dashed border-[#1fce7e]/30 hover:border-[#1fce7e]/50 ${isOpen ? 'w-full' : 'w-full px-0'}`}
            >
              <Plus className="w-4 h-4 shrink-0" />
              {isOpen && "Add Branch"}
            </button>
          )
        ) : (
          isOpen ? (
            <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-xs w-full">
              <p className="text-[#a9aca9] mb-2 leading-relaxed">
                Managing multiple locations?
              </p>
              <button
                onClick={() => router.push('/dashboard/settings?upgrade=true')}
                className="text-[#1fce7e] font-semibold hover:underline"
              >
                Upgrade for multi-branch
              </button>
            </div>
          ) : (
             <button
                onClick={() => router.push('/dashboard/settings?upgrade=true')}
                title="Upgrade for multi-branch"
                className="w-full flex items-center justify-center py-2 hover:bg-white/5 rounded-lg text-zinc-500 transition-colors border border-white/10"
             >
                <Plus className="w-4 h-4 shrink-0" />
             </button>
          )
        )}
      </div>

      {showToast && (
        <div 
          className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#0f1a14] shadow-2xl shadow-emerald-900/40 text-sm font-semibold text-emerald-300"
          style={{ borderLeft: '3px solid #1FCE7E', border: '1px solid rgba(31,206,126,0.3)', borderLeftWidth: 3, borderLeftColor: '#1FCE7E' }}
        >
          <Check className="h-5 w-5 text-emerald-400" />
          Branch created! Click it in the sidebar to switch.
        </div>
      )}
    </div>
  )
}
