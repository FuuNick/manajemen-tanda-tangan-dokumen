// src/pages/feature-menu/Kontak.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../../service/supabase';
import { Search, Edit, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddEditContactModal from '../../components/AddEditContactModal';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal'; // 1. Import modal konfirmasi hapus

function KontakPage() {
    const [kontak, setKontak] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // State untuk modal tambah/edit
    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState(null);

    // 2. State untuk modal konfirmasi hapus
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingContact, setDeletingContact] = useState(null); // Menyimpan objek {id, name}

    // Fungsi untuk mengambil data kontak
    async function fetchKontak() {
        setLoading(true);
        setError(null);
        try {
            let query = supabase.from('contacts').select('*');
            if (searchTerm) {
                query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
            }
            const { data, error } = await query.order('name', { ascending: true });
            if (error) throw error;
            setKontak(data);
        } catch (error) {
            console.error('Error fetching contacts:', error.message);
            setError('Gagal memuat kontak. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    }

    // Fungsi untuk menyimpan kontak
    async function handleSaveContact(contactData) {
        setModalLoading(true);
        setModalError(null);
        try {
            const { error } = editingContact
                ? await supabase.from('contacts').update({ name: contactData.name, email: contactData.email }).eq('id', editingContact.id)
                : await supabase.from('contacts').insert([{ name: contactData.name, email: contactData.email }]);
            
            if (error) throw error;

            setShowAddEditModal(false);
            setEditingContact(null);
            fetchKontak();
        } catch (error) {
            console.error('Error saving contact:', error.message);
            setModalError(error.message);
        } finally {
            setModalLoading(false);
        }
    }
    
    // 3. Fungsi untuk membuka modal konfirmasi hapus
    const handleDeleteClick = (contact) => {
        setDeletingContact(contact); // Simpan info kontak yang akan dihapus
        setShowDeleteModal(true);   // Tampilkan modal
    };
    
    // 4. Fungsi yang menjalankan penghapusan setelah konfirmasi
    async function confirmDeleteContact() {
        if (!deletingContact) return;
        setLoading(true); // Tampilkan loading di daftar utama selama proses hapus
        try {
            const { error } = await supabase.from('contacts').delete().eq('id', deletingContact.id);
            if (error) {
                throw error;
            }
            setShowDeleteModal(false); // Tutup modal
            setDeletingContact(null);  // Reset state
            fetchKontak(); // Perbarui daftar kontak
        } catch (error) {
            console.error('Error deleting contact:', error.message);
            setError('Gagal menghapus kontak: ' + error.message);
            setShowDeleteModal(false); // Tetap tutup modal jika error
        } finally {
            // Loading akan di-set ke false oleh fetchKontak()
        }
    }

    // 5. Fungsi untuk membatalkan penghapusan
    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDeletingContact(null);
    };

    // Fungsi untuk membuka modal edit
    const handleEditClick = (contact) => {
        setEditingContact(contact);
        setShowAddEditModal(true);
    };
    
    const handleCloseModal = () => {
        setShowAddEditModal(false);
        setEditingContact(null);
        setModalError(null);
        setModalLoading(false);
    };
    
    useEffect(() => {
        fetchKontak();
    }, [searchTerm]);

    const handleSearchChange = (e) => setSearchTerm(e.target.value);
    const handleBuatTandaTanganBaru = () => navigate('/upload-dokumen');

    return (
        <div className="flex-1 p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Daftar Kontak</h1>
                <button
                    onClick={handleBuatTandaTanganBaru}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                >
                    Tanda Tangan Baru
                </button>
            </div>

            {/* Konten Utama */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium text-gray-700">Kontak</h2>
                    <button
                        onClick={() => setShowAddEditModal(true)}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 flex items-center"
                    >
                        <Plus size={20} className="mr-2" /> Tambah Kontak
                    </button>
                </div>

                <div className="relative mb-6">
                    <input
                        type="text"
                        placeholder="Cari Nama / Email ......"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>

                {/* Daftar Kontak */}
                {loading && <p className="text-center text-gray-500">Memuat kontak...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                {!loading && !error && kontak.length === 0 && (
                    <p className="text-center text-gray-500">
                        {searchTerm === '' ? 'Belum ada kontak.' : `Tidak ditemukan kontak untuk "${searchTerm}".`}
                    </p>
                )}
                {!loading && !error && kontak.length > 0 && (
                    <div className="space-y-4">
                        {kontak.map((contact) => (
                            <div key={contact.id} className="flex items-center p-3 bg-gray-50 rounded-lg border">
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-800">{contact.name}</p>
                                    <p className="text-sm text-gray-600">{contact.email}</p>
                                </div>
                                <div className="flex space-x-2 ml-4">
                                    <button
                                        onClick={() => handleEditClick(contact)}
                                        className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100"
                                        title="Edit Kontak"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(contact)} // 6. Ubah onClick untuk membuka modal
                                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
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

            {/* Render Modal Tambah/Edit */}
            {showAddEditModal && (
                <AddEditContactModal
                    isOpen={showAddEditModal}
                    onClose={handleCloseModal}
                    onSave={handleSaveContact}
                    initialData={editingContact}
                    isLoading={modalLoading}
                    error={modalError}
                />
            )}

            {/* 7. Render Modal Konfirmasi Hapus */}
            {showDeleteModal && (
                <DeleteConfirmationModal
                    onConfirm={confirmDeleteContact}
                    onCancel={cancelDelete}
                    contactName={deletingContact?.name}
                />
            )}
        </div>
    );
}

export default KontakPage;
