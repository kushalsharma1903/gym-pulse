'use client'

import { useBranch } from '@/app/context/BranchContext'
import { motion } from 'framer-motion'
import { Plus, Check, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SidebarBranches() {
  const { currentGym, allGyms, switchBranch, isLoading, subscriptionTier } = useBranch()
  const router = useRouter()
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
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

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3 px-2">
        <div className="h-4 bg-white/5 rounded w-20" />
        <div className="h-8 bg-white/5 rounded-lg w-full" />
      </div>
    )
  }

  const isBusiness = subscriptionTier === 'business'
  const reachedLimit = allGyms.length >= 3

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-bold text-[#a9aca9] px-2 uppercase tracking-wider">
        Branches
      </h3>
      
      <div className="space-y-1">
        {allGyms.map((gym) => {
          const isActive = currentGym?.id === gym.id
          return (
            <button
              key={gym.id}
              onClick={() => switchBranch(gym.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all text-left ${
                isActive 
                  ? 'bg-[#1fce7e]/10 text-[#1fce7e] font-semibold ring-1 ring-[#1fce7e]/20' 
                  : 'text-[#eaebe9] hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <MapPin className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#1fce7e]' : 'text-[#737674]'}`} />
                <span className="truncate">{gym.gym_name}</span>
              </div>
              {isActive && <Check className="w-4 h-4 shrink-0 text-[#1fce7e]" />}
            </button>
          )
        })}
      </div>

      {/* Add Branch Button or Upgrade Prompt */}
      <div className="px-2 pt-2">
        {isBusiness ? (
          reachedLimit ? (
            <div className="text-xs text-[#a9aca9] flex items-center gap-2 bg-white/5 px-3 py-2 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0" />
              Branch limit reached (3/3)
            </div>
          ) : (
            <button
              onClick={() => router.push('/onboarding/setup?new_branch=true')}
              className="w-full flex items-center justify-center gap-2 text-sm text-[#1fce7e] font-semibold py-2 hover:bg-[#1fce7e]/10 rounded-lg transition-colors border border-dashed border-[#1fce7e]/30 hover:border-[#1fce7e]/50"
            >
              <Plus className="w-4 h-4" />
              Add Branch
            </button>
          )
        ) : (
          <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-xs">
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
