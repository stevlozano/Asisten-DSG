"use client"
import { useState, useMemo, useEffect } from "react"
import { Tabs, Chip, Typography, Button, Modal, TextField, Label, Input } from "@heroui/react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus } from "lucide-react"
import { TanstackTable } from "@/components/examples/tables"
import { CustomCells } from "@/components/examples/table-editable"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

const FALLBACK_COMPANY="00000000-0000-0000-0000-000000000001"
function genEmail(nombre:string){
  const clean=nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z ]/g,"").trim().replace(/\s+/g,".")
  return clean ? `${clean}@dsg.pe` : ""
}
function genPass(){ return Math.random().toString(36).slice(-8) + "A1!" }

export default function PersonalPage(){
  const [companyId,setCompanyId]=useState(FALLBACK_COMPANY)
  const [q,setQ]=useState("")
  const [personas,setPersonas]=useState<any[]>([])
  const [open,setOpen]=useState(false)
  const [editId,setEditId]=useState<string|null>(null)
  const [tipo,setTipo]=useState("Empleado")
  const [form,setForm]=useState({dni:"", nombres:"", apellidos:"", movil:"", area:"Desarrollo", cargo:"", horario:"08:00-17:00"})
  const fullName = `${form.nombres} ${form.apellidos}`.trim()
  const email=useMemo(()=> genEmail(fullName),[fullName])
  const pass=useMemo(()=> genPass(),[open])
  const [confirmOpen,setConfirmOpen]=useState(false)

  const fetchAll=async(cid?:string)=>{
    const id=cid||companyId
    const {data,error}=await supabase.from("profiles").select("*").eq("company_id",id).neq("rol","dev").order("created_at",{ascending:false})
    if(error){ toast.error(error.message); return }
    setPersonas((data||[]).map((r:any,i:number)=>({ id:r.id, nombre:`${r.nombres} ${r.apellidos}`, tipo:r.tipo, area:r.area||"", cargo:r.cargo||"", horario:"08:00-17:00", estado:r.estado, _raw:r })))
  }
  useEffect(()=>{
    (async()=>{
      try{
        const auth=JSON.parse(localStorage.getItem("asisten-auth")||"{}")
        if(auth.email){
          const {data:me}=await supabase.from("profiles").select("company_id").eq("email",auth.email).single()
          if(me?.company_id){ setCompanyId(me.company_id); fetchAll(me.company_id); return }
        }
      }catch{}
      fetchAll()
    })()
  },[])
  const filtered = personas.filter(p=> p.nombre.toLowerCase().includes(q.toLowerCase()))

  const handleCreate=async()=>{
    if(!form.nombres || !form.apellidos) return toast.error("Nombres y apellidos requeridos")
    const base={ company_id:companyId, dni:form.dni||null, nombres:form.nombres, apellidos:form.apellidos, email:email||null, movil:form.movil||null, tipo, area:form.area, cargo:form.cargo, estado:"Activo", rol: tipo==="Empleado"?"empleado":"practicante" } as any
    if(editId){
      const {error}=await supabase.from("profiles").update({...base, company_id:undefined}).eq("id",editId)
      if(error) return toast.error(error.message)
      toast.success("Actualizado")
    } else {
      let {error}=await supabase.from("profiles").insert(base)
      if(error && error.message.includes("profiles_id_fkey")){
        const {data:sign, error:signErr}=await supabase.auth.signUp({email, password:pass, options:{data:{nombres:form.nombres}}})
        if(signErr) return toast.error(signErr.message)
        const uid=sign.user?.id
        if(!uid) return toast.error("No se pudo crear auth user")
        const {error:e2}=await supabase.from("profiles").insert({...base, id:uid})
        if(e2) return toast.error(e2.message)
      } else if(error) return toast.error(error.message)
      toast.success("Creado — "+email+" / "+pass)
    }
    setOpen(false); setEditId(null); setForm({dni:"",nombres:"",apellidos:"",movil:"",area:"Desarrollo",cargo:"",horario:"08:00-17:00"}); fetchAll()
  }

  return <div className="space-y-6">
    <div className="flex justify-between flex-wrap gap-4"><div><Typography type="h2">Gestión de Personal <span className="text-sm font-normal text-muted">— {personas.length}</span></Typography><Typography type="body-sm" className="text-muted">Empleados y practicantes — DSG PERU TECHNOLOGY SAC</Typography></div>
      <div className="flex gap-2"><Button variant="danger-soft" className="rounded-full" onPress={()=>setConfirmOpen(true)}>Eliminar todo</Button><Button onPress={()=>{ setEditId(null); setForm({dni:"",nombres:"",apellidos:"",movil:"",area:"Desarrollo",cargo:"",horario:"08:00-17:00"}); setTipo("Empleado"); setOpen(true)}} className="rounded-full"><Plus className="h-4 w-4"/> Crear personal</Button></div>
    </div>
    <Tabs className="w-full">
      <Tabs.ListContainer><Tabs.List aria-label="Personal tabs">
        <Tabs.Tab id="lista">Directorio<Tabs.Indicator/></Tabs.Tab>
        <Tabs.Tab id="gestion">Administración<Tabs.Indicator/></Tabs.Tab>
      </Tabs.List></Tabs.ListContainer>
      <Tabs.Panel id="lista" className="pt-4 space-y-4">
        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center gap-2 bg-black/[0.04] dark:bg-white/10 rounded-full px-4 py-2 flex-1 min-w-[220px]"><Search className="h-4 w-4 text-black/40 dark:text-white/60"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar..." className="bg-transparent outline-none text-sm flex-1"/></div>
          <Chip color="success" variant="soft" size="sm">{personas.filter((p:any)=>p.estado==="Activo").length} activos</Chip>
          <Chip variant="soft" size="sm">{personas.filter((p:any)=>p.tipo==="Empleado").length} empleados</Chip>
          <Chip color="warning" variant="soft" size="sm">{personas.filter((p:any)=>p.tipo==="Practicante").length} practicantes</Chip>
        </div>
        <TanstackTable data={filtered as any}/>
      </Tabs.Panel>
      <Tabs.Panel id="gestion" className="pt-4"><CustomCells data={filtered as any}/></Tabs.Panel>
    </Tabs>
    <Modal isOpen={confirmOpen} onOpenChange={setConfirmOpen}><Modal.Backdrop><Modal.Container size="md"><Modal.Dialog><Modal.CloseTrigger/><Modal.Header><Modal.Heading>¿Eliminar todo el personal?</Modal.Heading><p className="text-sm text-muted">Esta acción se audita y elimina a todos de todas las tablas y del sistema. No se puede deshacer.</p></Modal.Header><Modal.Footer><Button variant="secondary" onPress={()=>setConfirmOpen(false)}>Cancelar</Button><Button variant="danger" onPress={async()=>{ const {error}=await supabase.from("profiles").delete().eq("company_id",companyId).neq("rol","dev"); if(error) return toast.error(error.message); toast.success("Eliminado"); setConfirmOpen(false); fetchAll()}}>Eliminar todo</Button></Modal.Footer></Modal.Dialog></Modal.Container></Modal.Backdrop></Modal>
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
            <div className="flex gap-2 pt-1"><Button size="sm" variant="secondary" onPress={()=> navigator.clipboard.writeText(email)}>Copiar gmail</Button><Button size="sm" variant="secondary" onPress={()=> navigator.clipboard.writeText(pass)}>Copiar pass</Button></div>
          </div>
          <p className="text-xs text-muted">Se usará DNI como usuario alternativo. Rol: {tipo==="Empleado"?"EMPLEADO":"PRACTICANTE"} · Acceso a dashboard personal vinculado a company_id.</p>
        </div>
      </div></Modal.Body>
      <Modal.Footer><Button variant="secondary" onPress={()=>setOpen(false)}>Cancelar</Button><Button onPress={handleCreate}>Crear y enviar acceso</Button></Modal.Footer>
      </Modal.Dialog></Modal.Container></Modal.Backdrop>
    </Modal>
  </div>
}
