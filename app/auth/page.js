"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Username, { validateUsername } from "@/components/form/Username";
import KataSandi, { validatePassword } from "@/components/form/KataSandi";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showLoginError, setShowLoginError] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleChange = ({ name, value }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "username") setErrors((prev) => ({ ...prev, username: validateUsername(value) }));
    if (name === "password") setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
  };

  const validate = () => {
    const newErrors = {
      username: form.username.trim() === "" ? "Username wajib diisi." : "",
      password: form.password.trim() === "" ? "Kata sandi wajib diisi." : "",
    };
    Object.keys(newErrors).forEach((k) => !newErrors[k] && delete newErrors[k]);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // Coba parse JSON, tapi jika gagal, tangani di bawah
      const result = await res.json().catch(() => null);

      if (!res.ok) {
        if (res.status === 401 || res.status === 400) {
          // Kredensial salah, tapi server masih OK
          setErrors({ general: "Username atau Kata Sandi Anda tidak valid." });
        } else {
          // Error lain (500, dsb)
          setShowLoginError(true);
        }
        return;
      }
      // Sukses login
      if (result?.access_token && result?.user) {
        const expiresAt = Date.now() + 60 * 60 * 1000; // 1 jam dari sekarang
        localStorage.setItem("token", result.access_token);
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("expiresAt", expiresAt.toString());

        if (result.role === "kepala-desa") {
          router.push("/kepdes/dashboard");
        } else if (result.role === "staff-desa") {
          router.push("/admin/dashboard");
        }
      } else {
        // Jika respons 200 tapi tidak lengkap
        setShowLoginError(true);
      }
    } catch (err) {
      // Server tidak bisa dihubungi / fetch error
      setShowLoginError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-4xl font-bold mb-6 text-center text-[#27AE60]">MASUK</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Username value={form.username} onChange={handleChange} error={errors.username} />
        <KataSandi value={form.password} onChange={handleChange} error={errors.password} />
        {errors.general && <p className="text-red-600 text-sm text-center">{errors.general}</p>}

        <button type="submit" disabled={loading} className="w-full bg-[#27AE60] text-white py-2 rounded-md hover:bg-green-600 disabled:opacity-50">
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>

      {showLoginError && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-7 py-12 w-[252px] text-center animate-fade-in">
            <h3 className="text-[#EB5757] text-2xl font-bold mb-8">Gagal Melakukan Login</h3>
            <p className="text-sm text-[#141414] leading-relaxed mb-10">Maaf, terjadi kesalahan saat masuk. Silakan coba lagi nanti atau periksa koneksi internet Anda.</p>
            <button onClick={() => setShowLoginError(false)} className="bg-[#EB5757] hover:bg-[#c94444] text-white rounded px-6 py-2 text-sm">
              Kembali
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
