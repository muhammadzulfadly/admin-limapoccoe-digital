import SedangProsesCard from "@/components/card/SedangProses";
import ButuhKonfirmasiCard from "@/components/card/ButuhKonfirmasi";
import DitolakCard from "@/components/card/DiTolak";
import SelesaiCard from "@/components/card/Selesai";


export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <div className="flex h-full">
      <div className="flex-1 p-8 space-y-8 bg-[#EDF0F5]">
        <section>
          <h2 className="font-semibold text-2xl mb-4">Pengajuan Surat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <SedangProsesCard />
            <ButuhKonfirmasiCard />
            <DitolakCard />
            <SelesaiCard />
          </div>
        </section>
      </div>
    </div>
  );
}
