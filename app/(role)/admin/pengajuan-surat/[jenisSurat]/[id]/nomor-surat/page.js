"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";

export default function InputNomorSuratPage() {
  const { jenisSurat, id } = useParams();
  const router = useRouter();

  const [nomorSurat, setNomorSurat] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [namaUser, setNamaUser] = useState("Memuat...");
  const [namaSurat, setNamaSurat] = useState("Memuat...");
  const [kodeSurat, setKodeSurat] = useState("Memuat...");
  const [slug, setSlug] = useState(null);

  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  useEffect(() => {
    const fetchSlug = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/letter", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        const found = data.jenis_surat?.find((item) => item.slug.toString() === jenisSurat);
        if (!found) throw new Error("Surat tidak ditemukan");
        setSlug(found.slug);
        setNamaSurat(found.nama_surat);
        setKodeSurat(found.kode_surat);
      } catch (err) {
        console.error("⚠️ Gagal mengambil slug:", err);
        setNamaSurat("Jenis Surat");
      }
    };

    fetchSlug();
  }, [jenisSurat]);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!slug || !id) return;

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/letter/${slug}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        const pengajuan = data.pengajuan_surat;
        setNamaUser(pengajuan?.data_surat?.nama || pengajuan?.user?.name || "Pengguna");
        setNomorSurat(pengajuan?.nomor_surat || "");
      } catch (err) {
        console.error("⚠️ Gagal mengambil detail pengajuan:", err);
        setNamaUser("Pengguna");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [slug, id]);

  const handleConfirm = (e) => {
    e.preventDefault();
    setShowConfirmPopup(true);
  };

  const handleSubmit = async () => {
    setErrorMsg("");
    setShowConfirmPopup(false);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/letter/${slug}/${id}/number`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nomor_surat: nomorSurat }),
      });

      if (res.status === 422) {
        throw new Error("Nomor Surat telah terpakai");
      }

      if (!res.ok) throw new Error("Gagal menyimpan nomor surat.");

      router.push(`/admin/pengajuan-surat/${jenisSurat}/${id}/preview`);
    } catch (err) {
      setErrorMsg(err.message || "Terjadi kesalahan saat menyimpan.");
      setShowErrorPopup(true);
    }
  };

  if (loading) return <p className="p-6">Memuat data...</p>;

  return (
    <div className="flex h-full">
      <div className="flex-1 p-8 space-y-8 bg-[#EDF0F5]">
        <h2 className="text-2xl font-semibold mb-4">
          {namaUser} / {namaSurat} / Nomor surat
        </h2>
        <div className="bg-white rounded-lg shadow-md p-8 mx-auto">
          <button type="button" onClick={() => router.push(`/admin/pengajuan-surat/${jenisSurat}/${id}`)} className="flex items-center text-base text-gray-500 mb-6">
            <ChevronLeft size={30} className="mr-1" />
            Kembali
          </button>

          <form onSubmit={handleConfirm} className="space-y-6">
            <h3 className="text-xl font-bold text-gray-700 mb-2 text-center">Masukkan Nomor Surat</h3>
            <div className="flex justify-center items-center gap-2 mb-2">
              <input
                type="number"
                value={nomorSurat}
                onChange={(e) => setNomorSurat(e.target.value)}
                onWheel={(e) => e.target.blur()}
                className="w-20 px-2 py-2 border rounded text-center focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
              <span className="text-lg text-gray-700">/{kodeSurat}/10.2003/VII/2025</span>
            </div>
            <p className="text-center text-sm text-gray-500 mb-4">Nomor Surat Terakhir : - </p>

            {errorMsg && <p className="text-red-600 text-sm text-center mb-2">{errorMsg}</p>}

            <div className="flex justify-center mt-2">
              <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ✅ Popup Konfirmasi */}
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md px-6 py-8 text-center max-w-sm mx-auto border border-gray-300">
            <h3 className="text-green-600 font-bold text-lg mb-3">Konfirmasi Nomor Surat!</h3>
            <p className="text-gray-700 text-sm mb-4">Apakah Anda yakin nomor surat yang dimasukkan sudah benar dan sesuai format?</p>
            <button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm">
              Ya, Sudah Benar
            </button>
            <button onClick={() => setShowConfirmPopup(false)} className="mt-4 text-sm text-gray-600 underline cursor-pointer bg-transparent border-none p-0 focus:outline-none">
              Periksa Lagi
            </button>
          </div>
        </div>
      )}

      {/* ❌ Popup Error */}
      {showErrorPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md px-6 py-8 text-center max-w-sm mx-auto border border-red-300">
            <h3 className="text-red-600 font-bold text-lg mb-3">Gagal Menyimpan</h3>
            <p className="text-gray-700 text-sm mb-4">{errorMsg}</p>
            <button onClick={() => setShowErrorPopup(false)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm">
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
