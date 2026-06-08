import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Send, Download, Share2, Paperclip } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/tools/$slug")({
  head: () => ({
    meta: [{ title: "Lesson Planner — SABI Studio" }],
  }),
  component: ToolDetail,
});

function ToolDetail() {
  const { slug } = Route.useParams();
  const title = slug
    .split("-")
    .map((w: string) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-6 lg:py-8 max-w-7xl mx-auto">
        <Link to="/tools" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="size-4" /> All tools
        </Link>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Chat panel */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl flex flex-col h-[70vh] lg:h-[calc(100vh-10rem)] overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center gap-3">
              <div className="size-9 rounded-lg bg-gradient-to-br from-primary to-[oklch(0.4_0.25_300)] grid place-items-center text-primary-foreground">
                <Sparkles className="size-4" />
              </div>
              <div>
                <h2 className="font-semibold tracking-tight leading-none">{title}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Powered by SABI AI</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="max-w-[85%] bg-muted rounded-2xl rounded-tl-sm px-4 py-3 text-sm">
                Hi Foday! What lesson are we planning today? Tell me the subject, grade, and topic.
              </div>
              <div className="max-w-[85%] ml-auto bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 text-sm">
                Primary 5 Maths — multi-step word problems involving fractions. 40-minute lesson, with examples from a Freetown market.
              </div>
              <div className="max-w-[90%] bg-muted rounded-2xl rounded-tl-sm px-4 py-3 text-sm space-y-2">
                <p>Got it. I've drafted a 40-minute plan with a market-trip activity using rice, cassava, and dry fish quantities from Big Market. Preview it on the right →</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button className="text-xs bg-background border border-border rounded-full px-3 py-1 hover:bg-accent transition-colors">Simplify language</button>
                  <button className="text-xs bg-background border border-border rounded-full px-3 py-1 hover:bg-accent transition-colors">Add a quiz</button>
                  <button className="text-xs bg-background border border-border rounded-full px-3 py-1 hover:bg-accent transition-colors">Translate to Krio</button>
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-border">
              <div className="flex items-end gap-2 bg-muted rounded-2xl p-2">
                <button className="size-9 grid place-items-center text-muted-foreground hover:text-foreground shrink-0">
                  <Paperclip className="size-4" />
                </button>
                <textarea
                  placeholder="Ask SABI to refine, add, or translate..."
                  rows={1}
                  className="flex-1 bg-transparent text-sm focus:outline-none resize-none py-2"
                />
                <button className="size-9 rounded-xl bg-primary text-primary-foreground grid place-items-center hover:bg-primary/90 transition-colors shrink-0">
                  <Send className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Artifact preview */}
          <div className="lg:col-span-3 bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between bg-muted/30">
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Preview · lesson_plan_p5_maths.pdf</p>
              <div className="flex items-center gap-1">
                <button className="size-8 rounded-lg grid place-items-center hover:bg-muted transition-colors">
                  <Share2 className="size-4" />
                </button>
                <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary px-3 py-1.5 rounded-lg hover:bg-primary-soft transition-colors">
                  <Download className="size-4" /> Save
                </button>
              </div>
            </div>

            <div className="p-6 lg:p-10">
              <div className="max-w-[60ch] mx-auto">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Lesson Plan</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight">Multi-Step Fraction Challenges</h1>
                <p className="mt-2 text-sm text-muted-foreground">Primary 5 · Mathematics · 40 minutes</p>

                <div className="mt-8 rounded-xl bg-primary-soft border-l-4 border-primary p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Learning objective</p>
                  <p className="text-sm">Students will solve multi-step word problems by decomposing fractions into addition and subtraction steps using familiar market scenarios.</p>
                </div>

                <Section title="Introduction (10 mins)">
                  Distribute 12-hole egg crates and coloured counters. Ask students to fill 2/3 with red and 1/4 with blue. Prompt: "How much is left empty?"
                </Section>
                <Section title="Core activity — The market trip (20 mins)">
                  Mrs. Okafor buys 1/2 kg of rice, 1/4 kg of beans, and 1/8 kg of crayfish. Working in pairs, students calculate the total weight in her basket and represent it visually.
                </Section>
                <Section title="Wrap up & exit ticket (10 mins)">
                  Quick 3-question exit ticket. Students draw a fraction strip showing today's market total. Collect for review.
                </Section>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Materials</p>
                    <p className="text-sm mt-1.5">Egg crates, coloured counters, fraction strips</p>
                  </div>
                  <div className="rounded-xl border border-border p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Differentiation</p>
                    <p className="text-sm mt-1.5">Visual aids for mixed-ability groups</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h2 className="font-bold text-lg tracking-tight">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-foreground/80">{children}</p>
    </div>
  );
}
