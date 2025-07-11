"use client";

export default function Pekerjaan({ value, onChange, error, disabled = false }) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-500">No. BPJS (opsional)</label>
      <input
        name="bpjs"
        value={value}
        placeholder="Masukkan Nomor BPJS"
        disabled={disabled}
        maxLength={13}
        onChange={(e) => onChange({ name: "bpjs", value: e.target.value.replace(/\D/g, "") })}
        className={`w-full border rounded px-4 py-2 mt-1 text-sm ${error ? "border-red-500" : "border-gray-300"}`}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

export function validateBpjs(value) {
  if (value && !/^\d{13}$/.test(value)) {
    return "BPJS harus terdiri dari 13 digit angka.";
  }
  return "";
}
