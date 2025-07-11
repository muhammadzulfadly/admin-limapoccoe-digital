
export async function DELETE(request, { params }) {
  const token = request.headers.get("authorization");
  const { id } = params; // ini adalah ID anggota keluarga

  try {
    const apiUrl = `${process.env.API_SECRET_URL}/api/data-kependudukan/anggota-keluarga/${id}`;

    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        Authorization: token || "",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("❌ Error delete response:", errorBody);
      return new Response(
        JSON.stringify({
          error: "Gagal menghapus data anggota.",
          detail: errorBody,
        }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Anggota berhasil dihapus." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("💥 DELETE error:", error.message);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
