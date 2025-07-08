import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SignerSelectionModal from '../../components/SignerSelectionModal';

function ChooseSignerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [documentName, setDocumentName] = useState(location.state?.documentName || 'Dokumen Tanpa Nama');
  const [showSignerModal, setShowSignerModal] = useState(true);

  useEffect(() => {
    if (!location.state?.documentName) {
      console.warn('Accessed ChooseSignerPage directly or without document data. Consider redirecting.');
    }
  }, [location.state, navigate]);

  const handleSignerSelection = (type) => {
    console.log(`Pilihan penandatangan: ${type}`);
    setShowSignerModal(false);
  };

  const handleMasukClick = () => {
    console.log('Tombol Masuk diklik di halaman Pilih Penandatangan');
    navigate('/login');
  };

  const handleKirimTandaTangan = () => {
    console.log('Tombol "Kirim Untuk Tanda Tangan" diklik');
    alert('Simulasi: Dokumen berhasil ditandatangani dan dikirim!');
    navigate('/download');
  };

  return (
    <div className="flex flex-col min-h-screen w-screen bg-gray-100 font-sans text-gray-800 relative">
      {/* Header */}
      <header className="flex justify-between items-center p-4 md:p-6 bg-white shadow border-b border-gray-200 z-10">
        <div className="text-lg font-bold">Pilih Penandatangan</div>
        <button
          className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded text-sm transition"
          onClick={handleMasukClick}
        >
          Masuk
        </button>
      </header>

      {/* Konten Utama */}
      <div className="flex flex-1 flex-col xl:flex-row gap-4 p-4 md:p-6 overflow-hidden relative">
        {/* Sidebar kiri */}
        <aside className="bg-white shadow rounded-lg p-4 w-full max-w-[160px] flex flex-col items-center">
          <div className="w-[100px] h-[120px] bg-gray-200 border border-gray-400 rounded flex items-center justify-center text-xl text-gray-600 mb-4">
            <div className="w-[60px] h-[80px] bg-gray-400 text-white text-sm font-bold flex items-center justify-center rounded-sm border">
              1
            </div>
          </div>
        </aside>

        {/* Dokumen Tengah */}
        <main className="flex-1 bg-white shadow rounded-lg flex justify-center items-center relative">
          <div className="w-[80%] max-w-[700px] h-[90%] max-h-[800px] border border-gray-300 bg-gray-100 flex flex-col items-center justify-start p-5 overflow-y-auto">
            <div className="text-2xl font-bold mb-5 text-center">{documentName.replace('.pdf', '')}</div>
            <p className="text-gray-600 text-center">
              Ini adalah area pratinjau dokumen PDF Anda. Akan terisi dengan viewer PDF sebenarnya.
            </p>
          </div>

          {showSignerModal && (
            <SignerSelectionModal onSelect={handleSignerSelection} documentName={documentName} />
          )}
        </main>

        {/* Sidebar kanan */}
        <aside className="bg-white shadow rounded-lg p-4 w-full max-w-[250px] flex flex-col overflow-y-auto">
          <h3 className="text-lg font-bold border-b pb-2 mb-4">Pilihan Tanda Tangan</h3>

          <div className="mb-6">
            <h4 className="text-sm text-gray-500 mb-2">Kotak isian Wajib diisi</h4>
            <div className="bg-gray-100 border border-gray-300 p-2 mb-2 rounded flex items-center cursor-grab">
              <span className="font-bold text-gray-400 mr-2">::</span> Tanda Tangan
            </div>
          </div>

          <div>
            <h4 className="text-sm text-gray-500 mb-2">Kotak isian Opsional</h4>
            {['Inisial', 'Nama', 'Tanggal', 'Teks', 'Stempel Perusahaan'].map((item, index) => (
              <div
                key={index}
                className="bg-gray-100 border border-gray-300 p-2 mb-2 rounded flex items-center cursor-grab"
              >
                <span className="font-bold text-gray-400 mr-2">::</span> {item}
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-5 right-10 z-10 xl:static xl:flex xl:justify-center xl:py-6">
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-blue-700 transition text-lg"
          onClick={handleKirimTandaTangan}
        >
          Kirim Untuk Tanda Tangan
        </button>
      </footer>
    </div>
  );
}

export default ChooseSignerPage;