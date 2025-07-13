"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";

import {
  Agama,
  Alamat,
  validateAlamat,
  AnakKe,
  Bangsa,
  Bpjs,
  DeskripsiPengaduan,
  Dusun,
  validateDusun,
  InputField,
  JenisKelamin,
  validateGender,
  JudulPengaduan,
  JumlahTanggunganOrtu,
  validateTanggungan,
  KataSandi,
  KategoriPengaduan,
  KonfirmasiSandi,
  LokasiKejadian,
  LokasiUsaha,
  MasKawin,
  NamaLengkap,
  validateNama,
  NamaUsaha,
  Nik,
  validateNik,
  NomorDokumen,
  NomorRumah,
  NomorTelepon,
  Pekerjaan,
  validatePekerjaan,
  Pendidikan,
  Penghasilan,
  PerkiraanLokasi,
  PukulKelahiran,
  Respon,
  RtRw,
  validateRtRw,
  Saksi,
  StatusHubungan,
  StatusPerkawinan,
  Tanggal,
  TanggalLahir,
  validateTanggal,
  TempatLahir,
  validateTempat,
  Username,
} from "@/components/form";

Nik.validate = validateNik;
NamaLengkap.validate = validateNama;
TempatLahir.validate = validateTempat;
TanggalLahir.validate = validateTanggal;
JenisKelamin.validate = validateGender;
Alamat.validate = validateAlamat;
Pekerjaan.validate = validatePekerjaan;
Dusun.validate = validateDusun;
RtRw.validate = validateRtRw;
JumlahTanggunganOrtu.validate = validateTanggungan;

const formatTanggalToSubmit = (val) => {
  if (!val) return "";
  const [y, m, d] = val.split("-");
  return `${d}-${m}-${y}`;
};

const formSchemaBySuratKode = {
  SKTM: [
    { type: "separator", label: "Informasi Orang Tua" },
    { name: "nama_ayah", Component: NamaLengkap, props: { label: "Nama Ayah" } },
    { name: "pekerjaan_ayah", Component: Pekerjaan, props: { label: "Pekerjaan Ayah" } },
    { name: "nama_ibu", Component: NamaLengkap, props: { label: "Nama Ibu" } },
    { name: "pekerjaan_ibu", Component: Pekerjaan, props: { label: "Pekerjaan Ibu" } },
    { name: "jumlah_tanggungan", Component: JumlahTanggunganOrtu },
  ],
  SKU: [
    { type: "separator", label: "Informasi Usaha" },
    { name: "nama_usaha", Component: NamaUsaha },
    { name: "lokasi_usaha", Component: LokasiUsaha },
  ],
};

