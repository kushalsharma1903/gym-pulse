import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import MembersTable from '@/components/members-table'
import AddMemberModal from '@/components/add-member-modal'
import PageEntry from '@/components/ui/page-entry'

export default async function DashboardPage() {

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let gymId = cookieStore.get('selected_gym_id')?.value
  console.log('COOKIE GYM ID:', gymId)

  let gymDataTemp = null
  let gymError = null

  if (gymId && gymId !== 'undefined' && gymId !== 'null') {
    const { data, error } = await supabase
      .from('gyms')
      .select('*')
      .eq('id', gymId)
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
    if (data?.id) {
      gymId = data.id
    }
  }

  const gymData: any = gymDataTemp
  console.log('FINAL GYM ID USED:', gymData?.id ?? 'NULL - NO GYM FOUND')

  // Fetch plan tier from the user's profile (account-level, not per-gym)
  // This means Business plan users can export CSV from ANY branch
  let { data: profileData } = await supabase
    .from('profiles')
    .select('subscription_tier, subscription_status')
    .eq('id', user.id)
    .maybeSingle()

  // Retry once if profile data is missing
  if (!profileData) {
    console.log('PROFILE DATA MISSING — retrying...')
    const { data: retryProfile } = await supabase
      .from('profiles')
      .select('subscription_tier, subscription_status')
      .eq('id', user.id)
      .maybeSingle()
    profileData = retryProfile
  }

  // Hard stop — don't silently continue as free plan
  if (!profileData) {
    console.log('PROFILE DATA MISSING — showing error UI')
    return (
      <PageEntry>
        <main className="flex flex-col items-center justify-center min-h-[70vh] gap-6 px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-3xl">
            ⚠️
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[#eaebe9]">Something went wrong loading your account</h2>
            <p className="text-sm text-[#737674] max-w-sm">
              We couldn&apos;t load your subscription profile. This is usually a temporary issue.
            </p>
          </div>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1fce7e]/10 border border-[#1fce7e]/20 text-[#1fce7e] font-semibold text-sm hover:bg-[#1fce7e]/20 transition-colors"
          >
            ↻ Refresh
          </a>
        </main>
      </PageEntry>
    )
  }

  const planTier = (profileData.subscription_tier || 'free').toLowerCase()
  console.log('PLAN TIER (from profile):', planTier)
  
  const gymName = gymData?.gym_name || 'GymPulse'
  
  let members: any[] = []
  let currentYearRevenue = 0
  const currentYear = new Date().getFullYear().toString()

  if (gymId && gymId !== 'undefined' && gymId !== 'null') {
    console.log('GYM ID USED FOR MEMBERS:', gymId)
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('gym_id', gymId)
      .order('created_at', { ascending: false })
    
    members = data ?? []

    // Fetch all recent revenue from history that might cover this year
    const { data: historyData } = await supabase
      .from('membership_history')
      .select('fee_paid, joining_date, plan_months, plan_type')
      .eq('gym_id', gymId)
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
    console.log('[DEBUG] gymId is null — members query skipped')
  }

  return (
    <PageEntry>
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
            planTier={planTier}
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
