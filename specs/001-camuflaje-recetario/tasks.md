# Tareas 001: Recetario Casero (Camuflaje)

> Cada tarea = un issue del tablero = una rama = un PR (`Closes #N`).
> Menos de una hora cada una. Completar el número de issue y la dueña al crearlos.

**Columnas del tablero:** Por hacer · En progreso · En revisión · Hecho
**Campos:** Área y RF

## Día 1 · Jueves 12

- [ ] **T1. Subir docs al repo** (AGENTS, constitución, spec, plan, tareas) · Área: docs y pitch · Issue: #__ · Dueña: __
  Hecho cuando: los 5 archivos están en `main` por PR y el equipo los revisó.

- [ ] **T2. Servicio de configuración completada** (RF-12) · Área: backend y datos · Issue: #__ · Dueña: __
  Hecho cuando: `markSetupCompleted()` conserva el estado fuera de las claves que borra `clearAppData()`; un perfil previo sin PIN puede completar la migración.

- [ ] **T3. Arranque y configuración de una sola vez** (RF-11, RF-12) · Área: frontend · Issue: #__ · Dueña: __
  Hecho cuando: con storage vacío "/" abre la configuración; tras completar o salir no se reabre sola; perfiles anteriores pueden crear el PIN inicial.

- [ ] **T4. Diseño: primera pantalla en tres tarjetas** (RF-11) · Área: diseño · Issue: #__ · Dueña: __
  Hecho cuando: hay boceto con las 3 tarjetas (ícono + una frase) y la lista de recetas, sin bloques de texto largos; aprobado por el equipo.

- [ ] **T5. Pantalla de bienvenida en tarjetas** (RF-11) · Área: frontend · Issue: #__ · Dueña: __ · Depende de T4
  Hecho cuando: el paso 0 muestra las tres tarjetas y la elección de receta en una sola pantalla en móvil (≈360 px).

- [ ] **T6. Botón "Salir rápido"** (RF-13) · Área: frontend + diseño · Issue: #__ · Dueña: __ · Depende de T2
  Hecho cuando: visible y llamativo (coral, texto blanco, ícono) en todos los pasos; al tocarlo vuelve al recetario, no guarda nada y no reabre la configuración.

## Día 2 · Viernes 13

- [ ] **T7. Limpiar el engranaje** (RF-14) · Área: frontend · Issue: #__ · Dueña: __
  Hecho cuando: Preferencias conserva las opciones del recetario pero no ofrece Bienestar, acceso a configuración ni borrado total.

- [ ] **T8. Acceso PIN desde calculadora** (RF-15, RF-19) · Área: frontend + backend y datos · Issue: #__ · Dueña: __ · Depende de T3
  Hecho cuando: la calculadora ajusta porciones y solo el PIN correcto abre apoyo; el PIN incorrecto no confirma el resultado.

- [ ] **T9. Actualización y borrado desde apoyo** (RF-16) · Área: frontend · Issue: #__ · Dueña: __ · Depende de T2, T3, T8
  Hecho cuando: tras validar el PIN se pueden actualizar contactos/PIN o borrar los datos; al borrar vuelve al recetario.

- [ ] **T10. Despliegue en GitHub Pages** (RF-9) · Área: despliegue · Issue: #__ · Dueña: __
  Hecho cuando: hay enlace público con HTTPS; `base` correcto; workflow en verde; el service worker sube versión de caché.

- [ ] **T11. Validar textos y acuerdo con Makipuray** (P-1, P-2, P-3, P-5) · Área: docs y pitch · Issue: #__ · Dueña: __
  Hecho cuando: la mentora revisó el texto provisional actual (que no invita a acudir), las pautas de `docs/ACUERDA-DE-CONFIANZA.md`, el contenido de Bienestar y los teléfonos; los cambios están anotados en la spec y cualquier ajuste posterior al mensaje se gestiona mediante un issue antes de modificar `services/sharing.js`.

## Día 3 · Sábado 14

- [ ] **T12. Pruebas con Vitest** (RF-4, 5, 10, 12, 15, 18–21, 25–31) · Área: pruebas · Issue: #__ · Dueña: __
  Hecho cuando: `npm test` corre en verde con pruebas de PIN, calculadora, temporizador, auto-cierre, teléfono/mensaje y borrado.

- [ ] **T13. Checklist manual en celular real** (RF-11 al 31) · Área: pruebas · Issue: #__ · Dueña: __
  Hecho cuando: `docs/PRUEBAS-MANUALES.md` existe y se ejecutó completo en un Android y un iPhone (o dos navegadores móviles), con resultados anotados.

- [ ] **T14. Contactos con +51 y tercero opcional** (RF-18) · Área: frontend · Issue: #__ · Dueña: __
  Hecho cuando: el prefijo viene puesto, el teclado es numérico, con 1 contacto no se continúa y el tercero se agrega con "+ Agregar otra".

