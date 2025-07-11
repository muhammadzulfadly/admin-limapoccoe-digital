"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ImportPendudukPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Pilih file Excel terlebih dahulu.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("/api/population/import", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Gagal mengimpor file.");
      }

      alert("Data berhasil diimpor.");
      router.push("/admin/data-penduduk"); // kembali ke dashboard
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-100 h-full">
      <h1 className="text-xl font-bold mb-6">Import Data Kependudukan</h1>

      <form onSubmit={handleImport} className="bg-white p-6 rounded shadow-md max-w-xl">
        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Pilih File Excel (.xlsx)</span>
          <input
            type="file"
            accept=".xls,.xlsx"
            onChange={handleFileChange}
            className="mt-2 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 text-white rounded-md ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          <Upload className="w-4 h-4" />
          {loading ? "Mengupload..." : "Import Sekarang"}
        </button>
      </form>
    </div>
  );
}
