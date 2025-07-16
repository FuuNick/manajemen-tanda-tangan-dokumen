// src/components/DeleteConfirmationModal.jsx
import React from 'react';

function DeleteConfirmationModal({ onConfirm, onCancel, contactName }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center w-[90%] max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Konfirmasi Hapus</h2>
        <p className="text-gray-600 mb-6">
          Apakah Anda yakin ingin menghapus kontak <span className="font-semibold">{contactName}</span>?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
