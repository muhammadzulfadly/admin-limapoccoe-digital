"use client";
import InputField from "./InputField";
import PropTypes from "prop-types";

export default function Jam({ label = "Jam", name = "jam", value, onChange, error, disabled = false }) {
  // Hanya izinkan input angka dan titik/dua titik
  const handleChange = (e) => {
    let val = e.target.value.replace(/[^0-9:.]/g, "");

    // Otomatis ubah ":" menjadi "."
    val = val.replace(":", ".");

    // Batasi ke format HH.MM
    const parts = val.split(".");
    if (parts.length > 2) {
      val = parts[0] + "." + parts[1].slice(0, 2); // buang lebih dari satu titik
    }

    onChange({ name, value: val });
  };

  return (
    <InputField
      label={label}
      name={name}
      value={value}
      maxLength={5}
      onChange={handleChange}
      error={error}
      disabled={disabled}
      placeholder="Masukkan Pukul Kelahiran Anak"
    />
  );
}

export function validateJam(value) {
  if (!value) return "Jam tidak boleh kosong";

  const regex = /^([01]?[0-9]|2[0-3])\.[0-5][0-9]$/;
  if (!regex.test(value)) return "Format jam tidak valid (contoh: 09.30 atau 17.45)";
  return "";
}

Jam.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
};
