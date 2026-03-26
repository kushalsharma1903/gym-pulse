'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateMemberAction } from '@/app/dashboard/actions'

export default function EditMemberForm({ member, history }: { member: any, history: any[] }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCouple, setIsCouple] = useState(!!member.is_couple)

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      setError(null)
      const res = await updateMemberAction(member.id, member.gym_id, formData)

      if (res?.error) {
        setError(res.error)
        setIsSubmitting(false)
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setError('A network error occurred while updating.')
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (amt: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt)

  return (
    <div className="space-y-12">
      <form onSubmit={handleUpdate} className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Full Name</label>
            <input
              required
              name="name"
              defaultValue={member.name}
              className="w-full bg-[#050505] border border-white/5 rounded-2xl px-5 py-3.5 text-white focus:border-emerald-500/50 outline-none transition-all font-medium placeholder:text-zinc-700"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Phone Number</label>
            <input
              required
              type="tel"
              name="phone"
              defaultValue={member.phone}
              className="w-full bg-[#050505] border border-white/5 rounded-2xl px-5 py-3.5 text-white focus:border-emerald-500/50 outline-none transition-all font-medium placeholder:text-zinc-700"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Member Code / ID</label>
            <input
              required
              name="memberCode"
              defaultValue={member.member_code}
              className="w-full bg-[#050505] border border-white/5 rounded-2xl px-5 py-3.5 text-white focus:border-emerald-500/50 outline-none transition-all font-mono placeholder:text-zinc-700"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Current Plan (Months)</label>
            <input
              required
              type="number"
              name="planMonths"
              defaultValue={member.plan_months}
              className="w-full bg-[#050505] border border-white/5 rounded-2xl px-5 py-3.5 text-white focus:border-emerald-500/50 outline-none transition-all font-medium placeholder:text-zinc-700"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Fee Paid (₹)</label>
            <input
              required
              type="number"
              name="feePaid"
              defaultValue={member.fee_paid}
              className="w-full bg-[#050505] border border-white/5 rounded-2xl px-5 py-3.5 text-white focus:border-emerald-500/50 outline-none transition-all font-medium placeholder:text-zinc-700"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Joining Date</label>
            <input
              required
              type="date"
              name="joiningDate"
              defaultValue={member.joining_date}
              className="w-full bg-[#050505] border border-white/5 rounded-2xl px-5 py-3.5 text-white [color-scheme:dark] focus:border-emerald-500/50 outline-none transition-all font-medium"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/5">
          <label className="flex items-center gap-3 cursor-pointer group w-max">
            <div className="relative">
              <input 
                type="checkbox" 
                name="isCouple"
                checked={isCouple}
                onChange={(e) => setIsCouple(e.target.checked)}
                className="sr-only" 
              />
              <div className={`w-10 h-6 rounded-full transition-colors duration-200 ${isCouple ? 'bg-emerald-500' : 'bg-zinc-800'}`}></div>
              <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${isCouple ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </div>
            <span className="text-xs font-bold text-zinc-400 group-hover:text-zinc-200 transition-colors uppercase tracking-widest">Couple Membership</span>
          </label>
        </div>

        {isCouple && (
          <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
            <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest pl-1">Partner's Name</label>
            <input 
              required={isCouple}
              type="text" 
              name="partnerName" 
              placeholder="Enter partner name..."
              defaultValue={member.partner_name || ''} 
              className="w-full bg-[#050505] border border-emerald-500/20 rounded-2xl px-5 py-3.5 text-white focus:border-emerald-500/50 outline-none transition-all font-medium placeholder:text-zinc-700 shadow-[0_0_20px_rgba(16,185,129,0.05)]" 
            />
          </div>
        )}

        {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {error}
            </div>
        )}

        <div className="pt-6">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl font-bold text-zinc-900 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-emerald-500/20"
          >
            {isSubmitting ? (
               <span className="flex items-center gap-3">
                 <svg className="animate-spin h-5 w-5 text-zinc-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                 Updating Base Profile...
               </span>
            ) : 'Update Global Member Details'}
          </button>
        </div>
      </form>

      {/* Membership History Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-1 bg-emerald-500 rounded-full" />
          <h2 className="text-xl font-bold text-white tracking-tight">Membership History</h2>
        </div>

        <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          {history.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-zinc-500 font-medium">No previous memberships found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#141414] border-b border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    <th className="px-6 py-4">Plan Name</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Joined On</th>
                    <th className="px-6 py-4">Expired On</th>
                    <th className="px-6 py-4 text-right">Amount Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {history.map((h, i) => (
                    <tr key={h.id || i} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{h.plan_type}</span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-zinc-400">
                        {h.plan_months} {h.plan_months === 1 ? 'Month' : 'Months'}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-zinc-400">
                        {h.joining_date ? new Date(h.joining_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-zinc-400">
                        {h.expiry_date ? new Date(h.expiry_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-bold text-emerald-400 font-mono tracking-tight">{formatCurrency(h.fee_paid || 0)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
