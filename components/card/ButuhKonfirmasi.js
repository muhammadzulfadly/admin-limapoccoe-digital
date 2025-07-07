import { BadgeCheck } from "lucide-react";

export default function ButuhKonfirmasiCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full p-4 flex item-center justify-between">
      <div>
        <div className="text-xl font-semibold">0</div>
        <span className="text-sm text-gray-400">Butuh Konfirmasi</span>
      </div>
      <BadgeCheck size={50} className="text-cyan-800" />
    </div>
  );
}
