// src/pages/SignDocumentPage.jsx
import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../service/supabase'
import { pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

export default function SignDocumentPage() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [signerData, setSignerData] = useState(null)
  const [documentData, setDocumentData] = useState(null)
  const [fileUrl, setFileUrl] = useState(null)
  const [pdfDoc, setPdfDoc] = useState(null)
  const canvasRefs = useRef([])
  const [signaturePositions, setSignaturePositions] = useState([])
  const [numPages, setNumPages] = useState(0)
  const [signed, setSigned] = useState(false)

  useEffect(() => {
    const fetchSignerInfo = async () => {
      // Anggap token = id dari document_signers
      const { data: signer, error: signerErr } = await supabase
        .from('document_signers')
        .select('*')
        .eq('id', token)
        .single()

      if (!signer || signerErr) {
        alert('Link tidak valid atau sudah kedaluwarsa.')
        return navigate('/')
      }

      setSignerData(signer)

      const { data: document, error: docErr } = await supabase
        .from('documents')
        .select('*')
        .eq('id', signer.document_id)
        .single()

      if (docErr || !document) return alert('Dokumen tidak ditemukan')
      setDocumentData(document)

      const { data: fileData } = await supabase.storage.from('dokumen')
        .createSignedUrl(document.file_url, 600)

      if (!fileData?.signedUrl) return alert('Gagal mengambil file dokumen.')

      setFileUrl(fileData.signedUrl)

      const doc = await pdfjs.getDocument(fileData.signedUrl).promise
      setPdfDoc(doc)
      setNumPages(doc.numPages)

      const { data: positions } = await supabase
        .from('signature_positions')
        .select('*')
        .eq('signer_id', signer.id)

      setSignaturePositions(positions || [])
    }

    fetchSignerInfo()
  }, [token, navigate])

  useEffect(() => {
    const drawPages = () => {
      if (!pdfDoc) return
      canvasRefs.current.slice(0, numPages).forEach((canvas, i) => {
        pdfDoc.getPage(i + 1).then(page => {
          const viewport = page.getViewport({ scale: 1.5 })
          const ctx = canvas.getContext('2d')
          canvas.width = viewport.width
          canvas.height = viewport.height
          page.render({ canvasContext: ctx, viewport })
        })
      })
    }

    drawPages()
  }, [pdfDoc, numPages])

  const handleSign = async () => {
    const { error } = await supabase
      .from('document_signers')
      .update({ status: 'signed', signed_at: new Date().toISOString() })
      .eq('id', signerData.id)

    if (!error) {
      setSigned(true)
      alert('Tanda tangan berhasil!')
    } else {
      alert('Gagal menyimpan tanda tangan.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Tanda Tangani Dokumen</h1>

      {fileUrl ? (
        <div className="space-y-6">
          {Array.from({ length: numPages }, (_, i) => (
            <div key={i} className="relative border shadow-lg">
              <canvas ref={(el) => (canvasRefs.current[i] = el)} />
              {signaturePositions
                .filter(pos => pos.page_number === i + 1)
                .map((pos, idx) => (
                  <div
                    key={idx}
                    className="absolute border border-blue-500 bg-blue-100 text-xs text-blue-700 flex items-center justify-center"
                    style={{
                      left: pos.x,
                      top: pos.y,
                      width: pos.width,
                      height: pos.height,
                    }}
                  >
                    {pos.placeholder_label || 'TTD'}
                  </div>
                ))}
            </div>
          ))}

          {!signed ? (
            <button
              onClick={handleSign}
              className="bg-green-600 text-white px-6 py-2 rounded shadow"
            >
              Tanda Tangani Sekarang
            </button>
          ) : (
            <div className="text-green-700 font-semibold">Dokumen sudah ditandatangani.</div>
          )}
        </div>
      ) : (
        <p>Memuat dokumen...</p>
      )}
    </div>
  )
}
