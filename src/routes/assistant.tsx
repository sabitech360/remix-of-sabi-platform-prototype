import { createFileRoute } from "@tanstack/react-router";
import {
  Sparkles,
  Paperclip,
  Mic,
  BookOpen,
  Hammer,
  ShieldCheck,
  Heart,
  Palette,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "My Assistant — SABI Studio" },
      { name: "description", content: "Ask anything about teaching — your AI co-teacher will search, draft and explain." },
    ],
  }),
  component: AssistantPage,
});

const topics = [
  { label: "Student Wellbeing",      icon: Heart },
  { label: "Creative Teaching",      icon: Palette },
  { label: "Project-Based Learning", icon: Hammer },
  { label: "Classroom Management",   icon: ShieldCheck },
];

function AssistantPage() {
  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-10 lg:py-14 max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">How can I help you teach today?</h1>
          <p className="mt-3 text-muted-foreground text-sm lg:text-base">
            Ask anything about teaching — I'll search, draft and explain.
          </p>
        </div>

        <div className="mt-8 bg-card border border-border rounded-3xl p-3 shadow-[var(--shadow-soft)]">
          <input
            type="text"
            placeholder="Ask anything — e.g. how to teach long division to a mixed-ability JSS1 class…"
            className="w-full px-4 py-3 rounded-2xl bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground"
          />
          <div className="flex items-center justify-between gap-2 pt-1 px-1">
            <button
              type="button"
              aria-label="Attach file"
              className="size-10 grid place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Paperclip className="size-4" />
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Voice mode"
                className="size-10 grid place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Mic className="size-4" />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-primary-foreground px-4 py-2.5 rounded-full text-sm font-semibold transition-all hover:brightness-110"
                style={{ background: "var(--gradient-teal)", boxShadow: "var(--shadow-teal)" }}
              >
                <Sparkles className="size-3.5" />
                Ask
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-muted-foreground mb-3 text-center">Suggested topics</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {topics.map((t) => (
              <button
                key={t.label}
                className="group flex flex-col items-start gap-3 text-left bg-card hover:bg-primary-soft border border-border hover:border-primary/40 rounded-2xl p-4 transition-all"
              >
                <span className="size-10 rounded-xl bg-primary-soft text-primary grid place-items-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <t.icon className="size-5" />
                </span>
                <span className="text-sm font-semibold leading-tight">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
