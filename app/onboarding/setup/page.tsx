import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import GymSetupFormClient from './setup-form-client'

export default async function OnboardingSetupPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Safety guard: if gym already exists, skip onboarding
  const { data: gym } = await supabase
    .from('gyms')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle()

  if (gym) redirect('/dashboard')

  return <GymSetupFormClient />
}
