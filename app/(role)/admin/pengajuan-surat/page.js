"use client";

import { Search, FileDown, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SedangProsesCard from "@/components/card/SedangProses";
import ButuhKonfirmasiCard from "@/components/card/ButuhKonfirmasi";
import DitolakCard from "@/components/card/DiTolak";
import SelesaiCard from "@/components/card/Selesai";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const [pengajuan, setPengajuan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchGlobal, setSearchGlobal] = useState("");
  const [colSpan, setColSpan] = useState(6);
  const [activeTab, setActiveTab] = useState("Semua"); // selalu ada satu yang aktif

  const itemsPerPage = 5;
  const router = useRouter();

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (slug, id, namaSurat, namaPemohon) => {
    try {
      setIsDownloading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/letter/${slug}/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Gagal mengunduh file");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${namaSurat} - ${namaPemohon}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal mengunduh file:", err);
      alert("Gagal mengunduh file");
    } finally {
      setIsDownloading(false);
    }
  };

  const statusMap = {
    approved: "Selesai",
    confirmed: "Butuh Konfirmasi",
    rejected: "Ditolak",
    processed: "Sedang Proses",
  };

  const statusStyle = {
    Selesai: "text-[#34C759] font-semibold",
    "Butuh Konfirmasi": "text-[#016E84] font-semibold",
    Ditolak: "text-[#E74C3C] font-semibold",
    "Sedang Proses": "text-[#666666] font-semibold",
  };

  // urutan dan label tombol
  const STATUS_TABS = ["Semua", "Sedang Proses", "Butuh Konfirmasi", "Ditolak", "Selesai"];

  // warna tombol aktif (on) mengikuti gambar
  const ACTIVE_TAB_CLASS = {
    Semua: "bg-[#2B3A4A] text-white",
    "Sedang Proses": "bg-[#8A8A8E] text-white",
    "Butuh Konfirmasi": "bg-[#016E84] text-white",
    Ditolak: "bg-[#E74C3C] text-white",
    Selesai: "bg-[#34C759] text-white",
  };

  const iconStyle = {
    Unduh: <FileDown className="text-[#34C759]" />,
    Buka: <Search className="text-[#00A8E8]" />,
  };

  const formatTanggal = (tgl) => {
    const d = new Date(tgl);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  const mapStatus = (raw) => statusMap[raw] || raw;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        // breakpoint md: di Tailwind
        setColSpan(5); // mobile
      } else {
        setColSpan(6); // desktop
      }
    };

    // jalankan pertama kali
    handleResize();

    // pasang event listener
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchAllPengajuan = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const suratRes = await fetch("/api/letter", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const suratData = await suratRes.json();
        const jenisSurat = suratData.jenis_surat || [];

        const allPengajuan = await Promise.all(
          jenisSurat.map(async (surat) => {
            const res = await fetch(`/api/letter/${surat.slug}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            return (data.pengajuan_surat || []).map((item) => ({
              ...item,
              suratNama: surat.nama_surat,
              suratSlug: surat.slug,
            }));
          })
        );

        const sorted = allPengajuan.flat().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setPengajuan(sorted);
      } catch (err) {
        console.error("Gagal memuat pengajuan:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPengajuan();
  }, []);

  const filteredData = pengajuan.filter((item) => {
    const statusLabel = mapStatus((item.status || "").toLowerCase()); // normalisasi
    const tanggal = formatTanggal(item.created_at);
    const nama = item.user?.name || "";
    const jenis = item.suratNama || "";

    // pencarian global: tanggal, nama, status, jenis surat
    const q = searchGlobal.toLowerCase();
    const matchGlobal = tanggal.includes(searchGlobal) || nama.toLowerCase().includes(q) || jenis.toLowerCase().includes(q);

    // filter status dari tab
    const matchStatus = activeTab === "Semua" ? true : statusLabel === activeTab;

    return matchGlobal && matchStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const renderPageButtons = () => {
    const pages = [];
    const maxVisible = 5;
    const start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (start > 1) {
      pages.push(
        <button key={1} onClick={() => setCurrentPage(1)} className={`px-3 py-1 ${currentPage === 1 ? "bg-[#27AE60] text-white" : "hover:bg-slate-100"}`}>
          1
        </button>
      );
      if (start > 2)
        pages.push(
          <span key="start-ellipsis" className="px-2 py-1">
            ...
          </span>
        );
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button key={i} onClick={() => setCurrentPage(i)} className={`px-3 py-1 ${currentPage === i ? "bg-[#27AE60] text-white" : "hover:bg-slate-100"}`}>
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1)
        pages.push(
          <span key="end-ellipsis" className="px-2 py-1">
            ...
          </span>
        );
      pages.push(
        <button key={totalPages} onClick={() => setCurrentPage(totalPages)} className={`px-3 py-1 ${currentPage === totalPages ? "bg-[#27AE60]text-white" : "hover:bg-slate-100"}`}>
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <>
      {isDownloading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white px-6 py-4 rounded shadow-md text-center">
            <p className="text-lg font-semibold mb-2">Mengunduh file...</p>
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#27AE60] mx-auto" />
          </div>
        </div>
      )}

      <div className="flex h-full">
        <div className="flex-1 p-8 space-y-8">
          <section>
            <h2 className="sm:text-2xl text-base font-semibold mb-4">Pengajuan Surat</h2>

            {loading ? (
              <p className="text-gray-500 italic">Memuat data...</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <SedangProsesCard count={pengajuan.filter((x) => x.status === "processed").length} />
                <ButuhKonfirmasiCard count={pengajuan.filter((x) => x.status === "confirmed").length} />
                <DitolakCard count={pengajuan.filter((x) => x.status === "rejected").length} />
                <SelesaiCard count={pengajuan.filter((x) => x.status === "approved").length} />
              </div>
            )}

            <hr className="border-gray-300 border-y mt-6 mb-6" />

            <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-500 rounded-md px-4 py-2 bg-white text-gray-500 w-full sm:w-auto min-w-0">
                <Search className="w-5 h-5 mr-2" />
                <input type="text" placeholder="Cari" className="flex-1 outline-none text-sm bg-white placeholder-gray-500" value={searchGlobal} onChange={(e) => setSearchGlobal(e.target.value)} />
              </div>
            </div>

            {/* Tombol status */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-1 sm:gap-2 mb-2">
              {STATUS_TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      if (activeTab !== tab) {
                        setActiveTab(tab);
                        setCurrentPage(1);
                      }
                    }}
                    className={`w-full px-2 py-1 sm:px-4 sm:py-2 rounded font-medium transition-colors 
          truncate text-ellipsis whitespace-nowrap 
          ${isActive ? ACTIVE_TAB_CLASS[tab] : "bg-gray-300 text-black hover:bg-gray-400"}`}
                    style={{ fontSize: "clamp(10px, 3vw, 14px)" }}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            <div className="w-full overflow-x-auto">
              <table className="table-fixed w-full border border-black text-[9px] sm:text-sm md:text-base">
                <thead>
                  <tr className="bg-[#27AE60] text-white">
                    <th className="border border-black p-2 w-[10%] whitespace-normal break-words hidden sm:table-cell">No.</th>
                    <th className="border border-black p-2 w-[15%] whitespace-normal break-words">Tanggal</th>
                    <th className="border border-black p-2 w-[20%] whitespace-normal break-words">Nama</th>
                    <th className="border border-black p-2 w-[20%] whitespace-normal break-words">Jenis Surat</th>
                    <th className="border border-black p-2 w-[20%] whitespace-normal break-words">Status</th>
                    <th className="border border-black p-2 w-[15%] whitespace-normal break-words">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={colSpan} className="bg-white text-center text-black py-4 italic">
                        Memuat data...
                      </td>
                    </tr>
                  ) : paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan={colSpan} className="bg-white text-center text-black py-4">
                        {pengajuan.length === 0 ? "Belum Ada Pengajuan Surat" : "Hasil Pencarian Tidak Ada"}
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((item, index) => {
                      const statusLabel = mapStatus(item.status);
                      const actionLabel = statusLabel === "Selesai" ? "Unduh" : "Buka";
                      return (
                        <tr key={item.id} className="bg-white text-center">
                          <td className="border border-black p-2 whitespace-normal break-words hidden sm:table-cell">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td className="border border-black p-2 whitespace-normal break-words">{formatTanggal(item.created_at)}</td>
                          <td className="border border-black p-2 whitespace-normal break-words">{item.data_surat?.nama || item.data_surat?.nama_anak || item.user?.name || "-"}</td>
                          <td className="border border-black p-2 whitespace-normal break-words">{item.suratNama || "-"}</td>
                          <td className={`border border-black p-2 whitespace-normal break-words ${statusStyle[statusLabel] || ""}`}>{statusLabel}</td>
                          <td className="border border-black p-2 whitespace-normal break-words">
                            <div className="flex flex-col items-center justify-center text-center group">
                              {statusLabel === "Selesai" ? (
                                <button
                                  onClick={() => handleDownload(item.suratSlug, item.id, item.suratNama, item.data_surat?.nama || item.user?.name)}
                                  className="flex flex-col items-center justify-center text-center group text-[9px] sm:text-sm"
                                >
                                  {iconStyle["Unduh"]}
                                  <span>Unduh</span>
                                </button>
                              ) : statusLabel === "Butuh Konfirmasi" ? (
                                <button onClick={() => router.push(`/admin/pengajuan-surat/${item.suratSlug}/${item.id}/preview`)} className="flex flex-col items-center justify-center text-center group text-[9px] sm:text-sm">
                                  {iconStyle["Buka"]}
                                  <span>Buka</span>
                                </button>
                              ) : (
                                <button onClick={() => router.push(`/admin/pengajuan-surat/${item.suratSlug}/${item.id}`)} className="flex flex-col items-center justify-center text-center group text-[9px] sm:text-sm">
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

              <div className="flex justify-center mt-6">
                <div className="flex border border-slate-800 divide-x divide-slate-800 text-slate-800 text-sm rounded overflow-hidden">
                  <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 disabled:opacity-50">
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  {renderPageButtons()}
                  <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 disabled:opacity-50">
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
