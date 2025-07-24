"use client";
import InputField from "./InputField";
import PropTypes from "prop-types";

export default function AngkaHuruf({ label="AngkaHuruf", name="angkahuruf", value, onChange, error, disabled = false }) {
  return (
    <InputField
      label={label}
      name={name}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange({ name, value: e.target.value })}
      error={error}
    />
  );
}

export function validateAngkaHuruf(value) {
  if (!value || value.length < 1) {
    return "Form tidak boleh kosong.";
  }
  return "";
}

AngkaHuruf.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
};