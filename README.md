# PC Piano Learner

Simulador de piano web que mapea el teclado QWERTY a notas musicales. Optimizado para teclados 60%.

## Stack

- Next.js 14 (App Router)
- Bun
- Tailwind CSS
- Tone.js
- Supabase

## Inicio rapido

```bash
bun install
bun run dev
```

Crear `.env.local` a partir de `.env.local.example` y configurar Supabase si usas lecciones.

## Estructura

- `components/KeyboardMapper` - Gestiona keydown/keyup, evita ghosting con Set()
- `components/PianoVisualizer` - Piano en pantalla con letras del teclado
- `lib/keyMap.ts` - Mapeo QWERTY a notas (C3-C5)
- `lib/tone-synth.ts` - Sintetizador Tone.js con polifonia
- `supabase/schema-lessons.sql` - Esquema de ejercicios

## Mapeo de teclas (60%)

- Fila Z: Z X C V B N M (blancas C3-B3)
- Fila S/D/G/H/J: teclas negras octava inferior
- Fila Q: Q W E R T Y U I (blancas C4-C5)
- Numeros 2 3 5 6 7: teclas negras octava superior
