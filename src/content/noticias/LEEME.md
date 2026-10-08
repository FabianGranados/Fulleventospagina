# Noticias de Fulleventos: cómo se publican

Este archivo NO es una noticia: la colección lo ignora (`src/content.config.ts`, patrón `['*.md', '!LEEME.md']`).

Cada noticia es **un archivo Markdown en esta carpeta**. Para publicar una noticia basta con escribir un archivo nuevo con el formato de abajo y volver a compilar el sitio (`npm run build`). No hay que tocar código. Por eso este es el formato que debe producir cualquier automatización (un guion, un flujo de n8n o Zapier, un CMS que escriba en el repositorio, etc.).

## Nombre del archivo = dirección de la noticia

`src/content/noticias/<slug>.md` se publica en `/noticias/<slug>`.

- Solo minúsculas, números y guiones; sin tildes, eñes ni espacios. Ejemplo: `cinco-planes-gratis-este-finde-en-colombia.md`.
- El nombre no se cambia después de publicar: cambiarlo rompe los enlaces que ya se compartieron.
- No uses `LEEME` como nombre.

## Frontmatter

Va entre dos líneas `---` al principio del archivo. Si falta un campo obligatorio o un valor no es válido, **la compilación falla y dice qué archivo y qué campo están mal**, así que nunca se publica una noticia rota.

```yaml
---
titulo: Cinco planes gratis este finde en Colombia
bajada: Jazz al parque, trova junto al lago, joropo y música andina. Una o dos frases que resumen la noticia.
fecha: 2026-10-06
ciudad: nacional
tema: guias
eventos: [e2, e6, e16]
destacada: false
# Opcionales:
antetitulo: Gratis · Barranquilla
imagen:
  src: https://ejemplo.com/foto.jpg
  alt: Público frente a la tarima al atardecer
fuente:
  nombre: Nombre del medio o de la entidad
  url: https://ejemplo.com/nota-original
---
```

| Campo | Obligatorio | Qué va |
|---|---|---|
| `titulo` | Sí | El titular, de 10 a 140 caracteres. Es el `h1` de la página y el título de la pestaña ("{titulo} · Fulleventos"). |
| `bajada` | Sí | Una o dos frases (20 a 280 caracteres). Va debajo del título, en las tarjetas destacadas y en la descripción para buscadores y redes. |
| `fecha` | Sí | Fecha de publicación, `AAAA-MM-DD` (zona de Colombia). Ordena las noticias: la más nueva va primero. |
| `ciudad` | Sí | Un id de `src/data/ciudades.ts` (`bogota`, `medellin`, `cali`, `barranquilla`, `cartagena`, `santamarta`, `bucaramanga`, `pereira`, `villavicencio`, `pasto`, `leticia`) o `nacional` si no es de una sola ciudad. |
| `tema` | Sí | Uno de la lista cerrada: `conciertos`, `rumba`, `deporte`, `teatro`, `comida`, `festivales`, `guias`. La lista está en `src/data/noticias.ts`; agregar un tema es un cambio de código. |
| `eventos` | No (por defecto `[]`) | Ids de eventos de `src/data/eventos.ts` (`e1`, `e2`…) relacionados. Se muestran en "Eventos de esta noticia" con su tarjeta y su botón a la boletera. Un id que no exista hace fallar la compilación. |
| `destacada` | No (por defecto `false`) | `true` para la noticia grande de la Bienvenida y de `/noticias`. Si hay varias, sale la más reciente; si no hay ninguna, sale la más reciente de todas. |
| `antetitulo` | No | Reemplaza el antetítulo automático "{Tema} · {Ciudad}" (por ejemplo "Cartel confirmado · Bogotá"). Máximo 60 caracteres. |
| `imagen` | No | `src`: URL `https://…` o ruta de un archivo en `public/` (`/noticias/foto.jpg`). `alt`: descripción de la imagen para lectores de pantalla (obligatoria si hay imagen). Sin imagen se usa el degradado del sitio con los colores del primer evento o del tema. |
| `fuente` | No | `nombre` y `url` de la fuente original cuando la noticia sale de otro medio o de un comunicado. Se muestra como "Fuente: …" debajo de la fecha. |

## Cuerpo

Después del frontmatter va el texto en Markdown:

- De 3 a 6 párrafos cortos. Párrafos separados por una línea en blanco.
- Subtítulos con `##` (nunca `#`: el título de la página ya es el `h1`).
- Listas con `-`, negritas con `**…**` y enlaces con `[texto](https://…)`. Los enlaces a otras páginas del sitio van con ruta (`/agenda`, `/mapa`).
- No repitas el título ni la bajada al principio del cuerpo: la página ya los muestra.
- El tiempo de lectura se calcula solo (200 palabras por minuto).

## Reglas de contenido (CLAUDE.md)

- Español de Colombia con tuteo. Precios como "$45.000" o "Gratis"; horas como "8:00 p. m.". Siempre "Toda Colombia".
- La hora de un evento no se copia en la noticia: está en `src/data/eventos.ts` y se ve en su tarjeta (H37).
- Nada de cifras, citas textuales ni declaraciones de personas o entidades reales presentadas como hechos si no vienen de una fuente que se cita en `fuente`.
- No se nombran artistas como confirmados sin confirmación del organizador, ni boleteras reales como vendedoras sin acuerdo (H1).
- Los datos que faltan van con un marcador entre corchetes (`[BOLETERA]`, `[ENLACE OFICIAL]`). Los marcadores no se publican en producción: antes de salir con datos reales hay que reemplazarlos (P8).
- Sin emoji.

## Mientras sea demostración

Las noticias de esta carpeta son contenido de ejemplo y las páginas lo dicen ("Contenido de ejemplo"). El sitio no se indexa todavía (`noindex` en `src/layouts/Base.astro` y `Disallow: /` en `public/robots.txt`).
