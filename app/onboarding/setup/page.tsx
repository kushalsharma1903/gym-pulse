import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import GymSetupFormClient from './setup-form-client'
import Paywall from '@/components/paywall'

export default async function OnboardingSetupPage({
  searchParams,
}: {
  searchParams: Promise<{ new_branch?: string }>
}) {
  const params = await searchParams
  const isNewBranch = params?.new_branch === 'true'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  if (!isNewBranch) {
    // Safety guard: if gym already exists, skip onboarding
    const { data: gym } = await supabase
      .from('gyms')
      .select('id')
      .eq('owner_id', user.id)
      .limit(1)
      .maybeSingle()

    if (gym) redirect('/dashboard')
    
    return <GymSetupFormClient isNewBranch={false} />
  }

  return (
    <Paywall mode="branch">
      <GymSetupFormClient isNewBranch={true} />
    </Paywall>
  )
}
