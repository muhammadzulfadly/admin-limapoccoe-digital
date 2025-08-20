"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import AngkaHuruf from "@/components/forms/AngkaHuruf";
import KategoriInformasi from "@/components/forms/KategoriInformasi";
import Deskripsi from "@/components/forms/Deskripsi";
import { ChevronLeft, UploadCloud } from "lucide-react";

export default function DetailInformasiPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isEditMode = searchParams.get("mode") === "edit";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("");
  const [konten, setKonten] = useState("");
  const [gambarBaru, setGambarBaru] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const [popupSuccess, setPopupSuccess] = useState(false);
  const [popupError, setPopupError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`/api/information/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();

        if (!res.ok) {
          setError(result.error || "Gagal mengambil detail informasi.");
        } else {
          setData(result.data);
          setJudul(result.data?.judul || "");
          setKategori(result.data?.kategori || "");
          setKonten(result.data?.konten || "");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat memuat detail.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  function imgUrlFromBackendPath(path) {
    if (!path) return null;
    const filename = path.split("/").pop();
    return `/api/information/photo/${filename}`;
  }

  function handlePickFile(e) {
    const file = e.target.files?.[0];
    setGambarBaru(file || null);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem("token");

    try {
      let res;

      if (gambarBaru) {
        const fd = new FormData();
        fd.append("judul", judul);
        fd.append("kategori", kategori);
        fd.append("konten", konten);
        fd.append("gambar", gambarBaru);

        res = await fetch(`/api/information/${id}`, {
          method: "POST", // selalu POST
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: fd,
        });
      } else {
        const payload = { judul, kategori, konten };
        res = await fetch(`/api/information/${id}`, {
          method: "POST", // selalu POST
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      const result = await res.json();
      if (!res.ok) {
        setPopupError(result.error || "Gagal menyimpan perubahan.");
        return;
      }

      setPopupSuccess(true);
      setTimeout(() => {
        router.push("/admin/informasi-desa");
      }, 1800);
    } catch (err) {
      setPopupError("Terjadi kesalahan saat menyimpan.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="p-6 italic text-gray-500">Memuat detail...</p>;
  if (error) return <p className="p-6 text-red-500 italic">{error}</p>;
  if (!data) return <p className="p-6 italic text-gray-500">Detail tidak ditemukan.</p>;

  return (
    <div className="min-h-full p-8">
      <h2 className="sm:text-2xl text-base font-semibold mb-4">Informasi Desa / {isEditMode ? "Edit Informasi" : "Detail Informasi"}</h2>

      <div className="bg-white rounded-lg p-6 mx-auto">
        <button type="button" onClick={() => router.back()} className="flex items-center text-base text-gray-500 mb-6">
          <ChevronLeft size={30} className="mr-1" /> Kembali
        </button>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AngkaHuruf name="judul" value={judul} onChange={({ value }) => setJudul(value)} disabled={!isEditMode} label="Judul" />
          <KategoriInformasi name="kategori" value={kategori} onChange={({ value }) => setKategori(value)} disabled={!isEditMode} />
          <Deskripsi name="konten" value={konten} onChange={({ value }) => setKonten(value)} disabled={!isEditMode} label="Deskripsi Informasi" />

          <div className="col-span-1">
            <p className="text-sm font-semibold text-gray-500">
              Upload Foto <span className="text-red-500 ml-0.5">*</span>
            </p>
            {!preview && data?.gambar && <img src={imgUrlFromBackendPath(data.gambar)} alt={judul} className="mt-2 max-w-full rounded border" />}
            {preview && <img src={preview} alt="Preview" className="mt-2 max-w-full rounded border" />}
            {isEditMode && (
              <label
                htmlFor="file"
                className="min-h-[100px] mt-1 flex flex-col justify-center items-center text-center cursor-pointer border-dashed border-[#384EB7-30] bg-[#F0FFF6] w-full border rounded px-4 py-5 text-sm hover:bg-green-100"
              >
                <UploadCloud size={30} className="mb-2 text-[#27AE60]" />
                <span className="text-[#27AE60] font-semibold">Upload Foto</span>
                <p className="text-xs text-gray-500 mt-1">Format: JPG, JPEG, PNG. Maks 10MB</p>
              </label>
            )}
            {isEditMode && <input type="file" id="file" name="file" onChange={handlePickFile} className="hidden" accept="image/*" />}
          </div>

          {isEditMode && (
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" disabled={saving} className="bg-[#27AE60] hover:bg-green-700 text-white text-sm px-6 py-2 rounded">
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Popup sukses */}
      {popupSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
            <h2 className="text-[#27AE60] text-2xl font-bold mb-4">Berhasil</h2>
            <p className="text-gray-700">Perubahan telah berhasil disimpan ke dalam sistem.</p>
          </div>
        </div>
      )}

      {/* Popup gagal */}
      {popupError && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
            <h2 className="text-red-600 text-2xl font-bold mb-4">Gagal Menyimpan</h2>
            <p className="text-gray-700 mb-6">{popupError}</p>
            <button onClick={() => setPopupError(null)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
