'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface GymContextType {
  gymName: string
  logoUrl: string | null
  updateGymDetails: (details: { gymName?: string; logoUrl?: string | null }) => void
}

const GymContext = createContext<GymContextType | undefined>(undefined)

export function GymProvider({ 
  children, 
  initialGymName, 
  initialLogoUrl 
}: { 
  children: ReactNode
  initialGymName: string
  initialLogoUrl: string | null
}) {
  const [gymName, setGymName] = useState(initialGymName)
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl)

  const updateGymDetails = (details: { gymName?: string; logoUrl?: string | null }) => {
    if (details.gymName !== undefined) setGymName(details.gymName)
    if (details.logoUrl !== undefined) setLogoUrl(details.logoUrl)
  }

  return (
    <GymContext.Provider value={{ gymName, logoUrl, updateGymDetails }}>
      {children}
    </GymContext.Provider>
  )
}

export function useGym() {
  const context = useContext(GymContext)
  if (context === undefined) {
    throw new Error('useGym must be used within a GymProvider')
  }
  return context
}
