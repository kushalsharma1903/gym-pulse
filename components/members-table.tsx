'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Search, Pencil, Trash2, Loader2, User, RotateCcw, Download, Lock } from 'lucide-react'
import { renewMemberAction, markReminderSentAction } from '@/app/dashboard/actions'
import { format, parseISO } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'

interface Member {
  id: string
  name: string
  phone: string
  member_code: string
  plan_type: string
  plan_months: number
  joining_date: string
  expiry_date: string
  fee_paid: number
  is_couple: boolean
  partner_name?: string
  wa_reminder_sent: boolean
  updated_at?: string
}

interface GymDetails {
  id: string
  gym_name: string
  phone: string
  whatsapp_number: string
  wa_template: string
}

function getDaysLeft(expiryDate: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate)
  expiry.setHours(0, 0, 0, 0)
  return Math.ceil((expiry.getTime() - today.getTime()) / 86400000)
}

function getStatus(daysLeft: number) {
  if (daysLeft < 0) return 'expired'
  if (daysLeft <= 7) return 'expiring'
  return 'active'
}

export default function MembersTable({ members, gym, historicalRevenue = 0, planTier = 'free' }: { members: Member[], gym: GymDetails, historicalRevenue?: number, planTier?: string }) {
  const router = useRouter()
  const supabase = createClient()
  
  const canExport = planTier?.toLowerCase() === 'business'

  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const [renewingMember, setRenewingMember] = useState<Member | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Member | null>(null)

  const stats = useMemo(() => {
    const counts = { active: 0, expiring: 0, expired: 0, revenue: historicalRevenue }
    const currentYear = new Date().getFullYear()
    
    members.forEach(m => {
      const days = getDaysLeft(m.expiry_date)
      const status = getStatus(days)
      if (status === 'active') counts.active++
      else if (status === 'expiring') counts.expiring++
      else if (status === 'expired') counts.expired++
      
      // Accrual Revenue Calculation for current year
      if (m.joining_date && m.fee_paid) {
        const planMonths = m.plan_months || (m.plan_type ? parseInt(m.plan_type) : 1) || 1
        const monthlyRate = m.fee_paid / planMonths
        const joinDate = new Date(m.joining_date)

        for (let i = 0; i < planMonths; i++) {
          const targetDate = new Date(joinDate.getFullYear(), joinDate.getMonth() + i, 1)
          if (targetDate.getFullYear() === currentYear) {
            counts.revenue += monthlyRate
          }
        }
      }
    })
    return counts
  }, [members, historicalRevenue])

  const filtered = useMemo(() => {
    return members.filter(m => {
      const days = getDaysLeft(m.expiry_date)
      const status = getStatus(days)
      const matchFilter = filter === 'all' || status === filter
      const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.member_code.includes(search)
      return matchFilter && matchSearch
    })
  }, [members, filter, search])

  const handleDelete = async (member: Member) => {
    setDeletingId(member.id)
    const { error } = await supabase.from('members').delete().eq('id', member.id)
    if (!error) router.refresh()
    setDeletingId(null)
    setShowDeleteConfirm(null)
  }

  const handleWhatsApp = async (member: Member) => {
    const days = getDaysLeft(member.expiry_date)
    const daysText = days < 0 ? 'has expired' : days === 0 ? 'today' : days === 1 ? 'tomorrow' : `in ${days} days`
    const message = `Hi ${member.name} 👋\n\nYour membership at ${gym?.gym_name || 'GymPulse'} expires ${daysText}.\n\nStay consistent! 💪`
    window.open(`https://wa.me/${member.phone}?text=${encodeURIComponent(message)}`, '_blank')
    await markReminderSentAction(member.id, message)
    router.refresh()
  }

  const handleExportCSV = () => {
    const headers = ['Name', 'Phone', 'Plan', 'Joining Date', 'Expiry Date', 'Amount Paid (₹)']
    const rows = members.map(m => [
      m.is_couple && m.partner_name ? `${m.name} & ${m.partner_name}` : m.name,
      m.phone,
      m.plan_type,
      m.joining_date ? format(parseISO(m.joining_date), 'dd MMM yyyy') : '',
      m.expiry_date ? format(parseISO(m.expiry_date), 'dd MMM yyyy') : '',
      m.fee_paid ?? 0
    ])
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${gym.gym_name.replace(/\s+/g, '_')}_members_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Stats Section */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2 mb-8 relative z-10"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      >
        {[
          { label: 'Active', val: stats.active, color: '#1fce7e' },
          { label: 'Expiring', val: stats.expiring, color: '#ffa028' },
          { label: 'Expired', val: stats.expired, color: '#ff5050' },
          { label: 'Year Revenue', val: formatCurrency(stats.revenue), color: '#75e0ff' }
        ].map(s => (
          <motion.div 
            key={s.label} 
            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } }}
            whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}
            className="p-5 rounded-2xl group transition-all duration-200 ease-out relative overflow-hidden will-change-transform"
            style={{
              background: '#0e1210',
              border: '1px solid rgba(255,255,255,0.06)'
            }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity duration-500" style={{ backgroundColor: s.color }} />
            <p style={{ fontSize: '11.5px', fontWeight: 500, letterSpacing: '0.4px', textTransform: 'uppercase', color: 'rgba(242,239,233,0.4)', marginBottom: '6px' }}>{s.label}</p>
            <p style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1, color: '#eaebe9' }}>{s.val}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: '#0e1210', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
            <h3 className="font-semibold text-lg text-[#eaebe9] tracking-tight shrink-0 flex items-center gap-[10px]">
              <span style={{ display: 'inline-block', width: 3, height: 16, background: '#1FCE7E', borderRadius: 2, flexShrink: 0 }} />
              Member Directory
            </h3>
            <div className="flex items-center gap-3 bg-[#080b0a] border border-white/5 rounded-xl px-3 py-2 focus-within:border-[#1fce7e]/40 focus-within:ring-2 focus-within:ring-[#1fce7e]/10 transition-all w-full group">
              <Search className="h-4 w-4 text-[#a9aca9] shrink-0 group-focus-within:text-[#1fce7e] transition-colors duration-200" />
              <input 
                type="text" 
                placeholder="Search name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none p-0 text-sm text-[#eaebe9] focus:ring-0 w-full placeholder:text-[#737674]"
              />
            </div>
          </div>
          
          <div className="flex flex-row flex-nowrap gap-2 p-1 bg-[#080b0a] border border-white/5 rounded-xl self-start md:self-auto">
            {['all', 'active', 'expiring', 'expired'].map(mode => (
              <motion.button 
                key={mode} 
                onClick={() => setFilter(mode)}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200 ${filter === mode ? 'bg-white/10 text-white shadow-lg shadow-white/5' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {mode}
              </motion.button>
            ))}
          </div>

          {/* Export CSV */}
          <div
            style={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <motion.button
              onClick={canExport ? handleExportCSV : undefined}
              disabled={!canExport}
              whileHover={canExport ? { scale: 1.02, y: -1 } : {}}
              whileTap={canExport ? { scale: 0.96 } : {}}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              style={{ opacity: canExport ? 1 : 0.5, cursor: canExport ? 'pointer' : 'not-allowed' }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                canExport 
                  ? 'bg-[#1fce7e]/10 border border-[#1fce7e]/20 text-[#1fce7e] hover:bg-[#1fce7e]/15 hover:border-[#1fce7e]/40' 
                  : 'border border-white/5 text-zinc-600 bg-white/[0.02]'
              }`}
            >
              {!canExport && <Lock className="h-3.5 w-3.5" />}
              {canExport && <Download className="h-3.5 w-3.5" />}
              Export CSV
            </motion.button>

            {!canExport && showTooltip && (
              <div style={{
                position: 'absolute',
                bottom: '110%',
                right: 0,
                zIndex: 9999,
                background: '#1a1a1a',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}>
                Available on Business plan
              </div>
            )}
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="py-24 text-center flex flex-col items-center gap-4"
            >
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-white/[0.03] border border-white/8 flex items-center justify-center" style={{ opacity: 0.3 }}>
                  <User className="h-7 w-7 text-zinc-400" />
                </div>
                <motion.div
                  className="absolute inset-0 rounded-2xl border border-white/10"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
              <div className="space-y-1">
                <p style={{ fontSize: 15, fontWeight: 500, color: 'rgba(242,239,233,0.7)' }}>No members found</p>
                <p style={{ fontSize: 13, fontWeight: 400, color: 'rgba(242,239,233,0.35)', maxWidth: 200, margin: '0 auto', lineHeight: 1.6 }}>Add your first member to get started</p>
              </div>
            </motion.div>
          ) : (
            <table className="w-full border-collapse min-w-[900px] table-fixed">
              <thead>
                <tr className="border-b border-white/5" style={{ background: 'rgba(255,255,255,0.02)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'rgba(242,239,233,0.35)' }}>
                  <th className="px-6 py-5 text-left w-[28%]">Member</th>
                  <th className="px-6 py-5 text-left w-[12%]">Code</th>
                  <th className="px-6 py-5 text-left w-[15%]">Plan & Paid</th>
                  <th className="px-6 py-5 text-center w-[14%]">Joined</th>
                  <th className="px-6 py-5 text-center w-[11%]">Days Left</th>
                  <th className="px-6 py-5 text-center w-[10%]">Status</th>
                  <th className="px-6 py-5 text-right w-[10%]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence initial={false}>
                  {filtered.map(member => {
                    const days = getDaysLeft(member.expiry_date)
                    const status = getStatus(days)
                    const colorClass = status === 'active' ? 'text-[#1fce7e]' : status === 'expiring' ? 'text-[#ffa028]' : 'text-[#ff5050]'
                    const dispName = member.is_couple && member.partner_name ? `${member.name} & ${member.partner_name}` : member.name

                    return (
                      <motion.tr 
                        key={member.id} 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className={`group transition-all duration-150 ${
                          status === 'expired' 
                            ? 'bg-[#ff5050]/5 hover:bg-[#ff5050]/10' 
                            : status === 'expiring' 
                              ? 'bg-[#ffa028]/5 hover:bg-[#ffa028]/10' 
                              : 'hover:bg-white/[0.03]'
                        }`}
                      >
                        <td className="px-6 py-4 truncate" style={{ fontSize: '13.5px', lineHeight: 1.5 }}>
                          <div className="flex items-center gap-3 max-w-full">
                             <div className="h-9 w-9 rounded-full flex items-center justify-center font-semibold shrink-0 text-xs transition-colors"
                                  style={{ background: 'rgba(255,255,255,0.05)', color: '#eaebe9', border: '1px solid rgba(255,255,255,0.1)' }}>
                               {member.name.charAt(0)}
                             </div>
                             <div className="flex flex-col min-w-0">
                               <span className="font-bold text-sm text-[#eaebe9] group-hover:text-white transition-colors truncate" title={dispName}>{dispName}</span>
                               <span className="text-[#a9aca9] font-medium text-xs group-hover:text-[#eaebe9] transition-colors truncate" title={member.phone}>{member.phone}</span>
                             </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs font-medium text-[#737674] group-hover:text-[#a9aca9] transition-colors truncate" title={member.member_code}>
                          {member.member_code}
                        </td>
                        <td className="px-6 py-4 truncate">
                           <div className="flex flex-col min-w-0">
                              <span className="text-[#a9aca9] font-semibold text-xs truncate" title={member.plan_type}>{member.plan_type}</span>
                              <span className="text-[#1fce7e]/80 group-hover:text-[#1fce7e] font-bold text-xs transition-colors truncate" title={`₹${member.fee_paid?.toLocaleString()}`}>₹{member.fee_paid?.toLocaleString()}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-center text-[#737674] text-xs font-medium whitespace-nowrap">
                           {member.joining_date ? format(parseISO(member.joining_date), 'dd MMM yyyy') : '---'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`text-sm font-bold ${colorClass}`}>
                            {days < 0
                              ? `${Math.abs(days)}d ago`
                              : days === 0
                                ? 'Today'
                                : `${days}d left`}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center gap-2 font-semibold capitalize ${colorClass}`}
                            style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: '0.3px',
                              background: status === 'expired' ? 'rgba(255,80,80,0.1)' : status === 'expiring' ? 'rgba(255,160,40,0.1)' : 'rgba(31,206,126,0.1)',
                              border: `1px solid ${status === 'expired' ? 'rgba(255,80,80,0.2)' : status === 'expiring' ? 'rgba(255,160,40,0.2)' : 'rgba(31,206,126,0.2)'}`
                            }}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                              {/* Edit — always shown */}
                              <motion.button 
                                onClick={() => router.push(`/dashboard/members/${member.id}`)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                title="Edit Member"
                                aria-label="Edit Member"
                                className="h-9 w-9 rounded-lg flex items-center justify-center border border-white/8 text-zinc-400 hover:text-white hover:bg-white/8 hover:border-white/15 transition-all duration-200 ease-out will-change-transform"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </motion.button>

                              {/* Renew — expired only */}
                              {status === 'expired' && (
                                <motion.button 
                                  onClick={() => setRenewingMember(member)}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  title="Renew Membership"
                                  aria-label="Renew Membership"
                                  className="h-9 w-9 rounded-lg flex items-center justify-center border border-[#3b82f6]/20 text-[#3b82f6] hover:bg-[#3b82f6]/10 hover:border-[#3b82f6]/40 transition-all duration-200 ease-out will-change-transform"
                                >
                                  <RotateCcw className="h-3.5 w-3.5" />
                                </motion.button>
                              )}



                              {/* Delete */}
                              <motion.button 
                                onClick={() => setShowDeleteConfirm(member)}
                                disabled={deletingId === member.id}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                title="Delete Member"
                                aria-label="Delete Member"
                                className="h-9 w-9 rounded-lg flex items-center justify-center border border-[#ff5050]/20 text-[#ff5050] hover:bg-[#ff5050]/10 hover:border-[#ff5050]/40 transition-all duration-200 ease-out disabled:opacity-50 will-change-transform"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </div>


      <AnimatePresence>
        {renewingMember && (
          <RenewModal 
            member={renewingMember} 
            onClose={() => setRenewingMember(null)} 
            onSuccess={() => {
              setRenewingMember(null)
              router.refresh()
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setShowDeleteConfirm(null)}
            />
            <motion.div 
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="relative w-full max-w-sm bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 text-center overlow-hidden"
            >
              {/* Glow Effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-red-500/50 blur-sm rounded-full" />
              
              <div className="mb-6 flex justify-center">
                <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                  <Trash2 className="h-8 w-8" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Delete Member?</h3>
              <p className="text-zinc-400 text-sm mb-8 px-2 font-medium">Are you sure you want to remove <span className="text-red-400">{showDeleteConfirm.name}</span>? This action cannot be undone.</p>
              
              <div className="flex flex-col gap-3">
                <motion.button 
                  onClick={() => handleDelete(showDeleteConfirm)}
                  disabled={deletingId === showDeleteConfirm.id}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full py-3.5 rounded-xl bg-red-600 text-sm font-bold text-white hover:bg-red-500 transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
                >
                  {deletingId === showDeleteConfirm.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span>Yes, Delete Member</span>
                  )}
                </motion.button>
                <motion.button 
                  onClick={() => setShowDeleteConfirm(null)}
                  disabled={deletingId === showDeleteConfirm.id}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full py-3.5 rounded-xl bg-zinc-800 text-sm font-bold text-zinc-300 hover:bg-zinc-700 transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function RenewModal({ member, onClose, onSuccess }: { member: Member, onClose: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [planMonths, setPlanMonths] = useState(member.plan_months || 1)
  const [feePaid, setFeePaid] = useState(member.fee_paid || 0)
  const [renewalDate, setRenewalDate] = useState(new Date().toISOString().split('T')[0])

  const handleRenewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await renewMemberAction(member.id, planMonths, feePaid, renewalDate)
    if (res?.success) {
      onSuccess()
    } else {
      setError(res?.error || "Failed to renew membership")
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="relative w-full max-w-sm bg-[#0f0f0f] rounded-2xl border border-zinc-800 shadow-2xl p-6 space-y-6"
      >
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-white tracking-tight text-center">Renew Membership</h3>
          <p className="text-xs text-zinc-500 text-center">Extending access for <span className="text-emerald-400">{member.name}</span></p>
        </div>

        <form onSubmit={handleRenewSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium text-zinc-500 tracking-wider ml-1">Renewal Date</label>
            <input 
              required
              type="date"
              value={renewalDate}
              onChange={(e) => setRenewalDate(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-white text-sm focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all [color-scheme:dark]"
            />
          </div>

          {error && (
            <div className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium text-zinc-500 tracking-wider ml-1">Plan Duration</label>
            <select 
              value={planMonths}
              onChange={(e) => setPlanMonths(parseInt(e.target.value))}
              className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-white text-sm focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            >
              <option value="1">1 Month</option>
              <option value="3">3 Months</option>
              <option value="6">6 Months</option>
              <option value="12">12 Months (1 Year)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium text-zinc-500 tracking-wider ml-1">Amount Paid (₹)</label>
            <input 
              required
              type="number"
              value={feePaid}
              onChange={(e) => setFeePaid(parseFloat(e.target.value))}
              className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-white text-sm focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-sm font-medium text-zinc-500 hover:text-white transition-all">Cancel</button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.97] disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Confirm Renewal'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}