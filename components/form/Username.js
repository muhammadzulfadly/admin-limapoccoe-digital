"use client";
import InputField from "./InputField";

export default function Username({ value, onChange, error, disabled = false }) {
  return (
    <InputField
      label="Username"
      name="username"
      value={value}
      onChange={(e) => onChange({ name: "username", value: e.target.value })}
      error={error}
      disabled={disabled}
    />
  );
}

export function validateUsername(value) {
  if (!value || value.length < 2) {
    return "Username minimal 2 karakter.";
  }
  return "";
}