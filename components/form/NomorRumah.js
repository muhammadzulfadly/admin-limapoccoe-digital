"use client";
import InputField from "./InputField";

export default function NomorKk({ value, onChange, error, disabled = false}) {
  return (
    <InputField
      label="No. Rumah"
      name="nomorRumah"
      value={value}
      maxLength={16}
      onChange={(e) => onChange({ name: "nomorRumah", value: e.target.value.replace(/\D/g, "") })}
      error={error}
      disabled={disabled}
    />
  );
}

export function validateNik(value) {
  if (!value || value.length < 1) {
    return "No. Rumah tidak boleh kosong.";
  }
  return "";
}