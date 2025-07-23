import { CheckCheck } from "lucide-react";

export default function DiterimaCard({ count }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full p-4 flex items-center justify-between">
      <div>
        <div className="text-lg md:text-xl font-semibold">{count}</div>
        <span className="text-xs md:text-sm text-[#ADABC5]">Diterima</span>
      </div>
      <CheckCheck
        size={32} // untuk mobile
        className="text-[#016E84] md:w-[50px] md:h-[50px]"
      />
    </div>
  );
}
