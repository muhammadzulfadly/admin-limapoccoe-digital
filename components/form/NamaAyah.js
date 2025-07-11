"use client";
import InputField from "./InputField";

export default function NamaAyah({ value, onChange, error, disabled = false }) {
  return (
    <InputField
      label="Nama Ayah"
      name="ayah"
      value={value}
      onChange={(e) => onChange({ name: "ayah", value: e.target.value })}
      error={error}
      disabled={disabled}
    />
  );
}

export function validateNamaAyah(value) {
  if (!/^[a-zA-Z\s]{3,}$/.test(value)) {
    return "Nama Ayah harus terdiri dari minimal 3 huruf dan hanya huruf/spasi.";
  }
  return "";
}