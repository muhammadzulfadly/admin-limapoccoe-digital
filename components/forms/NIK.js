"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import InputField from "./InputField";

export default function Nik({
  label = "NIK",
  name = "nik",
  value,
  onChange,
  error,
  disabled = false,
}) {
  const [showFull, setShowFull] = useState(false);

  const getMaskedNik = (nik) => {
    if (!nik || nik.length < 10) return nik;
    return nik.slice(0, 3) + "xxxxxxxxxx" + nik.slice(-3);
  };

  return (
    <div className="relative">
      <InputField
        label={label}
        name={name}
        value={showFull || disabled === false ? value : getMaskedNik(value)}
        maxLength={16}
        onChange={(e) => onChange({ name, value: e.target.value.replace(/\D/g, "") })}
        error={error}
        disabled={disabled}
        readOnly={disabled}
      />
      {disabled && (
        <button
          type="button"
          onClick={() => setShowFull((prev) => !prev)}
          className="absolute right-3 md:top-[34px] top-[28px] text-gray-500 hover:text-gray-700"
        >
          {showFull ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
}

export function validateNIK(value) {
  if (!/^\d{16}$/.test(value)) {
    return "NIK harus terdiri dari 16 digit angka.";
  }
  return "";
}
