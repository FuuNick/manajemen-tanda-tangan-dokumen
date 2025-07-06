export default function RightPanel() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Pilihan Tanda Tangan</h3>

      <div className="space-y-2">
        <div className="text-sm font-medium">Kotak Isian Wajib diisi</div>
        <div className="bg-white border p-2 rounded">🖊️ Tanda Tangan</div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium">Kotak Isian Opsional</div>
        <div className="bg-white border p-2 rounded">✏️ Inisial</div>
        <div className="bg-white border p-2 rounded">👤 Nama</div>
        <div className="bg-white border p-2 rounded">📅 Tanggal</div>
        <div className="bg-white border p-2 rounded">💬 Teks</div>
        <div className="bg-white border p-2 rounded">🏢 Stempel</div>
      </div>

      <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded">
        Kirim Untuk Tanda Tangan
      </button>
    </div>
  )
}
