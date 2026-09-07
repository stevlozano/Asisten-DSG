"use client"
import { Typography, Button, Chip, Table, Tabs } from "@heroui/react"
import { Calendar, DateField, DatePicker, Label } from "@heroui/react"
import { useState, useMemo } from "react"
import type { SortDescriptor } from "@heroui/react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

function DateRangePicker(){
  return (
    <div className="flex flex-wrap gap-3">
      <DatePicker className="w-64" name="desde">
        <Label>Desde</Label>
        <DateField.Group fullWidth>
          <DateField.Input>{(segment:any)=><DateField.Segment segment={segment}/>}</DateField.Input>
          <DateField.Suffix><DatePicker.Trigger><DatePicker.TriggerIndicator/></DatePicker.Trigger></DateField.Suffix>
        </DateField.Group>
        <DatePicker.Popover>
          <Calendar aria-label="Desde">
            <Calendar.Header><Calendar.YearPickerTrigger><Calendar.YearPickerTriggerHeading/><Calendar.YearPickerTriggerIndicator/></Calendar.YearPickerTrigger><Calendar.NavButton slot="previous"/><Calendar.NavButton slot="next"/></Calendar.Header>
            <Calendar.Grid><Calendar.GridHeader>{(day:any)=><Calendar.HeaderCell>{day}</Calendar.HeaderCell>}</Calendar.GridHeader><Calendar.GridBody>{(date:any)=><Calendar.Cell date={date}/>}</Calendar.GridBody></Calendar.Grid>
            <Calendar.YearPickerGrid><Calendar.YearPickerGridBody>{({year}:any)=><Calendar.YearPickerCell year={year}/>}</Calendar.YearPickerGridBody></Calendar.YearPickerGrid>
          </Calendar>
        </DatePicker.Popover>
      </DatePicker>
      <DatePicker className="w-64" name="hasta">
        <Label>Hasta</Label>
        <DateField.Group fullWidth>
          <DateField.Input>{(segment:any)=><DateField.Segment segment={segment}/>}</DateField.Input>
          <DateField.Suffix><DatePicker.Trigger><DatePicker.TriggerIndicator/></DatePicker.Trigger></DateField.Suffix>
        </DateField.Group>
        <DatePicker.Popover>
          <Calendar aria-label="Hasta">
            <Calendar.Header><Calendar.YearPickerTrigger><Calendar.YearPickerTriggerHeading/><Calendar.YearPickerTriggerIndicator/></Calendar.YearPickerTrigger><Calendar.NavButton slot="previous"/><Calendar.NavButton slot="next"/></Calendar.Header>
            <Calendar.Grid><Calendar.GridHeader>{(day:any)=><Calendar.HeaderCell>{day}</Calendar.HeaderCell>}</Calendar.GridHeader><Calendar.GridBody>{(date:any)=><Calendar.Cell date={date}/>}</Calendar.GridBody></Calendar.Grid>
            <Calendar.YearPickerGrid><Calendar.YearPickerGridBody>{({year}:any)=><Calendar.YearPickerCell year={year}/>}</Calendar.YearPickerGridBody></Calendar.YearPickerGrid>
          </Calendar>
        </DatePicker.Popover>
      </DatePicker>
    </div>
  )
}

