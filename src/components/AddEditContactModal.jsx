// src/components/AddEditContactModal.jsx

import React, { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react'; // Untuk ikon tutup modal

function AddEditContactModal({ isOpen, onClose, onSave, initialData, isLoading, error }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [formError, setFormError] = useState('');

    // Mengisi form saat modal dibuka dalam mode edit atau mereset saat menambah baru
    useEffect(() => {
        if (isOpen) { // Hanya jalankan saat modal terbuka
            if (initialData) {
                // Mode Edit: Isi form dengan data awal
                setName(initialData.name || '');
                setEmail(initialData.email || '');
            } else {
                // Mode Tambah: Reset form
                setName('');
                setEmail('');
            }
            setFormError(''); // Reset error form setiap kali modal dibuka
        }
    }, [isOpen, initialData]); // Dependensi: modal terbuka atau data awal berubah

    // Validasi form dasar
    const validateForm = () => {
        if (!name.trim()) {
            setFormError('Nama tidak boleh kosong.');
            return false;
        }
        if (!email.trim()) {
            setFormError('Email tidak boleh kosong.');
            return false;
        }
        // Validasi format email sederhana
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setFormError('Format email tidak valid.');
            return false;
        }
        setFormError(''); // Kosongkan error jika valid
        return true;
    };

    // Handle submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSave({ name, email }); // Panggil fungsi onSave dari parent
        }
    };

    if (!isOpen) return null; // Jangan render modal jika tidak terbuka

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Tutup"
                >
                    <XCircle size={24} /> {/* Ikon X untuk menutup */}
                </button>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    {initialData ? 'Edit Kontak' : 'Tambah Kontak Baru'}
                </h2>

                <form onSubmit={handleSubmit}>
                    {formError && <p className="text-red-500 text-sm mb-4">{formError}</p>}
                    {/* Menampilkan error dari operasi Supabase (jika ada) */}
                    {error && <p className="text-red-500 text-sm mb-4">Error: {error}</p>} 

                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                            Nama:
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isLoading} // Nonaktifkan input saat loading
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading} // Nonaktifkan input saat loading
                        />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                            disabled={isLoading} // Nonaktifkan tombol saat loading
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading} // Nonaktifkan tombol saat loading
                        >
                            {isLoading ? 'Menyimpan...' : initialData ? 'Simpan Perubahan' : 'Tambah'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddEditContactModal;