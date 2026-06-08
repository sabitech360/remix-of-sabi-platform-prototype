import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  Clock,
  BadgeCheck,
  School,
  GraduationCap,
  Sun,
  Globe2,
  Sparkles,
  Languages,
  Search,
  SlidersHorizontal,
  Heart,
  Star,
  Bookmark,
  BookmarkCheck,
  Navigation,
  X,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/jobs")({
  head: () => ({ meta: [{ title: "Opportunities — SABI Earn" }] }),
  component: Jobs,
});

type Category =
  | "all"
  | "school"
  | "private"
  | "afterschool"
  | "online"
  | "holiday"
  | "language";

const categories: { id: Category; label: string; icon: typeof School; blurb: string }[] = [
  { id: "all", label: "All opportunities", icon: Sparkles, blurb: "Every role matched to you" },
  { id: "school", label: "School Vacancies", icon: School, blurb: "Full & part-time roles in schools" },
  { id: "private", label: "Private Tutoring", icon: GraduationCap, blurb: "1-on-1 lessons posted by parents" },
  { id: "afterschool", label: "Afterschool Support", icon: Sun, blurb: "Homework & study help, 3–6pm" },
  { id: "online", label: "Online Teaching", icon: Globe2, blurb: "Remote lessons, flexible hours" },
  { id: "holiday", label: "Holiday Classes", icon: Sparkles, blurb: "Vacation programmes & camps" },
  { id: "language", label: "Language Coaching", icon: Languages, blurb: "Krio, Mende, Temne, French…" },
];

type Opportunity = {
  id: string;
  category: Exclude<Category, "all">;
  match: number;
  title: string;
  poster: string;
  posterType: "School" | "Parent" | "Community";
  verified: boolean;
  recommendedBy?: number;
  location: string;
  distanceKm: number;
  type: string;
  pay: string;
  posted: string;
  hook: string;
};

export const opportunities: Opportunity[] = [
  { id: "p1", category: "private", match: 96, title: "WASSCE Maths tutor for my daughter (SS3)", poster: "Mrs. Aminata Bangura", posterType: "Parent", verified: true, recommendedBy: 8, location: "Wilkinson Road, Freetown", distanceKm: 2.4, type: "2× weekly · in-home", pay: "Le 350k / session", posted: "1 day ago", hook: "Looking for a patient teacher who can rebuild confidence before May exams." },
  { id: "a1", category: "afterschool", match: 91, title: "Afterschool homework club lead (JSS)", poster: "Murray Town Parents Co-op", posterType: "Community", verified: true, recommendedBy: 14, location: "Murray Town, Freetown", distanceKm: 4.1, type: "Mon–Thu · 3:30–6:00pm", pay: "Le 2.8M / month", posted: "3 days ago", hook: "Group of 12 children needs structured homework + reading support." },
  { id: "s1", category: "school", match: 98, title: "Senior Mathematics Lead", poster: "Prince of Wales School", posterType: "School", verified: true, location: "Kingtom, Freetown", distanceKm: 6.8, type: "Full-time", pay: "Le 7.5M – Le 10.5M / month", posted: "2 days ago", hook: "Lead the maths department and mentor 4 junior teachers." },
  { id: "o1", category: "online", match: 88, title: "Online Physics tutor (SS2, weekends)", poster: "Mr. Joseph Conteh", posterType: "Parent", verified: false, recommendedBy: 3, location: "Remote · Sierra Leone", distanceKm: 0, type: "Sat & Sun · 90 min", pay: "Le 280k / session", posted: "4 days ago", hook: "My son needs help with mechanics and electricity topics over Zoom." },
  { id: "h1", category: "holiday", match: 84, title: "Easter holiday Science camp instructor", poster: "Hill Station Learning Hub", posterType: "Community", verified: true, recommendedBy: 22, location: "Hill Station, Freetown", distanceKm: 5.4, type: "2 weeks · April", pay: "Le 4.5M (programme)", posted: "5 days ago", hook: "Run hands-on experiments for 25 primary-school kids." },
  { id: "l1", category: "language", match: 82, title: "Krio coaching for visiting family", poster: "The Williams Household", posterType: "Parent", verified: true, recommendedBy: 5, location: "Aberdeen, Freetown", distanceKm: 7.9, type: "3× weekly · 4 weeks", pay: "Le 220k / session", posted: "1 week ago", hook: "Two children visiting from the UK — need conversational Krio fast." },
  { id: "s2", category: "school", match: 92, title: "Physics Teacher (Senior Secondary)", poster: "St. Edward's Secondary", posterType: "School", verified: true, location: "Kingtom, Freetown", distanceKm: 6.5, type: "Full-time", pay: "Le 5.4M – Le 7.2M / month", posted: "5 days ago", hook: "Replace retiring teacher; SS1–SS3 across 4 streams." },
  { id: "p2", category: "private", match: 89, title: "English & Comprehension tutor (JSS2 twins)", poster: "Dr. & Mrs. Sesay", posterType: "Parent", verified: true, recommendedBy: 11, location: "Hill Station", distanceKm: 3.1, type: "3× weekly · in-home", pay: "Le 300k / session", posted: "6 days ago", hook: "Twin boys, lively learners — need structured reading + essay work." },
];

