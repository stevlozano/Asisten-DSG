"use client"
import { useState, useMemo } from "react"
import { Table, Chip, Typography, Tabs, Avatar, Checkbox, Button, Modal, TextField, Label, Input } from "@heroui/react"

import { Pencil, Trash2 } from "lucide-react"
import type { SortDescriptor, Selection } from "@heroui/react"

type Row = { id:number; practicante:string; proyecto:string; avance:number; estado:"En desarrollo"|"En revisión"|"Finalizado"; vence:string; avatar:string }
const rows: Row[] = [
  {id:1, practicante:"José Ramos", proyecto:"Sistema de Inventario", avance:65, estado:"En desarrollo", vence:"20 sep 2026", avatar:"https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"},
  {id:2, practicante:"Ana Torres", proyecto:"Landing Corporativa", avance:90, estado:"En revisión", vence:"10 sep 2026", avatar:"https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg"},
  {id:3, practicante:"Diego Ruiz", proyecto:"Módulo Reportes", avance:40, estado:"En desarrollo", vence:"30 sep 2026", avatar:"https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg"},
]
const color:Record<string,any>={ "En desarrollo":"warning", "En revisión":"accent", "Finalizado":"success"}

function Visual({data}:{data:Row[]}){
  const [sd,setSd]=useState<SortDescriptor>({column:"practicante", direction:"ascending"})
  const sorted=useMemo(()=>[...data].sort((a,b)=>{let c=String(a[sd.column as keyof Row]).localeCompare(String(b[sd.column as keyof Row])); if(sd.direction==="descending") c*=-1; return c}),[sd, data])
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Seguimiento visual" className="min-w-[680px]" sortDescriptor={sd} onSortChange={setSd}>
          <Table.Header>
            <Table.Column isRowHeader allowsSorting id="practicante">{({sortDirection})=><Table.SortableColumnHeader sortDirection={sortDirection}>Practicante</Table.SortableColumnHeader>}</Table.Column>
            <Table.Column id="proyecto">Proyecto</Table.Column>
            <Table.Column id="avance">Avance</Table.Column>
            <Table.Column allowsSorting id="estado">{({sortDirection})=><Table.SortableColumnHeader sortDirection={sortDirection}>Estado</Table.SortableColumnHeader>}</Table.Column>
            <Table.Column id="vence">Vence</Table.Column>
          </Table.Header>
          <Table.Body>
            {sorted.map(r=>(
              <Table.Row key={r.id} id={r.id}>
                <Table.Cell><div className="flex items-center gap-2"><Avatar size="sm"><Avatar.Image src={r.avatar}/><Avatar.Fallback>{r.practicante[0]}</Avatar.Fallback></Avatar>{r.practicante}</div></Table.Cell>
                <Table.Cell>{r.proyecto}</Table.Cell>
                <Table.Cell><div className="flex items-center gap-2"><div className="h-2 w-20 bg-black/10 rounded-full"><div className="h-2 bg-black rounded-full" style={{width:r.avance+"%"}}/></div><span className="text-xs">{r.avance}%</span></div></Table.Cell>
                <Table.Cell><Chip size="sm" variant="soft" color={color[r.estado]}>{r.estado}</Chip></Table.Cell>
                <Table.Cell className="text-sm text-muted">{r.vence}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  )
}
function Gestión({data, onEdit}:{data:Row[]; onEdit:(r:Row)=>void}){
  const [sel,setSel]=useState<Selection>(new Set())
  const [sd,setSd]=useState<SortDescriptor>({column:"practicante", direction:"ascending"})
  const sorted=useMemo(()=>[...data].sort((a,b)=>{let c=String(a[sd.column as keyof Row]).localeCompare(String(b[sd.column as keyof Row])); if(sd.direction==="descending") c*=-1; return c}),[sd, data])
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Seguimiento editable" className="min-w-[820px]" selectedKeys={sel} selectionMode="multiple" sortDescriptor={sd} onSelectionChange={setSel} onSortChange={setSd}>
          <Table.Header>
            <Table.Column className="pe-0"><Checkbox aria-label="Select all" slot="selection"><Checkbox.Content><Checkbox.Control><Checkbox.Indicator/></Checkbox.Control></Checkbox.Content></Checkbox></Table.Column>
            <Table.Column isRowHeader allowsSorting id="practicante">{({sortDirection})=><Table.SortableColumnHeader sortDirection={sortDirection}>Practicante</Table.SortableColumnHeader>}</Table.Column>
            <Table.Column id="proyecto">Proyecto</Table.Column>
            <Table.Column id="avance">Avance</Table.Column>
            <Table.Column id="estado">Estado</Table.Column>
            <Table.Column className="text-end">Acciones</Table.Column>
          </Table.Header>
          <Table.Body>
            {sorted.map(r=>(
              <Table.Row key={r.id} id={r.id}>
                <Table.Cell className="pe-0"><Checkbox aria-label={r.practicante} slot="selection" variant="secondary"><Checkbox.Content><Checkbox.Control><Checkbox.Indicator/></Checkbox.Control></Checkbox.Content></Checkbox></Table.Cell>
                <Table.Cell><div className="flex items-center gap-2"><Avatar size="sm"><Avatar.Image src={r.avatar}/><Avatar.Fallback>{r.practicante[0]}</Avatar.Fallback></Avatar>{r.practicante}</div></Table.Cell>
                <Table.Cell>{r.proyecto}</Table.Cell>
                <Table.Cell>{r.avance}%</Table.Cell>
                <Table.Cell><Chip size="sm" variant="soft" color={color[r.estado]}>{r.estado}</Chip></Table.Cell>
                <Table.Cell><div className="flex gap-1"><Button isIconOnly size="sm" variant="tertiary" onPress={()=>onEdit(r)}><Pencil className="h-4 w-4"/></Button><Button isIconOnly size="sm" variant="danger-soft" onPress={()=>{ if(confirm(`¿Eliminar seguimiento de ${r.practicante}?`)) alert("Eliminado")}}><Trash2 className="h-4 w-4"/></Button></div></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  )
}
export default function Page(){
  const [editRow,setEditRow]=useState<Row|null>(null)
  return <div className="space-y-6">
    <div><Typography type="h2">Seguimiento</Typography><Typography type="body-sm" className="text-muted">Avance de practicantes y proyectos — DSG</Typography></div>
    <Tabs>
      <Tabs.ListContainer><Tabs.List aria-label="Seguimiento">
        <Tabs.Tab id="visual">Seguimiento<Tabs.Indicator/></Tabs.Tab>
        <Tabs.Tab id="editable">Gestión<Tabs.Indicator/></Tabs.Tab>
      </Tabs.List></Tabs.ListContainer>
      <Tabs.Panel id="visual" className="pt-4"><Visual data={rows}/></Tabs.Panel>
      <Tabs.Panel id="editable" className="pt-4"><Gestión data={rows} onEdit={setEditRow}/></Tabs.Panel>
    </Tabs>
      <Modal isOpen={!!editRow} onOpenChange={(o)=> !o && setEditRow(null)}><Modal.Backdrop><Modal.Container size="md"><Modal.Dialog><Modal.CloseTrigger/><Modal.Header><Modal.Heading>Editar seguimiento — {editRow?.practicante}</Modal.Heading></Modal.Header><Modal.Body><div className="space-y-4"><TextField><Label>Proyecto</Label><Input value={editRow?.proyecto || ""} onChange={e=> setEditRow(prev=> prev? {...prev, proyecto:(e.target as HTMLInputElement).value}:null)} /></TextField><TextField><Label>Avance (%)</Label><Input type="number" value={String(editRow?.avance || "")} onChange={e=> setEditRow(prev=> prev? {...prev, avance: Number((e.target as HTMLInputElement).value)}:null)} /></TextField><TextField><Label>Estado</Label><Input value={editRow?.estado || ""} onChange={e=> setEditRow(prev=> prev? {...prev, estado:(e.target as HTMLInputElement).value as any}:null)} /></TextField></div></Modal.Body><Modal.Footer><Button slot="close" variant="secondary">Cancelar</Button><Button slot="close">Guardar</Button></Modal.Footer></Modal.Dialog></Modal.Container></Modal.Backdrop></Modal>
  </div>
}
