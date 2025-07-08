"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

const formSchemaBySuratKode = {
  SKTM: [
    { name: "nama_ayah", label: "Nama Ayah", type: "text" },
    { name: "pekerjaan_ayah", label: "Pekerjaan Ayah", type: "text" },
    { name: "nama_ibu", label: "Nama Ibu", type: "text" },
    { name: "pekerjaan_ibu", label: "Pekerjaan Ibu", type: "text" },
    { name: "jumlah_tanggungan", label: "Jumlah Tanggungan", type: "number" },
    { name: "pekerjaan", label: "Pekerjaan", type: "text" },
  ],
  SKU: [
    { name: "pekerjaan", label: "Pekerjaan", type: "text" },
    { name: "nama_usaha", label: "Nama Usaha", type: "text" },
    { name: "lokasi_usaha", label: "Lokasi Usaha", type: "text" },
  ],
};

export default function BuatSuratBaru() {
  const router = useRouter();
  const { jenisSurat } = useParams(); // ID surat

  const [formKey, setFormKey] = useState(null);
  const [formData, setFormData] = useState({});
  const [lampiran, setLampiran] = useState(null);
  const [surat, setSurat] = useState(null);
  const [suratSlug, setSuratSlug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileInfo, setProfileInfo] = useState({});

  useEffect(() => {
    const fetchSuratAndProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token || !jenisSurat) return;

      try {
        // Ambil daftar jenis surat dari internal API
        const suratRes = await fetch("/api/letter", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const suratData = await suratRes.json();
        const selected = suratData.jenis_surat?.find(
          (item) => item.id.toString() === jenisSurat
        );

        if (!selected) throw new Error("Surat tidak ditemukan.");
        setSurat(selected);
        setFormKey(selected.kode_surat);
        setSuratSlug(selected.slug);

        // Ambil profil masyarakat dari internal route
        const profileRes = await fetch("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const profileJson = await profileRes.json();
        setProfileInfo(profileJson?.user || {});
      } catch (err) {
        console.error("Gagal memuat data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuratAndProfile();
  }, [jenisSurat]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Token tidak tersedia.");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(`data_surat[${key}]`, value);
    });
    if (lampiran) data.append("lampiran", lampiran);

    try {
      const res = await fetch(`/api/letter/${suratSlug}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: data,
      });

      const result = await res.json();
      if (!res.ok) {
        console.error("Respon Gagal:", result);
        return alert(`Gagal: ${result.message || "Terjadi kesalahan."}`);
      }

      router.push(`/admin/pengajuan-surat/${jenisSurat}`);
    } catch (err) {
      console.error("Gagal submit:", err);
      alert("Gagal mengirim pengajuan.");
    }
  };

  const fields = formSchemaBySuratKode[formKey] || [];

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-6">
        📝 Pengajuan Surat {surat?.nama_surat || ""}
      </h2>

      {loading ? (
        <p>⏳ Memuat data formulir...</p>
      ) : !formKey ? (
        <p className="text-red-600">Formulir tidak tersedia untuk jenis surat ini.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Data Pemohon */}
          <fieldset className="border p-4 rounded bg-gray-50">
            <legend className="text-sm font-semibold text-gray-700">👤 Data Pemohon</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div>
                <label className="text-sm block text-gray-600 mb-1">Nama</label>
                <input
                  type="text"
                  value={profileInfo?.name || "-"}
                  disabled
                  className="w-full border px-3 py-2 rounded bg-gray-100"
                />
              </div>
              <div>
                <label className="text-sm block text-gray-600 mb-1">NIK</label>
                <input
                  type="text"
                  value={profileInfo?.nik || "-"}
                  disabled
                  className="w-full border px-3 py-2 rounded bg-gray-100"
                />
              </div>
            </div>
          </fieldset>

          {/* Input Dinamis */}
          <div>
            <h3 className="text-sm font-semibold mb-2">📋 Data Tambahan</h3>
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    required
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Lampiran */}
          <div>
            <label className="block text-sm font-medium mb-1">📎 Lampiran (opsional)</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setLampiran(e.target.files[0])}
              className="w-full"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded font-semibold"
            >
              🚀 Ajukan Surat
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
