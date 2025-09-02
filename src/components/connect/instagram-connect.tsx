"use client";
import { gqlClient } from "@/services/graphql";
import { gql } from "graphql-request";
import { BsInstagram } from "react-icons/bs";
import { User } from "../../../generated/prisma";
import { toast } from "sonner";
const CURRENT_USER = gql`
  query CurrentUser {
    currentUser {
      id
      name
      email
      role
    }
  }
`;
export default function InstagramConnectButton() {
  const handleClick = async () => {
    const data: { currentUser: User | null } = await gqlClient.request(
      CURRENT_USER
    );
    if (!data.currentUser) {
      toast.error("User not authenticated");
      return;
    }
    window.location.href = `/api/instagram/auth?userId=${data.currentUser.id}`;
  };

  return (
    <button
      onClick={handleClick}
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
