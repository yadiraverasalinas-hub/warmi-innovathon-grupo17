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
| Acceso a orientación | Calculadora de porciones en una receta; el PIN de 6 dígitos creado en la configuración inicial abre Bienestar y apoyo | El recetario sigue siendo el flujo principal; el PIN es una barrera de discreción, no seguridad del dispositivo |
| Protección de datos del PIN | PBKDF2-SHA-256 con sal aleatoria mediante Web Crypto; solo se guarda el verificador local | No se guarda el PIN en texto claro ni se envía al servidor; una persona con acceso técnico aún puede inspeccionar la app |
| Retorno al recetario | 60 segundos sin actividad en vistas sensibles; al quedar oculta la app desde cualquier vista | Vuelve al recetario y limpia el contenido temporal; no borra el perfil |
| Temporizador/check-in | Temporizador en una ficha de receta; al vencer, aviso y decisión manual de compartir | Una PWA no asegura tareas en segundo plano; nunca se envían mensajes ni ubicaciones automáticamente |
| Señal al vencer | Intentar una sola vibración breve cuando vence un temporizador con la app abierta; conservar siempre el aviso visual | La API de vibración puede no estar disponible o permitida; no se promete como alerta confiable |
| Confirmación del PIN | Mostrar brevemente «Receta especial lista.» y cambiar el título a «Recetario Secreto» mientras el modo apoyo está activo | Confirma el cambio de modo con un texto neutro y efímero |
| Tarjetas QR | Tarjeta impresa a doble cara para la demostración, QR verificado al MVP | Hace tangible la entrega de la app; el QR dirige solo al recetario público |
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
| `camuflaje.preferences` *(RF-17)* | tema, tamaño de letra, vista, nombre | Sí |
| `camuflaje.setupCompleted` | `true` si ya completó o salió de la configuración | **No**, para que no reaparezca sola |
| `camuflaje.portions` | sal y verificador derivado del PIN | Sí |

> La marca de configuración permanece fuera de las claves eliminadas por `clearAppData()`.

### Arranque y rutas (`main.js`)

- La primera visita muestra la configuración; al completar se marca y no se vuelve a mostrar.
- Los perfiles previos sin PIN pasan una vez por la configuración para crearlo.
- Cinco toques al título del recetario en tres segundos abren solo la configuración para cambiar PIN/contactos; el gesto no abre Bienestar directamente.

### Pantalla de configuración (`views/setup.js`)

- Paso 0: tres tarjetas con ícono y una frase cada una.
  1. 🍲 Tu receta es una señal secreta.
  2. 🤝 Compártela con alguien de confianza: sabrá que la necesitas *ahora*. Acuerden antes qué hacer y qué no.
  3. 🔒 No llama a emergencias ni te vigila. Tú decides cada envío.
- Botón **"Salir rápido ✕"** fijo arriba a la derecha en todos los pasos (coral, texto blanco, ícono).
- Paso de contactos: prefijo +51, `inputmode="numeric"`, 2 obligatorios, tercero opcional.
- Paso de PIN: 6 dígitos, confirmación y explicación de límites; el verificador local usa PBKDF2 con sal.
- Paso final: explica que el apoyo se abre desde la calculadora después de ingresar el PIN.

### Calculadora de porciones y apoyo (`views/recipeDetail.js`, `main.js`)

- La calculadora ajusta cantidades numéricas y deja intactas expresiones cualitativas como "al gusto".
- Si se introduce el PIN de 6 dígitos en el campo de porciones, abre la vista de Bienestar y apoyo.
- Desde apoyo se pueden actualizar contactos/PIN o borrar los datos. El PIN no cifra el resto del almacenamiento ni resiste inspección del dispositivo.

### Inactividad y temporizador

- Un minuto sin interacción en configuración, Preferencias o apoyo devuelve al inicio y descarta el chat temporal.
- Temporizador de 1 a 180 minutos en receta. Al vencer con la app abierta, se intenta una vibración breve y el aviso ofrece «Ya está lista» o «Compartir receta». La usuaria todavía elige destinatario y confirma en WhatsApp. En modo apoyo, se consulta ubicación al iniciar y se intenta actualizar al vencer; si no hay permiso, el temporizador sigue y el mensaje queda sin ubicación.
- Si la app se cierra o suspende, no se garantiza el aviso. No se implementa envío automático ni ubicación en segundo plano.

### Tarjetas para el pitch

- Anverso: receta real de la app; reverso: QR a la URL pública y URL impresa como alternativa.
- Generar el QR localmente y escanearlo desde otro teléfono antes de imprimir. No poner datos personales ni textos que presenten la app como una app de emergencia.

## Pruebas

- Validar PIN, calculadora, temporizador y vibración opcional, mensaje de desbloqueo, auto-cierre, QR, normalización de teléfono y `clearAppData` con pruebas unitarias cuando exista el runner aprobado.
- **Checklist manual** (`docs/PRUEBAS-MANUALES.md`) en un celular real: alta y migración de PIN, acceso de apoyo, cierre a 60 s, temporizador con y sin app activa, QR, instalar, modo sin conexión, ubicación y WhatsApp.
- Para la receta de confianza se usa una redacción provisional que no invita a acudir a ningún lugar; validarla con Makipuray antes del uso real (P-2).

## Despliegue

- `vite.config.js`: `base` con el nombre del repositorio (GitHub Pages sirve en una subruta).
- Revisar que el service worker y el manifiesto usen rutas relativas; **subir la versión del caché** en cada entrega.
- Workflow de GitHub Actions: `npm ci` → `npm run build` → publicar `dist/` en Pages.
- Verificar en celular real: HTTPS, instalación, sin conexión y permiso de ubicación.
- Verificar en ≈360 px que calculadora y temporizador son usables, que el PIN abre el contenido, que Preferencias no muestra Bienestar y que el cierre por inactividad funciona.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Alguien con acceso técnico inspecciona el PIN o los datos locales | El verificador lleva sal; se documenta que el PIN no es seguridad del dispositivo y se valida con usuarias antes de un piloto |
| Temporizador se interpreta como alerta confiable o envío automático | Aviso solo en primer plano, confirmación manual y límite visible en UI/docs |
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