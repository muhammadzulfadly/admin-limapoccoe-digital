"use client";

import { ChevronDown } from "lucide-react";

export default function KategoriPengaduan({ value, onChange, error, disabled = false }) {
  const options = [
    "Administrasi",
    "Infrastruktur & Fasilitas",
    "Kesehatan",
    "Keamanan & Ketertiban",
    "Pendidikan",
    "Lingkungan",
    "Kinerja Perangkat Desa",
    "Ekonomi & Pekerjaan",
    "Teknologi",
    "Lainnya"
  ];

  return (
    <div className="relative">
      <label className="text-sm font-semibold text-gray-500">
        Kategori Pengaduan<span className="text-red-500 ml-0.5">*</span>
      </label>
      <select
        name="category"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange({ name: "category", value: e.target.value })}
        className={`mt-1 appearance-none w-full rounded-lg border bg-gray-100 px-4 py-2 text-sm outline-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">Pilih kategori</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 bottom-3 text-black pointer-events-none" size={16} />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export function validateKategori(value) {
  if (!value) return "Pilih kategori pengaduan.";
  return "";
}
