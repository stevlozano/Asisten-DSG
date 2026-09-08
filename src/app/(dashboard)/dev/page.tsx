"use client"
import { useEffect, useState } from "react"
import { Typography, Button, Chip, Modal, TextField, Label, Input, Table } from "@heroui/react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"

export default function DevPage(){
  const [admins,setAdmins]=useState<any[]>([])
  const [open,setOpen]=useState(false)
  const [form,setForm]=useState({nombres:"",apellidos:"",email:"",pass:""})

  const fetchAdmins=async()=>{
    const {data}=await supabase.from("profiles").select("*, companies(razon_social)").eq("rol","admin").order("created_at",{ascending:false})
    setAdmins(data||[])
  }
  useEffect(()=>{ fetchAdmins() },[])

  const handleCreate=async()=>{
    if(!form.nombres || !form.email || !form.pass) return toast.error("Completa datos")
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
    <div className="flex justify-between flex-wrap gap-4"><div><Typography type="h2">DEV — Admins / Empresas</Typography><Typography type="body-sm" className="text-muted">Misma tabla que Personal — cada admin con su empresa.</Typography></div>
    <Button className="rounded-full" onPress={()=>setOpen(true)}><Plus className="h-4 w-4"/> Crear admin</Button></div>
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Admins" className="min-w-[720px]">
          <Table.Header>
            <Table.Column isRowHeader>Nombre</Table.Column>
            <Table.Column>Email</Table.Column>
            <Table.Column>Empresa</Table.Column>
            <Table.Column>Estado</Table.Column>
            <Table.Column className="text-end">Acciones</Table.Column>
          </Table.Header>
          <Table.Body>
            {admins.map(a=>(
              <Table.Row key={a.id} id={a.id}>
                <Table.Cell className="font-medium">{a.nombres} {a.apellidos}</Table.Cell>
                <Table.Cell className="text-sm text-muted">{a.email}</Table.Cell>
                <Table.Cell>{a.companies?.razon_social} <span className="text-xs text-muted">· {a.company_id?.slice(0,8)}</span></Table.Cell>
                <Table.Cell><Chip size="sm" color="success" variant="soft">{a.estado}</Chip></Table.Cell>
                <Table.Cell><div className="flex justify-end"><Button size="sm" variant="danger-soft" isIconOnly onPress={async()=>{ await supabase.from("profiles").delete().eq("id",a.id); toast.success("Eliminado"); fetchAdmins()}}><Trash2 className="h-4 w-4"/></Button></div></Table.Cell>
              </Table.Row>
            ))}
            {admins.length===0 && <Table.Row id="empty"><Table.Cell colSpan={5} className="text-center py-8 text-sm text-muted">Sin admins — crea el primero</Table.Cell></Table.Row>}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
    <Modal isOpen={open} onOpenChange={setOpen}><Modal.Backdrop><Modal.Container><Modal.Dialog><Modal.Header><Modal.Heading>Crear admin</Modal.Heading></Modal.Header><Modal.Body><div className="space-y-3">
      <TextField><Label>Nombres</Label><Input value={form.nombres} onChange={e=>setForm({...form,nombres:(e.target as any).value})}/></TextField>
      <TextField><Label>Apellidos</Label><Input value={form.apellidos} onChange={e=>setForm({...form,apellidos:(e.target as any).value})}/></TextField>
      <TextField><Label>Email</Label><Input value={form.email} onChange={e=>setForm({...form,email:(e.target as any).value})}/></TextField>
      <TextField><Label>Pass</Label><Input value={form.pass} onChange={e=>setForm({...form,pass:(e.target as any).value})}/></TextField>
    </div></Modal.Body><Modal.Footer><Button variant="secondary" onPress={()=>setOpen(false)}>Cancelar</Button><Button onPress={handleCreate}>Crear</Button></Modal.Footer></Modal.Dialog></Modal.Container></Modal.Backdrop></Modal>
  </div>
}
