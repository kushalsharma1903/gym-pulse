import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | GymPulse',
  description: 'Understand GymPulse\'s refund and cancellation policy for Pro and Business subscriptions.',
}

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#080b0a] text-[#eaebe9] font-sans">
      {/* Top gradient divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-3xl mx-auto px-6 py-20">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-12"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1fce7e]/10 border border-[#1fce7e]/20 mb-6">
            <span className="text-[#1fce7e] text-xs font-semibold uppercase tracking-wider">Legal</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-3">Refund & Cancellation Policy</h1>
          <p className="text-zinc-500 text-sm">Last updated: March 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-10 text-zinc-300 leading-relaxed">

          {/* Section: Free Trial */}
          <section>
            <h2 className="text-xl font-bold text-[#eaebe9] mb-3 flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-[#1fce7e]" />
              Free Trial
            </h2>
            <p>
              GymPulse offers a <strong className="text-[#eaebe9]">30-day free trial</strong> with no credit card required.
              You will not be charged during the trial period.
            </p>
          </section>

          {/* Section: Subscription Plans */}
          <section>
            <h2 className="text-xl font-bold text-[#eaebe9] mb-3 flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-[#1fce7e]" />
              Subscription Plans
            </h2>
            <p>
              GymPulse offers monthly, half-yearly, and yearly subscription plans across Pro and Business tiers.
              All payments are processed securely via <strong className="text-[#eaebe9]">Razorpay</strong>.
            </p>
          </section>

          {/* Section: Refund Policy */}
          <section>
            <h2 className="text-xl font-bold text-[#eaebe9] mb-3 flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-[#1fce7e]" />
              Refund Policy
            </h2>
            <ul className="space-y-2 list-none">
              {[
                'Eligible for full refund within 7 days of first payment',
                'No refunds after 7 days of billing date',
                'No refunds for partially used subscription periods',
                'Yearly and half-yearly plans follow the same 7-day refund window',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#1fce7e] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Section: Cancellation Policy */}
          <section>
            <h2 className="text-xl font-bold text-[#eaebe9] mb-3 flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-[#1fce7e]" />
              Cancellation Policy
            </h2>
            <ul className="space-y-2 list-none">
              {[
                'Cancel anytime from account settings',
                'Access continues until end of current billing period',
                'No charge on next billing cycle after cancellation',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#1fce7e] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Section: How to Request a Refund */}
          <section>
            <h2 className="text-xl font-bold text-[#eaebe9] mb-3 flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-[#1fce7e]" />
              How to Request a Refund
            </h2>
            <p className="mb-4">
              Email{' '}
              <a
                href="mailto:support.gympulse@gmail.com"
                className="text-[#1fce7e] hover:underline"
              >
                support.gympulse@gmail.com
              </a>{' '}
              within 7 days with:
            </p>
            <ul className="space-y-2 list-none mb-4">
              {[
                'Registered email address',
                'Payment ID from Razorpay receipt',
                'Reason for refund',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#1fce7e] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p>Refunds are processed within <strong className="text-[#eaebe9]">5–7 business days</strong> to the original payment method.</p>
          </section>

          {/* Divider */}
          <div className="h-px w-full bg-white/5" />

          {/* Section: Contact */}
          <section>
            <h2 className="text-xl font-bold text-[#eaebe9] mb-3 flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-[#1fce7e]" />
              Contact Us
            </h2>
            <p>
              For any questions regarding refunds or cancellations, reach out to us at{' '}
              <a
                href="mailto:support@gympulse.co.in"
                className="text-[#1fce7e] hover:underline"
              >
                support@gympulse.co.in
              </a>
            </p>
          </section>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="text-center py-6 text-xs text-zinc-600">
        © 2026 GymPulse. All rights reserved.
      </div>
    </div>
  )
}
