"use client";
import InputField from "./InputField";

export default function Huruf({ 
  label = "Huruf",
  name = "huruf", 
  value, 
  onChange, 
  error, 
  disabled = false 
}) {
  return (
    <InputField
      label={label}
      name={name}
      value={value}
      onChange={(e) => onChange({ name, value: e.target.value })}
      error={error}
      disabled={disabled}
    />
  );
}

export function validateHuruf(value) {
  if (!/^[a-zA-Z\s]{1,}$/.test(value)) {
    return "Form tidak boleh kosong dan hanya huruf/spasi.";
  }
  return "";
}