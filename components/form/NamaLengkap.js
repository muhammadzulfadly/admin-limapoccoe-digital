"use client";
import InputField from "./InputField";

export default function NamaLengkap({ 
  label = "Nama Lengkap", // default
  name = "name", 
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

export function validateNama(value) {
  if (!/^[a-zA-Z\s]{3,}$/.test(value)) {
    return "Nama harus terdiri dari minimal 3 huruf dan hanya huruf/spasi.";
  }
  return "";
}
