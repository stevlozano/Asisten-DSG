"use client"
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { LayoutDashboard, Users, Clock, Calendar, AlertTriangle, FolderKanban, Activity, BarChart3, Settings, ChevronLeft, User, LogOut } from "lucide-react"
import { Avatar, Button, Dropdown, Label } from "@heroui/react"
import { MobileNavbar } from "@/components/ui/mobile-navbar"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Person } from "@gravity-ui/icons"
const navSections: any = [
  { title:"Principal", items:[{title:"Dashboard", href:"/", icon:LayoutDashboard}]},
  { title:"Gestión", items:[{title:"Personal", href:"/personal", icon:Users}]},
  { title:"Control", items:[{title:"Asistencias", href:"/asistencias", icon:Clock},{title:"Horarios", href:"/horarios", icon:Calendar},{title:"Incidencias", href:"/incidencias", icon:AlertTriangle}]},
  { title:"Prácticas", items:[{title:"Proyectos", href:"/proyectos", icon:FolderKanban},{title:"Seguimiento", href:"/seguimiento", icon:Activity}]},
  { title:"Información", items:[{title:"Reportes", href:"/reportes", icon:BarChart3}]},
]
const mobileItems = [
  {title:"Dashboard", href:"/", icon:LayoutDashboard},
  {title:"Personal", href:"/personal", icon:Users},
  {title:"Asistencias", href:"/asistencias", icon:Clock},
  {title:"Horarios", href:"/horarios", icon:Calendar},
  {title:"Incidencias", href:"/incidencias", icon:AlertTriangle},
  {title:"Proyectos", href:"/proyectos", icon:FolderKanban},
  {title:"Seguimiento", href:"/seguimiento", icon:Activity},
  {title:"Reportes", href:"/reportes", icon:BarChart3},
]
function ProfileMenu(){
  return (
    <Dropdown>
      <Button variant="ghost" className="flex items-center gap-3 h-auto py-2.5 px-4 rounded-full">
        <Avatar color="accent" size="sm"><Avatar.Fallback><Person/></Avatar.Fallback><Avatar.Image src="https://img.heroui.chat/image/avatar?w=400&h=400&u=16" alt="Ing. Omar"/></Avatar>
        <div className="hidden sm:flex flex-col leading-none text-left"><span className="text-sm font-medium">Ing. Omar</span><span className="text-xs text-muted">Administrador</span></div>
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu onAction={(key)=>{ if(key==="perfil") window.location.href="/perfil"; if(key==="config") window.location.href="/configuracion"; if(key==="salir") window.location.href="/login"}}>
          <Dropdown.Item id="perfil" textValue="Perfil">
            <User className="size-4 shrink-0 text-muted" />
            <Label>Perfil</Label>
          </Dropdown.Item>
          <Dropdown.Item id="config" textValue="Configuración">
            <Settings className="size-4 shrink-0 text-muted" />
            <Label>Configuración</Label>
          </Dropdown.Item>
          <Dropdown.Item id="salir" textValue="Salir" variant="danger">
            <LogOut className="size-4 shrink-0 text-danger" />
            <Label>Salir</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )
}

