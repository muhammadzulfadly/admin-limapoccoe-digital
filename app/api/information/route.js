export async function GET(request) {
  const token = request.headers.get("authorization");

  try {
    const apiUrl = `${process.env.API_SECRET_URL}/api/informasi/admin`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: token || "",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return new Response(JSON.stringify({ error: "Gagal mengambil data dari server.", detail: errorBody }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
// POST: tambah informasi (mendukung JSON & FormData)
export async function POST(request) {
  const token = request.headers.get("authorization") || "";
  const contentType = request.headers.get("content-type") || "";

  try {
    // Jika JSON (tanpa file)
    if (contentType.includes("application/json")) {
      const body = await request.json(); // { judul, kategori?, konten? }
      const { judul, kategori, konten } = body || {};

      if (!judul || !String(judul).trim()) {
        return new Response(JSON.stringify({ error: "Judul wajib diisi." }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const payload = { judul, kategori, konten };

      const response = await fetch(`${process.env.API_SECRET_URL}/api/informasi/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        return new Response(
          JSON.stringify({ error: result.message || result.error || "Gagal menambahkan informasi." }),
          { status: response.status, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify(result), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Jika FormData (multipart, dengan/atau tanpa file)
    // Catatan: JANGAN set Content-Type manual, biarkan fetch yang set boundary.
    const form = await request.formData();

    const judul = form.get("judul");
    const kategori = form.get("kategori");
    const konten = form.get("konten");
    const gambar = form.get("gambar"); // File (opsional)

    if (!judul || !String(judul).trim()) {
      return new Response(JSON.stringify({ error: "Judul wajib diisi." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Rebuild FormData untuk diteruskan ke backend (agar header & boundary rapi)
    const uploadForm = new FormData();
    uploadForm.append("judul", judul);
    if (kategori) uploadForm.append("kategori", kategori);
    if (konten) uploadForm.append("konten", konten);
    if (gambar && typeof gambar === "object") {
      uploadForm.append("gambar", gambar);
    }

    const response = await fetch(`${process.env.API_SECRET_URL}/api/informasi/admin`, {
      method: "POST",
      headers: {
        Authorization: token,
        Accept: "application/json",
        // penting: jangan set "Content-Type" di sini
      },
      body: uploadForm,
    });

    // Backend Laravel akan balas JSON
    const result = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: result.message || result.error || "Gagal menambahkan informasi." }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(result), {
      status: response.status, // biasanya 201
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error POST /api/information:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}