import React, { useState } from 'react'
import { supabase } from '../../service/supabase'
import { Eye, EyeOff } from 'lucide-react'

export default function Keamanan() {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setPasswords((prev) => ({ ...prev, [name]: value }))
  }

  const toggleVisibility = (key) => {
    setShow((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    const { current, new: newPass, confirm } = passwords

    if (newPass !== confirm) {
      setMessage('⚠️ Password baru dan konfirmasi tidak cocok.')
      setLoading(false)
      return
    }

    const { data: userData, error: userError } = await supabase.auth.getUser()
    const user = userData?.user

    if (userError || !user) {
      setMessage('Gagal mendapatkan data pengguna.')
      setLoading(false)
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: current
    })

    if (signInError) {
      setMessage('❌ Password lama salah.')
      setLoading(false)
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPass
    })

    if (updateError) {
      setMessage('Gagal mengganti password: ' + updateError.message)
    } else {
      setMessage('✅ Password berhasil diperbarui.')
      setPasswords({ current: '', new: '', confirm: '' })
    }

    setLoading(false)
  }

  const renderInput = (label, name, typeKey) => (
    <div>
      <label className="block mb-1 text-sm text-gray-600">{label}</label>
      <div className="relative">
        <input
          type={show[typeKey] ? 'text' : 'password'}
          name={name}
          value={passwords[name]}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded pr-10"
        />
        <span
          onClick={() => toggleVisibility(typeKey)}
          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500"
        >
          {show[typeKey] ? <EyeOff size={18} /> : <Eye size={18} />}
        </span>
      </div>
    </div>
  )

  return (
    <div className="p-4">
      <div className="bg-white p-6 rounded-2xl shadow max-w-xl">
        <h1 className="text-2xl font-bold mb-4">Keamanan Akun</h1>

        <form onSubmit={handleChangePassword} className="space-y-4">
          {renderInput('Password Lama', 'current', 'current')}
          {renderInput('Password Baru', 'new', 'new')}
          {renderInput('Konfirmasi Password Baru', 'confirm', 'confirm')}

          {message && (
            <div className="text-sm text-red-600 font-medium">{message}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? 'Menyimpan...' : 'Simpan Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