export default function PanelLayout({children}:{children:React.ReactNode}){
  const pathname=usePathname()
  if(pathname==="/login") return <>{children}</>
  const { theme, setTheme } = useTheme()
  const [open,setOpen]=React.useState(true)
  React.useEffect(()=>{const s=localStorage.getItem("sb-sidebar-open"); if(s!==null) setOpen(s==="1")},[])
  const isActive=(h:string)=> pathname===h || (h!=="/" && pathname.startsWith(h+"/"))
  return (
    <div className="flex h-screen overflow-hidden" style={{}}>
      <aside className={cn("hidden md:flex flex-col h-screen shrink-0 bg-white dark:bg-black transition-[width] duration-280 ease-[cubic-bezier(0.22,1,0.36,1)]", open?"w-[240px]":"w-[64px]")}>
        <div className={cn("flex items-center h-14 px-3 shrink-0 font-black tracking-tight text-sm", !open&&"justify-center")}>{open?"ASISTEN-DSG":"A"}</div>
        <nav className={cn("flex-1 overflow-y-auto overflow-x-hidden py-3", open?"px-2 space-y-4":"px-2 space-y-2")}>
          {navSections.map((s:any)=>(
            <div key={s.title} className="space-y-1">
              {open && <h3 className="px-2.5 text-[10px] font-semibold uppercase tracking-wider text-black/40 dark:text-white/40">{s.title}</h3>}
              {s.items.map((it:any)=>{
                const active=isActive(it.href)
                return (
                  <Link key={it.href} href={it.href} className={cn("group relative flex items-center gap-2.5 text-sm overflow-hidden", open?"h-9 px-2.5 rounded-full":"w-9 h-9 mx-auto justify-center")} title={!open?it.title:undefined}>
                    {!open && (
                      <span className={`absolute inset-0 ${active?"bg-black dark:bg-white":"bg-transparent"} ${active?"":"group-hover:bg-black/5 dark:group-hover:bg-white/10"}`} style={{borderRadius: active?16:999}} />
                    )}
                    <motion.span className={cn("relative z-10 flex items-center gap-2.5 shrink-0", active?"text-white dark:text-black":"text-black/60 dark:text-white/70 group-hover:text-black dark:group-hover:text-white")} whileHover={{scale:1.04}} whileTap={{scale:0.97}} transition={{duration:0.18, ease:[0.22,1,0.36,1]}}>
                      <it.icon className={cn("h-[18px] w-[18px] shrink-0", open && active?"text-white dark:text-black":"")} />
                    </motion.span>
                    {open && <span className={cn("relative z-10 flex-1 truncate transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:tracking-[0.02em]", active?"font-semibold text-white dark:text-black":"text-black/70 dark:text-white/70")}>{it.title}</span>}
                    {open && (
                      <span className={`absolute inset-0 rounded-full pointer-events-none transition-colors duration-200 ${active?"bg-black dark:bg-white":"bg-transparent"}`} />
                    )}
                  </Link>
                )
              })}
              {/* fix open state: wrap with bg */}
              {null}
            </div>
          ))}
        </nav>
        <div className="p-2lack/5 space-y-1 shrink-0">
          <button onClick={()=>setOpen(v=>{const n=!v; localStorage.setItem("sb-sidebar-open",n?"1":"0"); return n})} className="w-full flex items-center gap-2.5 h-9 px-2.5 rounded-full text-sm text-black/60 hover:bg-black/5">
            <ChevronLeft className={cn("h-4 w-4 transition-transform duration-260 ease-[cubic-bezier(0.22,1,0.36,1)]", !open&&"rotate-180")} />{open&&"Colapsar"}
          </button>
          <Link href="/configuracion" className={cn("group relative flex items-center gap-2.5 h-9 px-2.5 rounded-full text-sm overflow-hidden", isActive("/configuracion")?"bg-black dark:bg-white text-white dark:text-black":"text-black/60 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10")}><Settings className="h-4 w-4 shrink-0"/><span className={cn("transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:tracking-[0.02em]", open?"":"hidden")}>{open&&"Configuración"}</span></Link>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between h-14 px-6 bg-white dark:bg-black"><span className="text-sm font-medium capitalize">{pathname.split("/").pop()||"Dashboard"}</span><div className="flex items-center gap-3"><button onClick={()=>setTheme(theme==="dark"?"light":"dark")} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"><Sun className="h-4 w-4 dark:hidden"/><Moon className="h-4 w-4 hidden dark:block"/></button><ProfileMenu/></div></header>
        <MobileNavbar activeHref={pathname} />
        <main className="flex-1 overflow-auto px-4 md:px-6 py-6 pb-28 md:pb-6 bg-white dark:bg-black">
          <AnimatePresence mode="wait">
            <motion.div key={pathname} initial={{opacity:0, y:8, filter:"blur(6px)"}} animate={{opacity:1, y:0, filter:"blur(0px)"}} exit={{opacity:0, y:-8, filter:"blur(6px)"}} transition={{duration:0.28, ease:[0.22,1,0.36,1]}}>{children}</motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
