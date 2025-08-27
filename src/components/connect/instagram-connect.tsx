"use client";
import { BsInstagram } from "react-icons/bs";

export default function InstagramConnectButton() {
  return (
    <button
      className="flex items-center gap-2 px-5 py-2 rounded-full 
                 bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#515bd4] 
                 text-white font-semibold shadow-lg hover:opacity-90 active:scale-95 
                 transition-all duration-200 ease-in-out cursor-pointer"
    >
      <BsInstagram size={18} />
      Connect Instagram
    </button>
  );
}
