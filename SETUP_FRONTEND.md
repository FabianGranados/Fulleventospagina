# 🚀 Fulleventos Frontend - Setup y Guía de Desarrollo

## ¿Qué se ha hecho?

### ✅ Fase 1: Sistema de Diseño Completo
- **design-system.html**: Documento interactivo con toda la paleta de colores, tipografía, componentes y guías
- Color System: Primario (rosa #FF3D81), Acento (naranja #FFB547), Neutros
- Tipografía: Sora (headings), Inter (body) con escala completa
- Espaciado: Sistema 4px base multiplicado (xs, sm, md, lg, xl, 2xl, 3xl)
- Componentes base: Botones, Cards, Inputs con todos los estados
- Animaciones: 150-300ms, ease-out para entrada, ease-in para salida

### ✅ Fase 2: Stack React + Tailwind + Vite
- **Configuración Tailwind** (`tailwind.config.js`):
  - Todos los tokens de diseño como variables extendidas
  - Componentes de Tailwind reutilizables (.btn-primary, .card, .input, etc.)
  - Animaciones personalizadas (fade-in, scale-in, slide-up, etc.)
  - Responsive breakpoints optimizados
  
- **Vite Config** (`vite.config.js`):
  - Desarrollo rápido con hot reload
  - Build optimizado para producción
  - Puerto 3000 por defecto

- **PostCSS** (`postcss.config.js`):
  - Tailwind + Autoprefixer para compatibilidad

### ✅ Fase 3: Componentes React Principales
- **Navbar**: Navegación fija 70px con logo, busca, notificaciones, botón crear evento
  - Responsive: Menú hamburguesa en mobile
  - Indicador de notificaciones
  
- **Hero Section**: La sección que "enamora y atrapa"
  - Fondo gradiente animado (primario → accent)
  - Tagline: "Descubre qué hacer en Bogotá"
  - Buscador destacado
  - Botones de filtros rápidos (Esta noche, Este finde, Gratis, Cerca de mí)
  - Social proof (estadísticas)
  - Efectos de glassmorphism y blur
  
- **EventCard**: Tarjeta de evento reutilizable
  - Imagen placeholder con emoji
  - Badge de fecha
  - Título, categoría, fecha/hora, ubicación, precio
  - Botones: Guardar (heart), Ver entrada
  - Animaciones hover (translate, shadow)
  - Estado "liked" interactivo
  
- **Home Page**: Página principal completa
  - Hero + Grid de eventos (1 col mobile → 4 cols desktop)
  - Load more button (simula infinite scroll)
  - Call-to-action para organizadores
  - Footer con links y redes sociales
  - Mock data con 8 eventos de ejemplo

### ✅ Fase 4: Estilos Globales y Accesibilidad
- Global CSS: Transiciones suaves, scroll behavior, scrollbar personalizado
- Focus visible para accesibilidad (tabindex)
- Optimizaciones de print
- Sistema de componentes con clases Tailwind base

## 🏃 Cómo Correr el Proyecto

### Requisitos Previos
- Node.js 16+ 
- npm o yarn

### Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo (puerto 3000)
npm run dev

# 3. Build para producción
npm run build

# 4. Preview del build
npm run preview
```

El servidor abrirá automáticamente en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
src/
├── main.jsx              # Entrada de React
├── App.jsx              # Componente raíz
├── styles/
│   └── index.css        # Estilos globales + Tailwind
├── components/
│   ├── Navbar.jsx       # Barra de navegación
│   ├── Hero.jsx         # Sección hero/landing
│   └── EventCard.jsx    # Tarjeta de evento
└── pages/
    └── Home.jsx         # Página principal
```

## 🎨 Sistema de Colores (Tailwind)

**Primario (Rosa)**: `primary-50` → `primary-900`
- Main: `primary-500` (#FF3D81)

**Acento (Naranja)**: `accent-100`, `accent-400`, `accent-500`
- Secondary: `accent-400` (#FFB547)

**Neutro (Grises)**: `neutral-50` → `neutral-1000`
- BG: `neutral-50` (#F9F8FB)
- Text: `neutral-700` (#423F52)

**Semánticos**: `success`, `warning`, `error`, `info`

## 🔤 Tipografía (Tailwind)

**Headings**: `font-sora` (700)
- H1: 48px desktop / 32px mobile
- H2: 36px desktop / 28px mobile
- H3: 24px desktop / 20px mobile

**Body**: `font-inter` (400)
- Body Large: 18px
- Body: 16px (default)
- Body Small: 14px
- Caption: 12px

## 📦 Tailwind Classes Personalizadas

```css
/* Buttons */
.btn-primary      /* Gradiente primario + hover effects */
.btn-secondary    /* Outline */
.btn-ghost        /* Transparent */
.btn-sm / .btn-lg /* Tamaños */

/* Cards */
.card             /* Borde + sombra + hover effects */

/* Inputs */
.input            /* 44px height + focus states */
.input-error      /* Borde rojo + anillo error */

/* Typography */
.h1, .h2, .h3    /* Headings con size responsive */
.body, .body-sm   /* Text styles */
.caption          /* Labels pequeños */

/* Badges */
.badge-primary, .badge-accent, .badge-success, .badge-error
```

## 🚀 Próximas Fases

### Fase 5: Backend - Cloudflare Workers
- API routes para eventos, usuarios, búsqueda
- Autenticación con OAuth (Google, Email)
- Integración con TuBoleta, Ticketmaster, Fever

### Fase 6: Database - Cloudflare D1
- Esquema de eventos, usuarios, favoritos
- Índices para búsqueda rápida
- Replicación de boleteras

### Fase 7: Agentes Automatizados
- **Recolector**: Crawl diario de boleteras
- **Monitor**: Seguimiento de cambios competitivos
- **Auditor**: Mejoras de UX basadas en analytics

### Fase 8: Funcionalidades Comunitarias
- Autenticación y perfiles de usuario
- Sistema de favoritos/guardados
- Seguimiento de artistas/venues
- Reviews y ratings
- Compartir en redes sociales

### Fase 9: Panel de Promotor
- Crear/editar eventos
- Analytics de eventos
- Integración con vendedores de entradas

### Fase 10: Optimizaciones
- SEO con schema.org/Event
- PWA (offline support)
- Analytics e instrumentación
- Despliegue en Cloudflare Pages

## 🌐 Deployment en Cloudflare Pages

```bash
# El repo está configurado para desplegar automáticamente
# Simplemente haz push a la rama y se construye automáticamente

# Manualmente (si es necesario):
npm run build
# Luego subir la carpeta 'dist/' a Cloudflare Pages
```

## 📝 Notas Importantes

1. **Mock Data**: Actualmente uses datos mock. Reemplazar con API real cuando esté lista
2. **Responsividad**: Mobile-first (375px+) → Tablet (640px+) → Desktop (1024px+)
3. **Accesibilidad**: WCAG 2.1 Level AA (contraste 4.5:1, focus states)
4. **Performance**: Lazy loading en cards, código splittable, optimizado para LCP, FID, CLS
5. **Animaciones**: Respetar `prefers-reduced-motion` para usuarios sensibles

## 🔗 Referencias

- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [React 18](https://react.dev/)
- [Lucide Icons](https://lucide.dev/)
- [Google Fonts (Sora, Inter)](https://fonts.google.com/)

## ❓ Preguntas Frecuentes

**P: ¿Cómo cambio los colores?**
R: Edita `tailwind.config.js` en la sección `colors`. Todas las variables están centralizadas.

**P: ¿Cómo agrego nuevas rutas?**
R: Por ahora todo es una SPA (Single Page App). Para multi-page usar React Router.

**P: ¿Dónde están las imágenes?**
R: Actualmente son placeholders (emojis). Reemplazar con URLs reales o importar imágenes.

**P: ¿Cómo integro la API?**
R: Crear un archivo `src/utils/api.js` con fetch/axios calls. Los datos mock están en `Home.jsx`.

---

**Última actualización**: 6 de octubre 2026  
**Status**: MVP Frontend Completo ✅  
**Próximo paso**: API Backend en Cloudflare Workers
