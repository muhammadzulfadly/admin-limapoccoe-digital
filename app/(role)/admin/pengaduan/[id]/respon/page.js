"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Deskripsi from "@/components/forms/Deskripsi";
import { ChevronLeft } from "lucide-react";

export default function ResponPengaduanPage() {
  const { id } = useParams();
  const router = useRouter();
  const [response, setRespon] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [namaUser, setNamaUser] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    const fetchNamaPengadu = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/complaint/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Gagal mengambil data pengguna.");

        const data = await res.json();
        const nama = data.aduan?.user?.name || "Pengguna";
        setNamaUser(nama);
      } catch (err) {
        console.error(err);
        setNamaUser("Pengguna");
      }
    };

    if (id) {
      fetchNamaPengadu();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/complaint/${id}/processed`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          response,
        }),
      });

      if (!res.ok) {
        throw new Error("Gagal mengirim respon.");
      }
      setShowSuccessModal(true);
      setTimeout(() => {
        router.push("/admin/pengaduan");
      }, 1800);
    } catch (err) {
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 p-4 sm:p-8 space-y-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Pengaduan / {namaUser} / Tanggapan
        </h2>

        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 mx-auto w-full">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center text-sm sm:text-base text-gray-500 mb-6"
          >
            <ChevronLeft size={24} className="mr-1" />
            Kembali
          </button>

          <div className="px-2 sm:px-8 md:px-24">
            <form onSubmit={handleSubmit}>
              <div className="text-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-4">
                  Tanggapan Staff Desa<span className="text-red-500 ml-0.5">*</span>
                </h3>
                <Deskripsi
                  value={response}
                  onChange={(e) => setRespon(e.value)}
                  error={errorMsg}
                  hideLabel
                />
              </div>

              <div className="text-center mt-8 mb-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-[#27AE60] text-white rounded hover:bg-green-600 disabled:opacity-50 text-sm sm:text-base"
                >
                  {loading ? "Mengirim..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 text-center w-full max-w-sm shadow-lg">
            <h2 className="text-[#27AE60] text-lg font-bold mb-2">
              Tanggapan Berhasil Dikirim!
            </h2>
            <p className="text-sm">
              Tanggapan Anda telah berhasil dikirim ke pelapor. Terima kasih telah menindaklanjuti pengaduan masyarakat.
            </p>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 text-center w-full max-w-sm min-h-[200px] shadow-lg">
            <h2 className="text-[#E74C3C] text-xl font-bold mb-2">
              Tanggapan Gagal Dikirim!
            </h2>
            <p className="text-sm text-gray-700 mb-4">
              Maaf, Tanggapan Anda tidak berhasil dikirim. Silakan coba lagi nanti atau periksa koneksi Anda.
            </p>
            <button
              className="bg-[#E74C3C] text-white px-4 py-2 text-sm rounded hover:bg-red-600"
              onClick={() => setShowErrorModal(false)}
            >
              Kembali
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
