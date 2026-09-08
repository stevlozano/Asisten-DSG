"use client"
import { useState, useMemo } from "react"
import { Chip, Table, Tabs, Typography, Button, TextField, Label, Input } from "@heroui/react"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Modal } from "@heroui/react"
import { Rocket } from "@gravity-ui/icons"
import { Avatar, Checkbox } from "@heroui/react" // Button already imported
import { ActionMenu } from "@/components/shared/ActionMenu"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { Clock, FileText } from "lucide-react"
import type { SortDescriptor } from "@heroui/react"

type Row = { id:number; nombre:string; entrada:string; salida:string; estado:"Presente"|"Tardanza"|"Falta"|"Sin salida"; minutos?:number }
const rows: Row[] = [
  {id:1, nombre:"Carlos Mendoza", entrada:"08:07", salida:"17:02", estado:"Presente"},
  {id:2, nombre:"José Ramos", entrada:"08:17", salida:"-", estado:"Tardanza", minutos:17},
  {id:3, nombre:"María López", entrada:"08:02", salida:"17:05", estado:"Presente"},
  {id:4, nombre:"Ana Torres", entrada:"-", salida:"-", estado:"Falta"},
  {id:5, nombre:"Diego Ruiz", entrada:"09:05", salida:"15:00", estado:"Tardanza", minutos:5},
  {id:6, nombre:"Lucía Vega", entrada:"08:00", salida:"-", estado:"Sin salida"},
]
const color:Record<string, any>={ Presente:"success", Tardanza:"warning", Falta:"danger", "Sin salida":"default"}

