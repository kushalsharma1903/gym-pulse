"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Users, MessageCircle, TrendingUp, FileText, Building2, ShieldCheck } from "lucide-react"
import { GlowingEffect } from "@/components/ui/glowing-effect"

const features = [
  {
    icon: Users,
    title: "Member Directory",
    description: "Track every member, their plan, days left, and renewal status all in one clean view.",
    customVisual: (
      <div style={{width:"100%",background:"rgba(242,239,233,0.03)",borderRadius:"8px",padding:"16px",display:"flex",flexDirection:"column",gap:"8px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px",padding:"8px 12px",background:"rgba(242,239,233,0.04)",border:"1px solid rgba(242,239,233,0.08)",borderRadius:"6px"}}>
          <div style={{width:"28px",height:"28px",borderRadius:"50%",background:"#1FCE7E",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",fontWeight:"600",color:"#07080A",flexShrink:0}}>RK</div>
          <div style={{flex:1}}><div style={{fontSize:"12px",fontWeight:"500",color:"#F2EFE9"}}>Rahul Kapoor</div><div style={{fontSize:"10px",color:"#8A8A8A"}}>Premium · 21 days left</div></div>
          <span style={{background:"rgba(31,206,126,0.15)",color:"#1FCE7E",padding:"2px 8px",borderRadius:"4px",fontSize:"10px",fontWeight:"500"}}>Active</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"10px",padding:"8px 12px",background:"rgba(242,239,233,0.04)",border:"1px solid rgba(242,239,233,0.08)",borderRadius:"6px"}}>
          <div style={{width:"28px",height:"28px",borderRadius:"50%",background:"#FFA028",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",fontWeight:"600",color:"#07080A",flexShrink:0}}>PS</div>
          <div style={{flex:1}}><div style={{fontSize:"12px",fontWeight:"500",color:"#F2EFE9"}}>Priya Sharma</div><div style={{fontSize:"10px",color:"#8A8A8A"}}>Standard · 3 days left</div></div>
          <span style={{background:"rgba(255,160,40,0.15)",color:"#FFA028",padding:"2px 8px",borderRadius:"4px",fontSize:"10px",fontWeight:"500"}}>Expiring</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"10px",padding:"8px 12px",background:"rgba(242,239,233,0.04)",border:"1px solid rgba(242,239,233,0.08)",borderRadius:"6px"}}>
          <div style={{width:"28px",height:"28px",borderRadius:"50%",background:"#FF5050",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",fontWeight:"600",color:"#07080A",flexShrink:0}}>AV</div>
          <div style={{flex:1}}><div style={{fontSize:"12px",fontWeight:"500",color:"#F2EFE9"}}>Amit Verma</div><div style={{fontSize:"10px",color:"#8A8A8A"}}>Premium · Expired</div></div>
          <span style={{background:"rgba(255,80,80,0.15)",color:"#FF5050",padding:"2px 8px",borderRadius:"4px",fontSize:"10px",fontWeight:"500"}}>Expired</span>
        </div>
      </div>
    ),
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Reminders",
    description: "Send renewal reminders with one tap. Pre-filled message, instant delivery via WhatsApp.",
    customVisual: (
      <div style={{width:"100%",display:"flex",flexDirection:"column",gap:"10px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px",padding:"10px 14px",background:"rgba(37,211,102,0.08)",border:"1px solid rgba(37,211,102,0.25)",borderRadius:"6px",cursor:"pointer"}}>
          <svg style={{width:"20px",height:"20px",fill:"#25D366",flexShrink:0}} viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.534 5.857L.057 23.625l5.907-1.547A11.956 11.956 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.214-3.713.973.991-3.624-.235-.373A9.818 9.818 0 1112 21.818z"/></svg>
          <span style={{fontSize:"12px",color:"#25D366",fontWeight:"500"}}>Send reminder to Priya S.</span>
        </div>
        <div style={{padding:"12px 14px",background:"rgba(37,211,102,0.04)",border:"1px solid rgba(37,211,102,0.12)",borderRadius:"6px"}}>
          <div style={{fontSize:"9px",color:"#8A8A8A",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:"6px"}}>Pre-filled message</div>
          <div style={{fontSize:"11px",color:"rgba(242,239,233,0.5)",lineHeight:"1.6"}}>Hi Priya! Your membership at Iron Zone Fitness expires in 3 days. Tap to renew and keep your streak going 💪</div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0"}}>
          <span style={{fontSize:"10px",color:"#8A8A8A"}}>2 members pending reminders</span>
          <span style={{fontSize:"10px",color:"#1FCE7E",fontWeight:"500"}}>Send all →</span>
        </div>
      </div>
    ),
  },
  {
    icon: TrendingUp,
    title: "Revenue Tracking",
    description: "See monthly trends, yearly totals, and per-member revenue at a glance.",
    customVisual: (
      <div style={{width:"100%"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"8px"}}>
          <div>
            <div style={{fontSize:"9px",color:"#8A8A8A",textTransform:"uppercase",letterSpacing:"0.5px"}}>This Month</div>
            <div style={{fontSize:"24px",fontWeight:"700",color:"#1FCE7E",lineHeight:"1.1"}}>₹1,24,500</div>
          </div>
          <div style={{fontSize:"11px",color:"#1FCE7E"}}>↑ 12% vs last month</div>
        </div>
        <div style={{display:"flex",alignItems:"flex-end",gap:"6px",height:"70px",marginBottom:"6px"}}>
          <div style={{flex:1,background:"rgba(242,239,233,0.08)",borderRadius:"3px 3px 0 0",height:"55%"}}></div>
          <div style={{flex:1,background:"rgba(242,239,233,0.08)",borderRadius:"3px 3px 0 0",height:"62%"}}></div>
          <div style={{flex:1,background:"rgba(242,239,233,0.08)",borderRadius:"3px 3px 0 0",height:"48%"}}></div>
          <div style={{flex:1,background:"rgba(242,239,233,0.08)",borderRadius:"3px 3px 0 0",height:"70%"}}></div>
          <div style={{flex:1,background:"rgba(242,239,233,0.08)",borderRadius:"3px 3px 0 0",height:"66%"}}></div>
          <div style={{flex:1,background:"#1FCE7E",borderRadius:"3px 3px 0 0",height:"88%"}}></div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:"9px",color:"#8A8A8A"}}>Aug</span>
          <span style={{fontSize:"9px",color:"#8A8A8A"}}>Sep</span>
          <span style={{fontSize:"9px",color:"#8A8A8A"}}>Oct</span>
          <span style={{fontSize:"9px",color:"#8A8A8A"}}>Nov</span>
          <span style={{fontSize:"9px",color:"#8A8A8A"}}>Dec</span>
          <span style={{fontSize:"9px",color:"#1FCE7E"}}>Jan</span>
        </div>
      </div>
    ),
  },
  {
    icon: FileText,
    title: "Financial Reports",
    description: "Detailed yearly ledger, monthly breakdown, and plan distribution charts.",
    customVisual: (
      <div style={{width:"100%"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
          <div style={{fontSize:"9px",color:"#8A8A8A",textTransform:"uppercase",letterSpacing:"0.5px"}}>Yearly Ledger 2024</div>
          <span style={{fontSize:"9px",color:"#1FCE7E"}}>₹4,82,000 total</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
          <div style={{display:"grid",gridTemplateColumns:"60px 1fr 80px 70px",gap:"8px",padding:"6px 0",borderBottom:"1px solid rgba(242,239,233,0.06)",fontSize:"9px",color:"#8A8A8A",textTransform:"uppercase",letterSpacing:"0.5px"}}>
            <span>Month</span><span>Collections</span><span>Members</span><span>Growth</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"60px 1fr 80px 70px",gap:"8px",padding:"7px 0",borderBottom:"1px solid rgba(242,239,233,0.04)",fontSize:"11px",alignItems:"center"}}>
            <span style={{color:"#8A8A8A"}}>Nov</span>
            <div style={{background:"rgba(242,239,233,0.06)",borderRadius:"2px",height:"6px",width:"100%"}}><div style={{background:"#8A8A8A",height:"100%",borderRadius:"2px",width:"72%"}}></div></div>
            <span style={{color:"#F2EFE9"}}>₹38,200</span>
            <span style={{color:"#8A8A8A"}}>—</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"60px 1fr 80px 70px",gap:"8px",padding:"7px 0",borderBottom:"1px solid rgba(242,239,233,0.04)",fontSize:"11px",alignItems:"center"}}>
            <span style={{color:"#8A8A8A"}}>Dec</span>
            <div style={{background:"rgba(242,239,233,0.06)",borderRadius:"2px",height:"6px",width:"100%"}}><div style={{background:"#FFA028",height:"100%",borderRadius:"2px",width:"85%"}}></div></div>
            <span style={{color:"#F2EFE9"}}>₹44,500</span>
            <span style={{color:"#FFA028"}}>↑ 16%</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"60px 1fr 80px 70px",gap:"8px",padding:"7px 0",fontSize:"11px",alignItems:"center"}}>
            <span style={{color:"#1FCE7E",fontWeight:"500"}}>Jan</span>
            <div style={{background:"rgba(242,239,233,0.06)",borderRadius:"2px",height:"6px",width:"100%"}}><div style={{background:"#1FCE7E",height:"100%",borderRadius:"2px",width:"100%"}}></div></div>
            <span style={{color:"#F2EFE9"}}>₹52,300</span>
            <span style={{color:"#1FCE7E"}}>↑ 18%</span>
          </div>
        </div>
        <div style={{display:"flex",gap:"8px",marginTop:"12px"}}>
          <div style={{flex:1,background:"rgba(242,239,233,0.04)",border:"1px solid rgba(242,239,233,0.08)",borderRadius:"6px",padding:"10px"}}>
            <div style={{fontSize:"9px",color:"#8A8A8A",textTransform:"uppercase",letterSpacing:"0.5px"}}>Premium</div>
            <div style={{fontSize:"14px",fontWeight:"600",color:"#1FCE7E",marginTop:"2px"}}>64%</div>
          </div>
          <div style={{flex:1,background:"rgba(242,239,233,0.04)",border:"1px solid rgba(242,239,233,0.08)",borderRadius:"6px",padding:"10px"}}>
            <div style={{fontSize:"9px",color:"#8A8A8A",textTransform:"uppercase",letterSpacing:"0.5px"}}>Standard</div>
            <div style={{fontSize:"14px",fontWeight:"600",color:"#FFA028",marginTop:"2px"}}>36%</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Building2,
    title: "Your Gym's Branding",
    description: "Add your gym name, logo and contact info. It's your product, not ours.",
    customVisual: (
      <div style={{width:"100%",display:"flex",flexDirection:"column",gap:"10px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"14px",padding:"14px",background:"rgba(242,239,233,0.04)",border:"1px solid rgba(242,239,233,0.08)",borderRadius:"8px"}}>
          <div style={{width:"48px",height:"48px",borderRadius:"10px",background:"linear-gradient(135deg,#1FCE7E,#0fa858)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",fontWeight:"800",color:"#07080A",flexShrink:0}}>IZ</div>
          <div>
            <div style={{fontSize:"13px",fontWeight:"600",color:"#F2EFE9"}}>Iron Zone Fitness</div>
            <div style={{fontSize:"10px",color:"#8A8A8A",marginTop:"2px"}}>Sector 14, Gurugram · +91 98100 00000</div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:"rgba(242,239,233,0.03)",border:"1px solid rgba(242,239,233,0.06)",borderRadius:"6px"}}>
            <span style={{fontSize:"10px",color:"#8A8A8A"}}>Gym Name</span>
            <span style={{fontSize:"10px",color:"#F2EFE9"}}>Iron Zone Fitness</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:"rgba(242,239,233,0.03)",border:"1px solid rgba(242,239,233,0.06)",borderRadius:"6px"}}>
            <span style={{fontSize:"10px",color:"#8A8A8A"}}>Logo</span>
            <span style={{fontSize:"10px",color:"#1FCE7E"}}>✓ Uploaded</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:"rgba(242,239,233,0.03)",border:"1px solid rgba(242,239,233,0.06)",borderRadius:"6px"}}>
            <span style={{fontSize:"10px",color:"#8A8A8A"}}>Contact</span>
            <span style={{fontSize:"10px",color:"#F2EFE9"}}>+91 98100 00000</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:"rgba(242,239,233,0.03)",border:"1px solid rgba(242,239,233,0.06)",borderRadius:"6px"}}>
            <span style={{fontSize:"10px",color:"#8A8A8A"}}>Address</span>
            <span style={{fontSize:"10px",color:"#F2EFE9"}}>Sector 14, Gurugram</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    description: "All data encrypted and backed by Supabase. Accessible from anywhere, any device.",
    customVisual: (
      <div style={{width:"100%",display:"flex",flexDirection:"column",gap:"8px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 14px",background:"rgba(31,206,126,0.06)",border:"1px solid rgba(31,206,126,0.2)",borderRadius:"6px"}}>
          <div style={{width:"8px",height:"8px",borderRadius:"50%",background:"#1FCE7E",flexShrink:0}}></div>
          <span style={{fontSize:"11px",color:"#F2EFE9"}}>All data encrypted with AES-256</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 14px",background:"rgba(31,206,126,0.06)",border:"1px solid rgba(31,206,126,0.2)",borderRadius:"6px"}}>
          <div style={{width:"8px",height:"8px",borderRadius:"50%",background:"#1FCE7E",flexShrink:0}}></div>
          <span style={{fontSize:"11px",color:"#F2EFE9"}}>Powered by Supabase 99.9% uptime</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 14px",background:"rgba(31,206,126,0.06)",border:"1px solid rgba(31,206,126,0.2)",borderRadius:"6px"}}>
          <div style={{width:"8px",height:"8px",borderRadius:"50%",background:"#1FCE7E",flexShrink:0}}></div>
          <span style={{fontSize:"11px",color:"#F2EFE9"}}>Access from any device, anywhere</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 14px",background:"rgba(31,206,126,0.06)",border:"1px solid rgba(31,206,126,0.2)",borderRadius:"6px"}}>
          <div style={{width:"8px",height:"8px",borderRadius:"50%",background:"#1FCE7E",flexShrink:0}}></div>
          <span style={{fontSize:"11px",color:"#F2EFE9"}}>Daily backups your data is never lost</span>
        </div>
        <div style={{marginTop:"4px",display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:"9px",color:"#8A8A8A"}}>Last backup</span>
          <span style={{fontSize:"9px",color:"#1FCE7E"}}>Today, 3:42 AM ✓</span>
        </div>
      </div>
    ),
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-[#080b0a] relative">
      {/* Subtle divider glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-[#1fce7e]/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 bg-[#1fce7e]/10 border border-[#1fce7e]/20 text-[#1fce7e] text-xs font-bold tracking-widest uppercase rounded-full mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Everything a gym owner{" "}
            <span className="text-[#1fce7e]">actually</span> needs
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="relative rounded-2xl bg-[#0e1210] border border-white/5 p-6 group overflow-hidden flex flex-col"
              >
                <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
                <div className="absolute inset-0 bg-gradient-to-br from-[#1fce7e]/3 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col flex-1">
                  {/* Visual container */}
                  <div
                    className="mb-6"
                    style={{
                      height: "220px",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                    }}
                  >
                    {feature.customVisual ? (
                      feature.customVisual
                    ) : (
                      <div className="h-11 w-11 rounded-xl bg-[#1fce7e]/10 flex items-center justify-center group-hover:bg-[#1fce7e]/20 transition-colors duration-300">
                        <Icon className="h-5 w-5 text-[#1fce7e]" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
