export async function POST(req) {
  try {
    const body = await req.json();

    const res = await fetch(`${process.env.API_SECRET_URL}/api/auth/login/admin`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ message: "Terjadi kesalahan pada server." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
