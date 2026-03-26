'use client'

import { useState } from 'react'
import { addMemberAction } from '@/app/dashboard/actions'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Plus } from 'lucide-react'

export default function AddMemberModal({ gymId }: { gymId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  const [memberCode, setMemberCode] = useState('')
  const [isCouple, setIsCouple] = useState(false)

  const handleOpen = () => {
    // Auto-generate 4 digit code on modal open
    setMemberCode(Math.floor(1000 + Math.random() * 9000).toString())
    setIsCouple(false)
    setErrorMsg(null)
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)
    
    try {
      const formData = new FormData(e.currentTarget)
      const result = await addMemberAction(formData)
      
      if (result?.error) {
        setErrorMsg(result.error)
      } else if (result?.success) {
        setIsOpen(false)
      }
    } catch (error: any) {
      console.error('Form submission caught error:', error)
      setErrorMsg(error.message || "A local network error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!gymId) return null

  return (
    <>
      <motion.button 
        onClick={handleOpen}
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="relative w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#1fce7e] px-6 py-2.5 text-sm font-bold text-[#080b0a] hover:bg-[#1fce7e]/90 transition-all duration-200 shadow-[0_0_20px_rgba(31,206,126,0.35)] hover:shadow-[0_0_32px_rgba(31,206,126,0.55)]"
      >
        {/* Subtle ring pulse */}
        <motion.span
          className="absolute inset-0 rounded-xl border border-[#1fce7e]/50"
          animate={{ scale: [1, 1.08, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <Plus className="h-4 w-4" />
        <span>Add Member</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="relative w-full max-w-lg bg-[#0f0f0f] rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center shrink-0">
                <h3 className="text-lg font-semibold text-white tracking-tight">Add New Member</h3>
                <motion.button 
                  onClick={() => setIsOpen(false)} 
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-zinc-500 hover:text-white transition-all duration-200 text-2xl leading-none"
                >
                  &times;
                </motion.button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
                {errorMsg && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-medium uppercase tracking-widest p-3 rounded-xl animate-in fade-in slide-in-from-top-2">
                    {errorMsg}
                  </div>
                )}

                <input type="hidden" name="gymId" value={gymId} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 tracking-wider mb-1.5 ml-1">Full Name</label>
                    <motion.input 
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.15 }}
                      required type="text" name="name" placeholder="John Doe" className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 placeholder:text-zinc-700" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 tracking-wider mb-1.5 ml-1">Phone Number</label>
                    <input required type="tel" name="phone" placeholder="+91 98765 43210" className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 placeholder:text-zinc-700" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 tracking-wider mb-1.5 ml-1">Plan Duration</label>
                    <select required name="planMonths" className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200">
                      <option value="1">1 Month</option>
                      <option value="3">3 Months</option>
                      <option value="6">6 Months</option>
                      <option value="12">12 Months (1 Year)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 tracking-wider mb-1.5 ml-1">Joining Date</label>
                    <input required type="date" name="joiningDate" defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 [color-scheme:dark]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 tracking-wider mb-1.5 ml-1">Amount Paid (₹)</label>
                    <input required type="number" name="feePaid" placeholder="e.g. 5000" min="0" className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 placeholder:text-zinc-700" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-500 tracking-wider mb-1.5 ml-1">Member Code</label>
                    <input required type="text" name="memberCode" value={memberCode} onChange={(e) => setMemberCode(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 font-mono" />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        name="isCouple"
                        checked={isCouple}
                        onChange={(e) => setIsCouple(e.target.checked)}
                        className="w-5 h-5 rounded bg-black/40 border-white/10 text-emerald-500 focus:ring-0 focus:ring-offset-0 cursor-pointer transition-all duration-200" 
                      />
                    </div>
                    <span className="text-xs font-medium text-zinc-500 group-hover:text-white transition-colors">Couple Membership</span>
                  </label>
                </div>

                {isCouple && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1.5"
                  >
                    <label className="block text-[11px] font-medium text-zinc-500 tracking-wider mb-1.5 ml-1">Partner's Full Name</label>
                    <input required type="text" name="partnerName" placeholder="Jane Doe" className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 placeholder:text-zinc-700" />
                  </motion.div>
                )}

                <div className="pt-4 flex justify-end gap-3 shrink-0">
                  <motion.button 
                    type="button" 
                    onClick={() => setIsOpen(false)} 
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="px-6 py-2.5 text-sm font-medium text-zinc-500 hover:text-white transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button 
                    type="submit" 
                    disabled={isSubmitting} 
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="rounded-xl bg-emerald-600 px-8 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Add Member'
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
