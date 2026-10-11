# Formato de entrada del importador de imágenes

> **Para Gemini usa `docs/gemini-eventos-imagenes.md`** (`fulleventos_event_images.jsonl`, una línea por evento). Este es el formato interno, una línea por imagen, que produce `npm run imagenes -- adaptar` y que lee `importar`. Sirve también para cargar imágenes a mano.

El importador (`npm run imagenes -- importar archivo.jsonl`) recibe **JSONL**, con un objeto por línea. También acepta JSON con una lista o `{ "imagenes": [...] }`. El esquema formal está en `scripts/imagenes/esquema-gemini.json`, y hay un ejemplo con dominios ficticios en `docs/ejemplos/imagenes-gemini.jsonl`.

## Campos

| Campo | Obligatorio | Notas |
|---|---|---|
| `evento.id` | uno de los tres modos | Id de Fulleventos (`e3`). Si no, `ciudad` + `slug` (de la URL `/evento/bogota/rock-en-el-movistar-arena`) o `titulo` + `fecha` (AAAA-MM-DD). |
| `imagen.url` | sí | **URL directa del archivo** con `https://`, no la de la página. |
| `imagen.texto_alternativo` | sí | De 10 a 300 caracteres, en español: qué se ve. |
| `imagen.tipo` | no | `principal` (la de las tarjetas, por defecto), `afiche` o `galeria`. |
| `imagen.credito` | no | "Foto: …". |
| `fuente.nombre` · `fuente.url` · `fuente.oficial` | sí | Página oficial donde aparece la imagen. `oficial: true` solo si es del organizador, del escenario o de la boletera del evento. |
| `derechos.estado` | sí | `confirmado`, `pendiente`, `rechazado` o `desconocido`. |
| `derechos.licencia` · `evidencia` · `verificado_en` | para publicar | Qué permite reutilizarla, dónde consta y cuándo se verificó. |
| `derechos.verificado_por` | no | Se acepta, pero el importador lo ignora: todo lo que llega en un archivo cuenta como `agente` y queda pendiente hasta que una persona lo apruebe con `npm run imagenes -- aprobar`. |
| `reemplazar` + `motivo_reemplazo` | no | Solo para cambiar una foto ya publicada. |

## Prompt sugerido para Gemini

> Investiga imágenes oficiales para estos eventos de Fulleventos: [lista con id, título, ciudad y fecha]. Para cada evento busca **solo** en el sitio o en las redes oficiales del organizador, del escenario o de la boletera. Prefiere los kits o salas de prensa y las imágenes con licencia que permita reutilizarlas. No uses bancos de imágenes genéricos, buscadores de imágenes, sitios de noticias ni fotos de fans.
>
> Entrega **solo** JSONL, con una línea por imagen, siguiendo exactamente este esquema: [pegar `scripts/imagenes/esquema-gemini.json`].
>
> Reglas:
> - `imagen.url` es el enlace directo al archivo (.jpg, .png, .webp o .avif) y mide al menos 1200 px de ancho cuando exista.
> - `derechos.estado` es `confirmado` solo si encontraste un texto que permite reutilizar la imagen. Cita ese texto o su URL en `evidencia` y escribe la licencia. Si no lo encontraste, usa `desconocido`. **No inventes permisos.**
> - `verificado_por` siempre es `agente`.
> - `texto_alternativo` describe lo que se ve, en español de Colombia, sin decir "imagen de".
> - Si no encuentras una imagen oficial para un evento, no escribas línea para ese evento.

Después, revisa el archivo antes de guardar nada con `npm run imagenes -- importar archivo.jsonl --simular`.
