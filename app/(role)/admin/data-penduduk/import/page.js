"use client";

import { useState } from "react";
import { FileUp, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

function SuccessPopup({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 text-center shadow-lg">
        <h2 className="text-[#27AE60] text-2xl font-bold mb-4">Import data berhasil!</h2>
        <p className="text-gray-700 mb-6">Proses impor data kependudukan telah berhasil. Data telah tersimpan dalam sistem.</p>
        <button onClick={onClose} className="bg-[#27AE60] text-white px-4 py-2 rounded hover:bg-green-600">
          Tutup
        </button>
      </div>
    </div>
  );
}

function ErrorPopup({ message, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 text-center shadow-lg">
        <h2 className="text-red-600 text-2xl font-bold mb-4">Import data gagal!</h2>
        <p className="text-gray-700 mb-6">{message || "Gagal mengimpor data kependudukan. Mohon pastikan file sesuai dengan format yang ditentukan."}</p>
        <button onClick={onClose} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Tutup
        </button>
      </div>
    </div>
  );
}

export default function ImportPendudukPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && !selectedFile.name.endsWith(".xlsx") && !selectedFile.name.endsWith(".xls")) {
      setErrorMessage("Hanya file Excel (.xlsx / .xls) yang diperbolehkan.");
      setFile(null);
      e.target.value = null;
      return;
    }

    setFile(selectedFile);
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage("Pilih file Excel terlebih dahulu.");
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
      if (!res.ok) throw new Error(result.error || "Gagal mengimpor file.");

      setShowSuccess(true);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="min-h-full p-8">
        <header>
          <h2 className="sm:text-2xl text-base font-semibold mb-4">Data Kependudukan / Import Data</h2>
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
            <button type="submit" disabled={loading} className={`flex items-center gap-2 px-4 py-2 text-white text-sm rounded-md ${loading ? "bg-gray-400" : "bg-[#27AE60] hover:bg-green-600"}`}>
              <FileUp className="w-4 h-4" />
              {loading ? "Mengupload..." : "Import Sekarang"}
            </button>
          </div>
        </form>
      </div>

      {showSuccess && (
        <SuccessPopup
          onClose={() => {
            setShowSuccess(false);
            router.push("/admin/data-penduduk");
          }}
        />
      )}

      {errorMessage && <ErrorPopup message={errorMessage} onClose={() => setErrorMessage("")} />}
    </div>
  );
}
