"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, ChevronDown } from "lucide-react"
import { Sparkles } from "@/components/ui/sparkles"
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal"

const stats = [
  { label: "Free trial", value: "30 days" },
  { label: "Setup", value: "2 min" },
  { label: "Starting price", value: "₹999" },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-x-hidden bg-[#080b0a] pt-16">
      {/* Sparkles background */}
      <Sparkles className="opacity-50" />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1fce7e]/5 rounded-full blur-[120px]" />
      </div>

      {/* Two-column layout — stacks to single column on mobile */}
      <div className="relative z-10 w-full mx-auto px-5 md:px-16 grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-[48px]" style={{ minHeight: "90vh", overflow: "visible" }}>

        {/* LEFT — content */}
        <div className="flex flex-col gap-6 w-full max-w-[560px] mx-auto md:mx-0 relative z-10 pt-24 md:pt-0 text-center md:text-left" style={{ paddingBottom: "60px", overflow: "visible" }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1fce7e]/10 border border-[#1fce7e]/20 self-center md:self-start"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1fce7e] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1fce7e]" />
            </span>
            <span className="text-[#1fce7e] text-sm font-semibold">
              30-day free trial — no card required
            </span>
          </motion.div>

          {/* Headline */}
          {/* On mobile: block layout so VerticalCutReveal spans stack naturally as block rows.
              On desktop: flex-col for the controlled vertical reveal effect. */}
          <h1
            className="m-0 p-0 text-white font-black tracking-tight text-4xl md:text-5xl lg:text-6xl block md:flex md:flex-col"
            style={{
              fontWeight: 800,
              lineHeight: 1.1,
              width: "100%",
              whiteSpace: "normal",
            }}
          >
            {/* Line 1: "Run your gym like a pro." — kept together so it breaks after the period */}
            <span className="block">
              <VerticalCutReveal delay={0.1} duration={0.7}>
                Run your gym
              </VerticalCutReveal>
              <VerticalCutReveal delay={0.4} duration={0.7} className="text-[rgba(242,239,233,0.35)]">
                {" like a pro."}
              </VerticalCutReveal>
            </span>
            {/* Line 2: always sits on its own line */}
            <VerticalCutReveal delay={0.55} duration={0.7} className="text-zinc-500 block">
              Not a spreadsheet.
            </VerticalCutReveal>
          </h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-zinc-400 text-lg sm:text-xl leading-relaxed m-0"
          >
            GymPulse helps gym owners track members, automate renewal reminders,
            and monitor revenue all in one clean dashboard.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-16"
          >
            <Link
              href="/signup"
              className="group flex items-center justify-center gap-2 bg-[#1fce7e] text-black font-bold text-base rounded-xl hover:bg-[#1fce7e]/90 transition-all duration-200 shadow-[0_0_30px_rgba(31,206,126,0.4)] hover:shadow-[0_0_50px_rgba(31,206,126,0.6)] hover:-translate-y-0.5"
              style={{ minWidth: 180, padding: "14px 24px" }}
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#features"
              className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white font-semibold text-base rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-200 hover:-translate-y-0.5"
              style={{ minWidth: 180, padding: "14px 24px" }}
            >
              See how it works
              <ChevronDown className="h-4 w-4" />
            </a>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-row items-center justify-between md:justify-start gap-4 md:gap-10 w-full"
          >
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center md:items-start gap-0.5">
                <span className="text-2xl font-black text-white">{stat.value}</span>
                <span className="text-zinc-500 text-sm font-medium">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — dashboard screenshot with macOS chrome frame */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-[1] flex items-center justify-center md:justify-end w-full overflow-hidden"
        >
          <div style={{width:"100%",maxWidth:"320px",margin:"24px auto 0"}} className="md:max-w-[580px] md:mx-0">
          <div style={{width:"100%",background:"rgba(242,239,233,0.03)",border:"1px solid rgba(242,239,233,0.1)",borderRadius:"12px",overflow:"hidden",transform:"perspective(1200px) rotateY(-4deg) rotateX(1deg)",boxShadow:"0 24px 80px rgba(0,0,0,0.7)"}}>
            <div style={{background:"rgba(242,239,233,0.06)",borderBottom:"1px solid rgba(242,239,233,0.1)",padding:"10px 16px",display:"flex",alignItems:"center",gap:"6px"}}>
              <div style={{width:"10px",height:"10px",borderRadius:"50%",background:"#FF5F57"}}></div>
              <div style={{width:"10px",height:"10px",borderRadius:"50%",background:"#FEBC2E"}}></div>
              <div style={{width:"10px",height:"10px",borderRadius:"50%",background:"#28C840"}}></div>
              <span style={{fontSize:"11px",color:"rgba(242,239,233,0.4)",marginLeft:"8px"}}>Iron Zone Fitness Dashboard</span>
            </div>
            <div style={{padding:"20px"}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"8px",marginBottom:"16px"}}>
                <div style={{background:"rgba(242,239,233,0.05)",border:"1px solid rgba(242,239,233,0.08)",borderRadius:"8px",padding:"12px"}}>
                  <div style={{fontSize:"22px",fontWeight:"700",color:"#1FCE7E",lineHeight:"1"}}>142</div>
                  <div style={{fontSize:"9px",color:"#8A8A8A",textTransform:"uppercase",letterSpacing:"0.5px",marginTop:"4px"}}>Active</div>
                </div>
                <div style={{background:"rgba(242,239,233,0.05)",border:"1px solid rgba(242,239,233,0.08)",borderRadius:"8px",padding:"12px"}}>
                  <div style={{fontSize:"22px",fontWeight:"700",color:"#FFA028",lineHeight:"1"}}>18</div>
                  <div style={{fontSize:"9px",color:"#8A8A8A",textTransform:"uppercase",letterSpacing:"0.5px",marginTop:"4px"}}>Expiring</div>
                </div>
                <div style={{background:"rgba(242,239,233,0.05)",border:"1px solid rgba(242,239,233,0.08)",borderRadius:"8px",padding:"12px"}}>
                  <div style={{fontSize:"22px",fontWeight:"700",color:"#FF5050",lineHeight:"1"}}>7</div>
                  <div style={{fontSize:"9px",color:"#8A8A8A",textTransform:"uppercase",letterSpacing:"0.5px",marginTop:"4px"}}>Expired</div>
                </div>
                <div style={{background:"rgba(242,239,233,0.05)",border:"1px solid rgba(242,239,233,0.08)",borderRadius:"8px",padding:"12px"}}>
                  <div style={{fontSize:"22px",fontWeight:"700",color:"#F2EFE9",lineHeight:"1"}}>167</div>
                  <div style={{fontSize:"9px",color:"#8A8A8A",textTransform:"uppercase",letterSpacing:"0.5px",marginTop:"4px"}}>Total</div>
                </div>
              </div>
              <div style={{marginBottom:"8px"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 80px 70px 70px",gap:"8px",padding:"8px 0",borderBottom:"1px solid rgba(242,239,233,0.06)",fontSize:"9px",color:"#8A8A8A",textTransform:"uppercase",letterSpacing:"0.5px"}}>
                  <span>Member</span><span>Plan</span><span>Status</span><span>Days</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 80px 70px 70px",gap:"8px",padding:"10px 0",borderBottom:"1px solid rgba(242,239,233,0.06)",fontSize:"12px",alignItems:"center"}}>
                  <span style={{color:"#F2EFE9"}}>Rahul K.</span>
                  <span style={{color:"#8A8A8A"}}>Premium</span>
                  <span><span style={{background:"rgba(31,206,126,0.15)",color:"#1FCE7E",padding:"2px 8px",borderRadius:"4px",fontSize:"10px"}}>Active</span></span>
                  <span style={{color:"#1FCE7E",fontWeight:"500"}}>21d</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 80px 70px 70px",gap:"8px",padding:"10px 0",borderBottom:"1px solid rgba(242,239,233,0.06)",fontSize:"12px",alignItems:"center"}}>
                  <span style={{color:"#F2EFE9"}}>Priya S.</span>
                  <span style={{color:"#8A8A8A"}}>Standard</span>
                  <span><span style={{background:"rgba(255,160,40,0.15)",color:"#FFA028",padding:"2px 8px",borderRadius:"4px",fontSize:"10px"}}>Expiring</span></span>
                  <span style={{color:"#FFA028",fontWeight:"500"}}>3d</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 80px 70px 70px",gap:"8px",padding:"10px 0",fontSize:"12px",alignItems:"center"}}>
                  <span style={{color:"#F2EFE9"}}>Amit V.</span>
                  <span style={{color:"#8A8A8A"}}>Premium</span>
                  <span><span style={{background:"rgba(255,80,80,0.15)",color:"#FF5050",padding:"2px 8px",borderRadius:"4px",fontSize:"10px"}}>Expired</span></span>
                  <span style={{color:"#FF5050",fontWeight:"500"}}>—</span>
                </div>
              </div>
              <div style={{background:"rgba(31,206,126,0.05)",border:"1px solid rgba(31,206,126,0.15)",borderRadius:"8px",padding:"12px",display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"12px"}}>
                <div>
                  <div style={{fontSize:"9px",color:"#8A8A8A",textTransform:"uppercase",letterSpacing:"0.5px"}}>Year Revenue</div>
                  <div style={{fontSize:"22px",fontWeight:"700",color:"#1FCE7E"}}>₹1,24,500</div>
                </div>
                <svg width="80" height="36" viewBox="0 0 80 36" fill="none">
                  <polyline points="0,30 16,24 28,26 40,18 52,20 64,10 80,6" stroke="#1FCE7E" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="0,30 16,24 28,26 40,18 52,20 64,10 80,6 80,36 0,36" fill="rgba(31,206,126,0.08)"/>
                </svg>
              </div>
            </div>
          </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080b0a] to-transparent pointer-events-none z-20" />
    </section>
  )
}
