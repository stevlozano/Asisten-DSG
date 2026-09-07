"use client"
import { useState, useMemo } from "react"
import { Chip, Table, Tabs, Typography, Button } from "@heroui/react"
import { ActionMenu } from "@/components/shared/ActionMenu"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { Icon } from "@iconify/react"
import type { SortDescriptor, Selection } from "@heroui/react"
import { Checkbox, Avatar } from "@heroui/react"

type Inc = { id:number; nombre:string; tipo:"Tardanza"|"Falta"|"Sin marcación"|"Salida anticipada"; fecha:string; estado:"Pendiente"|"Justificada"|"Rechazada"; avatar:string; detalle:string }
const data: Inc[] = [
  {id:1, nombre:"José Ramos", tipo:"Tardanza", fecha:"04/09/2026 08:17", estado:"Pendiente", avatar:"https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg", detalle:"17 min · 08:17 vs 08:00"},
  {id:2, nombre:"Ana Torres", tipo:"Sin marcación", fecha:"03/09/2026", estado:"Pendiente", avatar:"https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg", detalle:"No registró salida"},
  {id:3, nombre:"Diego Ruiz", tipo:"Salida anticipada", fecha:"02/09/2026 14:30", estado:"Justificada", avatar:"https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg", detalle:"Permiso médico"},
  {id:4, nombre:"Carlos Mendoza", tipo:"Falta", fecha:"01/09/2026", estado:"Rechazada", avatar:"https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg", detalle:"Sin justificación"},
]
const colorTipo:Record<string,any>={ Tardanza:"warning", Falta:"danger", "Sin marcación":"default", "Salida anticipada":"accent"}
const colorEstado:Record<string,any>={ Pendiente:"warning", Justificada:"success", Rechazada:"danger"}

function Visual({rows}:{rows:Inc[]}){
  const [sd,setSd]=useState<SortDescriptor>({column:"nombre", direction:"ascending"})
  const sorted=useMemo(()=>[...rows].sort((a,b)=>{let c=String(a[sd.column as keyof Inc]).localeCompare(String(b[sd.column as keyof Inc])); if(sd.direction==="descending") c*=-1; return c}),[sd, rows])
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Incidencias visual" className="min-w-[720px]" sortDescriptor={sd} onSortChange={setSd}>
          <Table.Header>
            <Table.Column isRowHeader allowsSorting id="nombre">{({sortDirection})=><Table.SortableColumnHeader sortDirection={sortDirection}>Empleado</Table.SortableColumnHeader>}</Table.Column>
            <Table.Column id="tipo">Tipo</Table.Column>
            <Table.Column id="fecha">Fecha</Table.Column>
            <Table.Column id="detalle">Detalle</Table.Column>
            <Table.Column allowsSorting id="estado">{({sortDirection})=><Table.SortableColumnHeader sortDirection={sortDirection}>Estado</Table.SortableColumnHeader>}</Table.Column>
          </Table.Header>
          <Table.Body>
            {sorted.map(r=>(
              <Table.Row key={r.id} id={r.id}>
                <Table.Cell className="font-medium">{r.nombre}</Table.Cell>
                <Table.Cell><Chip size="sm" variant="soft" color={colorTipo[r.tipo]}>{r.tipo}</Chip></Table.Cell>
                <Table.Cell className="text-sm text-muted">{r.fecha}</Table.Cell>
                <Table.Cell className="text-sm">{r.detalle}</Table.Cell>
                <Table.Cell><Chip size="sm" variant="soft" color={colorEstado[r.estado]}>{r.estado}</Chip></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  )
}
function Editable({rows}:{rows:Inc[]}){
  const [sel,setSel]=useState<Selection>(new Set())
  const [sd,setSd]=useState<SortDescriptor>({column:"nombre", direction:"ascending"})
  const sorted=useMemo(()=>[...rows].sort((a,b)=>{let c=String(a[sd.column as keyof Inc]).localeCompare(String(b[sd.column as keyof Inc])); if(sd.direction==="descending") c*=-1; return c}),[sd, rows])
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Incidencias editable" className="min-w-[840px]" selectedKeys={sel} selectionMode="multiple" sortDescriptor={sd} onSelectionChange={setSel} onSortChange={setSd}>
          <Table.Header>
            <Table.Column className="pe-0"><Checkbox aria-label="Select all" slot="selection"><Checkbox.Content><Checkbox.Control><Checkbox.Indicator/></Checkbox.Control></Checkbox.Content></Checkbox></Table.Column>
            <Table.Column allowsSorting id="nombre">{({sortDirection})=><Table.SortableColumnHeader sortDirection={sortDirection}>Empleado</Table.SortableColumnHeader>}</Table.Column>
            <Table.Column id="tipo">Tipo</Table.Column>
            <Table.Column id="fecha">Fecha</Table.Column>
            <Table.Column id="estado">Estado</Table.Column>
            <Table.Column className="text-end">Acciones</Table.Column>
          </Table.Header>
          <Table.Body>
            {sorted.map(r=>(
              <Table.Row key={r.id} id={r.id}>
                <Table.Cell className="pe-0"><Checkbox aria-label={r.nombre} slot="selection" variant="secondary"><Checkbox.Content><Checkbox.Control><Checkbox.Indicator/></Checkbox.Control></Checkbox.Content></Checkbox></Table.Cell>
                <Table.Cell><div className="flex items-center gap-2"><Avatar size="sm"><Avatar.Image src={r.avatar}/><Avatar.Fallback>{r.nombre[0]}</Avatar.Fallback></Avatar>{r.nombre}</div></Table.Cell>
                <Table.Cell><Chip size="sm" variant="soft" color={colorTipo[r.tipo]}>{r.tipo}</Chip></Table.Cell>
                <Table.Cell className="text-sm text-muted">{r.fecha}</Table.Cell>
                <Table.Cell><Chip size="sm" variant="soft" color={colorEstado[r.estado]}>{r.estado}</Chip></Table.Cell>
                <Table.Cell><div className="flex gap-1"><Button isIconOnly size="sm" variant="tertiary"><Icon icon="gravity-ui:eye" className="size-4"/></Button><Button isIconOnly size="sm" variant="tertiary"><Icon icon="gravity-ui:pencil" className="size-4"/></Button><Button isIconOnly size="sm" variant="danger-soft"><Icon icon="gravity-ui:trash-bin" className="size-4"/></Button></div></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  )
}
export default function Page(){
  return <div className="space-y-6">
    <div><Typography type="h2">Incidencias</Typography><Typography type="body-sm" className="text-muted">Tardanzas, faltas y justificaciones — DSG</Typography></div>
    <Tabs>
      <Tabs.ListContainer><Tabs.List aria-label="Incidencias">
        <Tabs.Tab id="visual">Solo visualización<Tabs.Indicator/></Tabs.Tab>
        <Tabs.Tab id="editable">Editable<Tabs.Indicator/></Tabs.Tab>
      </Tabs.List></Tabs.ListContainer>
      <Tabs.Panel id="visual" className="pt-4"><Visual rows={data}/></Tabs.Panel>
      <Tabs.Panel id="editable" className="pt-4"><Editable rows={data}/></Tabs.Panel>
    </Tabs>
  </div>
}
