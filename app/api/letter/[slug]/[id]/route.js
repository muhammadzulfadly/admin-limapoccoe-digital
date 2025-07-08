import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { slug, id } = params;
  const token = request.headers.get("authorization");

  try {
    const response = await fetch(`${process.env.API_SECRET_URL}/api/surat/${slug}/pengajuan/${id}`, {
      headers: {
        Authorization: token,
        Accept: "application/json",
      },
    });

    const data = await response.json();

    return new NextResponse(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Gagal fetch detail pengajuan:", error);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
