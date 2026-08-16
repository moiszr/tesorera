# PROMPTS — Tesorera

Prompts listos para pegar en Claude Code, fase por fase.
Requisito: haber creado la carpeta con CLAUDE.md, PLAN.md y este archivo,
y haber instalado las skills (abajo).

---

## 0. Instalar las skills (una sola vez, desde la raíz del proyecto)

```bash
# Impeccable (skill + 23 comandos /impeccable)
npx impeccable install
# → elegir Claude Code, ámbito "project". Luego, dentro de Claude Code: /impeccable init

# Taste skills (elige las dos de la dirección visual)
npx skills add https://github.com/Leonxlnx/taste-skill --skill "high-end-visual-design"
npx skills add https://github.com/Leonxlnx/taste-skill --skill "minimalist-ui"

# Skills de animación de Emil Kowalski
npx skills add https://github.com/emilkowalski/skills --skill "emil-design-eng"
npx skills add https://github.com/emilkowalski/skills --skill "animate"
npx skills add https://github.com/emilkowalski/skills --skill "review-animations"
```

Reinicia Claude Code después de instalar para que detecte las skills.

---

## 1. Prompt inicial (Fase 0)

> Lee CLAUDE.md y PLAN.md completos antes de escribir una línea de código.
> Este proyecto es para mi mamá: la vara de calidad es que ella lo use sin que
> nadie le explique nada. Su laptop es **Windows**, así que `Tesorera.bat` es
> el launcher principal (ver sección 10 del PLAN).
>
> Ejecuta la **Fase 0** del PLAN: scaffold del proyecto exactamente con la
> estructura de la sección 4, la migración inicial de la sección 5, y los
> comandos npm de CLAUDE.md funcionando. Corre `/impeccable init` (superficie:
> product) antes de maquetar el layout base.
>
> Al terminar: verifica el criterio de aceptación de la fase, corre la app,
> y haz commit. No avances a la Fase 1 todavía.

## 2. Fases siguientes (mismo patrón)

> Lee CLAUDE.md y PLAN.md. Ejecuta la **Fase N** del PLAN.
> Antes de maquetar pantallas nuevas usa `/impeccable shape` y las skills de
> taste; para cualquier animación usa las skills de Emil.
> Al terminar: prueba a mano el criterio de aceptación, corre `npm test`,
> y haz commit con mensaje claro. Detente ahí y dime qué revisar.

## 3. Prompt de la Fase 4 (pulido de diseño)

> Lee CLAUDE.md y la sección 8 del PLAN. Vamos a la **Fase 4**.
> Recorre pantalla por pantalla con `/impeccable critique` y
> `/impeccable audit`, arregla los hallazgos, y luego `/impeccable polish`.
> Usa `review-animations` sobre toda animación existente y `animate` para el
> momento estrella: la barra de progreso al guardar un pago.
> Recuerda: usuaria no técnica, español, números protagonistas, estados por
> color consistentes. Muéstrame antes/después de lo que cambies.

## 4. Prompt del ensayo general (Fase 6)

> Ejecuta la **Fase 6** del PLAN: carga el seed, y actúa como si fueras mi mamá
> un domingo con una fila de hermanos pagando: registra 10 pagos seguidos,
> equivócate en uno y anúlalo, agrega una persona nueva a mitad de la fila,
> busca a alguien escribiendo sin tildes. Anota cada fricción (clics de más,
> textos confusos, esperas) y corrígela. Al final deja la base limpia con
> `npm run reset` y el evento configurado.

## 5. Prompts de mantenimiento útiles

- "Mi mamá dice que [problema]. Reprodúcelo con el seed, arréglalo y explícame
  el cambio en una frase."
- "/impeccable audit" — chequeo rápido de calidad visual tras cualquier cambio.
- "Agrega [función] siguiendo las reglas de oro de CLAUDE.md; si rompe la regla
  de las 3 acciones para registrar un pago, propón otra forma."
