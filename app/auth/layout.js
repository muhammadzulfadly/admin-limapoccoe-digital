// app/auth/layout.js
import "../globals.css";
import PropTypes from "prop-types";

export const metadata = {
  title: "Desa Limmapocoe",
  description: "Website Resmi Pemerintah Desa Limmapocoe",
};

export default function LoginLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Kiri: Background + logo + teks */}
      <div className="w-1/2 relative hidden lg:block">
        <img src="/bg-limapoccoe.png" alt="Limapoccoe Background" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center">
          <img src="/logo.png" alt="Logo" className="w-40 h-40 mb-4" />
          <h1 className="text-3xl font-bold">LimapoccoeDigital</h1>
        </div>
      </div>

      {/* Kanan: Area konten */}
      <div className="w-full lg:w-1/2 bg-white relative flex items-center justify-center px-6">
      {children}
      </div>
    </div>
  );
}

LoginLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
