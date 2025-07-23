export async function GET(request, { params }) {
  const token = request.headers.get("authorization");
  const { id } = params;

  try {
    const apiUrl = `${process.env.API_SECRET_URL}/api/data-kependudukan/${id}`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: token || "",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("❌ Error response:", errorBody);
      return new Response(
        JSON.stringify({
          error: "Gagal mengambil detail dari server.",
          detail: errorBody,
        }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("💥 Fetch error:", error.message);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


export async function PUT(request, { params }) {
  const token = request.headers.get("authorization");
  const { id } = params;

  try {
    const body = await request.json();

    const apiUrl = `${process.env.API_SECRET_URL}/api/data-kependudukan/${id}`;

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: token || "",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

   if (!response.ok) {
  const errorBody = await response.json();
  console.error("❌ Error response:", errorBody);

  return new Response(
    JSON.stringify(errorBody),
    { status: response.status, headers: { "Content-Type": "application/json" } }
  );
}


    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("💥 PUT error:", error.message);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


export async function DELETE(request, { params }) {
  const token = request.headers.get("authorization");
  const { id } = params;

  try {
    const apiUrl = `${process.env.API_SECRET_URL}/api/data-kependudukan/${id}`;

    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        Authorization: token || "",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return new Response(
        JSON.stringify({ error: "Gagal menghapus data.", detail: errorBody }),
        { status: response.status }
      );
    }

    return new Response(
      JSON.stringify({ message: "Data berhasil dihapus." }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
