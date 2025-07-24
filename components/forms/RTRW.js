"use client";
import PropTypes from "prop-types";
export default function RTRW({
  label = "RT/RW (tidak wajib)",
  name = "rt_rw",
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
      </label>

      {/* Input */}
      <input
        name={name}
        value={value}
        placeholder="Contoh: 001/002"
        disabled={disabled}
        onChange={(e) => onChange({ name, value: e.target.value })}
        className={`
          w-full
          outline-none
          text-sm
          bg-white
          transition-all

          border-b border-gray-300
          focus:border-green-500
          placeholder:text-gray-400
          py-1.5 px-0

          md:border md:rounded-lg md:px-4 md:py-2
          ${error ? "border-red-500 focus:border-red-500" : ""}
        `}
      />

      {/* Error */}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export function validateRTRW(value) {
  if (value && !/^\d{3}\/\d{3}$/.test(value)) {
    return "Format RT/RW tidak valid. Contoh: 005/003.";
  }
  return "";
}

RTRW.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
};