// src/signatures/ChooseSignerPage.jsx
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../service/supabase'

export default function ChooseSignerPage() {
  const { id } = useParams() // id dokumen
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [externalSigners, setExternalSigners] = useState([{ name: '', email: '', whatsapp: '' }])
  const [selectedUserIds, setSelectedUserIds] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from('user_profiles').select('user_id, name')
      setUsers(data || [])
    }
    fetchUsers()
  }, [])

  const handleCheckbox = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  const handleExternalChange = (index, field, value) => {
    const newList = [...externalSigners]
    newList[index][field] = value
    setExternalSigners(newList)
  }

  const addExternalField = () => {
    setExternalSigners([...externalSigners, { name: '', email: '', whatsapp: '' }])
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Simpan internal signer
      const internalInserts = selectedUserIds.map((userId) => ({
        document_id: id,
        signer_user_id: userId,
      }))

      // Simpan eksternal signer terlebih dahulu ke table `external_signers`
      const { data: insertedExternal, error } = await supabase
        .from('external_signers')
        .insert(externalSigners.filter(s => s.email))
        .select()

      if (error) throw error

      const externalInserts = insertedExternal.map((s) => ({
        document_id: id,
        external_signer_id: s.id,
      }))

      const signersInsert = [...internalInserts, ...externalInserts]

      await supabase.from('document_signers').insert(signersInsert)

      navigate(`/set-signature/${id}`)
    } catch (err) {
      alert('Gagal menyimpan penandatangan: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Pilih Penandatangan</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Pengguna Terdaftar</h3>
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.user_id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedUserIds.includes(user.user_id)}
                onChange={() => handleCheckbox(user.user_id)}
                className="mr-2"
              />
              <span>{user.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Penandatangan Eksternal</h3>
        {externalSigners.map((signer, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 mb-2">
            <input
              type="text"
              placeholder="Nama"
              value={signer.name}
              onChange={(e) => handleExternalChange(index, 'name', e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={signer.email}
              onChange={(e) => handleExternalChange(index, 'email', e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <input
              type="text"
              placeholder="No WhatsApp"
              value={signer.whatsapp}
              onChange={(e) => handleExternalChange(index, 'whatsapp', e.target.value)}
              className="border px-2 py-1 rounded"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addExternalField}
          className="text-sm text-blue-600 mt-2 hover:underline"
        >
          + Tambah Penandatangan Eksternal
        </button>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? 'Menyimpan...' : 'Lanjut ke Penempatan Tanda Tangan'}
        </button>
      </div>
    </div>
  )
}
