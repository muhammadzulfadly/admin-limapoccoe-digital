"use client";
import InputField from "./InputField";

export default function Nik({ value, onChange, error, disabled = false}) {
  return (
    <InputField
      label="NIK"
      name="nik"
      value={value}
      maxLength={16}
      onChange={(e) => onChange({ name: "nik", value: e.target.value.replace(/\D/g, "") })}
      error={error}
      disabled={disabled}
    />
  );
}

export function validateNik(value) {
  if (!/^\d{16}$/.test(value)) {
    return "NIK harus terdiri dari 16 digit angka.";
  }
  return "";
}