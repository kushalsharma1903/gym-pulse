'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Building2, User, Phone, MessageCircle, MapPin, Loader2, ArrowLeft } from 'lucide-react'
import { createGymAction } from '../actions'

interface FormState {
  gym_name: string
  owner_name: string
  phone: string
  whatsapp_number: string
  city: string
}

export default function GymSetupFormClient() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<FormState>({
    gym_name: '',
    owner_name: '',
    phone: '',
    whatsapp_number: '',
    city: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => {
      const updated = { ...prev, [name]: value }
      // Auto-sync WhatsApp when phone changes, unless user already edited WA
      if (name === 'phone' && prev.whatsapp_number === prev.phone) {
        updated.whatsapp_number = value
      }
      return updated
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))

    const result = await createGymAction(fd)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    // Success → redirect to dashboard with toast flag
    router.push('/dashboard?onboarded=1')
  }

  const fields: {
    id: keyof FormState
    label: string
    placeholder: string
    icon: React.ReactNode
    required: boolean
    type?: string
  }[] = [
    {
      id: 'gym_name',
      label: 'Gym Name',
      placeholder: 'e.g. Royal Gym',
      icon: <Building2 className="h-4 w-4" />,
      required: true,
    },
    {
      id: 'owner_name',
      label: 'Owner Name',
      placeholder: 'Your full name',
      icon: <User className="h-4 w-4" />,
      required: true,
    },
    {
      id: 'phone',
      label: 'Phone Number',
      placeholder: '+91 98765 43210',
      icon: <Phone className="h-4 w-4" />,
      required: true,
      type: 'tel',
    },
    {
      id: 'whatsapp_number',
      label: 'WhatsApp Number',
      placeholder: 'Same as phone (editable)',
      icon: <MessageCircle className="h-4 w-4" />,
      required: false,
      type: 'tel',
    },
    {
      id: 'city',
      label: 'City',
      placeholder: 'e.g. Gurugram',
      icon: <MapPin className="h-4 w-4" />,
      required: true,
    },
  ]

  return (
    <div className="min-h-screen bg-[#080b0a] flex items-center justify-center p-4">
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Back link */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors text-sm font-medium mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Card */}
        <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-7 shadow-2xl">
          {/* Header */}
          <div className="mb-7 text-center">
            <div className="text-3xl mb-3">🏋️</div>
            <h1
              className="text-2xl font-extrabold text-white tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Tell us about your gym
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500 font-medium">
              This helps us personalise your dashboard
            </p>
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 mb-7">
            <span className="h-1.5 w-6 rounded-full bg-emerald-500/40" />
            <span className="h-1.5 w-6 rounded-full bg-emerald-500" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(field => (
              <div key={field.id} className="space-y-1.5">
                <label
                  htmlFor={field.id}
                  className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1"
                >
                  {field.label}
                  {field.required && <span className="text-emerald-500 text-base leading-none">*</span>}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600">
                    {field.icon}
                  </span>
                  <input
                    id={field.id}
                    name={field.id}
                    type={field.type || 'text'}
                    required={field.required}
                    value={form[field.id]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full bg-black/40 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
              </div>
            ))}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300"
              >
                {error}
              </motion.div>
            )}

            <div className="pt-2">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-colors disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating your gym…
                  </>
                ) : (
                  'Create My Gym Profile →'
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Syne font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');`}</style>
    </div>
  )
}
