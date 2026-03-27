'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Save, Loader2, CheckCircle2, Camera, Upload, X, LogOut } from 'lucide-react'
import { SettingsSkeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'
import Cropper from 'react-easy-crop'
import { motion, AnimatePresence } from 'framer-motion'
import { getCroppedImg } from '@/utils/crop-image'
import { useGym } from '@/components/gym-context'
import Paywall from '@/components/paywall'

export default function SettingsClient({ initialGym, initialProfile }: { initialGym: any, initialProfile: any }) {
  const { updateGymDetails } = useGym()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  
  // Billing State
  const [userProfile, setUserProfile] = useState<any>(initialProfile)
  const [showPaywallModal, setShowPaywallModal] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  // Cropper State
  const [image, setImage] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [showCropper, setShowCropper] = useState(false)

  const [formData, setFormData] = useState({
    gym_name: initialGym?.gym_name || '',
    owner_name: initialGym?.owner_name || '',
    phone: initialGym?.phone || '',
    whatsapp_number: initialGym?.whatsapp_number || '',
    address: initialGym?.address || '',
    logo_url: initialGym?.logo_url || ''
  })
  
  const [userGymId, setUserGymId] = useState<string | null>(initialGym?.id || null)

  // Initialize Supabase client
  const supabase = createClient()

  useEffect(() => {
    if (initialGym) {
      updateGymDetails({ 
        gymName: initialGym.gym_name || 'GymPulse', 
        logoUrl: initialGym.logo_url || null 
      })
    }
  }, [initialGym, updateGymDetails])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setImage(url)
      setShowCropper(true)
    }
  }

  const onCropComplete = useCallback((_setCroppedArea: any, pixelCrop: any) => {
    setCroppedAreaPixels(pixelCrop)
  }, [])

  const saveCroppedImage = async () => {
    if (!image || !croppedAreaPixels) return

    setUploading(true)
    setError(null)

    try {
      const croppedBlob = await getCroppedImg(image, croppedAreaPixels)
      if (!croppedBlob) throw new Error('Failed to crop image')

      const { data: authData } = await supabase.auth.getUser()
      if (!authData?.user) throw new Error('Not authenticated')

      const fileName = `${authData.user.id}-${Date.now()}.jpg`
      const filePath = `logos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('gym-logos')
        .upload(filePath, croppedBlob, { contentType: 'image/jpeg' })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('gym-logos')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, logo_url: publicUrl }))
      updateGymDetails({ logoUrl: publicUrl })
      
      setShowCropper(false)
      setImage(null)
    } catch (err: any) {
      setError('Logo upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const { data: authData } = await supabase.auth.getUser()
      if (!authData?.user) throw new Error('Not authenticated')

      const updates = {
        owner_id: authData.user.id,
        gym_name: formData.gym_name,
        owner_name: formData.owner_name,
        phone: formData.phone,
        whatsapp_number: formData.whatsapp_number,
        address: formData.address,
        logo_url: formData.logo_url,
        updated_at: new Date().toISOString()
      }

      let resultError

      if (userGymId) {
        const { error: updateError } = await supabase
          .from('gyms')
          .update(updates)
          .eq('id', userGymId)
        resultError = updateError
      } else {
        const { data, error: insertError } = await supabase
          .from('gyms')
          .insert([updates])
          .select()
          .single()
        resultError = insertError
        if (data) setUserGymId(data.id)
      }

      if (resultError) throw resultError

      updateGymDetails({ gymName: formData.gym_name })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const handleCancelSubscription = () => {
    setShowCancelConfirm(true)
  }

  const confirmCancelSubscription = async () => {
    setShowCancelConfirm(false)
    setCancelling(true)
    setError(null)
    try {
      const res = await fetch('/api/razorpay/cancel-subscription', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      
      setUserProfile((prev: any) => ({ ...prev, subscription_status: 'cancelled' }))
    } catch (err: any) {
      setError(err.message || 'Failed to cancel subscription')
    } finally {
      setCancelling(false)
    }
  }

  const getPlanPrice = (tier: string, plan: string) => {
    if (tier === 'pro') {
      if (plan === 'monthly') return '₹999/mo'
      if (plan === 'halfyearly') return '₹5,094/6mo'
      if (plan === 'yearly') return '₹8,988/yr'
    } else if (tier === 'business') {
      if (plan === 'monthly') return '₹1,799/mo'
      if (plan === 'halfyearly') return '₹9,174/6mo'
      if (plan === 'yearly') return '₹16,188/yr'
    }
    return ''
  }

  const renderBilling = () => {
    if (!userProfile) return null

    if (userProfile.subscription_status === 'trial') {
      const start = new Date(userProfile.trial_started_at)
      const end = new Date(start)
      end.setDate(end.getDate() + 30)
      const daysLeft = Math.ceil((end.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

      return (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-sm">
            <p className="font-semibold text-emerald-400 mb-1">Free Trial Active</p>
            <p className="text-zinc-400">You are on a free trial — {daysLeft > 0 ? daysLeft : 0} days left.</p>
          </div>
          <button type="button" onClick={() => setShowPaywallModal(true)} className="w-auto self-start px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-500 transition-all">
            Upgrade Now
          </button>
        </div>
      )
    }

    if (userProfile.subscription_status === 'cancelled') {
        const remaining = userProfile.subscription_end_date ? new Date(userProfile.subscription_end_date) : new Date()
        const isExpired = remaining <= new Date()

        if (isExpired) {
           return (
              <div className="flex flex-col gap-4">
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 text-sm">
                  <p className="font-semibold text-red-500 mb-1">Subscription Expired</p>
                  <p className="text-zinc-400">Your access has expired.</p>
                </div>
                <button type="button" onClick={() => setShowPaywallModal(true)} className="w-auto self-start px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 transition-all">
                  Renew Now
                </button>
              </div>
           )
        } else {
           return (
               <div className="flex flex-col gap-4">
                <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5 text-sm">
                  <p className="font-semibold text-yellow-500 mb-1">Subscription Cancelled</p>
                  <p className="text-zinc-400">You have access until {remaining.toLocaleDateString()}.</p>
                </div>
                <button type="button" onClick={() => setShowPaywallModal(true)} className="w-auto self-start px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-500 transition-all">
                  Renew Now
                </button>
              </div>
           )
        }
    }

    if (userProfile.subscription_status === 'active') {
      return (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 grid grid-cols-2 gap-y-4 gap-x-6">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 mb-1">Current Tier</p>
              <p className="text-sm font-bold text-white capitalize">{userProfile.subscription_tier}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 mb-1">Billing Cycle</p>
              <p className="text-sm font-bold text-white capitalize">{userProfile.subscription_plan === 'halfyearly' ? 'Half-Yearly' : userProfile.subscription_plan}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 mb-1">Next Billing Date</p>
              <p className="text-sm font-bold text-white">
                {userProfile.subscription_end_date ? new Date(userProfile.subscription_end_date).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 mb-1">Amount</p>
              <p className="text-sm font-bold text-white">{getPlanPrice(userProfile.subscription_tier, userProfile.subscription_plan)}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
            <button type="button" onClick={() => setShowPaywallModal(true)} className="px-6 py-2.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-all">
              Change Plan
            </button>
            <button 
              type="button" 
              onClick={handleCancelSubscription}
              disabled={cancelling}
              className="px-4 py-2.5 text-xs font-semibold text-zinc-500 hover:text-red-400 transition-colors"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
            </button>
          </div>
        </div>
      )
    }

    return null
  }

  if (loading) return <SettingsSkeleton />

  return (
    <motion.div 
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="max-w-[1400px] mx-auto px-6 py-8"
    >
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#eaebe9]">
              Gym Settings
            </h1>
            <p className="mt-1.5 text-sm text-[#737674] leading-relaxed">
              Update your gym profile and manage your subscription.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-2xl space-y-8">
          
          <div className="rounded-2xl border border-white/5 bg-[#0a0a0a]/80 p-6 md:p-8 shadow-2xl shadow-black/50 backdrop-blur-xl">
            <h2 className="text-lg font-bold text-white mb-6">Billing & Subscription</h2>
            {renderBilling()}
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl border border-white/5 bg-[#0a0a0a]/80 p-6 md:p-8 shadow-2xl shadow-black/50 backdrop-blur-xl">
            
            <div className="mb-6 md:mb-8 pb-6 md:pb-8 border-b border-white/5">
              <label className="flex items-center gap-4 md:gap-6 p-4 md:p-5 border border-white/10 rounded-xl cursor-pointer hover:border-emerald-500/40 transition group relative overflow-hidden bg-white/[0.02]">
                <div style={{ width: 64, height: 64, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#111', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {formData.logo_url ? (
                    <img 
                      src={formData.logo_url} 
                      alt="Logo Preview" 
                      style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                    />
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center gap-1 opacity-30">
                      <Camera className="h-5 w-5 text-white" />
                      <span className="text-[8px] font-bold text-white uppercase tracking-tighter">No Logo</span>
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-10" style={{ borderRadius: 8 }}>
                      <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">Business Branding</p>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">PNG, JPG recommended. <br/>All logos will be cropped to square (80×80px).</p>
                </div>

                <div className="h-9 w-9 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 group-hover:border-emerald-500/40 transition-all">
                  <Upload className="h-4 w-4" />
                </div>

                <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} disabled={uploading} />
              </label>

              {error && error.toLowerCase().includes('logo') && (
                <div className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
                  {error}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="gym_name" className="flex items-center gap-2 text-xs font-semibold text-zinc-500 tracking-wider ml-1">
                  Gym Name
                </label>
                <motion.input
                  type="text"
                  id="gym_name"
                  name="gym_name"
                  value={formData.gym_name}
                  onChange={handleChange}
                  placeholder="Enter gym name"
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.15 }}
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 placeholder:text-zinc-700"
                  required
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="owner_name" className="flex items-center gap-2 text-xs font-semibold text-zinc-500 tracking-wider ml-1">
                  Owner Name
                </label>
                <motion.input
                  type="text"
                  id="owner_name"
                  name="owner_name"
                  value={formData.owner_name}
                  onChange={handleChange}
                  placeholder="Owner's full name"
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.15 }}
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 placeholder:text-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="flex items-center gap-2 text-xs font-semibold text-zinc-500 tracking-wider ml-1">
                  Phone Number
                </label>
                <motion.input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Primary contact"
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.15 }}
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 placeholder:text-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="whatsapp_number" className="flex items-center gap-2 text-xs font-semibold text-zinc-500 tracking-wider ml-1">
                  WhatsApp Number
                </label>
                <motion.input
                  type="tel"
                  id="whatsapp_number"
                  name="whatsapp_number"
                  value={formData.whatsapp_number}
                  onChange={handleChange}
                  placeholder="WhatsApp number"
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.15 }}
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 placeholder:text-zinc-700"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="address" className="flex items-center gap-2 text-xs font-semibold text-zinc-500 tracking-wider ml-1">
                  Address
                </label>
                <motion.textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Complete gym address"
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.15 }}
                  className="w-full resize-y min-h-[80px] bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-sm font-medium text-white placeholder-zinc-700 transition-all focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {error && !error.toLowerCase().includes('logo') && (
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-200">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-300 animate-in fade-in slide-in-from-top-2 duration-300">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                Settings saved successfully!
              </div>
            )}

            <div className="mt-10 pt-6 border-t border-white/5 space-y-4">
              <motion.button
                type="submit"
                disabled={saving || loading || uploading}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-sm font-bold text-white shadow-lg transition-all disabled:opacity-50 will-change-transform ${
                  success 
                    ? 'bg-[#1fce7e] border border-[#1fce7e]/40 shadow-[#1fce7e]/20 hover:bg-[#1fce7e]/90' 
                    : 'border border-emerald-400/20 bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-500 hover:shadow-emerald-500/30'
                }`}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : success ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving ? 'Saving changes...' : success ? 'Saved!' : 'Save Settings'}
              </motion.button>

              <motion.button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-transparent px-8 py-4 text-sm font-bold text-red-500 transition-all hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </motion.button>
            </div>
          </form>
        </div>

        <AnimatePresence>
          {showLogoutConfirm && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={() => setShowLogoutConfirm(false)}
              />
              <motion.div 
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                style={{ backgroundColor: '#111111' }}
                className="relative w-full max-w-sm border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 text-center"
              >
                <div className="mb-6 flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                    <LogOut className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Sign Out?</h3>
                <p className="text-zinc-400 text-sm mb-8">Are you sure you want to end your session?</p>
                <div className="flex flex-col gap-3">
                  <button onClick={handleLogout} className="w-full py-3.5 rounded-xl bg-red-600 text-sm font-bold text-white hover:bg-red-500 transition-all shadow-lg shadow-red-600/20 active:scale-[0.98]">Yes, Sign Out</button>
                  <button onClick={() => setShowLogoutConfirm(false)} className="w-full py-3.5 rounded-xl bg-zinc-800 text-sm font-bold text-zinc-300 hover:bg-zinc-700 transition-all active:scale-[0.98]">Cancel</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCancelConfirm && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={() => setShowCancelConfirm(false)}
              />
              <motion.div 
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                style={{ backgroundColor: '#111111' }}
                className="relative w-full max-w-sm border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 text-center"
              >
                <div className="mb-6 flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                    <X className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Cancel Subscription?</h3>
                <p className="text-zinc-400 text-sm mb-8 leading-relaxed">You'll lose access at the end of your current billing period. This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowCancelConfirm(false)} className="flex-1 py-3.5 rounded-xl border border-white/10 bg-transparent text-sm font-bold text-white hover:bg-white/5 transition-all active:scale-[0.98]">Keep Subscription</button>
                  <button onClick={confirmCancelSubscription} className="flex-1 py-3.5 rounded-xl bg-red-600 text-sm font-bold text-white hover:bg-red-500 transition-all shadow-lg shadow-red-600/20 active:scale-[0.98]">Yes, Cancel</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCropper && image && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={() => !uploading && setShowCropper(false)}
              />
              <motion.div 
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Adjust Logo</h3>
                  <button onClick={() => setShowCropper(false)} className="h-8 w-8 rounded-full hover:bg-white/5 flex items-center justify-center text-zinc-500 transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div style={{ position: 'relative', width: '100%', height: '300px', backgroundColor: '#000' }}>
                  <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>
                <div className="p-6 space-y-6 bg-zinc-900/50">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold text-zinc-500 uppercase tracking-widest">
                      <span>Zoom</span>
                      <span className="text-emerald-500">{Math.round(zoom * 100)}%</span>
                    </div>
                    <input type="range" value={zoom} min={1} max={3} step={0.1} aria-labelledby="Zoom" onChange={(e: any) => setZoom(e.target.value)} className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setShowCropper(false)} disabled={uploading} className="flex-1 py-3 px-4 rounded-xl bg-zinc-800 text-sm font-bold text-zinc-300 hover:bg-zinc-700 transition-all disabled:opacity-50">Cancel</button>
                    <button onClick={saveCroppedImage} disabled={uploading} className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 text-sm font-bold text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50">
                      {uploading ? <><Loader2 className="h-4 w-4 animate-spin" /><span>Uploading...</span></> : <span>Save Logo</span>}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showPaywallModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[200] bg-[#080b0a]/95 backdrop-blur-md overflow-y-auto"
            >
              <motion.button
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.2 }}
                onClick={() => setShowPaywallModal(false)}
                className="fixed top-4 right-5 z-[210] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-xs font-semibold"
                aria-label="Back to dashboard"
              >
                <X className="h-3.5 w-3.5" />
                Close
              </motion.button>
              <Paywall mode="upgrade" />
            </motion.div>
          )}
        </AnimatePresence>
    </motion.div>
  )
}