type Row = { id:number; persona:string; fecha:string; tipo:string; estado:string }
const rows:Row[]=[
  {id:1, persona:"Carlos Mendoza", fecha:"04/09/2026", tipo:"Asistencia", estado:"Presente"},
  {id:2, persona:"José Ramos", fecha:"04/09/2026", tipo:"Tardanza", estado:"Tardanza 17m"},
  {id:3, persona:"Ana Torres", fecha:"03/09/2026", tipo:"Falta", estado:"Falta"},
]
const donutData = [
  {name:"Presentes", value:35, color:"#1F9A75"},
  {name:"Tardanzas", value:4, color:"#f59e0b"},
  {name:"Faltas", value:3, color:"#ef4444"},
]
function DonutChart(){
  return (
    <div className="bg-zinc-100 dark:bg-zinc-900 border dark:border-white/10 rounded-2xl p-6">
      <p className="text-sm font-semibold mb-4">Asistencia de hoy</p>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={donutData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={4}>
              {donutData.map((e,i)=><Cell key={i} fill={e.color} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function ReportTable({data}:{data:Row[]}){
  const [sd,setSd]=useState<SortDescriptor>({column:"persona", direction:"ascending"})
  const sorted=useMemo(()=>[...data].sort((a,b)=>{let c=String(a[sd.column as keyof Row]).localeCompare(String(b[sd.column as keyof Row])); if(sd.direction==="descending") c*=-1; return c}),[sd,data])
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Reportes" className="min-w-[640px]" sortDescriptor={sd} onSortChange={setSd}>
          <Table.Header>
            <Table.Column isRowHeader allowsSorting id="persona">{({sortDirection})=><Table.SortableColumnHeader sortDirection={sortDirection}>Persona</Table.SortableColumnHeader>}</Table.Column>
            <Table.Column id="fecha">Fecha</Table.Column>
            <Table.Column id="tipo">Tipo</Table.Column>
            <Table.Column id="estado">Estado</Table.Column>
          </Table.Header>
          <Table.Body>
            {sorted.map(r=>(
              <Table.Row key={r.id} id={r.id}>
                <Table.Cell>{r.persona}</Table.Cell>
                <Table.Cell className="text-muted">{r.fecha}</Table.Cell>
                <Table.Cell><Chip size="sm" variant="soft">{r.tipo}</Chip></Table.Cell>
                <Table.Cell><Chip size="sm" variant="soft" color={r.estado.includes("Presente")?"success":r.estado.includes("Tardanza")?"warning":"danger"}>{r.estado}</Chip></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  )
}

export default function Page(){
  return <div className="space-y-6">
    <div className="flex justify-between flex-wrap gap-4"><div><Typography type="h2">Reportes</Typography><Typography type="body-sm" className="text-muted">Filtra por rango de fechas HeroUI DatePicker y exporta</Typography></div>
    <div className="flex gap-2"><Button variant="secondary">Exportar PDF</Button><Button variant="secondary">Exportar Excel</Button></div></div>
    <div className="bg-zinc-100 dark:bg-zinc-900 border dark:border-white/10 rounded-2xl p-6 space-y-4">
      <Typography type="h6">Rango de fechas</Typography>
      <DateRangePicker/>
      <div className="flex gap-2"><Button>Generar reporte</Button><Button variant="tertiary">Limpiar</Button></div>
    </div>
    <div className="grid md:grid-cols-3 gap-4"><DonutChart/><div className="md:col-span-2 grid grid-cols-2 gap-3">
      <div className="bg-zinc-100 dark:bg-zinc-900 border dark:border-white/10 rounded-2xl p-5"><p className="text-xs tracking-widest text-muted">PRESENTES</p><p className="text-2xl font-bold">35</p><p className="text-xs text-muted">83% del total</p><div className="mt-2 h-1.5 bg-black/10 rounded-full"><div className="h-1.5 bg-[#1F9A75] rounded-full" style={{width:"83%"}}/></div></div>
      <div className="bg-zinc-100 dark:bg-zinc-900 border dark:border-white/10 rounded-2xl p-5"><p className="text-xs tracking-widest text-muted">TARDANZAS</p><p className="text-2xl font-bold">4</p><p className="text-xs text-amber-600">9.5% · Revisar</p></div>
      <div className="bg-zinc-100 dark:bg-zinc-900 border dark:border-white/10 rounded-2xl p-5"><p className="text-xs tracking-widest text-muted">FALTAS</p><p className="text-2xl font-bold">3</p><p className="text-xs text-red-600">7% · Justificar</p></div>
      <div className="bg-black dark:bg-white text-white dark:text-black rounded-2xl p-5"><p className="text-xs tracking-widest opacity-60">TOTAL</p><p className="text-2xl font-bold">42</p><p className="text-xs opacity-60">Personal activo</p></div>
    </div></div>
    <div className="space-y-3"><Typography type="h6">Reporte</Typography><ReportTable data={rows}/></div>
  </div>
}
