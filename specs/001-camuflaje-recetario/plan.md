# Plan 001: Recetario Casero (Camuflaje)

> Cómo y con qué. Lo escribe el Planificador a partir de `spec.md`.

## Decisiones

| Decisión | Elegimos | Por qué |
|---|---|---|
| Frontend | JavaScript vanilla con módulos ES, sin framework | Ya está así; cero dependencias y carga rápida en celulares modestos |
| Empaquetado | Vite 6 | Ya está; build simple y estático |
| Mapa | Leaflet | Ya está; funciona sin claves ni cuentas |
| Compartir receta | Vista previa propia con texto y destinatario antes de abrir WhatsApp; SVG locales para las acciones | Mantiene la confirmación explícita, no añade paquetes ni carga iconos externos |
| Datos | `localStorage` del navegador | Sin backend: nada sale del dispositivo (principio 5) |
| Sin conexión | Service worker + manifiesto (PWA) | Ya está; instalable desde el navegador |
| Pruebas | **Vitest** (solo desarrollo) | Es la herramienta natural de Vite; cubre la lógica pura. Lo demás, checklist manual |
| Despliegue | GitHub Pages por GitHub Actions | Gratis, HTTPS (necesario para instalar y geolocalizar) y enlace público para la entrega |
| Entrada a configuración | Alias de hash neutro + 5 toques al título | Funciona sin backend y sin pista visible |
| Acceso a orientación | Bienestar fuera de la navegación principal; acceso explícito «Bienestar y apoyo» desde Preferencias | Reduce su exposición casual sin borrar contenido ni depender de un gesto oculto; no se presenta como invisibilidad |
| Claves de storage | No se renombran en este sprint | Evita migraciones con poco tiempo; riesgo documentado abajo |

## Arquitectura (lo que ya existe)

```
src/
  main.js            ← arranque, rutas por hash, manejo de clics
  state/appState.js  ← estado temporal (modo app/setup/demo, modal, chat)
  services/          ← storage, geolocation, sharing (WhatsApp), map
  views/             ← home, search, favorites, recipeDetail, safePoints, wellbeing, setup, demo
  components/        ← modal, navigation, recipeCard, toast
  data/              ← recipes, wellbeing, safePoints (ejemplos)
  utils/             ← security (escapeHTML), validation
public/              ← manifest, service-worker, iconos, imágenes
```

## Cambios del sprint

### Almacenamiento (`services/storage.js`)

| Clave | Contenido | ¿La borra "Borrar mis datos"? |
|---|---|---|
| `camuflaje.favorites` | recetas favoritas | Sí |
| `camuflaje.profile` | receta de confianza y contactos | Sí |
| `camuflaje.theme` | tema claro/oscuro | Sí |
| `camuflaje.prefs` *(nueva, RF-17)* | tamaño de letra, vista, nombre | Sí |
| `camuflaje.onboarded` *(nueva, RF-12)* | `"1"` si ya vio la configuración | **No**, para que no reaparezca sola |

> Ajustar al código real de `storage.js`: la clave `onboarded` va **fuera** del objeto de claves que borra `clearAppData()`.

### Arranque y rutas (`main.js`)

- Constantes `SETUP_HASH` y `DEMO_HASH` con valores neutros (ej. `#r-4821`, `#d-4821`; **cámbienlos antes de la demo**).
- `route()` reconoce esos alias en lugar de `#setup` y `#demo`.
- Al arrancar: si hay perfil previo y no hay marca, se marca; si no hay marca y no hay hash, `location.replace(SETUP_HASH)`.
- Salir de la configuración (`skip-setup`, `quick-exit`, fin del paso 3, `leave-demo`, `clear-app-data`) llama `markOnboarded()` y `navigateToApp()` (que limpia el hash con `replaceState`).

### Pantalla de configuración (`views/setup.js`)

- Paso 0: tres tarjetas con ícono y una frase cada una.
  1. 🍲 Tu receta es una señal secreta.
  2. 🤝 Compártela con alguien de confianza: sabrá que la necesitas *ahora*. Acuerden antes qué hacer y qué no.
  3. 🔒 No llama a emergencias ni te vigila. Tú decides cada envío.
