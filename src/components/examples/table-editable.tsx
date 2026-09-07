"use client";
import type {Selection, SortDescriptor} from "@heroui/react";
import {Avatar, Button, Checkbox, Chip, Table, Modal, TextField, Label, Input} from "@heroui/react";
import {Pencil, UserX, GraduationCap} from "lucide-react";
import {useMemo, useState} from "react";
interface Persona { id:number; nombre:string; tipo:"Empleado"|"Practicante"; area:string; cargo:string; horario:string; estado:"Activo"|"Inactivo"; avatar:string; }
const defaultPersonas: Persona[] = [
  {id:1, nombre:"Carlos Mendoza", tipo:"Empleado", area:"Desarrollo", cargo:"Desarrollador", horario:"08:00-17:00", estado:"Activo", avatar:"https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg"},
  {id:2, nombre:"María López", tipo:"Empleado", area:"RR.HH.", cargo:"Analista", horario:"08:00-17:00", estado:"Activo", avatar:"https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg"},
  {id:3, nombre:"José Ramos", tipo:"Practicante", area:"Desarrollo", cargo:"Ing. Sistemas", horario:"09:00-15:00", estado:"Activo", avatar:"https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"},
  {id:4, nombre:"Ana Torres", tipo:"Practicante", area:"Marketing", cargo:"Diseño", horario:"09:00-15:00", estado:"Activo", avatar:"https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg"},
  {id:5, nombre:"Lucía Vega", tipo:"Empleado", area:"Contabilidad", cargo:"Contadora", horario:"08:00-17:00", estado:"Inactivo", avatar:"https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg"},
];
export function CustomCells({data}:{data?:Persona[]}){
  const [sel,setSel]=useState<Selection>(new Set());
  const [sd,setSd]=useState<SortDescriptor>({column:"nombre", direction:"ascending"});
  const [edit,setEdit]=useState<Persona|null>(null)
  const [motivo,setMotivo]=useState("")
  const [target,setTarget]=useState<Persona|null>(null)
  const source=data !== undefined ? data : defaultPersonas
  const sorted=useMemo(()=>[...source].sort((a,b)=>{let c=String(a[sd.column as keyof Persona]).localeCompare(String(b[sd.column as keyof Persona])); if(sd.direction==="descending") c*=-1; return c;}),[sd]);
  return (
    <>
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Personal editable" className="min-w-[820px]" selectedKeys={sel} selectionMode="multiple" sortDescriptor={sd} onSelectionChange={setSel} onSortChange={setSd}>
          <Table.Header>
            <Table.Column className="pe-0"><Checkbox aria-label="Select all" slot="selection"><Checkbox.Content><Checkbox.Control><Checkbox.Indicator/></Checkbox.Control></Checkbox.Content></Checkbox></Table.Column>
            <Table.Column isRowHeader allowsSorting id="nombre">{({sortDirection})=><Table.SortableColumnHeader sortDirection={sortDirection}>Nombre</Table.SortableColumnHeader>}</Table.Column>
            <Table.Column allowsSorting id="tipo">{({sortDirection})=><Table.SortableColumnHeader sortDirection={sortDirection}>Tipo</Table.SortableColumnHeader>}</Table.Column>
            <Table.Column id="area">Área</Table.Column>
            <Table.Column id="cargo">Cargo / Carrera</Table.Column>
            <Table.Column id="horario">Horario</Table.Column>
            <Table.Column id="estado">Estado</Table.Column>
            <Table.Column className="text-end">Acciones</Table.Column>
          </Table.Header>
          <Table.Body>
            {sorted.map(u=>(
              <Table.Row key={u.id} id={u.id}>
                <Table.Cell className="pe-0"><Checkbox aria-label={u.nombre} slot="selection" variant="secondary"><Checkbox.Content><Checkbox.Control><Checkbox.Indicator/></Checkbox.Control></Checkbox.Content></Checkbox></Table.Cell>
                <Table.Cell><div className="flex items-center gap-3"><Avatar size="sm"><Avatar.Image src={u.avatar}/><Avatar.Fallback>{u.nombre.split(" ").map(n=>n[0]).join("")}</Avatar.Fallback></Avatar><span className="text-sm font-medium">{u.nombre}</span></div></Table.Cell>
                <Table.Cell><Chip size="sm" variant="soft" color={u.tipo==="Empleado"?"accent":"warning"}>{u.tipo}</Chip></Table.Cell>
                <Table.Cell>{u.area}</Table.Cell>
                <Table.Cell>{u.cargo}</Table.Cell>
                <Table.Cell className="text-xs">{u.horario}</Table.Cell>
                <Table.Cell><Chip size="sm" variant="soft" color={u.estado==="Activo"?"success":"danger"}>{u.estado}</Chip></Table.Cell>
                <Table.Cell>
                  <div className="flex gap-1">
                    <Button isIconOnly size="sm" variant="tertiary" onPress={()=>setEdit(u)}><Pencil className="h-4 w-4"/></Button>
                    {u.tipo==="Empleado" ? (
                      <Button isIconOnly size="sm" variant="danger-soft" onPress={()=>setTarget(u)}><UserX className="h-4 w-4"/></Button>
                    ) : (
                      <Button isIconOnly size="sm" variant="danger-soft" onPress={()=>setTarget(u)}><GraduationCap className="h-4 w-4"/></Button>
                    )}
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
    <Modal isOpen={!!edit} onOpenChange={(o)=> !o && setEdit(null)}>
      <Modal.Backdrop><Modal.Container size="md"><Modal.Dialog><Modal.CloseTrigger/><Modal.Header><Modal.Heading>Editar {edit?.nombre}</Modal.Heading></Modal.Header><Modal.Body><div className="space-y-4"><div className="grid grid-cols-2 gap-3"><TextField><Label>Nombre</Label><Input value={edit?.nombre || ""} onChange={e=> setEdit(prev=> prev? {...prev, nombre:(e.target as any).value}:null)} /></TextField><TextField><Label>Tipo</Label><Input value={edit?.tipo || ""} readOnly /></TextField></div><TextField><Label>Área</Label><Input value={edit?.area || ""} onChange={e=> setEdit(prev=> prev? {...prev, area:(e.target as any).value}:null)} /></TextField><TextField><Label>Cargo / Carrera</Label><Input value={edit?.cargo || ""} onChange={e=> setEdit(prev=> prev? {...prev, cargo:(e.target as any).value}:null)} /></TextField><TextField><Label>Horario</Label><Input value={edit?.horario || ""} onChange={e=> setEdit(prev=> prev? {...prev, horario:(e.target as any).value}:null)} /></TextField><div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 space-y-2"><p className="text-xs font-semibold">ACCESO</p><TextField><Label>Gmail</Label><Input value={`${(edit?.nombre||"").toLowerCase().replace(/\s+/g,".")}@dsg.pe`} readOnly /></TextField><TextField><Label>Nueva contraseña</Label><Input placeholder="Dejar vacío para no cambiar" type="password" /></TextField></div></div></Modal.Body><Modal.Footer><Button slot="close" variant="secondary">Cancelar</Button><Button slot="close">Guardar</Button></Modal.Footer></Modal.Dialog></Modal.Container></Modal.Backdrop>
    </Modal>
    <Modal isOpen={!!target} onOpenChange={(o)=> !o && setTarget(null)}>
      <Modal.Backdrop><Modal.Container size="md"><Modal.Dialog><Modal.CloseTrigger/><Modal.Header><Modal.Heading>{target?.tipo==="Empleado"?"Despedir empleado":"Dar de baja practicante"} — {target?.nombre}</Modal.Heading><p className="text-sm text-muted">Indica el motivo (auditoría).</p></Modal.Header><Modal.Body><TextField><Label>Motivo</Label><Input value={motivo} onChange={e=>setMotivo((e.target as HTMLInputElement).value)} placeholder={target?.tipo==="Empleado"?"Ej. Incumplimiento":"Ej. Fin de prácticas, bajo rendimiento"} /></TextField></Modal.Body><Modal.Footer><Button slot="close" variant="secondary">Cancelar</Button><Button onPress={()=>{ setTarget(null); setMotivo("")}} variant="danger">{target?.tipo==="Empleado"?"Despedir":"Dar de baja"}</Button></Modal.Footer></Modal.Dialog></Modal.Container></Modal.Backdrop>
    </Modal>
    </>
  );
}
