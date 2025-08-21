"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";

import AngkaHuruf, { validateAngkaHuruf } from "@/components/forms/AngkaHuruf";

export default function TambahInformasiDesa() {
  const router = useRouter();

  const [form, setForm] = useState({
    video: "",
    panduanMasyarakat: "",
    panduanPemerintah: "",
  });

  const [dataIds, setDataIds] = useState({
    video: null,
    panduanMasyarakat: null,
    panduanPemerintah: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [popupSuccess, setPopupSuccess] = useState(false);
  const [popupError, setPopupError] = useState({ show: false, message: "" });

  const fetchPengumuman = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/information", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();

      if (res.ok) {
        const pengumuman = result.data.filter((item) => item.kategori?.toLowerCase() === "pengumuman");

        const videoItem = pengumuman.find((item) => item.judul === "Tautan Video Profil Desa");
        const panduanMasyarakatItem = pengumuman.find((item) => item.judul === "Tautan Panduan Pengguna Masyarakat");
        const panduanPemerintahItem = pengumuman.find((item) => item.judul === "Tautan Panduan Pengguna Pemerintah");

        setForm({
          video: videoItem?.konten || "",
          panduanMasyarakat: panduanMasyarakatItem?.konten || "",
          panduanPemerintah: panduanPemerintahItem?.konten || "",
        });

        setDataIds({
          video: videoItem?.id || null,
          panduanMasyarakat: panduanMasyarakatItem?.id || null,
          panduanPemerintah: panduanPemerintahItem?.id || null,
        });
      } else {
        console.error(result.message || "Gagal mengambil data pengumuman.");
      }
    } catch (err) {
      console.error("Terjadi kesalahan:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPengumuman();
  }, []);

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

  const validate = () => {
    const newErrors = {
      video: validateAngkaHuruf(form.video),
      panduanMasyarakat: validateAngkaHuruf(form.panduanMasyarakat),
      panduanPemerintah: validateAngkaHuruf(form.panduanPemerintah),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((err) => !err);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const labels = {
        video: "Tautan Video Profil Desa",
        panduanMasyarakat: "Tautan Panduan Pengguna Masyarakat",
        panduanPemerintah: "Tautan Panduan Pengguna Pemerintah",
      };

      for (const key of Object.keys(form)) {
        const id = dataIds[key];
        const payload = {
          judul: labels[key],
          kategori: "pengumuman",
          konten: form[key],
        };

        const url = id ? `/api/information/${id}` : `/api/information`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const result = await res.json();
        if (!res.ok) {
          throw new Error(result?.error || "Gagal menyimpan data.");
        }
      }

      setPopupSuccess(true);
    } catch (err) {
      console.error(err);
      setPopupError({
        show: true,
        message: err.message || "Terjadi kesalahan saat menyimpan.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full p-8">
      <h2 className="sm:text-2xl text-base font-semibold mb-4">Informasi Desa / Tautan</h2>

      <div className="bg-white rounded-lg p-6 mx-auto">
        <button type="button" onClick={() => router.back()} className="flex items-center text-base text-gray-500 mb-6">
          <ChevronLeft size={30} className="mr-1" /> Kembali
        </button>

        <form onSubmit={handleSubmit} className="gap-6 space-y-4">
          <AngkaHuruf name="video" value={form.video} onChange={handleChange} error={errors.video} label="Tautan Video Profil Desa (Youtube)" />
          <AngkaHuruf name="panduanMasyarakat" value={form.panduanMasyarakat} onChange={handleChange} error={errors.panduanMasyarakat} label="Tautan Panduan Pengguna (Masyarakat)" />
          <AngkaHuruf name="panduanPemerintah" value={form.panduanPemerintah} onChange={handleChange} error={errors.panduanPemerintah} label="Tautan Panduan Pengguna (Pemerintah)" />

          <div className="md:col-span-2 flex justify-end">
            <button type="submit" disabled={loading} className="bg-[#27AE60] hover:bg-green-600 text-white text-sm px-6 py-2 rounded">
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>

      {popupSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
            <h2 className="text-[#27AE60] text-2xl font-bold mb-4">Berhasil</h2>
            <p className="text-gray-700 mb-6">Data berhasil disimpan atau diperbarui.</p>
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
