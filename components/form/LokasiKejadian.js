"use client";
import InputField from "./InputField";

export default function LokasiKejadian({ value, onChange, error, disabled = false }) {
  return (
    <InputField
      label="Lokasi Kejadian"
      name="location"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange({ name: "location", value: e.target.value })}
      error={error}
    />
  );
}

export function validateLokasi(value) {
  if (!value || value.length < 1) {
    return "Lokasi pengaduan tidak boleh kosong.";
  }
  return "";
}