"use client";
import InputField from "./InputField";
import PropTypes from "prop-types";
export default function Date({ value }) {
  const formattedValue = value
    ? new Date(value).toLocaleString("id-ID", {
        dateStyle: "full",
      })
    : "";

  return (
    <InputField
      label="Tanggal"
      name="created_at"
      value={formattedValue}
      disabled={true}
    />
  );
}

Date.propTypes = {
  value: PropTypes.string.isRequired,
};
