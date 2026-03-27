import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import MessagesClient from '@/components/messages-client'

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getUser()

  if (!authData?.user) redirect('/')

  const cookieStore = await cookies()
  const selectedGymId = cookieStore.get('selected_gym_id')?.value

  let gymData = null

  if (selectedGymId) {
    const { data } = await supabase
      .from('gyms')
      .select('id, gym_name, phone')
      .eq('id', selectedGymId)
      .eq('owner_id', authData.user.id)
      .maybeSingle()
    gymData = data
  }

  if (!gymData) {
    const { data } = await supabase
      .from('gyms')
      .select('id, gym_name, phone')
      .eq('owner_id', authData.user.id)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()
    gymData = data
  }

  if (!gymData) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-white">
        <p>No gym found. Please create a gym first in Settings.</p>
      </div>
    )
  }

  // Fetch all members for this gym
  const { data: members } = await supabase
    .from('members')
    .select('*')
    .eq('gym_id', gymData.id)
    .order('expiry_date', { ascending: true })

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
      <MessagesClient 
        initialMembers={members || []} 
        gymDetails={{
          name: gymData.gym_name,
          phone: gymData.phone || ''
        }} 
      />
    </main>
  )
}
