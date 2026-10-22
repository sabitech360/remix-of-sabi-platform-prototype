import { Link, useRouterState } from "@tanstack/react-router";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import {
  MessageSquareHeart,
  Sparkles,
  Briefcase,
  User,
  Bell,
  Search,
  Heart,
  FileCheck2,
  Rocket,
  LogOut,
} from "lucide-react";
import { Logo } from "./Logo";

type NavItem = { to: string; label: string; icon: typeof MessageSquareHeart };

const sabiTeach: NavItem[] = [
  { to: "/assistant", label: "My Assistant", icon: MessageSquareHeart },
  { to: "/tools", label: "My Tool Suite", icon: Sparkles },
];

const sabiEarn: NavItem[] = [
  { to: "/jobs", label: "Opportunities", icon: Briefcase },
  { to: "/applications", label: "Applications", icon: FileCheck2 },
  { to: "/recommendations", label: "Recommendations", icon: Heart },
];

const profileItem: NavItem = { to: "/profile", label: "Profile", icon: User };

const allNavItems = [...sabiTeach, ...sabiEarn, profileItem];

function Avatar({ name, imageUrl, className = "size-9 text-sm" }: { name: string; imageUrl?: string; className?: string }) {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  return (
    <div
      className={`${className} rounded-full bg-gradient-to-br from-[oklch(0.7_0.15_30)] to-[oklch(0.5_0.2_25)] grid place-items-center text-white font-semibold overflow-hidden shrink-0`}
    >
      {imageUrl ? <img src={imageUrl} alt={name} className="size-full object-cover" /> : initials}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useUser();
  const { signOut } = useClerk();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const name = user?.fullName || user?.firstName || "SABI Teacher";
  const email = user?.primaryEmailAddress?.emailAddress || "";

  // Close the account menu when clicking outside it
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  const handleSignOut = () => {
    setMenuOpen(false);
    signOut({ redirectUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar p-5 sticky top-0 h-screen">
        <Logo className="mb-10" />
        <nav className="flex flex-col gap-6 flex-1">
          {/* Sabi Teach */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-3 mb-1">Sabi Teach</p>
            <div className="flex flex-col gap-1">
              {sabiTeach.map((item) => {
                const active = item.to === "/tools" ? path === "/tools" || path.startsWith("/tools/") : path.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active ? "bg-primary text-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sabi Earn */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-3 mb-1">Sabi Earn</p>
            <div className="flex flex-col gap-1">
              {sabiEarn.map((item) => {
                const active = path.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active ? "bg-primary text-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Signed-in user */}
          <div className="mt-auto">
            <Link
              to={profileItem.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                path.startsWith(profileItem.to) ? "bg-primary text-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Avatar name={name} imageUrl={user?.imageUrl} className="size-9 text-sm" />
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{name}</p>
                {email && <p className="text-[11px] opacity-70 truncate">{email}</p>}
              </div>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 backdrop-blur-md px-4 lg:px-8 h-16">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="hidden lg:flex relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tools, lessons, or resources..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-muted text-sm border border-transparent focus:bg-background focus:border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Link to="/onboarding" className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-semibold hover:bg-muted">
              <Rocket className="size-3.5 text-primary" /> Get started
            </Link>
            <button className="size-10 rounded-full grid place-items-center hover:bg-muted transition-colors" aria-label="Notifications">
              <Bell className="size-4" />
            </button>

            {/* Account menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30"
                aria-label="Account menu"
                aria-expanded={menuOpen}
              >
                <Avatar name={name} imageUrl={user?.imageUrl} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-card shadow-lg p-2 z-50">
                  <div className="px-3 py-2.5 border-b border-border mb-1">
                    <p className="text-sm font-semibold truncate">{name}</p>
                    {email && <p className="text-xs text-muted-foreground truncate">{email}</p>}
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted"
                  >
                    <User className="size-4" /> Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="size-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur-md">
        <div className="flex items-center justify-around px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {allNavItems.map((item) => {
            const active = item.to === "/tools" ? path === "/tools" || path.startsWith("/tools/") : path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="size-5" />
                <span className="text-[10px] font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}