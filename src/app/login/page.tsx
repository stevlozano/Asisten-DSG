"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Clock, Shield } from "lucide-react"

const CREDS = [
  { role: "Administrador", email: "admin@asisten-dsg.pe", pass: "Admin123*" },
  { role: "Supervisor", email: "supervisor@asisten-dsg.pe", pass: "Super123*" },
  { role: "RRHH", email: "rrhh@asisten-dsg.pe", pass: "Rrhh123*" },
]

export default function LoginPage(){
  const router = useRouter()
  const [email,setEmail]=useState("")
  const [pass,setPass]=useState("")
  const [show,setShow]=useState(false)
  const [err,setErr]=useState("")

  function handleLogin(e:React.FormEvent){
    e.preventDefault()
    const found = CREDS.find(c=> c.email.toLowerCase()===email.trim().toLowerCase() && c.pass===pass)
    if(!found){ setErr("Credenciales incorrectas. Usa una de las de prueba."); return }
    localStorage.setItem("asisten-auth", JSON.stringify(found))
    router.push("/")
  }

  function fill(c:typeof CREDS[0]){ setEmail(c.email); setPass(c.pass); setErr("") }

  return (
    <div className="min-h-screen flex bg-white dark:bg-black">
      {/* left - form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-[380px] space-y-6">
          <div>
            <p className="text-sm font-black tracking-tight">ASISTEN-DSG</p>
            <p className="text-xs text-black/40 dark:text-white/40">DSG PERU TECHNOLOGY SAC</p>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Ingresar</h1>
            <p className="text-sm text-black/60 dark:text-white/60">Control diario — asistencia genera incidencia, no descuento automático.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-black/70 dark:text-white/70">Correo</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@asisten-dsg.pe" className="w-full h-11 px-4 rounded-full border bg-zinc-100 dark:bg-zinc-900 border-black/10 dark:border-white/10 text-sm outline-none focus:border-black dark:focus:border-white placeholder:text-black/30 dark:placeholder:text-white/30" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-black/70 dark:text-white/70">Contraseña</label>
              <div className="relative">
                <input type={show?"text":"password"} value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" className="w-full h-11 px-4 pr-11 rounded-full border bg-zinc-100 dark:bg-zinc-900 border-black/10 dark:border-white/10 text-sm outline-none focus:border-black dark:focus:border-white" />
                <button type="button" onClick={()=>setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                  {show? <EyeOff className="h-4 w-4 text-black/60 dark:text-white/60"/> : <Eye className="h-4 w-4 text-black/60 dark:text-white/60"/>}
                </button>
              </div>
            </div>
            {err && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-2xl px-3 py-2">{err}</p>}
            <button type="submit" className="w-full h-11 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-90 transition">Ingresar</button>
          </form>

          <div className="bg-zinc-100 dark:bg-zinc-900 border dark:border-white/10 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-medium flex items-center gap-2"><Shield className="h-3.5 w-3.5"/> Credenciales ficticias — click para autocompletar</p>
            <div className="space-y-2">
              {CREDS.map(c=>(
                <button key={c.email} onClick={()=>fill(c)} className="w-full text-left px-3 py-2.5 rounded-2xl border bg-white dark:bg-black border-black/5 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition">
                  <p className="text-xs font-semibold">{c.role} <span className="font-normal text-black/50 dark:text-white/50">— {c.email}</span></p>
                  <p className="text-xs font-mono text-black/60 dark:text-white/60">Pass: {c.pass}</p>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-black/40 dark:text-white/40 flex items-center gap-1.5"><Clock className="h-3 w-3"/> Solo demo local. No hay backend real.</p>
          </div>
        </div>
      </div>

      {/* right - minimal branding */}
      <div className="hidden lg:flex flex-1 bg-zinc-100 dark:bg-zinc-900 border-l dark:border-white/10 items-center justify-center p-10">
        <div className="max-w-sm space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-black text-sm">A</div>
          <h2 className="text-xl font-semibold">Minimal, como el dashboard</h2>
          <p className="text-sm text-black/60 dark:text-white/60">Mismos tokens: rounded-full, zinc-100/zinc-900, border sutil, tipografía Manrope. Sin ruido.</p>
          <div className="flex gap-2 pt-2">
            <span className="px-3 py-1.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs">Rounded-full</span>
            <span className="px-3 py-1.5 rounded-full border bg-white dark:bg-black text-xs">Zinc + border</span>
          </div>
        </div>
      </div>
    </div>
  )
}
