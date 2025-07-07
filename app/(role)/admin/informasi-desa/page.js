import { Plus, Search, SlidersHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Dashboard Informasi Desa",
};

export default async function Page() {
  const data = [
    { nama: "Asep Sofyan", tanggal: "24/04/25", kategori: "Hasil Rapat", judul: "Rapat Bulan April" },
    { nama: "Asep Sofyan", tanggal: "24/03/25", kategori: "Hasil Rapat", judul: "Rapat Bulan Maret"},
    { nama: "Asep Sofyan", tanggal: "24/02/25", kategori: "Produk Desa", judul: "Rapat Bulan Februari" },
  ];

  function ActionButtons() {
    return (
      <div className="flex justify-center items-center gap-6 text-green-600 text-xs">
        <Link href="#" className="flex flex-col items-center hover:underline" title="Lihat">
          <Eye className="w-5 h-5" />
          <span className="text-black">Lihat</span>
        </Link>
        <Link href="#" className="flex flex-col items-center hover:underline" title="Edit">
          <Pencil className="w-5 h-5" />
          <span className="text-black">Edit</span>
        </Link>
        <Link href="#" className="flex flex-col items-center hover:underline" title="Hapus">
          <Trash2 className="w-5 h-5" />
          <span className="text-black">Hapus</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-8">
        <header>
          <h1 className="text-xl font-bold mb-3">Dashboard Informasi Desa</h1>
        </header>

        <div className="flex justify-between items-center mb-3">
          <Link href={`/admin/informasi-desa/buat-baru`}>
            <button className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition">
              <Plus className="w-5 h-5" strokeWidth={3} />
              Tambah Baru
            </button>
          </Link>
          <div className="flex justify-end mb-6">
            <div className="flex items-center border border-gray-500 rounded-md px-4 py-2 bg-white text-gray-500 transition-colors w-72">
              <Search className="w-5 h-5 mr-2" />
              <input type="text" placeholder="Masukkan Kategori Informasi" className="flex-1 outline-none text-sm bg-white placeholder-gray-500" />
              <SlidersHorizontal className="w-4 h-4 ml-2" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-black">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="px-4 py-2 w-1/5 border border-black">Nama Pengedit</th>
                <th className="px-4 py-2 w-1/5 border border-black">Terakhir diedit</th>
                <th className="px-4 py-2 w-1/5 border border-black">Kategori</th>
                <th className="px-4 py-2 w-1/5 border border-black">Judul</th>
                <th className="px-4 py-2 w-1/5 border border-black">Action</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="bg-white text-center">
                  <td className="px-4 py-2 border border-black">{item.nama}</td>
                  <td className="px-4 py-2 border border-black">{item.tanggal}</td>
                  <td className="border border-black p-2 px-4">{item.kategori}</td>
                  <td className="px-4 py-2 border border-black">{item.judul}</td>
                  <td className="border border-black p-2">
                    <ActionButtons />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
