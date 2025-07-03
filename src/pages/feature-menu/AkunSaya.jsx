import React, { useState } from "react";
import {
  FaUser,
  FaShieldAlt,
  FaBuilding,
  FaClock,
  FaHome,
  FaPaperPlane,
  FaInbox,
  FaCheckCircle,
  FaAddressBook,
  FaCog,
  FaBell,
} from "react-icons/fa";

export default function AkunSaya() {
  const [activeMenu, setActiveMenu] = useState("akun");
  const [form, setForm] = useState({
    name: "Fernanda rahmansyah",
    email: "admin@web.app",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    newPassword: "",
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated!");
  };

  return (
    <div className="w-screen h-screen flex font-[Poppins]">
      {/* Sidebar */}
      <div className="w-[250px] bg-[#E9ECEF] p-4 flex flex-col justify-between">
        <div>
          {/* Info Free Plan */}
          <div className="flex items-center gap-2 mt-[65px] mb-6">
            <div className="w-8 h-8 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-sm text-red-600 font-bold leading-tight">
                Free
              </p>
              <p className="text-xs text-gray-600">Manajemen TTD</p>
            </div>
          </div>

          {/* Menu Profile */}
          <div className="mb-4">
            <h2 className="font-semibold text-lg mb-2">Profile</h2>
            <SidebarButton
              label="Akun Saya"
              icon={<FaUser />}
              isActive={activeMenu === "akun"}
              onClick={() => setActiveMenu("akun")}
            />
            <SidebarButton
              label="Keamanan"
              icon={<FaShieldAlt />}
              isActive={activeMenu === "keamanan"}
              onClick={() => setActiveMenu("keamanan")}
            />
            <SidebarButton
              label="Organisasi"
              icon={<FaBuilding />}
              isActive={activeMenu === "organisasi"}
              onClick={() => setActiveMenu("organisasi")}
            />
          </div>

          {/* Menu Aktivitas */}
          <div className="mb-4">
            <h2 className="font-semibold text-lg mb-2">Aktivitas</h2>
            <SidebarButton
              label="Tugas Terakhir"
              icon={<FaClock />}
              isActive={activeMenu === "tugas"}
              onClick={() => setActiveMenu("tugas")}
            />
          </div>

          {/* Menu TTD */}
          <div>
            <h2 className="font-semibold text-lg mb-2">Tanda Tangan</h2>
            <SidebarButton label="Dashboard" icon={<FaHome />} />
            <SidebarButton label="Terkirim" icon={<FaPaperPlane />} />
            <SidebarButton label="Inbox" icon={<FaInbox />} />
            <SidebarButton label="Tertanda" icon={<FaCheckCircle />} />
            <SidebarButton label="Kontak" icon={<FaAddressBook />} />
            <SidebarButton label="Pengaturan" icon={<FaCog />} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-[#F8F9FA]">
        {/* Topbar */}
        <div className="w-screen h-[61px] bg-[#E9ECEF] flex justify-between items-center px-4 shadow-md fixed top-0 left-0 z-10">
          <span className="text-black text-3xl font-normal">Signature</span>
          <div className="flex items-center gap-3 pr-4">
            <button className="text-[#1777FF] border border-[#1777FF] rounded-full px-3 text-sm">
              + Buat
            </button>
            <FaBell className="text-[#1777FF] text-xl" />
            <div className="w-6 h-6 bg-green-500 rounded-full"></div>
          </div>
        </div>

        {/* Page Content */}
        <div className="pt-[80px] px-8">
          {activeMenu === "akun" && (
            <div className="max-w-3xl bg-white shadow border p-6 rounded mx-auto">
              <h2 className="text-xl font-semibold border-b pb-2 mb-6">
                Profile
              </h2>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Foto Profil */}
                <div className="flex justify-center items-start">
                  <img
                    src={
                      form.photo
                        ? URL.createObjectURL(form.photo)
                        : "https://via.placeholder.com/150"
                    }
                    alt="Profile"
                    className="w-24 h-24 object-cover rounded-full border shadow"
                  />
                </div>

                {/* Input Form */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium">Nama</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Password lama
                    </label>
                    <input
                      type="password"
                      name="oldPassword"
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Password baru
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Konfirmasi password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Ubah foto profile
                    </label>
                    <input
                      type="file"
                      name="photo"
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white rounded px-6 py-2 hover:bg-blue-700"
                    >
                      Update Profile
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SidebarButton({ label, icon, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-sm mb-2 px-2 py-1 rounded-md transition-all ${
        isActive
          ? "bg-white font-semibold text-[#1777FF]"
          : "text-black hover:bg-white"
      }`}
    >
      {icon} {label}
    </button>
  );
}
