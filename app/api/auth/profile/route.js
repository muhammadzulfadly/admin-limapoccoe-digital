export async function GET(req) {
  try {
    const token = req.headers.get("Authorization");

    const res = await fetch(`${process.env.API_SECRET_URL}/api/profile/masyarakat`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token,
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
