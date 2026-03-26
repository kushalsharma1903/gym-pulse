'use client'

import { motion } from 'framer-motion'

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ')
}

// ── Base Skeleton Block ───────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn('rounded-lg bg-white/[0.04] relative overflow-hidden', className)}
      animate={{}}
    >
      {/* Shimmer sweep */}
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
        animate={{ x: ['−100%', '200%'] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4 }}
        style={{ transform: 'translateX(-100%)' }}
      />
    </motion.div>
  )
}

// ── Reports Page Skeleton ────────────────────────────────────────
export function ReportsSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-36 rounded-xl" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <Skeleton className="sm:col-span-2 h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>

      {/* Chart */}
      <Skeleton className="h-72 rounded-2xl" />

      {/* Table */}
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  )
}

// ── Settings Page Skeleton ───────────────────────────────────────
export function SettingsSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8 animate-in fade-in duration-300">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="max-w-2xl space-y-6 rounded-2xl border border-white/5 bg-[#0a0a0a]/80 p-8">
        <Skeleton className="h-20 rounded-xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 rounded-xl col-span-2" />
          <Skeleton className="h-10 rounded-xl col-span-2" />
          <Skeleton className="h-10 rounded-xl" />
          <Skeleton className="h-10 rounded-xl" />
          <Skeleton className="h-20 rounded-xl col-span-2" />
        </div>
        <Skeleton className="h-12 rounded-xl" />
      </div>
    </div>
  )
}

// ── Members/Messages Skeleton (table rows) ────────────────────────
export function TableRowsSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="divide-y divide-white/5">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-4">
          <Skeleton className="h-9 w-9 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-36" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-3 w-20 hidden sm:block" />
          <Skeleton className="h-3 w-16 hidden md:block" />
          <Skeleton className="h-6 w-16 rounded-full hidden lg:block" />
          <div className="flex gap-1.5 ml-auto">
            <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
            <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
            <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
          </div>
        </div>
      ))}
    </div>
  )
}
