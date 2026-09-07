import Link from "next/link";
import SkilloraLogo from "./SkilloraLogo";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-white/5 bg-[#080808]/90 backdrop-blur-xl px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2.5">
        <SkilloraLogo size={38} />
        <span className="text-xl font-bold tracking-tight">
          <span className="brand-skill">Skill</span>
          <span className="brand-ora">ora</span>
        </span>
      </Link>
      <div className="flex items-center gap-3">
        <Link href="/login" className="btn-ghost text-sm px-4 py-2">Sign In</Link>
        <Link href="/register" className="btn-red text-sm px-5 py-2.5">Get Started</Link>
      </div>
    </nav>
  );
}
