# Recetario Casero · Camuflaje

**Un recetario que sigue siendo un recetario, y que permite a una mujer en riesgo pedir ayuda sin que se note.**

Proyecto del equipo __ para el **Warmi Innovathon de Makipuray** · Eje 3: Prevención y seguridad.

🔗 **Prueba el MVP:** (https://yadiraverasalinas-hub.github.io/warmi-innovathon-grupo17/)
🎥 **Pitch:** 5 minutos · guion en [`docs/PITCH.md`](docs/PITCH.md)

---

## El reto

> ¿Cómo podríamos ayudar a una mujer en riesgo a pedir ayuda de forma rápida y discreta, acompañándola a la vez en el acceso seguro a información y atención de su salud física y mental?

Si quien la agrede o la controla revisa su celular, escribir "ayuda" o abrir una app de emergencia puede ponerla en más riesgo. Pero **mandar una receta a una amiga no levanta sospechas.**

## Nuestra idea

- **La receta es una petición de ayuda disimulada.** Quien agrede o controla puede revisar su celular, y ella no puede escribir "ayuda" ni llamar. La app prepara un mensaje que parece una conversación cotidiana sobre una receta; ella revisa el texto, elige a una persona de confianza y decide si abrir WhatsApp para enviarlo. Por el acuerdo previo, el mensaje significa: *"te necesito ahora"*.
- **Un acuerdo previo, en persona, define qué hacer y qué no.** No es para ocultarle algo al contacto, sino para que sepa responder sin ponerse en riesgo ni delatarla.
- **Se ve como un recetario normal.** Búsqueda, categorías, favoritas y fichas de receta. Sin el PIN no hay botones, pestañas ni textos de emergencia a la vista: tampoco Tiendas, contactos, receta de confianza ni ubicación al compartir.
- **Bienvenida y configuración opcional.** «Comenzar» permite elegir una receta y configurar contactos o PIN, que son opcionales; «Ahora no» abre el recetario. No se piden permisos de golpe. Desde Preferencias se puede volver a consultar el tutorial.
- **Control total de la usuaria.** Revisa el mensaje antes de enviarlo y la ubicación se comparte solo si ella lo decide, cada vez.
- **Modo apoyo con PIN.** En la calculadora de porciones y costos de cualquier receta, la usuaria escribe su PIN: aparece brevemente «Receta especial lista.» y el título cambia a «Recetario Secreto» mientras se habilitan **Tiendas**, **Bienestar** (artículos breves, teléfonos de apoyo en Perú y un asistente de respuestas predefinidas), compartir con contactos y ubicación, y el aviso de llegada. A los 60 segundos sin tocar la pantalla, al ocultar la app o con «Salir», vuelve al recetario cotidiano y hay que poner el PIN de nuevo. El título distinto hace visible que el modo apoyo está activo.
- **Funciones de cocina útiles:** calculadora de porciones y **costos de compra** (precio por ingrediente, total aproximado y costo por porción) y temporizador de cocina.
- **Aviso de llegada (modo apoyo).** Al iniciar el temporizador puede indicar a qué punto se dirige; se consulta su ubicación y se intenta actualizar cuando vence. Si el tiempo vence sin que ella lo detenga, la app intenta vibrar una vez cuando el navegador lo permite y muestra un aviso neutro. Al tocar «Compartir receta», prepara el mensaje con la última ubicación para que lo envíe con un toque. **No se envía solo.**
- **Pensada para acompañarse "de mano en mano":** una facilitadora puede entregar la app, hacer la configuración junto con la usuaria y explicarle el acuerdo.

## Cómo probarlo en 2 minutos

1. Abre el enlace del prototipo en tu celular (idealmente en modo incógnito, para ver la primera vez).
2. Verás la **bienvenida**. Prueba «Ahora no» para abrir el recetario o «Comenzar» para configurar; receta, contactos y PIN se pueden omitir.
3. Si configuraste PIN, escríbelo en la calculadora de una receta para activar el modo apoyo; el título cambia a «Recetario Secreto». El tutorial está disponible en Preferencias.
4. Abre una receta, compártela con el menú normal del dispositivo y revisa el **mensaje antes de enviarlo**. Sin PIN, no se ofrecen contactos guardados ni ubicación.
5. Abre una receta, usa la **Calculadora de porciones y costos** (escribe precios y mira el total) y escribe el PIN en el campo de porciones. Aparece brevemente «Receta especial lista.»; el título cambia a **Recetario Secreto** y aparecen **Tiendas**, **Bienestar** y «Salir». Prueba el asistente (*"tengo miedo"*) y el cierre por 60 segundos de inactividad: vuelve al título cotidiano y las funciones desaparecen.
6. En modo apoyo, abre una receta, elige un destino y un tiempo de 1 minuto, y espera el aviso. Al vencer, el dispositivo intenta vibrar una vez si es compatible. Toca «Compartir receta» para revisar el mensaje con la última ubicación; el envío no es automático. Prueba también el temporizador de cocina sin PIN: no ofrece contactos ni ubicación.
7. Instálala desde el navegador ("Añadir a pantalla de inicio") y ábrela sin conexión.

> Usa **solo datos de prueba**. El PIN no cifra los datos ni protege contra quien inspeccione el navegador o el dispositivo.

## Tarjeta de receta con QR para el pitch

Lleven una tarjeta impresa por ambas caras: delante, una receta real del prototipo (por ejemplo, lomo saltado); detrás, un QR a la URL pública del MVP y una frase cotidiana como «Escanea para ver más recetas». El QR debe abrir `https://yadiraverasalinas-hub.github.io/warmi-innovathon-grupo17/`.

Generen el QR localmente desde el navegador o con una herramienta sin seguimiento, guarden la imagen e intégrenla al diseño de impresión. Antes de imprimir, escanéenlo desde otro teléfono y confirmen que abre la app publicada; incluyan también la URL legible como alternativa. No agreguen nombres, teléfonos ni ubicaciones reales a la tarjeta. Entréguenla al jurado después de explicar la receta y el flujo de la app.

## Lo que no hacemos (y lo decimos)

- **No es una app de emergencia.** No llama a emergencias, no vigila y no monitorea.
- El PIN local es una barrera de discreción, **no una contraseña segura**; no impide que alguien con acceso al dispositivo inspeccione la aplicación o sus datos.
- El PIN no se puede recuperar en este prototipo. Si se olvida, borrar los datos del navegador también elimina contactos y preferencias guardados.
- No se añade un directorio de psicólogas con datos sin verificar; cualquier servicio de orientación debe validarse con la organización correspondiente antes de publicarse.
- Para volver a la configuración y gestionar el PIN o los contactos, toca cinco veces el título del recetario en menos de tres segundos. Este acceso discreto no es una protección de seguridad.
- El temporizador y el aviso de llegada requieren que la app siga abierta y no mandan una alerta confiable al cerrarse o suspenderse (un celular bloqueado puede detener la página). Cuando vence, intenta una vibración breve si es compatible y muestra un aviso; la vibración no está garantizada. La usuaria decide si comparte algo: **la app no puede enviar mensajes por sí sola**; eso exigiría un servidor o SMS.
- **Discreta no es invisible.** Alguien con acceso al celular podría abrirla o revisar lo guardado en el navegador.
- El mensaje enviado **queda en el historial de WhatsApp**; recomendamos activar mensajes temporales en ese chat o borrarlo.
- Los puntos del mapa son **ejemplos no verificados**; no son lugares seguros.
- El asistente usa **respuestas predefinidas**. Decidimos no usar IA generativa en un tema tan delicado.
- Si hay peligro inmediato, busca ayuda local cuando sea seguro hacerlo.

## Privacidad

- Favoritas, contactos y preferencias se guardan **solo en el dispositivo** (almacenamiento local del navegador). No hay servidor ni cuentas.
- La ubicación se pide **solo tras una acción explícita** (compartir con ubicación o iniciar el aviso de llegada); nunca se guarda en el dispositivo y se conserva en memoria solo mientras el aviso está activo. En el aviso de llegada se intenta actualizar al vencer.
- El PIN se guarda como verificación derivada con sal en el almacenamiento local; no se guarda el PIN en texto claro ni se envía a un servidor.
- "Borrar mis datos" elimina lo guardado por esta app.
- Sin analítica ni rastreadores. El modo sin conexión guarda solo los recursos de la propia app.

## Cómo está hecho

Vite · JavaScript vanilla (módulos ES) · Leaflet · PWA con service worker.

```sh
npm install
npm run dev        # desarrollo
npm run build      # producción
npm run preview    # revisar el build
```

Las pruebas manuales y los límites del prototipo están descritos en [`docs/PRUEBAS-MANUALES.md`](docs/PRUEBAS-MANUALES.md).

```
src/
  main.js · state/ · services/ · views/ · components/ · data/ · utils/
public/   manifiesto, service worker, iconos, imágenes
specs/    spec, plan y tareas (Spec-Driven Development)
docs/     constitución, pitch, pruebas manuales
AGENTS.md reglas para los agentes de IA del equipo
```

### Cómo trabajamos

Spec-Driven Development: **sin spec no hay código**. Cada issue y PR cita su requisito (RF), las pruebas salen de la spec y todo entra a `main` por pull request. Usamos agentes de IA para construir; **la IA propone y una persona decide**. Ver [`AGENTS.md`](AGENTS.md) y [`specs/001-camuflaje-recetario/`](specs/001-camuflaje-recetario/).

## Después del Innovathon

| Cuándo | Qué |
|---|---|
| **Dic 2026** | Co-diseño con Makipuray: validar el mensaje de la señal y los contenidos con facilitadoras; verificar con organizaciones locales los puntos de ayuda reales y evaluar si hace falta una protección más robusta que el PIN local |
| **Ene–mar 2027** | Piloto acompañado con beneficiarias, entrega con facilitadoras y monitoreo del impacto |

## Equipo

- Benites Javier, Estrella Nayeli · [Área]
- Tadeo Herrera, Jennifer Allison · [Área]
- Ventocilla Sanchez, Sheyla Marcelina · [Área]
- Vera Salinas, Yadira Yajaira · [Área]

Mentora Makipuray: __

---

*Recetario Casero es un prototipo educativo. Los datos de muestra no deben usarse para tomar decisiones de seguridad.*