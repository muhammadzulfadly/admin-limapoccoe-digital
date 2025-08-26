"use client";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import DOMPurify from "dompurify";

export default function DeskripsiEditor({ label = "Deskripsi", name = "description", value, onChange, error, disabled = false, hideLabel = false, placeholder = "Tulis deskripsi di sini…" }) {
  const editorRef = useRef(null);
  const [active, setActive] = useState({ bold: false, italic: false, underline: false });

  // isi awal hanya saat pertama mount
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML.trim() === "" && value) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  // update tombol aktif berdasarkan seleksi
  useEffect(() => {
    const handler = () => updateActiveStates();
    document.addEventListener("selectionchange", handler);
    return () => document.removeEventListener("selectionchange", handler);
  }, []);

  const updateActiveStates = () => {
    const sel = window.getSelection();
    const inEditor = editorRef.current && sel && editorRef.current.contains(sel.anchorNode);
    if (!inEditor) return;
    setActive({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
    });
  };

  const exec = (cmd) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, null);
    emitChange();
    updateActiveStates();
  };

  const emitChange = () => {
    if (!editorRef.current) return;
    const raw = editorRef.current.innerHTML;
    const clean = DOMPurify.sanitize(raw, {
      ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "p", "br"],
      ALLOWED_ATTR: [],
    });
    onChange({ name, value: clean });
  };

  const onPaste = (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.execCommand("insertHTML", false, "<br><br>");
      emitChange();
    }
  };

  const btnClass = (isActive) => `px-2 py-1 text-sm rounded border transition ${isActive ? "bg-gray-200 border-gray-400" : "bg-transparent border-gray-300 hover:bg-white"}`;

  return (
    <div>
      {!hideLabel && (
        <label className={`block mb-1 text-xs md:text-sm font-medium ${error ? "text-red-500" : "text-gray-500"}`}>
          {label} <span className="text-red-500">*</span>
        </label>
      )}

      <div className={`w-full bg-white border md:rounded-lg overflow-hidden ${error ? "border-red-500" : "border-gray-300"} ${disabled ? "opacity-75" : ""}`}>
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("bold");
            }}
            className={`${btnClass(active.bold)} font-bold`}
            disabled={disabled}
            title="Bold"
          >
            B
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("italic");
            }}
            className={`${btnClass(active.italic)} italic`}
            disabled={disabled}
            title="Italic"
          >
            I
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("underline");
            }}
            className={`${btnClass(active.underline)} underline`}
            disabled={disabled}
            title="Underline"
          >
            U
          </button>
        </div>

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable={!disabled}
          dir="ltr"
          className="min-h-[75px] text-sm px-3 md:px-4 py-2 outline-none focus-visible:ring-0"
          style={{ whiteSpace: "pre-wrap", textAlign: "left" }}
          onInput={emitChange}
          onBlur={emitChange}
          onPaste={onPaste}
          onKeyDown={onKeyDown} // 👈 tambahkan ini
          placeholder={placeholder}
          data-placeholder={placeholder}
        />
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export function validateDeskripsiEditor(value) {
  const plain = value?.replace(/<[^>]+>/g, "").trim();
  if (!plain) return "Form tidak boleh kosong.";
  return "";
}

DeskripsiEditor.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  hideLabel: PropTypes.bool,
  placeholder: PropTypes.string,
};
