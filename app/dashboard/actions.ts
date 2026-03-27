'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { addMonths } from 'date-fns'

function formatName(name: string) {
  if (!name) return name;
  return name.trim().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

export async function addMemberAction(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated. Please log in again.' }
    
    const cookieStore = await cookies()
    let gymId = cookieStore.get('selected_gym_id')?.value

    if (!gymId || gymId === 'undefined' || gymId === 'null') {
      const { data } = await supabase
        .from('gyms')
        .select('id')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .single()
      if (data?.id) gymId = data.id
    }

    if (!gymId) return { error: 'Gym ID is missing.' }
    
    console.log('GYM ID USED FOR MEMBERS:', gymId)

    const rawName = formData.get('name') as string
    const phone = formData.get('phone') as string
    const planMonthsStr = formData.get('planMonths') as string 
    const planMonths = parseInt(planMonthsStr, 10)
    const joiningDateStr = formData.get('joiningDate') as string
    
    const feePaidStr = formData.get('feePaid') as string
    const memberCode = formData.get('memberCode') as string
    const isCoupleStr = formData.get('isCouple') as string 
    const rawPartnerName = formData.get('partnerName') as string

    if (!rawName || !phone || !planMonthsStr || !joiningDateStr || !memberCode) {
      return { error: 'Please fill out all required fields.' }
    }

    const { data: existingCode } = await supabase
      .from('members')
      .select('id')
      .eq('gym_id', gymId)
      .eq('member_code', memberCode)
      .maybeSingle()

    if (existingCode) return { error: 'Member code already exists!' }

    // Tier feature gating check
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, subscription_status')
      .eq('id', user.id)
      .single()

    const isPro = profile?.subscription_tier === 'pro' && profile?.subscription_status !== 'trial'

    if (isPro) {
      const { count } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('gym_id', gymId)

      if (count !== null && count >= 200) {
        return { error: 'Pro plan limit reached (200 members). Please upgrade to Business.' }
      }
    }

    const joiningDate = new Date(joiningDateStr)
    let planType = '1 Month'
    if (planMonths === 3) planType = '3 Months'
    if (planMonths === 12) planType = '12 Months'
    
    const expiryDate = addMonths(joiningDate, planMonths)
    
    const feePaid = feePaidStr ? parseFloat(feePaidStr) : 0
    const isCouple = isCoupleStr === 'on'

    const { error: insertError } = await supabase.from('members').insert({
      gym_id: gymId,
      name: formatName(rawName),
      phone,
      plan_type: planType, 
      plan_months: planMonths,
      joining_date: joiningDate.toISOString().split('T')[0],
      expiry_date: expiryDate.toISOString().split('T')[0],
      fee_paid: feePaid,
      is_couple: isCouple,
      partner_name: isCouple ? formatName(rawPartnerName) : null,
      member_code: memberCode,
    })
    
    if (insertError) return { error: `Database Error: ${insertError.message}` }

    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Error occurred.' }
  }
}

export async function updateMemberAction(memberId: string, gymId: string, formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const cookieStore = await cookies()
    let actualGymId = cookieStore.get('selected_gym_id')?.value

    if (!actualGymId || actualGymId === 'undefined' || actualGymId === 'null') {
      const { data } = await supabase
        .from('gyms')
        .select('id')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .single()
      if (data?.id) actualGymId = data.id
    }
    
    if (!actualGymId) return { error: 'Gym ID is missing.' }
    console.log('GYM ID USED FOR MEMBERS:', actualGymId)

    const rawName = formData.get('name') as string
    const phone = formData.get('phone') as string
    const memberCode = formData.get('memberCode') as string
    const planMonthsStr = formData.get('planMonths') as string 
    const feePaidStr = formData.get('feePaid') as string
    const joiningDateStr = formData.get('joiningDate') as string
    const isCoupleStr = formData.get('isCouple') as string 
    const rawPartnerName = formData.get('partnerName') as string

    if (!rawName || !phone || !memberCode) return { error: 'Missing Required Fields' }

    const { data: existingCode } = await supabase
      .from('members')
      .select('id')
      .eq('gym_id', actualGymId)
      .eq('member_code', memberCode)
      .neq('id', memberId)
      .maybeSingle()

    if (existingCode) return { error: 'Member code already exists in this gym!' }

    const planMonths = parseInt(planMonthsStr, 10)
    let planType = '1 Month'
    if (planMonths === 3) planType = '3 Months'
    if (planMonths === 12) planType = '12 Months'

    const joiningDate = new Date(joiningDateStr)
    const expiryDate = addMonths(joiningDate, planMonths)
    const isCouple = isCoupleStr === 'on'

    const { error } = await supabase.from('members').update({
       name: formatName(rawName),
       phone,
       member_code: memberCode,
       plan_type: planType,
       plan_months: planMonths,
       fee_paid: parseFloat(feePaidStr) || 0,
       joining_date: joiningDate.toISOString().split('T')[0],
       expiry_date: expiryDate.toISOString().split('T')[0],
       is_couple: isCouple,
       partner_name: isCouple ? formatName(rawPartnerName) : null,
    }).eq('id', memberId)

    if (error) return { error: error.message }
    
    revalidatePath('/dashboard')
    return { success: true }
  } catch(e: any) {
    return { error: e.message }
  }
}

