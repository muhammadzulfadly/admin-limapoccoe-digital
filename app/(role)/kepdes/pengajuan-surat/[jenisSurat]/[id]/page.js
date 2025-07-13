"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function PreviewSuratPage() {
  const { jenisSurat, id } = useParams();
  const router = useRouter();

  const [slug, setSlug] = useState("");
  const [namaSurat, setNamaSurat] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  // Ambil token dari localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setErrorMsg("Token tidak ditemukan. Silakan login ulang.");
      return;
    }
    setToken(storedToken);
  }, []);

  // Ambil metadata surat
  useEffect(() => {
    if (!token || !jenisSurat) return;

    fetch(`/api/letter`, {
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

  // Simulasi data user & status
  useEffect(() => {
    if (id) {
      setLoading(false);
    }
  }, [id]);

  const handleProsesTandaTangan = async () => {
    setProcessing(true);
    setErrorMsg("");
    setShowFailure(false);
    setShowSuccess(false);

    try {
      const res = await fetch(`/api/letter/${slug}/${id}/signed`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "approved" }),
      });

      // if (!res.ok) {
      //   const errData = await res.json();
      //   throw new Error(errData.message || "Gagal menandatangani surat.");
      // }

      setShowSuccess(true);
      setTimeout(() => {
        router.push(`/kepdes/pengajuan-surat/${jenisSurat}`);
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message || "Terjadi kesalahan saat menandatangani.");
      setShowFailure(true);
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
          Pengajuan Surat / {namaSurat} / Preview
          <button type="button" onClick={() => router.back()} className="flex items-center text-base text-gray-500 mt-3">
            <ChevronLeft size={30} className="mr-1" />
            Kembali
          </button>
        </h2>

        <div className="bg-white rounded-lg shadow-md p-6 mx-auto">
          <iframe src={`/api/letter/${slug}/${id}/preview?token=${token}`} width="100%" height="700" className="w-full border" title="Preview Surat" />
        </div>

        <div className="flex justify-end mt-4">
          <button onClick={handleProsesTandaTangan} disabled={processing} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-60">
            {processing ? "Memproses..." : "Tanda Tangani Surat"}
          </button>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md px-6 py-8 text-center max-w-sm mx-auto border border-gray-300">
            <h3 className="text-green-600 font-bold text-lg mb-3">Siap untuk Ditandatangani?</h3>
            <p className="text-gray-700 text-sm mb-4">Pastikan surat sudah dicek dan valid sebelum ditandatangani.</p>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm" onClick={() => setShowSuccess(false)}>
              Tanda Tangan
            </button>
            <p className="mt-4 text-xs text-gray-500 underline cursor-pointer" onClick={() => setShowSuccess(false)}>
              Baca Kembali
            </p>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showFailure && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md px-6 py-8 text-center max-w-sm mx-auto border border-red-300">
            <h3 className="text-red-600 font-bold text-lg mb-3">Gagal Menandatangani</h3>
            <p className="text-gray-700 text-sm mb-4">{errorMsg || "Terjadi kesalahan saat memproses."}</p>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm" onClick={() => setShowFailure(false)}>
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
