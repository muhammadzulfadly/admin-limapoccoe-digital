"use client";

import { Search, FileDown, Plus, ChevronsLeft, ChevronsRight, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SedangProsesCard from "@/components/card/SedangProses";
import ButuhKonfirmasiCard from "@/components/card/ButuhKonfirmasi";
import DitolakCard from "@/components/card/DiTolak";
import SelesaiCard from "@/components/card/Selesai";
import PropTypes from "prop-types";

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

const mapStatus = (raw) => statusMap[raw] || raw;

export default function Page() {
  const { jenisSurat } = useParams();
  const [judul, setJudul] = useState("Memuat...");
  const [slug, setSlug] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchGlobal, setSearchGlobal] = useState("");
  const [searchFilters, setSearchFilters] = useState({ tanggal: "", nama: "", status: "", jenis: "" });
  const itemsPerPage = 5;
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const sedangProses = data.filter((d) => mapStatus(d.status) === "Sedang Proses");
  const butuhKonfirmasi = data.filter((d) => mapStatus(d.status) === "Butuh Konfirmasi");
  const ditolak = data.filter((d) => mapStatus(d.status) === "Ditolak");
  const selesai = data.filter((d) => mapStatus(d.status) === "Selesai");
  const [colSpan, setColSpan] = useState(6);
  const [activeTab, setActiveTab] = useState("Semua"); // selalu ada satu yang aktif

  const handleDownload = async (id, namaSurat, namaPemohon) => {
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
      console.error("Unduh gagal:", err);
      alert("Gagal mengunduh file.");
    } finally {
      setIsDownloading(false);
    }
  };

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
    const fetchMetadata = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/letter", {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
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
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
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

  const formatTanggal = (tgl) => new Date(tgl).toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "2-digit" });

  const filteredData = data.filter((item) => {
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

  const getPaginationRange = () => {
    const delta = 2;
    const range = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);
    range.push(1);
    if (left > 2) range.push("...");
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages - 1) range.push("...");
    if (totalPages > 1) range.push(totalPages);
    return range;
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

      <div>
        <div className="min-h-full p-8">
          <h2 className="sm:text-2xl text-base font-semibold mb-4">Pengajuan Surat / {judul}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <SedangProsesCard count={sedangProses.length} />
            <ButuhKonfirmasiCard count={butuhKonfirmasi.length} />
            <DitolakCard count={ditolak.length} />
            <SelesaiCard count={selesai.length} />
          </div>

          <hr className="border-gray-300 border-y mb-6" />

          <div className="grid grid-cols-2 sm:flex sm:justify-between sm:items-center gap-4 mb-6">
            <Link href={`/admin/pengajuan-surat/${jenisSurat}/baru`}>
              <button className="flex items-center gap-1 px-4 py-2 bg-[#27AE60] text-white rounded-md text-sm hover:bg-green-600 transition w-full sm:w-auto">
                <Plus className="w-5 h-5" strokeWidth={3} />
                <span className="block sm:hidden">Buat Surat</span>
                <span className="hidden sm:block"> Buat Pengajuan Surat</span>
              </button>
            </Link>

            <div className="flex items-center border border-gray-500 rounded-md px-4 py-2 bg-white text-gray-500 w-full sm:w-auto min-w-0">
              <Search className="w-5 h-5 mr-2" />
              <input type="text" placeholder="Cari" className="flex-1 outline-none text-sm bg-white placeholder-gray-500 min-w-0" value={searchGlobal} onChange={(e) => setSearchGlobal(e.target.value)} />
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
                    <td colSpan={6} className="bg-white text-center text-black py-4 italic">
                      Memuat data...
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={colSpan} className="bg-white text-center text-black py-4">
                      {data.length === 0 ? `Belum Ada Pengajuan ${judul}` : "Hasil Pencarian Tidak Ada"}
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
                        <td className="border border-black p-2 whitespace-normal break-words">{item.surat?.nama_surat || judul}</td>
                        <td className={`border border-black p-2 whitespace-normal break-words ${statusStyle[statusLabel] || ""}`}>{statusLabel}</td>
                        <td className="border border-black p-2 whitespace-normal break-words">
                          <div className="flex flex-col items-center justify-center text-center group">
                            {statusLabel === "Selesai" ? (
                              <button onClick={() => handleDownload(item.id, `${judul}`, `${item.data_surat?.nama || item.user?.name}`)} className="flex flex-col items-center justify-center text-center group text-[9px] sm:text-sm">
                                {iconStyle["Unduh"]}
                                <span>Unduh</span>
                              </button>
                            ) : statusLabel === "Butuh Konfirmasi" ? (
                              <button onClick={() => router.push(`/admin/pengajuan-surat/${jenisSurat}/${item.id}/preview`)} className="flex flex-col items-center justify-center text-center group text-[9px] sm:text-sm">
                                {iconStyle["Buka"]}
                                <span>Buka</span>
                              </button>
                            ) : (
                              <button onClick={() => router.push(`/admin/pengajuan-surat/${jenisSurat}/${item.id}`)} className="flex flex-col items-center justify-center text-center group text-[9px] sm:text-sm">
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
                {getPaginationRange().map((page, i) => (
                  <button key={i} onClick={() => typeof page === "number" && setCurrentPage(page)} disabled={typeof page !== "number"} className={`px-3 py-1 ${page === currentPage ? "bg-[#27AE60] text-white" : "hover:bg-slate-100"}`}>
                    {page === "..." ? <MoreHorizontal className="w-4 h-4" /> : page}
                  </button>
                ))}
                <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 disabled:opacity-50">
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
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

Stat.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.element.isRequired,
};
