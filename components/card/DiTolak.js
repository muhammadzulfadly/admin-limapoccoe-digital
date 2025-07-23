import { Ban } from "lucide-react";

export default function DitolakCard({ count }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full p-4 flex items-center justify-between">
      <div>
        <div className="text-lg md:text-xl font-semibold">{count}</div>
        <span className="text-xs md:text-sm text-[#ADABC5]">Ditolak</span>
      </div>
      <Ban
        size={32} // default untuk mobile
        className="text-[#FF3B30] md:w-[50px] md:h-[50px]"
      />
    </div>
  );
}
