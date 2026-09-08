"use client"
import { useEffect, useState, useMemo } from "react"
import { Typography, Button, Chip, Modal, TextField, Label, Input, Table } from "@heroui/react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Plus, Trash2, Eye, EyeOff, Fingerprint, ScanFace } from "lucide-react"

function genEmail(n:string){ const c=n.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z ]/g,"").trim().replace(/\s+/g,"."); return c? `${c}@dsg.pe`:"" }
function genPass(){ return Math.random().toString(36).slice(-8)+"A1!" }
const passOpts=[genPass(), genPass(), genPass()]

export default function DevPage(){
  const [admins,setAdmins]=useState<any[]>([])
  const [open,setOpen]=useState(false)
  const [form,setForm]=useState({dni:"", nombres:"", apellidos:"", edad:"", movil:"", email:"", pass:"", passMode:"sugerida"})
  const [show,setShow]=useState(false)
  const full= `${form.nombres} ${form.apellidos}`.trim()
  const autoEmail=useMemo(()=> genEmail(full),[full])
  const [sugs,setSugs]=useState(passOpts)

  const fetchAdmins=async()=>{
    const {data}=await supabase.from("profiles").select("*, companies(razon_social)").eq("rol","admin").order("created_at",{ascending:false})
    setAdmins(data||[])
  }
  useEffect(()=>{ fetchAdmins() },[])
  useEffect(()=>{ if(autoEmail && !form.email) setForm(f=>({...f, email:autoEmail}))},[autoEmail])

  const handleCreate=async()=>{
    if(!form.nombres || !form.apellidos || !form.dni || !form.email || !form.pass) return toast.error("Completa DNI, nombres, email y contraseña")
    if(form.dni.length!==8) return toast.error("DNI 8 dígitos")
    const {data:comp}=await supabase.from("companies").insert({razon_social:`Empresa de ${form.nombres}`}).select().single()
    if(!comp) return toast.error("Error company")
    const {data:sign, error:e1}=await supabase.auth.signUp({email:form.email, password:form.pass})
    if(e1) return toast.error(e1.message)
    const uid=sign.user?.id
    if(!uid) return toast.error("No uid")
    const {error:e2}=await supabase.from("profiles").insert({id:uid, company_id:comp.id, dni:form.dni, nombres:form.nombres, apellidos:form.apellidos, email:form.email, movil:form.movil||null, rol:"admin", estado:"Activo", tipo:"Empleado"})
    if(e2) return toast.error(e2.message)
    toast.success("Admin creado — "+form.email); setOpen(false); fetchAdmins()
  }

  return <div className="space-y-6">
    <div className="flex justify-between flex-wrap gap-4"><div><Typography type="h2">DEV — Admins / Empresas</Typography><Typography type="body-sm" className="text-muted">Misma tabla que Personal — cada admin con su empresa. Biometría lista para Fase 2.</Typography></div>
    <Button className="rounded-full" onPress={()=>{ setForm({dni:"",nombres:"",apellidos:"",edad:"",movil:"",email:"",pass:genPass(),passMode:"sugerida"}); setSugs([genPass(),genPass(),genPass()]); setOpen(true)}}><Plus className="h-4 w-4"/> Crear admin</Button></div>
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Admins" className="min-w-[720px]">
          <Table.Header>
            <Table.Column isRowHeader>Nombre</Table.Column>
            <Table.Column>DNI / Edad</Table.Column>
            <Table.Column>Email</Table.Column>
            <Table.Column>Empresa</Table.Column>
            <Table.Column>Estado</Table.Column>
            <Table.Column className="text-end">Acciones</Table.Column>
          </Table.Header>
          <Table.Body>
            {admins.map(a=>(
              <Table.Row key={a.id} id={a.id}>
                <Table.Cell className="font-medium">{a.nombres} {a.apellidos}</Table.Cell>
                <Table.Cell className="text-sm">{a.dni||"—"} <span className="text-muted text-xs">· {a.movil||""}</span></Table.Cell>
                <Table.Cell className="text-sm text-muted">{a.email}</Table.Cell>
                <Table.Cell>{a.companies?.razon_social} <span className="text-xs text-muted">· {a.company_id?.slice(0,8)}</span></Table.Cell>
                <Table.Cell><Chip size="sm" color="success" variant="soft">{a.estado}</Chip></Table.Cell>
                <Table.Cell><div className="flex justify-end"><Button size="sm" variant="danger-soft" isIconOnly onPress={async()=>{ await supabase.from("profiles").delete().eq("id",a.id); toast.success("Eliminado"); fetchAdmins()}}><Trash2 className="h-4 w-4"/></Button></div></Table.Cell>
              </Table.Row>
            ))}
            {admins.length===0 && <Table.Row id="empty"><Table.Cell colSpan={6} className="text-center py-8 text-sm text-muted">Sin admins — crea el primero</Table.Cell></Table.Row>}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>

    <div className="bg-zinc-100 dark:bg-zinc-900 border dark:border-white/10 rounded-2xl p-4 space-y-2">
      <p className="text-xs font-semibold tracking-widest flex gap-2 items-center"><Fingerprint className="h-4 w-4"/> <ScanFace className="h-4 w-4"/> Seguridad biométrica — roadmap</p>
      <ul className="text-xs text-muted list-disc pl-5 space-y-1">
        <li><b>WebAuthn / Passkeys</b> (recomendado): huella/face nativo del dispositivo via <code>navigator.credentials.create()</code> — sin guardar biometría en servidor, solo publicKey. Librería: <code>@simplewebauthn/browser</code> + tabla <code>webauthn_credentials</code>. Próximo paso.</li>
        <li><b>Face API</b> (alternativa cloud): AWS Rekognition / Face++ — captura foto, genera template, compara en registro de asistencia. Requiere consentimiento y cifrado.</li>
        <li><b>Huella dactilar</b> en móvil: via WebAuthn <code>authenticatorAttachment: platform</code> ya usa huella del OS. No guardar huella cruda.</li>
        <li>Fase 1 (ahora): DNI+email+pass fuerte + 2FA TOTP. Fase 2: activar WebAuthn en login y en registro de asistencia (escaneo).</li>
      </ul>
    </div>

    <Modal isOpen={open} onOpenChange={setOpen}><Modal.Backdrop><Modal.Container size="lg"><Modal.Dialog><Modal.CloseTrigger/><Modal.Header><Modal.Heading>Crear admin</Modal.Heading><p className="text-sm text-muted">DNI, edad, móvil + autocompletado gmail y sugerencias de contraseña. Biometría se activa luego en su asistencia.</p></Modal.Header><Modal.Body><div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <TextField><Label>DNI (8 dígitos) *</Label><Input value={form.dni} onChange={e=>setForm({...form, dni:(e.target as any).value.replace(/\D/g,"").slice(0,8)})} placeholder="61133883" maxLength={8}/></TextField>
        <TextField><Label>Edad</Label><Input type="number" value={form.edad} onChange={e=>setForm({...form, edad:(e.target as any).value})} placeholder="28"/></TextField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <TextField><Label>Nombres *</Label><Input value={form.nombres} onChange={e=>setForm({...form, nombres:(e.target as any).value})} placeholder="Stev"/></TextField>
        <TextField><Label>Apellidos *</Label><Input value={form.apellidos} onChange={e=>setForm({...form, apellidos:(e.target as any).value})} placeholder="Lozano Pianchachi"/></TextField>
      </div>
      <TextField><Label>Móvil</Label><Input value={form.movil} onChange={e=>setForm({...form, movil:(e.target as any).value.replace(/\D/g,"").slice(0,9)})} placeholder="916895252"/></TextField>
      <TextField><Label>Email (autocompletado)</Label><Input value={form.email} onChange={e=>setForm({...form, email:(e.target as any).value})} placeholder={autoEmail||"stev.lozano@dsg.pe"}/>{autoEmail && form.email!==autoEmail && <button onClick={()=>setForm({...form, email:autoEmail})} className="text-xs text-[#1F9A75] mt-1">Usar sugerido: {autoEmail}</button>}</TextField>
      <div className="space-y-2">
        <Label>Contraseña * — elige sugerida o escribe la suya</Label>
        <div className="flex gap-2 flex-wrap">{sugs.map(s=> <button key={s} onClick={()=>setForm({...form, pass:s})} className={`px-3 py-1.5 rounded-full text-xs font-mono border ${form.pass===s?"bg-black dark:bg-white text-white dark:text-black":"bg-zinc-100 dark:bg-zinc-900"}`}>{s}</button>)}<button onClick={()=>setSugs([genPass(),genPass(),genPass()])} className="text-xs text-muted underline">Regenerar</button></div>
        <div className="relative"><Input type={show?"text":"password"} value={form.pass} onChange={e=>setForm({...form, pass:(e.target as any).value})} placeholder="••••••••"/><button type="button" onClick={()=>setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1">{show? <EyeOff className="h-4 w-4"/>:<Eye className="h-4 w-4"/>}</button></div>
        <p className="text-xs text-muted">Recomendación: 12+ caracteres, mayúscula, número y símbolo. Se guarda hasheada en Supabase Auth.</p>
      </div>
      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 text-xs space-y-1">
        <p className="font-semibold flex gap-1.5 items-center"><Fingerprint className="h-3.5 w-3.5"/> Biometría futura</p>
        <p className="text-muted">Tras crear, el admin podrá registrar huella/rostro desde su perfil (WebAuthn) para marcar asistencia sin contraseña.</p>
      </div>
    </div></Modal.Body><Modal.Footer><Button variant="secondary" onPress={()=>setOpen(false)}>Cancelar</Button><Button onPress={handleCreate}>Crear admin</Button></Modal.Footer></Modal.Dialog></Modal.Container></Modal.Backdrop></Modal>
  </div>
}
