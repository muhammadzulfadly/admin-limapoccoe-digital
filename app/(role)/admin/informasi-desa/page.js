"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setData(json.data || []);
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
    if (!confirm("Apakah Anda yakin ingin menghapus informasi ini?")) return;

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
        alert(json.message || "Berhasil dihapus");
        // Refresh data setelah hapus
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

  return (
    <div className="min-h-full p-8">
      <h2 className="sm:text-2xl text-base font-semibold mb-4">Informasi Desa</h2>

      <div className="grid grid-cols-2 sm:flex sm:justify-between sm:items-center gap-4 mb-6">
        <Link href="/admin/informasi-desa/tambah">
          <button className="flex items-center gap-1 px-4 py-2 bg-[#27AE60] text-white rounded-md text-sm hover:bg-green-600 transition w-full sm:w-auto">
            <Plus className="w-5 h-5" strokeWidth={3} />
            Tambah Baru
          </button>
        </Link>

        <div className="flex items-center border border-gray-500 rounded-md px-4 py-2 bg-white text-gray-500 w-full sm:w-auto">
          <Search className="w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Cari"
            className="flex-1 outline-none text-sm bg-white placeholder-gray-500"
          />
        </div>
      </div>

      {loading && (
        <div className="text-center text-gray-500">Memuat data...</div>
      )}

      {!loading && (
        <div className="w-full overflow-x-auto">
          <table className="table-fixed w-full border border-black text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#27AE60] text-white">
                <th className="border border-black p-2 w-1/5">Tanggal</th>
                <th className="border border-black p-2 w-1/5">Kategori</th>
                <th className="border border-black p-2 w-1/5">Judul</th>
                <th className="border border-black p-2 w-1/5">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-4 text-gray-500 bg-white italic"
                  >
                    Belum ada Informasi Desa
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="bg-white text-center">
                    <td className="border border-black p-2 whitespace-normal break-words">
                      {formatTanggal(item.updated_at)}
                    </td>
                    <td className="border border-black p-2 whitespace-normal break-words capitalize">
                      {item.kategori}
                    </td>
                    <td className="border border-black p-2 whitespace-normal break-words">{item.judul}</td>
                    <td className="border border-black p-2 whitespace-normal break-words">
                      <div className="flex flex-col sm:flex-row justify-center items-start gap-3 sm:gap-4 text-[9px] sm:text-sm md:text-xs">
                        <Link
                          href={`/admin/informasi-desa/${item.id}`}
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-black">Lihat</span>
                        </Link>

                        <Link
                          href={`/admin/informasi-desa/${item.id}/?mode=edit`}
                          className="flex items-center gap-1 text-orange-500 hover:underline"
                        >
                          <Pencil className="w-4 h-4" />
                          <span className="text-black">Edit</span>
                        </Link>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="flex items-center gap-1 text-red-600 hover:underline"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-black">Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
