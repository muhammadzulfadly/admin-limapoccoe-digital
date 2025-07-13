"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, ChevronsLeft, ChevronsRight } from "lucide-react";
import Link from "next/link";
import DiterimaCard from "@/components/card/DiTerima";
import SelesaiCard from "@/components/card/Selesai";

const statusMap = {
  processed: "Diterima",
  approved: "Selesai",
};

const statusColor = {
  Selesai: "text-green-600 font-semibold",
  Diterima: "text-teal-800 font-semibold",
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
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchAduan = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/complaint", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      const filteredData = (result.aduan || []).filter((item) =>
        ["processed", "approved"].includes(item.status)
      );
      setData(filteredData);
    };

    fetchAduan();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const filteredData = data.filter((item) => {
    const statusReadable = statusMap[item.status] || item.status;
    const dateFormatted = new Date(item.created_at).toLocaleDateString("id-ID");
    const query = searchQuery.toLowerCase();

    return (
      item.title.toLowerCase().includes(filters.title.toLowerCase()) &&
      item.category.toLowerCase().includes(filters.category.toLowerCase()) &&
      statusReadable.toLowerCase().includes(filters.status.toLowerCase()) &&
      dateFormatted.includes(filters.date) &&
      (
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        statusReadable.toLowerCase().includes(query) ||
        dateFormatted.includes(query)
      )
    );
  });

  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="flex h-full">
      <div className="flex-1 p-8 space-y-8 bg-[#EDF0F5]">
        <section>
          <h2 className="font-semibold text-2xl mb-4">Pengaduan</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
          <div className="flex justify-end items-center mb-4">
            <div className="flex items-center border border-gray-500 rounded-md px-4 py-2 bg-white text-gray-500">
              <Search className="w-5 h-5 mr-2" />
              <input
                type="text"
                placeholder="Cari"
                className="flex-1 outline-none text-sm bg-white placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <button onClick={() => setShowFilter(!showFilter)}>
                <SlidersHorizontal className={`w-4 h-4 ml-2 ${showFilter ? "text-green-600" : ""}`} />
              </button>
            </div>
          </div>

          {/* Filter tambahan */}
          {showFilter && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <input
                type="text"
                placeholder="Filter Tanggal"
                className="px-4 py-2 border border-gray-400 rounded-md text-sm"
                value={filters.date}
                onChange={(e) => handleFilterChange("date", e.target.value)}
              />
              <input
                type="text"
                placeholder="Filter Judul"
                className="px-4 py-2 border border-gray-400 rounded-md text-sm"
                value={filters.title}
                onChange={(e) => handleFilterChange("title", e.target.value)}
              />
              <input
                type="text"
                placeholder="Filter Kategori"
                className="px-4 py-2 border border-gray-400 rounded-md text-sm"
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              />
              <input
                type="text"
                placeholder="Filter Status"
                className="px-4 py-2 border border-gray-400 rounded-md text-sm"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              />

            </div>
          )}

          {/* Tabel */}
          <table className="w-full table-fixed border border-black">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="border border-black p-2 w-[5%]">No.</th>
                <th className="border border-black p-2 w-1/6">Tanggal</th>
                <th className="border border-black p-2 w-1/6">Judul Pengaduan</th>
                <th className="border border-black p-2 w-1/6">Kategori</th>
                <th className="border border-black p-2 w-1/6">Status</th>
                <th className="border border-black p-2 w-1/6">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => {
                  const readableStatus = statusMap[item.status] || item.status;
                  return (
                    <tr key={index} className="bg-white text-center">
                      <td className="border border-black p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="border border-black p-2">{new Date(item.created_at).toLocaleDateString("id-ID")}</td>
                      <td className="border border-black p-2">{item.title}</td>
                      <td className="border border-black p-2">{item.category}</td>
                      <td className={`border border-black p-2 ${statusColor[readableStatus] || ""}`}>
                        {readableStatus}
                      </td>
                      <td className="border border-black p-2">
                        <Link href={`/kepdes/pengaduan/${item.id}`} className="flex justify-center items-center gap-1">
                          <Search className="text-blue-400" />
                          <span className="text-sm text-black hover:underline">Buka</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="bg-white text-center text-black py-4">
                    Tidak ditemukan pengaduan yang sesuai
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <div className="flex border border-slate-800 divide-x divide-slate-800 text-slate-800 text-sm rounded overflow-hidden">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 disabled:opacity-50"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 ${currentPage === i + 1 ? "bg-green-700 text-white" : "hover:bg-slate-100"}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 disabled:opacity-50"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
