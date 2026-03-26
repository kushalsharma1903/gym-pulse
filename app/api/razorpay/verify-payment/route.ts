import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature, tier, duration } = await req.json()

    if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment signature components' }, { status: 400 })
    }

    const secret = process.env.RAZORPAY_KEY_SECRET!

    // Razorpay signature for Subscriptions is: hmac_sha256(payment_id + "|" + subscription_id, secret)
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_payment_id + '|' + razorpay_subscription_id)
      .digest('hex')

    if (generated_signature !== razorpay_signature) {
      console.error('Frontend Signature Verification Failed')
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // Signature verified! Safe to update Supabase
    const supabase = await createClient()
    const { data: authData } = await supabase.auth.getUser()

    if (!authData?.user) {
      return NextResponse.json({ error: 'Unauthorized user context' }, { status: 401 })
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'active',
        subscription_tier: tier,
        subscription_plan: duration,
        razorpay_subscription_id: razorpay_subscription_id,
        // Calculate a rough end date to immediately unlock access while webhook syncs precise billing timestamp
        subscription_end_date: new Date(new Date().setMonth(new Date().getMonth() + (duration === 'monthly' ? 1 : duration === 'halfyearly' ? 6 : 12))).toISOString()
      })
      .eq('id', authData.user.id)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update user profile status' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Verify Payment API Error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
