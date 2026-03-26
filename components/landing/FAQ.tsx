"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"

const faqs = [
  {
    q: "Do I need a credit card to start?",
    a: "No. Your 30-day free trial starts immediately with no payment info required. You can upgrade anytime during or after the trial.",
  },
  {
    q: "Can I switch plans later?",
    a: "Yes, anytime. Upgrade, downgrade, or cancel — no lock-in contracts. Your data is always yours.",
  },
  {
    q: "How do WhatsApp reminders work?",
    a: "When a member is expiring soon, you tap the WhatsApp button next to their name. GymPulse opens WhatsApp with a pre-filled renewal message — you just hit send.",
  },
  {
    q: "Is my data secure?",
    a: "All data is encrypted and stored on Supabase infrastructure. We follow industry-standard security practices. Your member data belongs to you.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept UPI, credit/debit cards, and net banking through Razorpay — India's leading payment gateway.",
  },
]

function FAQItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className={`border-b transition-colors duration-200 ${open ? "border-[#1fce7e]/10" : "border-white/5"}`}>
      <button
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        onClick={onToggle}
      >
        <span className={`font-semibold text-[15px] leading-snug transition-colors duration-200 ${open ? "text-[#1fce7e]" : "text-[#eaebe9] group-hover:text-white"}`}>
          {q}
        </span>
        <span
          className="shrink-0 h-6 w-6 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: open ? 'rgba(31,206,126,0.1)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${open ? 'rgba(31,206,126,0.25)' : 'rgba(255,255,255,0.08)'}`,
          }}
        >
          {open ? (
            <Minus className="h-3.5 w-3.5 text-[#1fce7e]" />
          ) : (
            <Plus className="h-3.5 w-3.5 text-[#a9aca9]" />
          )}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[#a9aca9] text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 sm:py-32 bg-[#080b0a] relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-[#1fce7e]/20 to-transparent" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-3 py-1 bg-[#1fce7e]/10 border border-[#1fce7e]/20 text-[#1fce7e] text-xs font-bold tracking-widest uppercase rounded-full mb-5">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#eaebe9] tracking-tight">
            Questions? We got you.
          </h2>
          <p className="mt-4 text-[#a9aca9] text-lg">
            Everything you need to know before getting started.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl px-6 sm:px-8"
          style={{
            background: '#0e1210',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              q={faq.q}
              a={faq.a}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
