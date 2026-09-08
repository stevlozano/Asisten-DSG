"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, Clock, Shield, Users, UserCheck, ArrowRight } from "lucide-react"

const CREDS = [
  { role: "Administrador", email: "admin@asisten-dsg.pe", pass: "Admin123*", icon: Shield },
  { role: "Supervisor", email: "supervisor@asisten-dsg.pe", pass: "Super123*", icon: Users },
  { role: "RRHH", email: "rrhh@asisten-dsg.pe", pass: "Rrhh123*", icon: UserCheck },
]

export default function LoginPage(){
  const router = useRouter()
  const [email,setEmail]=useState("")
  const [pass,setPass]=useState("")
  const [show,setShow]=useState(false)
  const [err,setErr]=useState("")
  const [loading,setLoading]=useState(false)

  function handleLogin(e:React.FormEvent){
    e.preventDefault()
    const found = CREDS.find(c=> c.email.toLowerCase()===email.trim().toLowerCase() && c.pass===pass)
    if(!found){ setErr("Credenciales incorrectas. Usa una de las de prueba."); return }
    setLoading(true)
    localStorage.setItem("asisten-auth", JSON.stringify(found))
    setTimeout(()=> router.push("/"), 400)
  }
  function fill(c:typeof CREDS[0]){ setEmail(c.email); setPass(c.pass); setErr("") }

  const container={ hidden:{opacity:0}, show:{opacity:1, transition:{staggerChildren:0.06, delayChildren:0.08}} }
  const item={ hidden:{opacity:0, y:12}, show:{opacity:1, y:0, transition:{duration:0.4, ease:[0.22,1,0.36,1] as any}} }

  return (
    <div className="min-h-screen flex bg-white dark:bg-black">
      {/* left - form */}
      <motion.div variants={container} initial="hidden" animate="show" className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-[400px] space-y-6">
          <motion.div variants={item} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black tracking-tight">ASISTEN-DSG</p>
              <p className="text-[11px] text-black/40 dark:text-white/40 tracking-widest uppercase">DSG Peru Technology SAC</p>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-black/50 dark:text-white/50"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/> Sistema activo</span>
          </motion.div>

          <motion.div variants={item} className="space-y-1">
            <h1 className="text-[26px] font-bold tracking-tight leading-none">Ingresar</h1>
            <p className="text-sm text-black/60 dark:text-white/60">Control diario — asistencia genera incidencia, no descuento automático.</p>
          </motion.div>

          <motion.form variants={item} onSubmit={handleLogin} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-black/50 dark:text-white/50">Correo</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@asisten-dsg.pe" className="w-full h-11 px-4 rounded-full border bg-zinc-100 dark:bg-zinc-900 border-black/10 dark:border-white/10 text-sm outline-none focus:border-black dark:focus:border-white placeholder:text-black/30 dark:placeholder:text-white/30 transition" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-black/50 dark:text-white/50">Contraseña</label>
              <div className="relative">
                <input type={show?"text":"password"} value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" className="w-full h-11 px-4 pr-11 rounded-full border bg-zinc-100 dark:bg-zinc-900 border-black/10 dark:border-white/10 text-sm outline-none focus:border-black dark:focus:border-white transition" />
                <button type="button" onClick={()=>setShow(!show)} className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 grid place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition">
                  {show? <EyeOff className="h-4 w-4 text-black/60 dark:text-white/60"/> : <Eye className="h-4 w-4 text-black/60 dark:text-white/60"/>}
                </button>
              </div>
            </div>
            {err && <motion.p initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-2xl px-3 py-2">{err}</motion.p>}
            <motion.button whileHover={{scale:1.01}} whileTap={{scale:0.99}} type="submit" disabled={loading} className="w-full h-11 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60">
              {loading? "Ingresando..." : <><span>Ingresar</span><ArrowRight className="h-4 w-4"/></>}
            </motion.button>
          </motion.form>

          <motion.div variants={item} className="rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5 space-y-px">
            <div className="bg-zinc-100 dark:bg-zinc-900 px-4 py-3 flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 text-black/50 dark:text-white/50"/>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-black/50 dark:text-white/50">Credenciales ficticias — click para autocompletar</p>
            </div>
            {CREDS.map(c=>{
              const I=c.icon
              const active = email===c.email && pass===c.pass
              return (
                <button key={c.email} onClick={()=>fill(c)} className={`w-full text-left bg-zinc-100 dark:bg-zinc-900 px-4 py-3 flex items-center gap-3 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition group ${active?"bg-zinc-200 dark:bg-zinc-800":""}`}>
                  <span className="h-8 w-8 rounded-xl bg-white dark:bg-black border dark:border-white/10 grid place-items-center shrink-0 group-hover:scale-105 transition"><I className="h-4 w-4 text-black/60 dark:text-white/60"/></span>
                  <span className="flex-1 min-w-0">
                    <p className="text-xs font-semibold">{c.role} <span className="font-normal text-black/40 dark:text-white/40">— {c.email}</span></p>
                    <p className="text-xs font-mono text-black/50 dark:text-white/50">{c.pass}</p>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-black/20 dark:text-white/20 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-0.5 transition" />
                </button>
              )
            })}
            <div className="bg-zinc-100 dark:bg-zinc-900 px-4 py-2.5 flex items-center gap-1.5 text-[11px] text-black/40 dark:text-white/40"><Clock className="h-3 w-3"/> Solo demo local. Sin backend real.</div>
          </motion.div>
        </div>
      </motion.div>

      {/* right - branding alive */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-zinc-100 dark:bg-zinc-900 border-l dark:border-white/10 items-center justify-center p-10">
        <motion.div initial={{opacity:0, scale:0.96}} animate={{opacity:1,scale:1}} transition={{duration:0.5, ease:[0.22,1,0.36,1]}} className="absolute inset-0 bg-gradient-to-br from-black/[0.04] via-transparent to-black/[0.06] dark:from-white/[0.06] dark:to-white/[0.02]"/>
        <motion.div initial={{opacity:0, y:16}} animate={{opacity:1,y:0}} transition={{delay:0.2, duration:0.5}} className="relative max-w-sm space-y-5">
          <div className="h-12 w-12 rounded-2xl bg-black dark:bg-white text-white dark:text-black grid place-items-center font-black text-sm shadow-lg">A</div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Consistencia minimal</h2>
            <p className="text-sm text-black/60 dark:text-white/60 mt-1">Mismos tokens que el dashboard: gap-px, rounded-2xl, zinc, motion stagger, pulso activo. Vivo pero sin ruido.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-medium">Framer Motion</span>
            <span className="px-3 py-1.5 rounded-full border bg-white dark:bg-black text-xs">gap-px + rounded-2xl</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
