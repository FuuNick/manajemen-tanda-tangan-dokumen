// src/pages/ChooseSignerPage.jsx
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../service/supabase'
import { v4 as uuidv4 } from 'uuid'

export default function ChooseSignerPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { documentId, filePath } = location.state || {}

  const [user, setUser] = useState(null)
  const [signers, setSigners] = useState([])
  const [newSigner, setNewSigner] = useState({
    name: '',
    email: '',
    type: 'internal'
  })

  useEffect(() => {
    const fetchUser = async () => {
      const { data: auth } = await supabase.auth.getUser()
      if (!auth?.user) {
        navigate('/login')
        return
      }
      setUser(auth.user)
    }

    fetchUser()
  }, [navigate])

  const handleAddSigner = async () => {
    if (!newSigner.name || !newSigner.email) {
      alert('Nama dan email wajib diisi.')
      return
    }

    const nextOrder = signers.length + 1
    const signerId = uuidv4()

    let signerData = {
      id: signerId,
      document_id: documentId,
      signing_order: nextOrder,
      status: 'pending',
      created_by: user.id
    }

    if (newSigner.type === 'internal') {
      // Cari user internal berdasarkan email
      const { data: internalUser, error } = await supabase
        .from('user_profiles')
        .select('user_id')
        .eq('email', newSigner.email)
        .single()

      if (error || !internalUser) {
        alert('User internal tidak ditemukan.')
        return
      }

      signerData.signer_user_id = internalUser.user_id
    } else {
      // Tambah external signer
      const { data: external, error: extErr } = await supabase
        .from('external_signers')
        .insert([{
          id: uuidv4(),
          name: newSigner.name,
          email: newSigner.email
        }])
        .select()
        .single()

      if (extErr) {
        console.error(extErr)
        alert('Gagal menyimpan penandatangan eksternal.')
        return
      }

      signerData.external_signer_id = external.id
    }

    const { error: insertErr } = await supabase
      .from('document_signers')
      .insert([signerData])

    if (insertErr) {
      console.error(insertErr)
      alert('Gagal menambahkan penandatangan.')
      return
    }

    setSigners([...signers, {
      id: signerId,
      ...newSigner,
      signing_order: nextOrder,
      signer_user_id: signerData.signer_user_id,
      external_signer_id: signerData.external_signer_id
    }])

    setNewSigner({ name: '', email: '', type: 'internal' })
  }

  const handleNext = () => {
    if (!documentId || !filePath) {
      alert('Dokumen tidak valid.')
      return
    }

    navigate('/set-signature-position', {
      state: { documentId, filePath }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">Pilih Penandatangan</h1>

      <div className="bg-white rounded p-4 shadow mb-6 max-w-xl">
        <h2 className="text-lg font-semibold mb-3">Tambah Penandatangan</h2>

        <div className="mb-3">
          <label className="block text-sm text-gray-700 mb-1">Tipe Penandatangan</label>
          <select
            value={newSigner.type}
            onChange={(e) => setNewSigner({ ...newSigner, type: e.target.value })}
            className="w-full border rounded p-2"
          >
            <option value="internal">User Internal</option>
            <option value="external">Pihak Eksternal</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-sm text-gray-700 mb-1">Nama</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            placeholder="Nama Lengkap"
            value={newSigner.name}
            onChange={(e) => setNewSigner({ ...newSigner, name: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded p-2"
            placeholder="Alamat Email"
            value={newSigner.email}
            onChange={(e) => setNewSigner({ ...newSigner, email: e.target.value })}
          />
        </div>

        <button
          onClick={handleAddSigner}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Tambah Penandatangan
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow max-w-xl mb-6">
        <h2 className="text-lg font-semibold mb-3">Daftar Penandatangan</h2>
        {signers.length === 0 ? (
          <p className="text-gray-500 text-sm">Belum ada penandatangan.</p>
        ) : (
          <ul className="space-y-2">
            {signers.map((s, i) => (
              <li key={s.id} className="border-b py-2 flex justify-between items-center">
                <span>{i + 1}. {s.name} ({s.email}) [{s.type}]</span>
                <span className="text-sm text-gray-500">Urutan #{s.signing_order}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {signers.length > 0 && (
        <button
          onClick={handleNext}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          Lanjut ke Penempatan Tanda Tangan →
        </button>
      )}
    </div>
  )
}
