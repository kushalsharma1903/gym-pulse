"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/contact" },
]

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#080b0a]/85 backdrop-blur-2xl"
          : "bg-transparent"
      }`}
    >
      {/* Kinetic Obsidian: ultra-thin gradient bottom divider */}
      {scrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1fce7e]/12 to-transparent" />
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", height: "64px", width: "100%" }}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1fce7e] opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1fce7e]" />
          </span>
          <span className="font-black text-[#eaebe9] text-[17px] tracking-tight">
            Gym<span className="text-[#1fce7e]">Pulse</span>
          </span>
        </Link>

        {/* Desktop Center Nav */}
        <nav className="hidden md:flex" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px" }}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative text-sm text-[#a9aca9] hover:text-[#eaebe9] transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Right CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-[#a9aca9] hover:text-[#eaebe9] transition-colors duration-200 font-medium px-3 py-2"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 text-[#080b0a] text-sm font-bold rounded-full transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #1fce7e, #14ca7a)',
              boxShadow: '0 0 20px rgba(31,206,126,0.3), 0 2px 8px rgba(31,206,126,0.15)'
            }}
          >
            Start Free Trial
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-[#a9aca9] hover:text-[#eaebe9] p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#080b0a]/95 backdrop-blur-2xl border-t border-white/5 px-4 pb-4"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-[#a9aca9] hover:text-[#eaebe9] font-medium border-b border-white/5 transition-colors text-sm"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/signup"
              className="mt-4 block w-full text-center px-4 py-3 text-[#080b0a] text-sm font-bold rounded-full"
              style={{ background: 'linear-gradient(135deg, #1fce7e, #14ca7a)' }}
            >
              Start Free Trial
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
