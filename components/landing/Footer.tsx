"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function Footer() {
  return (
    <footer className="bg-[#080b0a] py-10 relative">
      {/* Gradient top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1fce7e] opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1fce7e]" />
            </span>
            <span className="font-black text-[#eaebe9] text-[16px] tracking-tight">
              Gym<span className="text-[#1fce7e]">Pulse</span>
            </span>
          </Link>

          {/* Copyright */}
          <p className="text-[#737674] text-sm">
            © 2026 GymPulse. All rights reserved.
          </p>

          {/* Links */}
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <Link
              href="/refund-policy"
              className="text-sm text-[#737674] hover:text-[#a9aca9] transition-colors duration-200"
            >
              Refund Policy
            </Link>
            <Link
              href="/contact"
              className="text-sm text-[#737674] hover:text-[#a9aca9] transition-colors duration-200"
            >
              Contact
            </Link>
            <Link
              href="/privacy-policy"
              className="text-sm text-[#737674] hover:text-[#a9aca9] transition-colors duration-200"
            >
              Privacy Policy
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
