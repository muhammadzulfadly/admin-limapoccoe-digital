"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import PropTypes from "prop-types";
export default function KataSandi({
  label = "Kata Sandi",
  name = "password",
  value,
  onChange,
  error,
  disabled = false,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      {/* Label */}
      <label
        className={`block mb-1 text-xs md:text-sm font-medium ${
          error ? "text-red-500" : "text-gray-500"
        }`}
      >
        {label}
        <span className="text-red-500 ml-0.5">*</span>
      </label>

      {/* Input with eye icon */}
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange({ name, value: e.target.value })}
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
            py-1.5 px-0 pr-10

            md:border md:rounded-lg md:px-4 md:py-2
            ${error ? "border-red-500 focus:border-red-500" : ""}
          `}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Error message */}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export function validateKataSandi(value) {
  if (value.length < 12) {
    return "Kata sandi minimal 12 karakter.";
  }
  return "";
}

KataSandi.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
};