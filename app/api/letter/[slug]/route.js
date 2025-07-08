import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { slug } = params;
  const token = request.headers.get("authorization");

  try {
    const response = await fetch(`${process.env.API_SECRET_URL}/api/surat/${slug}/pengajuan`, {
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
    console.error("Gagal GET pengajuan:", error);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function POST(request, { params }) {
  const { slug } = params;
  const token = request.headers.get("authorization");

  try {
    const formData = await request.formData();

    const response = await fetch(`${process.env.API_SECRET_URL}/api/surat/${slug}/pengajuan`, {
      method: "POST",
      headers: {
        Authorization: token,
        // Jangan set Content-Type secara manual saat pakai FormData
        Accept: "application/json",
      },
      body: formData,
    });

    const data = await response.json();

    return new NextResponse(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Gagal POST pengajuan:", error);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
