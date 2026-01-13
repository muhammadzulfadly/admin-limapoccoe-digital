"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";

export default function InputNomorSuratPage() {
const params = useParams();
const router = useRouter();

const jenisSurat = Array.isArray(params.jenisSurat)
  ? params.jenisSurat[0]
  : params.jenisSurat;

const id = Array.isArray(params.id)
  ? params.id[0]
  : params.id;

  const [bulanSaatIni, setBulanSaatIni] = useState("");
  const [tahunSaatIni, setTahunSaatIni] = useState("");
  const [nomorSurat, setNomorSurat] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [namaUser, setNamaUser] = useState("Memuat...");
  const [namaSurat, setNamaSurat] = useState("Memuat...");
  const [kodeSurat, setKodeSurat] = useState("Memuat...");
  const [slug, setSlug] = useState(null);
  const [nomorSuratTerakhir, setNomorSuratTerakhir] = useState("");

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
    const now = new Date();
  
    const romanMonth = [
      "I", "II", "III", "IV", "V", "VI",
      "VII", "VIII", "IX", "X", "XI", "XII"
    ];
  
    setBulanSaatIni(romanMonth[now.getMonth()]);
    setTahunSaatIni(now.getFullYear());
  }, []);

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
    const minValue = parseInt(nomorSuratTerakhir || 0) + 1;
    if (parseInt(nomorSurat) < minValue) {
      setErrorMsg(`Nomor surat minimal harus ${minValue}`);
      return;
    }
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

      if (!res.ok) {
        setShowErrorPopup(true);
      }

      router.push(`/admin/pengajuan-surat/${jenisSurat}/${id}/preview`);
    } catch (err) {
      setErrorMsg(err.message || "Terjadi kesalahan saat menyimpan.");
    }
  };

  useEffect(() => {
    const fetchNomorSurat = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/letter/last-number", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setNomorSuratTerakhir(data.nomor_surat_terakhir);
        setNomorSurat(data.nomor_surat_berikutnya);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNomorSurat();
  }, []);

  if (loading) return <p className="p-6">Memuat data...</p>;

  return (
    <div>
      <div className="min-h-full p-8">
        <h2 className="sm:text-2xl text-base font-semibold mb-4">Pengajuan Surat / {namaSurat} / Nomor surat</h2>
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-8 mx-auto w-full">
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
                min={parseInt(nomorSuratTerakhir || 0) + 1}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  const minValue = parseInt(nomorSuratTerakhir || 0) + 1;
                  if (value >= minValue) {
                    setNomorSurat(value);
                    setErrorMsg(""); // reset error jika valid
                  } else {
                    setNomorSurat(value); // tetap simpan agar terlihat
                    setErrorMsg(`Nomor surat minimal harus ${minValue}`);
                  }
                }}
                onWheel={(e) => e.target.blur()}
                className="w-24 sm:w-20 px-2 py-2 border rounded text-center focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
              <span className="text-sm sm:text-lg text-gray-700 text-wrap text-center">/{kodeSurat}/10.2003/{bulanSaatIni}/{tahunSaatIni}</span>
            </div>

            <p className="text-center text-sm text-gray-500 mb-4">Nomor Surat Terakhir : {nomorSuratTerakhir}</p>

            {errorMsg && <p className="text-red-600 text-sm text-center mb-2">{errorMsg}</p>}

            <div className="flex justify-center mt-2">
              <button
                type="submit"
                disabled={!!errorMsg}
                className={`px-4 sm:px-6 py-2 w-full sm:w-auto text-sm sm:text-base rounded transition ${errorMsg ? "bg-gray-300 text-white cursor-not-allowed" : "bg-[#27AE60] text-white hover:bg-green-600"}`}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ✅ Popup Konfirmasi */}
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md px-4 sm:px-6 py-6 text-center w-full max-w-sm mx-4">
            <h3 className="text-[#27AE60] font-bold text-lg mb-3">Konfirmasi Nomor Surat!</h3>
            <p className="text-gray-700 text-sm mb-4">Apakah Anda yakin nomor surat yang dimasukkan sudah benar dan sesuai format?</p>
            <div className="flex flex-col">
              <button onClick={handleSubmit} className="bg-[#27AE60] hover:bg-green-600 text-white py-2 rounded text-sm">
                Ya, Sudah Benar
              </button>
              <button onClick={() => setShowConfirmPopup(false)} className="mt-4 text-sm text-gray-600 underline cursor-pointer bg-transparent border-none p-0 focus:outline-none">
                Periksa Lagi
              </button>
            </div>
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
