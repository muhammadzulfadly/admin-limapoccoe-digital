"use client";

import { Search, SlidersHorizontal, FileDown, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ButuhKonfirmasiCard from "@/components/card/ButuhKonfirmasi";
import SelesaiCard from "@/components/card/Selesai";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const [pengajuan, setPengajuan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchGlobal, setSearchGlobal] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    date: "",
    name: "",
    status: "",
    jenis: "",
  });

  const itemsPerPage = 5;
  const router = useRouter();

  const statusMap = {
    approved: "Selesai",
    confirmed: "Butuh Konfirmasi",
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
    const statusLabel = mapStatus(item.status);
    const tanggal = formatTanggal(item.created_at);
    const nama = item.user?.name || "";
    const jenis = item.suratNama || "";

    const matchGlobal = tanggal.includes(searchGlobal) || nama.toLowerCase().includes(searchGlobal.toLowerCase()) || statusLabel.toLowerCase().includes(searchGlobal.toLowerCase()) || jenis.toLowerCase().includes(searchGlobal.toLowerCase());

    const matchFilter =
      tanggal.includes(searchFilters.date) &&
      nama.toLowerCase().includes(searchFilters.name.toLowerCase()) &&
      statusLabel.toLowerCase().includes(searchFilters.status.toLowerCase()) &&
      jenis.toLowerCase().includes(searchFilters.jenis.toLowerCase());

    return matchGlobal && matchFilter;
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
        <button key={1} onClick={() => setCurrentPage(1)} className={`px-3 py-1 ${currentPage === 1 ? "bg-green-600 text-white" : "hover:bg-slate-100"}`}>
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
        <button key={i} onClick={() => setCurrentPage(i)} className={`px-3 py-1 ${currentPage === i ? "bg-green-600 text-white" : "hover:bg-slate-100"}`}>
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
        <button key={totalPages} onClick={() => setCurrentPage(totalPages)} className={`px-3 py-1 ${currentPage === totalPages ? "bg-green-600 text-white" : "hover:bg-slate-100"}`}>
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 p-8 space-y-8 bg-[#EDF0F5]">
        <section>
          <h2 className="font-semibold text-2xl mb-4">Pengajuan Surat</h2>

          {loading ? (
            <p className="text-gray-500 italic">Memuat data...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <ButuhKonfirmasiCard count={pengajuan.filter((x) => x.status === "confirmed").length} />
              <SelesaiCard count={pengajuan.filter((x) => x.status === "approved").length} />
            </div>
          )}

          <hr className="border-gray-300 border-y mt-6 mb-6" />

          <div className="flex justify-end items-center mb-4">
            <div className="flex items-center border border-gray-500 rounded-md px-4 py-2 bg-white text-gray-500">
              <Search className="w-5 h-5 mr-2" />
              <input type="text" placeholder="Cari" className="flex-1 outline-none text-sm bg-white placeholder-gray-500" value={searchGlobal} onChange={(e) => setSearchGlobal(e.target.value)} />
              <button onClick={() => setShowFilter(!showFilter)}>
                <SlidersHorizontal className={`w-4 h-4 ml-2 cursor-pointer transition-colors ${showFilter ? "text-green-600" : "text-gray-500"}`} />
              </button>
            </div>
          </div>

          {showFilter && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <input type="text" placeholder="Filter Tanggal" className="px-4 py-2 border border-gray-400 rounded-md text-sm" value={searchFilters.date} onChange={(e) => setSearchFilters({ ...searchFilters, date: e.target.value })} />
              <input type="text" placeholder="Filter Nama" className="px-4 py-2 border border-gray-400 rounded-md text-sm" value={searchFilters.name} onChange={(e) => setSearchFilters({ ...searchFilters, name: e.target.value })} />
              <input type="text" placeholder="Filter Jenis Surat" className="px-4 py-2 border border-gray-400 rounded-md text-sm" value={searchFilters.jenis} onChange={(e) => setSearchFilters({ ...searchFilters, jenis: e.target.value })} />
              <input type="text" placeholder="Filter Status" className="px-4 py-2 border border-gray-400 rounded-md text-sm" value={searchFilters.status} onChange={(e) => setSearchFilters({ ...searchFilters, status: e.target.value })} />
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="table-auto w-full border border-black">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="border border-black p-2 w-[5%]">No.</th>
                  <th className="px-4 py-2 w-1/5 border border-black">Tanggal</th>
                  <th className="px-4 py-2 w-1/5 border border-black">Nama</th>
                  <th className="px-4 py-2 w-1/5 border border-black">Jenis Surat</th>
                  <th className="px-4 py-2 w-1/5 border border-black">Status</th>
                  <th className="px-4 py-2 w-1/5 border border-black">Aksi</th>
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
                    <td colSpan={6} className="bg-white text-center text-black py-4">
                      Belum ada proses pengajuan surat
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, index) => {
                    const statusLabel = mapStatus(item.status);
                    const actionLabel = statusLabel === "Selesai" ? "Unduh" : "Buka";
                    return (
                      <tr key={item.id} className="bg-white text-center">
                        <td className="border border-black p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="px-4 py-2 border border-black">{formatTanggal(item.created_at)}</td>
                        <td className="px-4 py-2 border border-black">{item.user?.name || "-"}</td>
                        <td className="px-4 py-2 border border-black">{item.suratNama || "-"}</td>
                        <td className={`px-4 py-2 border border-black ${statusStyle[statusLabel] || ""}`}>{statusLabel}</td>
                        <td className="px-4 py-2 border border-black">
                          <div className="flex justify-center items-center gap-1">
                            <button onClick={() => router.push(`/admin/pengajuan-surat/${item.suratSlug}/${item.id}`)} className="flex items-center gap-1 text-sm text-black hover:underline">
                              {iconStyle[actionLabel]}
                              <span>{actionLabel}</span>
                            </button>
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
  );
}
