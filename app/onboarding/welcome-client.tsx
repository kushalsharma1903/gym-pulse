'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function OnboardingWelcomeClient({ name }: { name: string }) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#080b0a] flex items-center justify-center p-4">
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-2xl text-center"
      >
        {/* Pulsing emoji with glow */}
        <div className="relative flex items-center justify-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-28 h-28 rounded-full bg-emerald-500/20 blur-2xl"
          />
          <motion.span
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="relative text-7xl select-none"
          >
            💪
          </motion.span>
        </div>

        {/* Headline */}
        <h1
          className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight leading-tight"
        >
          Welcome to{' '}
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            GymPulse!
          </span>
        </h1>

        {/* Personalised greeting */}
        {name !== 'there' && (
          <p className="text-zinc-400 text-sm font-medium mb-2">
            Hey{' '}
            <span className="text-emerald-400 font-semibold">{name}</span> 👋
          </p>
        )}

        {/* Subtext */}
        <p className="text-zinc-400 text-base leading-relaxed max-w-[480px] mx-auto mb-10">
          You're about to take your gym to the next level.{' '}
          Let's set up your gym profile in just 2 minutes — so you can start
          tracking members, sending reminders, and growing your business like a
          pro.
        </p>

        {/* CTA button */}
        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          onClick={() => router.push('/onboarding/setup')}
          className="w-full sm:w-auto sm:min-w-[280px] inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-600/30 transition-colors"
        >
          Let's Set Up My Gym →
        </motion.button>

        {/* Helper text */}
        <p className="mt-4 text-xs text-zinc-600 font-medium tracking-wide">
          Takes less than 2 minutes
        </p>
      </motion.div>

    </div>
  )
}
