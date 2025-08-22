"use client";
import InputField from "./InputField";
import PropTypes from "prop-types";

export default function Nama({
  label = "Nama",
  name = "nama",
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
  if (!/^[a-zA-Z\s.,]{1,}$/.test(value)) {
    return "Form tidak boleh kosong dan hanya boleh huruf, spasi, titik, atau koma.";
  }
  return "";
}

Nama.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
};
