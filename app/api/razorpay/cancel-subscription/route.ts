import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: authData, error: authError } = await supabase.auth.getUser()
    
    if (authError || !authData?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('razorpay_subscription_id')
      .eq('id', authData.user.id)
      .single()

    if (!profile?.razorpay_subscription_id) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 400 })
    }

    const isLive = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith('rzp_live_')
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    const keySecret = isLive ? process.env.RAZORPAY_KEY_SECRET_LIVE : process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Razorpay keys missing' }, { status: 500 })
    }

    const token = Buffer.from(`${keyId}:${keySecret}`).toString('base64')

    // Cancel at cycle end so user keeps access until the period they paid for is over
    const res = await fetch(`https://api.razorpay.com/v1/subscriptions/${profile.razorpay_subscription_id}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cancel_at_cycle_end: 1 })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error?.description || 'Failed to cancel subscription in Razorpay')
    }

    // Update locally too
    await supabase
      .from('profiles')
      .update({ subscription_status: 'cancelled' })
      .eq('id', authData.user.id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Cancel sub error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
