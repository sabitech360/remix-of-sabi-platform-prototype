import { createFileRoute, Link, Outlet, useMatchRoute } from "@tanstack/react-router";
import {
  Stethoscope,
  Layers,
  BookOpen,
  Presentation,
  Lightbulb,
  Hammer,
  PencilRuler,
  ClipboardCheck,
  GraduationCap,
  MessageSquareHeart,
  Compass,
  Wand2,
  ArrowUpRight,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "Your Co-Teacher — SABI Studio" },
      { name: "description", content: "12 AI tools that help you plan, teach, assess and grow as a teacher." },
    ],
  }),
  component: ToolsPage,
});

type Tool = {
  slug: string;
  name: string;
  desc: string;
  icon: LucideIcon;
  /** CSS background for the gradient image header (AMAL-style) */
  gradient: string;
};

type Group = {
  label: string;
  caption: string;
  tools: Tool[];
};

// AMAL-style: rich blurred gradient bands as the card's image header
const groups: Group[] = [
  {
    label: "Plan",
    caption: "Understand your learners and map out what to teach.",
    tools: [
      { slug: "sabi-diagnose",    name: "Sabi Diagnose",    desc: "Spot learning gaps and teach at the right level.",     icon: Stethoscope, gradient: "radial-gradient(120% 90% at 85% 50%, oklch(0.18 0.04 220) 0%, transparent 55%), linear-gradient(115deg, oklch(0.92 0.04 200) 0%, oklch(0.7 0.14 200) 35%, oklch(0.45 0.11 215) 70%, oklch(0.18 0.04 220) 100%)" },
      { slug: "sabi-unit-series", name: "Sabi Unit Series", desc: "Build coherent, curriculum-aligned unit plans.",        icon: Layers,      gradient: "radial-gradient(110% 80% at 80% 40%, oklch(0.85 0.12 75) 0%, transparent 55%), linear-gradient(120deg, oklch(0.6 0.18 145) 0%, oklch(0.78 0.14 110) 45%, oklch(0.7 0.18 70) 80%, oklch(0.55 0.18 50) 100%)" },
      { slug: "sabi-lesson-plan", name: "Sabi Lesson Plan", desc: "Draft a classroom-ready lesson in under a minute.",     icon: BookOpen,    gradient: "radial-gradient(120% 80% at 80% 50%, oklch(0.1 0.02 30) 0%, transparent 55%), linear-gradient(110deg, oklch(0.85 0.08 70) 0%, oklch(0.7 0.2 50) 30%, oklch(0.5 0.2 35) 60%, oklch(0.18 0.04 30) 100%)" },
    ],
  },
  {
    label: "Teach",
    caption: "Bring your lessons to life in the classroom.",
    tools: [
      { slug: "sabi-slides",  name: "Sabi Slides",  desc: "Clear, engaging slide decks in minutes.",             icon: Presentation, gradient: "radial-gradient(120% 90% at 85% 50%, oklch(0.16 0.05 200) 0%, transparent 55%), linear-gradient(115deg, oklch(0.95 0.02 200) 0%, oklch(0.78 0.12 195) 40%, oklch(0.55 0.14 200) 75%, oklch(0.2 0.05 210) 100%)" },
      { slug: "sabi-explain", name: "Sabi Explain", desc: "Explain tough concepts with simple, local examples.", icon: Lightbulb,    gradient: "linear-gradient(120deg, oklch(0.85 0.08 280) 0%, oklch(0.78 0.1 250) 35%, oklch(0.82 0.06 320) 65%, oklch(0.88 0.05 30) 100%)" },
      { slug: "sabi-project", name: "Sabi Project", desc: "Hands-on projects that build real-world skills.",     icon: Hammer,       gradient: "radial-gradient(100% 80% at 30% 70%, oklch(0.75 0.18 145) 0%, transparent 55%), linear-gradient(115deg, oklch(0.88 0.05 220) 0%, oklch(0.82 0.08 140) 40%, oklch(0.78 0.18 110) 70%, oklch(0.65 0.18 90) 100%)" },
    ],
  },
  {
    label: "Practice & Assess",
    caption: "Give students practice, measure progress, and grade fairly.",
    tools: [
      { slug: "sabi-exercise", name: "Sabi Exercise", desc: "Worksheets and practice sheets, ready to print.",     icon: PencilRuler,        gradient: "radial-gradient(110% 80% at 80% 50%, oklch(0.2 0.04 240) 0%, transparent 55%), linear-gradient(120deg, oklch(0.88 0.06 220) 0%, oklch(0.7 0.14 220) 45%, oklch(0.45 0.13 230) 80%, oklch(0.2 0.04 240) 100%)" },
      { slug: "sabi-check",    name: "Sabi Check",    desc: "Quick formative assessments that surface gaps.",      icon: ClipboardCheck,     gradient: "radial-gradient(120% 80% at 80% 50%, oklch(0.12 0.02 30) 0%, transparent 55%), linear-gradient(110deg, oklch(0.85 0.06 30) 0%, oklch(0.72 0.2 25) 35%, oklch(0.55 0.2 15) 65%, oklch(0.18 0.04 25) 100%)" },
      { slug: "sabi-grade",    name: "Sabi Grade",    desc: "Fair, consistent rubrics and grading systems.",       icon: GraduationCap,      gradient: "radial-gradient(120% 80% at 75% 45%, oklch(0.1 0.02 30) 0%, transparent 55%), linear-gradient(115deg, oklch(0.92 0.03 80) 0%, oklch(0.75 0.18 60) 30%, oklch(0.55 0.2 40) 60%, oklch(0.15 0.03 30) 100%)" },
      { slug: "sabi-feedback", name: "Sabi Feedback", desc: "Personalised, growth-oriented student feedback.",     icon: MessageSquareHeart, gradient: "radial-gradient(120% 90% at 85% 50%, oklch(0.16 0.03 220) 0%, transparent 55%), linear-gradient(115deg, oklch(0.94 0.03 200) 0%, oklch(0.72 0.14 200) 40%, oklch(0.48 0.13 215) 75%, oklch(0.2 0.04 225) 100%)" },
    ],
  },
  {
    label: "Grow",
    caption: "Reflect on your practice and shape new ideas.",
    tools: [
      { slug: "sabi-reflect", name: "Sabi Reflect", desc: "Structured reflection to grow professionally.", icon: Compass, gradient: "linear-gradient(115deg, oklch(0.92 0.04 280) 0%, oklch(0.8 0.08 260) 35%, oklch(0.75 0.09 230) 65%, oklch(0.85 0.06 320) 100%)" },
      { slug: "sabi-craft",   name: "Sabi Craft",   desc: "Open workspace to turn ideas into materials.",  icon: Wand2,   gradient: "radial-gradient(120% 80% at 80% 50%, oklch(0.15 0.04 280) 0%, transparent 55%), linear-gradient(120deg, oklch(0.88 0.05 280) 0%, oklch(0.7 0.14 285) 40%, oklch(0.45 0.16 290) 75%, oklch(0.2 0.05 285) 100%)" },
    ],
  },
];


