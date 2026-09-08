"use client"
import { useState, useEffect } from "react"
import { Typography, Tabs, Chip, Avatar, Separator, Table, Button, TextField, Label, Input } from "@heroui/react"
import { Person } from "@gravity-ui/icons"
import { Users, Shield, LayoutGrid, Clock, Bell } from "lucide-react"
const modules = [
  {key:"asistencias", label:"Asistencias", desc:"Registro de entradas y salidas", on:true},
  {key:"horarios", label:"Horarios", desc:"Turnos y tolerancias", on:true},
  {key:"incidencias", label:"Incidencias", desc:"Tardanzas y faltas", on:true},
  {key:"practicantes", label:"Practicantes", desc:"Gestión de practicantes", on:true},
  {key:"proyectos", label:"Proyectos", desc:"Proyectos de practicantes", on:true},
  {key:"seguimiento", label:"Seguimiento", desc:"Avance y entregables", on:true},
  {key:"reportes", label:"Reportes", desc:"Exportación PDF/Excel", on:true},
]
function EmpresaForm({edit}:{edit:boolean}){
  const [form,setForm]=useState({ruc:"20601234567", direccion:"Av. Javier Prado 123", telefono:"+51 999 999 999", email:"info@dsg.pe", horario:"08:00 - 17:00", tolerancia:"10", notif:true})
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <TextField><Label>RUC</Label><Input value={form.ruc} onChange={e=>setForm({...form, ruc:(e.target as HTMLInputElement).value})} /></TextField>
        <TextField><Label>Email</Label><Input value={form.email} onChange={e=>setForm({...form, email:(e.target as HTMLInputElement).value})} /></TextField>
        <TextField><Label>Dirección</Label><Input value={form.direccion} onChange={e=>setForm({...form, direccion:(e.target as HTMLInputElement).value})} /></TextField>
        <TextField><Label>Teléfono</Label><Input value={form.telefono} onChange={e=>setForm({...form, telefono:(e.target as HTMLInputElement).value})} /></TextField>
        <TextField><Label>Horario</Label><Input value={form.horario} onChange={e=>setForm({...form, horario:(e.target as HTMLInputElement).value})} /></TextField>
        <TextField><Label>Tolerancia (min)</Label><Input type="number" value={form.tolerancia} onChange={e=>setForm({...form, tolerancia:(e.target as HTMLInputElement).value})} /></TextField>
      </div>
      <div className="flex items-center justify-between p-3 rounded-xl bg-black/[0.03] dark:bg-white/5">
        <span className="text-sm flex items-center gap-2"><Bell className="h-4 w-4"/>Notificaciones</span>
        {edit ? <div className={`w-11 h-6 rounded-full p-1 cursor-pointer ${form.notif?"bg-black dark:bg-white":"bg-black/15"}`} onClick={()=>setForm({...form, notif:!form.notif})}><div className={`h-4 w-4 rounded-full bg-zinc-100 dark:bg-zinc-900 transition-transform ${form.notif?"translate-x-5":""}`}/></div> : <Chip size="sm" color={form.notif?"success":"default"} variant="soft">{form.notif?"Activas":"Inactivas"}</Chip>}
      </div>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Empresa detalle" className="min-w-[520px]">
            <Table.Header><Table.Column isRowHeader>Campo</Table.Column><Table.Column>Valor</Table.Column><Table.Column>Estado</Table.Column></Table.Header>
            <Table.Body>
              <Table.Row id="1"><Table.Cell>RUC</Table.Cell><Table.Cell>{form.ruc}</Table.Cell><Table.Cell><Chip size="sm" color="success" variant="soft">Válido</Chip></Table.Cell></Table.Row>
              <Table.Row id="2"><Table.Cell>Dirección</Table.Cell><Table.Cell>{form.direccion}</Table.Cell><Table.Cell><Chip size="sm" variant="soft">—</Chip></Table.Cell></Table.Row>
              <Table.Row id="3"><Table.Cell>Horario</Table.Cell><Table.Cell>{form.horario} · Tol. {form.tolerancia}m</Table.Cell><Table.Cell><Chip size="sm" color="success" variant="soft">Activo</Chip></Table.Cell></Table.Row>
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  )
}
export default function Page(){
  const [mods,setMods]=useState(modules)
  const [empresaEdit,setEmpresaEdit]=useState(false)
  const [isDev,setIsDev]=useState(false)
  useEffect(()=>{ try{ const a=JSON.parse(localStorage.getItem("asisten-auth")||"{}"); if(a.rol==="dev") setIsDev(true)}catch{}},[])
  const toggle=(k:string)=> setMods(m=>m.map(x=> x.key===k ? {...x, on:!x.on}:x))
  return <div className="space-y-6"><div><Typography type="h2">Configuración {isDev && <Chip size="sm" color="accent" variant="soft">DEV — Global</Chip>}</Typography><Typography type="body-sm" className="text-muted">{isDev ? "Configuración global del sistema — todas las empresas" : "Empresa, módulos y cuentas — DSG PERU TECHNOLOGY SAC"}</Typography></div>
  <Tabs><Tabs.ListContainer><Tabs.List aria-label="Config"><Tabs.Tab id="empresa">Empresa<Tabs.Indicator/></Tabs.Tab><Tabs.Tab id="modulos">Módulos<Tabs.Indicator/></Tabs.Tab><Tabs.Tab id="usuarios">Usuarios<Tabs.Indicator/></Tabs.Tab><Tabs.Tab id="roles">Roles<Tabs.Indicator/></Tabs.Tab></Tabs.List></Tabs.ListContainer>
  <Tabs.Panel id="empresa" className="pt-4"><div className="bg-zinc-100 dark:bg-zinc-900 border dark:border-white/10 rounded-2xl p-6 space-y-4"><div className="flex items-center gap-4"><div className="h-14 w-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black grid place-items-center font-black">DSG</div><div><Typography type="h6">DSG PERU TECHNOLOGY SAC</Typography><Typography type="body-xs" className="text-muted">RUC 2060 • Lima • info@dsg.pe</Typography></div><Chip size="sm" color="success" variant="soft" className="ml-auto">Activa</Chip><Button size="sm" variant="secondary" onPress={()=>setEmpresaEdit(!empresaEdit)}>{empresaEdit?"Cancelar":"Editar"}</Button></div><Separator/><EmpresaForm edit={empresaEdit}/></div></Tabs.Panel>
  <Tabs.Panel id="modulos" className="pt-4"><div className="bg-zinc-100 dark:bg-zinc-900 border dark:border-white/10 rounded-2xl p-6"><div className="flex justify-between mb-3"><Typography type="h6" className="flex gap-2 items-center"><LayoutGrid className="h-4 w-4"/>Módulos</Typography><span className="text-xs text-muted">{mods.filter(m=>m.on).length}/{mods.length} activos</span></div>{mods.map(m=>(<div key={m.key} onClick={()=>toggle(m.key)} className="flex justify-between p-3 border-b cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 rounded-xl"><span className="text-sm">{m.label}</span><Chip size="sm" color={m.on?"success":"default"} variant="soft">{m.on?"ON":"OFF"}</Chip></div>))}</div></Tabs.Panel>
  <Tabs.Panel id="usuarios" className="pt-4"><div className="bg-zinc-100 dark:bg-zinc-900 border dark:border-white/10 rounded-2xl p-4"><Typography type="h6" className="mb-3 flex gap-2 items-center"><Users className="h-4 w-4"/>Usuarios</Typography><Table><Table.ScrollContainer><Table.Content aria-label="Usuarios" className="min-w-[520px]"><Table.Header><Table.Column isRowHeader>Usuario</Table.Column><Table.Column>Rol</Table.Column><Table.Column>Estado</Table.Column></Table.Header><Table.Body><Table.Row id="1"><Table.Cell><div className="flex gap-2 items-center"><Avatar size="sm"><Avatar.Image src="https://img.heroui.chat/image/avatar?w=400&h=400&u=16"/><Avatar.Fallback><Person/></Avatar.Fallback></Avatar>Ing. Omar</div></Table.Cell><Table.Cell>Administrador</Table.Cell><Table.Cell><Chip size="sm" color="success" variant="soft">Activo</Chip></Table.Cell></Table.Row><Table.Row id="2"><Table.Cell><div className="flex gap-2 items-center"><Avatar size="sm"><Avatar.Image src="https://img.heroui.chat/image/avatar?w=400&h=400&u=3"/><Avatar.Fallback><Person/></Avatar.Fallback></Avatar>Carlos Mendoza</div></Table.Cell><Table.Cell>RR.HH.</Table.Cell><Table.Cell><Chip size="sm" color="success" variant="soft">Activo</Chip></Table.Cell></Table.Row><Table.Row id="3"><Table.Cell><div className="flex gap-2 items-center"><Avatar size="sm"><Avatar.Image src="https://img.heroui.chat/image/avatar?w=400&h=400&u=5"/><Avatar.Fallback><Person/></Avatar.Fallback></Avatar>María López</div></Table.Cell><Table.Cell>Supervisor</Table.Cell><Table.Cell><Chip size="sm" color="success" variant="soft">Activo</Chip></Table.Cell></Table.Row></Table.Body></Table.Content></Table.ScrollContainer></Table></div></Tabs.Panel>
  <Tabs.Panel id="roles" className="pt-4"><div className="bg-zinc-100 dark:bg-zinc-900 border dark:border-white/10 rounded-2xl p-4"><Typography type="h6" className="mb-3 flex gap-2 items-center"><Shield className="h-4 w-4"/>Roles (RBAC)</Typography><Table><Table.ScrollContainer><Table.Content aria-label="Roles" className="min-w-[520px]"><Table.Header><Table.Column isRowHeader>Rol</Table.Column><Table.Column>Acceso</Table.Column><Table.Column>Estado</Table.Column></Table.Header><Table.Body><Table.Row id="1"><Table.Cell><Chip size="sm" color="danger" variant="soft">ADMINISTRADOR</Chip></Table.Cell><Table.Cell>Acceso completo</Table.Cell><Table.Cell><Chip size="sm" color="success" variant="soft">Activo</Chip></Table.Cell></Table.Row><Table.Row id="2"><Table.Cell><Chip size="sm" color="accent" variant="soft">RRHH</Chip></Table.Cell><Table.Cell>Personal, asistencia, horarios, incidencias, reportes</Table.Cell><Table.Cell><Chip size="sm" color="success" variant="soft">Activo</Chip></Table.Cell></Table.Row><Table.Row id="3"><Table.Cell><Chip size="sm" color="warning" variant="soft">SUPERVISOR</Chip></Table.Cell><Table.Cell>Personal de su área + asistencias</Table.Cell><Table.Cell><Chip size="sm" color="success" variant="soft">Activo</Chip></Table.Cell></Table.Row><Table.Row id="4"><Table.Cell><Chip size="sm" color="success" variant="soft">SUPERVISOR_PRACTICAS</Chip></Table.Cell><Table.Cell>Practicantes, proyectos, seguimiento</Table.Cell><Table.Cell><Chip size="sm" color="success" variant="soft">Activo</Chip></Table.Cell></Table.Row><Table.Row id="5"><Table.Cell>EMPLEADO</Table.Cell><Table.Cell>Mi perfil, mi asistencia</Table.Cell><Table.Cell><Chip size="sm" color="success" variant="soft">Activo</Chip></Table.Cell></Table.Row><Table.Row id="6"><Table.Cell>PRACTICANTE</Table.Cell><Table.Cell>Mi perfil, mi proyecto</Table.Cell><Table.Cell><Chip size="sm" color="success" variant="soft">Activo</Chip></Table.Cell></Table.Row></Table.Body></Table.Content></Table.ScrollContainer></Table></div></Tabs.Panel>
  </Tabs></div>
}
