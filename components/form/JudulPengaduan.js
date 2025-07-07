"use client";
import InputField from "./InputField";

export default function JudulPengaduan({ value, onChange, error, disabled = false }) {
  return (
    <InputField
      label="Judul Pengaduan"
      name="title"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange({ name: "title", value: e.target.value })}
      error={error}
    />
  );
}

export function validateJudul(value) {
  if (!value || value.length < 1) {
    return "Judul pengaduan tidak boleh kosong.";
  }
  return "";
}