- [ ] **T15. Opciones extra del engranaje** (RF-17, *Could*) · Área: frontend · Issue: #__ · Dueña: __
  Hecho cuando: tamaño de letra, vista cuadros/lista, nombre y "limpiar favoritas" funcionan y persisten en `camuflaje.preferences`. *Si no hay tiempo, se descarta sin afectar la entrega.*

- [ ] **T16. README final** · Área: docs y pitch · Issue: #__ · Dueña: __
  Hecho cuando: el README explica el problema, cómo probar el MVP, límites de seguridad y siguientes pasos, y lo puede leer alguien que no conoce el proyecto.

- [ ] **T19. Guía del acuerdo de confianza** (spec, "Cómo funciona") · Área: docs y pitch · Issue: #__ · Dueña: __
  Hecho cuando: `docs/ACUERDA-DE-CONFIANZA.md` está revisado por la mentora y marcado como validado (o con los cambios que pidió).

- [ ] **T17. Guion del pitch y ensayo** · Área: docs y pitch · Issue: #__ · Dueña: __
  Hecho cuando: `docs/PITCH.md` está completo, se ensayó dos veces con cronómetro (≤5 min) y la demo en vivo se probó con el enlace público.

## Día 4 · Domingo 15

- [ ] **T18. Congelar y revisar entrega** · Área: despliegue + pruebas · Issue: #__ · Dueña: __
  Hecho cuando: a las 6 p. m. `main` queda congelado; con la skill `revisar-entrega` no falta nada: enlace del MVP activo, repositorio con README, pitch listo; entrega enviada antes de las 11:59 p. m.

## Alcance añadido: PIN, temporizador y material del pitch

- [ ] **T24. Acceso discreto a la configuración** (RF-23) · Área: frontend · Issue: #__ · Dueña: __
  Hecho cuando: cinco toques al título en tres segundos abren la configuración; el acceso no está anunciado en la interfaz ni abre Bienestar.

- [ ] **T25. Salida al pasar a segundo plano** (RF-24) · Área: frontend · Issue: #__ · Dueña: __
  Hecho cuando: cualquier vista vuelve al recetario al ocultarse la app; el botón «Salir rápido» permanece accesible en Bienestar.

- [ ] **T20. PIN de apoyo y calculadora de porciones** (RF-15, RF-19) · Área: frontend + privacidad · Issue: #__ · Dueña: __
  Hecho cuando: la usuaria configura un PIN en el alta, la calculadora ajusta cantidades y el PIN abre el apoyo sin aparecer en Preferencias.

- [ ] **T21. Cierre por inactividad** (RF-20) · Área: frontend · Issue: #__ · Dueña: __
  Hecho cuando: configuración, Preferencias y apoyo vuelven al recetario tras 60 segundos sin interacción.

- [ ] **T22. Temporizador de cocina/check-in** (RF-21) · Área: frontend + seguridad · Issue: #__ · Dueña: __
  Hecho cuando: el vencimiento activo muestra opciones manuales y no envía mensajes ni ubicación automáticamente; limitación PWA explicada.

- [ ] **T23. Tarjeta impresa con QR** (RF-22) · Área: docs y pitch · Issue: #__ · Dueña: __
  Hecho cuando: anverso tiene receta real, reverso QR verificado y URL de respaldo; se entrega al jurado.

- [ ] **T26. Señal de vibración al vencer el temporizador** (RF-30) · Área: frontend + accesibilidad · Issue: #__ · Dueña: __
  Hecho cuando: al vencer con la app abierta se intenta una sola vibración breve si es compatible; el aviso visual aparece siempre y la app no presenta la vibración como garantía.

- [ ] **T27. Confirmación discreta del PIN** (RF-31) · Área: frontend + privacidad · Issue: #__ · Dueña: __
  Hecho cuando: tras validar el PIN aparece brevemente «Receta especial lista.» sin cambiar el título o apariencia del recetario.

- [ ] **T28. Tutorial y simulación de la receta especial** (RF-32) · Área: frontend + privacidad · Issue: #__ · Dueña: __
  Hecho cuando: el tutorial acompaña acciones reales en Favoritas, receta, calculadora, PIN, Tiendas, Bienestar y compartir; explica que Tiendas muestra ejemplos no verificados, mantiene la tarjeta visible sobre los modales, no avanza sin la acción esperada y termina en la vista previa de compartir con «Terminar» y «Salir», sin abrir WhatsApp ni enviar mensajes.

## Orden de prioridad

1. **Must:** T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T20, T21, T24, T25 (RF-11 al 20 y RF-23–24)
2. **Should:** T11, T12, T13, T14, T19, T22, T23, T26, T27 (validación, pruebas, RF-18, RF-21, RF-22, RF-30–31 y guía del acuerdo)
3. **Could:** T15 (RF-17 extras)
4. **Entrega:** T16, T17, T18
