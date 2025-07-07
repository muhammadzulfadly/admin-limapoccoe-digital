"use client";

import { ChevronDown } from "lucide-react";

export default function JenisKelamin({ value, onChange, error, disabled = false }) {
  return (
    <div className="relative">
      <label className="text-sm font-semibold text-gray-500">Jenis Kelamin<span className="text-red-500 ml-0.5">*</span></label>
      <select
        name="jenis_kelamin"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange({ name: "jenis_kelamin", value: e.target.value })}
        className={`mt-1 appearance-none w-full rounded-lg border bg-white px-4 py-2 text-sm outline-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">Pilih</option>
        <option value="Laki-laki">Laki-laki</option>
        <option value="Perempuan">Perempuan</option>
      </select>
      <ChevronDown className="absolute right-3 bottom-3 text-black pointer-events-none" size={16} />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export function validateGender(value) {
  if (!value) return "Jenis kelamin wajib dipilih.";
  return "";
}
