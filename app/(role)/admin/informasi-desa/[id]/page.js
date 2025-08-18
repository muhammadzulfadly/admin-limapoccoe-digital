"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";

export default function DetailInformasiPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isEditMode = searchParams.get("mode") === "edit";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // state form edit
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("");
  const [konten, setKonten] = useState("");
  const [gambarBaru, setGambarBaru] = useState(null); // file baru (opsional)
  const [preview, setPreview] = useState(null); // preview client
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`/api/information/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();

        if (!res.ok) {
          setError(result.error || "Gagal mengambil detail informasi.");
        } else {
          setData(result.data);
          // isi form saat edit
          setJudul(result.data?.judul || "");
          setKategori(result.data?.kategori || "");
          setKonten(result.data?.konten || "");
        }
      } catch (err) {
        setError("Terjadi kesalahan saat memuat detail.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  function imgUrlFromBackendPath(path) {
    // path dari backend: "informasi/xxx.png"
    // akses langsung via proxy Next: /api/information/photo/<filename>
    if (!path) return null;
    const filename = path.split("/").pop();
    return `/api/information/photo/${filename}`;
  }

  function handlePickFile(e) {
    const file = e.target.files?.[0];
    setGambarBaru(file || null);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem("token");

    try {
      let res;

      if (gambarBaru) {
        // === Kirim sebagai FormData (dengan foto) ===
        const fd = new FormData();
        if (judul) fd.append("judul", judul);
        if (kategori) fd.append("kategori", kategori);
        if (konten) fd.append("konten", konten);
        fd.append("gambar", gambarBaru);

        res = await fetch(`/api/information/${id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            // penting: JANGAN set Content-Type saat kirim FormData
          },
          body: fd,
        });
      } else {
        // === Kirim sebagai JSON (tanpa foto) ===
        const payload = { judul, kategori, konten };
        res = await fetch(`/api/information/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      const result = await res.json();
      if (!res.ok) {
        alert(result.error || "Gagal menyimpan perubahan.");
        return;
      }

      alert("Berhasil update informasi!");
      // update data di UI
      setData(result.data || result.informasi || null);
      setGambarBaru(null);
      setPreview(null);
      // kembali ke mode detail:
      const url = new URL(window.location.href);
      url.searchParams.delete("mode");
      router.replace(url.toString());
    } catch (err) {
      alert("Terjadi kesalahan saat menyimpan.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="p-6 italic text-gray-500">Memuat detail...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500 italic">{error}</p>;
  }

  if (!data) {
    return <p className="p-6 italic text-gray-500">Detail tidak ditemukan.</p>;
  }

  // ========== MODE DETAIL ==========
  if (!isEditMode) {
    return (
      <div className="p-8 max-w-3xl mx-auto bg-white rounded shadow">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold mb-4">{data.judul}</h1>
          <a href={`?mode=edit`} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
            Edit
          </a>
        </div>

        <p className="text-sm text-gray-500 mb-2">
          <span className="italic">Kategori:</span> {data.kategori || "-"}
        </p>
        <p className="text-sm text-gray-500 mb-6">
          <span className="italic">Dibuat pada:</span> {new Date(data.created_at).toLocaleString("id-ID")}
        </p>

        {data?.gambar ? <img src={imgUrlFromBackendPath(data.gambar)} alt={data.judul} className="mt-2 max-w-full rounded border" /> : <div className="mt-1 p-2 border rounded bg-gray-100 text-sm text-gray-500 italic">Tidak ada foto</div>}

        <div className="prose max-w-none mt-4">
          <p>{data.konten}</p>
        </div>
      </div>
    );
  }

  // ========== MODE EDIT ==========
  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Edit Informasi</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Judul</label>
          <input type="text" value={judul} onChange={(e) => setJudul(e.target.value)} className="w-full border rounded p-2" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Kategori</label>
          <input type="text" value={kategori} onChange={(e) => setKategori(e.target.value)} className="w-full border rounded p-2" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Konten</label>
          <textarea rows="5" value={konten} onChange={(e) => setKonten(e.target.value)} className="w-full border rounded p-2" required></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gambar</label>
          {/* Preview lama */}
          {data?.gambar && !preview && <img src={imgUrlFromBackendPath(data.gambar)} alt={data.judul} className="mb-2 max-w-full rounded border" />}

          {/* Preview baru jika user pilih file */}
          {preview && <img src={preview} alt="Preview" className="mb-2 max-w-full rounded border" />}

          <input type="file" accept="image/*" onChange={handlePickFile} className="w-full border rounded p-2" />
          <p className="text-xs text-gray-500 italic mt-1">Kosongkan jika tidak ingin mengganti foto.</p>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>

          <button
            type="button"
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.delete("mode");
              router.replace(url.toString());
            }}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
