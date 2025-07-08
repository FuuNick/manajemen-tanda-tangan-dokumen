// src/pages/feature-menu/Kontak.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../../service/supabase'; // Path sudah benar
import { Search, Edit, Trash2, Plus } from 'lucide-react'; // Menambah ikon Edit, Trash2, Plus
import { useNavigate } from 'react-router-dom';
import AddEditContactModal from '../../components/AddEditContactModal'; // Import komponen modal baru

function KontakPage() {
    const [kontak, setKontak] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true); // Loading untuk daftar utama
    const [error, setError] = useState(null); // Error untuk daftar utama
    const navigate = useNavigate();

    // State untuk modal tambah/edit kontak
    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [editingContact, setEditingContact] = useState(null); // null saat menambah, objek kontak saat edit
    const [modalLoading, setModalLoading] = useState(false); // Loading untuk operasi di modal
    const [modalError, setModalError] = useState(null); // Error untuk operasi di modal

    // Fungsi untuk mengambil data kontak dari Supabase
    async function fetchKontak() {
        setLoading(true);
        setError(null);
        try {
            // Asumsi ada tabel 'contacts' di Supabase Anda
            // dan memiliki kolom 'name' dan 'email'
            let query = supabase.from('contacts').select('*');

            if (searchTerm) {
                // Filter berdasarkan nama atau email jika ada searchTerm
                query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
            }

            const { data, error } = await query.order('name', { ascending: true }); // Urutkan berdasarkan nama

            if (error) {
                throw error;
            }
            setKontak(data);
        } catch (error) {
            console.error('Error fetching contacts:', error.message);
            setError('Gagal memuat kontak. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    }

    // Fungsi untuk menyimpan (menambah atau mengupdate) kontak baru
    async function handleSaveContact(contactData) {
        setModalLoading(true);
        setModalError(null); // Reset error dari modal
        try {
            let operation;
            if (editingContact) {
                // Jika sedang mengedit kontak yang sudah ada
                operation = supabase.from('contacts')
                    .update({ name: contactData.name, email: contactData.email })
                    .eq('id', editingContact.id); // Update berdasarkan ID kontak
            } else {
                // Jika menambah kontak baru
                operation = supabase.from('contacts')
                    .insert([{ name: contactData.name, email: contactData.email }]);
            }

            const { error } = await operation;

            if (error) {
                throw error;
            }

            // Tutup modal, reset state edit, dan perbarui daftar kontak
            setShowAddEditModal(false);
            setEditingContact(null);
            fetchKontak();
        } catch (error) {
            console.error('Error saving contact:', error.message);
            setModalError(error.message); // Set error untuk modal
        } finally {
            setModalLoading(false);
        }
    }

    // Fungsi untuk menghapus kontak
    async function handleDeleteContact(contactId) {
        // PERHATIAN: window.confirm adalah blocking. Untuk aplikasi produksi, gunakan modal konfirmasi kustom.
        if (window.confirm('Apakah Anda yakin ingin menghapus kontak ini?')) {
            setLoading(true); // Tampilkan loading di daftar utama
            try {
                const { error } = await supabase.from('contacts').delete().eq('id', contactId);
                if (error) {
                    throw error;
                }
                fetchKontak(); // Perbarui daftar kontak setelah penghapusan
            } catch (error) {
                console.error('Error deleting contact:', error.message);
                setError('Gagal menghapus kontak: ' + error.message);
            } finally {
                setLoading(false);
            }
        }
    }

    // Fungsi untuk membuka modal dalam mode edit
    const handleEditClick = (contact) => {
        setEditingContact(contact); // Set kontak yang akan diedit
        setShowAddEditModal(true); // Tampilkan modal
    };

    // Fungsi untuk menutup modal dan mereset state yang terkait
    const handleCloseModal = () => {
        setShowAddEditModal(false);
        setEditingContact(null); // Pastikan editingContact direset
        setModalError(null); // Reset error modal
        setModalLoading(false); // Reset loading modal
    };

    // Panggil fetchKontak saat komponen dimuat atau searchTerm berubah
    useEffect(() => {
        fetchKontak();
    }, [searchTerm]); // Re-fetch saat searchTerm berubah

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleBuatTandaTanganBaru = () => {
        console.log("Tombol 'Tanda Tangan Baru' ditekan!");
        // Navigasi ke halaman upload dokumen sebagai langkah pertama pembuatan tanda tangan
        navigate('/upload-dokumen'); // Sesuaikan dengan rute yang benar di aplikasi Anda
    };

    return (
        <div className="flex-1 p-8"> {/* Flex-1 agar mengisi sisa ruang setelah sidebar */}
            {/* Header Konten */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Daftar Kontak</h1>
                <button
                    onClick={handleBuatTandaTanganBaru}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                >
                    Tanda Tangan Baru
                </button>
            </div>

            {/* Bagian Kontak */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium text-gray-700">Kontak</h2>
                    <button
                        onClick={() => setShowAddEditModal(true)} // Tombol untuk membuka modal tambah kontak
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 flex items-center"
                    >
                        <Plus size={20} className="mr-2" /> Tambah Kontak
                    </button>
                </div>

                {/* Form Pencarian */}
                <div className="relative mb-6">
                    <input
                        type="text"
                        placeholder="Cari Nama / Email ......"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>

                {/* Area Daftar Kontak */}
                {loading && <p className="text-center text-gray-500">Memuat kontak...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                {!loading && !error && kontak.length === 0 && searchTerm === '' && (
                    <p className="text-center text-gray-500">Belum ada kontak yang ditambahkan. Klik "Tambah Kontak" untuk memulai.</p>
                )}
                {!loading && !error && kontak.length === 0 && searchTerm !== '' && (
                    <p className="text-center text-gray-500">Tidak ditemukan kontak dengan kata kunci "{searchTerm}".</p>
                )}

                {/* Tampilan Daftar Kontak */}
                {!loading && !error && kontak.length > 0 && (
                    <div className="space-y-4">
                        {kontak.map((contact) => (
                            <div key={contact.id} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-800">{contact.name}</p>
                                    <p className="text-sm text-gray-600">{contact.email}</p>
                                </div>
                                <div className="flex space-x-2 ml-4">
                                    <button
                                        onClick={() => handleEditClick(contact)} // Tombol Edit
                                        className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 transition-colors"
                                        title="Edit Kontak"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteContact(contact.id)} // Tombol Hapus
                                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
                                        title="Hapus Kontak"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Tambah/Edit Kontak */}
            {showAddEditModal && (
                <AddEditContactModal
                    isOpen={showAddEditModal}
                    onClose={handleCloseModal}
                    onSave={handleSaveContact}
                    initialData={editingContact} // Meneruskan data kontak jika dalam mode edit
                    isLoading={modalLoading}
                    error={modalError}
                />
            )}
        </div>
    );
}

export default KontakPage;