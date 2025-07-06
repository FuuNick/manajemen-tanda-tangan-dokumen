import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      console.log(`File PDF terpilih: ${file.name}`);
      navigate('/choose-signer', { state: { documentName: file.name } });
    } else {
      setSelectedFile(null);
      alert('Harap pilih file dalam format PDF.');
    }
  };

  const handleMasukClick = () => {
    console.log('Tombol Masuk diklik');
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen w-screen bg-gray-100 text-gray-800 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center px-6 md:px-10 py-5 bg-white shadow border-b border-gray-200">
        <div className="text-lg font-bold">Signature</div>
        <button
          onClick={handleMasukClick}
          className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded text-sm transition"
        >
          Masuk
        </button>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col justify-center items-center text-center px-4 py-10">
        <div className="max-w-xl w-full px-4">
          <h1 className="text-4xl font-bold mb-4">Tanda Tangan Dokumen</h1>
          <p className="text-lg text-gray-600 mb-8">
            Upload dokumen, Tanda tangan dokumen Anda sendiri atau ajak pihak lain untuk menandatangani secara elektronik.
          </p>

          <label
            htmlFor="file-upload"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg cursor-pointer transition mb-4"
          >
            Pilih File Dokumen
          </label>

          <input
            id="file-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          <p className="text-sm text-gray-500 mb-6">Format dalam bentuk file.pdf</p>
        </div>
      </main>
    </div>
  );
}

export default UploadPage;
