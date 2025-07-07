import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../service/supabase'

export default function ChooseSignerPage() {
  const { state } = useLocation()
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [signMode, setSignMode] = useState('self')
  const [signingType, setSigningType] = useState('parallel')
  const [internalUsers, setInternalUsers] = useState([])
  const [internalSigners, setInternalSigners] = useState([])
  const [externalSigners, setExternalSigners] = useState([])

  const [newExternal, setNewExternal] = useState({ name: '', email: '' })

  const { documentId, filePath } = state || {}

  useEffect(() => {
    const init = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return navigate('/login')

      setUser(authUser)

      const { data: users } = await supabase
        .from('user_profiles')
        .select('user_id, name, email')
        .neq('user_id', authUser.id)

      setInternalUsers(users || [])
    }

    init()
  }, [navigate])

  const addInternalSigner = (id) => {
    if (!internalSigners.includes(id)) {
      setInternalSigners([...internalSigners, id])
    }
  }

  const addExternalSigner = () => {
    if (!newExternal.name || !newExternal.email) return
    setExternalSigners([...externalSigners, { ...newExternal }])
    setNewExternal({ name: '', email: '' })
  }

  const handleSubmit = async () => {
    try {
      // Insert external signers first
      const externalInsertResults = []
      for (const signer of externalSigners) {
        const { data, error } = await supabase
          .from('external_signers')
          .insert([{ name: signer.name, email: signer.email }])
          .select()
          .single()

        if (error) throw error
        externalInsertResults.push(data)
      }

      // Build all signers list
      const signers = []

      let order = 1

      if (signMode === 'self') {
        signers.push({
          document_id: documentId,
          signer_user_id: user.id,
          signing_order: 1,
          created_by: user.id
        })
      } else {
        // Internal
        for (const internalId of internalSigners) {
          signers.push({
            document_id: documentId,
            signer_user_id: internalId,
            signing_order: signingType === 'sequential' ? order++ : null,
            created_by: user.id
          })
        }

        // External
        for (const ext of externalInsertResults) {
          signers.push({
            document_id: documentId,
            external_signer_id: ext.id,
            signing_order: signingType === 'sequential' ? order++ : null,
            created_by: user.id
          })
        }
      }

      const { error: signerInsertError } = await supabase
        .from('document_signers')
        .insert(signers)

      if (signerInsertError) throw signerInsertError

      // Update status dokumen
      await supabase
        .from('documents')
        .update({ status: 'sent' })
        .eq('id', documentId)

      // Kirim email ke penandatangan (simulasi)
      for (const ext of externalInsertResults) {
        await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTION_URL}/send-signing-invite`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            toEmail: ext.email,
            subject: 'Permintaan Tanda Tangan',
            message: `Silakan tanda tangani dokumen: ${filePath}`
          })
        })
      }

      navigate('/signature-editor', { state: { documentId } })
    } catch (error) {
      console.error(error)
      alert('Gagal menyimpan penandatangan')
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Pilih Penandatangan</h1>

      <div className="mb-4">
        <label className="font-semibold mb-2 block">Mode Tanda Tangan</label>
        <div className="space-x-4">
          <label>
            <input
              type="radio"
              checked={signMode === 'self'}
              onChange={() => setSignMode('self')}
            />{' '}
            Hanya Saya
          </label>
          <label>
            <input
              type="radio"
              checked={signMode === 'multi'}
              onChange={() => setSignMode('multi')}
            />{' '}
            Beberapa Orang
          </label>
        </div>
      </div>

      {signMode === 'multi' && (
        <>
          <div className="mb-4">
            <label className="font-semibold block mb-2">Mode Tanda Tangan</label>
            <select
              className="border px-2 py-1 rounded"
              value={signingType}
              onChange={(e) => setSigningType(e.target.value)}
            >
              <option value="parallel">Paralel</option>
              <option value="sequential">Berurutan</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="font-semibold block mb-2">Tambah Internal Signer</label>
            <select
              className="border px-2 py-1 rounded"
              onChange={(e) => addInternalSigner(e.target.value)}
              defaultValue=""
            >
              <option disabled value="">
                Pilih pengguna...
              </option>
              {internalUsers.map((u) => (
                <option key={u.user_id} value={u.user_id}>
                  {u.name || u.email}
                </option>
              ))}
            </select>
            <ul className="mt-2 list-disc ml-5 text-sm text-gray-700">
              {internalSigners.map((id) => {
                const user = internalUsers.find((u) => u.user_id === id)
                return <li key={id}>{user?.name || user?.email}</li>
              })}
            </ul>
          </div>

          <div className="mb-4">
            <label className="font-semibold block mb-2">Tambah External Signer</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Nama"
                value={newExternal.name}
                onChange={(e) => setNewExternal({ ...newExternal, name: e.target.value })}
                className="border px-2 py-1 rounded w-1/3"
              />
              <input
                type="email"
                placeholder="Email"
                value={newExternal.email}
                onChange={(e) => setNewExternal({ ...newExternal, email: e.target.value })}
                className="border px-2 py-1 rounded w-1/3"
              />
              <button
                onClick={addExternalSigner}
                className="bg-blue-600 text-white px-4 py-1 rounded"
              >
                Tambah
              </button>
            </div>
            <ul className="list-disc ml-5 text-sm text-gray-700">
              {externalSigners.map((s, i) => (
                <li key={i}>
                  {s.name} ({s.email})
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <div className="text-right">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Kirim Dokumen
        </button>
      </div>
    </div>
  )
}
