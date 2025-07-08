// src/components/SignerSelectionModal.jsx
import React from 'react';

function SignerSelectionModal({ onSelect, documentName }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center w-[90%] max-w-[650px]">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8">
          Siapa yang akan menandatangani dokumen ini?
        </h2>

        <div className="flex flex-wrap justify-center gap-6 mb-6">
          <div
            className="border-2 border-gray-300 rounded-xl p-6 min-w-[250px] max-w-[300px] flex-1 cursor-pointer transition-all hover:border-blue-500 hover:shadow-md flex flex-col items-center"
            onClick={() => onSelect('onlyMe')}
          >
            <div className="w-[60px] h-[60px] bg-gray-300 rounded-full mb-3"></div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Hanya Saya</h3>
            <p className="text-sm text-gray-600 text-center">
              Saya sendiri yang akan menandatangani dokumen ini
            </p>
          </div>

          <div
            className="border-2 border-gray-300 rounded-xl p-6 min-w-[250px] max-w-[300px] flex-1 cursor-pointer transition-all hover:border-blue-500 hover:shadow-md flex flex-col items-center"
            onClick={() => onSelect('multiple')}
          >
            <div className="w-[60px] h-[60px] bg-gray-300 rounded-full mb-3"></div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Beberapa orang</h3>
            <p className="text-sm text-gray-600 text-center">
              Ajak orang lain untuk menandatangani
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Dokumen yang diunggah: {documentName}
        </p>
      </div>
    </div>
  );
}

export default SignerSelectionModal;