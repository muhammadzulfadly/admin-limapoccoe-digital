"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";

import Nik from "@/components/form/Nik";
import NamaLengkap from "@/components/form/NamaLengkap";
import TempatLahir from "@/components/form/TempatLahir";
import TanggalLahir from "@/components/form/TanggalLahir";
import JenisKelamin from "@/components/form/JenisKelamin";
import Alamat from "@/components/form/Alamat";
import Pekerjaan from "@/components/form/Pekerjaan";
import Dusun from "@/components/form/Dusun";
import RtRw from "@/components/form/RtRw";
import Tanggal from "@/components/form/Tanggal";
import NomorDokumen from "@/components/form/NomorDokumen";

export default function DetailAjuanSuratPage() {
  const { jenisSurat, id } = useParams();
  const router = useRouter();
  const [ajuan, setAjuan] = useState(null);
  const [slug, setSlug] = useState(null);
  const [surat, setSurat] = useState(null);

  const [showTolakModal, setShowTolakModal] = useState(false);
  const [showVerifikasiModal, setShowVerifikasiModal] = useState(false);
  const [alasan_penolakan, setAlasanPenolakan] = useState("");
  const [errorCatatan, setErrorCatatan] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDataSurat, setEditedDataSurat] = useState({});

  const statusMap = {
    processed: "Sedang Proses",
    confirmed: "Butuh Konfirmasi",
    rejected: "Ditolak",
    approved: "Selesai",
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !jenisSurat) return;

    const fetchSlug = async () => {
      try {
        const res = await fetch("/api/letter", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        const found = data.jenis_surat?.find((item) => item.slug.toString() === jenisSurat);
        if (found) {
          setSlug(found.slug);
          setSurat(found);
        }
      } catch (err) {
        console.error("⚠️ Gagal mendapatkan slug:", err);
      }
    };

    fetchSlug();
  }, [jenisSurat]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!slug || !id) return;

    const fetchDetailAjuan = async () => {
      try {
        const res = await fetch(`/api/letter/${slug}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();
        setAjuan(json.pengajuan_surat);
        setEditedDataSurat(json.pengajuan_surat?.data_surat || {});
      } catch (err) {
        console.error("⚠️ Gagal fetch detail ajuan:", err);
      }
    };

    fetchDetailAjuan();
  }, [slug, id]);

  const handleTerima = () => {
    if (ajuan?.nomor_surat) {
      router.push(`/admin/pengajuan-surat/${jenisSurat}/${id}/preview`);
    } else {
      router.push(`/admin/pengajuan-surat/${jenisSurat}/${id}/nomor-surat`);
    }
  };

  const handleTolak = async () => {
    if (!alasan_penolakan.trim()) {
      setErrorCatatan(true);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/letter/${slug}/${id}/rejected`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "ditolak",
          alasan_penolakan: alasan_penolakan.trim(),
        }),
      });

      if (!res.ok) throw new Error("Gagal menolak surat.");
      router.push(`/admin/pengajuan-surat/${jenisSurat}`);
    } catch (err) {
      alert("Terjadi kesalahan saat menolak surat.");
    }
  };

  const handleUbahData = async () => {
    if (isEditing) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/letter/${slug}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ data_surat: editedDataSurat }),
        });

        if (!res.ok) throw new Error("Gagal menyimpan perubahan.");
      } catch (err) {
        alert("Terjadi kesalahan saat menyimpan perubahan.");
        return;
      }
    }
    setIsEditing(!isEditing);
  };

  const handleEditChange = (key, value) => {
    setEditedDataSurat((prev) => ({ ...prev, [key]: value }));
  };

  const user = ajuan?.user;
  const profile = user?.profile_masyarakat;

  return (
    <div className="flex h-full bg-gray-100 min-h-screen p-8">
      <div className="flex-1 max-w-4xl mx-auto">
        <h1 className="text-xl font-semibold mb-4">
          Detail Pengajuan Surat / {surat?.nama_surat} / {statusMap[ajuan?.status]}
        </h1>
        <div className="bg-white rounded-md shadow-sm p-8">
          <button type="button" onClick={() => router.push(`/admin/pengajuan-surat/${jenisSurat}`)} className="flex items-center text-base text-gray-500 mb-6">
            <ChevronLeft size={30} className="mr-1" />
            Kembali
          </button>

          {!ajuan ? (
            <p className="text-gray-600">🔄 Memuat data ajuan...</p>
          ) : (
            <>
              <div className="pt-4 mb-6">
                <p className="text-xl font-semibold text-gray-700 mb-4">Informasi Pengajuan Surat</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NomorDokumen value={ajuan.nomor_surat_tersimpan || "-"} disabled />
                  <Tanggal value={ajuan.created_at?.split("T")[0] || "-"} disabled />
                </div>
              </div>

              {profile && (
                <>
                  <legend className="pt-4 text-xl font-semibold text-gray-700">Informasi Pribadi</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 mb-6">
                    <Nik value={user?.nik || ""} disabled />
                    <NamaLengkap value={user?.name || ""} disabled />
                    <TempatLahir value={profile?.tempat_lahir || ""} disabled />
                    <TanggalLahir value={profile?.tanggal_lahir || ""} disabled />
                    <JenisKelamin value={profile?.jenis_kelamin || ""} disabled />
                    <Alamat value={profile?.alamat || ""} disabled />
                    <Pekerjaan value={profile?.pekerjaan || ""} disabled />
                    <Dusun value={profile?.dusun || ""} disabled />
                    <RtRw value={profile?.rt_rw || ""} disabled />
                  </div>
                </>
              )}

              {ajuan.data_surat && Object.keys(ajuan.data_surat).length > 0 && (
                <div className="pt-4 mt-6">
                  <p className="text-xl font-semibold text-gray-700 mb-4">Informasi Tambahan</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(editedDataSurat).map(([key, value]) => (
                      <div key={key} className="capitalize">
                        <NamaLengkap value={value} disabled={!isEditing} label={key.replaceAll("_", " ")} onChange={({ value }) => handleEditChange(key, value)} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-end gap-3">
                {profile && ajuan?.status === "processed" ? (
                  <>
                    <button onClick={() => setShowTolakModal(true)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                      Tolak Surat
                    </button>
                    <button onClick={() => setShowVerifikasiModal(true)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                      Terima Surat
                    </button>
                  </>
                ) : (
                  <>
                    {ajuan.data_surat && ajuan?.status === "processed" && (
                      <button onClick={handleUbahData} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
                        {isEditing ? "Simpan Perubahan" : "Ubah Data"}
                      </button>
                    )}
                    {ajuan?.status === "processed" && (
                      <button onClick={() => setShowVerifikasiModal(true)} className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${isEditing ? "opacity-50 cursor-not-allowed" : ""}`} disabled={isEditing}>
                        Selanjutnya
                      </button>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {showTolakModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full border-2 border-red-500">
            <h2 className="text-xl font-bold text-red-600 mb-2">Tolak Pengajuan Surat!</h2>
            <p className="text-sm text-gray-700 mb-4">Silakan isi alasan penolakan di bawah agar bisa ditinjau kembali oleh pemohon.</p>
            <textarea
              className={`w-full p-2 border rounded ${errorCatatan ? "border-red-500" : "border-gray-300"}`}
              rows="3"
              placeholder="Catatan Wajib Diisi"
              value={alasan_penolakan}
              onChange={(e) => {
                setAlasanPenolakan(e.target.value);
                if (e.target.value.trim()) setErrorCatatan(false);
              }}
            ></textarea>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={handleTolak} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Tolak Surat
              </button>
              <button onClick={() => setShowTolakModal(false)} className="border border-gray-400 px-4 py-2 rounded">
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}

      {showVerifikasiModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full border-2 border-green-500">
            <h2 className="text-xl font-bold text-green-600 mb-2">Verifikasi Pengajuan!</h2>
            <p className="text-sm text-gray-700 mb-4">Apakah data pengajuan surat ini sudah benar dan lengkap?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowVerifikasiModal(false)} className="border border-gray-400 px-4 py-2 rounded">
                Kembali
              </button>
              <button onClick={handleTerima} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Proses Surat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
