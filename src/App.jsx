import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Public pages
import Guest from './pages/auth/Guest'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Layout & Protected
import PrivateRoute from './components/PrivateRoute'
import MainLayout from './layouts/MainLayout'

// Feature menu inside layout
import AkunSaya from './pages/feature-menu/AkunSaya'
import Dashboard from './pages/feature-menu/Dashboard'
import Kontak from './pages/feature-menu/Kontak'
import Keamanan from './pages/feature-menu/Keamanan'
import Organisasi from './pages/feature-menu/Organisasi'
import TugasAkhir from './pages/feature-menu/TugasAkhir'
import Terkirim from './pages/feature-menu/Terkirim'
import Inbox from './pages/feature-menu/Inbox'
import TertandaTangan from './pages/feature-menu/TertandaTangan'
import Pengaturan from './pages/feature-menu/Pengaturan'

// Signature flow (di luar layout)
import UploadPage from './signatures/UploadPage'
import ChooseSignerPage from './signatures/ChooseSignerPage'
import DownloadDocumentPage from './signatures/DownloadDocumentPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout dengan sidebar/navbar */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="akunsaya" element={<AkunSaya />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="kontak" element={<Kontak />} />
          <Route path="keamanan" element={<Keamanan />} />
          <Route path="organisasi" element={<Organisasi />} />
          <Route path="tugas-akhir" element={<TugasAkhir />} />
          <Route path="terkirim" element={<Terkirim />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="tertandatangan" element={<TertandaTangan />} />
          <Route path="pengaturan" element={<Pengaturan />} />
        </Route>

        {/* Halaman tanda tangan dokumen - HALAMAN PENUH (tidak pakai MainLayout) */}
        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <UploadPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/choose-signer/"
          element={
            <PrivateRoute>
              <ChooseSignerPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/download-document/:documentId"
          element={
            <PrivateRoute>
              <DownloadDocumentPage />
            </PrivateRoute>
          }
        />

        {/* Public pages */}
        <Route path="/" element={<Guest />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}
