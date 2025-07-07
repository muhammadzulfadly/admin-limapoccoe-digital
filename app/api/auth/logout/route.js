export async function POST(req) {
  try {
    const token = req.headers.get("authorization");

    if (!token) {
      return new Response(JSON.stringify({ message: "Token tidak ditemukan." }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const res = await fetch(`${process.env.API_SECRET_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Authorization": token,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ message: "Terjadi kesalahan server." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
