import { useRef, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Settings, User as UserIcon, UploadCloud } from 'lucide-react'

export default function Navbar({ user, userProfile, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  const name = userProfile?.name || user?.user_metadata?.name || 'Pengguna'
  const email = user?.email || 'user@example.com'
  const avatarRaw = userProfile?.photo_url?.trim() || user?.user_metadata?.avatar_url?.trim()

  const avatar = avatarRaw
    ? `${avatarRaw}?v=${Date.now()}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="bg-white shadow px-6 py-4 flex items-center justify-between relative">
      <h1 className="text-2xl font-bold text-green-600 font-serif tracking-wide">Signature</h1>
      <div className="flex items-center space-x-4 relative">
        <button
          onClick={() => navigate('/upload')}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition"
        >
          <UploadCloud size={16} />
          Upload Dokumen
        </button>
        <div className="relative" ref={dropdownRef}>
          <img
            src={avatar}
            alt="Profile"
            className="w-8 h-8 rounded-full cursor-pointer object-cover"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-md z-50 transition ease-in-out duration-200">
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-medium text-gray-800">{name}</p>
                <p className="text-xs text-gray-500 truncate">{email}</p>
              </div>
              <ul className="py-1">
                <li>
                  <Link
                    to="/home/akunsaya"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <UserIcon size={16} className="mr-2" />
                    Akun Saya
                  </Link>
                </li>
                <li>
                  <Link
                    to="/home/pengaturan"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings size={16} className="mr-2" />
                    Pengaturan
                  </Link>
                </li>
                <li>
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
