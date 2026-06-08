import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { BadgeCheck, Calendar, ChevronRight, FileText, Inbox } from "lucide-react";
import { loadApplications, type Application } from "./jobs.$id.apply";

export const Route = createFileRoute("/applications")({
  head: () => ({ meta: [{ title: "My applications — SABI Earn" }] }),
  component: ApplicationsPage,
});

const STATUSES: { id: Application["status"]; label: string; color: string; step: number }[] = [
  { id: "submitted", label: "Submitted", color: "bg-muted text-foreground", step: 1 },
  { id: "under_review", label: "Under review", color: "bg-amber-100 text-amber-800", step: 2 },
  { id: "shortlisted", label: "Shortlisted", color: "bg-primary-soft text-primary", step: 3 },
  { id: "interview", label: "Interview scheduled", color: "bg-primary text-primary-foreground", step: 4 },
  { id: "declined", label: "Not selected", color: "bg-muted text-muted-foreground", step: 0 },
];

const demo: Application[] = [
  {
    id: "demo1", jobId: "s1", jobTitle: "Senior Mathematics Lead", poster: "Prince of Wales School",
    status: "interview", submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    availability: ["Weekday mornings"], intro: "10 years of senior secondary maths…",
  },
  {
    id: "demo2", jobId: "p1", jobTitle: "WASSCE Maths tutor for SS3", poster: "Mrs. Aminata Bangura",
    status: "shortlisted", submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    availability: ["Weekday evenings", "Saturdays"], intro: "I've prepared 40+ students for WASSCE…",
  },
];

function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  useEffect(() => {
    const stored = loadApplications();
    setApps(stored.length ? stored : demo);
  }, []);

  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-8 lg:py-10 max-w-5xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">SABI Earn</p>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mt-1">My <em className="font-serif italic font-normal">applications</em></h1>
        <p className="text-muted-foreground mt-2">Track every tutoring and school role you've applied to.</p>

        {apps.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center">
            <Inbox className="size-8 text-muted-foreground mx-auto" />
            <p className="mt-3 font-semibold">No applications yet</p>
            <p className="text-sm text-muted-foreground mt-1">Apply to a tutoring or school opportunity to track its status here.</p>
            <Link to="/jobs" className="inline-block mt-4 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold">Browse opportunities</Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {apps.map((a) => {
              const meta = STATUSES.find((s) => s.id === a.status)!;
              return (
                <article key={a.id} className="bg-card border border-border rounded-2xl p-5 lg:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold tracking-tight">{a.jobTitle}</h3>
                      <p className="text-sm text-muted-foreground inline-flex items-center gap-1 mt-0.5">
                        <BadgeCheck className="size-3.5 text-primary" /> {a.poster}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${meta.color}`}>
                      {meta.label}
                    </span>
                  </div>

                  {/* Status timeline */}
                  {a.status !== "declined" && (
                    <ol className="mt-5 flex items-center gap-2">
                      {STATUSES.filter((s) => s.id !== "declined").map((s, i) => (
                        <li key={s.id} className="flex-1 flex items-center gap-2">
                          <span className={`size-2.5 rounded-full ${meta.step >= s.step ? "bg-primary" : "bg-border"}`} />
                          <span className={`text-[10px] font-semibold ${meta.step >= s.step ? "text-foreground" : "text-muted-foreground"} hidden sm:inline`}>{s.label}</span>
                          {i < 3 && <span className={`flex-1 h-px ${meta.step > s.step ? "bg-primary" : "bg-border"}`} />}
                        </li>
                      ))}
                    </ol>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="size-3.5" /> Sent {new Date(a.submittedAt).toLocaleDateString()}
                    </span>
                    {a.availability.length > 0 && <span>Avail: {a.availability.join(", ")}</span>}
                  </div>

                  <details className="mt-3 group">
                    <summary className="cursor-pointer inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      <FileText className="size-4" /> View intro
                      <ChevronRight className="size-3.5 group-open:rotate-90 transition-transform" />
                    </summary>
                    <p className="mt-2 text-sm text-foreground/80 whitespace-pre-wrap">{a.intro}</p>
                  </details>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
