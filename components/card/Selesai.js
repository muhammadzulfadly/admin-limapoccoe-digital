import { UserCheck } from "lucide-react";

export default function SelesaiCard({ count }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full p-4 flex item-center justify-between">
      <div>
        <div className="text-xl font-semibold">{ count }</div>
        <span className="text-sm text-gray-400">Selesai</span>
      </div>
      <UserCheck size={50} className="text-green-500" />
    </div>
  );
}
