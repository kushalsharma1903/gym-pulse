import LandingNav from '@/components/landing/LandingNav'
import Footer from '@/components/landing/Footer'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#080b0a] text-[#eaebe9] font-sans selection:bg-[#1fce7e] selection:text-black">
      <LandingNav />
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Privacy Policy</h1>
        <p className="text-zinc-500 font-medium mb-12">Last updated: March 2026</p>

        <div className="space-y-10 text-zinc-300 leading-relaxed max-w-3xl">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
            <p>GymPulse is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information when you use our platform at gympulse.co.in.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li>Name, email address and profile photo via Google login</li>
              <li>Gym name and business details you provide</li>
              <li>Member data you add to the platform (names, phone numbers, plan details)</li>
              <li>Payment information processed securely via Razorpay — we never store card details</li>
              <li>Usage data such as pages visited and features used</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li>To provide and improve the GymPulse service</li>
              <li>To process payments and manage your subscription</li>
              <li>To send important account and billing notifications</li>
              <li>To respond to your support requests</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Data Storage</h2>
            <p>Your data is stored securely on Supabase infrastructure. We do not sell, rent or share your personal data with third parties except as required to provide the service (Razorpay for payments, Google for authentication).</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Member Data</h2>
            <p>The gym member data you add to GymPulse belongs to you. We process it only to provide the service. You can export or delete your data at any time from Settings.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Cookies</h2>
            <p>We use essential cookies only to keep you logged in and maintain your session. We do not use advertising or tracking cookies.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data at any time. Email us at <a href="mailto:support@gympulse.co.in" className="text-[#1fce7e] hover:underline">support@gympulse.co.in</a> to make a request.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Changes to This Policy</h2>
            <p>We may update this policy occasionally. We'll notify you of significant changes via email.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Contact</h2>
            <p>For privacy-related questions: <a href="mailto:support@gympulse.co.in" className="text-[#1fce7e] hover:underline">support@gympulse.co.in</a></p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
