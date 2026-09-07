"use client"
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Clock, Calendar, MoreHorizontal, X } from "lucide-react"
import gsap from "gsap"

const visibleItems = [
  {title:"Dashboard", href:"/", icon: LayoutDashboard},
  {title:"Personal", href:"/personal", icon: Users},
  {title:"Asistencias", href:"/asistencias", icon: Clock},
  {title:"Horarios", href:"/horarios", icon: Calendar},
]
const moreItems = [
  {title:"Incidencias", href:"/incidencias"},
  {title:"Proyectos", href:"/proyectos"},
  {title:"Seguimiento", href:"/seguimiento"},
  {title:"Reportes", href:"/reportes"},
  {title:"Configuración", href:"/configuracion"},
]

export function MobileNavbar({ activeHref }: { activeHref: string }){
  const pathname = activeHref || usePathname()
  const [open,setOpen]=React.useState(false)
  const [renderOpen,setRenderOpen]=React.useState(false)
  const containerRef=React.useRef<HTMLDivElement>(null)
  const isActive=(h:string)=> pathname===h || pathname.startsWith(h+"/")
  React.useEffect(()=>{
    if(open) setRenderOpen(true)
    if(!containerRef.current) return
    if(open){
      gsap.fromTo(containerRef.current,{height:48, borderRadius:999},{height:"auto", borderRadius:16, duration:0.28, ease:"power3.out"})
      const items=containerRef.current.querySelectorAll("[data-item]")
      gsap.fromTo(items,{opacity:0, y:4},{opacity:1, y:0, duration:0.16, stagger:0.02, ease:"power2.out", delay:0.08})
    } else if(renderOpen){
      gsap.to(containerRef.current,{height:48, borderRadius:999, scale:0.96, opacity:0.8, duration:0.28, ease:"power2.in", onComplete:()=>{ gsap.set(containerRef.current,{scale:1, opacity:1}); setRenderOpen(false)}})
    }
  },[open, renderOpen])
  React.useEffect(()=>{
    const onDown=(e:MouseEvent)=>{ if(containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)}
    if(open) document.addEventListener("mousedown", onDown)
    return ()=> document.removeEventListener("mousedown", onDown)
  },[open])
  return (
    <div className="md:hidden fixed bottom-3 left-0 right-0 z-40 px-3">
      <div className="mx-auto max-w-md flex items-end justify-between gap-2">
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-full px-2 py-1.5 shadow-xl">
          {visibleItems.map((it)=>{
            const Icon=it.icon
            return (
              <Link key={it.href} href={it.href} className={cn("h-9 w-9 grid place-items-center rounded-full", isActive(it.href)?"bg-black dark:bg-white text-white dark:text-black":"text-black/60 dark:text-white/60")}>
                <Icon className="h-5 w-5"/>
              </Link>
            )
          })}
        </div>
        <div ref={containerRef} className={cn("bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 shadow-xl overflow-hidden flex flex-col", renderOpen?"w-48 rounded-2xl":"w-12 h-12 rounded-full")}>
          {!renderOpen ? (
            <button onClick={()=>setOpen(true)} className="h-12 w-12 grid place-items-center shrink-0">
              <MoreHorizontal className="h-5 w-5"/>
            </button>
          ) : (
            <div className="p-2">
              <div className="flex justify-between items-center px-2 pb-2">
                <span className="text-xs font-semibold">Más</span>
                <button onClick={()=>setOpen(false)} className="h-7 w-7 grid place-items-center rounded-full hover:bg-black/5"><X className="h-4 w-4"/></button>
              </div>
              {moreItems.map((it)=>(
                <div key={it.href} data-item>
                  <Link href={it.href} onClick={()=>setOpen(false)} className={cn("flex px-3 py-2.5 rounded-xl text-sm", isActive(it.href)?"bg-black dark:bg-white text-white dark:text-black":"hover:bg-black/5 dark:hover:bg-white/10")}>
                    {it.title}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
