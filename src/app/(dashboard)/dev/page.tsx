"use client"
import { useEffect, useState } from "react"
import { Typography, Button, Chip, Modal, TextField, Label, Input } from "@heroui/react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Plus, Trash2, Pencil } from "lucide-react"

export default function DevPage(){
  const [admins,setAdmins]=useState<any[]>([])
  const [open,setOpen]=useState(false)
  const [form,setForm]=useState({nombres:"",apellidos:"",email:"",pass:""})
  const [editId,setEditId]=useState<string|null>(null)

  const fetchAdmins=async()=>{
    const {data}=await supabase.from("profiles").select("*, companies(razon_social)").eq("rol","admin").order("created_at",{ascending:false})
    setAdmins(data||[])
  }
  useEffect(()=>{ fetchAdmins() },[])

  const handleCreate=async()=>{
    if(!form.nombres || !form.email || !form.pass) return toast.error("Completa datos")
    // crea company por admin
    const {data:comp}=await supabase.from("companies").insert({razon_social:`Empresa de ${form.nombres}`}).select().single()
    if(!comp) return toast.error("Error company")
    const {data:sign, error:e1}=await supabase.auth.signUp({email:form.email, password:form.pass})
    if(e1) return toast.error(e1.message)
    const uid=sign.user?.id
    if(!uid) return toast.error("No uid")
    const {error:e2}=await supabase.from("profiles").insert({id:uid, company_id:comp.id, nombres:form.nombres, apellidos:form.apellidos, email:form.email, rol:"admin", estado:"Activo", tipo:"Empleado"})
    if(e2) return toast.error(e2.message)
    toast.success("Admin creado"); setOpen(false); fetchAdmins()
  }

  return <div className="space-y-6">
    <div className="flex justify-between"><div><Typography type="h2">DEV — Admins</Typography><Typography type="body-sm" className="text-muted">Solo tú ves esto. Cada admin tiene su company_id y su personal.</Typography></div>
    <Button className="rounded-full" onPress={()=>setOpen(true)}><Plus className="h-4 w-4"/> Crear admin</Button></div>
    <div className="rounded-2xl border dark:border-white/10 divide-y dark:divide-white/5 overflow-hidden">
      {admins.map(a=>(
        <div key={a.id} className="flex justify-between p-4 bg-zinc-100 dark:bg-zinc-900">
          <div><p className="text-sm font-medium">{a.nombres} {a.apellidos} <Chip size="sm" variant="soft">{a.rol}</Chip></p><p className="text-xs text-muted">{a.email} · {a.companies?.razon_social} · {a.company_id?.slice(0,8)}</p></div>
          <div className="flex gap-1"><Button size="sm" variant="danger-soft" isIconOnly onPress={async()=>{ await supabase.from("profiles").delete().eq("id",a.id); toast.success("Eliminado"); fetchAdmins()}}><Trash2 className="h-4 w-4"/></Button></div>
        </div>
      ))}
      {admins.length===0 && <p className="p-8 text-sm text-muted text-center">Sin admins — crea el primero</p>}
    </div>
    <Modal isOpen={open} onOpenChange={setOpen}><Modal.Backdrop><Modal.Container><Modal.Dialog><Modal.Header><Modal.Heading>Crear admin</Modal.Heading></Modal.Header><Modal.Body><div className="space-y-3">
      <TextField><Label>Nombres</Label><Input value={form.nombres} onChange={e=>setForm({...form,nombres:(e.target as any).value})}/></TextField>
      <TextField><Label>Apellidos</Label><Input value={form.apellidos} onChange={e=>setForm({...form,apellidos:(e.target as any).value})}/></TextField>
      <TextField><Label>Email</Label><Input value={form.email} onChange={e=>setForm({...form,email:(e.target as any).value})}/></TextField>
      <TextField><Label>Pass</Label><Input value={form.pass} onChange={e=>setForm({...form,pass:(e.target as any).value})}/></TextField>
    </div></Modal.Body><Modal.Footer><Button variant="secondary" onPress={()=>setOpen(false)}>Cancelar</Button><Button onPress={handleCreate}>Crear</Button></Modal.Footer></Modal.Dialog></Modal.Container></Modal.Backdrop></Modal>
  </div>
}
