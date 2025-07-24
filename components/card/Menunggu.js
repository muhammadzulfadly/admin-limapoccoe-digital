import { Clock } from "lucide-react";
import PropTypes from "prop-types";

export default function MenungguCard({ count }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full p-4 flex items-center justify-between">
      <div>
        <div className="text-lg md:text-xl font-semibold">{count}</div>
        <span className="text-xs md:text-sm text-[#ADABC5]">Menunggu</span>
      </div>
      <Clock
        size={32} // ukuran icon mobile
        className="text-[#FF9500] md:w-[50px] md:h-[50px]"
      />
    </div>
  );
}

MenungguCard.propTypes = {
  count: PropTypes.number.isRequired,
};
