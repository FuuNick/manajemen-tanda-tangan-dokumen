// src/components/KontakModal.jsx
import React, { useState, useEffect } from 'react'

export default function KontakModal({ visible, onClose, onSave, initialData }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    wa_number: ''
  })

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        email: initialData.email || '',
        wa_number: initialData.wa_number || ''
      })
    } else {
      setForm({ name: '', email: '', wa_number: '' })
    }
  }, [initialData, visible])

  if (!visible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-bold mb-4">
          {initialData ? 'Edit Kontak' : 'Tambah Kontak'}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSave(form)
          }}
          className="space-y-4"
        >
          <div>
            <label className="text-sm text-gray-600">Nama</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              className="w-full border rounded p-2"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Telepon</label>
            <input
              type="tel"
              className="w-full border rounded p-2"
              value={form.wa_number}
              onChange={(e) => setForm({ ...form, wa_number: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
