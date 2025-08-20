"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, UploadCloud } from "lucide-react";

import AngkaHuruf, { validateAngkaHuruf } from "@/components/forms/AngkaHuruf";
import KategoriInformasi, { validateKategoriInformasi } from "@/components/forms/KategoriInformasi";
import Deskripsi, { validateDeskripsi } from "@/components/forms/Deskripsi";

export default function TambahInformasiDesa() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    file: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [popupSuccess, setPopupSuccess] = useState(false);
  const [popupError, setPopupError] = useState({ show: false, message: "" });

  useEffect(() => {
    if (popupSuccess) {
      const timeout = setTimeout(() => {
        router.push("/admin/informasi-desa");
      }, 1800);

      return () => clearTimeout(timeout);
    }
  }, [popupSuccess]);

  const handleChange = ({ name, value }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setErrors((prev) => ({ ...prev, file: "Format harus JPG, JPEG, atau PNG." }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, file: "Ukuran maksimal 2MB." }));
      return;
    }

    setForm((prev) => ({ ...prev, file }));
    setErrors((prev) => ({ ...prev, file: "" }));
  };

  const validate = () => {
    const newErrors = {
      title: validateAngkaHuruf(form.title),
      category: validateKategoriInformasi(form.category),
      description: validateDeskripsi(form.description),
      file: !form.file ? "Upload foto wajib." : "",
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((err) => !err);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("judul", form.title);
      formData.append("kategori", form.category);
      formData.append("konten", form.description);
      if (form.file) formData.append("gambar", form.file);

      const res = await fetch("/api/information", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setPopupSuccess(true);
      } else {
        const json = await res.json();
        setPopupError({ show: true, message: json?.message || "Gagal menyimpan data. Silakan coba lagi." });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full p-8">
      <h2 className="sm:text-2xl text-base font-semibold mb-4">Informasi Desa / Tambah Baru</h2>

      <div className="bg-white rounded-lg p-6 mx-auto">
        <button type="button" onClick={() => router.back()} className="flex items-center text-base text-gray-500 mb-6">
          <ChevronLeft size={30} className="mr-1" /> Kembali
        </button>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AngkaHuruf name="title" value={form.title} onChange={handleChange} error={errors.title} label="Judul" />
          <KategoriInformasi name="category" value={form.category} onChange={handleChange} error={errors.category} />
          <Deskripsi name="description" value={form.description} onChange={handleChange} error={errors.description} label="Deskripsi Informasi" />

          <div className="col-span-1">
            <p className="text-sm font-semibold text-gray-500">
              Upload Foto <span className="text-red-500">*</span>
            </p>
            <label htmlFor="file" className="min-h-[100px] mt-1 flex flex-col justify-center items-center text-center cursor-pointer border-dashed border-[#384EB7-30] bg-[#F0FFF6] w-full border rounded px-4 py-5 text-sm hover:bg-green-100">
              <UploadCloud size={30} className="mb-2 text-[#27AE60]" />
              <span className="text-[#27AE60] font-semibold">Upload Foto</span>
              <p className="text-xs text-gray-500 mt-1">Format: JPG, JPEG, PNG. Maks 2MB</p>
              {form.file && <p className="mt-2 text-sm text-gray-600">File: {form.file.name}</p>}
              {errors.file && <p className="text-sm text-red-500 mt-1">{errors.file}</p>}
            </label>
            <input type="file" id="file" name="file" onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button type="submit" disabled={loading} className="bg-[#27AE60] hover:bg-green-600 text-white text-sm px-6 py-2 rounded">
              {loading ? "Menyimpan..." : "Tambah Informasi"}
            </button>
          </div>
        </form>
      </div>
      {popupSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
            <h2 className="text-[#27AE60] text-2xl font-bold mb-4">Berhasil</h2>
            <p className="text-gray-700 mb-6">Informasi Baru telah berhasil disimpan ke dalam sistem.</p>
          </div>
        </div>
      )}

      {popupError.show && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
            <h2 className="text-red-600 text-2xl font-bold mb-4">Gagal Menyimpan</h2>
            <p className="text-gray-700 mb-6">{popupError.message}</p>
            <button onClick={() => setPopupError({ show: false, message: "" })} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
