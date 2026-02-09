-- Esquema para sistema de lecciones.
-- Ejecutar en el SQL Editor de Supabase.

create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  sequence jsonb not null default '[]'::jsonb,
  created_at timestamptz default now()
);

-- sequence: array de teclas PC en orden, ej: ["q", "w", "e", "r", "t", "y", "u"]
alter table public.exercises enable row level security;

create policy "Allow public read" on public.exercises
  for select using (true);
