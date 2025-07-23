"use client";

export default function Pekerjaan({
  label = "No. BPJS (Tidak Wajib)",
  name = "bpjs",
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
        placeholder={`Masukkan ${label}`}
        disabled={disabled}
        maxLength={13}
        onChange={(e) =>
          onChange({ name, value: e.target.value.replace(/\D/g, "") })
        }
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

export function validateBPJS(value) {
  if (!/^\d{13}$/.test(value)) {
    return "BPJS harus terdiri dari 13 digit angka.";
  }
  return "";
}
