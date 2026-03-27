import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ReportsClient from './reports-client'

export default async function ReportsPage() {
    const supabase = await createClient()
    const { data: authData } = await supabase.auth.getUser()

    if (!authData?.user) redirect('/')

    const cookieStore = await cookies()
    let gymId = cookieStore.get('selected_gym_id')?.value
    console.log('COOKIE GYM ID (REPORTS):', gymId)

    let gymData = null

    if (gymId && gymId !== 'undefined' && gymId !== 'null') {
      const { data } = await supabase
        .from('gyms')
        .select('*')
        .eq('id', gymId)
        .eq('owner_id', authData.user.id)
        .maybeSingle()
      gymData = data
    }

    if (!gymData) {
      const { data } = await supabase
        .from('gyms')
        .select('*')
        .eq('owner_id', authData.user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .single()
      gymData = data
      if (data?.id) {
        gymId = data.id
      }
    }

    console.log('FINAL GYM ID USED (REPORTS):', gymData?.id ?? 'NULL - NO GYM FOUND')

    if (!gymData) {
      return (
        <div className="flex h-[80vh] items-center justify-center text-white">
          <p>No gym found. Please create a gym first in Settings.</p>
        </div>
      )
    }

    console.log('GYM ID USED FOR MEMBERS:', gymId)
    const { data: membersData } = await supabase
        .from('members')
        .select('*')
        .eq('gym_id', gymId)

    const { data: historyData } = await supabase
        .from('membership_history')
        .select('*')
        .eq('gym_id', gymId)
    
    const combinedMembers = [...(membersData || []), ...(historyData || [])]

    return <ReportsClient initialMembers={combinedMembers} />
}
