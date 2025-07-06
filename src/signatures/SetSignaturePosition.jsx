// src/pages/SetSignaturePositionPage.jsx
import { useDrag } from 'react-dnd'
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../service/supabase'
import Navbar from '../components/Navbar'
import { pdfjs } from 'react-pdf'
import { Rnd } from 'react-rnd'
import { useDrop } from 'react-dnd'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

const ELEMENTS = [
  { key: 'signature', label: 'Tanda Tangan', required: true },
  { key: 'initial', label: 'Inisial' },
  { key: 'name', label: 'Nama' },
  { key: 'date', label: 'Tanggal' },
  { key: 'text', label: 'Teks' },
  { key: 'stamp', label: 'Stempel Perusahaan' },
]

export default function SetSignaturePositionPage() {
  const navigate = useNavigate()
  const { documentId, filePath } = useLocation().state || {}
  const [fileUrl, setFileUrl] = useState(null)
  const [pdfDoc, setPdfDoc] = useState(null)
  const canvasRefs = useRef([])
  const [numPages, setNumPages] = useState(0)
  const [placeholders, setPlaceholders] = useState([])
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user)
        supabase
          .from('user_profiles')
          .select('*').eq('user_id', data.user.id).single()
          .then(({ data: prof }) => setUserProfile(prof))
      }
    })

    if (!filePath) return navigate('/home/dashboard')

    supabase.storage.from('dokumen').createSignedUrl(filePath, 1800)
      .then(({ data, error }) => {
        if (data) {
          setFileUrl(data.signedUrl)
          pdfjs.getDocument(data.signedUrl).promise
            .then(doc => setPdfDoc(doc) && setNumPages(doc.numPages))
        }
      })
  }, [filePath, navigate])

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

  useEffect(() => { drawPages() }, [pdfDoc, numPages])

  const [{ isOver }, drop] = useDrop({
    accept: ELEMENTS.map(e => e.key),
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset()
      const canvasEl = canvasRefs.current[item.pageNum - 1]
      const rect = canvasEl.getBoundingClientRect()
      const x = offset.x - rect.left
      const y = offset.y - rect.top
      const newPh = { ...item, x, y, width: 120, height: 40, id: Date.now() }
      setPlaceholders(prev => [...prev, newPh])
    },
    collect: monitor => ({ isOver: monitor.isOver() }),
  })

  const handleSave = async () => {
    for (let ph of placeholders) {
      await supabase.from('signature_positions').insert({
        document_id: documentId,
        signer_id: user.id,
        page_number: ph.pageNum,
        x: ph.x,
        y: ph.y,
        width: ph.width,
        height: ph.height,
        placeholder_label: ph.label,
      })
    }
    alert('Posisi disimpan!') && navigate('/home/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} userProfile={userProfile} onLogout={() => supabase.auth.signOut() && navigate('/login')} />

      <div className="flex flex-1">
        {/* Sidebar thumbnail */}
        <div className="w-20 bg-gray-200 p-2 overflow-auto">
          {Array.from({ length: numPages }, (_, i) => (
            <div key={i} className="border m-1 p-2 text-center">{i+1}</div>
          ))}
        </div>

        {/* PDF Canvas */}
        <div className="flex-1 p-4 bg-gray-100 overflow-auto" ref={drop}>
          {Array.from({ length: numPages }, (_, i) => (
            <div key={i} className="relative mb-8">
              <canvas ref={el => canvasRefs.current[i] = el} />
              {placeholders.filter(p => p.pageNum === i + 1).map(ph => (
                <Rnd
                  key={ph.id}
                  size={{ width: ph.width, height: ph.height }}
                  position={{ x: ph.x, y: ph.y }}
                  onDragStop={(e, d) => {
                    setPlaceholders(prev => prev.map(z => z.id===ph.id ? { ...z, x: d.x, y: d.y } : z))
                  }}
                  onResizeStop={(e, dir, ref, delta, pos) => {
                    setPlaceholders(prev => prev.map(z => z.id===ph.id ? {
                      ...z,
                      width: ref.offsetWidth,
                      height: ref.offsetHeight,
                      x: pos.x,
                      y: pos.y
                    } : z))
                  }}
                  bounds="parent"
                  style={{ border: '1px dashed blue', backgroundColor: 'rgba(0,0,255,0.1)' }}
                >
                  {ph.label}
                </Rnd>
              ))}
            </div>
          ))}
        </div>

        {/* Panel kanan */}
        <div className="w-64 bg-gray-200 p-4 flex flex-col">
          <h2 className="font-semibold mb-2">Pilihan Tanda Tangan</h2>
          <h3 className="font-medium">Wajib:</h3>
          {ELEMENTS.filter(e => e.required).map(el => (
            <DraggableItem key={el.key} type={el.key} label={el.label} />
          ))}
          <h3 className="font-medium mt-4">Opsional:</h3>
          {ELEMENTS.filter(e => !e.required).map(el => (
            <DraggableItem key={el.key} type={el.key} label={el.label} />
          ))}
          <button onClick={handleSave} className="mt-auto bg-blue-500 text-white py-2 rounded">Kirim Untuk Tanda Tangan</button>
        </div>
      </div>
    </div>
  )
}

// DraggableItem
function DraggableItem({ type, label }) {
  const [, drag] = useDrag({ item: { type, label, pageNum: 1 }, type })
  return (
    <div ref={drag} className="border p-2 mb-2 bg-white cursor-move">
      {label}
    </div>
  )
}
