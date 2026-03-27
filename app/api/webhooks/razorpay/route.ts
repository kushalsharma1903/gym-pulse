import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

// Next.js config to tell the server to read the raw body for signature verification
export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// In production, define RAZORPAY_WEBHOOK_SECRET in env
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.CRON_SECRET || 'fallback_secret'

export async function POST(req: Request) {
  try {
    const bodyText = await req.text()
    const signature = req.headers.get('x-razorpay-signature')
    
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    const expectedSignature = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(bodyText)
      .digest('hex')

    if (expectedSignature !== signature) {
      console.error('Invalid Razorpay signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const payload = JSON.parse(bodyText)
    const event = payload.event

    // Handling successful subscription charge
    if (event === 'subscription.charged') {
      const subscription = payload.payload.subscription.entity
      const notes = subscription.notes

      if (notes && notes.userId) {
        // Calculate next billing date
        const currentEnd = subscription.current_end 
        const nextEndDate = new Date(currentEnd * 1000).toISOString()

        await supabase
          .from('profiles')
          .update({
            subscription_status: 'active',
            subscription_tier: notes.tier,
            subscription_plan: notes.duration,
            razorpay_subscription_id: subscription.id,
            subscription_end_date: nextEndDate
          })
          .eq('id', notes.userId)

        const { data: gym } = await supabase
          .from('gyms')
          .select('id')
          .eq('owner_id', notes.userId)
          .single()

        if (gym?.id) {
          await supabase
            .from('subscriptions')
            .update({
              status: 'active',
              plan: notes.tier
            })
            .eq('gym_id', gym.id)
        }
      }
    }

    // Handling subscription cancellations or failures
    if (event === 'subscription.cancelled' || event === 'subscription.halted') {
       const subscription = payload.payload.subscription.entity
       const notes = subscription.notes
       if (notes && notes.userId) {
         await supabase
          .from('profiles')
          .update({
            subscription_status: 'cancelled'
          })
          .eq('id', notes.userId)
       }
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('Razorpay Webhook Error:', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
