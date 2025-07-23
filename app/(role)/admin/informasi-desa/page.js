import { Plus, Search, SlidersHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Dashboard Informasi Desa",
};

export default async function Page() {
  const data = [
    { nama: "Asep Sofyan", tanggal: "24/04/25", kategori: "Hasil Rapat", judul: "Rapat Bulan April" },
    { nama: "Asep Sofyan", tanggal: "24/03/25", kategori: "Hasil Rapat", judul: "Rapat Bulan Maret" },
    { nama: "Asep Sofyan", tanggal: "24/02/25", kategori: "Produk Desa", judul: "Rapat Bulan Februari" },
  ];

  function ActionButtons() {
    return (
      <div className="flex flex-col sm:flex-row justify-center items-start gap-3 sm:gap-4 text-[9px] sm:text-sm md:text-xs">
        {/* Lihat */}
        <Link href="#" className="flex flex-row sm:flex-col items-center gap-1 text-blue-600 hover:underline" title="Lihat">
          <Eye className="w-4 h-4" />
          <span className="text-black">Lihat</span>
        </Link>

        {/* Edit */}
        <Link href="#" className="flex flex-row sm:flex-col items-center gap-1 text-orange-500 hover:underline" title="Edit">
          <Pencil className="w-4 h-4" />
          <span className="text-black">Edit</span>
        </Link>

        {/* Hapus */}
        <button className="flex flex-row sm:flex-col items-center gap-1 text-red-600 hover:underline" title="Hapus">
          <Trash2 className="w-4 h-4" />
          <span className="text-black">Hapus</span>
        </button>
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

        <div className="grid grid-cols-2 sm:flex sm:justify-between sm:items-center gap-4 mb-6">
          <Link href={`#`}>
            <button className="flex items-center gap-1 px-4 py-2 bg-[#27AE60] text-white rounded-md text-sm hover:bg-green-600 transition w-full sm:w-auto">
              <Plus className="w-5 h-5" strokeWidth={3} />
              Tambah Baru
            </button>
          </Link>
          <div className="flex items-center border border-gray-500 rounded-md px-4 py-2 bg-white text-gray-500 w-full sm:w-auto min-w-0">
            <Search className="w-5 h-5 mr-2" />
            <input type="text" placeholder="Cari" className="flex-1 outline-none text-sm bg-white placeholder-gray-500 min-w-0" />
            <SlidersHorizontal className="w-4 h-4 ml-2" />
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="table-fixed w-full border border-black text-[9px] sm:text-sm md:text-base">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="border border-black p-2 w-[20%] whitespace-normal break-words">Nama Pengedit</th>
                <th className="border border-black p-2 w-[20%] whitespace-normal break-words">Terakhir diedit</th>
                <th className="border border-black p-2 w-[20%] whitespace-normal break-words">Kategori</th>
                <th className="border border-black p-2 w-[20%] whitespace-normal break-words">Judul</th>
                <th className="border border-black p-2 w-[20%] whitespace-normal break-words">Action</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="bg-white text-center">
                  <td className="border border-black p-2 whitespace-normal break-words">{item.nama}</td>
                  <td className="border border-black p-2 whitespace-normal break-words">{item.tanggal}</td>
                  <td className="border border-black p-2 whitespace-normal break-words">{item.kategori}</td>
                  <td className="border border-black p-2 whitespace-normal break-words">{item.judul}</td>
                  <td className="border border-black p-2 whitespace-normal break-words">
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
