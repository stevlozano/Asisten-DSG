"use client"
import { MinimalistDashboardView } from "@/components/dashboard/minimalist/minimalist-dashboard-view"
import { Users, Clock, AlertTriangle, FolderKanban, UserCheck, Plus, Search, Calendar, FileText, Activity } from "lucide-react"
export default function Page(){
  return <MinimalistDashboardView
    userName="Ing. Omar"
    metrics={[
      {label:"Personal", value:42, icon: Users, trend:"42 total"},
      {label:"Presentes", value:35, icon: UserCheck, trend:"Hoy", trendUp:true},
      {label:"Tardanzas", value:4, icon: Clock, trend:"Hoy"},
      {label:"Faltas", value:3, icon: AlertTriangle, trend:"Hoy"},
      {label:"Proyectos", value:8, icon: FolderKanban, trend:"65% avance"},
    ]}
    quickActions={[
      {label:"Agregar personal", desc:"Registrar empleado o practicante", icon: Plus, href:"/personal"},
      {label:"Registrar asistencia", desc:"Entrada / salida del día", icon: Clock, href:"/asistencias"},
      {label:"Ver incidencias", desc:"Tardanzas y faltas pendientes", icon: AlertTriangle, href:"/incidencias"},
      {label:"Gestionar horarios", desc:"Turnos y tolerancias", icon: Calendar, href:"/horarios"},
      {label:"Proyectos", desc:"Seguimiento de practicantes", icon: FolderKanban, href:"/proyectos"},
      {label:"Reportes", desc:"Exportar PDF / Excel", icon: FileText, href:"/reportes"},
    ]}
    activities={[
      {id:"1", title:"Carlos Mendoza registró entrada", description:"08:07 - a tiempo · Desarrollo", time:"Hace 12m", icon: UserCheck},
      {id:"2", title:"Tardanza detectada", description:"José Ramos 08:17 (17 min) · Incidencia pendiente", time:"Hace 28m", icon: Clock},
      {id:"3", title:"Proyecto próximo a vencer", description:"Sistema Inventario · 65% · vence 20 sep", time:"Hace 1h", icon: FolderKanban},
      {id:"4", title:"Nueva incidencia", description:"Ana Torres no registró salida ayer", time:"Hace 3h", icon: AlertTriangle},
    ]}
  />
}
