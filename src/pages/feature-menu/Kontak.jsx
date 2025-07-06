import React, { useEffect, useState } from 'react'
import { supabase } from '../../service/supabase'
import { Trash2, Pencil, Plus } from 'lucide-react'
import KontakModal from '../../components/KontakModal'

export default function Kontak() {
  const [kontak, setKontak] = useState([])
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingData, setEditingData] = useState(null)

  const fetchKontak = async () => {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setKontak(data)
  }

  useEffect(() => {
    fetchKontak()
  }, [])

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  const filteredKontak = kontak.filter((k) =>
    [k.name, k.email, k.wa_number].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  )

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredKontak.map((k) => k.id))
    }
    setSelectAll(!selectAll)
  }

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleOpenAdd = () => {
    setEditingData(null)
    setShowModal(true)
  }

  const handleOpenEdit = (data) => {
    setEditingData(data)
    setShowModal(true)
  }

  const handleSave = async (data) => {
    if (editingData) {
      await supabase.from('contacts').update(data).eq('id', editingData.id)
    } else {
      await supabase.from('contacts').insert(data)
    }
    setShowModal(false)
    fetchKontak()
  }

  const handleDelete = async (id) => {
    const confirm = window.confirm('Yakin hapus kontak ini?')
    if (!confirm) return
    await supabase.from('contacts').delete().eq('id', id)
    fetchKontak()
  }

  const handleDeleteMany = async () => {
    if (selectedIds.length === 0) return
    const confirm = window.confirm(`Yakin hapus ${selectedIds.length} kontak?`)
    if (!confirm) return
    await supabase.from('contacts').delete().in('id', selectedIds)
    setSelectedIds([])
    setSelectAll(false)
    fetchKontak()
  }

  return (
    <div className="p-4">
      <div className="bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-2">Kontak</h1>
        <hr className="border-t border-gray-300 mb-4 mx-2" />

        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Cari nama, email, atau telepon..."
            className="p-2 border w-full max-w-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={handleSearch}
          />
          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"
                onClick={handleDeleteMany}
              >
                <Trash2 size={16} /> Hapus Terpilih
              </button>
            )}
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
              onClick={handleOpenAdd}
            >
              <Plus size={16} /> Tambah Kontak
            </button>
          </div>
        </div>

        <div className="overflow-auto rounded-xl border">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="p-3 w-12">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-3">Nama</th>
                <th className="p-3">Email</th>
                <th className="p-3">Telepon</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredKontak.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    Tidak ada data kontak.
                  </td>
                </tr>
              ) : (
                filteredKontak.map((k) => (
                  <tr key={k.id} className="hover:bg-gray-50 border-t">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(k.id)}
                        onChange={() => toggleSelectOne(k.id)}
                      />
                    </td>
                    <td className="p-3">{k.name}</td>
                    <td className="p-3">{k.email}</td>
                    <td className="p-3">{k.wa_number}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleOpenEdit(k)}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(k.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-gray-500 mt-2">
          Menampilkan {filteredKontak.length} kontak
        </p>
      </div>

      <KontakModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        initialData={editingData}
      />
    </div>
  )
}
