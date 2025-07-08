// src/layouts/MainLayout.jsx
import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

export default function MainLayout() {
  // Data dummy user
  const [user] = useState({
    email: 'dummy@example.com',
    user_metadata: {
      name: 'Pengguna Dummy',
      avatar_url: 'https://ui-avatars.com/api/?name=Dummy'
    }
  })

  const handleLogout = () => {
    alert('Logout clicked (dummy)')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} />
      <div className="flex flex-col flex-1">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}