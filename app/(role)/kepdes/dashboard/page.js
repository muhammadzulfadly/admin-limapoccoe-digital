"use client";

import { useEffect, useState } from "react";
import ButuhKonfirmasiCard from "@/components/card/ButuhKonfirmasi";
import SelesaiCard from "@/components/card/Selesai";
import DiterimaCard from "@/components/card/DiTerima";
import UserGuideCard from "@/components/card/UserGuide";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const [pengajuan, setPengajuan] = useState([]);
  const [pengaduan, setPengaduan] = useState([]);
  const [loadingSurat, setLoadingSurat] = useState(true);
  const [loadingPengaduan, setLoadingPengaduan] = useState(true);

  useEffect(() => {
    const fetchPengajuan = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const suratRes = await fetch("/api/letter", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const suratData = await suratRes.json();
        const jenisSurat = suratData.jenis_surat || [];

        const allPengajuan = await Promise.all(
          jenisSurat.map(async (surat) => {
            const res = await fetch(`/api/letter/${surat.slug}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const data = await res.json();
            return data.pengajuan_surat || [];
          })
        );

        setPengajuan(allPengajuan.flat());
      } catch (err) {
        console.error("Gagal memuat pengajuan:", err);
      } finally {
        setLoadingSurat(false);
      }
    };

    const fetchPengaduan = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("/api/complaint", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setPengaduan(data.aduan || []);
      } catch (err) {
        console.error("Gagal memuat pengaduan:", err);
      } finally {
        setLoadingPengaduan(false);
      }
    };

    fetchPengajuan();
    fetchPengaduan();
  }, []);

  const countByStatus = (list, status) =>
    list.filter((item) => item.status === status).length;

  return (
    <div className="flex h-full">
      <div className="flex-1 p-8 space-y-8">
        {/* Pengajuan Surat */}
        <section>
          <h2 className="sm:text-2xl text-base font-semibold mb-4">Pengajuan Surat</h2>
          {loadingSurat ? (
            <p className="text-gray-500 italic">Memuat data pengajuan...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              <ButuhKonfirmasiCard count={countByStatus(pengajuan, "confirmed")} />
              <SelesaiCard count={countByStatus(pengajuan, "approved")} />
            </div>
          )}
        </section>

        <hr className="border-gray-300 border-y" />

        {/* Pengaduan */}
        <section>
          <h2 className="sm:text-2xl text-base font-semibold mb-4">Pengaduan</h2>
          {loadingPengaduan ? (
            <p className="text-gray-500 italic">Memuat data pengaduan...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              <DiterimaCard count={countByStatus(pengaduan, "processed")} />
              <SelesaiCard count={countByStatus(pengaduan, "approved")} />
            </div>
          )}
        </section>

        <hr className="border-gray-300 border-y" />
        {/* Panduan */}
        <section>
          <h2 className="sm:text-2xl text-base font-semibold mb-4">Panduan Pengguna</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            <UserGuideCard />
          </div>
        </section>
      </div>
    </div>
  );
}
