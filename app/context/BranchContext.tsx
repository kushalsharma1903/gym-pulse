'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export type Gym = { 
  id: string
  gym_name: string
  owner_id: string
  phone?: string
  whatsapp_number?: string
  wa_template?: string
  [key: string]: any 
}

type BranchContextType = {
  currentGym: Gym | null
  allGyms: Gym[]
  switchBranch: (gymId: string) => void
  isLoading: boolean
  subscriptionTier: string
}

const BranchContext = createContext<BranchContextType | undefined>(undefined)

export function BranchProvider({ 
  children, 
  initialGymId,
  subscriptionTier 
}: { 
  children: React.ReactNode
  initialGymId?: string | null
  subscriptionTier: string
}) {
  const [currentGym, setCurrentGym] = useState<Gym | null>(null)
  const [allGyms, setAllGyms] = useState<Gym[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function loadGyms() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setIsLoading(false)
        return
      }

      const { data: gyms } = await supabase
        .from('gyms')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: true })

      if (gyms && gyms.length > 0) {
        setAllGyms(gyms)
        
        // Use initialGymId from cookie if provided, otherwise fallback to localStorage
        const savedId = initialGymId || localStorage.getItem('selected_gym_id')
        let active = gyms.find(g => g.id === savedId)
        
        if (!active) {
          active = gyms[0]
        }
        
        setCurrentGym(active)
        localStorage.setItem('selected_gym_id', active.id)
        document.cookie = `selected_gym_id=${active.id}; path=/; max-age=31536000` // 1 year
      }
      setIsLoading(false)
    }

    loadGyms()
  }, [initialGymId, supabase])

  const switchBranch = (gymId: string) => {
    const target = allGyms.find(g => g.id === gymId)
    if (target) {
      setCurrentGym(target)
      localStorage.setItem('selected_gym_id', gymId)
      document.cookie = `selected_gym_id=${gymId}; path=/; max-age=31536000`
      window.location.reload()
    }
  }

  return (
    <BranchContext.Provider value={{ currentGym, allGyms, switchBranch, isLoading, subscriptionTier }}>
      {children}
    </BranchContext.Provider>
  )
}

export function useBranch() {
  const context = useContext(BranchContext)
  if (context === undefined) {
    throw new Error('useBranch must be used within a BranchProvider')
  }
  return context
}
