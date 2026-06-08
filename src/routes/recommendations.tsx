import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, BadgeCheck, Heart, MapPin, Quote, Users, Sparkles, Search } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/recommendations")({
  head: () => ({ meta: [{ title: "Community Recommendations — SABI Earn" }] }),
  component: Recommendations,
});

type Teacher = {
  id: string;
  name: string;
  initials: string;
  subjects: string[];
  location: string;
  rating: number;
  reviews: number;
  endorsements: number;
  verified: boolean;
  badge?: "Top rated" | "Rising teacher" | "Community favourite";
  blurb: string;
};

const teachers: Teacher[] = [
  {
    id: "t1",
    name: "Mariama Kallon",
    initials: "MK",
    subjects: ["Mathematics", "Further Maths"],
    location: "Wilkinson Road · 1.2 km",
    rating: 4.9,
    reviews: 47,
    endorsements: 32,
    verified: true,
    badge: "Top rated",
    blurb: "Tutored my two children for 2 years — calm, patient, gets results.",
  },
  {
    id: "t2",
    name: "Ibrahim Sesay",
    initials: "IS",
    subjects: ["Physics", "Basic Science"],
    location: "Hill Station · 3.4 km",
    rating: 4.8,
    reviews: 31,
    endorsements: 24,
    verified: true,
    badge: "Community favourite",
    blurb: "Runs the best afterschool Science club in our neighbourhood.",
  },
  {
    id: "t3",
    name: "Fatmata Conteh",
    initials: "FC",
    subjects: ["English", "Krio coaching"],
    location: "Aberdeen · 5.1 km",
    rating: 4.95,
    reviews: 22,
    endorsements: 19,
    verified: true,
    badge: "Rising teacher",
    blurb: "Brought my daughter from D to A in essay writing in 3 months.",
  },
  {
    id: "t4",
    name: "Joseph Bangura",
    initials: "JB",
    subjects: ["Chemistry", "WASSCE prep"],
    location: "Murray Town · 2.8 km",
    rating: 4.7,
    reviews: 18,
    endorsements: 14,
    verified: true,
    blurb: "Real exam expert — knows exactly what comes up year after year.",
  },
];

const reviews = [
  {
    parent: "Aminata B.",
    teacher: "Mariama Kallon",
    text: "Mariama turned my daughter's fear of maths into curiosity. She doesn't just teach — she rebuilds confidence. We recommend her to every parent on our street.",
    stars: 5,
  },
  {
    parent: "Dr. Sesay",
    teacher: "Fatmata Conteh",
    text: "Our twin boys went from struggling readers to top of the class. Fatmata makes English feel like a game, not a chore.",
    stars: 5,
  },
];

function Recommendations() {
  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-8 lg:py-10 max-w-6xl mx-auto">
        {/* Header */}
        <p className="text-xs font-bold uppercase tracking-wider text-primary">SABI Earn · Community</p>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mt-1">
          Teachers <em className="font-serif italic font-normal">parents trust</em>
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Discover educators recommended by other parents in your area. Endorsements, reviews and ratings — all from real families on SABI.
        </p>

        {/* Search */}
        <div className="mt-6 relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search a subject, neighbourhood or teacher name…"
            className="w-full pl-11 pr-4 py-3 rounded-full bg-muted text-sm focus:bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none border border-transparent focus:border-border"
          />
        </div>

        {/* Stats strip */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Stat icon={<Users className="size-4" />} label="Recommending parents" value="1,840" />
          <Stat icon={<Heart className="size-4 fill-primary text-primary" />} label="Endorsements made" value="6,210" />
          <Stat icon={<Star className="size-4 fill-amber-400 text-amber-400" />} label="Avg. teacher rating" value="4.8" />
          <Stat icon={<BadgeCheck className="size-4 text-primary" />} label="Verified teachers" value="412" />
        </div>

        {/* Refer + offer */}
        <div className="mt-8 grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-2xl p-6 text-primary-foreground" style={{ background: "var(--gradient-teal)", boxShadow: "var(--shadow-teal)" }}>
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">For parents</p>
            <h2 className="text-2xl font-bold tracking-tight mt-1">Refer a teacher you trust</h2>
            <p className="opacity-90 mt-2 text-sm max-w-md">
              Help another parent find a great educator. Your recommendation boosts the teacher's visibility across SABI.
            </p>
            <Link to="/recommendations/refer" className="mt-4 inline-flex px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 transition-colors text-sm font-semibold">
              Recommend a teacher
            </Link>

          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">For teachers</p>
            <h2 className="text-lg font-bold tracking-tight mt-1">Offer a private service</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Publish tutoring, holiday camps or language coaching to nearby parents.
            </p>
            <Link to="/profile" className="mt-4 inline-flex px-5 py-2.5 rounded-full border border-border text-sm font-semibold hover:bg-muted">
              Set up service
            </Link>
          </div>
        </div>

        {/* Top recommended teachers */}
        <h2 className="mt-10 text-xl font-bold tracking-tight">Top recommended near you</h2>
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          {teachers.map((t) => (
            <article key={t.id} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-colors">
              <div className="flex items-start gap-4">
                <div className="size-14 rounded-2xl bg-gradient-to-br from-[oklch(0.7_0.15_30)] to-[oklch(0.45_0.2_25)] text-white grid place-items-center font-bold text-lg shrink-0">
                  {t.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold tracking-tight">{t.name}</h3>
                    {t.verified && <BadgeCheck className="size-4 text-primary" />}
                  </div>
                  {t.badge && (
                    <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold uppercase tracking-wider bg-primary-soft text-primary px-2 py-0.5 rounded-full">
                      <Sparkles className="size-3" /> {t.badge}
                    </span>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {t.subjects.map((s) => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded-full border border-border font-medium">{s}</span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground inline-flex items-center gap-1">
                    <MapPin className="size-3.5" /> {t.location}
                  </p>
                  <p className="mt-3 text-sm text-foreground/80 italic">"{t.blurb}"</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Star className="size-3.5 fill-amber-400 text-amber-400" /> {t.rating} · {t.reviews} reviews</span>
                    <span className="inline-flex items-center gap-1"><Heart className="size-3.5 fill-primary text-primary" /> {t.endorsements} endorsements</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold">View profile</button>
                <Link to="/recommendations/refer" className="px-4 py-2 rounded-full border border-border text-sm font-semibold hover:bg-muted inline-flex items-center gap-1">
                  <Heart className="size-3.5" /> Endorse
                </Link>
              </div>

            </article>
          ))}
        </div>

        {/* Parent reviews */}
        <h2 className="mt-10 text-xl font-bold tracking-tight">Recent parent reviews</h2>
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          {reviews.map((r, i) => (
            <article key={i} className="rounded-2xl border border-border bg-card p-5">
              <Quote className="size-5 text-primary/60" />
              <p className="mt-2 text-sm text-foreground/85 leading-relaxed">{r.text}</p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold">{r.parent}</p>
                  <p className="text-muted-foreground">on {r.teacher}</p>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: r.stars }).map((_, k) => (
                    <Star key={k} className="size-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <p className="text-[10px] uppercase tracking-wider font-semibold">{label}</p>
      </div>
      <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
    </div>
  );
}
