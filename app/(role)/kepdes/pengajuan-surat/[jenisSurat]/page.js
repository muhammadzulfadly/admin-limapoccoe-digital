"use client";

import { BadgeCheck, UserCheck, Search, SlidersHorizontal } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import PropTypes from "prop-types";

const statusMap = {
  approved: "Selesai",
  confirmed: "Butuh Konfirmasi",
};

const statusStyle = {
  Selesai: "text-[#34C759] font-semibold",
  "Butuh Konfirmasi": "text-[#016E84] font-semibold",
};

const mapStatus = (raw) => statusMap[raw] || raw;

export default function Page() {
  const { jenisSurat } = useParams();
  const [judul, setJudul] = useState("Memuat...");
  const [slug, setSlug] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    date: "",
    name: "",
    status: "",
    jenis: "",
  });
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const router = useRouter();

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
        setData((result.pengajuan_surat || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      } catch (err) {
        console.error("Gagal ambil data pengajuan:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const formatTanggal = (tgl) => {
    const d = new Date(tgl);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  const filteredData = data.filter((item) => {
    const tgl = formatTanggal(item.created_at);
    const nama = item.user?.name?.toLowerCase() || "";
    const status = mapStatus(item.status).toLowerCase();
    const jenis = item.surat?.nama_surat?.toLowerCase() || judul.toLowerCase();
    const query = searchQuery.toLowerCase();

    return (
      tgl.includes(filters.date) &&
      nama.includes(filters.name.toLowerCase()) &&
      status.includes(filters.status.toLowerCase()) &&
      jenis.includes(filters.jenis.toLowerCase()) &&
      (tgl.includes(query) || nama.includes(query) || status.includes(query) || jenis.includes(query))
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const ringkasan = {
    butuhKonfirmasi: data.filter((d) => mapStatus(d.status) === "Butuh Konfirmasi").length,
    selesai: data.filter((d) => mapStatus(d.status) === "Selesai").length,
  };

  return (
    <div>
      <div className="min-h-full p-8">
        <h2 className="sm:text-2xl text-base font-semibold mb-4">Pengajuan Surat / {judul}</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <Stat label="Butuh Konfirmasi" value={ringkasan.butuhKonfirmasi} icon={<BadgeCheck size={50} className="text-teal-600" />} />
          <Stat label="Selesai" value={ringkasan.selesai} icon={<UserCheck size={50} className="text-[#27AE60]" />} />
        </div>

        <div className="border-t border-gray-400 mb-6 mt-6" />

        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-4 mb-6">
          <div className="flex items-center border border-gray-500 rounded-md px-4 py-2 bg-white text-gray-500 w-full sm:w-auto min-w-0">
            <Search className="w-5 h-5 mr-2" />
            <input
              type="text"
              placeholder="Cari"
              className="outline-none text-sm w-28 bg-white placeholder-gray-500"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            <button onClick={() => setShowFilter((prev) => !prev)}>
              <SlidersHorizontal className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        {showFilter && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <input
              type="text"
              placeholder="Filter Tanggal"
              className="px-3 py-2 border border-gray-400 rounded-md text-sm"
              value={filters.date}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, date: e.target.value }));
                setCurrentPage(1);
              }}
            />
            <input
              type="text"
              placeholder="Filter Nama"
              className="px-3 py-2 border border-gray-400 rounded-md text-sm"
              value={filters.name}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, name: e.target.value }));
                setCurrentPage(1);
              }}
            />

            <input
              type="text"
              placeholder="Filter Jenis Surat"
              className="px-3 py-2 border border-gray-400 rounded-md text-sm"
              value={filters.jenis}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, jenis: e.target.value }));
                setCurrentPage(1);
              }}
            />
            <input
              type="text"
              placeholder="Filter Status"
              className="px-3 py-2 border border-gray-400 rounded-md text-sm"
              value={filters.status}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, status: e.target.value }));
                setCurrentPage(1);
              }}
            />
          </div>
        )}

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
                  <td colSpan={5} className="text-center py-4 italic bg-white text-black">
                    Memuat data...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 bg-white text-black">
                    Data tidak ditemukan
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => {
                  const statusLabel = mapStatus(item.status);
                  const actionLabel = "Buka";
                  return (
                    <tr key={item.id} className="bg-white text-center">
                      <td className="border border-black p-2 whitespace-normal break-words hidden sm:table-cell">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="border border-black p-2 whitespace-normal break-words">{formatTanggal(item.created_at)}</td>
                      <td className="border border-black p-2 whitespace-normal break-words">{item.user?.name || "-"}</td>
                      <td className="border border-black p-2 whitespace-normal break-words">{item.surat?.nama_surat || judul}</td>
                      <td className={`border border-black p-2 whitespace-normal break-words ${statusStyle[statusLabel] || ""}`}>{statusLabel}</td>
                      <td className="border border-black p-2 whitespace-normal break-words">
                        <Link href={`/kepdes/pengajuan-surat/${jenisSurat}/${item.id}?status=${item.status}`} className="flex flex-col items-center justify-center text-center group text-[9px] sm:text-sm">
                          <Search className="text-[#00A8E8] w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-105 transition-transform" />
                          <span className="text-black group-hover:underline">Buka</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <div className="flex border border-slate-800 divide-x divide-slate-800 text-slate-800 text-sm rounded overflow-hidden">
            <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 disabled:opacity-50">
              {"<"}
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 ${currentPage === i + 1 ? "bg-[#27AE60] text-white" : "hover:bg-slate-100"}`}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 disabled:opacity-50">
              {">"}
            </button>
          </div>
        </div>
      </div>
    </div>
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