- Botón **"Salir rápido ✕"** fijo arriba a la derecha en todos los pasos (coral, texto blanco, ícono).
- Paso de contactos: prefijo +51, `inputmode="numeric"`, 2 obligatorios, tercero opcional.
- Paso final: indica cómo volver (gesto de 5 toques) y ofrece Demostración y **Borrar mis datos**.

### Engranaje (`main.js`, `renderSettings`)

Preferencias conserva las opciones del recetario: tema (☀️/🌙), tamaño de letra, vista, nombre, limpiar favoritas e instalar. Añade un acceso separado, claramente identificado como «Bienestar y apoyo», que abre la vista de orientación existente. Se retiran los enlaces a configuración y demo, el borrado total y la frase "No ofrece monitoreo…". Este acceso secundario no es invisible ni una garantía de seguridad.

### Gesto secreto

- `<h1>` del encabezado con `data-action="title-tap"`; **sin** cambio de cursor, estilo ni `aria-label`.
- Lógica pura en `src/utils/tapSequence.js` (recibe una función de hora para poder probarla): 5 toques, ventana de 1,5 s entre toques.
- Accesibilidad: quien no pueda usar el gesto entra por el enlace que le da la facilitadora.

## Pruebas

- **Vitest + jsdom** para: `onboarding` (marca y migración), `tapSequence`, normalización de teléfono y `contactMessageURL`, y `clearAppData`.
- **Checklist manual** (`docs/PRUEBAS-MANUALES.md`, a crear en T13) en un celular real: primera apertura, salir rápido, recarga, gesto, borrar, instalar, modo sin conexión, ubicación, WhatsApp.
- Para la receta de confianza se usa una redacción provisional que no invita a acudir a ningún lugar; validarla con Makipuray antes del uso real (P-2).

## Despliegue

- `vite.config.js`: `base` con el nombre del repositorio (GitHub Pages sirve en una subruta).
- Revisar que el service worker y el manifiesto usen rutas relativas; **subir la versión del caché** en cada entrega.
- Workflow de GitHub Actions: `npm ci` → `npm run build` → publicar `dist/` en Pages.
- Verificar en celular real: HTTPS, instalación, sin conexión y permiso de ubicación.
- Verificar en ≈360 px y escritorio que Bienestar no figura en la navegación principal, que «Bienestar y apoyo» está disponible en Preferencias y que artículos, teléfonos y asistente siguen accesibles.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Alguien con el celular abre el enlace oculto y ve los contactos guardados | Documentado como límite; mitigación futura: PIN o no precargar contactos |
| Las claves `camuflaje.*` delatan la app al inspeccionar el navegador | Documentado; renombrar en la fase de planeación (dic) |
| Mensaje de WhatsApp queda en el historial | Orientación: mensajes temporales o borrar el chat |
| Puntos del mapa de ejemplo se confunden con reales | Etiqueta "ejemplo no verificado" visible; verificar con Makipuray antes de lanzar |
| Teléfonos de apoyo desactualizados | Confirmar en fuentes oficiales antes de la demo (P-3) |
| Service worker sirve versión vieja | Subir versión del caché en cada despliegue |
| Poco tiempo (entrega dom 15) | Orden de prioridad Must > Should > Could; congelar el domingo 6 p. m. |

## Cronograma

| Día | Meta |
|---|---|
| **Jue 12** | Docs a `main` por PR, issues en el tablero. RF-11, RF-12, RF-13 |
| **Vie 13** | RF-14, RF-15, RF-16. Despliegue en Pages funcionando |
| **Sáb 14** | RF-18 y RF-17. Pruebas. Prueba en celular real. README y pitch |
| **Dom 15** | Congelar a las 6 p. m. Solo arreglos. **Entrega 11:59 p. m.** |
| **Lun 16** | Fase presencial 3 a 7 p. m. (pitch de 5 min + prueba en vivo) |