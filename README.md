# Recetario Casero

Aplicación de recetas y bienestar migrada a Vite y JavaScript vanilla con módulos ES. La versión anterior está conservada en [`legacy/index.original.html`](./legacy/index.original.html).

## Desarrollo

```sh
npm install
npm run dev
```

La aplicación de producción se genera con `npm run build` y se puede revisar con `npm run preview`.

## Configuración discreta

La configuración se muestra al primer uso y no vuelve a aparecer automáticamente. Para abrirla después, toca cinco veces seguidas el título de la pantalla Inicio o usa el enlace especial `URL_PUBLICADA#setup`. La facilitadora puede compartir ese enlace y explicar el flujo en persona; cualquier persona que tenga el enlace podrá abrir la configuración.

El tutorial y la opción para borrar los datos están dentro de esa configuración, no en Preferencias. El indicador que evita repetir la configuración se conserva al borrar los demás datos de la app.

Preferencias ofrece tema, tamaño de letra, presentación en cuadros o lista y un saludo opcional con el nombre elegido. Limpiar Favoritas no modifica contactos ni la configuración de confianza.

La configuración solicita dos contactos con número peruano de 9 dígitos; permite agregar un tercero opcional. El prefijo `+51` se muestra por separado.

## Estructura

- `src/data/`: recetas, artículos de bienestar y establecimientos de demostración.
- `src/state/`: estado temporal de la interfaz.
- `src/services/`: almacenamiento local, geolocalización, compartir y mapa.
- `src/components/`: navegación, tarjetas, modales y avisos.
- `src/views/`: pantallas independientes.
- `src/assets/styles/`: estilos base, componentes y adaptación móvil.
- `public/`: manifiesto, icono, imágenes locales y service worker.

## Privacidad y límites

- Favoritas, contactos y preferencias se guardan en el almacenamiento local del navegador. Limpiar Favoritas solo borra recetas guardadas; el borrado completo está dentro de la configuración discreta.
- El asistente usa respuestas predefinidas; no es una IA ni un servicio profesional. El chat no se guarda.
- La ubicación se solicita solo tras una acción explícita. No se guarda ni se comparte en segundo plano. Antes de abrir WhatsApp se muestra el mensaje para que la persona lo revise.
- Los establecimientos y coordenadas del mapa son ejemplos no verificados; no son puntos seguros ni recomendaciones de destino.
- El modo sin conexión almacena los recursos de la aplicación en el navegador. El mapa y los enlaces externos requieren conexión; el service worker no cachea servicios de terceros.
- La instalación y el service worker requieren HTTPS o `localhost`. La ubicación también depende de los permisos del navegador.

No uses los datos de muestra para tomar decisiones de seguridad. Si existe peligro inmediato, busca ayuda local cuando sea seguro hacerlo.
