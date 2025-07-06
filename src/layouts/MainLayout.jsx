// src/layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../service/supabase'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export default function MainLayout() {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user
      setUser(user)

      if (user?.id) {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()
        if (data) setUserProfile(data)
      }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="flex flex-1">
        <Sidebar user={user} userProfile={userProfile} />
        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
