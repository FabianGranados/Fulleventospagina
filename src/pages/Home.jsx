import React, { useState, useEffect } from 'react'
import Hero from '../components/Hero'
import EventCard from '../components/EventCard'

// Mock events data
const mockEvents = [
  {
    id: 1,
    emoji: '🎵',
    title: 'Morat en Vivo',
    category: 'CONCIERTO',
    date: 'Sábado 22 ago',
    time: '20:00',
    location: 'Teatro Metropólitano • Chapinero',
    price: '$150K - $250K',
    badge: 'MAÑANA',
  },
  {
    id: 2,
    emoji: '🎉',
    title: 'Fiesta Bogotá Electrónica',
    category: 'FIESTA',
    date: 'Viernes 21 ago',
    time: '22:00',
    location: 'Andrés Carne de Res',
    price: '$60K - $100K',
    badge: 'HOY',
  },
  {
    id: 3,
    emoji: '🎭',
    title: 'La Madriguera',
    category: 'TEATRO',
    date: 'Domingo 23 ago',
    time: '19:00',
    location: 'Teatro Galerón • La Candelaria',
    price: 'Entrada libre',
    badge: 'ESTE FIN DE SEMANA',
  },
  {
    id: 4,
    emoji: '🎤',
    title: 'Concierto Acústico - Shakira',
    category: 'CONCIERTO',
    date: 'Martes 25 ago',
    time: '18:30',
    location: 'Coliseo El Campín',
    price: '$200K - $350K',
    badge: 'PRONTO',
  },
  {
    id: 5,
    emoji: '🎨',
    title: 'Festival de Arte Urbano',
    category: 'FESTIVAL',
    date: 'Sábado 22 ago',
    time: '14:00',
    location: 'Centro Comercial Santa Fe',
    price: 'Gratis',
    badge: 'MAÑANA',
  },
  {
    id: 6,
    emoji: '🏀',
    title: 'Liga Profesional - Bogotá vs Cali',
    category: 'DEPORTES',
    date: 'Viernes 21 ago',
    time: '19:00',
    location: 'Coliseo El Campín • Centro',
    price: '$80K - $180K',
    badge: 'HOY',
  },
  {
    id: 7,
    emoji: '🎬',
    title: 'Ciclo de Cine - Películas Clásicas',
    category: 'CINE',
    date: 'Miércoles 24 ago',
    time: '19:30',
    location: 'Cinemateca Distrital',
    price: '$15K',
    badge: 'PRÓXIMAMENTE',
  },
  {
    id: 8,
    emoji: '💃',
    title: 'Noche de Salsa y Cumbia',
    category: 'MÚSICA',
    date: 'Jueves 26 ago',
    time: '21:00',
    location: 'Salsa Bar • Zona Rosa',
    price: '$40K - $80K',
    badge: 'ESTA SEMANA',
  },
]

export default function Home() {
  const [events, setEvents] = useState(mockEvents)
  const [filteredEvents, setFilteredEvents] = useState(mockEvents)
  const [loading, setLoading] = useState(false)

  // Simulate infinite scroll
  const loadMoreEvents = () => {
    setLoading(true)
    setTimeout(() => {
      // Add duplicate events to simulate more data
      setEvents([...events, ...mockEvents.map((e, i) => ({
        ...e,
        id: e.id + 1000 + i,
      }))])
      setLoading(false)
    }, 600)
  }

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Events Feed Section */}
      <section className="bg-neutral-50 py-16 md:py-24">
        <div className="container">
          {/* Section Header */}
          <div className="mb-12">
            <h2 className="font-sora text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
              Eventos disponibles
            </h2>
            <p className="text-neutral-600">
              {events.length} eventos encontrados
            </p>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {/* Load More Button */}
          <div className="flex justify-center">
            <button
              onClick={loadMoreEvents}
              disabled={loading}
              className="px-8 py-3 bg-gradient-primary text-white font-semibold rounded-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Cargando...' : 'Ver más eventos'}
            </button>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-neutral-900 text-white py-16">
        <div className="container text-center">
          <h2 className="font-sora text-3xl md:text-4xl font-bold mb-4">
            ¿Organizas eventos?
          </h2>
          <p className="text-xl text-neutral-200 mb-8 max-w-2xl mx-auto">
            Publica tus eventos en Fulleventos y llega a miles de personas que buscan qué hacer en Bogotá
          </p>
          <button className="px-8 py-3 bg-gradient-primary text-white font-semibold rounded-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
            Crear evento ahora
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-1000 text-neutral-200 py-12 border-t border-neutral-900">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-sora text-white font-bold text-lg mb-4">
                FULL<span className="text-primary-500">EVENTOS</span>
              </h3>
              <p className="text-sm">
                Descubre qué hacer en Bogotá. Tu guía de entretenimiento.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Plataforma</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary-400">Explorar eventos</a></li>
                <li><a href="#" className="hover:text-primary-400">Crear evento</a></li>
                <li><a href="#" className="hover:text-primary-400">Mi perfil</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary-400">Términos de uso</a></li>
                <li><a href="#" className="hover:text-primary-400">Privacidad</a></li>
                <li><a href="#" className="hover:text-primary-400">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Síguenos</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary-400">Instagram</a></li>
                <li><a href="#" className="hover:text-primary-400">TikTok</a></li>
                <li><a href="#" className="hover:text-primary-400">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-900 pt-8 text-center text-sm text-neutral-500">
            <p>© {new Date().getFullYear()} Fulleventos. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
