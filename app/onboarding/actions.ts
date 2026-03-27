'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function createGymAction(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated. Please log in again.' }

    const gym_name = (formData.get('gym_name') as string)?.trim()
    const owner_name = (formData.get('owner_name') as string)?.trim()
    const phone = (formData.get('phone') as string)?.trim()
    const whatsapp_number = (formData.get('whatsapp_number') as string)?.trim()
    const city = (formData.get('city') as string)?.trim()

    if (!gym_name || !owner_name || !phone || !city) {
      return { error: 'Please fill out all required fields.' }
    }

    // 1. Insert gym row
    const { data: gym, error: gymError } = await supabase
      .from('gyms')
      .insert({
        owner_id: user.id,
        gym_name,
        owner_name,
        phone,
        whatsapp_number: whatsapp_number || phone,
        address: city,
      })
      .select('id')
      .single()

    if (gymError || !gym) {
      return { error: gymError?.message || 'Failed to create gym profile.' }
    }

    // 2. Insert subscription row (trial, 30 days)
    const trialEnd = new Date()
    trialEnd.setDate(trialEnd.getDate() + 30)

    const { error: subError } = await supabase
      .from('subscriptions')
      .insert({
        gym_id: gym.id,
        status: 'trial',
        trial_ends_at: trialEnd.toISOString(),
      })

    if (subError) {
      // Gym was created; rollback is not critical but surface the error
      return { error: `Gym created but subscription failed: ${subError.message}` }
    }

    // 3. Mark onboarding as complete (source of truth for onboarding guard)
    await supabase
      .from('profiles')
      .upsert({ id: user.id, setup_completed: true }, { onConflict: 'id' })

    return { success: true, gymId: gym.id }
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred.' }
  }
}

export async function createBranchAction(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated. Please log in again.' }

    // Limit check
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()

    if (profile?.subscription_tier !== 'business') {
      return { error: 'Multi-branch is only available on the Business plan.' }
    }

    const { count } = await supabase
      .from('gyms')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', user.id)

    if (count !== null && count >= 3) {
      return { error: 'Branch limit reached (max 3 branches).' }
    }

    const gym_name = (formData.get('gym_name') as string)?.trim()
    const owner_name = (formData.get('owner_name') as string)?.trim()
    const phone = (formData.get('phone') as string)?.trim()
    const whatsapp_number = (formData.get('whatsapp_number') as string)?.trim()
    const city = (formData.get('city') as string)?.trim()

    if (!gym_name || !owner_name || !phone || !city) {
      return { error: 'Please fill out all required fields.' }
    }

    // Insert gym row
    const { data: gym, error: gymError } = await supabase
      .from('gyms')
      .insert({
        owner_id: user.id,
        gym_name,
        owner_name,
        phone,
        whatsapp_number: whatsapp_number || phone,
        address: city,
      })
      .select('id')
      .single()

    if (gymError || !gym) {
      return { error: gymError?.message || 'Failed to create branch.' }
    }

    return { success: true, gymId: gym.id }
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred.' }
  }
}

