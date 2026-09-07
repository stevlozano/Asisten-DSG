"use client"
import { useState, useMemo } from "react"
import { Tabs, Chip, Typography, Button, Modal, TextField, Label, Input } from "@heroui/react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus } from "lucide-react"
import { TanstackTable } from "@/components/examples/tables"
import { CustomCells } from "@/components/examples/table-editable"

function genEmail(nombre:string){
  const clean=nombre.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z ]/g,"").trim().replace(/\s+/g,".")
  return clean ? `${clean}@dsg.pe` : ""
}
function genPass(){ return Math.random().toString(36).slice(-8) + "A1!" }

const initialPersonas = [
  {id:1, nombre:"Carlos Mendoza", tipo:"Empleado", area:"Desarrollo", cargo:"Desarrollador", horario:"08:00-17:00", estado:"Activo", avatar:"https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg"},
  {id:2, nombre:"María López", tipo:"Empleado", area:"RR.HH.", cargo:"Analista", horario:"08:00-17:00", estado:"Activo", avatar:"https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg"},
  {id:3, nombre:"José Ramos", tipo:"Practicante", area:"Desarrollo", cargo:"Ing. Sistemas", horario:"09:00-15:00", estado:"Activo", avatar:"https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"},
  {id:4, nombre:"Ana Torres", tipo:"Practicante", area:"Marketing", cargo:"Diseño", horario:"09:00-15:00", estado:"Activo", avatar:"https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg"},
]

