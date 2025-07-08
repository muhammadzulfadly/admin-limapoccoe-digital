export async function PUT(req, { params }) {
  try {
    const token = req.headers.get("authorization");
    const { id } = params;
    const body = await req.json();

    const res = await fetch(`${process.env.API_SECRET_URL}/api/pengaduan/${id}/approved`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(body),
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    const responseBody = isJson ? await res.json() : { message: await res.text() };

    return new Response(JSON.stringify(responseBody), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("PUT error:", error);
    return new Response(JSON.stringify({ message: "Gagal update pengaduan." }), {
      status: 500,
    });
  }
}
