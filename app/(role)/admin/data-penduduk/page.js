import { Plus, Search, SlidersHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Dashboard Data Penduduk",
};

export default async function Page() {
  const data = [
    {
      nik: "7371XXXXXXX",
      nama: "Andi Saputra",
      ttl: "Makassar, 12-03-1987",
      jk: "L",
      alamat: "Jl. Poros ...",
      status: "Kawin",
      pekerjaan: "petani",
      hidup: "Hidup",
    },
    {
      nik: "7371XXXXXXX",
      nama: "Siti Aminah",
      ttl: "Bone, 20-06-1991",
      jk: "P",
      alamat: "Dusun Tua...",
      status: "Belum Kawin",
      pekerjaan: "petani",
      hidup: "Meninggal",
    },
    {
      nik: "7371XXXXXXX",
      nama: "Burhanuddin",
      ttl: "Barru, 05-05-1999",
      jk: "L",
      alamat: "Jl. Trans ...",
      status: "Kawin",
      pekerjaan: "petani",
      hidup: "Hidup",
    },
  ];

  return (
    <div className="flex h-full">
      <div className="flex-1 bg-gray-100 p-8">
        <header>
          <h1 className="text-xl font-bold mb-3">Dashboard Data Penduduk</h1>
        </header>

        <div className="flex justify-between items-center mb-3">
          <Link href={`/admin/data-penduduk/buat-baru`}>
            <button className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition">
              <Plus className="w-5 h-5" strokeWidth={3} />
              Tambah Baru
            </button>
          </Link>
          <div className="flex justify-end mb-6">
            <div className="flex items-center border border-gray-500 rounded-md px-4 py-2 bg-white text-gray-500 transition-colors w-72">
              <Search className="w-5 h-5 mr-2" />
              <input type="text" placeholder="Masukkan NIK Penduduk" className="flex-1 outline-none text-sm bg-white placeholder-gray-500" />
              <SlidersHorizontal className="w-4 h-4 ml-2" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-black text-sm">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="border border-black px-2 py-2">No.</th>
                <th className="border border-black px-2 py-2 ">NIK</th>
                <th className="border border-black px-2 py-2 ">Nama</th>
                <th className="border border-black px-2 py-2 ">TTL</th>
                <th className="border border-black px-2 py-2">JK</th>
                <th className="border border-black px-2 py-2 ">Alamat</th>
                <th className="border border-black px-2 py-2 ">Status Perkawinan</th>
                <th className="border border-black px-2 py-2 ">Pekerjaan</th>
                <th className="border border-black px-2 py-2 ">Hidup</th>
                <th className="border border-black px-2 py-2 ">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="bg-white text-center">
                  <td className="border border-black px-2 py-1">{index + 1}</td>
                  <td className="border border-black px-2 py-1">{item.nik}</td>
                  <td className="border border-black px-2 py-1">{item.nama}</td>
                  <td className="border border-black px-2 py-1">{item.ttl}</td>
                  <td className="border border-black px-2 py-1">{item.jk}</td>
                  <td className="border border-black px-2 py-1">{item.alamat}</td>
                  <td className="border border-black px-2 py-1">{item.status}</td>
                  <td className="border border-black px-2 py-1">{item.pekerjaan}</td>
                  <td className="border border-black px-2 py-1">{item.hidup}</td>
                  <td className="border border-black px-2 py-1">
                    <div className="flex justify-center items-center gap-4 text-green-600 text-xs">
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
