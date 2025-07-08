// src/main.jsx

    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import './index.css';

    // Import komponen dan fungsi dari React Router DOM
    import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

    // Import komponen-komponen halaman dan layout Anda
    // Path ke halaman Kontak Anda: src/pages/feature-menu/Kontak.jsx
    import KontakPage from './pages/feature-menu/Kontak.jsx';

    // Path ke layout utama Anda: src/layouts/MainLayout.jsx (perhatikan 'layouts' huruf kecil)
    import MainLayout from './layouts/MainLayout.jsx'; 

    // Komponen Autentikasi (berada di src/pages/auth/)
    import Guest from './pages/auth/Guest.jsx';
    import Login from './pages/auth/Login.jsx';
    import Register from './pages/auth/Register.jsx';

    // Komponen Fitur (berada di src/pages/feature-menu/)
    import UploadPage from './pages/feature-menu/UploadPage.jsx';
    import ChooseSignerPage from './pages/feature-menu/ChooseSignerPage.jsx';
    import DownloadDocumentPage from './pages/feature-menu/DownloadDocumentPage.jsx';

    // Import komponen halaman sidebar lainnya sesuai struktur Anda
    // Contoh:
    import AkunSayaPage from './pages/feature-menu/AkunSaya.jsx';
    import DashboardPage from './pages/feature-menu/Dashboard.jsx';
    import InboxPage from './pages/feature-menu/Inbox.jsx';
    import KeamananPage from './pages/feature-menu/Keamanan.jsx';
    import OrganisasiPage from './pages/feature-menu/Organisasi.jsx';
    import PengaturanPage from './pages/feature-menu/Pengaturan.jsx';
    import TerkirimPage from './pages/feature-menu/Terkirim.jsx';
    import TertandaTanganPage from './pages/feature-menu/TertandaTangan.jsx';
    import TugasAkhirPage from './pages/feature-menu/TugasAkhir.jsx';


    // --- Definisi Rute Aplikasi Anda ---
    const router = createBrowserRouter([
      {
        // Ini adalah rute root utama untuk halaman tamu/autentikasi (tanpa MainLayout)
        path: '/',
        element: <Guest />, // Halaman landing utama untuk pengguna yang belum login
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      // --- Rute yang menggunakan MainLayout (untuk pengguna yang sudah login) ---
      {
        // Rute ini adalah "parent" untuk semua rute yang memerlukan layout aplikasi utama
        // dan diasumsikan memerlukan autentikasi.
        path: '/', // Ini akan menangani rute dasar '/' untuk pengguna yang sudah login
        element: <MainLayout />, // MainLayout Anda yang punya Sidebar dan Navbar
        children: [
          {
            // Rute default untuk pengguna yang sudah login (misalnya Dashboard)
            index: true,
            element: <DashboardPage />, // Menggunakan komponen DashboardPage dari feature-menu
          },
          // Rute-rute lain yang akan dirender di dalam <Outlet /> dari MainLayout
          // Ini adalah rute untuk menu di Sidebar Anda:
          {
            path: 'kontak', // Menuju /kontak
            element: <KontakPage />,
          },
          {
            path: 'upload-dokumen', // Menuju /upload-dokumen
            element: <UploadPage />,
          },
          {
            path: 'choose-signer', // Menuju /choose-signer
            element: <ChooseSignerPage />,
          },
          {
            path: 'download', // Menuju /download
            element: <DownloadDocumentPage />,
          },
          // Tambahkan rute untuk menu sidebar lainnya sesuai struktur Anda
          { path: 'akunsaya', element: <AkunSayaPage /> },
          { path: 'keamanan', element: <KeamananPage /> },
          { path: 'organisasi', element: <OrganisasiPage /> },
          { path: 'tugas-akhir', element: <TugasAkhirPage /> },
          { path: 'terkirim', element: <TerkirimPage /> },
          { path: 'inbox', element: <InboxPage /> },
          { path: 'tertandatangani', element: <TertandaTanganPage /> },
          { path: 'pengaturan', element: <PengaturanPage /> },
        ],
      },
      // Rute 404 (Opsional) - untuk URL yang tidak cocok dengan rute manapun
      {
        path: '*',
        element: <div>404 Halaman Tidak Ditemukan</div>,
      },
    ]);

    // --- Merender Aplikasi React ---
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <RouterProvider router={router} /> {/* Menggunakan RouterProvider dengan router yang sudah didefinisikan */}
      </React.StrictMode>,
    );