export async function GET(req) {
  try {
    const token = req.headers.get('authorization');

    const res = await fetch(`${process.env.API_SECRET_URL}/api/pengaduan`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Gagal fetch data pengaduan.' }), {
      status: 500,
    });
  }
}
