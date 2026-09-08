-- ASISTEN-DSG init — Supabase (Postgres)
-- Filosofia: sin romper frontend. Enums + RLS + trigger incidencia (no descuento)
-- Ejecuta en Supabase SQL Editor

-- Extensions
create extension if not exists "pgcrypto";

-- Enums
do $$ begin create type tipo_persona as enum ('Empleado','Practicante'); exception when duplicate_object then null; end $$;
do $$ begin create type estado_persona as enum ('Activo','Inactivo'); exception when duplicate_object then null; end $$;
do $$ begin create type estado_asistencia as enum ('Presente','Tardanza','Falta','Sin salida'); exception when duplicate_object then null; end $$;
do $$ begin create type tipo_incidencia as enum ('Tardanza','Falta','Sin marcación','Salida anticipada'); exception when duplicate_object then null; end $$;
do $$ begin create type estado_incidencia as enum ('Pendiente','Justificada','Rechazada'); exception when duplicate_object then null; end $$;
do $$ begin create type estado_proyecto as enum ('En desarrollo','Por vencer','Finalizado','En revisión'); exception when duplicate_object then null; end $$;

-- Companies
create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  razon_social text not null default 'DSG PERU TECHNOLOGY SAC',
  ruc char(11),
  direccion text,
  email text,
  telefono text,
  tolerancia_default_min int not null default 10,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Profiles (personal) 1-1 auth.users
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid references companies(id) on delete set null,
  dni char(8) unique,
  nombres text not null,
  apellidos text not null,
  email text unique,
  movil char(9),
  avatar_url text,
  tipo tipo_persona not null default 'Empleado',
  area text,
  cargo text,
  horario_id uuid,
  estado estado_persona not null default 'Activo',
  fecha_ingreso date default current_date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Horarios
create table if not exists horarios (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade not null,
  nombre text not null,
  dias_laborales text not null default 'Lun - Vie',
  hora_entrada time not null,
  hora_salida time not null,
  tolerancia_min int not null default 10,
  es_estandar boolean default false,
  estado estado_persona not null default 'Activo',
  created_at timestamptz default now()
);
alter table profiles add constraint fk_profiles_horario foreign key (horario_id) references horarios(id) on delete set null;

-- Proyectos
create table if not exists proyectos (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade not null,
  titulo text not null,
  practicante_id uuid references profiles(id) on delete set null,
  estado estado_proyecto not null default 'En desarrollo',
  avance smallint not null default 0 check (avance between 0 and 100),
  fecha_vencimiento date,
  descripcion text,
  created_at timestamptz default now()
);

-- Asistencias
create table if not exists asistencias (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade not null,
  profile_id uuid references profiles(id) on delete cascade not null,
  horario_id uuid references horarios(id) on delete set null,
  fecha date not null default current_date,
  hora_entrada time,
  hora_salida time,
  estado estado_asistencia not null default 'Presente',
  minutos_tardanza int,
  observacion text,
  editado_por uuid references profiles(id),
  editado_at timestamptz,
  created_at timestamptz default now(),
  unique(profile_id, fecha)
);
create index if not exists idx_asistencias_fecha on asistencias(fecha);
create index if not exists idx_asistencias_profile on asistencias(profile_id);

-- Incidencias (generada por asistencia, no descuento automático)
create table if not exists incidencias (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade not null,
  profile_id uuid references profiles(id) on delete cascade not null,
  asistencia_id uuid references asistencias(id) on delete set null,
  tipo tipo_incidencia not null,
  fecha timestamptz not null default now(),
  detalle text,
  estado estado_incidencia not null default 'Pendiente',
  justificacion text,
  justificado_por uuid references profiles(id),
  justificado_at timestamptz,
  created_at timestamptz default now()
);

-- Module settings
create table if not exists module_settings (
  company_id uuid primary key references companies(id) on delete cascade,
  asistencias boolean default true,
  horarios boolean default true,
  incidencias boolean default true,
  practicantes boolean default true,
  proyectos boolean default true,
  seguimiento boolean default true,
  reportes boolean default true
);

-- Audit
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  tabla text not null,
  registro_id uuid,
  accion text not null,
  usuario_id uuid references profiles(id),
  motivo text,
  datos jsonb,
  created_at timestamptz default now()
);

-- Trigger: asistencia -> incidencia (regla negocio)
create or replace function trg_asistencia_incidencia() returns trigger as $$
begin
  if new.estado in ('Tardanza','Falta','Sin salida') then
    insert into incidencias (company_id, profile_id, asistencia_id, tipo, detalle)
    values (
      new.company_id, new.profile_id, new.id,
      case when new.estado='Tardanza' then 'Tardanza'::tipo_incidencia when new.estado='Falta' then 'Falta'::tipo_incidencia else 'Sin marcación'::tipo_incidencia end,
      case when new.estado='Tardanza' then coalesce(new.minutos_tardanza::text,'?')||' min tardanza' else new.estado end
    )
    on conflict do nothing;
  end if;
  return new;
end; $$ language plpgsql;

drop trigger if exists asistencia_incidencia on asistencias;
create trigger asistencia_incidencia after insert or update of estado on asistencias
for each row execute function trg_asistencia_incidencia();

-- RLS (habilitado, políticas permisivas para demo; ajustar a auth en prod)
alter table companies enable row level security;
alter table profiles enable row level security;
alter table horarios enable row level security;
alter table proyectos enable row level security;
alter table asistencias enable row level security;
alter table incidencias enable row level security;
alter table module_settings enable row level security;
alter table audit_logs enable row level security;

do $$ begin
  create policy "allow all" on companies for all using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin create policy "allow all" on profiles for all using (true) with check (true); exception when duplicate_object then null; end $$;
do $$ begin create policy "allow all" on horarios for all using (true) with check (true); exception when duplicate_object then null; end $$;
do $$ begin create policy "allow all" on proyectos for all using (true) with check (true); exception when duplicate_object then null; end $$;
do $$ begin create policy "allow all" on asistencias for all using (true) with check (true); exception when duplicate_object then null; end $$;
do $$ begin create policy "allow all" on incidencias for all using (true) with check (true); exception when duplicate_object then null; end $$;
do $$ begin create policy "allow all" on module_settings for all using (true) with check (true); exception when duplicate_object then null; end $$;
do $$ begin create policy "allow all" on audit_logs for all using (true) with check (true); exception when duplicate_object then null; end $$;

-- Seed company
insert into companies (id, razon_social, ruc) values ('00000000-0000-0000-0000-000000000001','DSG PERU TECHNOLOGY SAC','20601234567') on conflict (id) do nothing;
insert into module_settings (company_id) values ('00000000-0000-0000-0000-000000000001') on conflict (company_id) do nothing;
