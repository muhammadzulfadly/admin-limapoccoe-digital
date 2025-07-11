export async function POST(request) {
  const token = request.headers.get("authorization");

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof Blob)) {
      return new Response(JSON.stringify({ error: "File tidak valid" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const uploadForm = new FormData();
    uploadForm.append("file", file);

    const response = await fetch(`${process.env.API_SECRET_URL}/api/data-kependudukan/import`, {
      method: "POST",
      headers: {
        Authorization: token || "",
        Accept: "application/json",
      },
      body: uploadForm,
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Gagal import file:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
