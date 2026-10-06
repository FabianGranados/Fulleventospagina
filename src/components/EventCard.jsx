import React, { useState } from 'react'
import { Heart, ArrowRight, MapPin, Clock, DollarSign } from 'lucide-react'

export default function EventCard({ event }) {
  const [liked, setLiked] = useState(false)

  return (
    <div className="bg-white rounded-md shadow-sm border border-neutral-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-video bg-gradient-to-br from-primary-200 to-accent-100">
        <div className="w-full h-full flex items-center justify-center text-6xl">
          {event.emoji}
        </div>

        {/* Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-sm">
            {event.badge}
          </span>
        </div>

        {/* Image Overlay on Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"></div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <div className="mb-2">
          <span className="text-xs font-bold text-primary-500 uppercase">
            {event.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-sora text-lg font-bold text-neutral-900 mb-3 line-clamp-2">
          {event.title}
        </h3>

        {/* Date and Time */}
        <div className="flex items-center gap-2 text-sm text-neutral-600 mb-2">
          <Clock className="w-4 h-4" />
          <span>{event.date} • {event.time}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-neutral-600 mb-3">
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 text-sm font-semibold text-primary-500 mb-4">
          <DollarSign className="w-4 h-4" />
          <span>{event.price}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setLiked(!liked)}
            className="flex-1 py-2 px-3 bg-neutral-100 text-neutral-700 rounded-md font-semibold text-sm hover:bg-neutral-200 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Heart
              className={`w-4 h-4 ${liked ? 'fill-primary-500 text-primary-500' : ''}`}
            />
            {liked ? 'Guardado' : 'Guardar'}
          </button>
          <button className="flex-1 py-2 px-3 bg-gradient-primary text-white rounded-md font-semibold text-sm hover:shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center gap-2">
            Ver entrada
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
