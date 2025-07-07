"use client";

export default function Pekerjaan({ value, onChange, error , disabled = false}) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-500">Pekerjaan<span className="text-red-500 ml-0.5">*</span></label>
      <input
        name="pekerjaan"
        value={value}
        placeholder="Masukkan Pekerjaan"
        disabled={disabled}
        onChange={(e) => onChange({ name: "pekerjaan", value: e.target.value })}
        className={`w-full border rounded px-4 py-2 mt-1 text-sm ${error ? "border-red-500" : "border-gray-300"}`}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

export function validatePekerjaan(value) {
  if (!/^[A-Za-z\s]+$/.test(value)) return "Pekerjaan hanya huruf dan spasi.";
  return "";
}
