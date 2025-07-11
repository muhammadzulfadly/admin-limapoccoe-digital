"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import Respon from "@/components/form/Respon";
import Nik from "@/components/form/Nik";
import Tanggal from "@/components/form/Tanggal";
import NamaLengkap from "@/components/form/NamaLengkap";
import JudulPengaduan from "@/components/form/JudulPengaduan";
import LokasiKejadian from "@/components/form/LokasiKejadian";
import KategoriPengaduan from "@/components/form/KategoriPengaduan";
import DeskripsiPengaduan from "@/components/form/DeskripsiPengaduan";

export default function DetailPengaduanPage() {
  const router = useRouter();
  const { id } = useParams();

  const statusMap = {
    waiting: "Menunggu",
    processed: "Diterima",
    approved: "Selesai",
  };

  const [pengaduan, setPengaduan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPengaduan = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/complaint/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Gagal mengambil data pengaduan.");

        const data = await res.json();
        console.log(data);
        setPengaduan(data.aduan);
      } catch (err) {
        console.error(err);
        setErrorMsg("Gagal memuat detail pengaduan.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPengaduan();
  }, [id]);

  const handleSelesaikan = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/complaint/${id}/approved`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "approved" }),
      });

      if (!res.ok) {
        throw new Error("Gagal menyelesaikan pengaduan.");
      }

      router.push("/admin/pengaduan");
    } catch (err) {
      alert(err.message || "Terjadi kesalahan saat menyelesaikan pengaduan.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-8">Memuat...</p>;
  if (errorMsg) return <p className="p-8 text-red-500">{errorMsg}</p>;
  if (!pengaduan) return <p className="p-8">Data tidak ditemukan.</p>;

  return (
    <div className="bg-[#EDF0F5] min-h-screen p-8">
      <h1 className="text-lg font-semibold mb-6">
        Pengaduan / {pengaduan.user?.name} / {statusMap[pengaduan.status]}
      </h1>

      <div className="bg-white rounded-lg p-6 max-w-6xl mx-auto">
        <button type="button" onClick={() => router.back()} className="flex items-center text-base text-gray-500 mb-6">
          <ChevronLeft size={30} className="mr-1" />
          Kembali
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pengaduan.response && (
            <div className="md:col-span-2">
              <Respon value={pengaduan.response} onChange={() => {}} disabled />
              <div className="border-y border-gray-400 my-10" />
            </div>
          )}
          <Nik value={pengaduan.user?.nik || pengaduan.nik} onChange={() => {}} disabled />
          <Tanggal value={pengaduan.created_at || pengaduan.created_at} onChange={() => {}} disabled />
          <NamaLengkap value={pengaduan.user?.name || pengaduan.name} onChange={() => {}} disabled />
          <KategoriPengaduan value={pengaduan.category} onChange={() => {}} disabled />
          <JudulPengaduan value={pengaduan.title} onChange={() => {}} disabled />
          <LokasiKejadian value={pengaduan.location} onChange={() => {}} disabled />
          <DeskripsiPengaduan value={pengaduan.content} onChange={() => {}} disabled />

          {pengaduan?.evidence_url ? (
            <img src={`/api/photo/${pengaduan.evidence_url.split("/").pop()}`} alt="Bukti" className="mt-2 max-w-full rounded border" />
          ) : (
            <div className="mt-1 p-2 border rounded bg-gray-100 text-sm text-gray-500 italic">Tidak ada foto</div>
          )}
        </div>

        <div className="flex justify-end mt-8">
          {pengaduan.response && pengaduan.status !== "approved" ? (
            <button onClick={handleSelesaikan} disabled={submitting} className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60">
              {submitting ? "Menyimpan..." : "Selesaikan Pengaduan"}
            </button>
          ) : pengaduan.response === null ? (
            <button onClick={() => router.push(`/admin/pengaduan/${pengaduan.id}/respon`)} className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Selanjutnya
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
