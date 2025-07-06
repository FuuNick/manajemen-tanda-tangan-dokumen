import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../service/supabase'

export default function AkunSaya() {
  const [profile, setProfile] = useState({
    name: '',
    wa_number: '',
    photo_url: '',
    personal_signature: '',
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
      const { data: { user }, error: userError } = await supabase.auth.getUser()
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
          personal_signature: data.personal_signature || '',
          email: user.email || '',
        })
      } else {
        await supabase.from('user_profiles').insert({
          user_id: user.id,
          name: '',
          wa_number: '',
          photo_url: '',
          personal_signature: '',
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
        personal_signature: profile.personal_signature,
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

  return (
    <div className="px-6 mt-6">
      <h1 className="text-3xl font-bold mb-6">Akun Saya</h1>

      <div className="bg-white p-6 rounded shadow max-w-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Profil</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:underline text-sm"
            >
              Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center">
            {profile.photo_url ? (
              <img
                src={profile.photo_url}
                alt="Foto Profil"
                className="w-24 h-24 rounded-full object-cover mb-2"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 mb-2 flex items-center justify-center text-gray-600">
                No Photo
              </div>
            )}

            {isEditing && (
              <>
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current.click()}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {uploading ? 'Mengupload...' : 'Ubah Foto Profil'}
                </button>
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
              </>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nama</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            ) : (
              <p>{profile.name || '-'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <p>{profile.email || '-'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nomor WhatsApp</label>
            {isEditing ? (
              <input
                type="text"
                name="wa_number"
                value={profile.wa_number}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            ) : (
              <p>{profile.wa_number || '-'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tanda Tangan Pribadi</label>
            {isEditing ? (
              <textarea
                name="personal_signature"
                value={profile.personal_signature}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            ) : (
              <p>{profile.personal_signature || '-'}</p>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-400 rounded"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Simpan Perubahan
              </button>
            </div>
          )}
        </form>

        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    </div>
  )
}
