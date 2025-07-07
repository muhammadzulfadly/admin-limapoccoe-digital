export default function ResponPengaduan({
  value,
  onChange,
  error,
  disabled = false,
  hideLabel = false,
}) {
  return (
    <div>
      {!hideLabel && (
        <label className="text-sm font-semibold text-gray-500">
          Tanggapan Staff Desa
        </label>
      )}
      <textarea
        name="respon"
        value={value}
        onChange={(e) => onChange({ name: "respon", value: e.target.value })}
        disabled={disabled}
        rows={5}
        placeholder="Ketik tanggapan Anda di sini..."
        className={`w-full border rounded px-4 py-2 bg-white mt-1 text-sm resize-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}


export function validateRespon(value) {
  if (!value || value.trim().length < 0) {
    return "Kolom tanggapan tidak boleh kosong. Harap berikan tanggapan sebelum melanjutkan.";
  }
  return "";
}
