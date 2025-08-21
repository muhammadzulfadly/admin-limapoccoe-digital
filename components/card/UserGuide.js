"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

export default function UserGuideCard() {
  const [linkPanduan, setLinkPanduan] = useState(null);

  useEffect(() => {
    const fetchPanduan = async () => {
      try {
        const res = await fetch("/api/information");
        const json = await res.json();
        const data = json.data || [];

        const panduanItem = data.find(
          (item) => item.kategori === "pengumuman" && item.judul === "Tautan Panduan Pengguna"
        );

        setLinkPanduan(panduanItem?.konten || null);
      } catch (err) {
        console.error("Gagal mengambil tautan panduan:", err);
      }
    };

    fetchPanduan();
  }, []);

  if (!linkPanduan) return null;

  return (
    <a
      href={linkPanduan}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full p-4 flex items-center justify-between">
        <div>
          <div className="text-sm md:text-sm font-semibold text-[#00171F]">User Guide</div>
          <div className="text-xs md:text-sm text-[#00171F]">Lihat panduan</div>
        </div>
        <FileText
          size={32}
          className="text-[#00171F] md:w-[50px] md:h-[50px]"
        />
      </div>
    </a>
  );
}
