# 🎨 FULLEVENTOS: Wireframes, Flujo y Especificaciones de Diseño

## Visión General de la Experiencia

### El Viaje del Usuario
```
Usuario llega → Se enamora de la home → Scrollea eventos → 
Hace clic en uno → Ve detalles → Va a TuBoleta → Vuelve a buscar
```

---

## 📱 PÁGINAS PRINCIPALES (MVP v1)

### 1. HOME / EXPLORAR (Landing Page + Discovery)
**URL:** `/`

#### Estructura Visual
```
┌─────────────────────────────────────────┐
│  [NAVBAR]                               │ ← Fijo, minimal
│  Logo + Signin/Signup                   │
├─────────────────────────────────────────┤
│                                         │
│      [HERO SECTION - GRANDE]            │
│  Imagen de fondo: evento vibrante       │
│  (concierto, DJ, gente feliz)           │
│                                         │
│  "Descubre qué hacer en Bogotá"         │
│  Subtítulo: "Esta semana"               │
│                                         │
│  [Buscador destacado]                   │
│  "Busca artista, lugar, género..."      │
│                                         │
│  [Botones rápidos: horizontales]        │
│  📍 Esta noche | 🎵 Conciertos |        │
│  🎉 Fiestas | 🎭 Teatro                │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  FEED DE EVENTOS (scroll infinito)      │
│                                         │
│  [CARD 1]                               │
│  ┌─────────────────────────────────┐   │
│  │ [Imagen grande]                 │   │
│  │ 🎵 Morat en Vivo                │   │
│  │ Sábado 22 ago • 20:00            │   │
│  │ Teatro Metropólitano • Chapinero│   │
│  │ $150K - $250K                   │   │
│  │                                 │   │
│  │ ❤️ [Guardar]  →  [Ver entrada] │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [CARD 2]                               │
│  ┌─────────────────────────────────┐   │
│  │ [Imagen grande]                 │   │
│  │ 🎉 Fiesta Bogotá Electrónica    │   │
│  │ Viernes 21 ago • 22:00           │   │
│  │ Andres Carne de Res              │   │
│  │ $60K - $100K                    │   │
│  │                                 │   │
│  │ ❤️ [Guardar]  →  [Ver entrada] │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [CARD 3]                               │
│  ...infinito scroll...                  │
│                                         │
└─────────────────────────────────────────┘
```

#### Componentes Detallados

**NAVBAR**
```
Altura: 70px
├─ Logo (izq): "FULLEVENTOS" (Sora Bold)
├─ Espacio central
├─ Acciones (der):
│  ├─ Buscador pequeño (icono lupa)
│  ├─ Notificaciones (campana)
│  ├─ [Crear evento] botón (promotores)
│  ├─ Perfil (avatar circular)
│  └─ Menú hamburguesa (mobile)
```

**HERO SECTION**
```
Altura: 60vh (viewport)
Imagen de fondo: evento vibrante (Cloudinary)
Overlay oscuro: rgba(0,0,0,0.4) para legibilidad

Contenido centrado:
├─ Tagline: "Descubre qué hacer en Bogotá" 
│  Font: Sora, 48px (desktop) / 32px (mobile)
│  Color: Blanco
│  Margin bottom: 24px
│
├─ Subtítulo: "Esta semana"
│  Font: Inter, 18px
│  Color: rgba(255,255,255,0.8)
│  Margin bottom: 32px
│
├─ Buscador:
│  Width: 100% max 500px
│  Height: 56px
│  Border radius: 12px
│  Placeholder: "Busca artista, lugar, género..."
│  Icon: Lupa (izq)
│  Margin bottom: 24px
│
└─ Botones rápidos (flex, gap 12px):
   ├─ 📍 Esta noche
   ├─ 🎵 Conciertos
   ├─ 🎉 Fiestas
   └─ 🎭 Teatro
   (Cada botón: outline, hover → fill)
```

