import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Send } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { opportunities } from "./jobs";

export const Route = createFileRoute("/jobs/$id/apply")({
  head: () => ({ meta: [{ title: "Apply — SABI Earn" }] }),
  component: ApplyPage,
});

export type Application = {
  id: string;
  jobId: string;
  jobTitle: string;
  poster: string;
  status: "submitted" | "under_review" | "shortlisted" | "interview" | "declined";
  submittedAt: string;
  availability: string[];
  intro: string;
  rate?: string;
};

const APP_KEY = "sabi.applications";

export function loadApplications(): Application[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(APP_KEY) || "[]"); } catch { return []; }
}

const slots = ["Weekday mornings", "Weekday afternoons", "Weekday evenings", "Saturdays", "Sundays", "School holidays"];

function ApplyPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const job = useMemo(() => opportunities.find((o) => o.id === id), [id]);
  const [step, setStep] = useState(0);
  const [avail, setAvail] = useState<string[]>([]);
  const [intro, setIntro] = useState("");
  const [rate, setRate] = useState("");
  const [name, setName] = useState("Foday Kamara");
  const [phone, setPhone] = useState("+232 76 123 456");
  const [subjects, setSubjects] = useState("Mathematics, Physics");
  const [submitted, setSubmitted] = useState(false);

  if (!job) {
    return (
      <AppShell>
        <div className="p-8 max-w-xl mx-auto text-center">
          <p>Opportunity not found.</p>
          <Link to="/jobs" className="text-primary font-semibold mt-4 inline-block">Back to opportunities</Link>
        </div>
      </AppShell>
    );
  }

  const steps = ["Your profile", "Availability", "Intro message", "Review & send"];
  const canNext = step === 0 ? name.trim() && subjects.trim() && phone.trim() : step === 1 ? avail.length > 0 : step === 2 ? intro.trim().length >= 30 : true;

  function toggleSlot(s: string) {
    setAvail((cur) => cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]);
  }

  function submit() {
    const app: Application = {
      id: crypto.randomUUID(),
      jobId: job!.id, jobTitle: job!.title, poster: job!.poster,
      status: "submitted", submittedAt: new Date().toISOString(),
      availability: avail, intro, rate,
    };
    const list = [app, ...loadApplications()];
    localStorage.setItem(APP_KEY, JSON.stringify(list));
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <AppShell>
        <div className="px-4 lg:px-8 py-12 max-w-xl mx-auto text-center">
          <div className="size-16 rounded-full bg-primary-soft text-primary grid place-items-center mx-auto">
            <CheckCircle2 className="size-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-4">Application sent</h1>
          <p className="text-muted-foreground mt-2">{job.poster} will review your profile. Expect a reply within 2–3 days. You can track status in <strong>My applications</strong>.</p>
          <div className="flex gap-3 justify-center mt-6">
            <button onClick={() => navigate({ to: "/applications" })} className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm">View status</button>
            <Link to="/jobs" className="px-5 py-2.5 rounded-full border border-border font-semibold text-sm">More opportunities</Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-8 lg:py-10 max-w-2xl mx-auto">
        <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to opportunities
        </Link>

        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mt-3">{job.title}</h1>
        <p className="text-sm text-muted-foreground">Posted by {job.poster} · {job.pay}</p>

        {/* Stepper */}
        <ol className="mt-6 flex items-center gap-2">
          {steps.map((s, i) => (
            <li key={s} className="flex-1 flex items-center gap-2">
              <span className={`size-7 rounded-full grid place-items-center text-xs font-bold ${i < step ? "bg-primary text-primary-foreground" : i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {i < step ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span className={`text-xs font-semibold hidden sm:inline ${i === step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
              {i < steps.length - 1 && <span className={`flex-1 h-px ${i < step ? "bg-primary" : "bg-border"}`} />}
            </li>
          ))}
        </ol>

        <div className="mt-6 bg-card border border-border rounded-2xl p-6">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-bold">Confirm your profile</h2>
              <Field label="Full name" value={name} onChange={setName} />
              <Field label="Phone (WhatsApp)" value={phone} onChange={setPhone} />
              <Field label="Subjects you teach" value={subjects} onChange={setSubjects} hint="Comma-separated, e.g. Mathematics, Physics" />
            </div>
          )}
          {step === 1 && (
            <div>
              <h2 className="font-bold">When can you teach?</h2>
              <p className="text-sm text-muted-foreground mt-1">Pick all that apply.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {slots.map((s) => {
                  const on = avail.includes(s);
                  return (
                    <button key={s} onClick={() => toggleSlot(s)} className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${on ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/40"}`}>
                      {on && <Check className="size-3.5 inline mr-1" />}{s}
                    </button>
                  );
                })}
              </div>
              <div className="mt-5">
                <Field label="Proposed rate (optional)" value={rate} onChange={setRate} hint="e.g. Le 300k / session" />
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 className="font-bold">Short intro to {job.poster}</h2>
              <p className="text-sm text-muted-foreground mt-1">Why are you a great fit? Share your experience and approach (min 30 characters).</p>
              <textarea
                value={intro} onChange={(e) => setIntro(e.target.value)} rows={7}
                placeholder="e.g. I've prepared 40+ students for WASSCE Maths over 6 years…"
                className="mt-4 w-full p-4 rounded-xl bg-muted text-sm border border-transparent focus:bg-background focus:border-border focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
              <p className="text-xs text-muted-foreground mt-1">{intro.length} characters</p>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-3 text-sm">
              <h2 className="font-bold">Review your application</h2>
              <Row k="Name" v={name} />
              <Row k="Phone" v={phone} />
              <Row k="Subjects" v={subjects} />
              <Row k="Availability" v={avail.join(", ") || "—"} />
              {rate && <Row k="Rate" v={rate} />}
              <div>
                <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider mt-3">Intro</p>
                <p className="mt-1 whitespace-pre-wrap">{intro}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="px-5 py-2.5 rounded-full border border-border font-semibold text-sm disabled:opacity-40"
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <button onClick={() => setStep((s) => s + 1)} disabled={!canNext} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-40">
              Continue <ArrowRight className="size-4" />
            </button>
          ) : (
            <button onClick={submit} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
              <Send className="size-4" /> Send application
            </button>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full px-4 py-2.5 rounded-xl bg-muted text-sm border border-transparent focus:bg-background focus:border-border focus:ring-2 focus:ring-primary/20 focus:outline-none" />
      {hint && <span className="text-[11px] text-muted-foreground mt-1 block">{hint}</span>}
    </label>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border pb-2">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium text-right">{v}</span>
    </div>
  );
}
