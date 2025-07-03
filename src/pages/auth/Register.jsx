import React, { useState } from 'react'
import { supabase } from '../../service/supabase'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          name: formData.name,
        },
      },
    })
    if (error) {
      setError(error.message)
    } else {
      alert('Cek email untuk verifikasi!')
      navigate('/login')
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen font-sans">
      {/* KIRI */}
      <div className="w-full lg:w-[calc(100%-616px)] bg-[#F8F9FA] flex items-center justify-center py-12 px-6">
        <form onSubmit={handleRegister} className="w-full max-w-md text-center">
          <h1 className="text-3xl font-bold mb-2">Selamat Datang di Signature</h1>
          <p className="mb-6 text-gray-700">Daftar akun dan mulai tanda tangan</p>

          {error && <p className="text-red-500 mb-2">{error}</p>}

          {/* Input Nama */}
          <div className="flex items-center border rounded px-3 py-2 mb-4">
            <User className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              name="name"
              placeholder="Nama"
              className="w-full bg-transparent focus:outline-none"
              onChange={handleChange}
              required
            />
          </div>

          {/* Input Email */}
          <div className="flex items-center border rounded px-3 py-2 mb-4">
            <Mail className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full bg-transparent focus:outline-none"
              onChange={handleChange}
              required
            />
          </div>

          {/* Input Password */}
          <div className="flex items-center border rounded px-3 py-2 mb-4">
            <Lock className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Kata Sandi"
              className="w-full bg-transparent focus:outline-none"
              onChange={handleChange}
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          {/* Tombol Daftar */}
          <button
            type="submit"
            className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 transition mb-4"
          >
            Daftar
          </button>

          {/* Link Login */}
          <p className="text-sm mb-2">
            Sudah menjadi anggota?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Masuk
            </a>
          </p>

          {/* Terms */}
          <p className="text-xs text-gray-500">
            Dengan membuat akun, Anda menyetujui{' '}
            <span className="underline cursor-pointer">Ketentuan Layanan</span> dan{' '}
            <span className="underline cursor-pointer">Ketentuan Privasi</span> iLovePDF.
          </p>
        </form>
      </div>

      {/* KANAN */}
      <div className="w-full lg:w-[616px] bg-[#84C5F7] flex items-center justify-center text-left text-white px-8 py-12">
        <div className="max-w-md">
          <h3 className="text-2xl font-semibold mb-4">
            Solusi Tanda Tangan Digital untuk Individu dan Tim Profesional
          </h3>
          <p className="leading-relaxed text-base">
            Signature adalah platform tanda tangan digital yang memudahkan Anda menandatangani,
            meminta tanda tangan dari pihak lain, dan mengelola dokumen resmi secara aman dan efisien.
            Baik untuk kebutuhan pribadi maupun kolaborasi tim atau organisasi, Signature hadir untuk
            mempercepat proses persetujuan dokumen — kapan saja, di mana saja.
          </p>
        </div>
      </div>
    </div>
  )
}
