# Checklist de pruebas manuales

Hacer en un celular real, con el enlace público. Marcar ✅/❌ y anotar el dispositivo y el navegador.
Dispositivo: __ · Navegador: __ · Fecha: __ · Quién probó: __

## Primera apertura (RF-11, RF-12, RF-13)

- [ ] Con datos del navegador borrados, al abrir el enlace aparece la configuración
- [ ] Se ven las tres tarjetas cortas y la lista de recetas sin tener que leer un bloque largo
- [ ] "Salir rápido" se ve a primera vista en todos los pasos y no tapa el título ni el progreso
- [ ] Tocar "Salir rápido" lleva al recetario sin guardar nada
- [ ] Recargar la página **no** vuelve a mostrar la configuración
- [ ] Borrar datos del navegador y completar la configuración guarda receta y contactos
- [ ] Tras completarla, recargar no la reabre

## Recetario y acceso secundario a orientación (RF-14, RF-17)

- [ ] Recorrer Inicio, Buscar, Favoritas y Tiendas: Bienestar no aparece en la navegación principal
- [ ] El engranaje muestra las opciones de recetario y un apartado claramente identificado como "Bienestar y apoyo"
- [ ] Abrir "Bienestar y apoyo" desde Preferencias: artículos, teléfonos y asistente siguen disponibles y sin cambios
- [ ] Desde Bienestar, el acceso "‹ Preferencias" vuelve al diálogo de Preferencias
- [ ] En el recetario y en Preferencias no aparecen textos de configuración oculta, tutorial, borrado total o señal
- [ ] El botón de tema muestra un icono SVG morado de luna o sol, y lo cambia correctamente al alternar tema
- [ ] Las tarjetas de configuración muestran iconos SVG morados y legibles en ambos temas
- [ ] Arroz chaufa, ceviche, mazamorra morada y caldo de gallina aparecen con sus imágenes en configuración y recetario; todas las fotos de recetas son JPG

## Reapertura y borrado (RF-15, RF-16)

- [ ] 5 toques seguidos al título abren la configuración, con los datos guardados
- [ ] 5 toques con pausa de más de 1,5 s entre ellos **no** abren nada
- [ ] El enlace especial abre la configuración
- [ ] "Ver demostración" funciona y vuelve
- [ ] "Borrar mis datos guardados" limpia todo, vuelve al recetario, la URL queda sin hash y recargar no reabre la configuración

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

- [ ] Se puede abrir Bienestar desde Preferencias; no hay una pestaña de Bienestar en la navegación principal
- [ ] El acceso secundario no se presenta como invisible ni como garantía de seguridad
- [ ] Los teléfonos se pueden tocar para llamar
- [ ] Escribir "tengo miedo" muestra la respuesta de apoyo con los teléfonos
- [ ] El chat no se guarda al recargar
- [ ] Los puntos del mapa dicen que son ejemplos no verificados

## Instalación y sin conexión (RF-9)

- [ ] Se puede instalar ("Añadir a pantalla de inicio")
- [ ] Abierta en modo avión, carga el recetario
- [ ] Tras una nueva versión desplegada, la app carga la versión nueva (caché actualizado)