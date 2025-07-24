"use client";
import InputField from "./InputField";
import PropTypes from "prop-types";
export default function NomorTelepon({ label="Nomor Telepon", name="no_whatsapp", value, onChange, error, disabled = false }) {
  return (
    <InputField
      label={label}
      name={name}
      value={value}
      maxLength={13}
      onChange={(e) => onChange({ name, value: e.target.value.replace(/\D/g, "") })}
      error={error}
      disabled={disabled}
    />
  );
}

export function validateNomorTelepon(value) {
  if (!/^08\d{8,11}$/.test(value)) {
    return "Nomor telepon tidak valid. Harus dimulai dengan 08 dan 10-13 digit.";
  }
  return "";
}

NomorTelepon.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
};