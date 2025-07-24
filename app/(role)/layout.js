"use client";

import "../globals.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { User, Menu, X } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import PropTypes from "prop-types";

export default function BerandaLayout({ children }) {
  const [userName, setUserName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const updateUser = () => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        try {
          const parsedUser = JSON.parse(storedUser);
          const name = parsedUser?.user?.name || parsedUser?.name || "";
          setUserName(name);
        } catch (error) {
          console.error("Gagal parsing user dari localStorage:", error);
          setUserName("");
        }
      } else {
        setUserName("");
      }
    };

    updateUser();
    window.addEventListener("storage", updateUser);
    return () => window.removeEventListener("storage", updateUser);
  }, []);

  // Lock scroll saat sidebar terbuka di mobile
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#27AE60] fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 md:px-8 py-3 shadow">
        {/* Logo dan Nama */}
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo Desa Limmapocoe" width={45} height={45} priority />
          <span className="text-white font-semibold text-lg md:text-xl">Desa Limapocoe</span>
        </div>

        {/* Tombol Sidebar Mobile */}
        <div className="md:hidden">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>{sidebarOpen ? <X size={28} className="text-white" /> : <Menu size={28} className="text-white" />}</button>
        </div>

        {/* Info User (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <User size={18} className="text-white" />
          {userName ? (
            <Link href="/profil" className="text-white text-sm">
              {userName}
            </Link>
          ) : (
            <span className="text-white text-sm">Pengguna</span>
          )}
        </div>
      </header>

      {/* Body Layout */}
      <div className="pt-16 relative flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Sidebar Mobile */}
        {sidebarOpen && (
          <>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <button type="button" aria-label="Tutup sidebar" className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)}></button>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>

      {/* Footer */}
      <footer className="bg-[#1E844A] text-white text-center py-4 px-4 text-xs sm:text-base">
        <div className="max-w-screen-xl mx-auto">© 2025 Pemerintah Desa Limapocoe - dikelola oleh Tim IT Desa</div>
      </footer>
    </div>
  );
}

BerandaLayout.propTypes = {
  children: PropTypes.node.isRequired,
};