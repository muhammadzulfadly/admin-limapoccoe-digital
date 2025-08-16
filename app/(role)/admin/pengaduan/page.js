"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import MenungguCard from "@/components/card/Menunggu";
import DiterimaCard from "@/components/card/DiTerima";
import SelesaiCard from "@/components/card/Selesai";

const statusMap = {
  waiting: "Menunggu",
  processed: "Diterima",
  approved: "Selesai",
};

const statusColor = {
  Selesai: "text-[#34C759] font-semibold",
  Diterima: "text-[#016E84] font-semibold",
  Menunggu: "text-[#FF9500] font-semibold",
};

// urutan dan label tombol
const STATUS_TABS = ["Semua", "Menunggu", "Diterima", "Selesai"];

// warna tombol aktif (on) mengikuti gambar
const ACTIVE_TAB_CLASS = {
  Semua: "bg-[#2B3A4A] text-white",
  Menunggu: "bg-[#FF9500] text-white",
  Diterima: "bg-[#016E84] text-white",
  Selesai: "bg-[#34C759] text-white",
};

export default function PengaduanPage() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchGlobal, setSearchGlobal] = useState("");
  const [colSpan, setColSpan] = useState(6);
  const [activeTab, setActiveTab] = useState("Semua"); // selalu ada satu yang aktif

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchAduan = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/complaint", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      const sorted = (result.aduan || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setData(sorted);
    };

    fetchAduan();
  }, []);

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

  const filteredData = data.filter((item) => {
    const formattedDate = new Date(item.created_at).toLocaleDateString("id-ID");
    const readableStatus = statusMap[item.status] || item.status; // normalisasi status

    // pencarian global: judul, kategori, tanggal
    const matchGlobal = item.title.toLowerCase().includes(searchGlobal.toLowerCase()) || item.category.toLowerCase().includes(searchGlobal.toLowerCase()) || formattedDate.includes(searchGlobal);

    // filter status via tab
    const matchStatus = activeTab === "Semua" ? true : readableStatus === activeTab;

    return matchGlobal && matchStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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

  return (
    <div className="flex h-full">
      <div className="flex-1 p-8 space-y-8">
        <section>
          <h2 className="sm:text-2xl text-base font-semibold mb-4">Pengaduan</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {Object.values(statusMap).map((status) => {
              const jumlah = data.filter((item) => statusMap[item.status] === status).length;
              const Icon = status === "Menunggu" ? MenungguCard : status === "Diterima" ? DiterimaCard : SelesaiCard;
              return (
                <div key={status}>
                  <Icon count={jumlah} />
                </div>
              );
            })}
          </div>

          <hr className="border-gray-300 border-y mb-6" />

          <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-500 rounded-md px-4 py-2 bg-white text-gray-500 w-full sm:w-auto min-w-0">
              <Search className="w-5 h-5 mr-2" />
              <input type="text" placeholder="Cari" className="flex-1 outline-none text-sm bg-white placeholder-gray-500" value={searchGlobal} onChange={(e) => setSearchGlobal(e.target.value)} />
            </div>
          </div>

          {/* Tombol status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 sm:gap-2 mb-2">
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
                  <th className="border border-black p-2 w-[20%] whitespace-normal break-words">Judul Pengaduan</th>
                  <th className="border border-black p-2 w-[20%] whitespace-normal break-words">Kategori</th>
                  <th className="border border-black p-2 w-[20%] whitespace-normal break-words">Status</th>
                  <th className="border border-black p-2 w-[15%] whitespace-normal break-words">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item, index) => {
                  const readableStatus = statusMap[item.status] || item.status;
                  return (
                    <tr key={item.id} className="bg-white text-center align-top">
                      <td className="border border-black p-2 whitespace-normal break-words hidden sm:table-cell">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="border border-black p-2 whitespace-normal break-words">{new Date(item.created_at).toLocaleDateString("id-ID")}</td>
                      <td className="border border-black p-2 whitespace-normal break-words">{item.title}</td>
                      <td className="border border-black p-2 whitespace-normal break-words">{item.category}</td>
                      <td className={`border border-black p-2 whitespace-normal break-words ${statusColor[readableStatus] || ""}`}>{readableStatus}</td>
                      <td className="border border-black p-2 whitespace-normal break-words">
                        <Link href={`/admin/pengaduan/${item.id}`} className="flex flex-col items-center justify-center text-center group text-[9px] sm:text-sm">
                          <Search className="text-[#00A8E8] w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-105 transition-transform" />
                          <span className="text-black group-hover:underline">Buka</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={colSpan} className="bg-white text-center text-black py-4">
                      {data.length === 0 ? "Belum Ada Pengaduan Masyarakat" : "Hasil Pencarian Tidak Ada"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-6">
            <div className="flex border border-slate-800 divide-x divide-slate-800 text-slate-800 text-sm rounded overflow-hidden">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 disabled:opacity-50">
                &laquo;
              </button>

              {getPaginationRange().map((page, i) => (
                <button key={i} onClick={() => typeof page === "number" && setCurrentPage(page)} disabled={typeof page !== "number"} className={`px-3 py-1 ${page === currentPage ? "bg-[#27AE60] text-white" : "hover:bg-slate-100"}`}>
                  {page === "..." ? "..." : page}
                </button>
              ))}

              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 disabled:opacity-50">
                &raquo;
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
