import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../service/supabase'
import { v4 as uuidv4 } from 'uuid'
import Navbar from '../components/Navbar'

export default function ChooseSignerPage() {
  const { state } = useLocation()
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [signSelf, setSignSelf] = useState(true)
  const [externalSigner, setExternalSigner] = useState({ name: '', email: '', whatsapp: '' })
  const [loading, setLoading] = useState(false)

  const documentId = state?.documentId

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData } = await supabase.auth.getUser()
      const user = authData?.user
      if (!user) return navigate('/login')
      setUser(user)

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      if (profile) setUserProfile(profile)
    }

    fetchUser()
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!documentId || !user) {
      alert('Data tidak lengkap.')
      return
    }

    setLoading(true)

    try {
      const signers = []

      if (signSelf) {
        signers.push({
          id: uuidv4(),
          document_id: documentId,
          signer_user_id: user.id,
          signing_order: 1,
        })
      }

      if (externalSigner.name && externalSigner.email) {
        const { data: extData, error: extErr } = await supabase
          .from('external_signers')
          .insert([{
            id: uuidv4(),
            name: externalSigner.name,
            email: externalSigner.email,
            whatsapp: externalSigner.whatsapp,
          }])
          .select()
          .single()

        if (extErr) throw extErr

        signers.push({
          id: uuidv4(),
          document_id: documentId,
          external_signer_id: extData.id,
          signing_order: signSelf ? 2 : 1,
        })
      }

      if (signers.length === 0) {
        alert('Pilih setidaknya satu penandatangan.')
        return
      }

      const { error: signerError } = await supabase.from('document_signers').insert(signers)
      if (signerError) throw signerError

      navigate('/set-signature-position', { state: { documentId } })
    } catch (error) {
      console.error(error)
      alert('Gagal menyimpan penandatangan.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} userProfile={userProfile} onLogout={handleLogout} />
      <main className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded shadow">
        <h1 className="text-2xl font-semibold mb-4">Pilih Penandatangan</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={signSelf}
                onChange={() => setSignSelf(!signSelf)}
              />
              <span>Saya akan menandatangani dokumen ini</span>
            </label>
          </div>

          <div>
            <h2 className="font-medium text-lg mb-2">Undang Penandatangan Eksternal (Opsional)</h2>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Nama Lengkap"
                className="w-full px-4 py-2 border rounded"
                value={externalSigner.name}
                onChange={(e) => setExternalSigner({ ...externalSigner, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border rounded"
                value={externalSigner.email}
                onChange={(e) => setExternalSigner({ ...externalSigner, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="No WhatsApp (opsional)"
                className="w-full px-4 py-2 border rounded"
                value={externalSigner.whatsapp}
                onChange={(e) => setExternalSigner({ ...externalSigner, whatsapp: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-semibold rounded ${
              loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
            } transition`}
          >
            {loading ? 'Menyimpan...' : 'Lanjut ke Penempatan Tanda Tangan'}
          </button>
        </form>
      </main>
    </div>
  )
}
