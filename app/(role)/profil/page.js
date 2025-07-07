"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

import NamaLengkap from "@/components/form/NamaLengkap";
import TempatLahir from "@/components/form/TempatLahir";
import TanggalLahir from "@/components/form/TanggalLahir";
import JenisKelamin from "@/components/form/JenisKelamin";
import Alamat from "@/components/form/Alamat";
import Pekerjaan from "@/components/form/Pekerjaan";
import Dusun from "@/components/form/Dusun";
import RtRw from "@/components/form/RtRw";

export default function ProfilePage() {
  const router = useRouter();
  const [isEditable, setIsEditable] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    alamat: "",
    pekerjaan: "",
    dusun: "",
    rt_rw: "",
  });

  const fetchNamaFromLocal = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setForm((prev) => ({ ...prev, nama: user?.user?.name || "" }));
      }
    } catch (err) {
      console.error("Gagal mengambil nama dari localStorage:", err);
    }
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan");

      const res = await fetch("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Gagal mengambil data user");

      const data = await res.json();
      setForm({
        nama: data.user?.name || "",
        tempat_lahir: data.profile?.tempat_lahir || "",
        tanggal_lahir: data.profile?.tanggal_lahir || "",
        jenis_kelamin: data.profile?.jenis_kelamin || "",
        alamat: data.profile?.alamat || "",
        pekerjaan: data.profile?.pekerjaan || "",
        dusun: data.profile?.dusun || "",
        rt_rw: data.profile?.rt_rw || "",
      });

      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNamaFromLocal();
    fetchUser();
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
      //pop up berhasil
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
      //pop up gagal
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
            <p className="font-semibold text-black">{form.nama}</p>
          </div>
          <button onClick={handleToggleEdit} className="bg-[#2DB567] hover:bg-[#239653] text-white text-sm font-medium px-4 py-1.5 rounded">
            {isEditable ? "Simpan" : "Ubah Profil"}
          </button>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
          <NamaLengkap value={form.nama} onChange={handleChange} error={""} disabled={!isEditable} />
          <TempatLahir value={form.tempat_lahir} onChange={handleChange} disabled={!isEditable} />
          <TanggalLahir value={form.tanggal_lahir} onChange={handleChange} disabled={!isEditable} />
          <JenisKelamin value={form.jenis_kelamin} onChange={handleChange} disabled={!isEditable} />
          <Alamat value={form.alamat} onChange={handleChange} disabled={!isEditable} />
          <Pekerjaan value={form.pekerjaan} onChange={handleChange} disabled={!isEditable} />
          <Dusun value={form.dusun} onChange={handleChange} disabled={!isEditable} />
          <RtRw value={form.rt_rw} onChange={handleChange} disabled={!isEditable} />
        </form>

        {!isEditable && (
          <div className="flex justify-end mt-8">
            <button onClick={handleLogout} className="bg-[#E74C3C] hover:bg-[#c0392b] text-white text-sm font-medium px-5 py-2 rounded">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
