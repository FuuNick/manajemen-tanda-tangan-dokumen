import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../service/supabase'
import { v4 as uuidv4 } from 'uuid'
import Navbar from '../components/Navbar'

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const getUserAndProfile = async () => {
      const { data: authData } = await supabase.auth.getUser()
      const user = authData?.user
      if (!user) {
        navigate('/login')
        return
      }
      setUser(user)

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (profile) setUserProfile(profile)
    }

    getUserAndProfile()
  }, [navigate])

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (!file || file.type !== 'application/pdf') {
      alert('Harap pilih file dalam format PDF.')
      return
    }

    setSelectedFile(file)
    setLoading(true)

    try {
      const { data: authData } = await supabase.auth.getUser()
      const user = authData?.user

      if (!user) {
        alert('Silakan login terlebih dahulu.')
        navigate('/login')
        return
      }

      const documentId = uuidv4()
      const fileExt = file.name.split('.').pop()
      const fileName = `document_${documentId}.${fileExt}`
      const filePath = `${user.id}/${fileName}` // ✅ simpan di folder user

      // Upload file ke Supabase Storage
      const { error: uploadError } = await supabase
        .storage
        .from('dokumen')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Simpan metadata dokumen
      const { error: insertError } = await supabase.from('documents').insert([
        {
          id: documentId,
          file_url: filePath,
          owner_id: user.id,
          status: 'draft',
        },
      ])

      if (insertError) throw insertError

      navigate('/pdfview', {
        state: { documentId, filePath },
      })
    } catch (error) {
      console.error(error)
      alert('Gagal upload dokumen: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="flex flex-col min-h-screen w-screen bg-gray-100 text-gray-800 font-sans">
      <Navbar user={user} userProfile={userProfile} onLogout={handleLogout} />

      <main className="flex flex-1 flex-col justify-center items-center text-center px-4 py-10">
        <div className="max-w-xl w-full px-4">
          <h1 className="text-4xl font-bold mb-4">Tanda Tangan Dokumen</h1>
          <p className="text-lg text-gray-600 mb-8">
            Upload dokumen, lalu tanda tangani sendiri atau ajak pihak lain menandatangani secara elektronik.
          </p>

          <label
            htmlFor="file-upload"
            className={`inline-block ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-3 px-6 rounded-lg cursor-pointer transition mb-4`}
          >
            {loading ? 'Mengupload...' : 'Pilih File Dokumen'}
          </label>

          <input
            id="file-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
            disabled={loading}
          />

          {selectedFile && (
            <p className="text-sm text-green-600 mb-2">{selectedFile.name}</p>
          )}

          <p className="text-sm text-gray-500">Format hanya PDF.</p>
        </div>
      </main>
    </div>
  )
}
