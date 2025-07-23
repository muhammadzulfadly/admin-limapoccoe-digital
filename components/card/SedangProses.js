import { Cog } from "lucide-react";

export default function SedangProsesCard({ count }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full p-4 flex items-center justify-between">
      <div>
        <div className="text-lg md:text-xl font-semibold">{count}</div>
        <span className="text-xs md:text-sm text-[#ADABC5]">Sedang Proses</span>
      </div>
      <Cog
        size={32} // icon size for mobile
        className="text-[#666666] md:w-[50px] md:h-[50px]"
      />
    </div>
  );
}
