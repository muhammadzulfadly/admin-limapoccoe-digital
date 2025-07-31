// app/page.js
import { redirect } from "next/navigation";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Admin Limapoccoe Digital</title>
        <link rel="icon" type="image/png" href="https://limapoccoedigital.id/logo.png" />
      </Head>
      {/* Redirect ke halaman /auth */}
      {redirect("/auth")}
    </>
  );
}
