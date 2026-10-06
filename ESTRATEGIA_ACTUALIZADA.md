# 🎯 FULLEVENTOS: Descubridor de Eventos + Comunidad (Colombia)

## Cambio de Dirección (Validado)

### Lo que Definiste:
1. **Diferenciador:** Página que **enamore y atrape** al entrar. Mostrar eventos en Bogotá (escalable a otras ciudades)
2. **Modelo:** Generar **comunidad primero** (usuarios apasionados por eventos)
3. **Geografía:** **Colombia**
4. **Venta de boletas:** **Redirigir a vendedores oficiales** (TuBoleta, Ticketmaster, etc.)
5. **Resto:** Servicios de producción, comisiones, datos — perfecto

---

## 🎨 CONCEPTO: "El TikTok/Instagram de Eventos en Colombia"

### Visión
Fulleventos NO es una tiquetera. Es el **lugar donde descubres qué hacer hoy, mañana o el fin de semana en Bogotá** (y luego Medellín, Cali, etc.).

```
Usuario entra → Ve eventos hermosos (conciertos, fiestas, teatro, conferencias)
              → Se enamora de la experiencia visual
              → Hace clic → Se va a TuBoleta/Ticketmaster a comprar
              → Vuelve a Fulleventos porque es el mejor para descubrir
```

### Diferenciadores vs. TuBoleta
| Aspecto | TuBoleta | Fulleventos |
|---------|----------|------------|
| **Propósito** | Vender boletas | Descubrir eventos + comunidad |
| **UX** | Funcional, transaccional | Hermosa, adictiva, social |
| **Monetización** | Comisión por venta | Comunidad → membresía → publicidad → servicios |
| **Comprador** | Va a buscar boleta específica | Navega, se inspira, descubre |

---

## 💰 MODELO DE NEGOCIO (Actualizado)

### Fase 1: Construcción de Comunidad (Gratis)
```
Fulleventos
├─ Catálogo de eventos (gratis, libre acceso)
├─ Descubrimiento por género/ubicación/fecha
├─ Perfil de usuario (favoritos, seguir artistas/venues)
├─ Feed social (amigos, trends)
└─ Sin cobro (captar usuarios)
```

### Fase 2: Monetización (6+ meses)
```
Ingresos:
├─ Publicidad: Promotores pagan para destacar eventos ($200-1000/mes)
├─ Membresía premium: Acceso a preventa, presale alerts ($5-10/mes)
├─ Comisión por servicios: DJ, sonido, iluminación (15-20% de TU negocio)
├─ Datos/Analytics: Insights para artistas y promotores ($99-500/mes)
└─ Afiliación: Referral de boletas vendidas en TuBoleta (2-5%)
```

### Fase 3: Expansión de Servicios (1+ año)
```
Fulleventos Eco-sistema:
├─ Marketplace de servicios (DJ, catering, decoración)
├─ Gestión de eventos (panel para promotores)
└─ Sistema de check-in/validación de entradas (sin vender boletas)
```

---

## 🎯 MVP: "Fulleventos Bogotá v1"

### Para Usuarios (Descubridores)
```
Home
├─ Hero: "Descubre qué hacer en Bogotá esta semana" (hermoso, vibrante)
├─ Feed de eventos (scroll infinito tipo Instagram)
│  ├─ Imagen grande del evento
│  ├─ Título, artista, fecha/hora
│  ├─ Ubicación en mapa
│  ├─ Botón "Ver en TuBoleta" (redirige)
│  └─ Like, compartir, guardar
├─ Filtros: Género, fecha, precio, zona de Bogotá
├─ Perfil: Mi cuenta, eventos guardados, artistas seguidos
├─ Notificaciones: Cuando hay evento de tu artista favorito
└─ Feed social: Qué guardaron/van mis amigos
```

### Para Promotores/Artistas
```
Panel Promotor (simple)
├─ Crear evento (foto, descripción, fecha, ubicación, link de venta)
├─ Destacar evento ($50-200/semana)
├─ Ver cuántas vistas/clicks generó
├─ Link único de referral (para ganar % de comisión)
└─ Analytics básico
```

### Para Fulleventos (Admin)
```
Dashboard
├─ Moderar eventos (prohibidos, duplicados, spam)
├─ Análitica global (eventos más vistos, ciudades)
├─ Gestionar publicidad (promotores pagados)
└─ Datos de usuarios (anónimos, para insights)
```

---

## 🛠️ Stack Tecnológico (Simplificado)

### Backend
```
Node.js + Express
├─ API REST para eventos, usuarios, likes, comentarios
├─ PostgreSQL (eventos, usuarios, datos)
├─ Redis (caché, feed en tiempo real)
├─ Firebase Auth (login con Google, email)
└─ Sin procesamiento de pagos (redirigen a TuBoleta)
```

### Frontend
```
React + Tailwind
├─ Home hermosa (diseño cautivador)
├─ Scroll infinito de eventos (mobile-first)
├─ Mapa interactivo (Google Maps)
├─ Filtros dinámicos
├─ Perfil de usuario + historial
└─ Compartir en redes sociales (WhatsApp, Instagram)
```

### Infraestructura
```
├─ Vercel (frontend)
├─ Render/Railway (backend)
├─ PostgreSQL en cloud (Supabase o Railway)
├─ Cloudinary (imágenes de eventos)
├─ Google Maps API (ubicaciones)
└─ SendGrid/Mailgun (notificaciones por email)
```