function ToolsPage() {
  const matchRoute = useMatchRoute();
  const isToolDetail = matchRoute({ to: "/tools/$slug", fuzzy: true });

  if (isToolDetail) {
    return <Outlet />;
  }

  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-8 lg:py-10 max-w-6xl mx-auto">
        {/* Greeting */}
        <div
          className="rounded-3xl p-6 lg:p-10 text-primary-foreground relative overflow-hidden"
          style={{
            background:
              "radial-gradient(120% 90% at 85% 15%, oklch(0.6 0.18 195) 0%, transparent 55%), radial-gradient(110% 80% at 10% 90%, oklch(0.45 0.2 295) 0%, transparent 55%), linear-gradient(125deg, oklch(0.32 0.08 200) 0%, oklch(0.42 0.13 185) 35%, oklch(0.35 0.14 225) 70%, oklch(0.3 0.16 285) 100%)",
          }}
        >
          <div className="absolute -top-20 -right-20 size-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-10 size-96 rounded-full bg-white/5 blur-3xl" />
          <div className="relative">
            <p className="text-sm font-medium opacity-80">Good morning, Foday 👋</p>
            <h1 className="mt-2 text-3xl lg:text-4xl font-bold tracking-tight">What are we teaching today?</h1>
            <p className="mt-3 max-w-xl opacity-90 text-sm lg:text-base">
              Your Co-Teacher has <span className="font-semibold">12 tools</span> to help you plan, teach, assess and grow — pick one to get started.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link to="/tools/$slug" params={{ slug: "sabi-lesson-plan" }} className="inline-flex items-center gap-2 bg-white text-primary px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-white/90 transition-colors">
                <Sparkles className="size-4" />
                Plan a lesson
              </Link>
              <Link to="/tools/$slug" params={{ slug: "sabi-slides" }} className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-4 py-2.5 rounded-full text-sm font-semibold transition-colors">
                Generate slides
              </Link>
              <Link to="/tools/$slug" params={{ slug: "sabi-diagnose" }} className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-4 py-2.5 rounded-full text-sm font-semibold transition-colors">
                Diagnose a class
              </Link>
            </div>
          </div>
        </div>

        {/* Grouped tools — neon gradient tiles */}
        <div className="mt-12 space-y-10">
          {groups.map((group) => (
            <section key={group.label}>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block size-1.5 rounded-full bg-primary" />
                    <h2 className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                      {group.label}
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1.5">{group.caption}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {group.tools.map((tool) => (
                  <Link
                    key={tool.slug}
                    to="/tools/$slug"
                    params={{ slug: tool.slug }}
                    className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] hover:border-foreground/15"
                  >
                    {/* Gradient image header (AMAL-style) */}
                    <div
                      className="relative aspect-[16/9] w-full overflow-hidden"
                      style={{ background: tool.gradient }}
                    >
                      <div className="absolute top-3 left-3 size-9 rounded-xl bg-white/20 backdrop-blur-md ring-1 ring-white/30 grid place-items-center text-white">
                        <tool.icon className="size-4" />
                      </div>
                    </div>

                    {/* Body */}
                    <div className="flex flex-col flex-1 px-5 pt-4 pb-1">
                      <h3 className="text-base font-bold tracking-tight text-foreground">{tool.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed line-clamp-2">{tool.desc}</p>
                    </div>

                    <div className="mt-3 border-t border-border px-5 py-3 flex items-center justify-between text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      <span>Use this tool</span>
                      <ArrowUpRight className="size-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Recent */}
        <div className="mt-14">
          <h2 className="text-xl font-bold tracking-tight mb-4">Recent work</h2>
          <div className="bg-card border border-border rounded-2xl divide-y divide-border">
            {[
              { title: "Photosynthesis — JSS1 Biology slide deck", time: "2 hours ago", tag: "Sabi Slides" },
              { title: "Multi-step Fractions — Primary 5 Maths (Big Market edition)", time: "Yesterday", tag: "Sabi Lesson Plan" },
              { title: "Narrative Tenses Quiz — JSS2 English", time: "2 days ago", tag: "Sabi Check" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors first:rounded-t-2xl last:rounded-b-2xl">
                <div className="size-10 rounded-lg bg-primary-soft text-primary grid place-items-center shrink-0">
                  <BookOpen className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                </div>
                <span className="hidden sm:inline-block text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">{item.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
