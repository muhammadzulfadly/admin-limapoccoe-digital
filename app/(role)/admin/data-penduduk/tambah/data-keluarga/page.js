"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Import semua komponen form
import Nik from "@/components/form/Nik";
import StatusHubungan from "@/components/form/StatusHubungan";
import NamaLengkap from "@/components/form/NamaLengkap";
import JenisKelamin from "@/components/form/JenisKelamin";
import TempatLahir from "@/components/form/TempatLahir";
import TanggalLahir from "@/components/form/TanggalLahir";
import Agama from "@/components/form/Agama";
import Pekerjaan from "@/components/form/Pekerjaan";
import Pendidikan from "@/components/form/Pendidikan";
import StatusPerkawinan from "@/components/form/StatusPerkawinan";
import NamaAyah from "@/components/form/NamaAyah";
import NamaIbu from "@/components/form/NamaIbu";
import Bpjs from "@/components/form/Bpjs";

export default function TambahKeluargaPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nik: "",
    statusHubungan: "",
    name: "",
    jenisKelamin: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    agama: "",
    pekerjaan: "",
    pendidikan: "",
    statusPerkawinan: "",
    ayah: "",
    ibu: "",
    bpjs: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = ({ name, value }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBatal = () => {
    router.back();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/population", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setErrors(errorData.errors || {});
        setLoading(false);
        return;
      }

      router.push("/admin/data-penduduk/tambah");
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-10">
      <h1 className="text-lg font-semibold text-black mb-6">Tambah Anggota Keluarga</h1>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mb-10">
        <Nik value={form.nik} onChange={handleChange} error={errors.nik} />
        <StatusHubungan value={form.statusHubungan} onChange={handleChange} error={errors.statusHubungan} />

        <NamaLengkap value={form.name} onChange={handleChange} error={errors.name} />
        <JenisKelamin value={form.jenisKelamin} onChange={handleChange} error={errors.jenisKelamin} />

        <TempatLahir value={form.tempat_lahir} onChange={handleChange} error={errors.tempat_lahir} />
        <TanggalLahir value={form.tanggal_lahir} onChange={handleChange} error={errors.tanggal_lahir} />

        <Agama value={form.agama} onChange={handleChange} error={errors.agama} />
        <Pekerjaan value={form.pekerjaan} onChange={handleChange} error={errors.pekerjaan} />

        <Pendidikan value={form.pendidikan} onChange={handleChange} error={errors.pendidikan} />
        <StatusPerkawinan value={form.statusPerkawinan} onChange={handleChange} error={errors.statusPerkawinan} />

        <NamaAyah value={form.ayah} onChange={handleChange} error={errors.ayah} />
        <NamaIbu value={form.ibu} onChange={handleChange} error={errors.ibu} />

        <Bpjs value={form.bpjs} onChange={handleChange} error={errors.bpjs} />
      </form>

      {/* Tombol Aksi */}
      <div className="flex justify-between">
        <button type="button" onClick={handleBatal} className="bg-red-600 text-white text-sm font-semibold px-6 py-2 rounded-md hover:bg-red-700 transition">
          Batal
        </button>
        <button type="submit" disabled={loading} onClick={handleSubmit} className="bg-green-600 text-white text-sm font-semibold px-6 py-2 rounded-md hover:bg-green-700 transition">
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  );
}
