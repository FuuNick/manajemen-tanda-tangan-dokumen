// src/pages/SetSignaturePositionPage.jsx
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../service/supabase'
import { pdfjs } from 'react-pdf'
import { Rnd } from 'react-rnd'
import Navbar from '../components/Navbar'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

export default function SetSignaturePositionPage() {
  const navigate = useNavigate()
  const { documentId, filePath } = useLocation().state || {}
  const [fileUrl, setFileUrl] = useState(null)
  const [pdfDoc, setPdfDoc] = useState(null)
  const [numPages, setNumPages] = useState(0)
  const canvasRefs = useRef([])
  const [placeholders, setPlaceholders] = useState([])
  const [signers, setSigners] = useState([])
  const [selectedSigner, setSelectedSigner] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return navigate('/login')

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      const { data: signerList } = await supabase
        .from('document_signers')
        .select('id, signer_user_id, external_signer_id')
        .eq('document_id', documentId)

      setSigners(signerList)

      const { data: signedUrlData } = await supabase.storage
        .from('dokumen')
        .createSignedUrl(filePath, 600)

      if (!signedUrlData?.signedUrl) return

      setFileUrl(signedUrlData.signedUrl)

      const doc = await pdfjs.getDocument(signedUrlData.signedUrl).promise
      setPdfDoc(doc)
      setNumPages(doc.numPages)
    }

    if (documentId && filePath) init()
    else navigate('/home/dashboard')
  }, [documentId, filePath, navigate])

  useEffect(() => {
    if (!pdfDoc) return
    canvasRefs.current = Array(numPages)
      .fill()
      .map((_, i) => canvasRefs.current[i] || React.createRef())

    canvasRefs.current.forEach((canvasRef, i) => {
      pdfDoc.getPage(i + 1).then((page) => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        const viewport = page.getViewport({ scale: 1.5 })
        canvas.height = viewport.height
        canvas.width = viewport.width
        page.render({ canvasContext: context, viewport })
      })
    })
  }, [pdfDoc, numPages])

  const handlePlace = () => {
    if (!selectedSigner) return alert('Pilih penandatangan dahulu')
    const newPh = {
      id: Date.now(),
      signer_id: selectedSigner,
      page_number: currentPage,
      x: 100,
      y: 100,
      width: 150,
      height: 50,
      type: 'signature',
      label: 'Tanda Tangan'
    }
    setPlaceholders((prev) => [...prev, newPh])
  }

  const handleSave = async () => {
    for (let ph of placeholders) {
      await supabase.from('signature_positions').insert({
        document_id: documentId,
        signer_id: ph.signer_id,
        page_number: ph.page_number,
        x: ph.x,
        y: ph.y,
        width: ph.width,
        height: ph.height,
        placeholder_label: ph.label,
        type: ph.type,
        is_required: true,
      })
    }
    alert('Berhasil menyimpan posisi')
    navigate('/home/terkirim')
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-64 p-4 bg-gray-100 border-r">
          <h2 className="font-bold text-lg mb-2">Penandatangan</h2>
          <select
            className="w-full border p-2 mb-4"
            onChange={(e) => setSelectedSigner(e.target.value)}
          >
            <option value="">-- Pilih --</option>
            {signers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.signer_user_id || s.external_signer_id}
              </option>
            ))}
          </select>
          <button
            onClick={handlePlace}
            className="bg-blue-600 text-white px-4 py-2 w-full rounded"
          >
            Tambah Tanda Tangan
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 w-full mt-4 rounded"
          >
            Simpan
          </button>
        </div>

        {/* PDF Area */}
        <div className="flex-1 p-4 overflow-auto">
          {Array.from({ length: numPages }, (_, i) => (
            <div key={i} className="relative mb-8 border">
              <canvas
                ref={(el) => (canvasRefs.current[i] = el)}
                className="shadow"
              />
              {placeholders
                .filter((ph) => ph.page_number === i + 1)
                .map((ph) => (
                  <Rnd
                    key={ph.id}
                    size={{ width: ph.width, height: ph.height }}
                    position={{ x: ph.x, y: ph.y }}
                    bounds="parent"
                    onDragStop={(e, d) => {
                      setPlaceholders((prev) =>
                        prev.map((p) =>
                          p.id === ph.id ? { ...p, x: d.x, y: d.y } : p
                        )
                      )
                    }}
                    onResizeStop={(e, dir, ref, delta, pos) => {
                      setPlaceholders((prev) =>
                        prev.map((p) =>
                          p.id === ph.id
                            ? {
                                ...p,
                                width: ref.offsetWidth,
                                height: ref.offsetHeight,
                                x: pos.x,
                                y: pos.y,
                              }
                            : p
                        )
                      )
                    }}
                    className="absolute border-2 border-blue-500 bg-blue-100 text-center text-xs flex items-center justify-center"
                  >
                    {ph.label}
                  </Rnd>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
