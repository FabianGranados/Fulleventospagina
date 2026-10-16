# `fulleventos_event_images.jsonl`: lo que entrega Gemini Deep Research

Hay **una línea por evento**, con los datos del evento y sus imágenes. Sirve para eventos que ya existen y también para los que todavía no están en Fulleventos. Formato `fulleventos-eventos-imagenes/1`:

- JSON Schema: `docs/esquemas/fulleventos_event_images.v1.schema.json`.
- El validador real es `scripts/imagenes/formato-gemini.mjs`.
- Hay una muestra con los defectos típicos de un informe en `tests/importador/muestras/fulleventos_event_images.jsonl`.

```
fulleventos_event_images.jsonl
  └─ npm run imagenes -- adaptar archivo.jsonl            (no toca Cloudflare)
       ├─ imagenes-importador.jsonl  → npm run imagenes -- importar … (--simular primero)
       ├─ eventos-nuevos.jsonl       → cola para la etapa B (eventos en D1)
       └─ reporte.json               → errores, avisos y conteos
```

## Formato de la investigación nacional (`gemini-investigacion/1`)

El adaptador también lee el formato que entregó la investigación de octubre de 2026: archivos separados con campos en
inglés (`fulleventos_events_verified.jsonl`, `_review`, `_rejected`, `fulleventos_event_images.jsonl` con una imagen
por línea unida por `event_slug`, `fulleventos_images_review.jsonl` y `fulleventos_corrections.jsonl`). Se le puede
pasar la carpeta entera: `npm run imagenes -- adaptar carpeta/`. Las noticias se cuentan y se ignoran; los
rechazados no pasan a la cola; las correcciones se comprueban pero no se aplican solas. El estado `verified` de Gemini
se guarda como dato y no autoriza nada. Detalle de los campos en `scripts/eventos/normalizar.mjs` y reglas en
`docs/etapa-b-eventos-d1.md`.

## Qué tolera la lectura

Deep Research escribe informes, no archivos de máquina. El adaptador acepta y deja anotado en `reporte.json`:

- Texto antes y después, bloques ` ```json ` y listas JSON completas.
- Comillas tipográficas (“ ”) y comas finales.
- `null`, `""`, `"N/A"` y `"No disponible"`, que se toman como dato ausente.
- `"sí"` y `"no"` en `oficial` y `gratis`.
- Fechas `DD/MM/AAAA` y `AAAA-MM-DDThh:mm`.
- Precios como `"$40.000"`.

Lo que no puede interpretar, como líneas cortadas, eventos sin fuentes o fechas en texto ("15 de noviembre"), lo reporta como error con su número de línea y **no lo inventa**.

## Sin pérdida de procedencia

Cada imagen convertida lleva `procedencia`, con la imagen original completa: todas las evidencias, `licencia_url`, `autor`, `pagina` y la fecha de consulta. También lleva las fuentes del evento, la `ref` y la línea de origen. El importador guarda eso tal cual en la columna `procedencia` de D1. Las columnas `licencia` y `derechos_evidencia` llevan un resumen legible. El adaptador revisa cada registro y lo rechaza si algún dato de la imagen original no aparece en el convertido.

## Prompt sugerido (por lotes)

Pide un lote por ciudad y por semana, de unos 20 a 50 eventos. Los informes largos tienden a cortarse o a resumir, y un lote pequeño se revisa mejor.

> Investiga los eventos públicos de **[ciudad]** entre el **[fecha inicial]** y el **[fecha final]** (conciertos, rumba, deporte, arte y teatro, comida). Usa **solo fuentes oficiales**: el sitio o las redes del organizador, del escenario, del artista o de la boletera, o la entidad pública que lo organiza. No incluyas eventos que solo aparezcan en agregadores o en noticias sin una fuente oficial.
>
> Entrega **solo** líneas JSONL, una por evento, sin texto adicional, que cumplan exactamente este esquema: [pegar `docs/esquemas/fulleventos_event_images.v1.schema.json`].
>
> Reglas:
> 1. `ref` = `ciudad-AAAA-MM-DD-titulo-en-minusculas-con-guiones`, siempre igual para el mismo evento.
> 2. Fechas en AAAA-MM-DD y hora en 24 h (hora de Colombia). Si no sabes un dato, omite el campo: **no lo inventes**.
> 3. `precio_desde` en pesos, solo números. `gratis: true` solo si la fuente lo dice.
> 4. Cada evento lleva al menos una fuente con su `url` y `consultado_en`.
> 5. Imágenes: solo las publicadas por la fuente oficial, con el enlace directo al archivo, preferiblemente de al menos 1200 px de ancho. Nada de bancos de imágenes, buscadores de imágenes, capturas de pantalla ni fotos de fans.
> 6. `derechos.estado = "confirmado"` solo si encontraste un texto que permite reutilizar la imagen (kit de prensa, licencia abierta, permiso publicado). Copia ese texto en `evidencias[].cita` con su `url`. Si no lo encontraste, usa `"desconocido"`.
> 7. `texto_alternativo` describe lo que se ve, en español de Colombia.

**Sobre los permisos:** lo que Gemini marque como confirmado **no se publica solo**. El importador lo deja pendiente hasta que una persona lo revise y lo apruebe (`npm run imagenes -- pendientes` y luego `aprobar`).
