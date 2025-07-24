"use client";

import { ChevronDown } from "lucide-react";
import PropTypes from "prop-types";
const pilihanDusun = [
  "Tidak/Belum Sekolah",
  "Belum Tamat SD/Sederajat",
  "Tamat SD/Sederajat",
  "SLTP/Sederajat",
  "SLTA/Sederajat",
  "D-1/D-2",
  "D-3",
  "S-1",
  "S-2",
  "S-3",
];

export default function Pendidikan({
  label = "Pendidikan Terakhir",
  name = "pendidikan",
  value,
  onChange,
  error,
  disabled = false,
}) {
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
          <option value="">Pilih</option>
          {pilihanDusun.map((d) => (
            <option key={d} value={d}>
              {d}
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

export function validatePendidikan(value) {
  if (!value) return "Pendidikan wajib dipilih.";
  return "";
}

Pendidikan.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
};