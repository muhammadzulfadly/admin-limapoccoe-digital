export async function GET(request) {
  const token = request.headers.get("authorization");

  try {
    const response = await fetch(`${process.env.API_SECRET_URL}/api/surat`, {
      headers: {
        Authorization: token,
        Accept: "application/json",
      },
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Gagal fetch data surat:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
