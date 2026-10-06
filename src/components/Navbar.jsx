import React, { useState } from 'react'
import { Search, Bell, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
      <div className="container h-[70px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <a href="/" className="font-sora text-2xl font-bold">
            FULL<span className="bg-gradient-primary bg-clip-text text-transparent">EVENTOS</span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <button className="p-2 hover:bg-neutral-100 rounded-md transition-colors">
            <Search className="w-5 h-5 text-neutral-700" />
          </button>
          <button className="p-2 hover:bg-neutral-100 rounded-md transition-colors relative">
            <Bell className="w-5 h-5 text-neutral-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
          </button>
          <button className="px-4 py-2 bg-gradient-primary text-white text-sm font-semibold rounded-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
            Crear evento
          </button>
          <button className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
            JD
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-neutral-100 rounded-md"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Abrir menú"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200 p-4 space-y-3">
          <button className="w-full px-4 py-2 bg-gradient-primary text-white font-semibold rounded-md">
            Crear evento
          </button>
          <button className="w-full px-4 py-2 text-neutral-700 text-sm hover:bg-neutral-100 rounded-md">
            Mi Perfil
          </button>
          <button className="w-full px-4 py-2 text-neutral-700 text-sm hover:bg-neutral-100 rounded-md">
            Configuración
          </button>
          <button className="w-full px-4 py-2 text-neutral-700 text-sm hover:bg-neutral-100 rounded-md">
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  )
}
