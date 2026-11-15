# Checklist de pruebas manuales

Hacer en un celular real, con el enlace público. Marcar ✅/❌ y anotar el dispositivo y el navegador.
Dispositivo: __ · Navegador: __ · Fecha: __ · Quién probó: __

## Primera apertura y PIN (RF-11, RF-12, RF-13)

- [ ] Con datos del navegador borrados, al abrir el enlace aparece la configuración
- [ ] Se ven las tres tarjetas cortas y la lista de recetas sin tener que leer un bloque largo
- [ ] "Salir rápido" se ve a primera vista en todos los pasos y no tapa el título ni el progreso
- [ ] Tocar "Salir rápido" lleva al recetario sin guardar nada
- [ ] Recargar durante la configuración permite continuar; recargar después de completarla no la vuelve a mostrar
- [ ] Un PIN que no tiene 6 dígitos o no coincide con la confirmación no permite continuar
- [ ] Completar la configuración guarda receta, contactos y el verificador con sal; el PIN no queda en texto claro en localStorage
- [ ] Un perfil guardado de una versión anterior permite crear el PIN sin perder contactos ni receta
- [ ] Tras completarla, recargar no la reabre

## Recetario y calculadora de porciones (RF-14, RF-17, RF-19)

- [ ] Recorrer Inicio, Buscar, Favoritas y Tiendas: Bienestar no aparece en la navegación principal
- [ ] Preferencias no muestra Bienestar ni accesos a la configuración
- [ ] Cinco toques al título del recetario en menos de tres segundos abren la configuración; no abre directamente Bienestar
- [ ] Cuatro toques, o cinco toques con pausas mayores de tres segundos, no abren la configuración
- [ ] La calculadora de porciones aparece en una ficha de receta
- [ ] Ajustar a 2 porciones desde una receta de 4 escala sus cantidades; "al gusto" se mantiene
- [ ] Introducir un PIN incorrecto no confirma si era un PIN válido ni abre el apoyo
- [ ] Introducir el PIN correcto abre Bienestar y apoyo
- [ ] En el recetario y en Preferencias no aparecen textos de configuración oculta, tutorial, borrado total o señal
- [ ] El botón de tema muestra un icono SVG morado de luna o sol, y lo cambia correctamente al alternar tema
- [ ] Las tarjetas de configuración muestran iconos SVG morados y legibles en ambos temas
- [ ] Arroz chaufa, ceviche, mazamorra morada y caldo de gallina aparecen con sus imágenes en configuración y recetario; todas las fotos de recetas son JPG

## Modo apoyo con PIN (RF-25, RF-26, RF-29)

- [ ] Sin PIN, la navegación solo tiene Inicio, Buscar y Favoritas (no Tiendas ni Bienestar)
- [ ] Sin PIN, la ficha de la receta de confianza no muestra el aviso «receta de confianza»
- [ ] Sin PIN, «Compartir receta» ofrece solo el menú del dispositivo: sin contactos, sin «Incluir mi ubicación» y con el mensaje común
- [ ] Sin PIN, el temporizador es de cocina común y no menciona ubicación ni mensajes
- [ ] En la calculadora, escribir precios actualiza «Total aproximado» y «Por porción» sin perder el foco; ajustar porciones recalcula el costo por porción
- [ ] Un PIN incorrecto no confirma ni abre nada
- [ ] El PIN correcto lleva al inicio del recetario con Tiendas, Bienestar y «Salir» visibles; el PIN no queda escrito en la calculadora
- [ ] En modo apoyo, Tiendas muestra los puntos de ejemplo no verificados y Bienestar muestra artículos, teléfonos y asistente
- [ ] En modo apoyo, «Compartir receta» ofrece contactos y «Incluir mi ubicación actual»
- [ ] 60 segundos sin tocar la pantalla: vuelve al inicio, desaparecen Tiendas/Bienestar y hay que poner el PIN otra vez
- [ ] Cambiar de app o bloquear la pantalla en modo apoyo también lo cierra
- [ ] «Salir» cierra el modo apoyo en un toque

## Aviso de llegada (RF-27, RF-28)

