"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, ChevronLeft, LogOut } from "lucide-react";

import Huruf from "@/components/forms/Huruf";

export default function ProfilePage() {
  const router = useRouter();
  const [isEditable, setIsEditable] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSuccessLogout, setShowSuccessLogout] = useState(false);
  const [showSuccessEdit, setShowSuccessEdit] = useState(false);

  const [form, setForm] = useState({
    name: "",
  });

  const fetchNamaFromLocal = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setForm((prev) => ({
          ...prev,
          name: user?.name || "",
          username: user?.username || "",
        }));
      }
    } catch (err) {
      console.error("Gagal mengambil nama dari localStorage:", err);
    }
  };

  useEffect(() => {
    fetchNamaFromLocal();
  }, []);

  const handleChange = ({ name, value }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan");

      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Logout gagal.");
      }

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("expiresAt");
      window.dispatchEvent(new Event("storage"));

      setShowLogoutConfirm(false);
      setShowSuccessLogout(true);
      setTimeout(() => {
        router.push("/");
      }, 1800);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleToggleEdit = () => {
    if (isEditable) {
      setShowSuccessEdit(true);
      setTimeout(() => {
        setShowSuccessEdit(false);
      }, 1800);
    }
    setIsEditable(!isEditable);
  };

  return (
      <div className="min-h-full p-8">
        <h2 className="sm:text-2xl text-base font-semibold mb-4">Profil</h2>
        <div className="bg-white rounded-lg p-6 shadow relative">
          <button type="button" onClick={() => router.back()} className="flex items-center text-base text-gray-500 mb-6">
            <ChevronLeft size={30} className="mr-1" />
            Kembali
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            {/* Icon + Nama */}
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-[#27AE60] flex items-center justify-center">
                <User className="text-white" size={24} />
              </div>
              <p className="font-semibold text-black">{form.name}</p>
            </div>

            {/* Tombol Aksi */}
            <div className={`w-full sm:flex sm:items-center sm:gap-4 sm:w-auto grid gap-2 ${isEditable ? "grid-cols-1 justify-center" : "grid-cols-2"}`}>
              <button onClick={handleToggleEdit} className="bg-[#27AE60] hover:bg-green-600 text-white text-sm font-medium px-4 py-1.5 rounded w-full sm:w-auto whitespace-nowrap">
                {isEditable ? "Simpan" : "Ubah Profil"}
              </button>

              {!isEditable && (
                <button onClick={() => setShowLogoutConfirm(true)} className="bg-[#E74C3C] hover:bg-[#c0392b] text-white text-sm font-medium px-4 py-1.5 rounded flex items-center justify-center gap-2 w-full">
                  <LogOut size={16} />
                  Logout
                </button>
              )}
            </div>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
            <Huruf name="name" value={form.name} onChange={handleChange} error={""} disabled={!isEditable} label="Nama Lengkap" />
            <Huruf name="username" value={form.username} onChange={handleChange} error={""} disabled={!isEditable} label="Username" />
          </form>
        </div>

      {/* Konfirmasi Logout */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-6 py-8 w-[300px] text-center space-y-4">
            <div className="w-12 h-12 mx-auto flex items-center justify-center border-2 border-red-500 rounded-full">
              <span className="text-red-500 text-2xl font-bold">i</span>
            </div>
            <h3 className="text-xl font-bold text-black">Logout akun</h3>
            <p className="text-gray-700 text-sm">Apakah anda yakin ingin logout?</p>
            <div className="flex justify-between gap-4 mt-4">
              <button onClick={() => setShowLogoutConfirm(false)} className="w-1/2 border border-red-500 text-red-500 py-1.5 rounded hover:bg-red-50">
                kembali
              </button>
              <button onClick={handleLogout} className="w-1/2 bg-red-500 text-white py-1.5 rounded hover:bg-red-600">
                Ya logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up berhasil logout */}
      {showSuccessLogout && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-6 py-9 w-[280px] text-center animate-fade-in">
            <h3 className="text-[#27AE60] text-2xl font-bold mb-2">Berhasil Logout</h3>
            <p className="text-sm text-gray-800">Anda sudah berhasil logout.</p>
          </div>
        </div>
      )}

      {/* Pop-up berhasil ubah data */}
      {showSuccessEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-6 py-9 w-[280px] text-center animate-fade-in">
            <h3 className="text-[#27AE60] text-2xl font-bold mb-2">Berhasil!</h3>
            <p className="text-sm text-gray-800">Anda telah berhasil merubah profil.</p>
          </div>
        </div>
      )}
    </div>
  );
}
