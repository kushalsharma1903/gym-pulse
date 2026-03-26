import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import OnboardingWelcomeClient from './welcome-client'

export default async function OnboardingPage() {
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

  // Pass the user's display name for a personalised greeting
  const name = user.user_metadata?.full_name?.split(' ')[0] || 'there'

  return <OnboardingWelcomeClient name={name} />
}
