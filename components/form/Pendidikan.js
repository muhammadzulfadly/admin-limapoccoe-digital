"use client";

import { ChevronDown } from "lucide-react";

const pilihanDusun = ["Tidak/Belum Sekolah", "Belum Tamat SD/Sederajat", "Tamat SD/Sederajat", "SLTP/Sederajat", "SLTA/Sederajat", "D-1/D-2", "D-3", "S-1", "S-2", "S-3"];

export default function Dusun({ value, onChange, error, disabled = false }) {
  return (
    <div className="relative">
      <label className="text-sm font-semibold text-gray-500">
        Pendidikan Terakhir<span className="text-red-500 ml-0.5">*</span>
      </label>
      <select
        name="pendidikan"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange({ name: "Pendidikan", value: e.target.value })}
        className={`mt-1 appearance-none w-full rounded-lg border bg-white px-4 py-2 text-sm outline-none ${error ? "border-red-500" : "border-gray-300"}`}
      >
        <option value="">Pilih</option>
        {pilihanDusun.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 bottom-3 text-black pointer-events-none" size={16} />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export function validateDusun(value) {
  if (!value) return "Pendidikan wajib dipilih.";
  return "";
}
