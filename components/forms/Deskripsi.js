"use client";

export default function Deskripsi({ label = "Deskripsi", name = "description", value, onChange, error, disabled = false, hideLabel = false }) {
  return (
    <div>
      {!hideLabel && (
        <label className={`block mb-1 text-xs md:text-sm font-medium ${error ? "text-red-500" : "text-gray-500"}`}>
          {label} <span className="text-red-500">*</span>
        </label>
      )}
      {/* Textarea */}
      <textarea
        name={name}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange({ name, value: e.target.value })}
        placeholder={`Masukkan ${label}`}
        rows={5} // gunakan rows agar tinggi natural di desktop
        className={`
    w-full
    outline-none
    text-sm
    bg-white
    transition-all
    resize-y

    border-b border-gray-300
    focus:border-green-500
    placeholder:text-gray-400
    h-[38px] md:h-auto
    px-0 md:px-4

    md:border md:rounded-lg md:py-2 md:border-b md:border-gray-300
    ${error ? "border-red-500 focus:border-red-500" : ""}
  `}
      />

      {/* Error */}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export function validateDeskripsi(value) {
  if (!value || value.length < 1) {
    return "Form tidak boleh kosong.";
  }
  return "";
}
