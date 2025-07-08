"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

// Import komponen form custom
import NomorKk from "@/components/form/NomorKk";
import NomorRumah from "@/components/form/NomorRumah";
import Dusun from "@/components/form/Dusun";
import RtRw from "@/components/form/RtRw";

export default function TambahPendudukPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nomorKk: "",
    nomorRumah: "",
    dusun: "",
    rt_rw: "",
  });

  const [errors, setErrors] = useState({});

  const [data, setData] = useState([]);
  const [visibleNIK, setVisibleNIK] = useState({});

  // Dummy keluarga data
  useEffect(() => {
    const dummy = [
      {
        id: 1,
        status: "Kepala Keluarga",
        nik: "7371123456789012",
        nama: "Asep Sofyan",
        jk: "L",
      },
      {
        id: 2,
        status: "Istri",
        nik: "7371123456789013",
        nama: "Siti Nurlela",
        jk: "P",
      },
      {
        id: 3,
        status: "Anak",
        nik: "7371123456789014",
        nama: "Budi Kuncoro",
        jk: "L",
      },
    ];
    setData(dummy);

    const vis = {};
    dummy.forEach((d) => (vis[d.id] = false));
    setVisibleNIK(vis);
  }, []);

  const toggleNIKVisibility = (id) => {
    setVisibleNIK((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const maskNIK = (nik) => nik.slice(0, 6) + "XXXXXXXX";

  const handleChange = ({ name, value }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-[#f4f6fa] p-6 md:p-10">
      <h1 className="text-lg font-semibold text-black mb-6">Data Kependudukan / Tambah Data Penduduk</h1>

      <div className="bg-white rounded-xl shadow-sm p-6 md:p-10">
        {/* Back Button */}
        <div className="flex items-center">
          <button type="button" onClick={() => router.back()} className="flex items-center text-base text-gray-500 mb-6">
            <ChevronLeft size={30} className="mr-1" />
            Kembali
          </button>
        </div>

        {/* Form */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <NomorKk value={form.nomorKk} onChange={handleChange} error={errors.nomorKk} />
          <NomorRumah value={form.nomorRumah} onChange={handleChange} error={errors.nomorRumah} />
          <Dusun value={form.dusun} onChange={handleChange} error={errors.dusun} />
          <RtRw value={form.rt_rw} onChange={handleChange} error={errors.rt_rw} />
        </form>

        {/* Table */}
        <div className="overflow-x-auto mb-10">
          <table className="w-full table-fixed border border-black text-sm">
            <thead className="bg-[#27AE60] text-white">
              <tr>
                <th className="border border-black p-2 w-[5%]">No.</th>
                <th className="border border-black p-2 w-[20%]">Status Hubungan</th>
                <th className="border border-black p-2 w-[25%]">NIK</th>
                <th className="border border-black p-2 w-[25%]">Nama Lengkap</th>
                <th className="border border-black p-2 w-[5%]">JK</th>
                <th className="border border-black p-2 w-[20%]">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white text-center">
              {data.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-100">
                  <td className="border border-black p-2">{index + 1}</td>

                  <td className="border border-black p-2">{item.status}</td>
                  <td className="border border-black p-2">
                    <div className="flex items-center justify-center gap-2">
                      <span>{visibleNIK[item.id] ? item.nik : maskNIK(item.nik)}</span>
                      <button onClick={() => toggleNIKVisibility(item.id)} className="text-gray-600 hover:text-gray-800" title="Tampilkan/Sembunyikan">
                        {visibleNIK[item.id] ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                  <td className="border border-black p-2">{item.nama}</td>
                  <td className="border border-black p-2">{item.jk}</td>

                  <td className="border border-black p-2">
                    <div className="flex justify-center gap-4 text-xs">
                      <Link href={`/admin/data-penduduk/${item.id}`} className="flex flex-col items-center text-blue-600 hover:underline" title="Lihat">
                        <Eye className="w-4 h-4" />
                        <span className="text-black">Lihat</span>
                      </Link>
                      <Link href={`/admin/data-penduduk/${item.id}/edit`} className="flex flex-col items-center text-orange-500 hover:underline" title="Edit">
                        <Pencil className="w-4 h-4" />
                        <span className="text-black">Edit</span>
                      </Link>
                      <button className="flex flex-col items-center text-red-600 hover:underline" title="Hapus">
                        <Trash2 className="w-4 h-4" />
                        <span className="text-black">Hapus</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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

        {/* Tambah Data Keluarga */}
        <div className="mb-6">
          <Link href="/admin/data-penduduk/tambah/data-keluarga">
            <button type="button" className="w-full bg-[#2e6f93] text-white text-sm font-semibold py-2 rounded-md hover:bg-[#255f7c] transition">
              Tambah Data Keluarga
            </button>
          </Link>
        </div>

        {/* Simpan Button */}
        <div className="flex justify-end">
          <button type="submit" className="bg-green-600 text-white text-sm font-semibold px-6 py-2 rounded-md hover:bg-green-700 transition">
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
