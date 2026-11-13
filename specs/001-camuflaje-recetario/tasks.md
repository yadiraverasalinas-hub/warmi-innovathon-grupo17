# Tareas 001: Recetario Casero (Camuflaje)

> Cada tarea = un issue del tablero = una rama = un PR (`Closes #N`).
> Menos de una hora cada una. Completar el número de issue y la dueña al crearlos.

**Columnas del tablero:** Por hacer · En progreso · En revisión · Hecho
**Campos:** Área y RF

## Día 1 · Jueves 12

- [ ] **T1. Subir docs al repo** (AGENTS, constitución, spec, plan, tareas) · Área: docs y pitch · Issue: #__ · Dueña: __
  Hecho cuando: los 5 archivos están en `main` por PR y el equipo los revisó.

- [ ] **T2. Servicio de "ya configurada"** (RF-12) · Área: backend y datos · Issue: #__ · Dueña: __
  Hecho cuando: existen `isOnboarded()` y `markOnboarded()` fuera de las claves que borra `clearAppData()`; con perfil previo se marca sola; prueba unitaria en verde.

- [ ] **T3. Arranque y rutas con alias neutros** (RF-11, RF-12, RF-15) · Área: frontend · Issue: #__ · Dueña: __
  Hecho cuando: con storage vacío "/" abre la configuración; `route()` usa `SETUP_HASH` y `DEMO_HASH`; recargar tras salir no la reabre.

- [ ] **T4. Diseño: primera pantalla en tres tarjetas** (RF-11) · Área: diseño · Issue: #__ · Dueña: __
  Hecho cuando: hay boceto con las 3 tarjetas (ícono + una frase) y la lista de recetas, sin bloques de texto largos; aprobado por el equipo.

- [ ] **T5. Pantalla de bienvenida en tarjetas** (RF-11) · Área: frontend · Issue: #__ · Dueña: __ · Depende de T4
  Hecho cuando: el paso 0 muestra las tres tarjetas y la elección de receta en una sola pantalla en móvil (≈360 px).

- [ ] **T6. Botón "Salir rápido"** (RF-13) · Área: frontend + diseño · Issue: #__ · Dueña: __ · Depende de T2
  Hecho cuando: visible y llamativo (coral, texto blanco, ícono) en todos los pasos; al tocarlo vuelve al recetario, no guarda nada y no reabre la configuración.

## Día 2 · Viernes 13

- [ ] **T7. Limpiar el engranaje** (RF-14) · Área: frontend · Issue: #__ · Dueña: __
  Hecho cuando: Ajustes solo ofrece tema (☀️/🌙) e instalar; no quedan textos de configuración, demo, borrado ni "monitoreo".

- [ ] **T8. Gesto de 5 toques al título** (RF-15) · Área: frontend + backend y datos · Issue: #__ · Dueña: __ · Depende de T3
  Hecho cuando: `tapSequence.js` con prueba (5 toques <1,5 s abren; con pausa, no); el título no se ve interactivo.

- [ ] **T9. Demo y borrado dentro de la configuración** (RF-16) · Área: frontend · Issue: #__ · Dueña: __ · Depende de T2, T3
  Hecho cuando: la configuración ofrece "Ver demostración" y "Borrar mis datos"; al borrar vuelve al recetario, quita el hash y no reabre la configuración.

- [ ] **T10. Despliegue en GitHub Pages** (RF-9) · Área: despliegue · Issue: #__ · Dueña: __
  Hecho cuando: hay enlace público con HTTPS; `base` correcto; workflow en verde; el service worker sube versión de caché.

- [ ] **T11. Validar textos y acuerdo con Makipuray** (P-1, P-2, P-3, P-5) · Área: docs y pitch · Issue: #__ · Dueña: __
  Hecho cuando: la mentora revisó el mensaje de la señal (el actual dice "ven a probarla" e invita a ir), las pautas de `docs/ACUERDO-DE-CONFIANZA.md`, el contenido de Bienestar y los teléfonos; los cambios están anotados en la spec y, si cambia el mensaje, existe un issue para ajustarlo en `services/sharing.js`.

## Día 3 · Sábado 14

- [ ] **T12. Pruebas con Vitest** (RF-4, 5, 10, 12, 15, 18) · Área: pruebas · Issue: #__ · Dueña: __
  Hecho cuando: `npm test` corre en verde con pruebas de onboarding, tapSequence, teléfono/mensaje y borrado.

- [ ] **T13. Checklist manual en celular real** (RF-11 al 16) · Área: pruebas · Issue: #__ · Dueña: __
  Hecho cuando: `docs/PRUEBAS-MANUALES.md` existe y se ejecutó completo en un Android y un iPhone (o dos navegadores móviles), con resultados anotados.

- [ ] **T14. Contactos con +51 y tercero opcional** (RF-18) · Área: frontend · Issue: #__ · Dueña: __
  Hecho cuando: el prefijo viene puesto, el teclado es numérico, con 1 contacto no se continúa y el tercero se agrega con "+ Agregar otra".

- [ ] **T15. Opciones extra del engranaje** (RF-17, *Could*) · Área: frontend · Issue: #__ · Dueña: __
  Hecho cuando: tamaño de letra, vista cuadros/lista, nombre y "limpiar favoritas" funcionan y persisten en `camuflaje.prefs`. *Si no hay tiempo, se descarta sin afectar la entrega.*

- [ ] **T16. README final** · Área: docs y pitch · Issue: #__ · Dueña: __
  Hecho cuando: el README explica el problema, cómo probar el MVP, límites de seguridad y siguientes pasos, y lo puede leer alguien que no conoce el proyecto.

- [ ] **T19. Guía del acuerdo de confianza** (spec, "Cómo funciona") · Área: docs y pitch · Issue: #__ · Dueña: __
  Hecho cuando: `docs/ACUERDO-DE-CONFIANZA.md` está revisado por la mentora y marcado como validado (o con los cambios que pidió).

- [ ] **T17. Guion del pitch y ensayo** · Área: docs y pitch · Issue: #__ · Dueña: __
  Hecho cuando: `docs/PITCH.md` está completo, se ensayó dos veces con cronómetro (≤5 min) y la demo en vivo se probó con el enlace público.

## Día 4 · Domingo 15

- [ ] **T18. Congelar y revisar entrega** · Área: despliegue + pruebas · Issue: #__ · Dueña: __
  Hecho cuando: a las 6 p. m. `main` queda congelado; con la skill `revisar-entrega` no falta nada: enlace del MVP activo, repositorio con README, pitch listo; entrega enviada antes de las 11:59 p. m.

## Orden de prioridad

1. **Must:** T1, T2, T3, T4, T5, T6, T7, T8, T9, T10 (RF-11 al 16)
2. **Should:** T11, T12, T13, T14, T19 (validación, pruebas, RF-18, guía del acuerdo)
3. **Could:** T15 (RF-17 extras)
4. **Entrega:** T16, T17, T18
