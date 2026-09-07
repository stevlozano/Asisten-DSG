"use client"
import { Typography, Chip, Avatar, Button, Tabs, TextField, Label, Input } from "@heroui/react"
import { Person } from "@gravity-ui/icons"
import { Mail, Phone, MapPin, Calendar, Shield, Building2, KeyRound, Clock } from "lucide-react"
export default function Page(){
  return <div className="space-y-6">
    <Typography type="h2">Mi Perfil</Typography>
    <div className="bg-zinc-100 dark:bg-zinc-900 border dark:border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6">
      <div className="relative group">
        <Avatar size="lg" className="h-24 w-24 ring-4 ring-[#1F9A75]/20"><Avatar.Image src="https://img.heroui.chat/image/avatar?w=400&h=400&u=16"/><Avatar.Fallback><Person/></Avatar.Fallback></Avatar>
        <label className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-black dark:bg-white text-white dark:text-black grid place-items-center shadow-lg cursor-pointer hover:scale-105 transition-transform">
          <span className="text-xs">✎</span>
          <input type="file" accept="image/*" className="hidden" onChange={e=>{ const f=e.target.files?.[0]; if(f) alert(`Foto seleccionada: ${f.name}`)}} />
        </label>
      </div>
      <div className="flex-1 space-y-3">
        <div><Typography type="h4">Ing. Omar Quispe</Typography><p className="text-sm text-muted">Administrador General</p></div>
        <div className="flex flex-wrap gap-2"><Chip size="sm" color="success" variant="soft">Activo</Chip><Chip size="sm" variant="soft">DNI 12345678</Chip><Chip size="sm" variant="soft">RUC 2060</Chip></div>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div className="flex gap-2"><Mail className="h-4 w-4 text-muted mt-0.5"/> ing.omar@dsg.pe</div>
          <div className="flex gap-2"><Phone className="h-4 w-4 text-muted mt-0.5"/> +51 999 999 999</div>
          <div className="flex gap-2"><MapPin className="h-4 w-4 text-muted mt-0.5"/> Av. Javier Prado 123, Lima</div>
          <div className="flex gap-2"><Calendar className="h-4 w-4 text-muted mt-0.5"/> Ingreso 01/01/2020 · 5 años</div>
          <div className="flex gap-2"><Building2 className="h-4 w-4 text-muted mt-0.5"/> DSG PERU TECHNOLOGY SAC</div>
          <div className="flex gap-2"><Clock className="h-4 w-4 text-muted mt-0.5"/> Horario Oficina 08:00-17:00</div>
        </div>
      </div>
      <Button>Editar perfil</Button>
    </div>
    <Tabs>
      <Tabs.ListContainer><Tabs.List aria-label="Perfil"><Tabs.Tab id="personal">Personal<Tabs.Indicator/></Tabs.Tab><Tabs.Tab id="laboral">Laboral<Tabs.Indicator/></Tabs.Tab><Tabs.Tab id="seguridad">Seguridad<Tabs.Indicator/></Tabs.Tab></Tabs.List></Tabs.ListContainer>
      <Tabs.Panel id="personal" className="pt-4"><div className="bg-zinc-100 dark:bg-zinc-900 border dark:border-white/10 rounded-2xl p-6 space-y-4"><div className="grid md:grid-cols-2 gap-4"><TextField><Label>Nombres</Label><Input value="Omar" className="rounded-xl" /></TextField><TextField><Label>Apellidos</Label><Input value="Quispe" className="rounded-xl" /></TextField><TextField><Label>DNI</Label><Input value="12345678" className="rounded-xl" /></TextField><TextField><Label>Móvil</Label><Input value="+51 999 999 999" className="rounded-xl" /></TextField><TextField><Label>Email</Label><Input value="ing.omar@dsg.pe" className="rounded-xl" /></TextField><TextField><Label>Dirección</Label><Input value="Av. Javier Prado 123" className="rounded-xl" /></TextField></div><div className="flex gap-2"><button className="px-5 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm">Guardar</button><button className="px-5 py-2 rounded-full border text-sm">Cancelar</button></div></div></Tabs.Panel>
      <Tabs.Panel id="laboral" className="pt-4"><div className="bg-zinc-100 dark:bg-zinc-900 border dark:border-white/10 rounded-2xl p-6 grid gap-3">
        <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-black border"><div><p className="text-xs text-muted">Cargo</p><p className="text-sm font-medium">Administrador</p></div><Chip size="sm" color="accent" variant="soft">Principal</Chip></div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-black border"><div><p className="text-xs text-muted">Área</p><p className="text-sm font-medium">Gerencia</p></div><Building2 className="h-4 w-4 text-muted"/></div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-black border"><div><p className="text-xs text-muted">Horario</p><p className="text-sm font-medium">08:00-17:00</p></div><Clock className="h-4 w-4 text-muted"/></div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-black border"><div><p className="text-xs text-muted">Tipo contrato</p><p className="text-sm font-medium">Indeterminado</p></div><span className="text-xs px-2 py-1 rounded-full bg-[#1F9A75]/10 text-[#1F9A75]">Activo</span></div>
      </div></Tabs.Panel>
      <Tabs.Panel id="seguridad" className="pt-4"><div className="bg-zinc-100 dark:bg-zinc-900 border dark:border-white/10 rounded-2xl p-6 space-y-4"><div className="flex items-center gap-3"><KeyRound className="h-5 w-5"/><div><p className="text-sm font-medium">Contraseña</p><p className="text-xs text-muted">Último cambio hace 30 días</p></div><Button size="sm" variant="secondary" className="ml-auto">Cambiar</Button></div><div className="flex items-center gap-3"><Shield className="h-5 w-5"/><div><p className="text-sm font-medium">2FA</p><p className="text-xs text-muted">No activado</p></div><Button size="sm" variant="secondary" className="ml-auto">Activar</Button></div></div></Tabs.Panel>
    </Tabs>
  </div>
}
