"use client";

export default function InputField({ label, name, value, onChange, error, required = true, disabled = false, ...props }) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-500">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={`Masukkan ${label}`}
        className={`w-full border ${error ? "border-red-500" : "border-gray-300"} rounded px-4 py-2 mt-1 text-sm`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
