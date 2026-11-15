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
npm test           # pruebas (cuando se configure el runner de T12)
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
- **El recetario mantiene una apariencia cotidiana (modo apoyo, RF-25).** Sin PIN, la app es solo un recetario: no hay Tiendas ni Bienestar en la navegación, ni contactos, ni receta de confianza, ni ubicación al compartir, ni enlaces a la configuración. La usuaria abre la calculadora de porciones y costos desde una receta e introduce el PIN que creó en la configuración inicial: eso activa el **modo apoyo** (mismo recetario, con Tiendas, Bienestar, compartir con contactos y ubicación, aviso de llegada y «Salir»). Todo acceso a esas funciones debe comprobar `appState.supportUnlocked`, no solo ocultar el botón. El modo apoyo vive solo en memoria y termina tras 60 segundos de inactividad, al ocultar la app o con «Salir». Cinco toques al título del recetario en tres segundos abren solo la configuración para gestionar el PIN y los contactos, nunca el apoyo directamente. El PIN es una barrera de discreción local, no una autenticación segura: alguien con acceso técnico al dispositivo puede inspeccionar o modificar la app.
- **Los temporizadores no vigilan ni envían por cuenta propia.** El temporizador de cocina y el aviso de llegada (RF-27) solo funcionan mientras la app permanece abierta. Al vencer, el sistema intenta una vibración breve una sola vez si el navegador y el dispositivo la admiten; el aviso visual sigue siendo la señal principal. En modo apoyo, al iniciar el aviso se consulta la ubicación (la usuaria acaba de pulsar «Iniciar») y se conserva solo en memoria; al vencer se intenta refrescar y la usuaria envía el mensaje con un toque desde WhatsApp. **No se envían mensajes ni ubicaciones automáticamente**: un navegador no puede hacerlo, y el envío automático requeriría un servidor o SMS (mejora futura que debe pasar primero por la spec). Ubicación y destino se descartan al detener o cerrar el aviso.
- **Al desbloquear el modo apoyo**, se muestra solo el toast temporal «Receta especial lista.»; no se cambia el título ni la apariencia cotidiana del recetario.
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