- [ ] En modo apoyo, iniciar el temporizador con un destino pide la ubicación una sola vez y muestra la barra «Temporizador» con «Detener»
- [ ] Esperar 60 segundos sin tocar: el modo apoyo se cierra pero el temporizador sigue en marcha
- [ ] Al vencer (con la app abierta) aparece «¿Ya está lista?» sin textos de ayuda ni ubicación
- [ ] «Compartir receta» muestra el mensaje en clave con destino y enlace de ubicación y los contactos; no se abre WhatsApp hasta tocar un contacto
- [ ] Nada se envía solo en ningún paso
- [ ] «Ya está lista» o cerrar el aviso borra la ubicación y el destino; «Detener» también
- [ ] Bloquear el celular antes de que venza: anotar si el aviso aparece al volver (no se promete como alerta confiable)
- [ ] Denegar el permiso de ubicación al iniciar: el temporizador arranca igual y el mensaje sale sin enlace de ubicación

## Actualización, borrado e inactividad (RF-16, RF-20)

- [ ] Desde apoyo, "Actualizar contactos o PIN" precarga los datos existentes y permite guardarlos
- [ ] "Borrar mis datos guardados" limpia contactos, PIN, preferencias y favoritas, vuelve al recetario y no vuelve a abrir la configuración
- [ ] Dejar la configuración sin tocar 60 segundos vuelve al recetario
- [ ] Dejar Preferencias sin tocar 60 segundos cierra el diálogo y vuelve al inicio
- [ ] Dejar el modo apoyo (Bienestar, Tiendas o cualquier pantalla) sin tocar 60 segundos vuelve al inicio, desactiva el modo apoyo y descarta el chat

## Contactos (RF-18)

- [ ] El +51 viene puesto y el teclado es numérico
- [ ] Con un solo contacto no se puede continuar
- [ ] El tercero es opcional con "+ Agregar otra"

## Señal y ubicación (RF-4, RF-5)

- [ ] "Compartir receta" abre una vista previa clara con el mensaje y los destinatarios
- [ ] Compartir la receta de confianza muestra el texto y el contacto seleccionados antes de abrir WhatsApp
- [ ] El texto de confianza habla de la receta sin invitar a la persona a acudir a una casa u otro lugar
- [ ] Una receta común conserva un mensaje normal de receta
- [ ] Sin elegir ubicación, no se pide permiso
- [ ] Eligiendo ubicación explícitamente, se pide permiso y el enlace de mapa se agrega a la vista previa antes de abrir WhatsApp

## Bienestar (RF-6, RF-7, RF-8)

- [ ] Solo se puede llegar desde la calculadora con el PIN correcto; no hay una pestaña de Bienestar en navegación ni en Preferencias
- [ ] La pantalla no presenta el PIN como protección contra inspección técnica del dispositivo
- [ ] Los teléfonos se pueden tocar para llamar
- [ ] Escribir "tengo miedo" muestra la respuesta de apoyo con los teléfonos
- [ ] El chat no se guarda al recargar
- [ ] Los puntos del mapa dicen que son ejemplos no verificados

## Temporizador y tarjeta QR (RF-21, RF-22)

- [ ] Iniciar temporizador y mantener la app abierta muestra «Ya está lista» y «Compartir receta» al vencer
- [ ] «Ya está lista» cierra el aviso sin enviar nada
- [ ] «Compartir receta» abre la vista previa; no se abre WhatsApp hasta elegir contacto y confirmarlo
- [ ] La ubicación no se solicita automáticamente; solo aparece si se elige expresamente
- [ ] Cerrar o suspender la app no se presenta como una alerta garantizada; al reabrir no se manda ningún mensaje
- [ ] La tarjeta tiene una receta al frente y QR/URL de la app al reverso, sin datos personales
- [ ] Escanear el QR desde otro teléfono abre la URL publicada

## Instalación y sin conexión (RF-9)

- [ ] Se puede instalar ("Añadir a pantalla de inicio")
- [ ] Abierta en modo avión, carga el recetario
- [ ] Tras una nueva versión desplegada, la app carga la versión nueva (caché actualizado)