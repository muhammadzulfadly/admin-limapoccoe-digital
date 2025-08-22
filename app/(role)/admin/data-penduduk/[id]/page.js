"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
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
import Nama, { validateNama } from "@/components/forms/Nama";

function SuccessPopup({ title = "Berhasil", message, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg text-center shadow-md max-w-sm w-full">
        <h2 className="text-[#27AE60] text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <button onClick={onClose} className="bg-[#27AE60] text-white px-4 py-2 rounded hover:bg-green-600">
          Tutup
        </button>
      </div>
    </div>
  );
}

function ErrorPopup({ message, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg text-center shadow-md max-w-sm w-full">
        <h2 className="text-red-600 text-xl font-bold mb-2">Gagal</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <button onClick={onClose} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Tutup
        </button>
      </div>
    </div>
  );
}

function ConfirmDeletePopup({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg text-center shadow-md max-w-sm w-full">
        <h2 className="text-red-600 text-xl font-bold mb-2">Hapus Anggota</h2>
        <p className="text-gray-700 mb-6">Apakah Anda yakin ingin menghapus anggota keluarga ini? Tindakan ini tidak dapat dibatalkan.</p>
        <div className="flex flex-col items-center gap-y-3">
          <button onClick={onConfirm} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full">
            Ya, hapus sekarang
          </button>
          <button onClick={onCancel} className="text-gray-600 hover:underline">
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DetailKeluargaPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("mode") === "edit";

  const [form, setForm] = useState(null);
  const [openForm, setOpenForm] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmIndex, setConfirmIndex] = useState(null);
  const [errors, setErrors] = useState({ nomor_kk: "", no_rumah: "", dusun: "", rt_rw: "", anggota: [] });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/population/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Gagal memuat detail.");

        const data = json.data;

        setForm({
          nomor_kk: data.nomor_kk,
          no_rumah: data.rumah?.no_rumah || "",
          dusun: data.rumah?.dusun || "",
          rt_rw: data.rumah?.rt_rw || "",
          anggota: data.anggota.map((a) => ({
            id: a.id,
            nik: a.nik,
            nama_lengkap: a.nama_lengkap,
            hubungan: a.hubungan,
            tempat_lahir: a.tempat_lahir,
            tgl_lahir: a.tgl_lahir,
            jenis_kelamin: a.jenis_kelamin,
            status_perkawinan: a.status_perkawinan,
            agama: a.agama,
            pendidikan: a.pendidikan,
            pekerjaan: a.pekerjaan,
            no_bpjs: a.no_bpjs,
            nama_ayah: a.nama_ayah,
            nama_ibu: a.nama_ibu,
          })),
        });

        setOpenForm(Array(data.anggota.length).fill(true));
        setErrors({
          nomor_kk: "",
          no_rumah: "",
          dusun: "",
          rt_rw: "",
          anggota: Array(data.anggota.length).fill({}),
        });
      } catch (err) {
        setErrorMessage(err.message || "Terjadi kesalahan saat memuat data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const updateAnggota = (index, name, value) => {
    const updated = [...form.anggota];
    updated[index][name] = value?.value ?? value;
    setForm({ ...form, anggota: updated });
  };

  const addAnggota = () => {
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
  };

  const handleDeleteConfirmed = async () => {
    const index = confirmIndex;
    const anggota = form.anggota[index];
    try {
      if (anggota.id) {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/population/${anggota.id}/anggota`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Gagal menghapus anggota.");
        }
      }

      const newAnggota = [...form.anggota];
      newAnggota.splice(index, 1);
      const newOpenForm = [...openForm];
      newOpenForm.splice(index, 1);
      setForm({ ...form, anggota: newAnggota });
      setOpenForm(newOpenForm);
      setConfirmIndex(null);

      // 👇 tampilkan popup sukses
      setSuccessMsg("Data berhasil dihapus.");
      setShowSuccess(true);
    } catch (err) {
      setConfirmIndex(null);
      setErrorMessage(err.message || "Terjadi kesalahan saat menghapus anggota.");
    }
  };

  useEffect(() => {
    if (showSuccess && successMsg === "Data berhasil dihapus.") {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, successMsg]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = { nomor_kk: "", no_rumah: "", dusun: "", rt_rw: "", anggota: [] };
    let hasError = false;

    // Validasi rumah
    newErrors.nomor_kk = validateNIK(form.nomor_kk);
    newErrors.no_rumah = validateAngka(form.no_rumah);
    newErrors.rt_rw = validateRTRW(form.rt_rw);
    newErrors.dusun = validateDusun(form.dusun);

    if (newErrors.nomor_kk || newErrors.no_rumah || newErrors.rt_rw || newErrors.dusun) {
      hasError = true;
    }

    // Validasi anggota
    form.anggota.forEach((anggota, i) => {
      const anggotaErrors = {};

      anggotaErrors.nik = validateNIK(anggota.nik);
      anggotaErrors.hubungan = validateStatusHubungan(anggota.hubungan);
      anggotaErrors.nama_lengkap = validateNama(anggota.nama_lengkap);
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

      if (Object.values(anggotaErrors).some((msg) => msg)) hasError = true;
      newErrors.anggota[i] = anggotaErrors;
    });

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // Submit jika valid
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/population/${id}`, {
        method: "PUT",
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
      setSuccessMsg("Data warga telah berhasil diperbarui.");
      setShowSuccess(true);
    } catch (err) {
      setErrorMessage(err.message || "Terjadi kesalahan saat memperbarui data.");
    }
  };

  if (loading || !form) {
    return <div className="p-6 text-gray-600">Memuat data...</div>;
  }

  return (
    <>
      {showSuccess && (
        <SuccessPopup
          title="Perubahan Berhasil Disimpan"
          message={successMsg}
          onClose={() => {
            setShowSuccess(false);
            router.push("/admin/data-penduduk");
          }}
        />
      )}
      {errorMessage && <ErrorPopup message={errorMessage} onClose={() => setErrorMessage("")} />}
      {confirmIndex !== null && <ConfirmDeletePopup onConfirm={handleDeleteConfirmed} onCancel={() => setConfirmIndex(null)} />}
      <form onSubmit={handleSubmit} className="min-h-full p-8 space-y-2">
        <h2 className="sm:text-2xl text-base font-semibold mb-4">Data Kependudukan / {isEditMode ? "Edit Data Penduduk" : "Detail Data Penduduk"}</h2>

        {/* Informasi Rumah */}
        <div className="bg-white rounded-lg p-6 mx-auto">
          <button type="button" onClick={() => router.back()} className="flex items-center text-base text-gray-500 mb-6">
            <ChevronLeft size={30} className="mr-1" />
            Kembali
          </button>
          <h3 className="font-semibold mb-3">Informasi Rumah</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Angka value={form.no_rumah ?? ""} onChange={(v) => setForm({ ...form, no_rumah: v.value })} disabled={!isEditMode} label="No. Rumah" error={errors.no_rumah} />
            <Dusun value={form.dusun ?? ""} onChange={(v) => setForm({ ...form, dusun: v.value })} disabled={!isEditMode} label="Dusun" error={errors.dusun} />
            <RTRW value={form.rt_rw ?? ""} onChange={(v) => setForm({ ...form, rt_rw: v.value })} disabled={!isEditMode} error={errors.rt_rw} />
          </div>
        </div>

        {/* Informasi KK */}
        <div className="border bg-white p-4 rounded-md">
          <h3 className="font-semibold mb-3">Informasi Keluarga</h3>
          <NIK value={form.nomor_kk} onChange={(v) => setForm({ ...form, nomor_kk: v.value })} disabled={!isEditMode} label="No. Kartu Keluarga" error={errors.nomor_kk} />
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

                {isEditMode && form.anggota.length > 1 && (
                  <button type="button" onClick={() => setConfirmIndex(index)} className="text-red-600 hover:text-red-800" title="Hapus Anggota">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {openForm[index] && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <NIK value={item.nik ?? ""} onChange={(v) => updateAnggota(index, "nik", v)} disabled={!isEditMode} error={errors.anggota[index]?.nik} />
                  <Nama value={item.nama_lengkap ?? ""} onChange={(v) => updateAnggota(index, "nama_lengkap", v)} disabled={!isEditMode} label="Nama Lengkap" error={errors.anggota[index]?.nama_lengkap} />
                  <StatusHubungan value={item.hubungan ?? ""} onChange={(v) => updateAnggota(index, "hubungan", v)} disabled={!isEditMode} error={errors.anggota[index]?.hubungan} />
                  <Huruf value={item.tempat_lahir ?? ""} onChange={(v) => updateAnggota(index, "tempat_lahir", v)} disabled={!isEditMode} label="Tempat Lahir" error={errors.anggota[index]?.tempat_lahir} />
                  <Tanggal value={item.tgl_lahir} onChange={(v) => updateAnggota(index, "tgl_lahir", v)} disabled={!isEditMode} label="Tanggal Lahir" error={errors.anggota[index]?.tgl_lahir} />
                  <JenisKelamin value={item.jenis_kelamin ?? ""} onChange={(v) => updateAnggota(index, "jenis_kelamin", v)} disabled={!isEditMode} error={errors.anggota[index]?.jenis_kelamin} />
                  <StatusPerkawinan value={item.status_perkawinan ?? ""} onChange={(v) => updateAnggota(index, "status_perkawinan", v)} disabled={!isEditMode} error={errors.anggota[index]?.status_perkawinan} />
                  <Agama value={item.agama ?? ""} onChange={(v) => updateAnggota(index, "agama", v)} disabled={!isEditMode} error={errors.anggota[index]?.agama} />
                  <Pendidikan value={item.pendidikan ?? ""} onChange={(v) => updateAnggota(index, "pendidikan", v)} disabled={!isEditMode} error={errors.anggota[index]?.pendidikan} />
                  <Huruf value={item.pekerjaan ?? ""} onChange={(v) => updateAnggota(index, "pekerjaan", v)} disabled={!isEditMode} label="Pekerjaan" error={errors.anggota[index]?.pekerjaan} />
                  <Huruf value={item.nama_ayah ?? ""} onChange={(v) => updateAnggota(index, "nama_ayah", v)} disabled={!isEditMode} label="Nama Ayah" error={errors.anggota[index]?.nama_ayah} />
                  <Huruf value={item.nama_ibu ?? ""} onChange={(v) => updateAnggota(index, "nama_ibu", v)} disabled={!isEditMode} label="Nama Ibu" error={errors.anggota[index]?.nama_ibu} />
                  <BPJS value={item.no_bpjs ?? ""} onChange={(v) => updateAnggota(index, "no_bpjs", v)} disabled={!isEditMode} error={errors.anggota[index]?.no_bpjs} />
                </div>
              )}
            </div>
          ))}

          {isEditMode && (
            <button type="button" onClick={addAnggota} className="bg-[#27AE60] text-white px-4 py-2 text-sm rounded hover:bg-green-600">
              + Tambah Anggota
            </button>
          )}
        </div>

        {isEditMode && (
          <div className="flex justify-end">
            <button type="submit" className="bg-[#27AE60] text-white px-6 py-2 rounded hover:bg-green-600 text-sm">
              Simpan Perubahan
            </button>
          </div>
        )}
      </form>
    </>
  );
}

ConfirmDeletePopup.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

SuccessPopup.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

ErrorPopup.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
