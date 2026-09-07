"use client"
import * as React from "react"
import { MoreHorizontal, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { createPortal } from "react-dom"
type Action = { label:string; icon?: React.ComponentType<any>; href?:string; onClick?:()=>void; destructive?:boolean }
export function ActionMenu({ actions, align="end" }: { actions: Action[]; align?: "start"|"end" }){
  const [open,setOpen]=React.useState(false)
  const [mounted,setMounted]=React.useState(false)
  const ref=React.useRef<HTMLDivElement>(null)
  const btnRef=React.useRef<HTMLButtonElement>(null)
  const [pos,setPos]=React.useState({top:0, right:0})
  React.useEffect(()=> setMounted(true),[])
  React.useEffect(()=>{
    const onDown=(e:MouseEvent)=>{ if(ref.current && !ref.current.contains(e.target as Node)) setOpen(false)}
    const onKey=(e:KeyboardEvent)=>{ if(e.key==="Escape") setOpen(false)}
    if(open){ document.addEventListener("mousedown", onDown); document.addEventListener("keydown", onKey)}
    return ()=>{ document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey)}
  },[open])
  const toggle=()=>{
    if(!open && btnRef.current){
      const r=btnRef.current.getBoundingClientRect()
      setPos({top: r.bottom+8, right: window.innerWidth - r.right})
    }
    setOpen(!open)
  }
  return (
    <div ref={ref} className="relative">
      <button ref={btnRef} aria-haspopup="menu" aria-expanded={open} onClick={toggle} className={`h-8 w-8 grid place-items-center rounded-full border ${open?"bg-black dark:bg-white text-white dark:text-black":"bg-white dark:bg-black border-black/10 dark:border-white/10 hover:bg-black/5"}`}>
        <MoreHorizontal className="h-4 w-4" />
      </button>
      <AnimatePresence>{mounted && open && createPortal(
        <motion.div
          initial={{opacity:0, y:-8, scale:0.96}} animate={{opacity:1, y:0, scale:1}} exit={{opacity:0, y:-4, scale:0.97}} transition={{duration:0.2, ease:[0.22,1,0.36,1] as any}}
          style={{position:"fixed", top:pos.top, right:pos.right, transformOrigin: align==="end"?"top right":"top left"}}
          className="w-48 bg-white dark:bg-black border border-black/10 dark:border-white/10 shadow-xl rounded-2xl p-2 z-[100]"
        >
          <div className="flex justify-between items-center px-2 pb-2"><span className="text-xs font-semibold">Más</span><button onClick={()=>setOpen(false)} className="h-7 w-7 grid place-items-center rounded-full hover:bg-black/5"><X className="h-4 w-4"/></button></div>
          {actions.map((a,i)=>(
            <motion.div key={a.label} initial={{opacity:0, y:4}} animate={{opacity:1, y:0}} transition={{delay:(i+1)*0.02}}>
              {a.href ? <a href={a.href} onClick={()=>setOpen(false)} className={`flex px-3 py-2.5 rounded-xl text-sm ${a.destructive?"text-red-600 hover:bg-red-50":"hover:bg-black/5"}`}>{a.label}</a> : <button onClick={()=>{ setOpen(false); a.onClick?.()}} className={`w-full flex px-3 py-2.5 rounded-xl text-sm text-left ${a.destructive?"text-red-600 hover:bg-red-50":"hover:bg-black/5"}`}>{a.label}</button>}
            </motion.div>
          ))}
        </motion.div>,
        document.body
      )}</AnimatePresence>
    </div>
  )
}
