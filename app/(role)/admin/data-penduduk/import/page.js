"use client";

import { useState } from "react";
import { FileUp, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ImportPendudukPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && !selectedFile.name.endsWith(".xlsx") && !selectedFile.name.endsWith(".xls")) {
      alert("Hanya file Excel (.xlsx / .xls) yang diperbolehkan.");
      e.target.value = null;
      setFile(null);
      return;
    }

    setFile(selectedFile);
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
      console.log(result);

      if (!res.ok) {
        throw new Error(result.error || "Gagal mengimpor file.");
      }

      alert("✅ Import berhasil!");
      router.push("/admin/data-penduduk");
    } catch (err) {
      alert(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 bg-gray-100 p-8">
        <header>
          <h1 className="text-xl font-bold mb-3">Dashboard Data Kependudukan / Import Data</h1>
        </header>

        <form onSubmit={handleImport} className="bg-white rounded-lg p-6 mx-auto">
          <button type="button" onClick={() => router.back()} className="flex items-center text-base text-gray-500 mb-6">
            <ChevronLeft size={30} className="mr-1" />
            Kembali
          </button>
          <label className="block mb-4">
            <span className="text-gray-700 font-medium">Pilih File Excel (.xlsx atau .xls)</span>
            <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="mt-2 block w-full border border-gray-300 rounded px-3 py-2" />
          </label>

          <div className="flex justify-end">
            <button type="submit" disabled={loading} className={`flex items-center gap-2 px-4 py-2 text-white text-sm rounded-md ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}>
              <FileUp className="w-4 h-4" />
              {loading ? "Mengupload..." : "Import Sekarang"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
