"use client";
import InputField from "./InputField";

export default function NomorTelepon({ value, onChange, error, disabled = false }) {
  return (
    <InputField
      label="Nomor Telepon"
      name="no_whatsapp"
      value={value}
      maxLength={13}
      onChange={(e) => onChange({ name: "no_whatsapp", value: e.target.value.replace(/\D/g, "") })}
      error={error}
      disabled={disabled}
    />
  );
}

export function validateTelepon(value) {
  if (!/^08\d{8,11}$/.test(value)) {
    return "Nomor telepon tidak valid. Harus dimulai dengan 08 dan 10-13 digit.";
  }
  return "";
}