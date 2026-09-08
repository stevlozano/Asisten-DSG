"use client"
import { MinimalistDashboardView } from "../minimalist/minimalist-dashboard-view"
import { Clock, Calendar, FileText, AlertTriangle } from "lucide-react"
export function EmpleadoDashboard({name, asistencia}:{name:string, asistencia:any}){
  return <MinimalistDashboardView userName={name} metrics={[
    {label:"Mi estado hoy", value: asistencia?.estado||"—", icon: Clock, trend: asistencia?.hora_entrada||"—"},
    {label:"Tardanzas", value: asistencia?.tardanzas||0, icon: AlertTriangle, trend:"mes"},
  ]} quickActions={[
    {label:"Mi asistencia", desc:"Entradas y salidas", icon: Clock, href:"/asistencias"},
    {label:"Mi horario", desc:"Turno asignado", icon: Calendar, href:"/horarios"},
    {label:"Mis incidencias", desc:"Justificaciones", icon: AlertTriangle, href:"/incidencias"},
  ]} activities={[]} />
}
