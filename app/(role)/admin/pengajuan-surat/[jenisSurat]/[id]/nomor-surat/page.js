 "use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function InputNomorSuratPage() {
  const { jenisSurat, id } = useParams();
  const router = useRouter();

  const [nomorSurat, setNomorSurat] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [namaUser, setNamaUser] = useState("Memuat...");
  const [namaSurat, setNamaSurat] = useState("Memuat...");
  const [slug, setSlug] = useState(null);

  // Ambil slug berdasarkan jenisSurat (ID)
  useEffect(() => {
    const fetchSlug = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/letter", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        const found = data.jenis_surat?.find(
          (item) => item.slug.toString() === jenisSurat
        );
        if (!found) throw new Error("Surat tidak ditemukan");
        setSlug(found.slug);
        setNamaSurat(found.nama_surat);
      } catch (err) {
        console.error("⚠️ Gagal mengambil slug:", err);
        setNamaSurat("Jenis Surat");
      }
    };

    fetchSlug();
  }, [jenisSurat]);

  // Setelah slug tersedia, ambil detail pengajuan
  useEffect(() => {
    const fetchDetail = async () => {
      if (!slug || !id) return;

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `/api/letter/${slug}/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        const pengajuan = data.pengajuan_surat;
        setNamaUser(pengajuan?.user?.name || "Pengguna");
        setNomorSurat(pengajuan?.nomor_surat || "");
      } catch (err) {
        console.error("⚠️ Gagal mengambil detail pengajuan:", err);
        setNamaUser("Pengguna");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [slug, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `/api/letter/${slug}/${id}/number`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nomor_surat: nomorSurat }),
        }
      );

      if (!res.ok) throw new Error("Gagal menyimpan nomor surat.");

      router.push(`/admin/pengajuan-surat/${jenisSurat}/${id}/preview`);
    } catch (err) {
      setErrorMsg(err.message || "Terjadi kesalahan saat menyimpan.");
    }
  };

  if (loading) return <p className="p-6">Memuat data...</p>;

  return (
    <div className="bg-gray-100 min-h-screen p-10">
      <div className="max-w-2xl mx-auto bg-white rounded-md shadow-md p-8">
        <h1 className="text-xl font-bold mb-6">
          {namaUser} / {namaSurat}
        </h1>

        <form onSubmit={handleSubmit} className="text-center">
          <h2 className="text-lg font-semibold mb-4">Masukkan Nomor Surat</h2>

          <input
            type="text"
            value={nomorSurat}
            onChange={(e) => setNomorSurat(e.target.value)}
            placeholder="Nomor Surat"
            className="w-64 px-4 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-green-600"
            required
          />

          {errorMsg && (
            <p className="text-red-600 text-sm mb-2">{errorMsg}</p>
          )}

          <div>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