export default function BuatSuratBaru() {
  const router = useRouter();
  const { jenisSurat } = useParams();

  const [formKey, setFormKey] = useState(null);
  const [formData, setFormData] = useState({});
  const [surat, setSurat] = useState(null);
  const [suratSlug, setSuratSlug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  const [tooManyRequestsMessage, setTooManyRequestsMessage] = useState("");

  // Fetch surat info
  useEffect(() => {
    const fetchSurat = async () => {
      const token = localStorage.getItem("token");
      if (!token || !jenisSurat) return;

      try {
        const suratRes = await fetch("/api/letter", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const suratData = await suratRes.json();
        const selected = suratData.jenis_surat?.find((item) => item.slug.toString() === jenisSurat);

        if (!selected) throw new Error("Surat tidak ditemukan.");

        setSurat(selected);
        setFormKey(selected.kode_surat);
        setSuratSlug(selected.slug);
      } catch (err) {
        console.error("Gagal memuat surat:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurat();
  }, [jenisSurat]);

  const fields = formSchemaBySuratKode[formKey] || [];
  const dataFields = fields.filter((f) => f.name && f.Component);

  const handleChange = ({ name, value }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Coba cari di semua komponen yang ada validatornya
    const validators = {
      nik: Nik.validate,
      nama: NamaLengkap.validate,
      tempat_lahir: TempatLahir.validate,
      tanggal_lahir: TanggalLahir.validate,
      jenis_kelamin: JenisKelamin.validate,
      alamat: Alamat.validate,
      pekerjaan: Pekerjaan.validate,
      dusun: Dusun.validate,
      rt_rw: RtRw.validate,
    };

    if (validators[name]) {
      const error = validators[name](value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // Validasi Informasi Pribadi (manual)
    const personalFields = [
      { name: "nik", required: true },
      { name: "nama", required: true, validate: NamaLengkap.validate },
      { name: "tempat_lahir", required: true, validate: TempatLahir.validate },
      { name: "tanggal_lahir", required: true },
      { name: "jenis_kelamin", required: true },
      { name: "alamat", required: true },
      { name: "pekerjaan", required: true, validate: Pekerjaan.validate },
      { name: "dusun", required: true },
    ];

    personalFields.forEach(({ name, required, validate }) => {
      const value = formData[name];

      if (required && (!value || value.toString().trim() === "")) {
        newErrors[name] = "Form tidak boleh kosong.";
        return;
      }

      if (typeof validate === "function") {
        const errorMsg = validate(value);
        if (errorMsg) newErrors[name] = errorMsg;
      }
    });

    // Validasi field tambahan (berdasarkan kode surat)
    dataFields.forEach(({ name, Component }) => {
      const value = formData[name];
      if (!value || value.toString().trim() === "") {
        newErrors[name] = "Form tidak boleh kosong.";
        return;
      }
      if (typeof Component?.validate === "function") {
        const errorMsg = Component.validate(value);
        if (errorMsg) newErrors[name] = errorMsg;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setShowConfirm(true);
  };

  const submitSurat = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowFailed(true);
      return;
    }

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "tanggal_lahir") {
        data.append(`data_surat[${key}]`, formatTanggalToSubmit(value));
      } else {
        data.append(`data_surat[${key}]`, value ?? "");
      }
    });

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

      if (res.status === 429) {
        setShowConfirm(false);
        setTooManyRequestsMessage(result.error || "Terlalu banyak permintaan. Silakan coba lagi dalam 2 menit");
        return;
      }

      if (!res.ok || !result?.ajuan_surat?.id) {
        console.error("❌ Gagal submit atau ID tidak ditemukan:", result);
        setShowConfirm(false);
        setShowFailed(true);
        return;
      }

      const id = result.ajuan_surat.id;
      setShowConfirm(false);

      // ✅ Redirect ke halaman nomor-surat
      router.push(`/admin/pengajuan-surat/${jenisSurat}/${id}/nomor-surat`);
    } catch (err) {
      console.error("⚠️ Gagal submit:", err);
      setShowConfirm(false);
      setShowFailed(true);
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 bg-gray-100 p-8">
        <h1 className="text-xl font-semibold mb-6">
          Pengajuan Surat / <span className="font-semibold">{surat?.nama_surat}</span>
        </h1>

        <div className="bg-white rounded-md shadow-sm p-8">
          <button type="button" onClick={() => router.back()} className="flex items-center text-base text-gray-500 mb-6">
            <ChevronLeft size={30} className="mr-1" />
            Kembali
          </button>
          {loading ? (
            <p>⏳ Memuat data formulir...</p>
          ) : !formKey ? (
            <p className="text-red-600">Formulir tidak tersedia untuk jenis surat ini.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <legend className="text-xl text-start font-semibold text-gray-700">Informasi Pribadi</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <Nik value={formData.nik ?? ""} onChange={handleChange} name="nik" error={errors.nik} />
                <NamaLengkap value={formData.nama ?? ""} onChange={handleChange} name="nama" error={errors.nama} />
                <TempatLahir value={formData.tempat_lahir ?? ""} onChange={handleChange} name="tempat_lahir" error={errors.tempat_lahir} />
                <TanggalLahir value={formData.tanggal_lahir ?? ""} onChange={handleChange} name="tanggal_lahir" error={errors.tanggal_lahir} />
                <JenisKelamin value={formData.jenis_kelamin ?? ""} onChange={handleChange} name="jenis_kelamin" error={errors.jenis_kelamin} />
                <Alamat value={formData.alamat ?? ""} onChange={handleChange} name="alamat" error={errors.alamat} />
                <Pekerjaan value={formData.pekerjaan ?? ""} onChange={handleChange} name="pekerjaan" error={errors.pekerjaan} />
                <Dusun value={formData.dusun ?? ""} onChange={handleChange} name="dusun" error={errors.dusun} />
                <RtRw value={formData.rt_rw ?? ""} onChange={handleChange} name="rt_rw" error={errors.rt_rw} />
              </div>
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fields.map((field, index) => {
                    if (field.type === "separator") {
                      return (
                        <div key={`separator-${index}`} className="col-span-full pt-4">
                          <p className="text-xl text-start font-semibold text-gray-600">{field.label}</p>
                        </div>
                      );
                    }
                    const { name, Component, props } = field;
                    return <Component key={name} name={name} value={formData[name] || ""} onChange={handleChange} error={errors[name]} {...props} />;
                  })}
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <button type="submit" className="bg-[#27AE60] hover:bg-green-600 text-white px-6 py-2 rounded font-semibold">
                  Ajukan Surat
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-6 py-8 w-[300px] text-center space-y-4 animate-fade-in">
            <h3 className="text-green-600 text-xl font-bold">Konfirmasi Pengajuan Surat!</h3>
            <p className="text-sm text-gray-700">Pastikan seluruh informasi yang Anda isi sudah benar.</p>
            <button onClick={submitSurat} className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded font-semibold">
              Ajukan surat
            </button>
            <button onClick={() => setShowConfirm(false)} className="text-gray-500 hover:underline text-sm">
              Periksa Ulang
            </button>
          </div>
        </div>
      )}

      {showFailed && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-6 py-9 w-[300px] text-center animate-fade-in">
            <h3 className="text-red-600 text-xl font-bold mb-2">Pengajuan Gagal!</h3>
            <p className="text-sm text-gray-800 leading-relaxed mb-4">Maaf, pengajuan surat Anda tidak berhasil diproses. Silakan coba lagi nanti atau periksa koneksi Anda.</p>
            <button onClick={() => setShowFailed(false)} className="bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded font-semibold">
              Kembali
            </button>
          </div>
        </div>
      )}

      {tooManyRequestsMessage && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-6 py-9 w-[300px] text-center animate-fade-in">
            <h3 className="text-yellow-600 text-xl font-bold mb-2">Terlalu Banyak Permintaan!</h3>
            <p className="text-sm text-gray-800 leading-relaxed mb-4">{tooManyRequestsMessage}</p>
            <button onClick={() => setTooManyRequestsMessage("")} className="bg-yellow-500 hover:bg-yellow-600 text-white w-full py-2 rounded font-semibold">
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
