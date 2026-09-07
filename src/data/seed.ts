export const kpis = { total:42, empleados:38, practicantes:4, presentes:35, tardanzas:4, faltas:3 };
export const people = [
  {id:"1", nombre:"Carlos Mendoza", tipo:"Empleado", area:"Desarrollo", cargo:"Desarrollador", horario:"08:00 - 17:00", estado:"Activo"},
  {id:"2", nombre:"María López", tipo:"Empleado", area:"RR.HH.", cargo:"Analista", horario:"08:00 - 17:00", estado:"Activo"},
  {id:"3", nombre:"José Ramos", tipo:"Practicante", area:"Desarrollo", cargo:"Ing. Sistemas", horario:"09:00 - 15:00", estado:"Activo"},
  {id:"4", nombre:"Ana Torres", tipo:"Practicante", area:"Marketing", cargo:"Marketing", horario:"09:00 - 15:00", estado:"Activo"},
];
export const alerts = [
  {id:1, text:"2 empleados no registraron salida", href:"/asistencias"},
  {id:2, text:"3 tardanzas requieren revisión", href:"/incidencias"},
  {id:3, text:"1 proyecto próximo a vencer", href:"/proyectos"},
  {id:4, text:"1 practicante sin proyecto", href:"/personal"},
];
export const projects = [
  {id:"1", titulo:"Sistema de Inventario", estado:"En desarrollo", avance:65, vencimiento:"2026-09-20"},
  {id:"2", titulo:"Landing Corporativa", estado:"En revisión", avance:90, vencimiento:"2026-09-10"},
];
