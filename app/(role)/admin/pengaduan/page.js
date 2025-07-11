"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import MenungguCard from "@/components/card/Menunggu";
import DiterimaCard from "@/components/card/DiTerima";
import SelesaiCard from "@/components/card/Selesai";

const statusMap = {
  waiting: "Menunggu",
  processed: "Diterima",
  approved: "Selesai",
};

const statusColor = {
  Selesai: "text-green-600 font-semibold",
  Diterima: "text-teal-800 font-semibold",
  Menunggu: "text-orange-600 font-semibold",
};

export default function PengaduanPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchAduan = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/complaint", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      const sorted = (result.aduan || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setData(sorted);
    };

    fetchAduan();
  }, []);

  return (
    <div className="flex h-full">
      <div className="flex-1 p-8 space-y-8 bg-[#EDF0F5]">
        <section>
          <h2 className="font-semibold text-2xl mb-4">Pengaduan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {Object.values(statusMap).map((status) => {
              const jumlah = data.filter((item) => statusMap[item.status] === status).length;
              const Icon = status === "Menunggu" ? MenungguCard : status === "Diterima" ? DiterimaCard : SelesaiCard;
              return (
                <div key={status}>
                  <Icon count={jumlah} />
                </div>
              );
            })}
          </div>

          <hr className="border-gray-300 border-y mb-6" />

          <div className="flex justify-end items-center mb-6">
            <div className="flex items-center border border-gray-500 rounded-md px-4 py-2 bg-white text-gray-500 transition-colors w-72">
              <Search className="w-5 h-5 mr-2" />
              <input type="text" placeholder="Masukkan Jenis Pengaduan" className="flex-1 outline-none text-sm bg-white placeholder-gray-500" />
              <SlidersHorizontal className="w-4 h-4 ml-2" />
            </div>
          </div>

          <table className="w-full table-fixed border border-black">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="border border-black p-2 w-1/6">Tanggal</th>
                <th className="border border-black p-2 w-1/6">Judul Pengaduan</th>
                <th className="border border-black p-2 w-1/6">Kategori</th>
                <th className="border border-black p-2 w-1/6">Status</th>
                <th className="border border-black p-2 w-1/6">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                const readableStatus = statusMap[item.status] || item.status;
                return (
                  <tr key={index} className="bg-white text-center">
                    <td className="border border-black p-2">{new Date(item.created_at).toLocaleDateString("id-ID")}</td>
                    <td className="border border-black p-2">{item.title}</td>
                    <td className="border border-black p-2">{item.category}</td>
                    <td className={`border border-black p-2 ${statusColor[readableStatus] || ""}`}>{readableStatus}</td>
                    <td className="border border-black p-2">
                      <Link href={`/admin/pengaduan/${item.id}`} className="flex justify-center items-center gap-1">
                        <Search className="text-blue-400" />
                        <span className="text-sm text-black hover:underline">Buka</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="bg-white text-center text-black py-4">
                    Belum ada proses pengaduan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