export async function deleteMemberAction(memberId: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('members').delete().eq('id', memberId)
    if (error) return { error: error.message }
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    return { error: 'Failed to delete member' }
  }
}

export async function markReminderSentAction(memberId: string, messageContent?: string) {
  try {
    const supabase = await createClient()
    const { data: mem } = await supabase.from('members').select('gym_id').eq('id', memberId).single()
    
    await supabase.from('members').update({ wa_reminder_sent: true }).eq('id', memberId)
    
    if (mem?.gym_id && messageContent) {
      // Best-effort message logging sequence strictly scoped to dynamic payloads
      await supabase.from('message_log').insert({
        gym_id: mem.gym_id,
        member_id: memberId,
        message_content: messageContent,
        status: 'sent'
      }).select()
    }
    
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err) {
    return { error: 'Failed' }
  }
}

export async function renewMemberAction(memberId: string, planMonths: number, feePaid: number, customJoiningDate?: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // 1. Fetch current member details to archive
    const { data: currentMember, error: fetchError } = await supabase
      .from('members')
      .select('gym_id, plan_type, plan_months, joining_date, expiry_date, fee_paid')
      .eq('id', memberId)
      .single()

    if (fetchError || !currentMember) return { error: 'Member not found for history archival' }

    // 2. Insert into membership_history
    const { error: historyError } = await supabase
      .from('membership_history')
      .insert({
        member_id: memberId,
        gym_id: currentMember.gym_id,
        plan_type: currentMember.plan_type,
        plan_months: currentMember.plan_months,
        joining_date: currentMember.joining_date,
        expiry_date: currentMember.expiry_date,
        fee_paid: currentMember.fee_paid
      })

    if (historyError) {
      console.error('History Error (Optional table may not exist):', historyError)
      // We continue even if history fails, but maybe better to log it
    }

    // 3. Update member with new plan
    let planType = '1 Month'
    if (planMonths === 3) planType = '3 Months'
    if (planMonths === 12) planType = '12 Months'

    const joiningDate = customJoiningDate ? new Date(customJoiningDate) : new Date()
    const expiryDate = addMonths(joiningDate, planMonths)

    const { error } = await supabase.from('members').update({
       plan_type: planType,
       plan_months: planMonths,
       fee_paid: feePaid,
       joining_date: joiningDate.toISOString().split('T')[0],
       expiry_date: expiryDate.toISOString().split('T')[0],
       wa_reminder_sent: false,
       updated_at: new Date().toISOString()
    }).eq('id', memberId)

    if (error) return { error: error.message }
    
    revalidatePath('/dashboard')
    return { success: true }
  } catch(e: any) {
    return { error: e.message }
  }
}

export async function getMemberHistoryAction(memberId: string) {
  try {
    const supabase = await createClient()
    const { data: history, error } = await supabase
      .from('membership_history')
      .select('*')
      .eq('member_id', memberId)
      .order('joining_date', { ascending: false })

    if (error) return { error: error.message }
    return { data: history }
  } catch(e: any) {
    return { error: e.message }
  }
}
