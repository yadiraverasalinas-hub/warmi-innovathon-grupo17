# AGENTS.md

Instrucciones para cualquier agente de IA (Copilot, OpenCode) que trabaje en este repo.

## Proyecto

**Recetario Casero** (nombre interno: *Camuflaje*): una app web instalable (PWA) que se ve y funciona como un recetario, pero que permite a una mujer en riesgo pedir ayuda de forma rápida y discreta. Reto: Warmi Innovathon, Eje 3 (Prevención y seguridad).

- Spec vigente: `specs/001-camuflaje-recetario/spec.md`
- Plan: `specs/001-camuflaje-recetario/plan.md`
- Tareas: `specs/001-camuflaje-recetario/tasks.md`
- Principios: `docs/constitution.md`

## Stack y comandos

Vite 6 · JavaScript vanilla con módulos ES · Leaflet · localStorage · service worker. Sin frameworks.

```sh
npm install
npm run dev        # desarrollo
npm run build      # producción
npm run preview    # revisar el build
npm test           # pruebas (cuando exista la tarea T12)
```

## Spec-Driven Development

1. Sin spec no hay código.
2. Todo issue y PR cita su RF (RF-1, RF-2…).
3. Las pruebas salen de la spec.
4. Si cambia la idea, cambia primero la spec.

## Reglas de seguridad del producto (obligatorias)

Esta app puede usarla una persona en peligro. Un error aquí no es solo un bug.

- **Cero datos reales** en el repo, commits, issues, PRs o chats con la IA: ni teléfonos, ni nombres, ni ubicaciones. Los datos de muestra deben estar marcados como ejemplo.
- **No afirmar lo que no está verificado.** Los puntos del mapa son de demostración; nunca los llames "seguros" ni "verificados".
- **Ubicación solo tras una acción explícita** de la usuaria. No se guarda ni se envía en segundo plano.
- **Todo texto que escribe la usuaria** pasa por `escapeHTML` (`src/utils/security.js`).
- **Sin analítica, trackers ni peticiones a terceros** (salvo los enlaces que la usuaria abre a propósito: WhatsApp, mapas).
- **Sin IA generativa en las respuestas de apoyo.** El asistente usa respuestas predefinidas y revisadas.
- **El recetario no delata la función de ayuda.** Fuera de la pantalla de configuración oculta, ningún texto ni enlace habla de configuración, tutorial, borrado ni de la señal. (El contenido de la pestaña Bienestar ya existe y se mantiene como está.)
- **No renombrar las claves de localStorage** en este sprint (riesgo conocido, ver plan.md).
- No agregar dependencias sin preguntar. `vitest` (solo desarrollo) está aprobado en el plan.

## Git y GitHub

- Nunca cambies `main` directamente.
- Una tarea = un issue = una rama (`14-salir-rapido`) = un PR.
- Commits pequeños y en español. Texto de la app en español; nombres de código en inglés.
- El PR dice `Closes #N`, cita sus RF y se abre con la skill `abrir-pr`.
- **La IA propone, una persona decide.** Nunca hagas merge.
- Pruebas y `npm run build` en verde antes de abrir el PR.

## Comandos peligrosos

Si vas a usar `git push --force`, `git reset --hard`, `git clean -fd`, `git restore .` o `git rebase`: **detente, explica qué hace y espera confirmación.** Nunca `push --force` en `main`.

## Con el MCP de GitHub

Di qué vas a hacer y espera confirmación antes de crear issues, ramas o PRs. Si el tablero no se puede mover por MCP, indica a la persona que lo mueva en la web.

## Definición de terminado

- [ ] Cumple el "Hecho cuando" de su tarea en `tasks.md`.
- [ ] Prueba(s) del RF en verde y `npm run build` sin errores.
- [ ] Revisado en pantalla de móvil (≈360 px).
- [ ] Sin secretos ni datos reales en el diff.
- [ ] README o spec actualizados si cambió el comportamiento.