type SavedSearch = { id: string; label: string; category: Category; query: string; radiusKm: number };

const SAVED_KEY = "sabi.savedSearches";

function loadSaved(): SavedSearch[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"); } catch { return []; }
}

function Jobs() {
  const [active, setActive] = useState<Category>("all");
  const [query, setQuery] = useState("");
  const [radiusKm, setRadiusKm] = useState(15);
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [saved, setSaved] = useState<SavedSearch[]>([]);

  useEffect(() => { setSaved(loadSaved()); }, []);

  const filtered = useMemo(() => {
    let list = opportunities.filter((o) => active === "all" || o.category === active);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((o) => (o.title + o.location + o.hook + o.poster).toLowerCase().includes(q));
    }
    if (nearbyOnly) {
      list = list.filter((o) => o.distanceKm > 0 && o.distanceKm <= radiusKm);
      list = [...list].sort((a, b) => a.distanceKm - b.distanceKm);
    }
    return list;
  }, [active, query, radiusKm, nearbyOnly]);

  const activeMeta = categories.find((c) => c.id === active)!;

  function saveCurrentSearch() {
    const label = `${activeMeta.label}${query ? ` · "${query}"` : ""}${nearbyOnly ? ` · ≤${radiusKm}km` : ""}`;
    const item: SavedSearch = { id: crypto.randomUUID(), label, category: active, query, radiusKm: nearbyOnly ? radiusKm : 0 };
    const next = [item, ...saved].slice(0, 8);
    setSaved(next);
    localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  }
  function applySaved(s: SavedSearch) {
    setActive(s.category); setQuery(s.query); setNearbyOnly(s.radiusKm > 0); if (s.radiusKm) setRadiusKm(s.radiusKm);
  }
  function removeSaved(id: string) {
    const next = saved.filter((s) => s.id !== id);
    setSaved(next); localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  }

  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-8 lg:py-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">SABI Earn · Opportunities</p>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mt-1">
              Find your next teaching <em className="font-serif italic font-normal">opportunity</em>
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Schools, parents and community groups across Sierra Leone are looking for trusted teachers. Matched to your subjects, location and ratings.
            </p>
          </div>
          <div className="flex gap-2 self-start">
            <Link to="/applications" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border text-sm font-semibold hover:bg-muted transition-colors">
              <BadgeCheck className="size-4 text-primary" /> My applications
            </Link>
            <Link to="/profile" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border text-sm font-semibold hover:bg-muted transition-colors">
              <Sparkles className="size-4 text-primary" /> Offer a service
            </Link>
          </div>
        </div>

        {/* Search row */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search by subject, level, neighbourhood…"
              className="w-full pl-11 pr-4 py-3 rounded-full bg-muted text-sm focus:bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none border border-transparent focus:border-border"
            />
          </div>
          <button onClick={saveCurrentSearch} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-border font-semibold text-sm hover:bg-muted">
            <Bookmark className="size-4" /> Save search
          </button>
        </div>

        {/* Location filter */}
        <div className="mt-4 rounded-2xl border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <label className="inline-flex items-center gap-2 text-sm font-semibold cursor-pointer">
            <input type="checkbox" checked={nearbyOnly} onChange={(e) => setNearbyOnly(e.target.checked)} className="accent-primary size-4" />
            <Navigation className="size-4 text-primary" /> Show nearby only
          </label>
          <div className="flex-1 flex items-center gap-3">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Within</span>
            <input
              type="range" min={1} max={25} value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              disabled={!nearbyOnly}
              className="flex-1 accent-primary disabled:opacity-40"
            />
            <span className="text-sm font-semibold tabular-nums w-14 text-right">{radiusKm} km</span>
          </div>
          <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
            <MapPin className="size-3.5" /> Freetown
          </span>
        </div>

        {/* Saved searches */}
        {saved.length > 0 && (
          <div className="mt-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Saved searches</p>
            <div className="flex flex-wrap gap-2">
              {saved.map((s) => (
                <span key={s.id} className="inline-flex items-center gap-1 bg-primary-soft text-primary text-xs font-semibold rounded-full pl-3 pr-1.5 py-1.5">
                  <button onClick={() => applySaved(s)} className="inline-flex items-center gap-1">
                    <BookmarkCheck className="size-3.5" /> {s.label}
                  </button>
                  <button onClick={() => removeSaved(s.id)} className="size-5 rounded-full hover:bg-primary/15 grid place-items-center">
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Category pills */}
        <div className="mt-6 -mx-4 lg:mx-0 overflow-x-auto">
          <div className="flex gap-2 px-4 lg:px-0 pb-1">
            {categories.map((c) => {
              const isActive = active === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActive(c.id)}
                  className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors border ${
                    isActive ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border hover:border-primary/40"
                  }`}
                >
                  <c.icon className="size-4" />
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground inline-flex items-center gap-2">
          <SlidersHorizontal className="size-3.5" />
          {activeMeta.blurb} · {filtered.length} opportunities{nearbyOnly ? ` within ${radiusKm}km` : ""}
        </p>

        {/* Cards */}
        <div className="mt-5 space-y-4">
          {filtered.map((job) => (
            <article key={job.id} className="bg-card border border-border rounded-2xl p-5 lg:p-6 hover:border-primary/40 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="size-14 rounded-2xl bg-primary-soft text-primary grid place-items-center font-bold text-xl shrink-0">
                  {job.poster[0]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-lg tracking-tight">{job.title}</h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                      <BadgeCheck className="size-3" /> {job.match}% match
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-sm">
                    <span className="font-medium">{job.poster}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      {job.posterType}
                      {job.verified && <BadgeCheck className="size-3.5 text-primary" />}
                    </span>
                    {job.recommendedBy && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary-soft px-2 py-0.5 rounded-full">
                        <Heart className="size-3 fill-primary" />
                        Recommended by {job.recommendedBy} parents
                      </span>
                    )}
                  </div>
                  <p className="text-sm mt-2 text-foreground/80">{job.hook}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5" />
                      {job.location}{job.distanceKm > 0 ? ` · ${job.distanceKm} km away` : ""}
                    </span>
                    <span className="inline-flex items-center gap-1"><Clock className="size-3.5" />{job.type}</span>
                    <span>{job.posted}</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-primary">{job.pay}</p>
                </div>

                <div className="flex gap-2 lg:flex-col lg:items-end shrink-0">
                  <Link
                    to="/jobs/$id/apply"
                    params={{ id: job.id }}
                    className="flex-1 lg:flex-none text-center px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
                  >
                    {job.posterType === "School" ? "Apply" : "Express interest"}
                  </Link>
                  <button className="flex-1 lg:flex-none px-5 py-2.5 rounded-full border border-border font-semibold text-sm hover:bg-muted transition-colors">
                    Save
                  </button>
                </div>
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No opportunities match these filters. Try widening your radius or clearing the search.
            </div>
          )}
        </div>

        {/* Trust footer */}
        <div className="mt-10 rounded-2xl border border-border bg-card p-6 flex flex-col sm:flex-row items-start gap-4">
          <div className="size-12 rounded-2xl bg-primary-soft text-primary grid place-items-center shrink-0">
            <Star className="size-5 fill-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold tracking-tight">A trusted local education network</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Every parent, school and teacher on SABI is verified by ID and community recommendations. Strong teachers gain visibility through both algorithmic matching and parent endorsements.
            </p>
          </div>
          <Link to="/recommendations" className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm whitespace-nowrap">
            See recommendations
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
