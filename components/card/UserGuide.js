import { FileText } from "lucide-react";

export default function UserGuideCard() {
  return (
    <a
      href="https://drive.google.com/drive/folders/1tWxHdZ3Z3rOWQH8k5e8lyDj8uJh9Nmtr?usp=sharing"
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full p-4 flex items-center justify-between">
        <div>
          <div className="text-sm md:text-sm font-semibold text-[#00171F]">User Guide</div>
          <div className="text-xs md:text-sm text-[#00171F]">Lihat panduan</div>
        </div>
        <FileText
          size={32} // Mobile size
          className="text-[#00171F] md:w-[50px] md:h-[50px]"
        />
      </div>
    </a>
  );
}
