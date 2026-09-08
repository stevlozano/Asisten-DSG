"use client"
import { MinimalistDashboardView } from "../minimalist/minimalist-dashboard-view"
import { FolderKanban, Clock, Activity } from "lucide-react"
export function PracticanteDashboard({name, proyecto}:{name:string, proyecto:any}){
  return <MinimalistDashboardView userName={name} metrics={[
    {label:"Mi proyecto", value: proyecto?.titulo||"—", icon: FolderKanban, trend: proyecto? `${proyecto.avance}%`:"sin asignar"},
    {label:"Avance", value: proyecto? `${proyecto.avance}%`:"—", icon: Activity, trend: proyecto?.estado||""},
  ]} quickActions={[
    {label:"Mi proyecto", desc:"Avance y entregas", icon: FolderKanban, href:"/proyectos"},
    {label:"Mi seguimiento", desc:"Feedback", icon: Activity, href:"/seguimiento"},
    {label:"Mi asistencia", desc:"Registro diario", icon: Clock, href:"/asistencias"},
  ]} activities={[]} />
}
