"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Check } from "lucide-react"

type Period = "monthly" | "halfyearly" | "yearly"

const periods: { label: string; key: Period }[] = [
  { label: "Monthly", key: "monthly" },
  { label: "Half-yearly", key: "halfyearly" },
  { label: "Yearly", key: "yearly" },
]

const plans = [
  {
    name: "Pro",
    featured: false,
    prices: { monthly: 999, halfyearly: 5094, yearly: 8988 },
    features: [
      "Up to 200 members",
      "Member directory",
      "WhatsApp reminders",
      "Revenue reports",
      "Custom branding",
      "3 staff logins",
    ],
  },
  {
    name: "Business",
    featured: true,
    prices: { monthly: 1799, halfyearly: 9174, yearly: 16188 },
    features: [
      "Unlimited members",
      "Everything in Pro",
      "Multi-branch support",
      "Unlimited staff logins",
      "Export data (CSV/PDF)",
      "Priority support",
    ],
  },
]

function AnimatedPrice({ value }: { value: number }) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={value}
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -16, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="inline-block"
      >
        ₹{value.toLocaleString("en-IN")}
      </motion.span>
    </AnimatePresence>
  )
}

export default function Pricing() {
  const [period, setPeriod] = useState<Period>("monthly")

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-[#080b0a] relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-[#1fce7e]/20 to-transparent" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 bg-[#1fce7e]/10 border border-[#1fce7e]/20 text-[#1fce7e] text-xs font-bold tracking-widest uppercase rounded-full mb-4">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-zinc-500 text-lg">Start free. Upgrade when ready.</p>
        </motion.div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-12"
        >
          <div className="flex p-1 bg-white/5 border border-white/10 rounded-full gap-1">
            {periods.map(({ label, key }) => (
              <button
                key={key}
                onClick={() => setPeriod(key)}
                className={`relative px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                  period === key ? "text-black" : "text-zinc-400 hover:text-white"
                }`}
              >
                {period === key && (
                  <motion.div
                    layoutId="period-pill"
                    className="absolute inset-0 bg-[#1fce7e] rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-3xl overflow-hidden border p-8 ${
                plan.featured
                  ? "bg-gradient-to-br from-[#0e1f18] to-[#0a1510] border-[#1fce7e]/30 shadow-[0px_-13px_300px_0px_rgba(31,206,126,0.15)]"
                  : "bg-[#0e1210] border-white/5"
              }`}
            >
              {plan.featured && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-[#1fce7e] text-black text-xs font-black rounded-full">
                  POPULAR
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-white font-black text-2xl mb-2">{plan.name}</h3>
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-black text-white overflow-hidden">
                    <AnimatedPrice value={plan.prices[period]} />
                  </span>
                  <span className="text-zinc-400 text-sm mb-2">
                    /{period === "monthly" ? "mo" : period === "halfyearly" ? "6mo" : "yr"}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm text-zinc-300">
                    <Check className="h-4 w-4 text-[#1fce7e] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className={`block w-full text-center py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                  plan.featured
                    ? "bg-[#1fce7e] text-black hover:bg-[#1fce7e]/90 shadow-[0_0_30px_rgba(31,206,126,0.4)] hover:shadow-[0_0_50px_rgba(31,206,126,0.6)]"
                    : "bg-white/10 text-white hover:bg-white/15 border border-white/10"
                }`}
              >
                Start Free Trial
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-zinc-500 text-sm">
          30-day free trial. No credit card required.
        </p>
      </div>
    </section>
  )
}
