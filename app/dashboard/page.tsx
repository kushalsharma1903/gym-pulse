import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import MembersTable from '@/components/members-table'
import AddMemberModal from '@/components/add-member-modal'
import PageEntry from '@/components/ui/page-entry'
import WelcomeToast from '@/components/welcome-toast'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ onboarded?: string }>
}) {
  const params = await searchParams
  const showWelcomeToast = params?.onboarded === '1'

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const cookieGymId = cookieStore.get('selected_gym_id')?.value
  console.log('COOKIE GYM ID:', cookieGymId)

  let gymDataTemp = null
  let gymError = null

  if (cookieGymId && cookieGymId !== 'undefined' && cookieGymId !== 'null') {
    const { data, error } = await supabase
      .from('gyms')
      .select('*')
      .eq('id', cookieGymId)
      .eq('owner_id', user.id)
      .maybeSingle()
    
    gymDataTemp = data
    gymError = error
  }

  if (!gymDataTemp) {
    const { data, error } = await supabase
      .from('gyms')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: true })
      .limit(1)
      .single()

    gymDataTemp = data
    gymError = error
  }

  const gymData: any = gymDataTemp
  console.log('FINAL GYM ID USED:', gymData?.id ?? 'NULL - NO GYM FOUND')

  let subscription: any = null
  if (gymData?.id) {
    const { data: subData } = await supabase
      .from('subscriptions')
      .select('plan, status')
      .eq('gym_id', gymData.id)
      .maybeSingle()
    subscription = subData
    console.log('SUB DATA:', JSON.stringify(subData))
  }
  
  const gymName = gymData?.gym_name || 'GymPulse'
  
  let members: any[] = []
  let currentYearRevenue = 0
  const currentYear = new Date().getFullYear().toString()

  if (gymData?.id) {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('gym_id', gymData.id)
      .order('created_at', { ascending: false })
    
    members = data ?? []

    // Fetch all recent revenue from history that might cover this year
    const { data: historyData } = await supabase
      .from('membership_history')
      .select('fee_paid, joining_date, plan_months, plan_type')
      .eq('gym_id', gymData.id)
      .gte('joining_date', `${parseInt(currentYear) - 1}-01-01`)
    
    if (historyData) {
      historyData.forEach(h => {
        if (!h.joining_date || !h.fee_paid) return
        const planMonths = h.plan_months || (h.plan_type ? parseInt(h.plan_type) : 1) || 1
        const monthlyRate = h.fee_paid / planMonths
        const joinDate = new Date(h.joining_date)

        for (let i = 0; i < planMonths; i++) {
          const targetDate = new Date(joinDate.getFullYear(), joinDate.getMonth() + i, 1)
          if (targetDate.getFullYear().toString() === currentYear) {
            currentYearRevenue += monthlyRate
          }
        }
      })
    }
  } else {
    console.log('[DEBUG] gymData is null — members query skipped')
  }

  return (
    <PageEntry>
      <WelcomeToast show={showWelcomeToast} />
      <main className="max-w-[1400px] mx-auto px-6 py-8 space-y-6">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-[#eaebe9]">
                Dashboard Overview
              </h2>
              <p className="text-sm text-[#737674] mt-1.5 leading-relaxed">
                Manage growth, track renewals, and scale your memberships.
              </p>
            </div>
            <div className="shrink-0">
              <AddMemberModal gymId={gymData?.id || ''} />
            </div>
          </div>

          {/* Members Component */}
          <MembersTable 
            members={members} 
            historicalRevenue={currentYearRevenue}
            planTier={subscription?.status === 'trial' ? 'pro' : (subscription?.plan ?? 'free')}
            gym={{
              id: gymData?.id || '',
              gym_name: gymName,
              phone: gymData?.phone || '',
              whatsapp_number: gymData?.whatsapp_number || '',
              wa_template: gymData?.wa_template || ''
            }} 
          />

        </main>
      </PageEntry>
  )
}
