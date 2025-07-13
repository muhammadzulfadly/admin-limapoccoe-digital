"use client";

export default function Pekerjaan({ label="Pekerjaan", name="pekerjaan",  value, onChange, error , disabled = false}) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-500">{label}<span className="text-red-500 ml-0.5">*</span></label>
      <input
        name={name}
        value={value}
        placeholder={`Masukkan ${label}`}
        disabled={disabled}
        onChange={(e) => onChange({ name, value: e.target.value })}
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
