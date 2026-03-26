import LandingNav from '@/components/landing/LandingNav'
import Footer from '@/components/landing/Footer'
import { Mail, Clock, HelpCircle } from 'lucide-react'
import Link from 'next/link'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#080b0a] text-[#eaebe9] font-sans selection:bg-[#1fce7e] selection:text-black">
      <LandingNav />
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Contact Us</h1>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-zinc-400">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full">
              <Mail className="h-4 w-4 text-[#1fce7e]" />
              <a href="mailto:support@gympulse.co.in" className="hover:text-white transition-colors font-medium">support@gympulse.co.in</a>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full">
              <Clock className="h-4 w-4 text-[#1fce7e]" />
              <span className="font-medium">We reply within 24 hours on business days</span>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 bg-[#1fce7e]/10 border border-[#1fce7e]/20 rounded-xl flex items-center justify-center text-[#1fce7e]">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-[#0a0f0d] border border-white/5 p-6 rounded-2xl transition-all duration-300 hover:border-white/10">
              <h3 className="font-bold text-white text-lg mb-2">Q: How do I cancel my subscription?</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">A: You can cancel anytime from Settings → Billing. You'll keep access until the end of your billing period.</p>
            </div>
            
            <div className="bg-[#0a0f0d] border border-white/5 p-6 rounded-2xl transition-all duration-300 hover:border-white/10">
              <h3 className="font-bold text-white text-lg mb-2">Q: How do I get a refund?</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">A: Email us at <a href="mailto:support@gympulse.co.in" className="text-[#1fce7e] hover:underline">support@gympulse.co.in</a> within 7 days of payment with your Payment ID. See our full <Link href="/refund-policy" className="text-[#1fce7e] hover:underline">Refund Policy</Link>.</p>
            </div>

            <div className="bg-[#0a0f0d] border border-white/5 p-6 rounded-2xl transition-all duration-300 hover:border-white/10">
              <h3 className="font-bold text-white text-lg mb-2">Q: Is my gym member data safe?</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">A: Yes — your data is stored securely and never shared with third parties. See our <Link href="/privacy-policy" className="text-[#1fce7e] hover:underline">Privacy Policy</Link>.</p>
            </div>

            <div className="bg-[#0a0f0d] border border-white/5 p-6 rounded-2xl transition-all duration-300 hover:border-white/10">
              <h3 className="font-bold text-white text-lg mb-2">Q: Can I export my member data?</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">A: Yes — data export is available on the Business plan from Settings.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
