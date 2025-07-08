export async function GET(req, { params }) {
  try {
    const token = req.headers.get("authorization");
    const { id } = params;

    const res = await fetch(`${process.env.API_SECRET_URL}/api/pengaduan/${id}`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });

    const contentType = res.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const text = await res.text();
      console.error("Unexpected response (not JSON):", text);
      return new Response(JSON.stringify({ message: "Server error: Bukan JSON." }), {
        status: 500,
      });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Detail error:", error);
    return new Response(JSON.stringify({ message: "Gagal fetch data pengaduan." }), {
      status: 500,
    });
  }
}