### Sin necesidad de:
- ❌ Stripe/pasarelas de pago (redirigen a TuBoleta)
- ❌ Sistema de inventario de boletas
- ❌ QR/validación de entradas
- ❌ Integración de múltiples métodos de pago

---

## 📱 Experiencia Clave: "El Alma de Fulleventos"

### Al Entrar (Hero)
```
🎯 Imagen de fondo: evento vibrante, música, gente feliz
   Texto superpuesto:
   "Descubre qué hacer en Bogotá"
   
   [Buscador: "Busca por artista, lugar, género..."]
   
   Botones rápidos:
   📍 Esta noche  🎵 Conciertos  🎉 Fiestas  🎭 Teatro
```

### Feed de Eventos (Adictivo)
```
[Imagen grande del evento]
┌─────────────────────────────┐
│ 🎵 Morat en Vivo           │ ← Título + artista
│ Sábado 22 ago • 20:00      │ ← Fecha/hora
│ Teatro Metropólitano       │ ← Ubicación
│ $150.000 - $250.000        │ ← Precio
│                             │
│ [Ver en TuBoleta] [Guardar] │ ← CTA + acciones
└─────────────────────────────┘

[Swipe/scroll para siguiente evento]
```

### Detalles del Evento
```
Imagen grande (hero)
├─ Artista/evento
├─ Descripción atractiva
├─ Ubicación (mapa interactivo)
├─ Fecha/hora
├─ Precio
├─ "Ir al evento" → redirige a TuBoleta/link oficial
├─ Guardar en favoritos
├─ Compartir: WhatsApp, Instagram Story, Twitter
└─ Comentarios (usuarios hablan del evento)
```

---

## 🚀 Roadmap Realista

### Fase 0: MVP (6-8 semanas)
```
Semana 1-2: Setup + diseño
├─ Infraestructura (Vercel + Render + DB)
├─ Diseño de UI/UX (Figma)
└─ Base de datos (schema)

Semana 3-5: Frontend
├─ Home hermosa
├─ Feed de eventos
├─ Filtros
└─ Perfil de usuario

Semana 6-8: Backend + Integración
├─ API de eventos
├─ Sistema de usuarios
├─ Likes/guardados
├─ Notificaciones por email
└─ Scrapear/integrar primeros eventos (TuBoleta API o manual)

QA y lanzamiento
```

### Fase 1: Bogotá (8 semanas desde lanzamiento MVP)
```
├─ 500+ eventos indexados
├─ 1000+ usuarios activos
├─ Feedback de usuarios
└─ Pulir UX basado en datos
```

### Fase 2: Monetización (Mes 4+)
```
├─ Publicidad (promotores pagan para destacar)
├─ Membresía premium (presale alerts)
├─ Afiliación (comisión por clicks a TuBoleta)
└─ Analytics para promotores
```

### Fase 3: Expansión (Mes 6+)
```
├─ Medellín, Cali, Cartagena
├─ Servicios de producción (DJ, sonido, iluminación)
├─ Panel mejorado para promotores
└─ App móvil nativa
```

---

## 🎨 Identidad Visual

### Colores
```
Primario: Gradiente rosa → naranja (vibrante, energético)
Secundario: Púrpura/azul oscuro (para contraste)
Neutral: Gris oscuro/blanco
```

### Tipografía
```
Headings: Sora (bold, moderna)
Body: Inter (legible, limpia)
```

### Tono
```
"Enamorarse de eventos"
Colores vivos, imágenes grandes, sin fricción.
Instagram meets Airbnb meets Spotify.
```

---

## 💡 Preguntas Pendientes

1. **¿Dónde sacamos los eventos inicialmente?**
   - Scrapear TuBoleta (leer HTML)
   - API de TuBoleta (si existe)
   - Contactar promotores manualmente
   - Importar de Google Events

2. **¿Cómo convencemos a promotores que suban eventos?**
   - Beneficio: Más visibilidad (sin costo)
   - Luego: Publicidad pagada para destacar
   - Panel fácil (5 campos = crear evento)

3. **¿Primera ciudad es Bogotá definitivamente?**
   - Sí (mayor población, más eventos)
   - Empezar en Medellín (más nicho)
   - Otra ciudad

4. **¿Quién programa esto?**
   - Tú solo
   - Contratamos desarrolladores
   - Búsqueda de co-founder técnico

5. **¿Presupuesto inicial?**
   - Servidor + DB: $50-100/mes
   - Dominio: $12/año
   - API keys (Google Maps, etc.): gratis o $50-200/mes
   - Diseño (si contratas): $500-2000
   - Desarrollo (si contratas): $5000-20000

---

## ✅ Próximos Pasos Inmediatos

1. **Diseñar Figma** de la home (enamorador)
2. **Scrapear TuBoleta** para obtener primeros eventos de Bogotá
3. **Setup infraestructura** (Vercel + Render + DB)
4. **Coding MVP** (backend + frontend)
5. **QA y lanzamiento beta** privado con amigos
6. **Iterar** basado en feedback

---

## 🎯 Conclusión

**Fulleventos NO es una tiquetera.** Es el lugar más hermoso para descubrir eventos en Colombia. Los usuarios volverán porque se aman, y monetizaremos después con publicidad, membresía y servicios.

**Comienza el trabajo real:** Diseño + código.

¿Vamos? 🚀
