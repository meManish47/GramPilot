import Link from "next/link";
import { ModeToggle } from "../mode-toggle";

export default function HeaderComponent() {
  return (
    <header className="h-18 w-full flex items-center px-10 justify-between">
      <Link
        href="/"
        className="inline-block transition-transform duration-200 hover:scale-[1.02]"
      >
        <p
          className="inline-block font-serif font-bold text-6xl md:text-4xl tracking-tight 
          text-slate-900 dark:text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.25)]"
        >
          GP
        </p>
      </Link>

      <Link href="/login" className=" underline text-xl">
        Login
      </Link>

      <ModeToggle />
    </header>
  );
}
