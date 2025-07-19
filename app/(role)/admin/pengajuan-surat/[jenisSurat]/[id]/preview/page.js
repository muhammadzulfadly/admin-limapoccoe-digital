"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function PreviewSuratPage() {
  const { jenisSurat, id } = useParams();
  const router = useRouter();

  const [slug, setSlug] = useState("");
  const [namaUser, setNamaUser] = useState("Memuat...");
  const [namaSurat, setNamaSurat] = useState("Memuat...");
  const [status, setStatus] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setErrorMsg("Token tidak ditemukan. Silakan login ulang.");
      return;
    }
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token || !jenisSurat) return;

    fetch("/api/letter", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const found = data.jenis_surat?.find((item) => item.slug.toString() === jenisSurat);
        if (found) {
          setSlug(found.slug);
          setNamaSurat(found.nama_surat);
        } else {
          setNamaSurat("Surat Tidak Diketahui");
        }
      })
      .catch(() => {
        setNamaSurat("Surat");
      });
  }, [token, jenisSurat]);

  useEffect(() => {
    if (!slug || !id || !token) return;

    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/letter/${slug}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        const pengajuan = data.pengajuan_surat;
        setStatus(pengajuan?.status || "");
        setNamaUser(pengajuan?.data_surat?.nama || pengajuan?.user?.name || "Pengguna");
      } catch (err) {
        console.error("Gagal mengambil detail pengajuan:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [slug, id, token]);

  const handleProsesTandaTangan = async () => {
    setProcessing(true);
    setErrorMsg("");
    setShowConfirmPopup(false);

    try {
      const res = await fetch(`/api/letter/${slug}/${id}/confirmed`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "confirmed" }),
      });

      if (!res.ok) throw new Error("Gagal mengubah status.");

      setShowSuccessPopup(true);
      setTimeout(() => {
        router.push(`/admin/pengajuan-surat/${jenisSurat}`);
      }, 1800);
    } catch (err) {
      setErrorMsg(err.message || "Terjadi kesalahan saat mengubah status.");
      setShowErrorPopup(true);
    } finally {
      setProcessing(false);
    }
  };

  if (loading || !slug || !token) {
    return <div className="p-10">Memuat preview surat...</div>;
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 p-8 space-y-8 bg-[#EDF0F5]">
        <h2 className="text-2xl font-semibold">
          {namaUser} / {namaSurat} / Preview
          <button type="button" onClick={() => router.back()} className="flex items-center text-base text-gray-500 mt-3">
            <ChevronLeft size={30} className="mr-1" />
            Kembali
          </button>
        </h2>

        <div className="bg-white rounded-lg shadow-md p-6 mx-auto">
          <iframe src={`/api/letter/${slug}/${id}/preview?token=${token}`} width="100%" height="700" className="w-full border" title="Preview Surat" />
        </div>

        {errorMsg && <p className="text-red-600 text-sm mt-4 text-right">{errorMsg}</p>}

        <div className="flex justify-end mt-4">
          <button
            onClick={() => setShowConfirmPopup(true)}
            disabled={processing || status === "confirmed"}
            className={`bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-60 ${status === "confirmed" ? "hidden" : ""}`}
          >
            {processing ? "Memproses..." : "Proses tanda tangan"}
          </button>
        </div>
      </div>

      {/* ✅ Popup Konfirmasi */}
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md px-6 py-8 text-center max-w-sm mx-auto border">
            <h3 className="text-green-600 font-bold text-lg mb-3">Konfirmasi!</h3>
            <p className="text-gray-700 text-sm mb-4">Apakah Anda sudah memastikan bahwa semua data dalam surat ini sudah benar? Periksa kembali sebelum melanjutkan.</p>
            <div className="flex flex-col">
              <button onClick={handleProsesTandaTangan} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm">
                Ya, Sudah Benar
              </button>
              <button onClick={() => setShowConfirmPopup(false)} className="mt-4 text-sm text-gray-600 underline cursor-pointer">
                Periksa Lagi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Popup Sukses */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md px-6 py-8 text-center max-w-sm mx-auto border">
            <h3 className="text-green-600 font-bold text-lg mb-3">Menunggu Tanda Tangan Kepala Desa !</h3>
            <p className="text-gray-700 text-sm">Surat telah dikirim dan sedang menunggu tanda tangan dari Kepala Desa.</p>
          </div>
        </div>
      )}

      {/* ❌ Popup Gagal */}
      {showErrorPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md px-6 py-8 text-center max-w-sm mx-auto border border-red-300">
            <h3 className="text-red-600 font-bold text-lg mb-3">Gagal Memproses</h3>
            <p className="text-gray-700 text-sm mb-4">{errorMsg || "Terjadi kesalahan saat mengubah status."}</p>
            <button onClick={() => setShowErrorPopup(false)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm">
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
