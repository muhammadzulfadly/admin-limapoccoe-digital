"use client";

import { useEffect, useState } from "react";
import { Search, ChevronsLeft, ChevronsRight } from "lucide-react";
import Link from "next/link";
import DiterimaCard from "@/components/card/DiTerima";
import SelesaiCard from "@/components/card/Selesai";

const statusMap = {
  processed: "Diterima",
  approved: "Selesai",
};

const statusColor = {
  Selesai: "text-[#34C759] font-semibold",
  Diterima: "text-[#016E84] font-semibold",
};

// urutan dan label tombol
const STATUS_TABS = ["Semua", "Diterima", "Selesai"];

// warna tombol aktif (on) mengikuti gambar
const ACTIVE_TAB_CLASS = {
  Semua: "bg-[#2B3A4A] text-white",
  Diterima: "bg-[#016E84] text-white",
  Selesai: "bg-[#34C759] text-white",
};

export default function PengaduanPage() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    title: "",
    category: "",
    status: "",
    date: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [colSpan, setColSpan] = useState(6);
  const [activeTab, setActiveTab] = useState("Semua");

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
    const fetchAduan = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/complaint", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      const filteredData = (result.aduan || []).filter((item) => ["processed", "approved"].includes(item.status)).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // ⬅️ urutkan dari terbaru ke terlama
      setData(filteredData);
    };

    fetchAduan();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const filteredData = data.filter((item) => {
    const statusReadable = statusMap[item.status] || item.status; // "Diterima" / "Selesai"
    const dateFormatted = new Date(item.created_at).toLocaleDateString("id-ID");
    const q = searchQuery.toLowerCase();

    // pencarian global: judul, kategori, status, tanggal
    const matchGlobal = item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q) || dateFormatted.includes(q);

    // filter status dari tab
    const matchStatus = activeTab === "Semua" ? true : statusReadable === activeTab;

    return matchGlobal && matchStatus;
  });

  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="flex h-full">
      <div className="flex-1 p-8 space-y-8">
        <section>
          <h2 className="sm:text-2xl text-base font-semibold mb-4">Pengaduan</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {Object.values(statusMap).map((status) => {
              const jumlah = data.filter((item) => statusMap[item.status] === status).length;
              const Icon = status === "Diterima" ? DiterimaCard : SelesaiCard;
              return (
                <div key={status}>
                  <Icon count={jumlah} />
                </div>
              );
            })}
          </div>

          <hr className="border-gray-300 border-y mb-6" />

          {/* Pencarian dan filter toggle */}
          <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-500 rounded-md px-4 py-2 bg-white text-gray-500 w-full sm:w-auto min-w-0">
              <Search className="w-5 h-5 mr-2" />
              <input
                type="text"
                placeholder="Cari"
                className="flex-1 outline-none text-xs sm:text-sm bg-white placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Tombol status */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1 sm:gap-2 mb-2">
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

          {/* Tabel */}
          <div className="w-full overflow-x-auto">
            <table className="table-fixed w-full border border-black text-[9px] sm:text-sm md:text-base">
              <thead>
                <tr className="bg-[#27AE60] text-white">
                  <th className="border border-black p-2 w-[10%] whitespace-normal break-words hidden sm:table-cell">No.</th>
                  <th className="border border-black p-2 w-[15%] whitespace-normal break-words">Tanggal</th>
                  <th className="border border-black p-2 w-[20%] whitespace-normal break-words">Judul Pengaduan</th>
                  <th className="border border-black p-2 w-[20%] whitespace-normal break-words">Kategori</th>
                  <th className="border border-black p-2 w-[20%] whitespace-normal break-words">Status</th>
                  <th className="border border-black p-2 w-[15%] whitespace-normal break-words">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((item, index) => {
                    const readableStatus = statusMap[item.status] || item.status;
                    return (
                      <tr key={item.id} className="bg-white text-center">
                        <td className="border border-black p-2 whitespace-normal break-words hidden sm:table-cell">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="border border-black p-2 whitespace-normal break-words">{new Date(item.created_at).toLocaleDateString("id-ID")}</td>
                        <td className="border border-black p-2 whitespace-normal break-words">{item.title}</td>
                        <td className="border border-black p-2 whitespace-normal break-words">{item.category}</td>
                        <td className={`border border-black p-2 whitespace-normal break-words ${statusColor[readableStatus] || ""}`}>{readableStatus}</td>
                        <td className="border border-black p-2 whitespace-normal break-words">
                          <Link href={`/kepdes/pengaduan/${item.id}`} className="flex flex-col items-center justify-center text-center group text-[9px] sm:text-sm">
                            <Search className="text-[#00A8E8] w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-105 transition-transform" />
                            <span className="text-black group-hover:underline">Buka</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={colSpan} className="bg-white text-center text-black py-4">
                      {data.length === 0 ? "Belum Ada Pengaduan Masyarakat" : filteredData.length === 0 ? "Hasil Pencarian Tidak Ada" : ""}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <div className="flex border border-slate-800 divide-x divide-slate-800 text-slate-800 text-sm rounded overflow-hidden">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 disabled:opacity-50">
                <ChevronsLeft className="w-4 h-4" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 ${currentPage === i + 1 ? "bg-[#27AE60] text-white" : "hover:bg-slate-100"}`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 disabled:opacity-50">
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
