import Link from "next/link";
import SkilloraLogo from "./SkilloraLogo";

interface LogoProps {
  size?: number;
  variant?: "icon" | "full";
  className?: string;
}

export default function Logo({ size = 36, variant = "full", className = "" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 select-none ${className}`}>
      <SkilloraLogo size={size} />
      {variant === "full" && (
        <span className="text-xl tracking-tight">
          <span className="brand-skill">Skill</span>
          <span className="brand-ora">ora</span>
        </span>
      )}
    </Link>
  );
}
