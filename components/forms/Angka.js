"use client";
import InputField from "./InputField";

export default function Angka({ label="Angka", name="angka", value, onChange, error, disabled = false}) {
  return (
    <InputField
      label={label}
      name={name}
      value={value}
      maxLength={16}
      onChange={(e) => onChange({ name, value: e.target.value.replace(/[^0-9.,:]/g, "") })}
      error={error}
      disabled={disabled}
    />
  );
}

export function validateAngka(value) {
  if (!value || value.length < 1) {
    return "Form tidak boleh kosong dan hanya berisi angka";
  }
  return "";
}