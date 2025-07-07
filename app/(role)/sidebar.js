"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  FileText,
  FileEdit,
  ChevronDown,
  LayoutDashboard,
  CalendarCheck,
  Users,
  Menu,
  X,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [jenisSurat, setJenisSurat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [role, setRole] = useState(null);
  const [roleLabel, setRoleLabel] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiresAt = localStorage.getItem("expiresAt");

    if (!token || !expiresAt || Date.now() > parseInt(expiresAt)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("expiresAt");
      setShowSessionExpired(true);
    } else {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const roleName = user?.roles?.[0] || null;

      setRole(roleName);
      if (roleName === "staff-desa") setRoleLabel("Admin");
      else if (roleName === "kepala-desa") setRoleLabel("Kepala Desa");
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/letter", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setJenisSurat(data.jenis_surat || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [router]);

  // 🔁 Fungsi untuk prefix path berdasarkan role
  const getPath = (route) => {
    if (!role) return "#";
    const prefix = role === "staff-desa" ? "/admin" : role === "kepala-desa" ? "/kepdes" : "";
    return `${prefix}${route}`;
  };

  // 🔁 Penyesuaian isActive untuk prefix role
  const isActive = (path) => {
    const fullPath = getPath(path);
    return pathname === fullPath || pathname.startsWith(fullPath + "/");
  };

  const linkClass = (path) =>
    `${isActive(path) ? "text-green-500 font-medium" : "text-black"} hover:text-green-600 flex items-center gap-2`;

  const renderSidebar = () => (
    <aside className="w-64 p-6 border-r border-gray-200 h-screen sticky top-0 bg-white overflow-y-auto">
      {roleLabel && <h2 className="text-2xl font-semibold mb-3">{roleLabel}</h2>}
      <h2 className="text-base font-semibold mb-4">Pelayanan Desa</h2>

      <ul className="space-y-3 text-sm pl-3">
        {/* Dashboard */}
        <li>
          <Link href={getPath("/dashboard")} className={linkClass("/dashboard")}>
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
        </li>

        {/* Beranda eksternal */}
        <li>
          <a
            href="https://limapoccoedigital.id"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-600 flex items-center gap-2 text-black"
          >
            <Home size={18} />
            Beranda
          </a>
        </li>

        {/* Admin only */}
        {role === "staff-desa" && (
          <>
            <li>
              <Link href={getPath("/informasi-desa")} className={linkClass("/informasi-desa")}>
                <CalendarCheck size={18} />
                Informasi desa
              </Link>
            </li>
            <li>
              <Link href={getPath("/data-penduduk")} className={linkClass("/data-penduduk")}>
                <Users size={18} />
                Data penduduk
              </Link>
            </li>
          </>
        )}

        {/* Pengaduan */}
        <li>
          <Link href={getPath("/pengaduan")} className={linkClass("/pengaduan")}>
            <FileText size={18} />
            Pengaduan
          </Link>
        </li>

        {/* Pengajuan Surat */}
        <li>
          <div className="flex items-center gap-5">
            <Link
              href={getPath("/pengajuan-surat")}
              className={`flex items-center gap-2 font-medium hover:text-green-600 ${
                isActive("/pengajuan-surat") ? "text-green-500" : "text-black"
              }`}
            >
              <FileEdit size={18} />
              Pengajuan Surat
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="ml-1 focus:outline-none">
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-green-500" : "text-black"
                }`}
              />
            </button>
          </div>

          {isOpen && (
            <ul className="pl-9 mt-4 space-y-3 text-sm">
              {loading ? (
                <li className="italic text-gray-500">Memuat...</li>
              ) : (
                jenisSurat.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={getPath(`/pengajuan-surat/${item.id}`)}
                      className={`${
                        isActive(`/pengajuan-surat/${item.id}`) ? "text-green-500 font-medium" : "text-black"
                      } hover:text-green-600 block max-w-[120px] break-words`}
                    >
                      {item.nama_surat}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          )}
        </li>
      </ul>
    </aside>
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar for Desktop */}
      <div className="hidden md:block">{renderSidebar()}</div>

      {/* Toggle Button for Mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-4 left-4 md:hidden z-50 bg-white p-2 rounded shadow"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar for Mobile */}
      {sidebarOpen && (
        <div className="fixed z-40 inset-0 bg-black/40 flex">
          <div className="bg-white w-64 h-full shadow-lg">{renderSidebar()}</div>
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Session expired popup */}
      {showSessionExpired && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-6 py-8 w-[280px] text-center animate-fade-in">
            <h3 className="text-[#EB5757] text-2xl font-bold mb-4">Sesi Berakhir</h3>
            <p className="text-sm text-[#141414] leading-relaxed mb-6">
              Sesi Anda telah berakhir. Silakan masuk kembali untuk melanjutkan.
            </p>
            <button
              onClick={() => {
                setShowSessionExpired(false);
                router.push("/auth");
              }}
              className="bg-[#EB5757] hover:bg-[#c94444] text-white rounded px-6 py-2 text-sm"
            >
              Masuk Ulang
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
