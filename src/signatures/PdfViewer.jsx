import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../service/supabase'
import Navbar from '../components/Navbar'

export default function PDFView() {
  const location = useLocation()
  const navigate = useNavigate()
  const { filePath } = location.state || {}
  const [pdfUrl, setPdfUrl] = useState(null)

  useEffect(() => {
    if (!filePath) {
      alert('File tidak ditemukan.')
      navigate('/home/dashboard')
      return
    }

    const getPublicUrl = async () => {
      const { data, error } = supabase.storage
        .from('dokumen')
        .getPublicUrl(filePath)

      if (error) {
        alert('Gagal memuat file PDF.')
        return
      }

      setPdfUrl(data.publicUrl)
    }

    getPublicUrl()
  }, [filePath, navigate])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <main className="flex-1 flex justify-center items-center p-6">
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            title="Preview PDF"
            className="w-full h-[90vh] border rounded shadow"
          />
        ) : (
          <p className="text-gray-600">Memuat dokumen...</p>
        )}
      </main>
    </div>
  )
}
