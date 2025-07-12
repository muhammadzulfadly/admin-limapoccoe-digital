"use client";
import InputField from "./InputField";

export default function JumlahTanggunganOrtu({ name="jumlahtanggungan", value, onChange, error, disabled = false}) {
  return (
    <InputField
      label="Jumlah Tanggungan Ortu"
      name={name}
      value={value}
      maxLength={16}
      onChange={(e) => onChange({ name, value: e.target.value.replace(/\D/g, "") })}
      error={error}
      disabled={disabled}
    />
  );
}

export function validateTanggungan(value) {
  if (!value || value.length < 1) {
    return "Jumlah Tanggungan tidak boleh kosong dan hanya berisi angka";
  }
  return "";
}