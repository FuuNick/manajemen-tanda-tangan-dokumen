// src/pages/auth/Guest.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Guest() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white text-gray-800">
      {/* Navbar */}
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md shadow-sm py-4 z-50">
        <div className="flex justify-between items-center max-w-screen-xl mx-auto px-6 md:px-8">
          <h1 className="text-3xl font-bold text-green-600">Signature</h1>
          <button
            onClick={() => navigate('/login')}
            className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="text-center py-24 md:py-32 px-4 bg-gradient-to-b from-green-50 to-white">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-4 leading-tight">
            Tinggalkan Kertas, Beralih ke Digital.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Platform tanda tangan digital yang cepat, aman, dan sah secara hukum untuk mempercepat proses dokumen Anda.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Coba Gratis Sekarang
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Tanpa perlu kartu kredit. Batalkan kapan saja.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-green-100 py-3 mt-auto">
        <div className="max-w-screen-xl mx-auto px-6 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Signature. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}