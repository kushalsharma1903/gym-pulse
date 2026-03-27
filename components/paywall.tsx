'use client'

import { useState, useEffect } from 'react'
import { Check, Shield, Zap, ArrowRight, Loader2, LogOut, Home } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

type PlanDuration = 'monthly' | 'halfyearly' | 'yearly'

export default function Paywall({ mode = 'expired', children }: { mode?: 'expired' | 'upgrade' | 'branch', children?: React.ReactNode }) {
  const isUpgrade = mode === 'upgrade'
  const isBranch = mode === 'branch'
  const [duration, setDuration] = useState<PlanDuration>('monthly')
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [checkingBranchAccess, setCheckingBranchAccess] = useState(mode === 'branch')
  const [branchStatus, setBranchStatus] = useState<'allow' | 'limit_reached' | 'upgrade' | null>(null)

  const isLive = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith('rzp_live_')

  useEffect(() => {
    if (mode !== 'branch') {
       setCheckingBranchAccess(false)
       return
    }
    
    const checkBranchAccess = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        
        const { data: profile } = await supabase.from('profiles').select('subscription_tier').eq('id', user.id).single()
        const { data: gyms } = await supabase.from('gyms').select('id').eq('owner_id', user.id)
        
        const count = gyms?.length || 0
        const tier = profile?.subscription_tier || 'free'
        
        if (tier === 'business') {
          if (count < 3) {
            setBranchStatus('allow')
          } else {
            setBranchStatus('limit_reached')
          }
        } else {
          setBranchStatus('upgrade')
        }
      } catch (err) {
         console.error(err)
      } finally {
        setCheckingBranchAccess(false)
      }
    }
    
    checkBranchAccess()
  }, [mode])

  const plans = {
    pro: {
      name: 'Pro',
      description: 'Perfect for growing gyms and fitness studios.',
      monthlyPrice: '₹999',
      halfyearlyPrice: '₹5,094',
      yearlyPrice: '₹8,988',
      monthlyId: isLive ? process.env.NEXT_PUBLIC_RAZORPAY_PRO_MONTHLY_LIVE : process.env.NEXT_PUBLIC_RAZORPAY_PRO_MONTHLY,
      halfyearlyId: isLive ? process.env.NEXT_PUBLIC_RAZORPAY_PRO_HALFYEARLY_LIVE : process.env.NEXT_PUBLIC_RAZORPAY_PRO_HALFYEARLY,
      yearlyId: isLive ? process.env.NEXT_PUBLIC_RAZORPAY_PRO_YEARLY_LIVE : process.env.NEXT_PUBLIC_RAZORPAY_PRO_YEARLY,
      features: [
        'Up to 200 members',
        'Member directory',
        'WhatsApp reminders',
        'Revenue reports',
        'Custom branding',
        '3 staff logins'
      ],
      color: 'emerald'
    },
    business: {
      name: 'Business',
      description: 'Unlimited access for scaling enterprises & franchises.',
      monthlyPrice: '₹1,799',
      halfyearlyPrice: '₹9,174',
      yearlyPrice: '₹16,188',
      monthlyId: isLive ? process.env.NEXT_PUBLIC_RAZORPAY_BUSINESS_MONTHLY_LIVE : process.env.NEXT_PUBLIC_RAZORPAY_BUSINESS_MONTHLY,
      halfyearlyId: isLive ? process.env.NEXT_PUBLIC_RAZORPAY_BUSINESS_HALFYEARLY_LIVE : process.env.NEXT_PUBLIC_RAZORPAY_BUSINESS_HALFYEARLY,
      yearlyId: isLive ? process.env.NEXT_PUBLIC_RAZORPAY_BUSINESS_YEARLY_LIVE : process.env.NEXT_PUBLIC_RAZORPAY_BUSINESS_YEARLY,
      features: [
        'Unlimited members',
        'Everything in Pro',
        'Multi-branch support',
        'Unlimited staff logins',
        'Export data (CSV/PDF)',
        'Priority support'
      ],
      color: 'blue'
    }
  }

  const handleSubscribe = async (tier: 'pro' | 'business') => {
    setError(null)
    setLoadingPlan(tier)
    try {
      const planConfig = plans[tier]
      const planId = planConfig[`${duration}Id` as keyof typeof planConfig]

      if (!planId) {
        throw new Error('Plan ID not configured in environment')
      }

      const res = await fetch('/api/razorpay/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, tier, duration })
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to initialize subscription')

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: data.subscriptionId,
        name: 'GymPulse',
        description: `GymPulse ${planConfig.name} - ${duration} Subscription`,
        handler: async function (response: any) {
          try {
            setIsVerifying(true)
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
                tier,
                duration
              })
            })
            
            const verifyData = await verifyRes.json()
            if (!verifyRes.ok) throw new Error(verifyData.error || 'Payment verification failed')
            
            setIsVerifying(false)
            setPaymentSuccess(true)
            // Redirect after brief success message
            setTimeout(() => {
              window.location.href = '/dashboard'
            }, 1500)
          } catch (err: any) {
            setIsVerifying(false)
            setError(err.message || 'Payment verification error')
          }
        },
        theme: {
          color: tier === 'pro' ? '#10b981' : '#3b82f6'
        }
      }

      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options)
        rzp.on('payment.failed', function (response: any) {
          setError(response.error.description)
        })
        rzp.open()
      } else {
         setError('Failed to load payment gateway. Please refresh.')
      }

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoadingPlan(null)
    }
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (checkingBranchAccess) {
    return (
      <div className="min-h-screen bg-[#080b0a] font-sans flex flex-col items-center justify-center p-6 text-[#eaebe9]">
         <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-4" />
         <p className="text-zinc-400 font-medium tracking-wide">Checking branch limits...</p>
      </div>
    )
  }

  if (mode === 'branch' && branchStatus === 'allow') {
    return <>{children}</>
  }

  if (mode === 'branch' && branchStatus === 'limit_reached') {
    return (
      <div className="min-h-screen bg-[#080b0a] font-sans flex flex-col items-center justify-center p-6 text-[#eaebe9]">
         <div className="max-w-md w-full text-center space-y-6 bg-[#0f0f0f] border border-white/5 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] pointer-events-none rounded-full" />
            
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-blue-500/10 mb-2">
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
            
            <h2 className="text-2xl font-black tracking-tight text-white">Branch Limit Reached</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              You have reached the maximum limit of 3 branches allowed on the Business plan. 
              To manage more locations, please contact our enterprise support team.
            </p>
            
            <div className="pt-4">
              <Link href="/dashboard" className="inline-flex items-center justify-center w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 rounded-xl border border-white/10 transition-colors">
                Return to Dashboard
              </Link>
            </div>
         </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080b0a] font-sans flex flex-col items-center justify-center p-6 sm:p-12 text-[#eaebe9] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      {/* Escape Navigation — always on the LEFT so right side is free for Close button */}
      <div className="absolute top-5 left-5 z-50 flex items-center gap-2">
        <Link href="/" className="text-xs font-medium text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
          <Home className="w-3 h-3" />
          Home
        </Link>
        <button onClick={handleSignOut} className="text-xs font-medium text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
          <LogOut className="w-3 h-3" />
          Sign Out
        </button>
      </div>

      <div className="max-w-4xl w-full z-10 space-y-12">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 mb-2 shadow-2xl"
          >
            <Shield className="h-8 w-8 text-emerald-400" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black tracking-tight"
          >
            {isBranch ? 'Upgrade to create branches' : isUpgrade ? 'Upgrade your plan' : 'Your access has expired'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-400 max-w-xl mx-auto"
          >
            {isBranch
              ? 'Multi-branch support is exclusive to the Business Plan. Upgrade to Business to manage multiple gym locations seamlessly from one account.'
              : isUpgrade
              ? 'Choose a plan that works for you and unlock the full GymPulse experience.'
              : 'Choose a plan to restore access and continue managing your gym with GymPulse.'}
          </motion.p>
        </div>

        {/* Toggle */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.2 }}
           className="flex justify-center"
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-1.5 flex text-sm font-semibold max-w-sm w-full">
            {['monthly', 'halfyearly', 'yearly'].map((t) => (
              <button
                key={t}
                onClick={() => setDuration(t as PlanDuration)}
                className={`flex-1 py-2.5 rounded-xl capitalize transition-all duration-300 relative ${duration === t ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {duration === t && (
                  <motion.div layoutId="durBg" className="absolute inset-0 bg-white/10 rounded-xl shadow-sm border border-white/5" />
                )}
                <span className="relative z-10">{t === 'halfyearly' ? '6 Months' : t}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-center text-sm font-medium">
            {error}
          </div>
        )}

        {isVerifying && !paymentSuccess && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto w-full bg-blue-500/10 border border-blue-500/20 px-6 py-6 rounded-2xl text-center flex flex-col items-center gap-3">
             <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
             <div>
                <h3 className="text-xl font-bold text-blue-400 tracking-tight">Verifying Payment...</h3>
                <p className="text-sm mt-1 text-blue-400/80 font-medium">Please wait while we confirm your subscription securely.</p>
             </div>
          </motion.div>
        )}

        {paymentSuccess && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto w-full bg-emerald-500/10 border border-emerald-500/20 px-6 py-6 rounded-2xl text-center flex flex-col items-center gap-3">
             <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
               <Check className="h-6 w-6 text-emerald-400" />
             </div>
             <div>
                <h3 className="text-xl font-bold text-emerald-400 tracking-tight">Subscription Confirmed!</h3>
                <p className="text-sm mt-1 text-emerald-400/80 font-medium">Your account has been fully activated.</p>
             </div>
          </motion.div>
        )}

        {/* Cards */}
        <div className={`grid md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full transition-all duration-500 ${(paymentSuccess || isVerifying) ? 'opacity-20 pointer-events-none scale-[0.98]' : ''}`}>
          {(['pro', 'business'] as const).map((tier, idx) => {
            const plan = plans[tier]
            const price = duration === 'monthly' ? plan.monthlyPrice : duration === 'halfyearly' ? plan.halfyearlyPrice : plan.yearlyPrice
            const isPro = tier === 'pro'
            
            return (
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (idx * 0.1) }}
                className={`relative rounded-3xl p-8 border ${isPro ? 'bg-[#0c100e] border-emerald-500/20 shadow-emerald-900/10' : 'bg-[#0b0c10] border-blue-500/20 shadow-blue-900/10'} shadow-2xl flex flex-col group overflow-hidden`}
              >
                <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-20 ${isPro ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                
                <div className="space-y-4 mb-8 relative z-10">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                       {plan.name}
                       {tier === 'business' && <Zap className="h-5 w-5 text-blue-400" fill="currentColor" />}
                    </h3>
                    <p className="text-zinc-400 text-sm">{plan.description}</p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black">{price}</span>
                    <span className="text-zinc-500 text-sm font-medium">/ {duration === 'halfyearly' ? '6 mo' : duration.substring(0,2)}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-10 flex-1 relative z-10">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-zinc-300 font-medium tracking-wide">
                      <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${isPro ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                         <Check className="h-3 w-3" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(tier)}
                  disabled={!!loadingPlan}
                  className={`relative z-10 w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all shadow-lg active:scale-[0.98] ${
                    isPro 
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 shadow-emerald-500/20' 
                      : 'bg-blue-500 hover:bg-blue-400 text-blue-950 shadow-blue-500/20'
                  }`}
                >
                  {loadingPlan === tier ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Subscribe to {plan.name}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
