"use client";

import { useEffect, useState } from "react";
import { Plus, Search, SlidersHorizontal, Pencil, Trash2, Eye, EyeOff, FileUp } from "lucide-react";
import Link from "next/link";

const maskNIK = (nik) => nik.slice(0, 6) + "XXXXXX";

export default function DashboardPendudukPage() {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState({}); // state untuk visibilitas per id

  useEffect(() => {
    const fetchData = async () => {
      try {
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

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Yakin ingin menghapus seluruh data keluarga ini?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/population/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ Jika response tidak OK
      if (!res.ok) {
        let errMsg = "Gagal menghapus data.";
        try {
          const errData = await res.json();
          errMsg = errData?.error || errMsg;
        } catch (_) {
          // body kosong, gunakan pesan default
        }
        throw new Error(errMsg);
      }

      alert("Data berhasil dihapus.");
      setData((prev) => prev.filter((item) => item.id !== id)); // hapus dari state
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 bg-gray-100 p-8">
        <header>
          <h1 className="text-xl font-bold mb-3">Dashboard Data Kependudukan</h1>
        </header>

        <div className="flex justify-between items-center mb-6">
          {/* Grup tombol kiri */}
          <div className="flex items-center gap-2">
            <Link href="/admin/data-penduduk/tambah">
              <button className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition">
                <Plus className="w-5 h-5" strokeWidth={3} />
                Tambah Data Penduduk
              </button>
            </Link>
            <Link href="/admin/data-penduduk/import">
              <button className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition">
                <FileUp className="w-5 h-5" strokeWidth={2.5} />
                Import
              </button>
            </Link>
          </div>

          {/* Input search kanan */}
          <div className="flex justify-end">
            <div className="flex items-center border border-gray-500 rounded-md px-4 py-2 bg-white text-gray-500 transition-colors w-72">
              <Search className="w-5 h-5 mr-2" />
              <input type="text" placeholder="Masukkan NIK Penduduk" className="flex-1 outline-none text-sm bg-white placeholder-gray-500" />
              <SlidersHorizontal className="w-4 h-4 ml-2" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto mb-10">
          <table className="w-full table-fixed border border-black text-sm">
            <thead className="bg-[#27AE60] text-white">
              <tr>
                <th className="border border-black p-2 w-[5%]">No.</th>
                <th className="border border-black p-2 w-[25%]">No. KK</th>
                <th className="border border-black p-2 w-[25%]">Nama Kepala Keluarga</th>
                <th className="border border-black p-2 w-[20%]">Dusun</th>
                <th className="border border-black p-2 w-[10%]">Jumlah</th>
                <th className="border border-black p-2 w-[15%]">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white text-center">
              {data.map((item, index) => {
                const kepalaKeluarga = item.anggota.find((a) => a.hubungan === "Kepala Keluarga");
                return (
                  <tr key={item.id} className="hover:bg-gray-100">
                    <td className="border border-black p-2">{index + 1}</td>
                    <td className="border border-black p-2">
                      <div className="flex items-center justify-center gap-2">
                        <span>{visible[item.id] ? item.nomor_kk : maskNIK(item.nomor_kk)}</span>
                        <button onClick={() => toggleVisibility(item.id)} className="text-gray-600 hover:text-gray-800" title="Tampilkan/Sembunyikan">
                          {visible[item.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                    <td className="border border-black p-2">{kepalaKeluarga?.nama_lengkap || "-"}</td>
                    <td className="border border-black p-2">{item.rumah?.dusun || "-"}</td>
                    <td className="border border-black p-2">{item.jumlah_anggota} Orang</td>
                    <td className="border border-black p-2">
                      <div className="flex justify-center gap-4 text-xs">
                        <Link href={`/admin/data-penduduk/${item.id}`} className="flex flex-col items-center text-blue-600 hover:underline" title="Lihat">
                          <Eye className="w-4 h-4" />
                          <span className="text-black">Lihat</span>
                        </Link>
                        <Link href={`/admin/data-penduduk/${item.id}?mode=edit`} className="flex flex-col items-center text-orange-500 hover:underline" title="Edit">
                          <Pencil className="w-4 h-4" />
                          <span className="text-black">Edit</span>
                        </Link>
                        <button onClick={() => handleDelete(item.id)} className="flex flex-col items-center text-red-600 hover:underline" title="Hapus">
                          <Trash2 className="w-4 h-4" />
                          <span className="text-black">Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {data.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-black bg-white text-center">
                    Tidak ada data penduduk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
