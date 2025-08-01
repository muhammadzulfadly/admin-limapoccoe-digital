"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, ChevronDown, ChevronUp, ChevronLeft } from "lucide-react";
import PropTypes from "prop-types";

import NIK, { validateNIK } from "@/components/forms/NIK";
import Huruf, { validateHuruf } from "@/components/forms/Huruf";
import StatusHubungan, { validateStatusHubungan } from "@/components/forms/StatusHubungan";
import Tanggal, { validateTanggal } from "@/components/forms/Tanggal";
import JenisKelamin, { validateJenisKelamin } from "@/components/forms/JenisKelamin";
import StatusPerkawinan, { validateStatusPerkawinan } from "@/components/forms/StatusPerkawinan";
import Agama, { validateAgama } from "@/components/forms/Agama";
import Pendidikan, { validatePendidikan } from "@/components/forms/Pendidikan";
import BPJS, { validateBPJS } from "@/components/forms/BPJS";
import Angka, { validateAngka } from "@/components/forms/Angka";
import RTRW, { validateRTRW } from "@/components/forms/RTRW";
import Dusun, { validateDusun } from "@/components/forms/Dusun";

function SuccessPopup({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
        <h2 className="text-[#27AE60] text-2xl font-bold mb-4">Data Berhasil Disimpan</h2>
        <p className="text-gray-700 mb-6">Data warga telah berhasil disimpan ke dalam sistem.</p>
        <button onClick={onClose} className="bg-[#27AE60] text-white px-4 py-2 rounded hover:bg-green-600">
          Tutup
        </button>
      </div>
    </div>
  );
}

function ErrorPopup({ message, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
        <h2 className="text-red-600 text-2xl font-bold mb-4">Gagal Menyimpan</h2>
        <p className="text-gray-700 mb-6">{message || "Terjadi kesalahan saat menyimpan data."}</p>
        <button onClick={onClose} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Tutup
        </button>
      </div>
    </div>
  );
}

