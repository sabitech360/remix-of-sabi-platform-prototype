import { createFileRoute } from "@tanstack/react-router";
import { Star, Filter, Upload } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/marketplace")({
  head: () => ({ meta: [{ title: "Marketplace — SABI Studio" }] }),
  component: Marketplace,
});

const subjects = ["All", "Mathematics", "English", "Biology", "Civic Ed", "Physics", "Chemistry"];

// Each item gets a teal-tinted gradient that hints at the subject's essence:
// Biology = leaf/photosynthesis greens-teals; Mathematics = grid teals/indigo;
// English = inked manuscript teal-amber; Physics = motion/sky teals;
// Civic Ed = solidarity teal-rose; Chemistry = beaker teal-violet.
const items = [
  { title: "Photosynthesis — The Solar Kitchen",         subject: "Biology",     grade: "JSS1",      price: "Le 75,000",  rating: 4.9, sales: 120, author: "Mrs. Sesay",   gradient: "radial-gradient(120% 80% at 80% 20%, oklch(0.85 0.18 130) 0%, transparent 55%), linear-gradient(135deg, oklch(0.5 0.13 190) 0%, oklch(0.45 0.15 160) 55%, oklch(0.38 0.14 140) 100%)" },
  { title: "Fraction Mastery Kit",                       subject: "Mathematics", grade: "Primary 5", price: "Le 105,000", rating: 4.8, sales: 210, author: "Mr. Bangura",  gradient: "linear-gradient(135deg, oklch(0.55 0.13 200) 0%, oklch(0.45 0.13 220) 50%, oklch(0.38 0.14 260) 100%), repeating-linear-gradient(45deg, transparent 0 18px, oklch(1 0 0 / 0.05) 18px 19px)" },
  { title: "Narrative Tenses Comprehension",             subject: "English",     grade: "JSS2",      price: "Le 36,000",  rating: 4.7, sales: 85,  author: "Ms. Conteh",   gradient: "radial-gradient(110% 80% at 20% 80%, oklch(0.78 0.16 70) 0%, transparent 55%), linear-gradient(135deg, oklch(0.55 0.12 195) 0%, oklch(0.42 0.11 210) 60%, oklch(0.3 0.08 230) 100%)" },
  { title: "Calculating Interest Rates",                 subject: "Mathematics", grade: "Primary 6", price: "Le 54,000",  rating: 5.0, sales: 310, author: "SABI Premium", gradient: "linear-gradient(135deg, oklch(0.58 0.13 190) 0%, oklch(0.48 0.14 215) 50%, oklch(0.4 0.16 270) 100%), repeating-linear-gradient(0deg, transparent 0 22px, oklch(1 0 0 / 0.04) 22px 23px)" },
  { title: "Civic Rights Poster Pack",                   subject: "Civic Ed",    grade: "SS3",       price: "Le 63,000",  rating: 4.6, sales: 64,  author: "Mr. Koroma",   gradient: "radial-gradient(120% 90% at 80% 30%, oklch(0.72 0.2 25) 0%, transparent 55%), linear-gradient(135deg, oklch(0.52 0.12 195) 0%, oklch(0.4 0.13 230) 60%, oklch(0.35 0.16 340) 100%)" },
  { title: "Newton's Laws — Freetown Traffic Edition",   subject: "Physics",     grade: "SS1",       price: "Free",       rating: 4.9, sales: 540, author: "Dr. Kamara",   gradient: "radial-gradient(120% 80% at 70% 25%, oklch(0.85 0.14 95) 0%, transparent 55%), linear-gradient(135deg, oklch(0.55 0.13 200) 0%, oklch(0.42 0.13 220) 55%, oklch(0.3 0.1 240) 100%)" },
];

function Marketplace() {
  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-8 lg:py-10 max-w-6xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Resource Marketplace</h1>
            <p className="text-muted-foreground mt-2">High-quality materials from top-rated African educators.</p>
          </div>
          <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors">
            <Upload className="size-4" /> Upload resource
          </button>
        </div>

        {/* Filters */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
          <button className="shrink-0 inline-flex items-center gap-1.5 bg-card border border-border rounded-full px-3 py-1.5 text-sm hover:bg-muted">
            <Filter className="size-3.5" /> Filter
          </button>
          {subjects.map((s, i) => (
            <button
              key={s}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                i === 0 ? "bg-foreground text-background" : "bg-card border border-border hover:bg-muted"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <article key={item.title} className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-[0_8px_24px_-12px_oklch(0.5_0.2_295/0.25)] transition-all cursor-pointer">
              <div
                className="aspect-[4/3] grid place-items-center relative overflow-hidden"
                style={{ background: item.gradient }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_100%,oklch(0_0_0/0.25)_0%,transparent_60%)]" />
                <span className="relative font-display font-bold text-3xl tracking-tight text-white drop-shadow-[0_2px_8px_oklch(0_0_0/0.4)]">
                  {item.subject.slice(0, 3).toUpperCase()}
                </span>
                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-white/85 backdrop-blur text-foreground">
                  {item.subject}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold leading-snug group-hover:text-primary transition-colors">{item.title}</h3>
                  <span className={`shrink-0 font-bold text-sm ${item.price === "Free" ? "text-primary" : ""}`}>{item.price}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{item.grade} · By {item.author}</p>
                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-foreground">{item.rating}</span>
                  <span>· {item.sales} sales</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
