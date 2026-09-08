alter table profiles add column if not exists rol text not null default 'admin' check (rol in ('dev','admin','empleado','practicante'));
-- dev user
update profiles set rol='dev' where email='stev@dsg.pe';
