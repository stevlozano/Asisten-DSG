export type ModuleSettings = {
  asistencias: boolean; horarios: boolean; incidencias: boolean;
  practicantes: boolean; proyectos: boolean; seguimiento: boolean;
  reportes: boolean;
};
export const defaultModules: ModuleSettings = {
  asistencias:true, horarios:true, incidencias:true,
  practicantes:true, proyectos:true, seguimiento:true, reportes:true
};
