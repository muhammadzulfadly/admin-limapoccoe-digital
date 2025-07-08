import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const { slug, id } = params;
  const token = request.headers.get("authorization");

  if (!token) {
    return NextResponse.json({ error: "Token tidak tersedia" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const response = await fetch(`${process.env.API_SECRET_URL}/api/surat/${slug}/pengajuan/${id}/signed`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(result, { status: response.status });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Error tanda tangan surat:", err);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
