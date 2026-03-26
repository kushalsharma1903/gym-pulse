'use client'

import { useState, useMemo } from 'react'
import { differenceInDays, isAfter, isBefore, addDays, subHours, formatDistanceToNow, parseISO } from 'date-fns'
import { MessageCircle, CheckCircle2, Loader2, AlertCircle, ArrowUpRight, Send, Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { markReminderSentAction } from '@/app/dashboard/actions'

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.353-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03a11.784 11.815 0 001.592 5.927L0 24l6.135-1.61a11.757 11.784 0 005.91 1.586h.005c6.637 0 12.032-5.396 12.035-12.032a11.762 11.762 0 00-3.48-8.504z"/>
  </svg>
)

interface Member {
  id: string
  name: string
  phone: string
  plan_type: string
  expiry_date: string
  wa_reminder_sent: boolean
  updated_at?: string | null
}

interface GymDetails {
  name: string
  phone: string
}

export default function MessagesClient({ 
  initialMembers, 
  gymDetails 
}: { 
  initialMembers: Member[], 
  gymDetails: GymDetails 
}) {
  const [members, setMembers] = useState(initialMembers)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [confirmingMember, setConfirmingMember] = useState<Member | null>(null)
  const [search, setSearch] = useState('')

  // 1. FILTER: Expiring within 7 days OR already expired
  const eligibleMembers = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const sevenDaysLater = addDays(today, 7)

    return members.filter(m => {
      const expiry = parseISO(m.expiry_date)
      const isExpiringSoon = isBefore(expiry, sevenDaysLater) && (isAfter(expiry, today) || expiry.getTime() === today.getTime())
      const isExpired = isBefore(expiry, today)
      
      const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                           m.phone.includes(search)

      return (isExpiringSoon || isExpired) && matchesSearch
    })
  }, [members, search])

  // 2. STATUS HELPER
  const getDaysStatus = (expiryDate: string) => {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const expiry = parseISO(expiryDate); expiry.setHours(0, 0, 0, 0)
    const diff = differenceInDays(expiry, today)

    if (diff < 0) return { label: `${Math.abs(diff)}d ago`, color: 'bg-red-500/10 text-red-500 border-red-500/20', status: 'expired' }
    if (diff === 0) return { label: 'Today', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', status: 'expiring' }
    if (diff <= 7) return { label: `${diff}d left`, color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', status: 'expiring' }
    return { label: `${diff}d left`, color: 'bg-green-500/10 text-green-500 border-green-500/20', status: 'active' }
  }

  // 3. COOLDOWN HELPER (24 hours)
  const isSentRecently = (member: Member) => {
    if (!member.wa_reminder_sent || !member.updated_at) return false
    const lastUpdate = parseISO(member.updated_at)
    const cooldownEnd = addDays(lastUpdate, 1) // 24 hours later
    return isBefore(new Date(), cooldownEnd)
  }

  // 4. OPEN WHATSAPP LINK
  const handleOpenWA = (member: Member) => {
    const expiry = parseISO(member.expiry_date); expiry.setHours(0, 0, 0, 0)
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const diff = differenceInDays(expiry, today)

    let daysText = `in ${diff} days`
    if (diff < 0) daysText = `has expired`
    else if (diff === 0) daysText = `expires TODAY`
    else if (diff === 1) daysText = `expires tomorrow`

    const message = `Hi ${member.name} 👋\n\nYour membership at ${gymDetails.name} ${daysText}.\n\nPlease renew as soon as possible to continue your fitness journey!\n\nStay consistent 💪\n\nContact us: ${gymDetails.phone}`
    const encodedMessage = encodeURIComponent(message)
    const cleanPhone = member.phone.replace(/[^0-9]/g, '')
    const finalPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`
    
    // Open WhatsApp
    window.open(`https://wa.me/${finalPhone}?text=${encodedMessage}`, '_blank')
    
    // Set for confirmation
    setConfirmingMember(member)
  }

  // 5. UPDATE DATABASE AFTER CONFIRMATION
  const handleConfirmSent = async (member: Member) => {
    if (loadingId) return
    setLoadingId(member.id)

    try {
      const expiry = parseISO(member.expiry_date); expiry.setHours(0, 0, 0, 0)
      const today = new Date(); today.setHours(0, 0, 0, 0)
      const diff = differenceInDays(expiry, today)
      let daysText = diff < 0 ? 'expired' : `in ${diff} days`
      const message = `Hi ${member.name} 👋\n\nYour membership at ${gymDetails.name} ${daysText}.\n\nStay consistent 💪`

      await markReminderSentAction(member.id, message)
      
      setMembers(prev => prev.map(m => 
        m.id === member.id 
          ? { ...m, wa_reminder_sent: true, updated_at: new Date().toISOString() } 
          : m
      ))
      setConfirmingMember(null)
    } catch (err) {
      console.error('Failed to confirm sent:', err)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="space-y-8"
    >
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 w-full">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#eaebe9]">
            Reminders Manager
          </h1>
          <p className="text-sm text-[#737674] mt-1.5 leading-relaxed">
            Track and notify members who are expiring soon or have lapsed.
          </p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="max-w-xl">
        <div className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-xl px-4 py-2 focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all duration-200 group">
          <Search className="h-4 w-4 text-zinc-500 shrink-0 group-focus-within:text-emerald-500 transition-colors duration-200" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            className="w-full bg-transparent border-none p-0 text-white placeholder-zinc-600 focus:ring-0 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE SECTION - Wrapped in proper card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
        whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}
        className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden transition-all duration-200 ease-out hover:border-zinc-600 hover:bg-zinc-900/60"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm border-collapse">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'rgba(242,239,233,0.35)' }} className="border-b border-white/5">
                <th className="px-6 py-4">Member</th>
                <th className="px-6 py-5">Plan</th>
                <th className="px-6 py-5">Expiry Date</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {eligibleMembers.length === 0 ? (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key="empty"
                    >
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col items-center gap-4 opacity-60"
                        >
                          <div className="relative">
                            <div className="h-14 w-14 rounded-2xl bg-white/[0.03] border border-white/8 flex items-center justify-center">
                              <AlertCircle className="h-6 w-6 text-zinc-500" />
                            </div>
                            <motion.div
                              className="absolute inset-0 rounded-2xl border border-white/10"
                              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                            />
                          </div>
                          <div className="space-y-1">
                            <p className="font-semibold text-white text-sm tracking-tight">No pending reminders</p>
                            <p className="text-xs text-zinc-600">All members are up to date</p>
                          </div>
                        </motion.div>
                      </td>
                    </motion.tr>
                ) : (
                  eligibleMembers.map(member => {
                    const status = getDaysStatus(member.expiry_date)
                    const sentRecently = isSentRecently(member)
                    
                    return (
                      <motion.tr 
                        key={member.id} 
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: status.status === 'expired' ? 0.55 : 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className={`transition-all duration-150 group ${
                          status.status === 'expired' 
                            ? 'bg-red-500/[0.04] hover:bg-red-500/[0.08]' 
                            : 'bg-amber-500/[0.04] hover:bg-amber-500/[0.08]'
                        }`}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center font-semibold text-xs text-zinc-300 group-hover:border-white/20 transition-colors">
                              {member.name.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-white tracking-tight group-hover:text-amber-400 transition-colors">{member.name}</span>
                              <span className="text-[11px] font-medium text-zinc-500 mt-0.5">{member.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 font-semibold text-zinc-400/80 group-hover:text-zinc-400 transition-colors">{member.plan_type}</td>
                        <td className="px-6 py-5 font-medium text-zinc-500">
                          {new Date(member.expiry_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-5">
                          {(() => {
                            const today = new Date(); today.setHours(0,0,0,0)
                            const expiry = parseISO(member.expiry_date); expiry.setHours(0,0,0,0)
                            const diff = differenceInDays(expiry, today)
                            const isUrgent = diff >= 0 && diff <= 3
                            return (
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold border transition-all duration-200 ${
                                status.status === 'expired'
                                  ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                  : 'bg-amber-400 text-black border-amber-300'
                              }`}
                                style={isUrgent ? { animation: 'urgentPulse 2s ease-in-out infinite' } : undefined}
                              >
                                {status.label}
                              </span>
                            )
                          })()}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end h-full">
                            <motion.button 
                              onClick={() => handleOpenWA(member)}
                              disabled={sentRecently || loadingId === member.id}
                              whileHover={sentRecently ? {} : { scale: 1.05 }}
                              whileTap={sentRecently ? {} : { scale: 0.95 }}
                              title={sentRecently ? "Reminder Sent (24h cooldown)" : "Send WhatsApp Reminder"}
                              aria-label={sentRecently ? "Reminder Sent" : "Send WhatsApp Reminder"}
                              className={`h-9 w-9 rounded-lg flex items-center justify-center border transition-all duration-200 ease-out will-change-transform ${
                                sentRecently 
                                  ? 'border-[#25D366]/30 text-[#25D366]/50 bg-[#25D366]/5 cursor-default' 
                                  : 'border-[#25D366]/20 text-[#25D366] hover:bg-[rgba(37,211,102,0.15)] hover:border-[rgba(37,211,102,0.4)]'
                              }`}
                            >
                              {loadingId === member.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : sentRecently ? (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              ) : (
                                <WhatsAppIcon className="h-4 w-4" />
                              )}
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      <AnimatePresence>
        {confirmingMember && (
          <ConfirmationModal 
            member={confirmingMember}
            loading={loadingId === confirmingMember.id}
            onConfirm={() => handleConfirmSent(confirmingMember)}
            onCancel={() => setConfirmingMember(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ConfirmationModal({ 
  member, 
  onConfirm, 
  onCancel,
  loading 
}: { 
  member: Member, 
  onConfirm: () => void, 
  onCancel: () => void,
  loading: boolean
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onCancel}
      />
      <motion.div 
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="relative w-full max-w-sm bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl p-6 relative overflow-hidden"
      >
        {/* Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-[#25D366]/50 blur-sm rounded-full" />
        
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex items-center gap-4 w-full p-4 rounded-2xl bg-white/5 border border-white/5 text-left">
            <div className="h-12 w-12 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-lg shadow-[#25D366]/20 shrink-0">
              <WhatsAppIcon className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold truncate">{member.name}</p>
              <p className="text-zinc-500 text-xs font-medium">{member.phone}</p>
            </div>
          </div>

          <div className="bg-[#25D366]/10 border border-[#25D366]/20 rounded-2xl p-4 w-full">
            <p className="text-[#25D366] text-sm font-medium leading-relaxed">
              Did you send the reminder? Confirming will update the status in the dashboard.
            </p>
          </div>

          <div className="flex gap-3 w-full mt-2">
            <motion.button 
              onClick={onCancel}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-all duration-200 border border-white/5 outline-none"
            >
              No, Cancel
            </motion.button>
            <motion.button 
              onClick={onConfirm}
              disabled={loading}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="flex-1 px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-[#25D366]/20 flex items-center justify-center gap-2 outline-none"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Yes, I Sent It</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
