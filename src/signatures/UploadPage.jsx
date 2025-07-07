// src/pages/UploadPage.jsx
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
    const fetchUser = async () => {
      const { data: authData, error } = await supabase.auth.getUser()
      if (error || !authData?.user) {
        navigate('/login')
        return
      }

      setUser(authData.user)

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', authData.user.id)
        .single()

      if (profile) setUserProfile(profile)
    }

    fetchUser()
  }, [navigate])

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file || file.type !== 'application/pdf') {
      alert('Hanya file PDF yang diizinkan.')
      return
    }

    setSelectedFile(file)
    setLoading(true)

    try {
      const documentId = uuidv4()
      const fileExt = file.name.split('.').pop()
      const fileName = `document_${documentId}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      // Upload file ke Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('dokumen')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Simpan metadata dokumen ke tabel documents
      const { error: insertError } = await supabase.from('documents').insert([
        {
          id: documentId,
          file_url: filePath,
          owner_id: user.id,
          created_by: user.id,
          status: 'draft'
        }
      ])

      if (insertError) throw insertError

      // Navigasi ke halaman Choose Signer
      navigate('/choose-signer', {
        state: {
          documentId,
          filePath
        }
      })
    } catch (error) {
      console.error('Upload gagal:', error.message)
      alert('Upload dokumen gagal: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar user={user} userProfile={userProfile} onLogout={handleLogout} />

      <main className="flex flex-1 items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">Upload Dokumen PDF</h1>
          <p className="mb-4 text-gray-600">
            Unggah dokumen PDF yang ingin kamu tandatangani.
          </p>

          <label
            htmlFor="file-upload"
            className={`block w-full text-center py-3 px-4 rounded-lg font-semibold ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            } text-white`}
          >
            {loading ? 'Mengupload...' : 'Pilih File PDF'}
          </label>

          <input
            id="file-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={loading}
            className="hidden"
          />

          {selectedFile && (
            <p className="mt-2 text-green-600 text-sm">
              {selectedFile.name}
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
