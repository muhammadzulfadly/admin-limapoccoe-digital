"use client";
import InputField from "./InputField";

export default function NamaIbu({ value, onChange, error, disabled = false }) {
  return (
    <InputField
      label="Nama Ibu"
      name="ibu"
      value={value}
      onChange={(e) => onChange({ name: "ibu", value: e.target.value })}
      error={error}
      disabled={disabled}
    />
  );
}

export function validateNama(value) {
  if (!/^[a-zA-Z\s]{3,}$/.test(value)) {
    return "Nama Ibu harus terdiri dari minimal 3 huruf dan hanya huruf/spasi.";
  }
  return "";
}