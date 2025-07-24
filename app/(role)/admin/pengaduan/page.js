"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
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

export default function PengaduanPage() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [searchGlobal, setSearchGlobal] = useState("");
  const [searchFilters, setSearchFilters] = useState({
    title: "",
    category: "",
    status: "",
    date: "",
  });

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

  const filteredData = data.filter((item) => {
    const readableStatus = statusMap[item.status] || item.status;
    const formattedDate = new Date(item.created_at).toLocaleDateString("id-ID");

    const matchGlobal =
      item.title.toLowerCase().includes(searchGlobal.toLowerCase()) ||
      item.category.toLowerCase().includes(searchGlobal.toLowerCase()) ||
      readableStatus.toLowerCase().includes(searchGlobal.toLowerCase()) ||
      formattedDate.includes(searchGlobal);

    const matchFilters =
      item.title.toLowerCase().includes(searchFilters.title.toLowerCase()) &&
      item.category.toLowerCase().includes(searchFilters.category.toLowerCase()) &&
      readableStatus.toLowerCase().includes(searchFilters.status.toLowerCase()) &&
      formattedDate.includes(searchFilters.date);

    return matchGlobal && matchFilters;
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
              <button onClick={() => setShowFilter(!showFilter)}>
                <SlidersHorizontal className={`w-4 h-4 ml-2 cursor-pointer transition-colors ${showFilter ? "text-[#27AE60]" : "text-gray-500"}`} />
              </button>
            </div>
          </div>

          {showFilter && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <input type="text" placeholder="Filter Tanggal" className="px-4 py-2 border border-gray-400 rounded-md text-sm" value={searchFilters.date} onChange={(e) => setSearchFilters({ ...searchFilters, date: e.target.value })} />
              <input type="text" placeholder="Filter Judul" className="px-4 py-2 border border-gray-400 rounded-md text-sm" value={searchFilters.title} onChange={(e) => setSearchFilters({ ...searchFilters, title: e.target.value })} />
              <input
                type="text"
                placeholder="Filter Kategori"
                className="px-4 py-2 border border-gray-400 rounded-md text-sm"
                value={searchFilters.category}
                onChange={(e) =>
                  setSearchFilters({
                    ...searchFilters,
                    category: e.target.value,
                  })
                }
              />
              <input type="text" placeholder="Filter Status" className="px-4 py-2 border border-gray-400 rounded-md text-sm" value={searchFilters.status} onChange={(e) => setSearchFilters({ ...searchFilters, status: e.target.value })} />
            </div>
          )}

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
                    <td colSpan={6} className="bg-white text-center text-black py-4">
                      Belum ada proses pengaduan
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
