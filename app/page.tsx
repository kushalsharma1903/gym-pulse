import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import LandingNav from '@/components/landing/LandingNav'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import SocialProof from '@/components/landing/SocialProof'
import Pricing from '@/components/landing/Pricing'
import Testimonials from '@/components/landing/Testimonials'
import FAQ from '@/components/landing/FAQ'
import Footer from '@/components/landing/Footer'

export default async function Home() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  // If already logged in, send them straight to the dashboard
  if (data?.user) {
    redirect('/dashboard')
  }

  return (
    <div className="relative min-h-screen bg-[#080b0a] overflow-x-hidden selection:bg-[#1fce7e] selection:text-black">
      <LandingNav />
      <main>
        <Hero />
        <SocialProof />
        <Features />
        <Pricing />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
