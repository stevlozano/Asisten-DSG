"use client"
import { useState, useEffect } from "react"
import { Typography, Tabs, Chip, Avatar, Separator, Table, Button, TextField, Label, Input } from "@heroui/react"
import { Person } from "@gravity-ui/icons"
import { Users, Shield, LayoutGrid, Clock, Bell } from "lucide-react"
import { supabase } from "@/lib/supabase"
const COMPANY_ID="00000000-0000-0000-0000-000000000001"
function EmpresaForm({edit, empresa}:{edit:boolean, empresa:any}){
  const [form,setForm]=useState({ruc:empresa?.ruc||"20601234567", direccion:empresa?.direccion||"Av. Javier Prado 123", telefono:empresa?.telefono||"+51 999 999 999", email:empresa?.email||"info@dsg.pe", horario:"08:00 - 17:00", tolerancia:String(empresa?.tolerancia_default_min||10), notif:true})
  useEffect(()=>{ setForm(f=>({...f, ruc:empresa?.ruc||f.ruc, direccion:empresa?.direccion||f.direccion, telefono:empresa?.telefono||f.telefono, email:empresa?.email||f.email, tolerancia:String(empresa?.tolerancia_default_min||10)}))},[empresa])
  const save=async()=>{ await supabase.from("companies").update({ruc:form.ruc, direccion:form.direccion, telefono:form.telefono, email:form.email, tolerancia_default_min:parseInt(form.tolerancia)||10}).eq("id",COMPANY_ID)}
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
      {edit && <Button size="sm" onPress={save}>Guardar</Button>}
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
  const [empresa,setEmpresa]=useState<any>(null)
  const [mods,setMods]=useState<any[]>([])
  const [usuarios,setUsuarios]=useState<any[]>([])
  const [counts,setCounts]=useState<any>({})
  const [empresaEdit,setEmpresaEdit]=useState(false)
  const [isDev,setIsDev]=useState(false)
  useEffect(()=>{ try{ const a=JSON.parse(localStorage.getItem("asisten-auth")||"{}"); if(a.rol==="dev") setIsDev(true)}catch{}},[])
  useEffect(()=>{
    (async()=>{
      const {data:emp}=await supabase.from("companies").select("*").eq("id",COMPANY_ID).single()
      setEmpresa(emp)
      const {data:mod}=await supabase.from("module_settings").select("*").eq("company_id",COMPANY_ID).single()
      const m = mod || {asistencias:true, horarios:true, incidencias:true, practicantes:true, proyectos:true, seguimiento:true, reportes:true}
      setMods([
        {key:"asistencias", label:"Asistencias", desc:`${m.asistencias?"ON":"OFF"} · Registro de entradas y salidas`, on:m.asistencias},
        {key:"horarios", label:"Horarios", desc:"Turnos y tolerancias", on:m.horarios},
        {key:"incidencias", label:"Incidencias", desc:"Tardanzas y faltas", on:m.incidencias},
        {key:"practicantes", label:"Practicantes", desc:"Gestión de practicantes", on:m.practicantes},
        {key:"proyectos", label:"Proyectos", desc:"Proyectos de practicantes", on:m.proyectos},
        {key:"seguimiento", label:"Seguimiento", desc:"Avance y entregables", on:m.seguimiento},
        {key:"reportes", label:"Reportes", desc:"Exportación PDF/Excel", on:m.reportes},
      ])
      const {data:prof}=await supabase.from("profiles").select("*").eq("company_id",COMPANY_ID)
      setUsuarios(prof||[])
      const {count:asist}=await supabase.from("asistencias").select("*",{count:"exact",head:true}).eq("company_id",COMPANY_ID)
      const {count:hor}=await supabase.from("horarios").select("*",{count:"exact",head:true}).eq("company_id",COMPANY_ID)
      setCounts({asist, hor, personal: prof?.length||0})
    })()
  },[])
  const toggle=async(k:string)=> {
    const newMods = mods.map(x=> x.key===k ? {...x, on:!x.on}:x)
    setMods(newMods)
    const payload:any={}; newMods.forEach(m=> payload[m.key]=m.on)
    await supabase.from("module_settings").upsert({company_id:COMPANY_ID, ...payload})
  }
  return <div className="space-y-6"><div><Typography type="h2">Configuración {isDev && <Chip size="sm" color="accent" variant="soft">DEV — Global</Chip>}</Typography><Typography type="body-sm" className="text-muted">{isDev ? "Configuración global del sistema — todas las empresas" : `${empresa?.razon_social||"DSG PERU TECHNOLOGY SAC"} · ${counts.personal||0} personas · ${counts.asist||0} asistencias · ${counts.hor||0} horarios`}</Typography></div>
  <Tabs><Tabs.ListContainer><Tabs.List aria-label="Config"><Tabs.Tab id="empresa">Empresa<Tabs.Indicator/></Tabs.Tab><Tabs.Tab id="modulos">Módulos<Tabs.Indicator/></Tabs.Tab><Tabs.Tab id="usuarios">Usuarios<Tabs.Indicator/></Tabs.Tab><Tabs.Tab id="roles">Roles<Tabs.Indicator/></Tabs.Tab></Tabs.List></Tabs.ListContainer>
  <Tabs.Panel id="empresa" className="pt-4"><div className="bg-zinc-100 dark:bg-zinc-900 border dark:border-white/10 rounded-2xl p-6 space-y-4"><div className="flex items-center gap-4"><div className="h-14 w-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black grid place-items-center font-black">DSG</div><div><Typography type="h6">{empresa?.razon_social||"DSG PERU TECHNOLOGY SAC"}</Typography><Typography type="body-xs" className="text-muted">RUC {empresa?.ruc||"20601234567"} • {empresa?.direccion||"Lima"} • {empresa?.email||"info@dsg.pe"}</Typography></div><Chip size="sm" color="success" variant="soft" className="ml-auto">Activa</Chip><Button size="sm" variant="secondary" onPress={()=>setEmpresaEdit(!empresaEdit)}>{empresaEdit?"Cancelar":"Editar"}</Button></div><Separator/><EmpresaForm edit={empresaEdit} empresa={empresa}/></div></Tabs.Panel>
  <Tabs.Panel id="modulos" className="pt-4"><div className="bg-zinc-100 dark:bg-zinc-900 border dark:border-white/10 rounded-2xl p-6"><div className="flex justify-between mb-3"><Typography type="h6" className="flex gap-2 items-center"><LayoutGrid className="h-4 w-4"/>Módulos {isDev && "(global)"}</Typography><span className="text-xs text-muted">{mods.filter(m=>m.on).length}/{mods.length} activos</span></div>{mods.map(m=>(<div key={m.key} onClick={()=>toggle(m.key)} className="flex justify-between p-3 border-b cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 rounded-xl"><span className="text-sm"><b>{m.label}</b> <span className="text-muted text-xs">— {m.desc}</span></span><Chip size="sm" color={m.on?"success":"default"} variant="soft">{m.on?"ON":"OFF"}</Chip></div>))}</div></Tabs.Panel>
  <Tabs.Panel id="usuarios" className="pt-4"><div className="bg-zinc-100 dark:bg-zinc-900 border dark:border-white/10 rounded-2xl p-4"><Typography type="h6" className="mb-3 flex gap-2 items-center"><Users className="h-4 w-4"/>Usuarios reales · {usuarios.length}</Typography><Table><Table.ScrollContainer><Table.Content aria-label="Usuarios" className="min-w-[520px]"><Table.Header><Table.Column isRowHeader>Usuario</Table.Column><Table.Column>Rol</Table.Column><Table.Column>Estado</Table.Column></Table.Header><Table.Body>{usuarios.map(u=>(<Table.Row key={u.id} id={u.id}><Table.Cell><div className="flex gap-2 items-center"><Avatar size="sm"><Avatar.Fallback><Person/></Avatar.Fallback></Avatar>{u.nombres} {u.apellidos} <span className="text-xs text-muted">{u.email}</span></div></Table.Cell><Table.Cell><Chip size="sm" variant="soft">{u.rol} · {u.tipo}</Chip></Table.Cell><Table.Cell><Chip size="sm" color={u.estado==="Activo"?"success":"danger"} variant="soft">{u.estado}</Chip></Table.Cell></Table.Row>))}{usuarios.length===0 && <Table.Row id="empty"><Table.Cell colSpan={3} className="text-center text-sm text-muted py-6">Sin usuarios — crea en Personal</Table.Cell></Table.Row>}</Table.Body></Table.Content></Table.ScrollContainer></Table></div></Tabs.Panel>
  <Tabs.Panel id="roles" className="pt-4"><div className="bg-zinc-100 dark:bg-zinc-900 border dark:border-white/10 rounded-2xl p-4"><Typography type="h6" className="mb-3 flex gap-2 items-center"><Shield className="h-4 w-4"/>Roles (RBAC) · {usuarios.length} usuarios</Typography><Table><Table.ScrollContainer><Table.Content aria-label="Roles" className="min-w-[520px]"><Table.Header><Table.Column isRowHeader>Rol</Table.Column><Table.Column>Usuarios</Table.Column><Table.Column>Acceso</Table.Column></Table.Header><Table.Body>
    <Table.Row id="1"><Table.Cell><Chip size="sm" color="danger" variant="soft">DEV</Chip></Table.Cell><Table.Cell>{usuarios.filter(u=>u.rol==="dev").length}</Table.Cell><Table.Cell>Todo el sistema</Table.Cell></Table.Row>
    <Table.Row id="2"><Table.Cell><Chip size="sm" color="accent" variant="soft">ADMIN</Chip></Table.Cell><Table.Cell>{usuarios.filter(u=>u.rol==="admin").length}</Table.Cell><Table.Cell>Su empresa completa</Table.Cell></Table.Row>
    <Table.Row id="3"><Table.Cell>EMPLEADO</Table.Cell><Table.Cell>{usuarios.filter(u=>u.tipo==="Empleado").length}</Table.Cell><Table.Cell>Mi perfil, mi asistencia</Table.Cell></Table.Row>
    <Table.Row id="4"><Table.Cell>PRACTICANTE</Table.Cell><Table.Cell>{usuarios.filter(u=>u.tipo==="Practicante").length}</Table.Cell><Table.Cell>Mi perfil, mi proyecto</Table.Cell></Table.Row>
  </Table.Body></Table.Content></Table.ScrollContainer></Table></div></Tabs.Panel>
  </Tabs></div>
}
