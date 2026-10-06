# Fulleventos — Página web

Sitio estático (HTML + CSS + JS, sin dependencias ni build).

## Ver en local
Abre `index.html` en el navegador, o sirve la carpeta:
```bash
python3 -m http.server 8000
```

## Personalizar
- **Contacto (WhatsApp, correo, Instagram):** objeto `CONFIG` al inicio de `script.js`.
- **Fotos de la galería:** pon las imágenes en `assets/` y reemplaza cada
  `<div class="gallery__item">` en `index.html` por `<img src="assets/foto.jpg" alt="...">`
  dentro del mismo div.
- **Textos y cifras** (eventos realizados, años de experiencia): en `index.html`.
- **Colores:** variables en `:root` al inicio de `styles.css`.

## Publicar
Funciona tal cual en Vercel, Netlify o GitHub Pages (raíz del repo).
