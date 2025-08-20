export async function GET(request, { params }) {
  const token = request.headers.get("authorization");
  const { id } = params;

  try {
    const apiUrl = `${process.env.API_SECRET_URL}/api/informasi/admin/${id}`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: token || "",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("❌ Error response:", errorBody);
      return new Response(
        JSON.stringify({
          error: "Gagal mengambil detail dari server.",
          detail: errorBody,
        }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("💥 Fetch error:", error.message);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}


export async function POST(request, { params }) {
  const { id } = params;
  const token = request.headers.get("authorization") || "";
  const contentType = request.headers.get("content-type") || "";

  try {
    let response;

    if (contentType.includes("application/json")) {
      // ====== TANPA FOTO (JSON) ======
      const body = await request.json(); // { judul?, kategori?, konten? }

      response = await fetch(`${process.env.API_SECRET_URL}/api/informasi/admin/${id}`, {
        method: "POST", // selalu POST
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      });
    } else {
      // ====== DENGAN FOTO (FormData) ======
      const form = await request.formData();
      const fd = new FormData();

      const judul = form.get("judul");
      const kategori = form.get("kategori");
      const konten = form.get("konten");
      const gambar = form.get("gambar"); // File

      if (judul) fd.append("judul", judul);
      if (kategori) fd.append("kategori", kategori);
      if (konten) fd.append("konten", konten);
      if (gambar && typeof gambar === "object") fd.append("gambar", gambar);

      response = await fetch(`${process.env.API_SECRET_URL}/api/informasi/admin/${id}`, {
        method: "POST", // selalu POST
        headers: {
          Authorization: token,
          Accept: "application/json",
          // jangan set Content-Type manual untuk multipart
        },
        body: fd,
      });
    }

    const result = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: result.message || result.error || "Gagal memperbarui informasi.",
          details: result.details || undefined,
        }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(result), {
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


export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    const token = request.headers.get("authorization") || "";

    const response = await fetch(`${process.env.API_SECRET_URL}/api/informasi/admin/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: token,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return new Response(JSON.stringify({ error: "Gagal menghapus data.", detail: errorBody }), { status: response.status, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ message: "Data berhasil dihapus." }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