export default function PersonalPage(){
  const [q,setQ]=useState("")
  const [personas,setPersonas]=useState(initialPersonas)
  const [open,setOpen]=useState(false)
  const [tipo,setTipo]=useState("Empleado")
  const [form,setForm]=useState({dni:"", nombres:"", apellidos:"", movil:"", area:"Desarrollo", cargo:"", horario:"08:00-17:00"})
  const fullName = `${form.nombres} ${form.apellidos}`.trim()
  const email=useMemo(()=> genEmail(fullName),[fullName])
  const pass=useMemo(()=> genPass(),[open])
  const [confirmOpen,setConfirmOpen]=useState(false)
  const handleCreate=()=>{
    // aquí iría supabase auth signUp + insert people + user_roles + audit_logs
    // vinculado a company_id, con acceso a su dashboard personal (empleado/practicante) diferente al admin
    setOpen(false)
  }
  return <div className="space-y-6">
    <div className="flex justify-between flex-wrap gap-4"><div><Typography type="h2">Gestión de Personal <span className="text-sm font-normal text-muted">— VI (6)</span></Typography><Typography type="body-sm" className="text-muted">Empleados y practicantes — DSG PERU TECHNOLOGY SAC</Typography></div>
      <div className="flex gap-2"><Button variant="danger-soft" className="rounded-full" onPress={()=>setConfirmOpen(true)}>Eliminar todo</Button><Button onPress={()=>setOpen(true)} className="rounded-full"><Plus className="h-4 w-4"/> Crear personal</Button></div>
    </div>
    <Tabs className="w-full">
      <Tabs.ListContainer><Tabs.List aria-label="Personal tabs">
        <Tabs.Tab id="lista">Directorio<Tabs.Indicator/></Tabs.Tab>
        <Tabs.Tab id="gestion">Administración<Tabs.Indicator/></Tabs.Tab>
      </Tabs.List></Tabs.ListContainer>
      <Tabs.Panel id="lista" className="pt-4 space-y-4">
        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center gap-2 bg-black/[0.04] dark:bg-white/10 rounded-full px-4 py-2 flex-1 min-w-[220px]"><Search className="h-4 w-4 text-black/40 dark:text-white/60"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar..." className="bg-transparent outline-none text-sm flex-1"/></div>
          <Chip color="success" variant="soft" size="sm">42 activos</Chip>
          <Chip variant="soft" size="sm">38 empleados</Chip>
          <Chip color="warning" variant="soft" size="sm">4 practicantes</Chip>
        </div>
        <TanstackTable data={personas as any}/>
      </Tabs.Panel>
      <Tabs.Panel id="gestion" className="pt-4"><CustomCells/></Tabs.Panel>
    </Tabs>
    <Modal isOpen={confirmOpen} onOpenChange={setConfirmOpen}><Modal.Backdrop><Modal.Container size="md"><Modal.Dialog><Modal.CloseTrigger/><Modal.Header><Modal.Heading>¿Eliminar todo el personal?</Modal.Heading><p className="text-sm text-muted">Esta acción se audita y elimina a todos de todas las tablas y del sistema. No se puede deshacer.</p></Modal.Header><Modal.Footer><Button variant="secondary" onPress={()=>setConfirmOpen(false)}>Cancelar</Button><Button variant="danger" onPress={()=>{ setPersonas([]); setConfirmOpen(false)}}>Eliminar todo</Button></Modal.Footer></Modal.Dialog></Modal.Container></Modal.Backdrop></Modal>
    <Modal isOpen={open} onOpenChange={setOpen}>
      <Modal.Backdrop><Modal.Container size="md"><Modal.Dialog><Modal.CloseTrigger/><Modal.Header><Modal.Heading>Crear personal</Modal.Heading><p className="text-sm text-muted">Se genera acceso automático a su dashboard (diferente al admin) vinculado a asistencias/horarios.</p></Modal.Header>
      <Modal.Body><div className="space-y-5">
        <div className="grid gap-3">
          <Select value={tipo} onValueChange={setTipo}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent><SelectGroup><SelectLabel>Tipo</SelectLabel><SelectItem value="Empleado">Empleado</SelectItem><SelectItem value="Practicante">Practicante</SelectItem></SelectGroup></SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <TextField><Label>DNI (8 dígitos)</Label><Input value={form.dni} onChange={e=>setForm({...form, dni:(e.target as any).value.replace(/\D/g,"").slice(0,8)})} placeholder="12345678" maxLength={8} /></TextField>
            <TextField><Label>Móvil</Label><Input value={form.movil} onChange={e=>setForm({...form, movil:(e.target as any).value.replace(/\D/g,"").slice(0,9)})} placeholder="9 999 999 99" /></TextField>
          </div>
          <TextField><Label>Nombres</Label><Input value={form.nombres} onChange={e=>setForm({...form, nombres:(e.target as any).value})} placeholder="Ej. Carlos" /></TextField>
          <TextField><Label>Apellidos completos</Label><Input value={form.apellidos} onChange={e=>setForm({...form, apellidos:(e.target as any).value})} placeholder="Ej. Mendoza Quispe" /></TextField>
          <div className="grid grid-cols-2 gap-3">
            <Select value={form.area} onValueChange={(v)=>setForm({...form, area:v})}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Área" /></SelectTrigger>
            <SelectContent><SelectGroup><SelectLabel>Área</SelectLabel><SelectItem value="Desarrollo">Desarrollo</SelectItem><SelectItem value="Marketing">Marketing</SelectItem><SelectItem value="RR.HH.">RR.HH.</SelectItem><SelectItem value="Contabilidad">Contabilidad</SelectItem><SelectItem value="Gerencia">Gerencia</SelectItem></SelectGroup></SelectContent>
          </Select>
            <TextField><Label>{tipo==="Empleado"?"Cargo":"Carrera / Ciclo"}</Label><Input value={form.cargo} onChange={e=>setForm({...form, cargo:(e.target as any).value})} /></TextField>
        <Select value={form.horario} onValueChange={(v)=>setForm({...form, horario:v})}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Horario" /></SelectTrigger>
            <SelectContent><SelectGroup><SelectLabel>Horario</SelectLabel><SelectItem value="08:00-17:00">08:00-17:00</SelectItem><SelectItem value="09:00-15:00">09:00-15:00</SelectItem><SelectItem value="08:00-12:00">08:00-12:00</SelectItem></SelectGroup></SelectContent>
          </Select>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-[#1F9A75]/10 border border-[#1F9A75]/20 space-y-2">
          <p className="text-xs font-semibold tracking-widest">ACCESO GENERADO</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-muted">Gmail</span><span className="font-mono font-medium">{email || "—@dsg.pe"}</span></div>
            <div className="flex justify-between items-center"><span className="text-muted">Contraseña segura</span><span className="font-mono font-medium">{pass}</span></div>
            <div className="flex gap-2 pt-1"><Button size="sm" variant="secondary" onPress={()=> navigator.clipboard.writeText(email)}>Copiar gmail</Button><Button size="sm" variant="secondary" onPress={()=> navigator.clipboard.writeText(pass)}>Copiar pass</Button><Button size="sm" variant="tertiary" onPress={()=> setForm({...form})}>Regenerar</Button></div>
          </div>
          <p className="text-xs text-muted">Se usará DNI como usuario alternativo. Rol: {tipo==="Empleado"?"EMPLEADO":"PRACTICANTE"} · Acceso a dashboard personal (Mi asistencia, Mi horario{tipo==="Practicante" ? ", Mi proyecto" : ""}) vinculado a company_id.</p>
        </div>
      </div></Modal.Body>
      <Modal.Footer><Button variant="secondary" onPress={()=>setOpen(false)}>Cancelar</Button><Button onPress={handleCreate}>Crear y enviar acceso</Button></Modal.Footer>
      </Modal.Dialog></Modal.Container></Modal.Backdrop>
    </Modal>
  </div>
}
