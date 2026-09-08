"use client"
import { Building2, Users, Shield, Activity } from "lucide-react"
import { MinimalistDashboardView } from "../minimalist/minimalist-dashboard-view"
export function DevDashboard({stats}:{stats:any}){
  return <MinimalistDashboardView userName="DEV — Stev" metrics={[
    {label:"Empresas", value: stats.companies||0, icon: Building2, trend:"global"},
    {label:"Admins", value: stats.admins||0, icon: Shield, trend:"activos"},
    {label:"Personal total", value: stats.personal||0, icon: Users, trend:"global"},
    {label:"Proyectos", value: stats.proyectos||0, icon: Activity, trend:"global"},
  ]} quickActions={[
    {label:"Gestionar Admins", desc:"Crear / eliminar admins por empresa", icon: Shield, href:"/dev"},
    {label:"Ver todo el personal", desc:"Global", icon: Users, href:"/personal"},
    {label:"Reportes globales", desc:"Todas las empresas", icon: Activity, href:"/reportes"},
  ]} activities={stats.activities||[]} />
}
