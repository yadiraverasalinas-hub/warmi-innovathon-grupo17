# Spec 001: Recetario Casero (Camuflaje)

> Reto Warmi Innovathon · Makipuray · **Eje 3: Prevención y seguridad**
> Estado: v1 (borrador para el equipo) · Última revisión: 12 nov 2026

## Problema y usuaria

**Pregunta central del reto:** ¿Cómo podríamos ayudar a una mujer en riesgo a pedir ayuda de forma rápida y discreta, acompañándola a la vez en el acceso seguro a información y atención de su salud física y mental?

**Usuaria:** mujeres en situación de violencia (pareja, calle, laboral o universitaria), y jóvenes o mujeres en vulnerabilidad con poco acceso a información de salud.

**Situación que resolvemos:** quien la agrede o la controla puede revisar su celular o estar cerca. Escribir "ayuda" o abrir una app de emergencia puede ponerla en más riesgo. Pero **mandar una receta a una amiga es algo que nadie sospecha.**

## Propuesta de valor

No es una app de emergencia: es un recetario que sigue siendo un recetario. **La receta es una petición de ayuda disimulada.** Con un toque, la usuaria envía a una persona de confianza un mensaje que parece cualquier receta y que, por un acuerdo previo, significa *"te necesito ahora"*. La receta no le esconde nada al contacto: le esconde la petición a quien la vigila. Además, dentro del mismo recetario encuentra orientación y teléfonos de apoyo en Perú.

**Por qué hace falta si el contacto ya sabe su situación:** el contacto puede saber que ella está en riesgo en general, pero no *cuándo* necesita ayuda ahora, y ella no puede escribir "ayuda" ni llamar sin delatarse. La app resuelve el *cuándo* y el *cómo*, no el *qué*: el acuerdo previo define qué hacer y qué no hacer.

## Cómo funciona (visión)

1. **Acuerdo previo, en persona** (idealmente con una facilitadora de Makipuray): qué significa la receta, qué hará y qué **no** hará la persona de confianza, y cómo responder sin ponerse en riesgo. Ver `docs/ACUERDO-DE-CONFIANZA.md`.
2. **Configuración única:** elige su receta de confianza y anota 2 o 3 personas de confianza.
3. **Uso normal:** el recetario se ve como cualquier otro.
4. **Petición de ayuda:** comparte la receta de confianza por WhatsApp con un toque (revisa el mensaje antes de enviar; puede sumar su ubicación si decide).
5. **Orientación:** en Bienestar encuentra artículos breves, teléfonos de apoyo y un asistente de respuestas predefinidas.

## Requisitos (formato EARS)

### A. Base (ya implementados en el MVP)

- **RF-1:** CUANDO la usuaria abre la app, EL SISTEMA muestra un recetario completo: inicio, búsqueda por nombre y categoría, y ficha de cada receta.
- **RF-2:** CUANDO marca una receta como favorita, EL SISTEMA la guarda en el dispositivo y la muestra en Favoritas.
- **RF-3:** CUANDO comparte una receta que no es la de confianza, EL SISTEMA comparte un mensaje común de receta (compartir del dispositivo o copiar).
- **RF-4 (señal):** CUANDO comparte su receta de confianza con una persona de confianza, EL SISTEMA prepara un mensaje de WhatsApp con apariencia de invitación a comer y **lo muestra para que ella lo revise** antes de abrir WhatsApp.
- **RF-5 (ubicación):** CUANDO la usuaria elige explícitamente incluir su ubicación, EL SISTEMA solicita el permiso del navegador y agrega un enlace de mapa al mensaje. EL SISTEMA no guarda la ubicación ni la comparte en segundo plano.
- **RF-6:** CUANDO la usuaria abre Bienestar, EL SISTEMA muestra artículos breves de apoyo y teléfonos útiles en Perú que se pueden tocar para llamar.
- **RF-7:** CUANDO la usuaria escribe al asistente palabras de riesgo (miedo, violencia, amenaza, etc.), EL SISTEMA responde con apoyo y los teléfonos de ayuda. EL SISTEMA aclara que es un asistente de respuestas predefinidas y no guarda la conversación.
- **RF-8:** CUANDO abre Tiendas, EL SISTEMA muestra un mapa con puntos de ejemplo marcados como **no verificados**.
- **RF-9:** CUANDO la app se instala o se abre sin conexión, EL SISTEMA carga sus propias pantallas y recursos.
- **RF-10:** CUANDO elige "Borrar mis datos guardados", EL SISTEMA elimina favoritas, perfil, contactos y preferencias de esta app.

### B. Nuevos en este sprint (prioridad: Must > Should > Could)

