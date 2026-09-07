"use client"
import { useState } from "react"
import { Typography, Chip, Table } from "@heroui/react"
import { Button } from "@heroui/react"
import { Button as UIButton } from "@/components/ui/button"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { TextField, Label, Input } from "@heroui/react"
import { Plus, Pencil, Trash2 } from "lucide-react"

type Horario = { id:number; nombre:string; dias:string; entrada:string; salida:string; tolerancia:number; estado:"Activo"|"Inactivo" }
const initial: Horario[] = [
  {id:1, nombre:"Horario Oficina", dias:"Lun - Vie", entrada:"08:00", salida:"17:00", tolerancia:10, estado:"Activo"},
  {id:2, nombre:"Horario Practicantes", dias:"Lun - Vie", entrada:"09:00", salida:"15:00", tolerancia:5, estado:"Activo"},
]

export default function Page(){
  const [rows,setRows]=useState<Horario[]>(initial)
  const [editing,setEditing]=useState<Horario|null>(null)
  const [form,setForm]=useState({nombre:"", dias:"Lun - Vie", entrada:"08:00", salida:"17:00", tolerancia:"10"})
  const [open,setOpen]=useState(false)
  const [selected,setSelected]=useState("asap")
  const isMobile = false
  const openNew=()=>{ setEditing(null); setForm({nombre:"", dias:"Lun - Vie", entrada:"08:00", salida:"17:00", tolerancia:"10"}); setOpen(true)}
  const openEdit=(r:Horario)=>{ setEditing(r); setForm({nombre:r.nombre, dias:r.dias, entrada:r.entrada, salida:r.salida, tolerancia:String(r.tolerancia)}); setOpen(true)}
  const save=()=>{
    if(!form.nombre) return
    if(editing) setRows(rows.map(r=> r.id===editing.id ? {...r, ...form, tolerancia:Number(form.tolerancia)}:r))
    else setRows([...rows, {id:Date.now(), nombre:form.nombre, dias:form.dias, entrada:form.entrada, salida:form.salida, tolerancia:Number(form.tolerancia), estado:"Activo"}])
    setOpen(false)
    toast(editing?"Horario actualizado":"Horario creado", {description: form.nombre})
  }
  const del=(id:number)=> setRows(rows.filter(r=>r.id!==id))
  return <div className="space-y-6">
    <div className="flex justify-between flex-wrap gap-4"><div><Typography type="h2">Horarios</Typography><Typography type="body-sm" className="text-muted">Turnos y tolerancias</Typography></div>
      <Drawer open={open} onOpenChange={setOpen} direction="right">
        <DrawerTrigger asChild><Button className="rounded-full"><Plus className="h-4 w-4"/> Crear horario</Button></DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{editing?"Editar horario":"Crear horario"}</DrawerTitle>
            <DrawerDescription>{editing?"Actualiza los datos del turno":"Completa los datos del nuevo turno. El horario se aplicará según la tolerancia."}</DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 scroll-fade overflow-y-auto p-6 space-y-6">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#1F9A75]/5 border border-[#1F9A75]/10">
                <p className="text-xs font-semibold tracking-widest text-[#1F9A75]">NUEVO HORARIO</p>
                <p className="text-sm text-muted mt-1">Define jornada y tolerancia para cálculo de tardanzas.</p>
              </div>
              <div className="space-y-3">
                <TextField><Label>Nombre</Label><Input value={form.nombre} onChange={e=>setForm({...form, nombre:(e.target as any).value})} placeholder="Ej. Horario Oficina" className="rounded-xl" /></TextField>
                <TextField><Label>Días laborales</Label><Input value={form.dias} onChange={e=>setForm({...form, dias:(e.target as any).value})} className="rounded-xl" /></TextField>
                <div className="grid grid-cols-2 gap-3">
                  <TextField><Label>Entrada</Label><Input type="time" value={form.entrada} onChange={e=>setForm({...form, entrada:(e.target as any).value})} className="rounded-xl" /></TextField>
                  <TextField><Label>Salida</Label><Input type="time" value={form.salida} onChange={e=>setForm({...form, salida:(e.target as any).value})} className="rounded-xl" /></TextField>
                </div>
                <TextField><Label>Tolerancia (min)</Label><Input type="number" value={form.tolerancia} onChange={e=>setForm({...form, tolerancia:(e.target as any).value})} className="rounded-xl" /></TextField>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Horarios existentes</p>
              <RadioGroup value={selected} onValueChange={setSelected} className="gap-2">
                {rows.map((r)=>(
                  <FieldLabel key={r.id} htmlFor={`horario-${r.id}`}>
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle className="flex items-center gap-2">{r.nombre} {r.tolerancia===10 ? <Badge variant="secondary">Estándar</Badge> : null}</FieldTitle>
                        <FieldDescription>{r.dias} · {r.entrada} - {r.salida} · Tol. {r.tolerancia}m</FieldDescription>
                      </FieldContent>
                      <RadioGroupItem value={String(r.id)} id={`horario-${r.id}`} />
                    </Field>
                  </FieldLabel>
                ))}
              </RadioGroup>
            </div>
          </div>
          <DrawerFooter className="grid grid-cols-2 gap-3">
            <DrawerClose asChild><Button variant="outline" className="w-full">Cancelar</Button></DrawerClose>
            <Button onClick={save} className="w-full h-[34px]">{editing?"Guardar":"Crear"}</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
    <div className="overflow-x-auto"><Table><Table.ScrollContainer><Table.Content aria-label="Horarios" className="min-w-[720px]"><Table.Header><Table.Column isRowHeader>Nombre</Table.Column><Table.Column>Días</Table.Column><Table.Column>Horario</Table.Column><Table.Column>Tolerancia</Table.Column><Table.Column>Estado</Table.Column><Table.Column className="text-end">Acciones</Table.Column></Table.Header><Table.Body>{rows.map(r=>(<Table.Row key={r.id} id={r.id}><Table.Cell className="font-medium">{r.nombre}</Table.Cell><Table.Cell>{r.dias}</Table.Cell><Table.Cell className="font-mono text-sm">{r.entrada} - {r.salida}</Table.Cell><Table.Cell><Chip size="sm" variant="soft">{r.tolerancia}m</Chip></Table.Cell><Table.Cell><Chip size="sm" variant="soft" color="success">{r.estado}</Chip></Table.Cell><Table.Cell><div className="flex gap-1 justify-end"><Button isIconOnly size="sm" variant="tertiary" onPress={()=>openEdit(r)}><Pencil className="h-4 w-4"/></Button><Button isIconOnly size="sm" variant="danger-soft" onPress={()=>del(r.id)}><Trash2 className="h-4 w-4"/></Button></div></Table.Cell></Table.Row>))}</Table.Body></Table.Content></Table.ScrollContainer></Table></div>
  </div>
}
