import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { filename } = params;

  try {
    const imageUrl = `${process.env.API_SECRET_URL}/storage/aduan/evidence/${filename}`;
    const res = await fetch(imageUrl);

    if (!res.ok) {
      return new NextResponse("Gambar tidak ditemukan", { status: 404 });
    }

    const contentType = res.headers.get("content-type");
    const imageBuffer = await res.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Gagal proxy gambar:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