**CARD DE EVENTO**
```
Layout: Columna
Width: 100% (mobile), 350px (desktop en grid)
Aspect ratio imagen: 16/9

Structure:
├─ Imagen [hover: zoom 1.05]
│  └─ Badge (esquina superior izq):
│     "HOY" / "MAÑANA" / fecha
│
├─ Contenedor (padding: 16px)
│  ├─ Género/Category: "🎵 CONCIERTO"
│  │  Font: Inter 12px, bold, color primaria
│  │
│  ├─ Título: "Morat en Vivo"
│  │  Font: Sora 18px, bold
│  │  Color: texto oscuro
│  │  Lines: 2 max (text-overflow: ellipsis)
│  │
│  ├─ Fecha/Hora: "Sábado 22 ago • 20:00"
│  │  Font: Inter 14px
│  │  Color: muted (gris)
│  │  Icon: 🕒
│  │
│  ├─ Ubicación: "Teatro Metropólitano • Chapinero"
│  │  Font: Inter 14px
│  │  Color: muted
│  │  Icon: 📍
│  │
│  ├─ Precio: "$150.000 - $250.000"
│  │  Font: Inter 14px, bold
│  │  Color: primaria
│  │  Icon: 💰
│  │
│  └─ Actions (flex, space-between):
│     ├─ ❤️ Guardar (botón ghost)
│     └─ → Ver entrada (botón primario)
```

---

### 2. DETALLE DE EVENTO
**URL:** `/evento/:id`

#### Estructura
```
┌─────────────────────────────────────────┐
│  [NAVBAR]                               │
├─────────────────────────────────────────┤
│                                         │
│  [Imagen HERO - Full width]             │
│  ├─ Overlay gradiente                  │
│  └─ Botón atrás (X) esquina superior   │
│                                         │
│  [Contenido principal - padding 20px]  │
│                                         │
│  Género: "🎵 CONCIERTO"                │
│  Título: "Morat en Vivo"               │
│  Rating: ⭐ 4.8 (45 reviews)           │
│                                         │
│  [INFO CARDS - Grid 2 cols]            │
│  ├─ 🕒 Sábado 22 ago, 20:00           │
│  ├─ 📍 Teatro Metropólitano            │
│  ├─ 💰 $150K - $250K                  │
│  └─ 👥 2,350 interesados              │
│                                         │
│  [Descripción]                          │
│  "Morat regresa con su gira 2024..."   │
│  (expandible si es larga)               │
│                                         │
│  [MAPA]                                 │
│  Ubicación en Google Maps (embebido)   │
│                                         │
│  [ARTISTA/ORGANIZADOR]                 │
│  ├─ Avatar                             │
│  ├─ Nombre                             │
│  ├─ Seguidores                         │
│  └─ [Seguir] botón                    │
│                                         │
│  [CTA Principal]                        │
│  ┌─────────────────────────────────┐   │
│  │ ➡️ IR A COMPRAR EN TUBOLETA     │   │
│  │ "Compra tus boletas de forma   │   │
│  │  segura en TuBoleta"            │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Secundario]                           │
│  ❤️ Guardar  |  📢 Compartir           │
│                                         │
│  [SECCIÓN SOCIAL]                       │
│  "Amigos que van"                       │
│  [Avatares de amigos]                  │
│                                         │
│  [COMENTARIOS/REVIEWS]                 │
│  "Lo mejor del año 💯"                 │
│  "¡No me lo pierdo!"                   │
│  [Ver todos los comentarios]           │
│                                         │
│  [EVENTOS SIMILARES]                   │
│  "Te podría interesar también..."      │
│  [Cards de otros eventos]              │
│                                         │
└─────────────────────────────────────────┘
```

---

### 3. PERFIL DE USUARIO
**URL:** `/perfil`

#### Estructura
```
┌─────────────────────────────────────────┐
│  [NAVBAR]                               │
├─────────────────────────────────────────┤
│                                         │
│  [HEADER PERFIL]                        │
│  ├─ Avatar grande (circular)           │
│  ├─ Nombre: "Juan Pérez"               │
│  ├─ Email: juan@example.com            │
│  ├─ Ubicación: "Bogotá, Colombia"      │
│  └─ [Editar perfil] botón             │
│                                         │
│  [TABS]                                 │
│  ├─ 📌 Guardados
│  ├─ 🎫 Mis entradas
│  ├─ 🎵 Seguidos
│  └─ ⚙️ Configuración
│                                         │
│  [CONTENIDO - TAB GUARDADOS]            │
│  Grid de eventos guardados              │
│  (Cards como en home)                   │
│                                         │
│  [CONTENIDO - TAB MIS ENTRADAS]         │
│  ├─ Próximos eventos                   │
│  ├─ Eventos pasados                    │
│  └─ Opción: Compartir entrada         │
│                                         │
│  [CONTENIDO - TAB SEGUIDOS]             │
│  Artistas/venues que sigue              │
│  (Cards circulares con avatar)          │
│                                         │
│  [CONTENIDO - TAB CONFIGURACIÓN]        │
│  ├─ Notificaciones                     │
│  ├─ Privacidad                         │
│  ├─ Tema (light/dark)                  │
│  └─ Cerrar sesión                      │
│                                         │
└─────────────────────────────────────────┘
```

