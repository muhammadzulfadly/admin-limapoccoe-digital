"use client";

export default function Alamat({ value, onChange, error, disabled = false }) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-500">Alamat<span className="text-red-500 ml-0.5">*</span></label>
      <input
        name="alamat"
        value={value}
        placeholder="Masukkan Alamat"
        disabled={disabled}
        onChange={(e) => onChange({ name: "alamat", value: e.target.value })}
        className={`w-full border rounded px-4 py-2 mt-1 text-sm ${error ? "border-red-500" : "border-gray-300"}`}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

export function validateAlamat(value) {
  if (!value || value.length < 10) return "Alamat minimal 10 karakter.";
  return "";
}