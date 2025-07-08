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
          Accept: "application/pdf",
        },
      }
    );

    if (!backendResponse.ok) {
      return new Response("Gagal mengambil preview surat", {
        status: backendResponse.status,
      });
    }

    const pdfBuffer = await backendResponse.arrayBuffer();

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=preview-surat.pdf",
      },
    });
  } catch (error) {
    console.error("⚠️ Gagal fetch preview surat:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
