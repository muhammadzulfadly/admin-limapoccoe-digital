import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const { slug, id } = params;
  const token = request.headers.get("authorization");

  try {
    // Ambil body dalam bentuk JSON
    const bodyJson = await request.json();

    // Debug log (opsional): pastikan alasan_penolakan ada
    console.log("📦 Data dikirim ke backend:", bodyJson);

    const response = await fetch(`${process.env.API_SECRET_URL}/api/surat/${slug}/pengajuan/${id}/rejected`, {
      method: "PUT",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(bodyJson), // langsung teruskan seluruh payload
    });

    const result = await response.json();

    return new NextResponse(JSON.stringify(result), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("❌ Gagal reject surat:", err);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
