import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { slug, id } = params;
  const token = request.headers.get("authorization");

  if (!token) {
    return new Response("Token tidak tersedia", { status: 401 });
  }

  try {
    const response = await fetch(`${process.env.API_SECRET_URL}/api/surat/${slug}/pengajuan/${id}/download`, {
      method: "GET",
      headers: {
        Authorization: token,
        Accept: "application/octet-stream", // or application/pdf, application/msword, etc.
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return new Response(errorBody, { status: response.status });
    }

    const contentDisposition = response.headers.get("Content-Disposition") || `attachment; filename="surat-${id}.pdf"`;

    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/octet-stream",
        "Content-Disposition": contentDisposition,
      },
    });
  } catch (err) {
    console.error("Error saat mengunduh surat:", err);
    return new Response("Terjadi kesalahan server", { status: 500 });
  }
}
