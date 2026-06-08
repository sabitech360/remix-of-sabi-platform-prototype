import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, MapPin, GraduationCap, Star, Award, Heart, Plus, Quote } from "lucide-react";
import { AppShell } from "@/components/AppShell";


export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — SABI Studio" }] }),
  component: Profile,
});

function Profile() {
  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        {/* Cover */}
        <div className="h-40 lg:h-56 bg-gradient-to-br from-[oklch(0.35_0.22_290)] via-primary to-[oklch(0.5_0.28_310)] relative overflow-hidden">
          <div className="absolute -bottom-20 -right-10 size-72 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="px-4 lg:px-8 -mt-20 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end gap-6">
            <div className="size-32 rounded-3xl bg-gradient-to-br from-[oklch(0.7_0.15_30)] to-[oklch(0.45_0.2_25)] grid place-items-center text-white text-4xl font-bold ring-4 ring-background shadow-lg shrink-0 relative z-10">
              FK
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Foday David Kamara</h1>
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground px-2 py-1 rounded-full">
                  <BadgeCheck className="size-3" /> Verified
                </span>
              </div>
              <p className="text-muted-foreground mt-1">Senior Physics Educator · 12 years experience</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" />Freetown, Sierra Leone</span>
                <span className="inline-flex items-center gap-1"><GraduationCap className="size-3.5" />B.Ed. Physics, Fourah Bay College</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm">Edit profile</button>
              <button className="px-5 py-2.5 rounded-full border border-border font-semibold text-sm hover:bg-muted">Share</button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Stat label="Resources sold" value="1,240" />
            <Stat label="Avg. rating" value="4.9" icon={<Star className="size-4 fill-amber-400 text-amber-400" />} />
            <Stat label="Jobs won" value="14" />
            <Stat label="Earnings" value="Le 35M" highlight />
          </div>

          {/* About + subjects */}
          <div className="mt-10 grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
              <h2 className="font-bold text-lg tracking-tight">About</h2>
              <p className="mt-3 text-sm text-foreground/80 leading-relaxed">
                I'm a senior physics educator passionate about making STEM concepts feel real for Sierra Leonean students. I specialise in mixed-ability classrooms and design materials that work whether you have a smartboard or chalk and a window.
              </p>

              <h3 className="mt-6 font-semibold text-sm uppercase tracking-wider text-muted-foreground">Subjects</h3>
              <div className="flex flex-wrap gap-2 mt-3">
                {["Physics", "Mathematics", "Further Maths", "Basic Science"].map((s) => (
                  <span key={s} className="text-sm px-3 py-1 rounded-full bg-primary-soft text-primary font-medium">{s}</span>
                ))}
              </div>

              <h3 className="mt-6 font-semibold text-sm uppercase tracking-wider text-muted-foreground">Grade levels</h3>
              <div className="flex flex-wrap gap-2 mt-3">
                {["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"].map((g) => (
                  <span key={g} className="text-sm px-3 py-1 rounded-full border border-border font-medium">{g}</span>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-bold text-lg tracking-tight">Achievements</h2>
              <ul className="mt-4 space-y-3">
                {[
                  "Top 1% seller this quarter",
                  "Verified by 3 partner schools",
                  "500+ student work pieces graded",
                ].map((a) => (
                  <li key={a} className="flex items-start gap-3 text-sm">
                    <Award className="size-4 text-primary shrink-0 mt-0.5" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Private teaching services */}
          <div className="mt-10">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">SABI Earn</p>
                <h2 className="text-xl font-bold tracking-tight mt-1">Private teaching services</h2>
                <p className="text-sm text-muted-foreground mt-1">Services you offer directly to parents and students nearby.</p>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                <Plus className="size-4" /> Add a service
              </button>
            </div>
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "WASSCE Physics 1-on-1", price: "Le 350k / session", type: "In-home · Freetown", active: true },
                { title: "Saturday Maths group (SS1–SS3)", price: "Le 180k / learner", type: "Group · Hill Station", active: true },
                { title: "Easter holiday Science camp", price: "Le 1.2M / learner", type: "2 weeks · April", active: false },
              ].map((s) => (
                <div key={s.title} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${s.active ? "bg-primary-soft text-primary" : "bg-muted text-muted-foreground"}`}>
                      {s.active ? "Live" : "Draft"}
                    </span>
                    <button className="text-xs font-semibold text-muted-foreground hover:text-foreground">Edit</button>
                  </div>
                  <h3 className="font-bold mt-2 tracking-tight">{s.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{s.type}</p>
                  <p className="mt-3 text-sm font-semibold text-primary">{s.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Endorsements & reviews */}
          <div className="mt-10 grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg tracking-tight">Parent reviews</h2>
                <Link to="/recommendations" className="text-xs font-semibold text-primary">See all</Link>
              </div>
              <div className="mt-4 space-y-4">
                {[
                  { parent: "Mrs. Aminata Bangura", stars: 5, text: "Patient, prepared and reliable. My daughter's confidence in maths has completely changed." },
                  { parent: "Dr. & Mrs. Sesay", stars: 5, text: "Best Physics tutor we've found in Freetown. Our boys actually look forward to lessons." },
                ].map((r, i) => (
                  <div key={i} className="border-t border-border first:border-0 pt-4 first:pt-0">
                    <Quote className="size-4 text-primary/60" />
                    <p className="mt-2 text-sm text-foreground/85 leading-relaxed">{r.text}</p>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <p className="font-semibold">{r.parent}</p>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: r.stars }).map((_, k) => (
                          <Star key={k} className="size-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-bold text-lg tracking-tight">Community endorsements</h2>
              <div className="mt-4 flex items-center gap-2">
                <Heart className="size-5 fill-primary text-primary" />
                <p className="text-3xl font-bold tracking-tight">32</p>
                <p className="text-xs text-muted-foreground">parents endorse Foday</p>
              </div>
              <div className="mt-4 flex -space-x-2">
                {["AB", "JS", "MK", "FC", "IS", "+27"].map((i, k) => (
                  <div
                    key={k}
                    className={`size-9 rounded-full ring-2 ring-background grid place-items-center text-[11px] font-bold ${
                      k === 5 ? "bg-muted text-foreground" : "bg-primary-soft text-primary"
                    }`}
                  >
                    {i}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Endorsements increase your visibility in SABI Earn matches and parent searches.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}


function Stat({ label, value, icon, highlight }: { label: string; value: string; icon?: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${highlight ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}>
      <p className={`text-xs uppercase tracking-wider font-semibold ${highlight ? "opacity-80" : "text-muted-foreground"}`}>{label}</p>
      <div className="mt-1 flex items-center gap-1.5">
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        {icon}
      </div>
    </div>
  );
}
