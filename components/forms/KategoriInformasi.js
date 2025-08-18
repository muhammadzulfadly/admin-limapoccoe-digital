"use client";

import { ChevronDown } from "lucide-react";
import PropTypes from "prop-types";
export default function KategoriInformasi({
  label = "Kategori Informasi",
  name = "category",
  value,
  onChange,
  error,
  disabled = false,
}) {
  const options = [
    "berita",
    "Wisata Desa",
    "Galeri Desa",
    "Produk Desa",
  ];

  return (
    <div>
      {/* Label */}
      <label
        className={`block mb-1 text-xs md:text-sm font-medium ${
          error ? "text-red-500" : "text-gray-500"
        }`}
      >
        {label}
        <span className="text-red-500 ml-0.5">*</span>
      </label>

      {/* Select wrapper */}
      <div className="relative">
        <select
          name={name}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange({ name, value: e.target.value })}
          className={`
            w-full
            appearance-none
            text-sm
            bg-white
            outline-none
            transition-all

            border-b border-gray-300
            focus:border-green-500
            placeholder:text-gray-400
            py-1.5 px-0 pr-8

            md:border md:rounded-lg md:px-4 md:py-2
            ${error ? "border-red-500 focus:border-red-500" : ""}
          `}
        >
          <option value="">Pilih kategori</option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        {/* Chevron icon */}
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none"
          size={16}
        />
      </div>

      {/* Error */}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export function validateKategoriInformasi(value) {
  if (!value) return "Pilih kategori informasi.";
  return "";
}

KategoriInformasi.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
};