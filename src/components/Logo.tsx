import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 ${className}`}>
      <div className="size-9 rounded-lg bg-primary grid place-items-center text-primary-foreground font-bold text-base shadow-[var(--shadow-teal)]">
        S
      </div>
      <span className="font-serif text-2xl tracking-tight text-foreground leading-none">
        sabi<span className="text-primary italic">.</span>
      </span>
    </Link>
  );
}