export default function TambahDataKependudukan() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    nomor_kk: "",
    no_rumah: "",
    dusun: "",
    rt_rw: "",
    anggota: [
      {
        nik: "",
        nama_lengkap: "",
        hubungan: "",
        tempat_lahir: "",
        tgl_lahir: "",
        jenis_kelamin: "",
        status_perkawinan: "",
        agama: "",
        pendidikan: "",
        pekerjaan: "",
        no_bpjs: "",
        nama_ayah: "",
        nama_ibu: "",
      },
    ],
  });

  const [openForm, setOpenForm] = useState([true]);
  const [errors, setErrors] = useState({ nomor_kk: "", no_rumah: "", dusun: "", rt_rw: "", anggota: [{}] });

  const updateAnggota = (index, name, val) => {
    const value = typeof val === "object" && val !== null && "value" in val ? val.value : val;
    const updated = [...form.anggota];
    updated[index][name] = value;
    setForm({ ...form, anggota: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = { nomor_kk: "", no_rumah: "", dusun: "", rt_rw: "", anggota: [] };
    let hasError = false;

    // Validasi rumah
    newErrors.nomor_kk = validateNIK(form.nomor_kk);
    newErrors.no_rumah = validateAngka(form.no_rumah);
    newErrors.rt_rw = validateRTRW(form.rt_rw);
    newErrors.dusun = validateDusun(form.dusun);

    if (newErrors.nomor_kk) hasError = true;
    if (newErrors.no_rumah) hasError = true;
    if (newErrors.rt_rw) hasError = true;
    if (newErrors.dusun) hasError = true;

    // Validasi anggota
    form.anggota.forEach((anggota, i) => {
      const anggotaErrors = {};

      anggotaErrors.nik = validateNIK(anggota.nik);
      anggotaErrors.hubungan = validateStatusHubungan(anggota.hubungan);
      anggotaErrors.nama_lengkap = validateHuruf(anggota.nama_lengkap);
      anggotaErrors.tempat_lahir = validateHuruf(anggota.tempat_lahir);
      anggotaErrors.tgl_lahir = validateTanggal(anggota.tgl_lahir);
      anggotaErrors.jenis_kelamin = validateJenisKelamin(anggota.jenis_kelamin);
      anggotaErrors.status_perkawinan = validateStatusPerkawinan(anggota.status_perkawinan);
      anggotaErrors.agama = validateAgama(anggota.agama);
      anggotaErrors.pendidikan = validatePendidikan(anggota.pendidikan);
      anggotaErrors.pekerjaan = validateHuruf(anggota.pekerjaan);
      anggotaErrors.nama_ayah = validateHuruf(anggota.nama_ayah);
      anggotaErrors.nama_ibu = validateHuruf(anggota.nama_ibu);

      // BPJS tidak wajib diisi, hanya validasi jika ada isinya
      if (anggota.no_bpjs && anggota.no_bpjs.trim() !== "") {
        anggotaErrors.no_bpjs = validateBPJS(anggota.no_bpjs);
      }

      if (Object.values(anggotaErrors).some((msg) => msg)) {
        hasError = true;
      }

      newErrors.anggota[i] = anggotaErrors;
    });

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/population", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        if (res.status === 422 && data.errors) {
          const backendErrors = { nomor_kk: "", anggota: [] };

          if (data.errors.nomor_kk) {
            backendErrors.nomor_kk = data.errors.nomor_kk[0];
          }

          form.anggota.forEach((_, i) => {
            const anggotaErr = {};
            if (data.errors[`anggota.${i}.nik`]) {
              anggotaErr.nik = data.errors[`anggota.${i}.nik`][0];
            }
            backendErrors.anggota[i] = anggotaErr;
          });

          setErrors(backendErrors);
          return;
        }
        setErrorMessage(data.message || "Gagal menyimpan data.");
        return;
      }
      setShowSuccess(true);
    } catch (err) {
      setErrorMessage(err.message || "Terjadi kesalahan.");
    }
  };

  return (
    <>
      {showSuccess && (
        <SuccessPopup
          onClose={() => {
            setShowSuccess(false);
            router.push("/admin/data-penduduk");
          }}
        />
      )}

      {errorMessage && <ErrorPopup message={errorMessage} onClose={() => setErrorMessage("")} />}

      <form onSubmit={handleSubmit} className="min-h-full p-8 space-y-2">
        <h2 className="sm:text-2xl text-base font-semibold mb-4">Data Kependudukan / Tambah Data Penduduk</h2>

        {/* Informasi Rumah */}
        <div className="bg-white rounded-lg p-6 mx-auto">
          {" "}
          <button type="button" onClick={() => router.back()} className="flex items-center text-base text-gray-500 mb-6">
            <ChevronLeft size={30} className="mr-1" />
            Kembali
          </button>
          <h3 className="font-semibold mb-3">Informasi Rumah</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Angka value={form.no_rumah} onChange={(v) => setForm({ ...form, no_rumah: v.value })} error={errors.no_rumah} label="No. Rumah" />
            <Dusun value={form.dusun} onChange={(v) => setForm({ ...form, dusun: v.value })} error={errors.dusun} label="Dusun" />
            <RTRW value={form.rt_rw} onChange={(v) => setForm({ ...form, rt_rw: v.value })} error={errors.rt_rw} />
          </div>
        </div>

        {/* Informasi KK */}
        <div className="border bg-white p-4 rounded-md">
          <h3 className="font-semibold mb-3">Informasi Keluarga</h3>
          <NIK value={form.nomor_kk} onChange={(v) => setForm({ ...form, nomor_kk: v.value })} error={errors.nomor_kk} label="No. Kartu Keluarga" />
        </div>

        {/* Anggota */}
        <div className="border p-4 bg-white rounded-md">
          <h3 className="font-semibold mb-4">Anggota Keluarga</h3>

          {form.anggota.map((item, index) => (
            <div key={index} className="border p-4 rounded-md mb-6 bg-white">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    const copy = [...openForm];
                    copy[index] = !copy[index];
                    setOpenForm(copy);
                  }}
                  className="flex mb-1 items-center gap-2 text-left text-sm font-semibold text-gray-700"
                >
                  {openForm[index] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  <span>Anggota {index + 1}</span>
                </button>

                {form.anggota.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const updatedAnggota = [...form.anggota];
                      updatedAnggota.splice(index, 1);
                      const updatedOpen = [...openForm];
                      updatedOpen.splice(index, 1);
                      const updatedErrors = [...errors.anggota];
                      updatedErrors.splice(index, 1);
                      setForm({ ...form, anggota: updatedAnggota });
                      setOpenForm(updatedOpen);
                      setErrors({ ...errors, anggota: updatedErrors });
                    }}
                    className="text-red-600 hover:text-red-800"
                    title="Hapus Anggota"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {openForm[index] && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <NIK value={item.nik} onChange={(v) => updateAnggota(index, "nik", v)} error={errors.anggota[index]?.nik} />
                  <Huruf value={item.nama_lengkap} onChange={(v) => updateAnggota(index, "nama_lengkap", v)} error={errors.anggota[index]?.nama_lengkap} label="Nama Lengkap" />
                  <StatusHubungan value={item.hubungan} onChange={(v) => updateAnggota(index, "hubungan", v)} error={errors.anggota[index]?.hubungan} />
                  <Huruf value={item.tempat_lahir} onChange={(v) => updateAnggota(index, "tempat_lahir", v)} error={errors.anggota[index]?.tempat_lahir} label="Tempat Lahir" />
                  <Tanggal value={item.tgl_lahir} onChange={(v) => updateAnggota(index, "tgl_lahir", v)} error={errors.anggota[index]?.tgl_lahir} label="Tanggal Lahir" />
                  <JenisKelamin value={item.jenis_kelamin} onChange={(v) => updateAnggota(index, "jenis_kelamin", v)} error={errors.anggota[index]?.jenis_kelamin} label="Jenis Kelamin" />
                  <StatusPerkawinan value={item.status_perkawinan} onChange={(v) => updateAnggota(index, "status_perkawinan", v)} error={errors.anggota[index]?.status_perkawinan} label="Status Perkawinan" />
                  <Agama value={item.agama} onChange={(v) => updateAnggota(index, "agama", v)} error={errors.anggota[index]?.agama} label="Agama" />
                  <Pendidikan value={item.pendidikan} onChange={(v) => updateAnggota(index, "pendidikan", v)} error={errors.anggota[index]?.pendidikan} label="Pendidikan Terakhir" />
                  <Huruf value={item.pekerjaan} onChange={(v) => updateAnggota(index, "pekerjaan", v)} error={errors.anggota[index]?.pekerjaan} label="Pekerjaan" />
                  <Huruf value={item.nama_ayah} onChange={(v) => updateAnggota(index, "nama_ayah", v)} error={errors.anggota[index]?.nama_ayah} label="Nama Ayah" />
                  <Huruf value={item.nama_ibu} onChange={(v) => updateAnggota(index, "nama_ibu", v)} error={errors.anggota[index]?.nama_ibu} label="Nama Ibu" />
                  <BPJS value={item.no_bpjs} onChange={(v) => updateAnggota(index, "no_bpjs", v)} error={errors.anggota[index]?.no_bpjs} />
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => {
              setForm({
                ...form,
                anggota: [
                  ...form.anggota,
                  {
                    nik: "",
                    nama_lengkap: "",
                    hubungan: "",
                    tempat_lahir: "",
                    tgl_lahir: "",
                    jenis_kelamin: "",
                    status_perkawinan: "",
                    agama: "",
                    pendidikan: "",
                    pekerjaan: "",
                    no_bpjs: "",
                    nama_ayah: "",
                    nama_ibu: "",
                  },
                ],
              });
              setOpenForm([...openForm, true]);
              setErrors({ ...errors, anggota: [...errors.anggota, {}] });
            }}
            className="bg-[#27AE60] text-white px-4 py-2 text-sm rounded hover:bg-green-600"
          >
            + Tambah Anggota
          </button>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-[#27AE60] text-white px-6 py-2 rounded hover:bg-green-600 text-sm">
            Simpan
          </button>
        </div>
      </form>
    </>
  );
}

SuccessPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
};

ErrorPopup.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
