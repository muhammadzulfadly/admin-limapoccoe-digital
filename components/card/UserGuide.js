import { FileText } from "lucide-react";
import Link from "next/link";

export default function UserGuideCard() {
  return (
    <Link href="#" className="bg-white rounded-xl border border-gray-200 shadow-sm w-full p-4 flex item-center justify-between">
      <div>
        <div className="text-xl font-semibold">User Guide</div>
        <div className="text-sm text-gray-400">
          Lihat panduan
        </div>
      </div>
      <FileText size={50} className="text-gray-800" />
    </Link>
  );
}
