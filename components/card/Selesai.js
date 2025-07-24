import { UserCheck } from "lucide-react";
import PropTypes from "prop-types";

export default function SelesaiCard({ count }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full p-4 flex items-center justify-between">
      <div>
        <div className="text-lg md:text-xl font-semibold">{count}</div>
        <span className="text-xs md:text-sm text-[#ADABC5]">Selesai</span>
      </div>
      <UserCheck
        size={32} // Mobile size
        className="text-[#34C759] md:w-[50px] md:h-[50px]"
      />
    </div>
  );
}

SelesaiCard.propTypes = {
  count: PropTypes.number.isRequired,
};
