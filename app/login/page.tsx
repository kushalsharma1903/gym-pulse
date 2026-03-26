'use client'

import { createClient } from '@/utils/supabase/client'
import { motion } from 'framer-motion'
import { LogIn } from 'lucide-react'

export default function LoginPage() {
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-zinc-900/50 border border-white/10 rounded-3xl p-8 text-center"
      >
        <h1 className="text-2xl font-bold text-white mb-6">Welcome Back</h1>
        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-xl font-bold hover:bg-zinc-200 transition-all"
        >
          <LogIn className="h-5 w-5" />
          Continue with Google
        </button>
      </motion.div>
    </div>
  )
}
