"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

import NamaLengkap from "@/components/form/NamaLengkap";

export default function ProfilePage() {
  const router = useRouter();
  const [isEditable, setIsEditable] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSuccessLogout, setShowSuccessLogout] = useState(false);

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
      // TODO: simpan ke API
    }
    setIsEditable(!isEditable);
  };

  return (
    <div className="min-h-screen bg-[#f1f4f9] px-4 py-10 md:px-20">
      <h1 className="text-xl font-bold text-black mb-4">Profil</h1>
      <div className="bg-white rounded-lg p-6 shadow relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#2DB567] flex items-center justify-center">
              <User className="text-white" size={24} />
            </div>
            <p className="font-semibold text-black">{form.name}</p>
          </div>
          <button
            onClick={handleToggleEdit}
            className="bg-[#2DB567] hover:bg-[#239653] text-white text-sm font-medium px-4 py-1.5 rounded"
          >
            {isEditable ? "Simpan" : "Ubah Profil"}
          </button>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
          <NamaLengkap value={form.name} onChange={handleChange} error={""} disabled={true} />
        </form>

        {!isEditable && (
          <div className="flex justify-end mt-8">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="bg-[#E74C3C] hover:bg-[#c0392b] text-white text-sm font-medium px-5 py-2 rounded"
            >
              Logout
            </button>
          </div>
        )}
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
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-1/2 border border-red-500 text-red-500 py-1.5 rounded hover:bg-red-50"
              >
                kembali
              </button>
              <button
                onClick={handleLogout}
                className="w-1/2 bg-red-500 text-white py-1.5 rounded hover:bg-red-600"
              >
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
            <h3 className="text-green-600 text-2xl font-bold mb-2">Berhasil Logout</h3>
            <p className="text-sm text-gray-800">Anda sudah berhasil logout.</p>
          </div>
        </div>
      )}
    </div>
  );
}
