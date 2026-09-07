"use client"
import { useState } from "react"
import { Typography, Chip, Table } from "@heroui/react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
type Proyecto = { id:number; nombre:string; estado:"En desarrollo"|"Por vencer"|"Finalizado"; avance:number; vence:string; practicante:string }
const all: Proyecto[] = [
  {id:1, nombre:"Sistema de Inventario", estado:"En desarrollo", avance:65, vence:"20 sep", practicante:"José Ramos"},
  {id:2, nombre:"Módulo Reportes", estado:"En desarrollo", avance:40, vence:"30 sep", practicante:"Diego Ruiz"},
  {id:3, nombre:"API Asistencias", estado:"En desarrollo", avance:25, vence:"05 oct", practicante:"Lucía Vega"},
  {id:4, nombre:"Landing Corporativa", estado:"Por vencer", avance:90, vence:"10 sep", practicante:"Ana Torres"},
  {id:5, nombre:"Onboarding RRHH", estado:"Finalizado", avance:100, vence:"01 sep", practicante:"Carlos Mendoza"},
  {id:6, nombre:"Dashboard Incidencias", estado:"Finalizado", avance:100, vence:"28 ago", practicante:"María López"},
  {id:7, nombre:"Manual Prácticas", estado:"Finalizado", avance:100, vence:"15 ago", practicante:"Sofía Díaz"},
  {id:8, nombre:"Intranet DSG", estado:"Finalizado", avance:100, vence:"10 ago", practicante:"Omar Quispe"},
]
const color:Record<string,any>={ "En desarrollo":"warning", "Por vencer":"danger", "Finalizado":"success"}
function ScaledTable({rows}:{rows:Proyecto[]}){
  if(rows.length===0) return <p className="text-sm text-muted p-4">Sin proyectos</p>
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Proyectos detalle" className="min-w-[560px]">
          <Table.Header>
            <Table.Column isRowHeader>Proyecto</Table.Column>
            <Table.Column>Practicante</Table.Column>
            <Table.Column>Avance</Table.Column>
            <Table.Column>Vence</Table.Column>
          </Table.Header>
          <Table.Body>
            {rows.map(r=>(
              <Table.Row key={r.id} id={r.id}>
                <Table.Cell className="font-medium">{r.nombre}</Table.Cell>
                <Table.Cell>{r.practicante}</Table.Cell>
                <Table.Cell><div className="flex items-center gap-2"><div className="h-1.5 w-16 bg-black/10 rounded-full"><div className="h-1.5 bg-black rounded-full" style={{width:r.avance+"%"}}/></div>{r.avance}%</div></Table.Cell>
                <Table.Cell className="text-muted text-sm">{r.vence}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  )
}
function ExpandableCard({title, rows}:{title:string; rows:Proyecto[]}){
  const [open,setOpen]=useState(false)
  return (
    <div className="bg-zinc-100 dark:bg-zinc-900 border dark:border-white/10 rounded-2xl overflow-hidden">
      <button onClick={()=>setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/5 transition-colors">
        <div><Typography type="h6">{title}</Typography><span className="text-xs text-muted">{rows.length} proyectos</span></div>
        <div className="flex items-center gap-3"><span className="text-2xl font-bold">{rows.length}</span><Chip size="sm" variant="soft" color={color[title] as any}>{title}</Chip><ChevronDown className={cn("h-5 w-5 text-black/40 transition-transform", open&&"rotate-180")} /></div>
      </button>
      <div className={cn("grid transition-all", open?"grid-rows-[1fr] opacity-100":"grid-rows-[0fr] opacity-0")}>
        <div className="overflow-hidden"><div className="px-4 pb-4 border-t dark:border-white/10"><div className="pt-4 scale-[0.98] origin-top"><ScaledTable rows={rows}/></div></div></div>
      </div>
    </div>
  )
}
export default function Page(){
  const enDesarrollo=all.filter(p=>p.estado==="En desarrollo")
  const porVencer=all.filter(p=>p.estado==="Por vencer")
  const finalizados=all.filter(p=>p.estado==="Finalizado")
  return <div className="space-y-6"><div><Typography type="h2">Proyectos</Typography><Typography type="body-sm" className="text-muted">Clic para expandir tabla dentro del card</Typography></div><div className="grid gap-4"><ExpandableCard title="En desarrollo" rows={enDesarrollo}/><ExpandableCard title="Por vencer" rows={porVencer}/><ExpandableCard title="Finalizados" rows={finalizados}/></div></div>
}
