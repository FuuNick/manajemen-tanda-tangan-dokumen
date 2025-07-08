import React from 'react';
import { useNavigate } from 'react-router-dom';

function DownloadDocumentPage() {
  const navigate = useNavigate();

  const handleMasukClick = () => {
    console.log('Tombol Masuk diklik di halaman Unduh Dokumen');
    navigate('/login');
  };

  const handleDownloadClick = () => {
    console.log('Tombol "Unduh Dokumen yang ditandatangani" diklik');
    alert('Simulasi: Dokumen sedang diunduh!');
  };

  return (
    <div className="flex flex-col min-h-screen w-screen bg-gray-100 text-gray-800 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center px-6 md:px-10 py-4 bg-white shadow border-b border-gray-200">
        <div className="text-lg font-bold text-gray-800">Signature</div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-10">
          Anda Berhasil Menandatangani
        </h1>

        <div className="flex items-center gap-6">
          <span className="w-4 h-4 bg-blue-600 rounded-full"></span>
          <button
            onClick={handleDownloadClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 px-8 rounded-xl shadow-lg transition"
          >
            Unduh Dokumen yang ditandatangani
          </button>
          <span className="w-4 h-4 bg-blue-600 rounded-full"></span>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex flex-wrap justify-around items-start gap-6 px-8 py-12 bg-gray-900 text-gray-300 text-sm">
        <div className="max-w-xs">
          <h3 className="text-blue-500 font-bold text-base mb-3">Signature</h3>
          <p className="text-gray-400">
            Platform tanda tangan digital terpercaya di Indonesia.
          </p>
        </div>

        <div>
          <h3 className="text-blue-500 font-bold text-base mb-3">Produk</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-400">Fitur</a></li>
            <li><a href="#" className="hover:text-blue-400">Harga</a></li>
            <li><a href="#" className="hover:text-blue-400">Keamanan</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-blue-500 font-bold text-base mb-3">Perusahaan</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-400">Tentang Kami</a></li>
            <li><a href="#" className="hover:text-blue-400">Kontak</a></li>
            <li><a href="#" className="hover:text-blue-400">Karir</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-blue-500 font-bold text-base mb-3">Ikuti Kami</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <a href="#" className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-3 py-2 rounded">
                <img src="/facebook-icon.png" alt="Facebook" className="w-5 h-5 filter invert" />
                Facebook
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-3 py-2 rounded">
                <img src="/instagram-icon.png" alt="Instagram" className="w-5 h-5 filter invert" />
                Instagram
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-2 bg-blue-400 hover:bg-blue-500 text-white px-3 py-2 rounded">
                <img src="/twitter-icon.png" alt="Twitter" className="w-5 h-5 filter invert" />
                Twitter
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default DownloadDocumentPage;