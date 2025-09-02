import InstagramConnectButton from "@/components/connect/instagram-connect";
import ModalButton from "@/components/login/modal-button";
import { ModeToggle } from "@/components/mode-toggle";
import UploadImage from "@/components/upload-image";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="h-screen w-screen flex justify-center items-center ">
      
      <div className="h-100 w-100 bg-purple-500 rounded-3xl flex gap-8 flex-col px-10 py-20">
        <UploadImage />
        <ModalButton />
        <InstagramConnectButton />
      </div>
    </main>
  );
}
