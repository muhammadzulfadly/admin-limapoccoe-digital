"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, Eye, Link2 } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [colSpan, setColSpan] = useState(5);
  const [activeTab, setActiveTab] = useState("Semua"); // selalu ada satu yang aktif
  const [popupDeleteId, setPopupDeleteId] = useState(null); // id item yang ingin dihapus

  // urutan dan label tombol
  const STATUS_TABS = ["Semua", "Berita", "Wisata", "Galeri", "Produk", "Banner"];

  // warna tombol aktif (on) mengikuti gambar
  const ACTIVE_TAB_CLASS = {
    Semua: "bg-[#2B3A4A] text-white",
    Berita: "bg-[#2B3A4A] text-white",
    Wisata: "bg-[#2B3A4A] text-white",
    Galeri: "bg-[#2B3A4A] text-white",
    Produk: "bg-[#2B3A4A] text-white",
    Banner: "bg-[#2B3A4A] text-white",
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        // breakpoint md: di Tailwind
        setColSpan(4); // mobile
      } else {
        setColSpan(5); // desktop
      }
    };

    // jalankan pertama kali
    handleResize();

    // pasang event listener
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await fetch("/api/information", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (res.ok) {
        const filtered = (json.data || []).filter((item) => item.kategori?.toLowerCase() !== "pengumuman");
        const sorted = filtered.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        setData(sorted);
      } else {
        console.error("Gagal mengambil data:", json.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/information/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (res.ok) {
        fetchData();
      } else {
        alert(json.error || "Gagal menghapus data");
      }
    } catch (error) {
      alert("Terjadi kesalahan: " + error.message);
    }
  }

  function formatTanggal(tanggalStr) {
    const date = new Date(tanggalStr);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  }

  const filteredData = data.filter((item) => {
    // Filter berdasarkan tab kategori
    if (activeTab !== "Semua" && item.kategori?.toLowerCase() !== activeTab.toLowerCase()) {
      return false;
    }

    const judul = item.judul?.toLowerCase() || "";
    const kategori = item.kategori?.toLowerCase() || "";
    const tanggal = formatTanggal(item.updated_at); // format: dd/mm/yy

    return judul.includes(searchQuery.toLowerCase()) || kategori.includes(searchQuery.toLowerCase()) || tanggal.includes(searchQuery);
  });

  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
    <div className="min-h-full p-8">
      <h2 className="sm:text-2xl text-base font-semibold mb-4">Informasi Desa</h2>
      <div className="grid grid-cols-2 sm:flex sm:justify-between sm:items-center gap-4 mb-6">
        <div className="grid grid-cols-2 flex-col sm:flex-row gap-2 sm:gap-6 w-full sm:w-auto">
          <Link href="/admin/informasi-desa/tambah">
            <button className="flex items-center gap-1 px-4 py-2 bg-[#27AE60] text-white rounded-md text-sm hover:bg-green-600 transition w-full sm:w-auto">
              <Plus className="w-5 h-5" strokeWidth={3} />
              Tambah Baru
            </button>
          </Link>
          <Link href="/admin/informasi-desa/tautan">
            <button className="flex items-center gap-1 px-4 py-2 bg-[#27AE60] text-white rounded-md text-sm hover:bg-green-600 transition w-full sm:w-auto">
              <Link2 className="w-5 h-5" strokeWidth={3} />
              Tautan</button>
          </Link>
        </div>

        <div className="flex items-center border border-gray-500 rounded-md px-4 py-2 bg-white text-gray-500 w-full sm:w-auto min-w-0">
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
        </div>
      </div>

      {/* Tombol status */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-1 sm:gap-2 mb-2">
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

      <>
        <div className="w-full overflow-x-auto">
          <table className="table-fixed w-full border border-black text-[9px] sm:text-sm md:text-base">
            <thead className="bg-[#27AE60] text-white">
              <tr>
                <th className="border border-black p-2 w-[10%] whitespace-normal break-words hidden sm:table-cell">No.</th>
                <th className="border border-black p-2 w-[15%] whitespace-normal break-words">Tanggal</th>
                <th className="border border-black p-2 w-[25%] whitespace-normal break-words">Kategori</th>
                <th className="border border-black p-2 w-[35%] whitespace-normal break-words">Judul</th>
                <th className="border border-black p-2 whitespace-normal break-words sm:w-[160px]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={colSpan} className="py-4 text-center italic bg-white">
                    Memuat data...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={colSpan} className="text-center py-4 bg-white">
                    {data.length === 0 ? "Belum Ada Informasi Desa" : "Hasil Pencarian Tidak Ada"}
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr key={item.id} className="bg-white text-center">
                    <td className="border border-black p-2 whitespace-normal break-words hidden sm:table-cell">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="border border-black p-2 whitespace-normal break-words">{formatTanggal(item.created_at)}</td>
                    <td className="border border-black p-2 whitespace-normal break-words capitalize">{item.kategori}</td>
                    <td className="border border-black p-2 whitespace-normal break-words">{item.judul}</td>
                    <td className="border border-black p-2 whitespace-normal break-words sm:w-[160px]">
                      <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2 sm:gap-4 text-[9px]  sm:text-sm md:text-xs">
                        <Link href={`/admin/informasi-desa/${item.id}`} className="flex flex-row sm:flex-col items-center gap-1 text-blue-600 hover:underline">
                          <Eye className="w-4 h-4" />
                          <span className="text-black whitespace-nowrap">Lihat</span>
                        </Link>

                        <Link href={`/admin/informasi-desa/${item.id}/?mode=edit`} className="flex flex-row sm:flex-col items-center gap-1 text-orange-500 hover:underline">
                          <Pencil className="w-4 h-4" />
                          <span className="text-black whitespace-nowrap">Edit</span>
                        </Link>

                        <button onClick={() => setPopupDeleteId(item.id)} className="flex flex-row sm:flex-col items-center gap-1 text-red-600 hover:underline">
                          <Trash2 className="w-4 h-4" />
                          <span className="text-black whitespace-nowrap">Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <div className="flex border border-slate-800 divide-x divide-slate-800 text-slate-800 text-sm rounded overflow-hidden">
            <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 disabled:opacity-50">
              &laquo;
            </button>
            {getPaginationRange().map((page, index) => (
              <button key={index} onClick={() => typeof page === "number" && setCurrentPage(page)} disabled={typeof page !== "number"} className={`px-3 py-1 ${page === currentPage ? "bg-[#27AE60] text-white" : "hover:bg-slate-100"}`}>
                {page}
              </button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 disabled:opacity-50">
              &raquo;
            </button>
          </div>
        </div>
      </>
      {popupDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[270px] text-center shadow-lg">
            <h2 className="text-red-600 text-2xl font-bold mb-3">Hapus Informasi</h2>
            <p className="font-semibold mb-1">Apakah Anda yakin ingin menghapus informasi ini?</p>
            <p className="text-sm text-gray-700 mb-6">Tindakan ini tidak dapat dibatalkan dan data akan dihapus secara permanen dari sistem.</p>
            <div className="flex flex-col items-center gap-y-3">
              <button
                onClick={() => {
                  handleDelete(popupDeleteId);
                  setPopupDeleteId(null);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Ya, hapus sekarang
              </button>
              <button onClick={() => setPopupDeleteId(null)} className="text-gray-600 hover:underline">
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
