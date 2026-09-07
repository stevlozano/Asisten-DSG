
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Clock, Calendar, AlertTriangle, FolderKanban, Activity, BarChart3, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';
const nav = [
  {label:'Inicio', href:'/', icon: LayoutDashboard, group:''},
  {label:'Personal', href:'/personal', icon: Users, group:'GESTIÓN'},
  {label:'Asistencias', href:'/asistencias', icon: Clock, group:'CONTROL'},
  {label:'Horarios', href:'/horarios', icon: Calendar, group:'CONTROL'},
  {label:'Incidencias', href:'/incidencias', icon: AlertTriangle, group:'CONTROL'},
  {label:'Proyectos', href:'/proyectos', icon: FolderKanban, group:'GESTIÓN DE PRÁCTICAS'},
  {label:'Seguimiento', href:'/seguimiento', icon: Activity, group:'GESTIÓN DE PRÁCTICAS'},
  {label:'Reportes', href:'/reportes', icon: BarChart3, group:'INFORMACIÓN'},
];
export function Sidebar(){
  const pathname=usePathname();
  const [open,setOpen]=useState(false);
  const content = (
    <nav className="p-4 space-y-1">
      <div className="px-3 py-4 font-black tracking-tight text-lg">ASISTEN-DSG</div>
      {(() => { let lastGroup=''; return nav.map(i => {
        const active=pathname===i.href;
        const showGroup = i.group!==lastGroup;
        if(showGroup) lastGroup=i.group;
        return (
          <div key={i.href}>
            {showGroup && i.group && <div className="px-3 mt-4 mb-1 text-[11px] tracking-widest text-black/40 font-semibold">{i.group}</div>}
            <Link href={i.href} onClick={()=>setOpen(false)} className={"flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm "+(active?"bg-[#1F9A75] text-white":"hover:bg-black/5 text-black/70")}>
              <i.icon size={18}/> {i.label}
            </Link>
          </div>
        )
      })})()}
      <Link href="/configuracion" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-black/5 mt-6"><Settings size={18}/> Configuración</Link>
      <div className="mt-6 p-3 rounded-2xl bg-[#EEF4F1] flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#1F9A75] text-white grid place-items-center font-bold">O</div>
        <div><div className="text-sm font-semibold">Ing. Omar</div><div className="text-xs text-black/50">Administrador</div></div>
      </div>
    </nav>
  );
  return <>
    <div className="lg:hidden sticky top-0 z-30 bg-white border-b flex items-center justify-between px-4 py-3">
      <span className="font-black">ASISTEN-DSG</span>
      <button onClick={()=>setOpen(!open)} className="p-2 rounded-xl bg-black text-white">{open?<X size={18}/>:<Menu size={18}/>}</button>
    </div>
    <aside className="hidden lg:block fixed left-0 top-0 h-screen w-[250px] bg-white border-r overflow-y-auto">{content}</aside>
    {open && <div className="lg:hidden fixed inset-0 z-40 flex"><div className="w-[280px] bg-white h-full overflow-y-auto">{content}</div><div className="flex-1 bg-black/40" onClick={()=>setOpen(false)}/></div>}
  </>;
}
