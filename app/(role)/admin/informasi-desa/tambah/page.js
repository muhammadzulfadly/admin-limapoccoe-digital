"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TambahInformasiPage() {
  const router = useRouter();

  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("");
  const [konten, setKonten] = useState("");
  const [gambar, setGambar] = useState(null); // ⬅️ untuk file foto
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!judul.trim()) {
      setError("Judul wajib diisi.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      // gunakan FormData untuk kirim file
      const formData = new FormData();
      formData.append("judul", judul);
      formData.append("kategori", kategori);
      formData.append("konten", konten);
      if (gambar) {
        formData.append("gambar", gambar); // ⬅️ file foto
      }

      const res = await fetch("/api/information", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // ❌ jangan set Content-Type manual, biarkan browser yang generate multipart boundary
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal menambahkan informasi.");
      } else {
        setSuccess("Informasi berhasil ditambahkan!");
        setJudul("");
        setKategori("");
        setKonten("");
        setGambar(null);

        // redirect opsional
        // router.push("/admin/informasi-desa");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mengirim data.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Tambah Informasi Desa</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label className="block font-medium">
            Judul <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block font-medium">Kategori</label>
          <input
            type="text"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block font-medium">Konten</label>
          <textarea
            value={konten}
            onChange={(e) => setKonten(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            rows="5"
          />
        </div>

        <div>
          <label className="block font-medium">Foto / Gambar</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setGambar(e.target.files[0])}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        {error && <p className="text-red-500 italic">{error}</p>}
        {success && <p className="text-green-600 italic">{success}</p>}

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}