---

### 4. PANEL DE PROMOTOR (Crear Evento)
**URL:** `/promotor/crear-evento`

#### Estructura
```
┌─────────────────────────────────────────┐
│  [NAVBAR]                               │
├─────────────────────────────────────────┤
│                                         │
│  "Crear Nuevo Evento"                  │
│                                         │
│  [FORM - Columna]                       │
│                                         │
│  1. Información Básica                 │
│     ├─ Nombre del evento [input]       │
│     ├─ Descripción [textarea]          │
│     ├─ Categoría [dropdown]            │
│     └─ Imagen [upload drag&drop]       │
│                                         │
│  2. Fecha y Hora                       │
│     ├─ Fecha [date picker]             │
│     ├─ Hora inicio [time picker]       │
│     └─ Hora fin [time picker]          │
│                                         │
│  3. Ubicación                          │
│     ├─ Nombre del lugar [input]        │
│     ├─ Dirección [input]               │
│     ├─ Ciudad [select]                 │
│     └─ [Mapa con pin interactivo]      │
│                                         │
│  4. Entrada/Venta                      │
│     ├─ Precio mínimo [input]           │
│     ├─ Precio máximo [input]           │
│     ├─ Cantidad de entradas [input]    │
│     └─ Link de venta (TuBoleta) [input]│
│                                         │
│  5. Redes Sociales                     │
│     ├─ Instagram [input]               │
│     ├─ Facebook [input]                │
│     └─ Sitio web [input]               │
│                                         │
│  [Botones]                              │
│  [Guardar como borrador] [Publicar]    │
│                                         │
│  [Vista previa en tiempo real]         │
│  (lado derecho en desktop)              │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎨 SISTEMA DE DISEÑO

### Colores

```javascript
PRIMARY = {
  50: '#FFF5F9',     // Muy claro
  100: '#FFE0ED',
  200: '#FFC2DB',
  300: '#FF9FCA',
  400: '#FF6BB4',
  500: '#FF3D81',    // ← Main
  600: '#E63570',
  700: '#C91C4C',
  800: '#9E1840',
  900: '#6B0E2B'
}

ACCENT = {
  100: '#FFF4E6',
  400: '#FFB547',    // ← Secondary
  500: '#FF9E1B',
}

NEUTRAL = {
  50: '#F9F8FB',
  100: '#F3F1F8',
  200: '#E8E5F0',
  300: '#D4CEDD',
  400: '#A9A6B8',
  500: '#8B8797',
  600: '#5F5C6D',
  700: '#423F52',    // Text
  800: '#2A2735',
  900: '#1A1621',
  1000: '#0B0B12'    // ← BG
}

SEMANTIC = {
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6'
}
```

### Tipografía

```
Font Stack:
├─ Headings: 'Sora', -apple-system, sans-serif
└─ Body: 'Inter', -apple-system, sans-serif

Scales:
├─ H1: 48px (desktop) / 32px (mobile) • weight 700
├─ H2: 36px / 28px • weight 700
├─ H3: 24px / 20px • weight 600
├─ Body Large: 18px • weight 400
├─ Body: 16px • weight 400
├─ Body Small: 14px • weight 400
├─ Caption: 12px • weight 500
└─ Overline: 11px • weight 600 • uppercase

Line Heights:
├─ Headings: 1.15
├─ Body: 1.6
└─ Compact: 1.4
```

### Espaciado

```
Base unit: 4px (escala multiplicada)

Escala:
├─ xs: 4px
├─ sm: 8px
├─ md: 16px
├─ lg: 24px
├─ xl: 32px
├─ 2xl: 48px
└─ 3xl: 64px

Uso común:
├─ Padding componente: md (16px)
├─ Margin entre secciones: lg/xl (24-32px)
├─ Gap entre items: sm/md (8-16px)
└─ Border radius: 8px, 12px, 16px
```

### Componentes Básicos

**BUTTON**
```
Tipos:
├─ Primary: Background gradiente rosa→naranja
├─ Secondary: Outline + color primaria
├─ Ghost: Transparent, solo text
└─ Icon: Square icon button

