"use client";
import InputField from "./InputField";

export default function NomorKk({ name="nomor", value, onChange, error, disabled = false}) {
  return (
    <InputField
      label="Nomor Surat"
      name={name}
      value={value}
      maxLength={16}
      onChange={(e) => onChange({ name, value: e.target.value.replace(/\D/g, "") })}
      error={error}
      disabled={disabled}
    />
  );
}

export function validateNik(value) {
  if (!/^\d{16}$/.test(value)) {
    return "No. KK harus terdiri dari 16 digit angka.";
  }
  return "";
}