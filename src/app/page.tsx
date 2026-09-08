"use client"
import { useEffect, useState } from "react"
import { MinimalistDashboardView } from "@/components/dashboard/minimalist/minimalist-dashboard-view"
import { Users, Clock, AlertTriangle, FolderKanban, UserCheck, Plus, Calendar, FileText, Activity } from "lucide-react"
import { supabase } from "@/lib/supabase"

const COMPANY_ID="00000000-0000-0000-0000-000000000001"
export default function Page(){
  const [metrics,setMetrics]=useState([
    {label:"Personal", value:0, icon: Users, trend:"0 total"},
    {label:"Presentes", value:0, icon: UserCheck, trend:"Hoy", trendUp:true},
    {label:"Tardanzas", value:0, icon: Clock, trend:"Hoy"},
    {label:"Faltas", value:0, icon: AlertTriangle, trend:"Hoy"},
    {label:"Proyectos", value:0, icon: FolderKanban, trend:"0% avance"},
  ])
  const [activities,setActivities]=useState<any[]>([])

  async function load(){
      const {count:personal}=await supabase.from("profiles").select("*",{count:"exact",head:true}).eq("company_id",COMPANY_ID)
      const today=new Date().toISOString().slice(0,10)
      const {count:presentes}=await supabase.from("asistencias").select("*",{count:"exact",head:true}).eq("company_id",COMPANY_ID).eq("fecha",today).eq("estado","Presente")
      const {count:tardanzas}=await supabase.from("asistencias").select("*",{count:"exact",head:true}).eq("company_id",COMPANY_ID).eq("fecha",today).eq("estado","Tardanza")
      const {count:faltas}=await supabase.from("asistencias").select("*",{count:"exact",head:true}).eq("company_id",COMPANY_ID).eq("fecha",today).eq("estado","Falta")
      const {count:proyectos, data:proj}=await supabase.from("proyectos").select("avance",{count:"exact"}).eq("company_id",COMPANY_ID)
      const avg = proj?.length ? Math.round(proj.reduce((a:number,b:any)=>a+(b.avance||0),0)/proj.length) : 0
      setMetrics([
        {label:"Personal", value:personal||0, icon: Users, trend:`${personal||0} total`},
        {label:"Presentes", value:presentes||0, icon: UserCheck, trend:"Hoy", trendUp:true},
        {label:"Tardanzas", value:tardanzas||0, icon: Clock, trend:"Hoy"},
        {label:"Faltas", value:faltas||0, icon: AlertTriangle, trend:"Hoy"},
        {label:"Proyectos", value:proyectos||0, icon: FolderKanban, trend:`${avg}% avance`},
      ])
      const {data:acts}=await supabase.from("audit_logs").select("*").eq("company_id",COMPANY_ID).order("created_at",{ascending:false}).limit(5)
      setActivities((acts||[]).map((a:any)=>({ id:a.id, title:`${a.accion} ${a.tabla}`, description:a.motivo||a.datos?.nombre||"", time:new Date(a.created_at).toLocaleTimeString("es-PE",{hour:"2-digit",minute:"2-digit"}), icon: Activity })))
  }
  useEffect(()=>{
    load()
    const ch=supabase.channel("dashboard-realtime").on("postgres_changes",{event:"*",schema:"public",table:"asistencias"},load).on("postgres_changes",{event:"*",schema:"public",table:"profiles"},load).on("postgres_changes",{event:"*",schema:"public",table:"proyectos"},load).on("postgres_changes",{event:"*",schema:"public",table:"incidencias"},load).on("postgres_changes",{event:"*",schema:"public",table:"audit_logs"},load).subscribe()
    return()=>{ supabase.removeChannel(ch) }
  },[])

  return <MinimalistDashboardView
    userName="Ing. Omar"
    metrics={metrics}
    quickActions={[
      {label:"Agregar personal", desc:"Registrar empleado o practicante", icon: Plus, href:"/personal"},
      {label:"Registrar asistencia", desc:"Entrada / salida del día", icon: Clock, href:"/asistencias"},
      {label:"Ver incidencias", desc:"Tardanzas y faltas pendientes", icon: AlertTriangle, href:"/incidencias"},
      {label:"Gestionar horarios", desc:"Turnos y tolerancias", icon: Calendar, href:"/horarios"},
      {label:"Proyectos", desc:"Seguimiento de practicantes", icon: FolderKanban, href:"/proyectos"},
      {label:"Reportes", desc:"Exportar PDF / Excel", icon: FileText, href:"/reportes"},
    ]}
    activities={activities}
  />
}
