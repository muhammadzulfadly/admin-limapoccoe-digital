"use client";

import { ChevronDown } from "lucide-react";
import PropTypes from "prop-types";
const pilihanDusun = [
  "Kepala Keluarga",
  "Istri",
  "Anak",
  "Cucu",
  "Famili Lain",
  "Saudara",
  "Orang Tua",
];

export default function StatusHubungan({
  label = "Status Hubungan",
  name = "statushubungan",
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

        {/* Icon */}
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none"
          size={16}
        />
      </div>

      {/* Error message */}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export function validateStatusHubungan(value) {
  if (!value) return "Status Hubungan wajib dipilih.";
  return "";
}

StatusHubungan.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
};