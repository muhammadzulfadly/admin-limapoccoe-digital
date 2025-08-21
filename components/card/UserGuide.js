"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

export default function UserGuideCard() {
  const [link, setLink] = useState("#");

  useEffect(() => {
    const fetchPanduan = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("/api/information?kategori=pengumuman", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await res.json();

        if (res.ok && Array.isArray(result.data)) {
          const panduan = result.data.find(
            (item) => item.judul === "Tautan Panduan Pengguna Pemerintah"
          );
          if (panduan?.konten) setLink(panduan.konten);
        }
      } catch (err) {
        console.error("Gagal mengambil tautan panduan:", err);
      }
    };

    fetchPanduan();
  }, []);

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full p-4 flex items-center justify-between">
        <div>
          <div className="text-sm md:text-sm font-semibold text-[#00171F]">User Guide</div>
          <div className="text-xs md:text-sm text-[#00171F]">Lihat panduan untuk pemerintah</div>
        </div>
        <FileText
          size={32}
          className="text-[#00171F] md:w-[50px] md:h-[50px]"
        />
      </div>
    </a>
  );
}
