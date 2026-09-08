-- Hace profiles independiente de auth para CRUD rápido (empleado/practicante sin necesidad de crear auth user)
alter table profiles alter column id drop default;
-- si ya existe FK a auth.users, la mantenemos opcional via user_id
alter table profiles add column if not exists user_id uuid references auth.users(id) on delete set null;
-- id pasa a ser uuid autogenerado si no viene de auth
alter table profiles alter column id set default gen_random_uuid();
