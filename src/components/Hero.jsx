import React, { useState } from 'react'
import { Search, MapPin, Music, Calendar, Zap } from 'lucide-react'

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState(null)

  const filters = [
    { id: 'tonight', label: '📍 Esta noche', icon: '🌙' },
    { id: 'weekend', label: '🎵 Este finde', icon: '🎉' },
    { id: 'free', label: '🎉 Gratis', icon: '💰' },
    { id: 'near', label: '🎭 Cerca de mí', icon: '📍' },
  ]

  return (
    <div className="relative bg-neutral-900 text-white overflow-hidden">
      {/* Background gradient and blur effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-neutral-900 to-neutral-1000 opacity-80"></div>

      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 opacity-10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-400 opacity-5 blur-3xl rounded-full"></div>

      <div className="relative container py-20 md:py-32 text-center">
        {/* Main tagline */}
        <h1 className="font-sora text-4xl md:text-6xl font-bold mb-4 leading-tight">
          Descubre qué hacer <br className="hidden md:block" />
          <span className="bg-gradient-primary bg-clip-text text-transparent">en Bogotá</span>
        </h1>

        <p className="text-xl md:text-2xl text-neutral-200 mb-8 opacity-90">
          Esta semana
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-4 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Busca artista, lugar, género..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white text-neutral-900 rounded-lg font-inter placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(selectedFilter === filter.id ? null : filter.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                selectedFilter === filter.id
                  ? 'bg-gradient-primary text-white shadow-lg'
                  : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Social proof / Stats */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-sm md:text-base">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎫</span>
            <span>+2,350 eventos this week</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">👥</span>
            <span>10K+ people discovering</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span>100% verified events</span>
          </div>
        </div>
      </div>

      {/* Bottom wave effect */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-neutral-50 to-transparent"></div>
    </div>
  )
}
