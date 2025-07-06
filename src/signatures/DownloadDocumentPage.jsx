// src/signatures/DownloadDocumentPage.jsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../service/supabase'

export default function DownloadDocumentPage() {
  const { documentId } = useParams()
  const [document, setDocument] = useState(null)

  useEffect(() => {
    const fetchDocument = async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single()

      if (!error) setDocument(data)
    }
    fetchDocument()
  }, [documentId])

  if (!document) return <p className="text-center mt-10">Memuat dokumen...</p>

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h2 className="text-xl font-semibold mb-4">Unduh Dokumen</h2>
      <p className="mb-4">{document.title || 'Tanpa Judul'}</p>
      <a
        href={document.file_url}
        download
        className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        Unduh File
      </a>
    </div>
  )
}
