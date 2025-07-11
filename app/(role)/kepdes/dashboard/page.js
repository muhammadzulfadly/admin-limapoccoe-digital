import ButuhKonfirmasiCard from "@/components/card/ButuhKonfirmasi";
import SelesaiCard from "@/components/card/Selesai";
import DiterimaCard from "@/components/card/DiTerima";
import UserGuideCard from "@/components/card/UserGuide";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <div className="flex h-full">
      <div className="flex-1 p-8 space-y-8 bg-[#EDF0F5]">
        <section>
          <h2 className="font-semibold text-2xl mb-4">Pengajuan Surat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <ButuhKonfirmasiCard />
            <SelesaiCard />
          </div>
        </section>

        <hr className="border-gray-300 border-y" />

        <section>
          <h2 className="font-semibold text-2xl mb-4">Pengaduan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <DiterimaCard />
            <SelesaiCard />
          </div>
        </section>

        <hr className="border-gray-300 border-y" />

        <section>
          <h2 className="font-semibold text-2xl mb-4">Panduan Pengguna</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <UserGuideCard />
          </div>
        </section>
      </div>
    </div>
  );
}