Tamaños:
├─ Large: 56px height, 18px text
├─ Medium: 44px height, 16px text (default)
└─ Small: 36px height, 14px text

States:
├─ Default
├─ Hover: Lighten background, shadow
├─ Active: Darken background
├─ Disabled: Opacity 50%, no cursor
└─ Loading: Spinner animation
```

**INPUT**
```
Field: 44px height
├─ Border: 1px solid neutral-300
├─ Border radius: 8px
├─ Padding: sm (8px)
├─ Font: body
└─ Placeholder: color neutral-400

Focus:
├─ Border: 2px solid primary
├─ Outline: none
└─ Shadow: 0 0 0 3px primary-50

Error:
├─ Border color: error
└─ Helper text: error color
```

**CARD**
```
Border: 1px solid neutral-200
Border radius: 12px
Padding: md (16px)
Background: white/neutral-50
Shadow: 0 1px 3px rgba(0,0,0,0.1)

Hover:
├─ Border color: primary
├─ Shadow: 0 8px 16px rgba(0,0,0,0.12)
└─ Transform: translateY(-2px)
```

---

## 📊 FLUJO DE USUARIO (User Journey)

### Camino 1: Descubridor (Sin Registrarse)
```
1. Llega a fulleventos.com.co
   ↓
2. Ve home con eventos destacados
   ↓
3. Scrollea, ve más eventos
   ↓
4. Hace clic en evento → Ve detalles
   ↓
5. Presiona "IR A COMPRAR" → Abre TuBoleta en nueva pestaña
   ↓
6. Vuelve a Fulleventos para seguir descubriendo (repeat)
```

### Camino 2: Usuario Registrado
```
1. Llega a fulleventos.com.co
   ↓
2. Hace login con Google/Email
   ↓
3. Ve home (mismo para todos)
   ↓
4. Hace clic en evento
   ↓
5. Presiona ❤️ para guardar
   ↓
6. Ve en su perfil → "Mis guardados"
   ↓
7. Comparte con amigos
```

### Camino 3: Promotor
```
1. Registrarse como promotor
   ↓
2. Accede a "/promotor/crear-evento"
   ↓
3. Completa formulario
   ↓
4. Publica evento
   ↓
5. Ve evento en feed
   ↓
6. Dashboard muestra: vistas, clicks, guardados
```

---

## 🎯 RESPONSIVIDAD

### Breakpoints
```
Mobile: < 640px (default)
Tablet: 640px - 1024px
Desktop: > 1024px
```

### Ajustes por Breakpoint

**Mobile (< 640px)**
```
├─ Navbar: Hamburger menu
├─ Hero: 50vh
├─ Hero text: 32px
├─ Buscador: Full width
├─ Feed: 1 columna (cards full width)
├─ Botones rápidos: Stack vertical
└─ Padding general: 12px
```

**Tablet (640px - 1024px)**
```
├─ Feed: 2 columnas
├─ Hero: 55vh
├─ Padding general: 16px
└─ Sidebars: Emerge
```

**Desktop (> 1024px)**
```
├─ Feed: 3-4 columnas (grid)
├─ Hero: 60vh
├─ Sidebar (filtros): Left 250px
├─ Main content: flex-grow
└─ Padding general: 20-24px
```

---

## 🔄 INTERACCIONES Y ANIMACIONES

### Micro-interacciones
```
├─ Hover card: Scale 1.02, shadow aumenta
├─ Click botón: Ripple effect
├─ Scroll infinito: Fade in items
├─ Like/Guardar: Heart animation (bounce)
├─ Tabs: Fade transition 200ms
└─ Loading: Skeleton screens (placeholder)
```

### Transiciones
```
├─ Todas: ease-out 200-300ms
├─ Page transitions: Fade 300ms
├─ Modal enters: Scale 300ms
└─ Dropdowns: Slide down 200ms
```

---

## 📋 CHECKLIST DE DISEÑO ANTES DE CODEAR

- [ ] Confirmar colores (RGB/Hex)
- [ ] Confirmar tipografías (Google Fonts setup)
- [ ] Crear sprites/icons (SVG)
- [ ] Definir tamaños de imágenes (hero, card)
- [ ] Crear logo Fulleventos (si no existe)
- [ ] Favicon (32x32, 16x16)
- [ ] Ilustraciones/gráficos (si necesita)
- [ ] Fotografías placeholder (unsplash, pexels)

---

## 🚀 PRÓXIMO PASO: CÓDIGO

Una vez confirmes este diseño, empezaremos con:

1. **Frontend Setup** (React + Tailwind)
   - Componentes reutilizables
   - Páginas: Home, Evento, Perfil, Crear

2. **Backend Setup** (Node.js + Express)
   - API de eventos
   - Auth (Firebase)
   - Base de datos (PostgreSQL)

3. **Integración**
   - API calls desde React
   - Estado global (Redux/Context)
   - Realtime updates

¿Algo que cambiar del diseño? 🎨

---

## ⚙️ ARQUITECTURA CON CLOUDFLARE

### Stack Actualizado (Con Cloudflare)

**Frontend**
```
React + Tailwind
│
├─ Build: npm run build (output: dist/)
└─ Deploy: Cloudflare Pages
```

**Backend**
```
Cloudflare Workers (Edge Functions)
├─ Lenguaje: TypeScript/JavaScript
├─ Runtime: Node.js compatible (Workerd)
└─ Depreciado: Render/Railway (usamos Workers)
```

**Base de Datos**
```
Cloudflare D1 (SQLite)
├─ Schema: eventos, usuarios, likes, comentarios
├─ Migrations: wrangler d1 migrations create
└─ Backups: Automáticos