function VisualTable({data, onDetail}:{data:Row[]; onDetail:(r:Row)=>void}){
  const [sd,setSd]=useState<SortDescriptor>({column:"nombre", direction:"ascending"})
  const sorted=useMemo(()=>[...data].sort((a,b)=>{let c=String(a[sd.column as keyof Row]).localeCompare(String(b[sd.column as keyof Row])); if(sd.direction==="descending") c*=-1; return c;}),[sd, data])
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Asistencias visual" className="min-w-[640px]" sortDescriptor={sd} onSortChange={setSd} onRowAction={(k)=>{ const r=data.find(x=>String(x.id)===String(k)); if(r) onDetail(r)}}>
          <Table.Header>
            <Table.Column isRowHeader allowsSorting id="nombre">{({sortDirection})=><Table.SortableColumnHeader sortDirection={sortDirection}>Empleado</Table.SortableColumnHeader>}</Table.Column>
            <Table.Column id="entrada">Entrada</Table.Column>
            <Table.Column id="salida">Salida</Table.Column>
            <Table.Column allowsSorting id="estado">{({sortDirection})=><Table.SortableColumnHeader sortDirection={sortDirection}>Estado</Table.SortableColumnHeader>}</Table.Column>
          </Table.Header>
          <Table.Body>
            {sorted.map(r=>(
              <Table.Row key={r.id} id={r.id}>
                <Table.Cell className="font-medium">{r.nombre}</Table.Cell>
                <Table.Cell>{r.entrada}</Table.Cell>
                <Table.Cell>{r.salida}</Table.Cell>
                <Table.Cell><Chip size="sm" variant="soft" color={color[r.estado]}>{r.estado}{r.minutos?` ${r.minutos}m`:""}</Chip></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  )
}
function GestiónTable({data, onDetail, onEdit}:{data:Row[]; onDetail:(r:Row)=>void; onEdit:(r:Row)=>void}){
  const [sel,setSel]=useState<any>(new Set())
  const [sd,setSd]=useState<SortDescriptor>({column:"nombre", direction:"ascending"})
  const sorted=useMemo(()=>[...data].sort((a,b)=>{let c=String(a[sd.column as keyof Row]).localeCompare(String(b[sd.column as keyof Row])); if(sd.direction==="descending") c*=-1; return c;}),[sd, data])
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Asistencias editable" className="min-w-[720px]" selectedKeys={sel} selectionMode="multiple" sortDescriptor={sd} onSelectionChange={setSel} onSortChange={setSd} onRowAction={(k)=>{ const r=data.find(x=>String(x.id)===String(k)); if(r) onDetail(r)}}>
          <Table.Header>
            <Table.Column className="pe-0"><Checkbox aria-label="Select all" slot="selection"><Checkbox.Content><Checkbox.Control><Checkbox.Indicator/></Checkbox.Control></Checkbox.Content></Checkbox></Table.Column>
            <Table.Column allowsSorting id="nombre">{({sortDirection})=><Table.SortableColumnHeader sortDirection={sortDirection}>Empleado</Table.SortableColumnHeader>}</Table.Column>
            <Table.Column id="entrada">Entrada</Table.Column>
            <Table.Column id="salida">Salida</Table.Column>
            <Table.Column id="estado">Estado</Table.Column>
            <Table.Column className="text-end">Acciones</Table.Column>
          </Table.Header>
          <Table.Body>
            {sorted.map(r=>(
              <Table.Row key={r.id} id={r.id}>
                <Table.Cell className="pe-0"><Checkbox aria-label={r.nombre} slot="selection" variant="secondary"><Checkbox.Content><Checkbox.Control><Checkbox.Indicator/></Checkbox.Control></Checkbox.Content></Checkbox></Table.Cell>
                <Table.Cell className="font-medium">{r.nombre}</Table.Cell>
                <Table.Cell>{r.entrada}</Table.Cell>
                <Table.Cell>{r.salida}</Table.Cell>
                <Table.Cell><Chip size="sm" variant="soft" color={color[r.estado]}>{r.estado}</Chip></Table.Cell>
                <Table.Cell onClick={e=>e.stopPropagation()}><div className="flex gap-1"><Button isIconOnly size="sm" variant="tertiary" onPress={()=>onEdit(r)}><Pencil className="h-4 w-4"/></Button><Button isIconOnly size="sm" variant="danger-soft" ><Trash2 className="h-4 w-4"/></Button></div></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  )
}

export default function Page(){
  const [detail,setDetail]=useState<Row|null>(null)
  const [editRow,setEditRow]=useState<Row|null>(null)
  const [tab,setTab]=useState("visual")
  const [filterToday,setFilterToday]=useState(false)
  const filteredRows = filterToday ? rows.filter(r=> r.estado!=="Falta") : rows
  const handleExport=()=>{ const csv="Nombre,Entrada,Salida,Estado\n"+filteredRows.map(r=>`${r.nombre},${r.entrada},${r.salida},${r.estado}`).join("\n"); const blob=new Blob([csv],{type:"text/csv"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="asistencias.csv"; a.click(); URL.revokeObjectURL(url)}
  return <div className="space-y-6">
    <div className="flex justify-between flex-wrap gap-4"><div><Typography type="h2">Asistencias</Typography><Typography type="body-sm" className="text-muted">Control diario — compara hora registrada vs horario + tolerancia</Typography></div>
    <div className="flex gap-2"><button title="Filtra para ver solo registros de hoy (oculta faltas)" onClick={()=>setFilterToday(!filterToday)} className={`px-5 py-2.5 rounded-full text-sm flex items-center gap-2 ${filterToday?"bg-[#1F9A75] text-white":"bg-black dark:bg-white text-white dark:text-black"}`}><Clock className="h-4 w-4"/> {filterToday?"Ver todos":"Solo hoy: sin faltas"}</button><button onClick={handleExport} className="px-5 py-2.5 rounded-full border bg-zinc-100 dark:bg-zinc-900 dark:text-white text-sm flex items-center gap-2"><FileText className="h-4 w-4"/> Exportar</button></div></div>
    <div className="bg-zinc-100 dark:bg-zinc-900 border dark:border-white/10 rounded-2xl p-4 text-sm text-black/60 dark:text-white/60 space-y-1"><div className="flex items-center gap-2"><Clock className="h-4 w-4"/> Regla: la asistencia genera incidencia, no descuento automático.</div><p className="text-xs">Botón "Solo hoy: sin faltas" oculta las faltas para que veas solo quién asistió hoy. Útil para el parte diario del admin.</p></div>
    <Tabs selectedKey={tab} onSelectionChange={(k)=>setTab(String(k))}>
      <Tabs.ListContainer><Tabs.List aria-label="Asistencias tabs">
        <Tabs.Tab id="visual">Consulta<Tabs.Indicator/></Tabs.Tab>
        <Tabs.Tab id="editable">Gestión<Tabs.Indicator/></Tabs.Tab>
      </Tabs.List></Tabs.ListContainer>
      <Tabs.Panel id="visual" className="pt-4"><VisualTable data={filteredRows} onDetail={setDetail}/></Tabs.Panel>
      <Tabs.Panel id="editable" className="pt-4"><GestiónTable data={filteredRows} onDetail={setDetail} onEdit={setEditRow}/></Tabs.Panel>
    </Tabs>
      <Drawer open={!!detail} onOpenChange={(o)=> !o && setDetail(null)} direction="right"><DrawerContent><DrawerHeader><DrawerTitle>{detail?.nombre}</DrawerTitle><DrawerDescription>Consulta — solo visualización</DrawerDescription></DrawerHeader><div className="p-6 space-y-4"><div className="p-3 rounded-xl bg-[#1F9A75]/5 border border-[#1F9A75]/10 text-xs text-muted">Consulta rápida</div><div className="grid grid-cols-3 gap-3 text-sm"><div><p className="text-xs text-muted">Entrada</p><p className="font-mono">{detail?.entrada || "—"}</p></div><div><p className="text-xs text-muted">Salida</p><p className="font-mono">{detail?.salida || "—"}</p></div><div><p className="text-xs text-muted">Estado</p><p><Chip size="sm" variant="soft" color={color[detail?.estado || "Presente"]}>{detail?.estado}</Chip></p></div></div></div><DrawerFooter className="grid grid-cols-2 gap-3"><DrawerClose asChild><Button variant="outline" className="w-full">Cerrar</Button></DrawerClose></DrawerFooter></DrawerContent></Drawer>
      <Drawer open={!!editRow} onOpenChange={(o)=> !o && setEditRow(null)} direction="right"><DrawerContent><DrawerHeader><DrawerTitle>Editar asistencia - {editRow?.nombre}</DrawerTitle><DrawerDescription>Edita con auditoría</DrawerDescription></DrawerHeader><div className="p-6 space-y-4"><div className="p-3 rounded-xl bg-[#1F9A75]/10 border border-[#1F9A75]/20 text-xs text-muted">Se registra quién corrigió y motivo.</div><div className="grid grid-cols-2 gap-3"><TextField><Label>Entrada</Label><Input value={editRow?.entrada || ""} onChange={e=> setEditRow(prev=> prev? {...prev, entrada:(e.target as any).value}:null)} /></TextField><TextField><Label>Salida</Label><Input value={editRow?.salida || ""} onChange={e=> setEditRow(prev=> prev? {...prev, salida:(e.target as any).value}:null)} /></TextField></div><TextField><Label>Estado</Label><Input value={editRow?.estado || ""} onChange={e=> setEditRow(prev=> prev? {...prev, estado:(e.target as any).value as any}:null)} /></TextField><TextField><Label>Observación</Label><Input placeholder="Motivo (auditoría)" /></TextField></div><DrawerFooter className="grid grid-cols-2 gap-3"><DrawerClose asChild><Button variant="outline" className="w-full">Cancelar</Button></DrawerClose><Button onPress={()=>setEditRow(null)} className="w-full">Guardar</Button></DrawerFooter></DrawerContent></Drawer>
  </div>
}
