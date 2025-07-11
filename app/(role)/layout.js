"use client";

import "../globals.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { User } from "lucide-react";
import Sidebar from "./sidebar";

export default function BerandaLayout({ children }) {
  const [userName, setUserName] = useState("");

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

    return () => {
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  return (
    <>
      {/* Header */}
      <header className="bg-[#2DB567] fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-3 shadow">
        {/* Kiri: Logo dan Nama */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo Desa Limmapocoe" width={45} height={45} priority />
          <span className="text-white font-bold text-lg md:text-xl">Desa Limapocoe</span>
        </Link>

        {/* Kanan: Login vs Dashboard */}
        {userName ? (
          <div className="flex items-center gap-4">
            <User size={18} className="text-white" />
            <Link href="/profil" className="text-white text-sm">
              {userName}
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <User size={18} className="text-white" />
            <div className="text-white text-sm">Pengguna</div>
          </div>
        )}
      </header>

      {/* Isi halaman */}
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>

      {/* Footer */}
      <footer className="bg-[#1E844A] text-white text-center py-4 text-base">© 2025 Pemerintah Desa Limapocoe - dikelola oleh Tim IT Desa</footer>
    </>
  );
}
