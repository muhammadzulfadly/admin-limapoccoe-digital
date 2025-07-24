"use client";
import PropTypes from "prop-types";
export default function Tanggal({
  label = "Tanggal",
  name = "tanggal",
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

      {/* Input tanggal */}
      <input
        type="date"
        name={name}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange({ name, value: e.target.value })}
        className={`
          w-full
          text-sm
          bg-white
          outline-none
          transition-all

          border-b border-gray-300
          focus:border-green-500
          py-1.5 px-0

          md:border md:rounded-lg md:px-4 md:py-2
          ${error ? "border-red-500 focus:border-red-500" : ""}

          text-left
          [text-indent:0.01px]
          [appearance:none]
          [webkit-appearance:none]
        `}
      />

      {/* Error message */}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export function validateTanggal(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return "Gunakan format tanggal: dd/mm/yyyy.";
  }
  return "";
}

Tanggal.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
};