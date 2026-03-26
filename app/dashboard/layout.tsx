import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardHeader from '@/components/dashboard-header'
import { GymProvider } from '@/components/gym-context'
import Paywall from '@/components/paywall'
import Link from 'next/link'
import TrialBanner from '@/components/trial-banner'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()

  if (!authData?.user) redirect('/')

  // Securely fetch gym context
  const { data: gymData } = await supabase
    .from('gyms')
    .select('id, gym_name, logo_url')
    .eq('owner_id', authData.user.id)
    .single()

  const gymName = gymData?.gym_name || 'GymPulse'
  const logoUrl = gymData?.logo_url || null

  // Subscription context
  let { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status, trial_started_at, subscription_end_date, subscription_tier')
    .eq('id', authData.user.id)
    .single()

  if (!profile) {
    // Fallback: Create missing profile row with trial defaults for new users
    const { data: newProfile } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: authData.user.email || '',
        trial_started_at: new Date().toISOString(),
        trial_days: 30,
        subscription_status: 'trial'
      })
      .select('subscription_status, trial_started_at, subscription_end_date, subscription_tier')
      .single()

    if (newProfile) {
      profile = newProfile
    }
  }

  let hasAccess = false
  let isTrialActive = false
  let trialDaysLeft = 0

  if (profile) {
    const status = profile.subscription_status
    if ((status === 'active' || status === 'cancelled') && profile.subscription_end_date) {
      if (new Date(profile.subscription_end_date) > new Date()) {
        hasAccess = true
      }
    } else if (status === 'trial' && profile.trial_started_at) {
      const start = new Date(profile.trial_started_at)
      const end = new Date(start)
      end.setDate(end.getDate() + 30) // 30 day trial
      const now = new Date()
      if (end > now) {
        hasAccess = true
        isTrialActive = true
        trialDaysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      }
    }
  }

  // If trial expired OR subscription expired OR no profile row match
  if (!hasAccess) {
    return (
       <div className="min-h-screen bg-[#080b0a] text-[#eaebe9] font-sans text-white">
          <Paywall />
       </div>
    )
  }

  return (
    <GymProvider initialGymName={gymName} initialLogoUrl={logoUrl}>
      <div className="min-h-screen bg-[#080b0a] text-[#eaebe9] font-sans" style={{ '--tw-selection-bg': 'rgba(31,206,126,0.2)' } as React.CSSProperties}>
        {isTrialActive && <TrialBanner daysLeft={trialDaysLeft} />}
        <DashboardHeader />
        {children}
      </div>
    </GymProvider>
  )
}
