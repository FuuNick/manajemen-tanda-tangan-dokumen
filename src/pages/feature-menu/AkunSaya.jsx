import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../service/supabase'

export default function AkunSaya() {
  const [profile, setProfile] = useState({
    name: '',
    wa_number: '',
    photo_url: '',
    email: '',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('User tidak ditemukan')
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        setError('Gagal mengambil profil: ' + error.message)
      }

      if (data) {
        setProfile({
          name: data.name || '',
          wa_number: data.wa_number || '',
          photo_url: data.photo_url || '',
          email: user.email || '',
        })
      } else {
        await supabase.from('user_profiles').insert({
          user_id: user.id,
          name: '',
          wa_number: '',
          photo_url: '',
        })
        setProfile((prev) => ({ ...prev, email: user.email || '' }))
      }

      setLoading(false)
    }
    fetchProfile()
  }, [])

  async function uploadPhoto(file) {
    try {
      setUploading(true)
      setError(null)
      const { data: { user } } = await supabase.auth.getUser()
      const userId = user?.id
      if (!userId) throw new Error('User tidak ditemukan')

      const fileExt = file.name.split('.').pop()
      const fileName = `avatar_${userId}.${fileExt}`
      const filePath = `${fileName}`

      if (profile.photo_url) {
        const oldFileName = profile.photo_url.split('/').pop().split('?')[0]
        await supabase.storage.from('avatar').remove([oldFileName])
      }

      const { error: uploadError } = await supabase.storage
        .from('avatar')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: urlData, error: urlError } = supabase.storage
        .from('avatar')
        .getPublicUrl(filePath)
      if (urlError) throw urlError

      setProfile((prev) => ({
        ...prev,
        photo_url: `${urlData.publicUrl}?v=${Date.now()}`
      }))
    } catch (err) {
      setError('Gagal upload file: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const userId = user?.id
      if (!userId) throw new Error('User tidak ditemukan')

      const updates = {
        user_id: userId,
        name: profile.name,
        wa_number: profile.wa_number,
        photo_url: profile.photo_url,
        updated_at: new Date().toISOString(),
      }

      const { error: upsertError } = await supabase
        .from('user_profiles')
        .upsert(updates)

      if (upsertError) throw upsertError

      setIsEditing(false)
    } catch (err) {
      setError('Gagal menyimpan profil: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p className="text-center mt-10">Memuat profil...</p>

  const renderField = (label, name, type = 'text') => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="md:col-span-2">
        {isEditing ? (
          <input
            type={type}
            name={name}
            value={profile[name]}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={name === 'email'}
          />
        ) : (
          <p className="text-gray-800">{profile[name] || '-'}</p>
        )}
      </div>
    </div>
  )

  return (
    <div className="px-4 sm:px-6 mt-6">
      <h1 className="text-3xl font-bold mb-6 max-w-xl">Akun Saya</h1>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-xl">
        {/* Foto Profil */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            {profile.photo_url ? (
              <img
                src={profile.photo_url}
                alt="Foto Profil"
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow-lg"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-lg font-semibold border-4 border-blue-500 shadow-lg">
                No Photo
              </div>
            )}
            {isEditing && (
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      uploadPhoto(e.target.files[0])
                    }
                  }}
                />
              </button>
            )}
          </div>
          <h3 className="mt-4 text-xl font-semibold text-gray-900">{profile.name || 'Nama Belum Diatur'}</h3>
          <p className="text-gray-600 text-sm">{profile.email}</p>
        </div>

        <hr className="my-6 border-gray-200" />

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderField('Nama Lengkap', 'name')}
          {renderField('Email', 'email', 'email')}
          {renderField('Nomor WhatsApp', 'wa_number')}

          {isEditing && (
            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          )}
        </form>

        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>

      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Edit Profil"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
      )}
    </div>
  )
}
