import { Link, useRouterState } from "@tanstack/react-router";
import { ReactNode } from "react";
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


export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar p-5 sticky top-0 h-screen">
        <Logo className="mb-10" />
        <nav className="flex flex-col gap-6">
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

          {/* Profile */}
          <div className="mt-auto">
            <Link
              to={profileItem.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                path.startsWith(profileItem.to) ? "bg-primary text-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <profileItem.icon className="size-4" />
              {profileItem.label}
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
            <button className="relative size-10 rounded-full grid place-items-center hover:bg-muted transition-colors">
              <Bell className="size-4" />
              <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-primary ring-2 ring-background" />
            </button>
            <div className="size-9 rounded-full bg-gradient-to-br from-[oklch(0.7_0.15_30)] to-[oklch(0.5_0.2_25)] grid place-items-center text-white font-semibold text-sm">
              FK
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