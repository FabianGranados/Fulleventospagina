# Handoff de diseño: Fulleventos

**Red social de eventos para toda Colombia.**
Documento de entrega para implementación · versión del 7 de octubre de 2026

---

## 0. Cómo usar este documento

Este documento es **la única fuente de verdad** para implementar Fulleventos. Describe 8 pantallas diseñadas como prototipo interactivo, el sistema visual, los componentes y todas las decisiones que se tomaron para llegar ahí.

### Orden de autoridad cuando algo no coincida

1. **Este documento.** Lo que dice aquí manda.
2. **Las "Correcciones obligatorias de la auditoría"** que aparecen en cada pantalla (sección 8). Cuando el prototipo y la auditoría se contradicen, se implementa lo que pide la auditoría. Ejemplos:
   - La cantidad de boletas arranca en 1, no en 2.
   - El precio que se muestra incluye el cargo por servicio.
   - Debe existir la etiqueta `viewport`.
3. **El prototipo** (`diseno/prototipo/*.dc.html`) y **las capturas** (`diseno/capturas/`). Sirven para resolver dudas visuales que este texto no alcance a cubrir.

### Archivos de referencia en este repositorio

| Ruta | Qué es |
|---|---|
| `docs/handoff/` | Este documento (esta carpeta). Empieza por este índice. |
| `docs/auditoria-2026-10-07.md` | Informe completo de auditoría (hallazgos H1–H62), con evidencia y plan de acción. |
| `diseno/prototipo/*.dc.html` | Código de las 8 pantallas del prototipo (formato *Design Components*: HTML con estilos inline, plantilla con `{{huecos}}`, `<sc-for>` para repeticiones, `<sc-if>` para condicionales y una clase `Component extends DCLogic` con el estado y los datos). **No es código de producción**: es la especificación visual y de comportamiento. |
| `diseno/prototipo/canvas.json` | Orden y tamaño de las pantallas en el lienzo de diseño. |
| `diseno/capturas/*.jpg` | Capturas reales de cada pantalla a 390, 768 y 1280 px. Incluye los 4 pasos de compra, el chat en celular, el mapa con Medellín elegido y la ventana de repost. |
| `diseno/referencia/preview-demo.html` | **Código base original del cliente** (marketplace de eventos de Bogotá), de donde nació todo el diseño. La sección 7 dice qué se reutiliza de aquí. |
| `.claude/agents/auditor-web.md` | Agente auditor para revisar la implementación cuando esté lista. |

El prototipo navegable está en el lienzo de diseño: https://claude.ai/artifact/1G7P2YCrnkBpgtdai9aWSQ (es privado; el dueño debe compartirlo para que otros lo abran).

### Convenciones del documento

- Los **textos entre comillas** son literales: se copian tal cual, con mayúsculas, tildes y signos.
- Los textos entre **corchetes** `[ASÍ]` son marcadores que el negocio debe llenar con datos reales (nombre de la orquesta, NIT, pasarela, boletera…). **No se deben publicar con corchetes.**
- "**Prototipo**" significa lo que hoy existe en el diseño. "**Producción**" significa lo que el producto real debe hacer.
- Los datos de ejemplo (eventos, personas, precios, conteos) **no son reales**. En producción vienen del backend.
- Medidas en px, salvo cuando el diseño usa `rem` (base 16 px) o `clamp()`.

### Qué es prototipo y qué no

El prototipo no tiene backend. Cada pantalla guarda su propio estado y lo pierde al navegar a otra. Por eso:
- un repost no aparece en el feed;
- una compra no aparece en "Mis boletas";
- el pago "se aprueba" al instante.

Todo lo que el prototipo **simula** (pagos, reservas de cupos, QR, chat en tiempo real, notificaciones, mapa) está especificado en la sección 8 y en los "Requisitos para producción" de la auditoría.

## Índice

| Sección | Archivo | Tamaño |
|---|---|---|
| 1. Objetivo de la página y público | [01-objetivo-y-publico.md](01-objetivo-y-publico.md) | 3 KB |
| 2. Decisiones de diseño (y lo descartado) | [02-decisiones.md](02-decisiones.md) | 17 KB |
| 3. Sistema visual | [03-sistema-visual.md](03-sistema-visual.md) | 133 KB |
| 4. Estructura de la página, sección por sección | [04-estructura/README.md](04-estructura/README.md) | 8 KB |
| &nbsp;&nbsp;4.3 Bienvenida | [04-estructura/01-bienvenida.md](04-estructura/01-bienvenida.md) | 53 KB |
| &nbsp;&nbsp;4.4 Registro | [04-estructura/02-registro.md](04-estructura/02-registro.md) | 29 KB |
| &nbsp;&nbsp;4.5 Inicio (feed) | [04-estructura/03-inicio.md](04-estructura/03-inicio.md) | 72 KB |
| &nbsp;&nbsp;4.6 Agenda | [04-estructura/04-agenda.md](04-estructura/04-agenda.md) | 59 KB |
| &nbsp;&nbsp;4.7 Mapa | [04-estructura/05-mapa.md](04-estructura/05-mapa.md) | 58 KB |
| &nbsp;&nbsp;4.8 Evento y compra | [04-estructura/06-evento.md](04-estructura/06-evento.md) | 95 KB |
| &nbsp;&nbsp;4.9 Mensajes (chat) | [04-estructura/07-mensajes.md](04-estructura/07-mensajes.md) | 87 KB |
| &nbsp;&nbsp;4.10 Perfil | [04-estructura/08-perfil.md](04-estructura/08-perfil.md) | 39 KB |
| 5. Comportamiento responsive | [05-responsive.md](05-responsive.md) | 44 KB |
| 6. Estados interactivos | [06-estados-interactivos.md](06-estados-interactivos.md) | 93 KB |
| 7. Componentes: qué reutilizar y qué crear | [07-componentes.md](07-componentes.md) | 293 KB |
| 8. Detalles finos que podrían perderse | [08-detalles-finos.md](08-detalles-finos.md) | 176 KB |
| Anexo: inventario automático de estilos | [../handoff-inventario-estilos.md](../handoff-inventario-estilos.md) | — |
| Informe de auditoría (H1–H62) | [../auditoria-2026-10-07.md](../auditoria-2026-10-07.md) | — |

> **Para quien implementa con Claude Code:** lee primero este índice, luego 1, 2 y 3; después, para cada pantalla, 4 (estructura), 5 (responsive), 6 (estados) y 8 (detalles y correcciones obligatorias). La sección 7 dice qué reutilizar del código original y qué componentes crear.
