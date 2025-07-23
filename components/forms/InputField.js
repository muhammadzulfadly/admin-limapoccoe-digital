"use client";

export default function InputField({
  label,
  name,
  value,
  onChange,
  error,
  required = true,
  disabled = false,
  ...props
}) {
  return (
    <div>
      {/* Label */}
      <label
        className={`block mb-1 text-xs md:text-sm font-medium ${
          error ? "text-red-500" : "text-gray-500"
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {/* Input */}
      <input
        name={name}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        placeholder={`Masukkan ${label}`}
        className={`
          w-full
          outline-none
          text-sm
          bg-white
          transition-all
          
          border-b border-gray-300
          focus:border-green-500
          placeholder:text-gray-400
          py-1.5 px-0

          md:border md:rounded-lg md:px-4 md:py-2
          ${error ? "border-red-500 focus:border-red-500" : ""}
        `}
        {...props}
      />

      {/* Error */}
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}