- **RF-11 (Must):** CUANDO la usuaria abre la app por primera vez, EL SISTEMA muestra la configuración inicial: una explicación en **tres tarjetas cortas** (qué es, cómo funciona la señal, qué no hace), la elección de la receta de confianza y el registro de contactos.
- **RF-12 (Must):** CUANDO completa, omite o sale de la configuración, EL SISTEMA no vuelve a mostrarla por sí solo. CUANDO ya existía un perfil guardado, EL SISTEMA no la muestra.
- **RF-13 (Must):** MIENTRAS la usuaria está en la configuración, EL SISTEMA muestra siempre un botón **"Salir rápido"** bien visible. CUANDO lo toca, EL SISTEMA vuelve al recetario sin guardar lo escrito y sin volver a abrir la configuración.
- **RF-14 (Must):** MIENTRAS la usuaria está en el recetario, EL SISTEMA no muestra textos, botones ni enlaces que hablen de configuración, tutorial, borrado de datos o señal de ayuda. *(Bienestar, sus artículos y el asistente se mantienen: son orientación general; ver pregunta abierta P-1.)*
- **RF-15 (Must):** CUANDO la usuaria toca 5 veces seguidas el título del recetario (menos de 1,5 s entre toques) o abre el enlace especial que le dio su facilitadora, EL SISTEMA abre la configuración con sus datos guardados.
- **RF-16 (Must):** CUANDO está en la configuración, EL SISTEMA le permite ver la demostración y **borrar todos sus datos**. CUANDO borra, EL SISTEMA vuelve al recetario y no abre la configuración sola.
- **RF-17 (Could):** CUANDO abre el engranaje, EL SISTEMA ofrece solo opciones de recetario: tema claro/oscuro con ícono (☀️/🌙), tamaño de letra, vista en cuadros o lista, nombre para el saludo, limpiar favoritas e instalar la app. Ninguna toca a las personas de confianza.
- **RF-18 (Should):** CUANDO registra contactos, EL SISTEMA propone el prefijo +51, abre el teclado numérico, exige 2 contactos y permite un tercero opcional con "+ Agregar otra".

## Reglas de seguridad y límites

- **El mensaje nunca le pide a la persona de confianza que acuda ni que confronte a nadie.** Avisa; lo que se hace después lo define el acuerdo previo. La ubicación es información, no una orden.
- **Se recomienda elegir contactos fuera del entorno de quien agrede** y que no vivan en el mismo hogar, y registrar al menos 2 para no depender de una sola persona. El contacto no tiene que ser familiar: puede ser una amiga, una compañera o una persona acompañante de Makipuray.
- **Discreta no es invisible.** La app no puede impedir que alguien con acceso al celular la abra o revise el almacenamiento del navegador. Se dice con claridad.
- El mensaje enviado **queda en el historial de WhatsApp** de la usuaria. Recomendación en la orientación: activar mensajes temporales en ese chat o borrarlo.
- La app **no llama a emergencias, no vigila ni monitorea.** Siempre se muestra: "si hay peligro inmediato, busca ayuda local cuando sea seguro hacerlo".
- Los puntos del mapa son **ejemplos**; no se presentan como lugares seguros ni como destino recomendado.
- Ningún contacto, ubicación ni mensaje sale del dispositivo salvo que la usuaria lo envíe.

## Fuera de alcance (en este sprint)

- Cuentas, registro e inicio de sesión (no hay backend).
- PIN para proteger la configuración.
- Renombrar las claves de almacenamiento a nombres neutros.
- Elegir contactos desde la agenda del teléfono.
- Alertas automáticas, grabación de audio/video o seguimiento de ubicación.
- IA generativa en respuestas de apoyo.
- Verificación real de "puntos seguros" (se hace en la fase de co-diseño con Makipuray).

## Criterios de aceptación → pruebas

| RF | Prueba | Cómo |
|---|---|---|
| RF-4 | El mensaje de la receta de confianza sale con el texto acordado y el teléfono con prefijo 51 | Unitaria |
| RF-5 | Sin acción explícita no se pide ubicación; con ella el enlace se agrega al mensaje | Unitaria + manual |
| RF-10 | Tras borrar, no queda ninguna clave de la app salvo la marca de "ya configurada" | Unitaria |
| RF-11 | Con almacenamiento vacío, al abrir "/" aparece la configuración con las tres tarjetas | Manual |
| RF-12 | Tras completar, omitir o salir rápido, recargar no reabre la configuración; con perfil previo no aparece | Unitaria + manual |
| RF-13 | "Salir rápido" visible en todos los pasos; no guarda contactos | Manual |
| RF-14 | Recorrer todas las pestañas y el engranaje sin encontrar texto de configuración, tutorial o borrado | Manual (checklist) |
| RF-15 | 5 toques en menos de 1,5 s abren la configuración; con pausa mayor, no | Unitaria + manual |
| RF-16 | Borrar desde configuración limpia todo, quita el hash de la URL y no reabre la configuración | Manual |
| RF-17 | Cada opción del engranaje cambia lo esperado y persiste | Manual |
| RF-18 | +51 por defecto; con 1 contacto no se puede continuar; el tercero es opcional | Unitaria + manual |

## Preguntas abiertas

- **P-1:** ¿La pestaña Bienestar (artículos sobre relaciones y apoyo) es "pista" suficiente para delatar la app? Hoy se mantiene como orientación general. Validar con la mentora de Makipuray.
- **P-2:** ¿El texto exacto del mensaje es creíble y seguro? El texto actual (*"Te paso la receta de mi …, ven a probarla"*) **invita a ir**, lo que contradice la regla de no pedir que acuda. Evaluar una redacción neutra que no pida ir a ningún lado. Validar con Makipuray.
- **P-5:** ¿Una señal o dos? Una receta podría significar "escríbeme cuando puedas" y otra "urgente". Se deja como mejora futura.
- **P-3:** ¿Los teléfonos de apoyo mostrados siguen vigentes? Confirmar en fuentes oficiales antes de la demo.
- **P-4:** ¿Se publica el repositorio de forma abierta o privada hasta la entrega? (El gesto de reapertura quedaría documentado.)