import React from 'react'
import Home from './pages/Home'
import Navbar from './components/Navbar'

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <main>
        <Home />
      </main>
    </div>
  )
}
