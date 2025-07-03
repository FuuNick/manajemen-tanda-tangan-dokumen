import { NavLink } from 'react-router-dom'
import {
  User as UserIcon,
  ShieldCheck,
  Users,
  FileText,
  Send,
  Inbox,
  PenTool,
  Contact,
  Settings
} from 'lucide-react'

export default function Sidebar({ user }) {
  const name = user?.user_metadata?.name || 'Pengguna'
  const avatar = user?.user_metadata?.avatar_url?.trim()
    ? user.user_metadata.avatar_url
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`

  return (
    <aside className="w-64 bg-white shadow-md p-4 flex flex-col">
      {/* Profile */}
      <div className="flex items-center space-x-3 mb-6">
        <img
          src={avatar}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover border"
        />
        <div>
          <span className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-1 rounded-full">
            Free
          </span>
          <div className="text-sm font-medium text-gray-700">{name}</div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="space-y-4">
        <MenuSection title="Profile">
          <MenuItem icon={<UserIcon size={18} />} text="Akun Saya" path="/akunsaya" />
          <MenuItem icon={<ShieldCheck size={18} />} text="Keamanan" path="/keamanan" />
          <MenuItem icon={<Users size={18} />} text="Organisasi" path="/organisasi" />
        </MenuSection>

        <MenuSection title="Aktivitas">
          <MenuItem icon={<FileText size={18} />} text="Tugas Akhir" path="/tugas-akhir" />
        </MenuSection>

        <MenuSection title="Tanda Tangan">
          <MenuItem icon={<PenTool size={18} />} text="Dashboard" path="/dashboard" />
          <MenuItem icon={<Send size={18} />} text="Terkirim" path="/terkirim" />
          <MenuItem icon={<Inbox size={18} />} text="Inbox" path="/inbox" />
          <MenuItem icon={<ShieldCheck size={18} />} text="Tertandatangani" path="/tertandatangani" />
          <MenuItem icon={<Contact size={18} />} text="Kontak" path="/kontak" />
          <MenuItem icon={<Settings size={18} />} text="Pengaturan" path="/pengaturan" />
        </MenuSection>
      </div>
    </aside>
  )
}

function MenuSection({ title, children }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase mb-1">{title}</h3>
      {children}
    </div>
  )
}

function MenuItem({ icon, text, path }) {
  return (
    <NavLink
      to={path}
      end
      className={({ isActive }) =>
        `flex items-center space-x-3 px-3 py-2 rounded-md transition font-medium text-sm ${
          isActive
            ? 'bg-green-600 text-white shadow'
            : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
        }`
      }
    >
      {icon}
      <span>{text}</span>
    </NavLink>
  )
}
