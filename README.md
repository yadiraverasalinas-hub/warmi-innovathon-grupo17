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

- **La receta es una petición de ayuda disimulada.** Quien agrede o controla puede revisar su celular, y ella no puede escribir "ayuda" ni llamar. Con un solo toque, la app envía por WhatsApp un mensaje que parece cualquier receta a una persona de confianza que ya sabe qué significa: *"te necesito ahora"*.
- **Un acuerdo previo, en persona, define qué hacer y qué no.** No es para ocultarle algo al contacto, sino para que sepa responder sin ponerse en riesgo ni delatarla.
- **Se ve como un recetario normal.** Búsqueda, categorías, favoritas y fichas de receta. No hay botones ni textos de emergencia a la vista.
- **Configuración de una sola vez**, con explicación clara, un botón de **Salir rápido** y un acceso discreto para volver a cambiar sus datos.
- **Control total de la usuaria.** Revisa el mensaje antes de enviarlo y la ubicación se comparte solo si ella lo decide, cada vez.
- **Orientación dentro del mismo recetario:** artículos breves, teléfonos de apoyo en Perú y un asistente de respuestas predefinidas, disponibles desde el apartado **Bienestar y apoyo** en Preferencias.
- **Pensada para acompañarse "de mano en mano":** una facilitadora puede entregar la app, hacer la configuración junto con la usuaria y explicarle el acuerdo.

## Cómo probarlo en 2 minutos

1. Abre el enlace del prototipo en tu celular (idealmente en modo incógnito, para ver la primera vez).
2. Verás la **configuración inicial**: tres tarjetas, elige una receta de confianza y anota dos contactos de prueba. Prueba también **Salir rápido**.
3. Explora el recetario: no hay pistas de la función de ayuda.
4. Abre una receta, compártela con tu contacto de prueba y revisa el **mensaje antes de enviarlo**. Prueba incluir la ubicación.
5. Abre **Preferencias → Bienestar y apoyo**: lee los artículos y teléfonos de apoyo y prueba el asistente (*"tengo miedo"*). El acceso es secundario; no vuelve invisible la aplicación.
6. Instálala desde el navegador ("Añadir a pantalla de inicio") y ábrela sin conexión.

> Usa **solo datos de prueba**. La forma de reabrir la configuración se muestra en la demo en vivo.

## Lo que no hacemos (y lo decimos)

- **No es una app de emergencia.** No llama a emergencias, no vigila y no monitorea.
- **Discreta no es invisible.** Alguien con acceso al celular podría abrirla o revisar lo guardado en el navegador.
- El mensaje enviado **queda en el historial de WhatsApp**; recomendamos activar mensajes temporales en ese chat o borrarlo.
- Los puntos del mapa son **ejemplos no verificados**; no son lugares seguros.
- El asistente usa **respuestas predefinidas**. Decidimos no usar IA generativa en un tema tan delicado.
- Si hay peligro inmediato, busca ayuda local cuando sea seguro hacerlo.

## Privacidad

- Favoritas, contactos y preferencias se guardan **solo en el dispositivo** (almacenamiento local del navegador). No hay servidor ni cuentas.
- La ubicación se pide **solo tras una acción explícita**; no se guarda ni se comparte en segundo plano.
- "Borrar mis datos" elimina lo guardado por esta app.
- Sin analítica ni rastreadores. El modo sin conexión guarda solo los recursos de la propia app.

## Cómo está hecho

Vite · JavaScript vanilla (módulos ES) · Leaflet · PWA con service worker.

```sh
npm install
npm run dev        # desarrollo
npm run build      # producción
npm run preview    # revisar el build
npm test           # pruebas
```

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
| **Dic 2026** | Co-diseño con Makipuray: validar el mensaje de la señal y los contenidos con facilitadoras; verificar con organizaciones locales los puntos de ayuda reales; mejorar protección de la configuración (PIN) y nombres neutros de almacenamiento |
| **Ene–mar 2027** | Piloto acompañado con beneficiarias, entrega con facilitadoras y monitoreo del impacto |

## Equipo

- Benites Javier, Estrella Nayeli · [Área]
- Tadeo Herrera, Jennifer Allison · [Área]
- Ventocilla Sanchez, Sheyla Marcelina · [Área]
- Vera Salinas, Yadira Yajaira · [Área]

Mentora Makipuray: __

---

*Recetario Casero es un prototipo educativo. Los datos de muestra no deben usarse para tomar decisiones de seguridad.*