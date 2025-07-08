export async function PUT(request, { params }) {
  const token = request.headers.get("authorization");
  const { slug, id } = params;

  try {
    const body = await request.json();

    const response = await fetch(
      `${process.env.API_SECRET_URL}/api/surat/${slug}/pengajuan/${id}/number`,
      {
        method: "PUT",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Gagal update nomor surat:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
