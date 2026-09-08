"use client"
import { Building2, Users, Shield, Activity } from "lucide-react"
import { MinimalistDashboardView } from "../minimalist/minimalist-dashboard-view"
export function DevDashboard({stats}:{stats:any}){
  return <MinimalistDashboardView userName="DEV — Stev (todo el sistema)" metrics={[
    {label:"Empresas", value: stats.companies||0, icon: Building2, trend:"global"},
    {label:"Admins", value: stats.admins||0, icon: Shield, trend:"activos"},
    {label:"Personal total", value: stats.personal||0, icon: Users, trend:"global"},
    {label:"Asistencias", value: stats.asistencias||0, icon: Activity, trend:"hoy/total"},
    {label:"Incidencias", value: stats.incidencias||0, icon: Shield, trend:"pendientes"},
    {label:"Proyectos", value: stats.proyectos||0, icon: Activity, trend:"global"},
    {label:"Horarios", value: stats.horarios||0, icon: Building2, trend:"global"},
  ]} quickActions={[
    {label:"Gestionar Admins", desc:"Crear / eliminar admins por empresa", icon: Shield, href:"/dev"},
    {label:"Auditoría global", desc:"Ver logs de todo el sistema", icon: Activity, href:"/reportes"},
    {label:"Configuración global", desc:"Módulos y empresas", icon: Building2, href:"/configuracion"},
  ]} activities={stats.activities||[]} />
}
