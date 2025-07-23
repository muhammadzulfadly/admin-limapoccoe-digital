"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Home, FileText, FileEdit, ChevronDown, LayoutDashboard, CalendarCheck, User, Users } from "lucide-react";

export default function SidebarAdmin({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();

  const [jenisSurat, setJenisSurat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [role, setRole] = useState(null);
  const [roleLabel, setRoleLabel] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const getPrefix = () => {
    if (role === "staff-desa") return "/admin";
    if (role === "kepala-desa") return "/kepdes";
    return "";
  };

  useEffect(() => {
    if (!role) return;

    const prefix = role === "staff-desa" ? "/admin" : role === "kepala-desa" ? "/kepdes" : "";
    const invalidPrefix = role === "staff-desa" ? "/kepdes" : "/admin";

    // Jika pengguna mengakses URL yang bukan miliknya
    if (pathname.startsWith(invalidPrefix)) {
      const correctedPath = pathname.replace(invalidPrefix, prefix);
      router.replace(correctedPath);
    }
  }, [role, pathname, router]);

  const isActive = (path) => pathname === path || pathname.startsWith(`${path}/`);

  const linkClass = (path) => `${isActive(path) ? "text-green-500 font-medium" : "text-black"} hover:text-green-600 flex items-center gap-2`;

  const suratBasePath = `${getPrefix()}/pengajuan-surat`;
  const isPengajuanSuratActive = useMemo(() => pathname.startsWith(suratBasePath), [pathname, role]);

  useEffect(() => {
    setIsDropdownOpen(isPengajuanSuratActive);
  }, [isPengajuanSuratActive]);

  return (
    <>
      {/* Sidebar Container */}
      <div
        className={`fixed top-[64px] left-0 z-40 w-57 bottom-0 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:transform-none md:h-full bg-white md:bg-transparent border-r border-gray-200 flex flex-col`}
      >
        <aside className="p-6 flex-1 overflow-y-auto bg-white pb-44 md:pb-6">
          {roleLabel && <h2 className="text-2xl font-semibold mb-2">{roleLabel}</h2>}
          <h2 className="font-semibold text-base mb-4">Pelayanan Desa</h2>

          <ul className="space-y-3 text-sm pl-1">
            <li>
                <Link href={`/profil`} onClick={onClose} className={`${linkClass(`/profil`)} block md:hidden`}>
                  <User size={18} />
                  Profil
                </Link>
              </li>
            <li>
              <Link href={`${getPrefix()}/dashboard`} onClick={onClose} className={linkClass(`${getPrefix()}/dashboard`)}>
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            </li>
            <li>
              <a href="https://limapoccoedigital.id" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 flex items-center gap-2 text-black">
                <Home size={18} />
                Beranda
              </a>
            </li>
            {role === "staff-desa" && (
              <>
                <li>
                  <Link href={`${getPrefix()}/informasi-desa`} onClick={onClose} className={linkClass(`${getPrefix()}/informasi-desa`)}>
                    <CalendarCheck size={18} />
                    Informasi Desa
                  </Link>
                </li>
                <li>
                  <Link href={`${getPrefix()}/data-penduduk`} onClick={onClose} className={linkClass(`${getPrefix()}/data-penduduk`)}>
                    <Users size={18} />
                    Data Kependudukan
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link href={`${getPrefix()}/pengaduan`} onClick={onClose} className={linkClass(`${getPrefix()}/pengaduan`)}>
                <FileText size={18} />
                Pengaduan
              </Link>
            </li>
            <li>
              <div className="flex items-center gap-5">
                <Link href={suratBasePath} className={`flex items-center gap-2 hover:text-green-600 ${isPengajuanSuratActive ? "text-green-500" : "text-black"}`}>
                  <FileEdit size={18} />
                  Pengajuan Surat
                </Link>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="ml-1 focus:outline-none">
                  <ChevronDown size={16} className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-180 text-green-500" : "text-black"}`} />
                </button>
              </div>

              {isDropdownOpen && (
                <ul className="pl-7 mt-3 text-sm">
                  {loading ? (
                    <li className="italic text-gray-500">Memuat...</li>
                  ) : (
                    jenisSurat.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`${suratBasePath}/${item.slug}`}
                          onClick={onClose}
                          className={`${isActive(`${suratBasePath}/${item.slug}`) ? "text-green-500" : "text-black"} hover:text-green-600 block break-words border-b border-gray-200 md:border-none py-1.5 max-w-[125px]`}
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
      </div>

      {/* Popup sesi berakhir */}
      {showSessionExpired && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-6 py-8 w-[280px] text-center animate-fade-in">
            <h3 className="text-[#EB5757] text-2xl font-bold mb-4">Sesi Berakhir</h3>
            <p className="text-sm text-[#141414] leading-relaxed mb-6">Sesi Anda telah berakhir. Silakan masuk kembali untuk melanjutkan.</p>
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
    </>
  );
}