Alternativa (si D1 es insuficiente):
├─ Supabase (PostgreSQL) + Cloudflare Pages
└─ Railway (PostgreSQL) + Cloudflare Workers
```

**Cache & KV**
```
Cloudflare KV
├─ Cache de eventos por ciudad
├─ Sesiones de usuario
└─ Rate limiting
```

**Storage de Imágenes**
```
Cloudflare R2 (Object Storage)
├─ Imágenes de eventos
├─ Avatares de usuarios
└─ Documentos (si necesita)

Alternativa:
└─ Cloudinary (si prefiere servicio especializado)
```

**Email**
```
Cloudflare Email Routing (gratuito)
├─ Forwards de eventos
└─ Notificaciones (vía SendGrid gratis o Mailgun)
```

### Ventajas de esta Arquitectura
```
✅ Todo en Cloudflare (simplificado)
✅ Latencia baja (edge computing)
✅ Gratuito para MVP (Pages + Workers + D1 free tier)
✅ Escalado automático
✅ Sin servidor (serverless)
✅ DDoS protection gratis
✅ Certificado SSL automático
```

### Desventajas & Limitaciones
```
⚠️ D1 es SQLite (limitado a 10GB)
⚠️ Workers: 100k requests/día gratis
⚠️ Cold starts en Workers (pequeño delay)
⚠️ Ecosistema menos maduro que Vercel+Node.js
```

### Recomendación
Para MVP (6-8 semanas):
```
├─ Frontend: Cloudflare Pages ✅
├─ Backend: Cloudflare Workers ✅
├─ Database: D1 (SQLite) ✅ (suficiente para 10k+ eventos)
├─ Cache: Cloudflare KV ✅
├─ Storage: Cloudinary (externa) ⚠️ (o R2 si crece)
└─ Email: SendGrid free tier (3k/mes)
```

### Configuración Wrangler (wrangler.toml)
```toml
name = "fulleventos-api"
type = "javascript"
account_id = "TU_ACCOUNT_ID"
workers_dev = true

[[env.production]]
name = "production"
route = "api.*"

[[d1_databases]]
binding = "DB"
database_name = "fulleventos"
database_id = "TU_DB_ID"

[[kv_namespaces]]
binding = "KV"
id = "TU_KV_ID"
```

---

## ✅ RESUMEN FINAL: LISTO PARA CODEAR

**Tecnología Confirmada:**
- Frontend: React + Tailwind → Cloudflare Pages
- Backend: Node.js (Workers) → Cloudflare Workers
- Database: SQLite → Cloudflare D1
- Dominio: fulleventos.com.co
- Diseño: ✅ Definido (wireframes arriba)

**Próximos Pasos (en orden):**
1. Setup local (git, package.json, wrangler)
2. Frontend structure (componentes React)
3. Backend API (Workers + D1)
4. Integración auth (Firebase/Auth0)
5. Scraping de eventos (TuBoleta)
6. QA y deploy a production

¿Algo que cambiar o aclarar antes de empezar código? 🚀
