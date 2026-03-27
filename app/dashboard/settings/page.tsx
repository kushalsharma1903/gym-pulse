import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import SettingsClient from './settings-client'

export default async function SettingsPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let gymId = cookieStore.get('selected_gym_id')?.value
  console.log('COOKIE GYM ID (SETTINGS):', gymId)

  let gymData = null

  if (gymId && gymId !== 'undefined' && gymId !== 'null') {
    const { data } = await supabase
      .from('gyms')
      .select('*')
      .eq('id', gymId)
      .eq('owner_id', user.id)
      .maybeSingle()
    gymData = data
  }

  if (!gymData) {
    const { data } = await supabase
      .from('gyms')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: true })
      .limit(1)
      .single()
    gymData = data
    if (data?.id) gymId = data.id
  }

  console.log('FINAL GYM ID USED (SETTINGS):', gymData?.id ?? 'NULL - NO GYM FOUND')

  const { data: profileData } = await supabase
    .from('profiles')
    .select('subscription_status, subscription_tier, subscription_plan, subscription_end_date, trial_started_at')
    .eq('id', user.id)
    .single()

  return <SettingsClient initialGym={gymData} initialProfile={profileData} />
}
