import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: authData } = await supabase.auth.getUser()
    
    if (!authData?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { planId, tier, duration } = body

    if (!planId) {
      return NextResponse.json({ error: 'Missing plan ID' }, { status: 400 })
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!
    })

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 120, // 10 years duration for recurring
      notes: {
        userId: authData.user.id,
        tier,
        duration,
        planId,
        // Storing these in notes since they aren't supported top-level by the SDK
        notify_url: process.env.RAZORPAY_WEBHOOK_URL || ''
      }
    }) as any // casting to any to bypass strict type check for id access if library types are outdated

    console.log('[RAZORPAY] Created valid subscription:', subscription.id)

    return NextResponse.json({ subscriptionId: subscription.id })
  } catch (err: any) {
    console.error('Create Subscription Error:', err)
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
