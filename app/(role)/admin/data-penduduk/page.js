"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, Eye, EyeOff, FileUp } from "lucide-react";
import Link from "next/link";
import PropTypes from "prop-types";

const maskNIK = (nik) => nik.slice(0, 6) + "XXXXXX";

function ConfirmDeletePopup({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[270px] text-center shadow-lg">
        <h2 className="text-red-600 text-2xl font-bold mb-3">Hapus Data Penduduk</h2>
        <p className="font-semibold mb-1">Apakah Anda yakin ingin menghapus data warga ini?</p>
        <p className="text-sm text-gray-700 mb-6">Tindakan ini tidak dapat dibatalkan dan data akan dihapus secara permanen dari sistem.</p>
        <div className="flex flex-col items-center gap-y-3">
          <button onClick={onConfirm} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Ya, hapus sekarang
          </button>
          <button onClick={onCancel} className="text-gray-600 hover:underline">
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPendudukPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const itemsPerPage = 10;
  const [colSpan, setColSpan] = useState(6);
  const [searchGlobal, setSearchGlobal] = useState("");
  const [searchFilters, setSearchFilters] = useState({
    nik: "",
    kepalaKeluarga: "",
    dusun: "",
    jumlah: "",
  });

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

  const handleFilterChange = (key, value) => {
    setSearchFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const filteredData = data.filter((item) => {
    const kepalaKeluarga = item.anggota.find((a) => a.hubungan === "Kepala Keluarga")?.nama_lengkap || "";
    const dusun = item.rumah?.dusun || "";
    const jumlah = `${item.jumlah_anggota}`;
    const nomorKK = item.nomor_kk;

    const matchesGlobalSearch =
      nomorKK.toLowerCase().includes(searchGlobal.toLowerCase()) || kepalaKeluarga.toLowerCase().includes(searchGlobal.toLowerCase()) || dusun.toLowerCase().includes(searchGlobal.toLowerCase()) || jumlah.includes(searchGlobal);

    const matchesFilters =
      nomorKK.toLowerCase().includes(searchFilters.nik.toLowerCase()) &&
      kepalaKeluarga.toLowerCase().includes(searchFilters.kepalaKeluarga.toLowerCase()) &&
      dusun.toLowerCase().includes(searchFilters.dusun.toLowerCase()) &&
      jumlah.includes(searchFilters.jumlah);

    return matchesGlobalSearch && matchesFilters;
  });

  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getPaginationRange = () => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // ⬅️ mulai loading
        const token = localStorage.getItem("token");
        const res = await fetch("/api/population", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        const sorted = (json.data || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setData(sorted);
      } catch (err) {
        console.error("Gagal memuat data:", err);
      } finally {
        setLoading(false); // ⬅️ selesai loading
      }
    };

    fetchData();
  }, []);

  const toggleVisibility = (id) => {
    setVisible((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  const handleConfirmedDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/population/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        let errMsg = "Gagal menghapus data.";
        try {
          const errData = await res.json();
          errMsg = errData?.error || errMsg;
        } catch (_) {}
        throw new Error(errMsg);
      }

      setData((prev) => prev.filter((item) => item.id !== deleteId));
    } catch (err) {
      console.error("Gagal menghapus data:", err.message);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className="min-h-full p-8">
        <header>
          <h2 className="sm:text-2xl text-base font-semibold mb-4">Data Kependudukan</h2>
        </header>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="grid grid-cols-2 flex-col sm:flex-row gap-2 sm:gap-6 w-full sm:w-auto">
            <Link href="/admin/data-penduduk/tambah">
              <button className="flex items-center gap-1 px-4 py-2 bg-[#27AE60] text-white rounded-md text-sm hover:bg-green-600 transition w-full sm:w-auto">
                <Plus className="w-5 h-5" strokeWidth={3} />
                <span className="block sm:hidden">Tambah Data</span>
                <span className="hidden sm:block">Tambah Data Penduduk</span>
              </button>
            </Link>
            <Link href="/admin/data-penduduk/import">
              <button className="flex items-center gap-1 px-4 py-2 bg-[#27AE60] text-white rounded-md text-sm hover:bg-green-600 transition w-full sm:w-auto">
                <FileUp className="w-5 h-5" strokeWidth={2.5} />
                Import
              </button>
            </Link>
          </div>

          <div className="flex items-center border border-gray-500 rounded-md px-4 py-2 bg-white text-gray-500 w-full sm:w-auto min-w-0">
            <Search className="w-5 h-5 mr-2" />
            <input type="text" placeholder="Cari" className="flex-1 outline-none text-sm bg-white placeholder-gray-500" value={searchGlobal} onChange={(e) => setSearchGlobal(e.target.value)} />
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="table-fixed w-full border border-black text-[9px] sm:text-sm md:text-base">
            <thead className="bg-[#27AE60] text-white">
              <tr>
                <th className="border border-black p-2 w-[10%] whitespace-normal break-words hidden sm:table-cell">No.</th>
                <th className="border border-black p-2 w-[25%] whitespace-normal break-words">No. KK</th>
                <th className="border border-black p-2 w-[20%] whitespace-normal break-words">Nama Kepala Keluarga</th>
                <th className="border border-black p-2 w-[15%] whitespace-normal break-words">Dusun</th>
                <th className="border border-black p-2 w-[15%] whitespace-normal break-words">Anggota Keluarga</th>
                <th className="border border-black p-2 whitespace-normal break-words sm:w-[160px]">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white text-center">
              {loading ? (
                <tr>
                  <td colSpan={colSpan} className="py-4 italic bg-white">
                    Memuat data...
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item, index) => {
                  const kepalaKeluarga = item.anggota.find((a) => a.hubungan === "Kepala Keluarga");
                  return (
                    <tr key={item.id} className="hover:bg-gray-100">
                      <td className="border border-black p-2 whitespace-normal break-words hidden sm:table-cell">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="border border-black p-2 whitespace-normal break-all">
                        <div className="flex items-center justify-center gap-2">
                          <span>{visible[item.id] ? item.nomor_kk : maskNIK(item.nomor_kk)}</span>
                          <button onClick={() => toggleVisibility(item.id)} className="text-gray-600 hover:text-gray-800" title="Tampilkan/Sembunyikan">
                            {visible[item.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                      <td className="border border-black p-2 whitespace-normal break-words">{kepalaKeluarga?.nama_lengkap || "-"}</td>
                      <td className="border border-black p-2 whitespace-normal break-words">{item.rumah?.dusun || "-"}</td>
                      <td className="border border-black p-2 whitespace-normal break-words">{item.jumlah_anggota} Orang</td>
                      <td className="border border-black p-2 whitespace-normal break-words sm:w-[160px]">
                        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2 sm:gap-4 text-[9px]  sm:text-sm md:text-xs">
                          <Link href={`/admin/data-penduduk/${item.id}`} className="flex flex-row sm:flex-col items-center gap-1 text-blue-600 hover:underline" title="Lihat">
                            <Eye className="w-4 h-4" />
                            <span className="text-black whitespace-nowrap">Lihat</span>
                          </Link>
                          <Link href={`/admin/data-penduduk/${item.id}?mode=edit`} className="flex flex-row sm:flex-col items-center gap-1 text-orange-500 hover:underline" title="Edit">
                            <Pencil className="w-4 h-4" />
                            <span className="text-black whitespace-nowrap">Edit</span>
                          </Link>
                          <button onClick={() => confirmDelete(item.id)} className="flex flex-row sm:flex-col items-center gap-1 text-red-600 hover:underline" title="Hapus">
                            <Trash2 className="w-4 h-4" />
                            <span className="text-black whitespace-nowrap">Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={colSpan} className="py-4 text-black bg-white text-center">
                    Tidak ada data penduduk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-4">
          <div className="flex border border-slate-800 divide-x divide-slate-800 text-slate-800 text-sm rounded overflow-hidden">
            <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 disabled:opacity-50">
              &laquo;
            </button>
            {getPaginationRange().map((page, i) => (
              <button key={i} onClick={() => typeof page === "number" && setCurrentPage(page)} disabled={typeof page !== "number"} className={`px-3 py-1 ${page === currentPage ? "bg-[#27AE60] text-white" : "hover:bg-slate-100"}`}>
                {page === "..." ? "..." : page}
              </button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(p + 1, Math.ceil(filteredData.length / itemsPerPage)))} disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)} className="px-3 py-1 disabled:opacity-50">
              &raquo;
            </button>
          </div>
        </div>
      </div>

      {deleteId && <ConfirmDeletePopup onConfirm={handleConfirmedDelete} onCancel={cancelDelete} />}
    </div>
  );
}

ConfirmDeletePopup.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
