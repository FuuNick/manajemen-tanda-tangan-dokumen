import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Document, Page, pdfjs } from 'react-pdf'
import { supabase } from '../service/supabase'
import { Rnd } from 'react-rnd'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

export default function SetSignaturePositionPage() {
  const location = useLocation()
  const { documentId, filePath } = location.state || {}

  const [fileUrl, setFileUrl] = useState(null)
  const [numPages, setNumPages] = useState(null)
  const [loading, setLoading] = useState(true)
  const [placeholders, setPlaceholders] = useState([
    {
      id: '1',
      label: 'Tanda Tangan Saya',
      page: 1,
      x: 50,
      y: 100,
      width: 120,
      height: 50,
      rotation: 0,
    },
  ])

  useEffect(() => {
    const fetchSignedUrl = async () => {
      if (!filePath) return

      console.log('📁 filePath:', filePath)

      const { data, error } = await supabase
        .storage
        .from('dokumen')
        .createSignedUrl(filePath, 60 * 30) // 30 menit

      if (error) {
        console.error('❌ Gagal buat signed URL:', error)
        return
      }

      console.log('🔗 signedUrl:', data.signedUrl)
      setFileUrl(data.signedUrl)
      setLoading(false)
    }

    fetchSignedUrl()
  }, [filePath])

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }

  const handleDragStop = (id, d) => {
    setPlaceholders(prev =>
      prev.map(p =>
        p.id === id ? { ...p, x: d.x, y: d.y } : p
      )
    )
  }

  const handleResizeStop = (id, ref, position) => {
    setPlaceholders(prev =>
      prev.map(p =>
        p.id === id
          ? {
              ...p,
              width: parseFloat(ref.style.width),
              height: parseFloat(ref.style.height),
              x: position.x,
              y: position.y,
            }
          : p
      )
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Memuat dokumen...
      </div>
    )
  }

  if (!numPages) {
    return (
      <div className="text-center py-10 text-red-600">
        Gagal memuat dokumen. Pastikan file PDF valid atau coba unggah ulang.
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center py-6">
      <h1 className="text-2xl font-bold mb-4">Atur Posisi Tanda Tangan</h1>

      <div className="w-full max-w-4xl bg-gray-100 rounded shadow p-4">
        {fileUrl && (
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            crossOrigin="anonymous"
          >
            {Array.from({ length: numPages }, (_, index) => (
              <div key={index} className="relative my-4 border shadow">
                <Page pageNumber={index + 1} width={600} />

                {placeholders
                  .filter(p => p.page === index + 1)
                  .map(ph => (
                    <Rnd
                      key={ph.id}
                      default={{
                        x: ph.x,
                        y: ph.y,
                        width: ph.width,
                        height: ph.height,
                      }}
                      bounds="parent"
                      onDragStop={(e, d) => handleDragStop(ph.id, d)}
                      onResizeStop={(e, dir, ref, delta, pos) =>
                        handleResizeStop(ph.id, ref, pos)
                      }
                      style={{
                        transform: `rotate(${ph.rotation}deg)`,
                        zIndex: 10,
                      }}
                      className="absolute bg-yellow-200 border border-yellow-500 text-sm flex items-center justify-center"
                    >
                      {ph.label}
                    </Rnd>
                  ))}
              </div>
            ))}
          </Document>
        )}
      </div>
    </div>
  )
}
