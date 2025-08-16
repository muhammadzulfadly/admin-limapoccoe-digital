"use client";

import { BadgeCheck, UserCheck, Search } from "lucide-react";
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

  // urutan dan label tombol
  const STATUS_TABS = ["Semua", "Butuh Konfirmasi", "Selesai"];

  // warna tombol aktif (on) mengikuti gambar
  const ACTIVE_TAB_CLASS = {
    Semua: "bg-[#2B3A4A] text-white",
    "Butuh Konfirmasi": "bg-[#016E84] text-white",
    Selesai: "bg-[#34C759] text-white",
  };

const mapStatus = (raw) => statusMap[raw] || raw;

export default function Page() {
  const { jenisSurat } = useParams();
  const [judul, setJudul] = useState("Memuat...");
  const [slug, setSlug] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
    const [colSpan, setColSpan] = useState(6);
  const [activeTab, setActiveTab] = useState("Semua"); // selalu ada satu yang aktif
  const [filters, setFilters] = useState({
    date: "",
    name: "",
    status: "",
    jenis: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const router = useRouter();

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
  const jenis = item.surat?.nama_surat?.toLowerCase() || judul.toLowerCase();

  // normalisasi & label status
  const statusLabel = mapStatus((item.status || "").toLowerCase()); // "Butuh Konfirmasi" / "Selesai"

  // keyword global
  const query = searchQuery.toLowerCase();
  const matchQuery =
    tgl.includes(query) ||
    nama.includes(query) ||
    jenis.includes(query);

  // filter status via tab
  const matchStatus = activeTab === "Semua" ? true : statusLabel === activeTab;

  return matchQuery && matchStatus;
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
              className="outline-none text-xs sm:text-sm w-28 bg-white placeholder-gray-500"
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
                  <td colSpan={colSpan} className="text-center py-4 italic bg-white text-black">
                    Memuat data...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                    <td colSpan={colSpan} className="bg-white text-center text-black py-4">
                      {!loading && data.length === 0 ? `Belum Ada Pengajuan Surat ${judul}` : "Hasil Pencarian Tidak Ada"}
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