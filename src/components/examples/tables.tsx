"use client";
import type {SortDescriptor} from "@heroui/react";
import type {SortingState} from "@tanstack/react-table";
import {Chip, Pagination, Table} from "@heroui/react";
import { createColumnHelper, createPaginatedRowModel, createSortedRowModel, flexRender, rowPaginationFeature, rowSortingFeature, sortFn_alphanumeric, tableFeatures, useTable } from "@tanstack/react-table";
import {useMemo, useState} from "react";
// --- Data DSG ---
interface Persona { id:number; nombre:string; tipo:"Empleado"|"Practicante"; area:string; cargo:string; horario:string; estado:"Activo"|"Inactivo"; }
const defaultPersonas: Persona[] = [
  {id:1, nombre:"Carlos Mendoza", tipo:"Empleado", area:"Desarrollo", cargo:"Desarrollador", horario:"08:00-17:00", estado:"Activo"},
  {id:2, nombre:"María López", tipo:"Empleado", area:"RR.HH.", cargo:"Analista", horario:"08:00-17:00", estado:"Activo"},
  {id:3, nombre:"José Ramos", tipo:"Practicante", area:"Desarrollo", cargo:"Ing. Sistemas", horario:"09:00-15:00", estado:"Activo"},
  {id:4, nombre:"Ana Torres", tipo:"Practicante", area:"Marketing", cargo:"Diseño", horario:"09:00-15:00", estado:"Activo"},
  {id:5, nombre:"Lucía Vega", tipo:"Empleado", area:"Contabilidad", cargo:"Contadora", horario:"08:00-17:00", estado:"Inactivo"},
  {id:6, nombre:"Diego Ruiz", tipo:"Practicante", area:"Desarrollo", cargo:"QA", horario:"09:00-15:00", estado:"Activo"},
  {id:7, nombre:"Omar Quispe", tipo:"Empleado", area:"Gerencia", cargo:"Gerente", horario:"08:00-17:00", estado:"Activo"},
  {id:8, nombre:"Sofía Díaz", tipo:"Empleado", area:"Marketing", cargo:"Community", horario:"08:00-17:00", estado:"Activo"},
];
const features = tableFeatures({ paginatedRowModel:createPaginatedRowModel(), rowPaginationFeature, rowSortingFeature, sortFns:{ alphanumeric:sortFn_alphanumeric }, sortedRowModel:createSortedRowModel() });
const helper = createColumnHelper<typeof features, Persona>();
const columns = helper.columns([
  helper.accessor("nombre", {header:"Nombre"}),
  helper.accessor("tipo", {header:"Tipo", cell:i=> <Chip size="sm" variant="soft" color={i.getValue()==="Empleado"?"accent":"warning"}>{i.getValue()}</Chip> }),
  helper.accessor("area", {header:"Área"}),
  helper.accessor("cargo", {header:"Cargo / Carrera"}),
  helper.accessor("horario", {header:"Horario"}),
  helper.accessor("estado", {header:"Estado", cell:i=> <Chip size="sm" variant="soft" color={i.getValue()==="Activo"?"success":"danger"}>{i.getValue()}</Chip> }),
]);
function toSD(s:SortingState):SortDescriptor|undefined{ const f=s[0]; if(!f) return; return {column:f.id, direction:f.desc?"descending":"ascending"} }
function toSS(d:SortDescriptor):SortingState{ return [{id:d.column as string, desc:d.direction==="descending"}] }
const PAGE=4;
export function TanstackTable({data}:{data?:Persona[]}){
  const [sorting,setSorting]=useState<SortingState>([]);
  const source=data !== undefined ? data : defaultPersonas
  const table=useTable({ columns, data:source, features, initialState:{pagination:{pageIndex:0,pageSize:PAGE}}, onSortingChange:setSorting, state:{sorting}});
  const sd=useMemo(()=>toSD(sorting),[sorting]);
  const {pageIndex}=table.state.pagination; const pc=table.getPageCount(); const pages=Array.from({length:pc},(_,i)=>i+1); const s=pageIndex*PAGE+1; const e=Math.min((pageIndex+1)*PAGE, source.length);
  return (
    <Table>
      <Table.ScrollContainer><Table.Content aria-label="Personal" className="min-w-[720px]" sortDescriptor={sd} onSortChange={d=>setSorting(toSS(d))}>
          <Table.Header>{table.getHeaderGroups()[0]?.headers.map(h=>(<Table.Column key={h.id} allowsSorting={h.column.getCanSort()} id={h.id} isRowHeader={h.id==="nombre"}>{({sortDirection})=><Table.SortableColumnHeader sortDirection={sortDirection}>{flexRender(h.column.columnDef.header, h.getContext())}</Table.SortableColumnHeader>}</Table.Column>))}</Table.Header>
          <Table.Body>{table.getRowModel().rows.map(r=>(<Table.Row key={r.id} id={r.id}>{r.getAllCells().map(c=>(<Table.Cell key={c.id}>{flexRender(c.column.columnDef.cell, c.getContext())}</Table.Cell>))}</Table.Row>))}</Table.Body>
        </Table.Content></Table.ScrollContainer>
      <Table.Footer><Pagination size="sm"><Pagination.Summary>{s} a {e} de {source.length}</Pagination.Summary><Pagination.Content><Pagination.Item><Pagination.Previous isDisabled={!table.getCanPreviousPage()} onPress={()=>table.previousPage()}><Pagination.PreviousIcon/>Ant</Pagination.Previous></Pagination.Item>{pages.map(p=><Pagination.Item key={p}><Pagination.Link isActive={p===pageIndex+1} onPress={()=>table.setPageIndex(p-1)}>{p}</Pagination.Link></Pagination.Item>)}<Pagination.Item><Pagination.Next isDisabled={!table.getCanNextPage()} onPress={()=>table.nextPage()}>Sig<Pagination.NextIcon/></Pagination.Next></Pagination.Item></Pagination.Content></Pagination></Table.Footer>
    </Table>
  );
}
