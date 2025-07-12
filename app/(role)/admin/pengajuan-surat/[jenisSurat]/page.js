"use client";

import { Ban, Cog, FileText, BadgeCheck, UserCheck, Search, SlidersHorizontal, FileDown, Plus, ChevronsLeft, ChevronsRight, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const statusMap = {
  approved: "Selesai",
  confirmed: "Butuh Konfirmasi",
  rejected: "Ditolak",
  processed: "Sedang Proses",
};

const statusStyle = {
  Selesai: "text-green-600 font-semibold",
  "Butuh Konfirmasi": "text-blue-600 font-semibold",
  Ditolak: "text-red-600 font-semibold",
  "Sedang Proses": "text-gray-500 font-semibold",
};

const iconStyle = {
  Unduh: <FileDown className="text-green-600" />,
  Buka: <Search className="text-blue-600" />,
};

const mapStatus = (raw) => statusMap[raw] || raw;

export default function Page() {
  const { jenisSurat } = useParams();
  const [judul, setJudul] = useState("Memuat...");
  const [slug, setSlug] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (id) => {
    try {
      setIsDownloading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/letter/${slug}/${id}/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Gagal mengunduh file");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Surat-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Unduh gagal:", err);
      alert("Gagal mengunduh file.");
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/letter", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const result = await res.json();
        const surat = result?.jenis_surat?.find((s) => String(s.slug) === jenisSurat);
        if (surat) {
          setJudul(surat.nama_surat);
          setSlug(surat.slug);
        } else {
          setJudul("Jenis Surat Tidak Dikenal");
        }
      } catch (err) {
        console.error("Gagal ambil metadata surat:", err);
        setJudul("Jenis Surat Tidak Dikenal");
      }
    };

    if (jenisSurat) fetchMetadata();
  }, [jenisSurat]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!slug) return;
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/letter/${slug}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const result = await res.json();
        const sorted = (result.pengajuan_surat || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setData(sorted);
      } catch (err) {
        console.error("Gagal ambil data pengajuan:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getPaginationRange = () => {
    const delta = 2;
    const range = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    range.push(1);
    if (left > 2) range.push("...");

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (right < totalPages - 1) range.push("...");
    if (totalPages > 1) range.push(totalPages);

    return range;
  };

  const ringkasan = {
    sedangProses: data.filter((d) => mapStatus(d.status) === "Sedang Proses").length,
    butuhKonfirmasi: data.filter((d) => mapStatus(d.status) === "Butuh Konfirmasi").length,
    ditolak: data.filter((d) => mapStatus(d.status) === "Ditolak").length,
    selesai: data.filter((d) => mapStatus(d.status) === "Selesai").length,
  };

  const formatTanggal = (tgl) => {
    const d = new Date(tgl);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  return (
    <>
      {isDownloading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white px-6 py-4 rounded shadow-md text-center">
            <p className="text-lg font-semibold mb-2">Mengunduh file...</p>
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600 mx-auto" />
          </div>
        </div>
      )}

      <div className="flex h-full">
        <div className="flex-1 bg-gray-100 p-8">
          <h1 className="text-xl font-bold mb-6">Dashboard Pengajuan Surat / {judul}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Stat label="Sedang Proses" value={ringkasan.sedangProses} icon={<Cog size={50} className="text-gray-500" />} />
            <Stat label="Butuh Konfirmasi" value={ringkasan.butuhKonfirmasi} icon={<BadgeCheck size={50} className="text-teal-600" />} />
            <Stat label="Ditolak" value={ringkasan.ditolak} icon={<Ban size={50} className="text-red-500" />} />
            <Stat label="Selesai" value={ringkasan.selesai} icon={<UserCheck size={50} className="text-green-500" />} />
          </div>

          <div className="border-t border-gray-400 mb-6 mt-6" />

          <div className="flex justify-between items-center mb-6">
            <Link href={`/admin/pengajuan-surat/${jenisSurat}/baru`}>
              <button className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition">
                <Plus className="w-5 h-5" strokeWidth={3} />
                Buat Pengajuan Surat
              </button>
            </Link>

            <div className="flex items-center border border-gray-500 rounded-md px-4 py-2 bg-white text-gray-500">
              <Search className="w-5 h-5 mr-3" />
              <input type="text" placeholder="Cari" className="outline-none text-sm w-28 bg-white placeholder-gray-500" />
              <SlidersHorizontal className="w-4 h-4 ml-1" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table-auto w-full border border-black">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="border border-black p-2 w-[5%]">No.</th>
                  <th className="px-4 py-2 w-1/5 border border-black">Tanggal</th>
                  <th className="px-4 py-2 w-1/5 border border-black">Nama</th>
                  <th className="px-4 py-2 w-1/5 border border-black">Status</th>
                  <th className="px-4 py-2 w-1/5 border border-black">Jenis Surat</th>
                  <th className="px-4 py-2 w-1/5 border border-black">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="bg-white text-center text-black py-4 italic">
                      Memuat data...
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="bg-white text-center text-black py-4">
                      Belum ada proses pengajuan surat
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, index) => {
                    const statusRaw = item.status;
                    const statusLabel = mapStatus(statusRaw);
                    const actionLabel = statusLabel === "Selesai" ? "Unduh" : "Buka";

                    return (
                      <tr key={item.id} className="bg-white text-center">
                        <td className="border border-black p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="px-4 py-2 border border-black">{formatTanggal(item.created_at)}</td>
                        <td className="px-4 py-2 border border-black">{item.user?.name || "-"}</td>
                        <td className={`px-4 py-2 border border-black ${statusStyle[statusLabel] || ""}`}>{statusLabel}</td>
                        <td className="px-4 py-2 border border-black">{item.surat?.nama_surat || judul}</td>
                        <td className="px-4 py-2 border border-black">
                          <div className="flex justify-center items-center gap-1">
                            {statusLabel === "Selesai" ? (
                              <button onClick={() => handleDownload(item.id)} className="flex items-center gap-1 text-sm text-black hover:underline">
                                {iconStyle["Unduh"]}
                                <span>Unduh</span>
                              </button>
                            ) : (
                              <button onClick={() => router.push(`/admin/pengajuan-surat/${jenisSurat}/${item.id}`)} className="flex items-center gap-1 text-sm text-black hover:underline">
                                {iconStyle["Buka"]}
                                <span>Buka</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex border border-slate-800 divide-x divide-slate-800 text-slate-800 text-sm rounded overflow-hidden">
                <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 disabled:opacity-50">
                  <ChevronsLeft className="w-4 h-4" />
                </button>

                {getPaginationRange().map((page, i) => (
                  <button key={i} onClick={() => typeof page === "number" && setCurrentPage(page)} disabled={typeof page !== "number"} className={`px-3 py-1 ${page === currentPage ? "bg-green-700 text-white" : "hover:bg-slate-100"}`}>
                    {page === "..." ? <MoreHorizontal className="w-4 h-4" /> : page}
                  </button>
                ))}

                <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 disabled:opacity-50">
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Stat({ label, value, icon }) {
  return (
    <div className="bg-white rounded-lg p-4 flex items-center justify-between shadow-sm">
      <div>
        <p className="text-xl font-semibold">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
      {icon}
    </div>
  );
}
