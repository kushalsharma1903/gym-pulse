'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { TrendingUp, Users, CreditCard, Calendar, ChevronDown, AlertCircle, Phone, PieChart } from 'lucide-react'
import { ReportsSkeleton } from '@/components/ui/skeleton'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

export default function ReportsClient({ initialMembers }: { initialMembers: any[] }) {
    const [members, setMembers] = useState<any[]>(initialMembers)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false)

    useEffect(() => {
        setMembers(initialMembers)
    }, [initialMembers])

    const today = new Date()
    
    // Revenue calculations
    const stats = useMemo(() => {
        const yearMonths = Array.from({ length: 12 }, (_, i) => ({
            month: new Date(selectedYear, i, 1).toLocaleString('default', { month: 'short' }),
            monthNum: i,
            revenue: 0
        }))

        const plans: Record<string, number> = {}

        members.forEach(m => {
            if (!m.joining_date || !m.fee_paid) return
            const planMonths = m.plan_months || (m.plan_type ? parseInt(m.plan_type) : 1) || 1
            const monthlyRate = m.fee_paid / planMonths
            const joinDate = new Date(m.joining_date)
            let overlapsYear = false

            for (let i = 0; i < planMonths; i++) {
                const targetDate = new Date(joinDate.getFullYear(), joinDate.getMonth() + i, 1)
                if (targetDate.getFullYear() === selectedYear) {
                    const monthIdx = targetDate.getMonth()
                    if (yearMonths[monthIdx]) {
                        yearMonths[monthIdx].revenue += monthlyRate
                    }
                    overlapsYear = true
                }
            }

            if (overlapsYear && m.plan_type) {
                plans[m.plan_type] = (plans[m.plan_type] || 0) + 1
            }
        })

        const yearTotal = yearMonths.reduce((sum, m) => sum + m.revenue, 0)
        const avgMonthly = yearTotal / 12
        const isCurrentYear = selectedYear === today.getFullYear()
        const currentMonthRevenue = yearMonths[isCurrentYear ? today.getMonth() : 11].revenue

        const maxPlanCount = Object.keys(plans).length > 0 ? Math.max(...Object.values(plans)) : 1

        return { yearMonths, yearTotal, avgMonthly, currentMonthRevenue, plans, maxPlanCount }
    }, [members, selectedYear])

    const chartData = {
        labels: stats.yearMonths.map(m => m.month),
        datasets: [{
            label: 'Revenue',
            data: stats.yearMonths.map(m => Math.round(m.revenue)),
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 1.5,
            borderRadius: 4,
            hoverBackgroundColor: 'rgba(16, 185, 129, 0.25)',
        }],
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 800 },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#0a0a0a',
                padding: 12,
                borderColor: 'rgba(31,206,126,0.4)',
                borderWidth: 1,
                titleFont: { size: 12, weight: 600 },
                bodyFont: { size: 12 },
                displayColors: false,
                callbacks: { label: (c: any) => `₹${c.raw.toLocaleString()}` }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255,255,255,0.03)', drawTicks: false },
                ticks: { color: '#52525b', font: { size: 10 }, padding: 8, callback: (v: any) => `₹${v.toLocaleString()}` }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#52525b', font: { size: 10 }, padding: 8 }
            }
        }
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="max-w-[1400px] mx-auto px-6 py-10"
        >
            
            {/* 1. Header Section */}
            <div className="pt-4 pb-2">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-[#eaebe9]">Financial Insights</h1>
                        <p className="text-sm text-[#737674] mt-1.5 leading-relaxed">Revenue trends and plan performance for your gym.</p>
                    </div>
                    
                    <div className="relative z-40">
                        <motion.button 
                            onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.96 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            className="flex items-center gap-2 bg-zinc-900 border border-white/10 text-zinc-300 px-4 py-2 rounded-xl text-xs font-bold hover:border-zinc-600 transition-all duration-200 hover:text-white min-w-[140px] justify-between shadow-sm"
                        >
                            <span>{selectedYear} Fiscal Year</span>
                            <ChevronDown className={`h-3.5 w-3.5 text-zinc-500 transition-transform duration-200 ${isYearDropdownOpen ? 'rotate-180' : ''}`} />
                        </motion.button>
                        
                        {isYearDropdownOpen && (
                            <>
                                <div 
                                    className="fixed inset-0 z-40" 
                                    onClick={() => setIsYearDropdownOpen(false)}
                                />
                                <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                    {[2024, 2025, 2026].map(y => (
                                        <button
                                            key={y}
                                            onClick={() => {
                                                setSelectedYear(y)
                                                setIsYearDropdownOpen(false)
                                            }}
                                            className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors ${
                                                selectedYear === y 
                                                    ? 'text-emerald-500 bg-emerald-500/5' 
                                                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                            }`}
                                        >
                                            {y} Fiscal Year
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>


            <div className="space-y-6 md:space-y-8">

                {/* 2. Top Stats (Horizontal Grid) */}
                <motion.div 
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: {},
                        show: { transition: { staggerChildren: 0.04 } }
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
                >
                    <motion.div 
                        variants={{
                            hidden: { opacity: 0, y: 6 },
                            show: { opacity: 1, y: 0 }
                        }}
                        whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="bg-zinc-900/50 border border-emerald-500/30 rounded-2xl p-5 md:p-6 shadow-sm transition-all duration-200"
                    >
                        <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2 opacity-90">This Month Revenue</p>
                        <p className="text-2xl font-bold text-white tracking-tight">₹{Math.round(stats.currentMonthRevenue).toLocaleString()}</p>
                    </motion.div>

                    <motion.div 
                        variants={{
                            hidden: { opacity: 0, y: 6 },
                            show: { opacity: 1, y: 0 }
                        }}
                        whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="bg-zinc-900 border border-white/5 rounded-2xl p-5 md:p-6 shadow-sm transition-all duration-200"
                    >
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 opacity-80">Year Revenue ({selectedYear})</p>
                        <p className="text-2xl font-bold text-white tracking-tight">₹{Math.round(stats.yearTotal).toLocaleString()}</p>
                    </motion.div>
                </motion.div>

                {/* 3. Revenue Chart Section (Reduced Dominance) */}
                <div className="mt-4 md:mt-10 space-y-6 md:space-y-8">
                    <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5 md:p-6 shadow-sm">
                        <div className="mb-6">
                            <h2 className="text-base md:text-lg font-bold text-white tracking-tight">Monthly Revenue Trend</h2>
                            <p className="text-zinc-400 text-[10px] md:text-xs mt-1">Last 12 months performance analysis</p>
                        </div>
                        <div className="h-[200px] md:h-[300px] w-full">
                            <Bar data={chartData} options={chartOptions as any} />
                        </div>
                    </div>

                    {/* 4. Breakdown Section */}
                    <div className="space-y-8">
                        {/* Monthly Breakdown Card */}
                        <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-visible shadow-sm">
                            <div className="p-4 border-b border-white/5">
                                <h2 className="text-base font-semibold text-white tracking-tight">Monthly Breakdown — {selectedYear}</h2>
                                <p className="text-zinc-500 text-[10px] font-medium mt-1 uppercase tracking-widest">Yearly financial ledger</p>
                            </div>
                            <div className="w-full overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[300px]">
                                    <thead>
                                        <tr className="border-b border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                            <th className="px-4 py-4">Month</th>
                                            <th className="px-4 py-4 text-right">Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {stats.yearMonths.map(m => (
                                            <motion.tr 
                                                key={m.month} 
                                                whileHover={{ backgroundColor: "rgba(24,24,27,0.5)" }}
                                                transition={{ duration: 0.15, ease: 'easeOut' }}
                                                className="transition-colors group"
                                            >
                                                <td className="px-4 py-4 text-[11px] font-bold text-zinc-400 group-hover:text-zinc-200">{m.month}</td>
                                                <td className="px-4 py-4 text-[11px] font-black text-zinc-100 text-right tabular-nums">₹{Math.round(m.revenue).toLocaleString()}</td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t-2 border-emerald-500/20 font-bold bg-emerald-500/[0.02]">
                                            <td className="px-4 py-4 text-[11px] text-zinc-200">Total ({selectedYear})</td>
                                            <td className="px-4 py-4 text-sm text-emerald-400 text-right tabular-nums tracking-tight">₹{Math.round(stats.yearTotal).toLocaleString()}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {/* Plan Distribution Card */}
                        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 shadow-sm">
                            <div className="mb-6">
                                <h2 className="text-sm font-semibold text-white tracking-tight">Plan Distribution — {selectedYear}</h2>
                            </div>

                            {Object.keys(stats.plans).length === 0 ? (
                                <motion.div 
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="py-10 text-center flex flex-col items-center gap-3 opacity-60"
                                >
                                    <PieChart className="h-8 w-8 text-zinc-500" />
                                    <p className="font-semibold text-zinc-400 text-xs tracking-wide">No plan data available for this year</p>
                                </motion.div>
                            ) : (
                                <div className="space-y-6">
                                    {Object.entries(stats.plans).map(([name, count]) => {
                                        let barColor = 'bg-zinc-500/40'
                                        if (name.includes('1')) barColor = 'bg-emerald-500/40'
                                        else if (name.includes('3')) barColor = 'bg-blue-500/40'
                                        else if (name.includes('12')) barColor = 'bg-yellow-500/40'

                                        return (
                                            <div key={name} className="flex items-center gap-6">
                                                <div className="w-24 shrink-0">
                                                    <span className="text-xs font-medium text-zinc-400 truncate block">{name}</span>
                                                </div>
                                                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full ${barColor} rounded-full transition-all duration-1000`} 
                                                        style={{ width: `${(count / stats.maxPlanCount) * 100}%` }}
                                                    />
                                                </div>
                                                <div className="w-24 text-right shrink-0">
                                                    <span className="text-xs font-bold text-zinc-200">{count} {count === 1 ? 'member' : 'members'}</span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
