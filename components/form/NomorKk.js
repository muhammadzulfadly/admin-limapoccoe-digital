"use client";
import InputField from "./InputField";

export default function NomorKk({ value, onChange, error, disabled = false}) {
  return (
    <InputField
      label="No. KK"
      name="nomorKk"
      value={value}
      maxLength={16}
      onChange={(e) => onChange({ name: "nomorKk", value: e.target.value.replace(/\D/g, "") })}
      error={error}
      disabled={disabled}
    />
  );
}

export function validateNomorKK(value) {
  if (!/^\d{16}$/.test(value)) {
    return "No. KK harus terdiri dari 16 digit angka.";
  }
  return "";
}