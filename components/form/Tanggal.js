"use client";
import InputField from "./InputField";

export default function TanggalPengaduan({ value }) {
  const formattedValue = value
    ? new Date(value).toLocaleString("id-ID", {
        dateStyle: "full",
      })
    : "";

  return (
    <InputField
      label="Tanggal Pengaduan"
      name="created_at"
      value={formattedValue}
      disabled={true}
    />
  );
}
