export async function GET(request, { params }) {
  const { slug, id } = params;
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return new Response("Unauthorized: token missing", { status: 401 });
  }

  try {
    const backendResponse = await fetch(
      `${process.env.API_SECRET_URL}/preview-surat/${slug}/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "text/html",
        },
      }
    );

    if (!backendResponse.ok) {
      return new Response("Gagal mengambil preview surat", {
        status: backendResponse.status,
      });
    }

    const html = await backendResponse.text();

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.error("⚠️ Gagal fetch preview surat:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
