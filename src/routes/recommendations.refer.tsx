import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ArrowLeft, BadgeCheck, Check, Copy, Heart, Share2, Sparkles, Star } from "lucide-react";

export const Route = createFileRoute("/recommendations/refer")({
  head: () => ({ meta: [{ title: "Refer a teacher — SABI Earn" }] }),
  component: ReferPage,
});

const teacherChoices = [
  { id: "t1", name: "Mariama Kallon", subjects: "Maths · Further Maths" },
  { id: "t2", name: "Ibrahim Sesay", subjects: "Physics · Basic Science" },
  { id: "t3", name: "Fatmata Conteh", subjects: "English · Krio coaching" },
  { id: "t4", name: "Joseph Bangura", subjects: "Chemistry · WASSCE prep" },
];

function ReferPage() {
  const [teacherId, setTeacherId] = useState(teacherChoices[0].id);
  const [relationship, setRelationship] = useState("Tutored my children");
  const [duration, setDuration] = useState("More than 1 year");
  const [stars, setStars] = useState(5);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const teacher = teacherChoices.find((t) => t.id === teacherId)!;
  const referralLink = useMemo(() => {
    const code = (teacher.name.split(" ").map((p) => p[0]).join("") + "-" + Math.random().toString(36).slice(2, 7)).toLowerCase();
    return `https://sabi.app/r/${code}`;
  }, [teacher.id, submitted]);

  function copy() {
    navigator.clipboard.writeText(referralLink);
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  }

  if (submitted) {
    return (
      <AppShell>
        <div className="px-4 lg:px-8 py-10 max-w-xl mx-auto">
          <div className="size-16 rounded-full bg-primary-soft text-primary grid place-items-center mx-auto">
            <Heart className="size-8 fill-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-center mt-4">Thanks for endorsing {teacher.name}</h1>
          <p className="text-muted-foreground text-center mt-2">Your verified note boosts their visibility across SABI.</p>

          <div className="mt-8 rounded-2xl p-6 text-primary-foreground" style={{ background: "var(--gradient-teal)", boxShadow: "var(--shadow-teal)" }}>
            <p className="text-xs font-bold uppercase tracking-wider opacity-80 inline-flex items-center gap-1"><Share2 className="size-3.5" /> Shareable referral link</p>
            <p className="font-mono text-sm mt-2 break-all bg-white/15 rounded-lg p-3">{referralLink}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={copy} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-sm font-semibold">
                {copied ? <><Check className="size-4" /> Copied</> : <><Copy className="size-4" /> Copy link</>}
              </button>
              <button className="flex-1 px-4 py-2 rounded-full bg-white text-primary text-sm font-semibold">Share on WhatsApp</button>
            </div>
            <p className="text-xs opacity-80 mt-3">When another parent hires through your link, you both get a Le 50k credit.</p>
          </div>

          <div className="flex gap-3 justify-center mt-6">
            <Link to="/recommendations" className="px-5 py-2.5 rounded-full border border-border font-semibold text-sm">Back to recommendations</Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-8 lg:py-10 max-w-2xl mx-auto">
        <Link to="/recommendations" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to recommendations
        </Link>
        <p className="text-xs font-bold uppercase tracking-wider text-primary mt-3">SABI Earn · Community</p>
        <h1 className="text-3xl font-bold tracking-tight mt-1">Endorse a <em className="font-serif italic font-normal">teacher</em></h1>
        <p className="text-muted-foreground mt-2">Verified parent recommendations help great teachers stand out. You'll get a shareable referral link at the end.</p>

        <div className="mt-6 bg-card border border-border rounded-2xl p-6 space-y-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Choose a teacher</span>
            <div className="mt-2 grid sm:grid-cols-2 gap-2">
              {teacherChoices.map((t) => {
                const on = t.id === teacherId;
                return (
                  <button key={t.id} onClick={() => setTeacherId(t.id)}
                    className={`text-left p-3 rounded-xl border transition-colors ${on ? "border-primary bg-primary-soft" : "border-border hover:border-primary/40"}`}>
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-gradient-to-br from-[oklch(0.7_0.15_30)] to-[oklch(0.45_0.2_25)] text-white grid place-items-center font-bold text-sm">
                        {t.name.split(" ").map(p => p[0]).join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm inline-flex items-center gap-1">{t.name} <BadgeCheck className="size-3.5 text-primary" /></p>
                        <p className="text-xs text-muted-foreground truncate">{t.subjects}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">How do you know them?</span>
            <select value={relationship} onChange={(e) => setRelationship(e.target.value)}
              className="mt-1 w-full px-4 py-2.5 rounded-xl bg-muted text-sm border border-transparent focus:bg-background focus:border-border focus:ring-2 focus:ring-primary/20 focus:outline-none">
              <option>Tutored my children</option>
              <option>Taught at my child's school</option>
              <option>Ran a holiday programme we attended</option>
              <option>Recommended by a trusted parent</option>
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">How long have you known them?</span>
            <select value={duration} onChange={(e) => setDuration(e.target.value)}
              className="mt-1 w-full px-4 py-2.5 rounded-xl bg-muted text-sm border border-transparent focus:bg-background focus:border-border focus:ring-2 focus:ring-primary/20 focus:outline-none">
              <option>Less than 3 months</option>
              <option>3–12 months</option>
              <option>More than 1 year</option>
              <option>More than 3 years</option>
            </select>
          </label>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your rating</span>
            <div className="mt-1 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setStars(n)} className="p-1">
                  <Star className={`size-7 ${n <= stars ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Verified note (visible to other parents)</span>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={5}
              placeholder={`What makes ${teacher.name.split(" ")[0]} a great teacher? Be specific — results, style, reliability.`}
              className="mt-1 w-full p-4 rounded-xl bg-muted text-sm border border-transparent focus:bg-background focus:border-border focus:ring-2 focus:ring-primary/20 focus:outline-none" />
            <span className="text-[11px] text-muted-foreground mt-1 block inline-flex items-center gap-1"><Sparkles className="size-3 text-primary" /> Verified using your registered phone — visible as "Aminata B., parent in Wilkinson Road".</span>
          </label>

          <button onClick={() => setSubmitted(true)} disabled={note.trim().length < 30}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-40">
            <Heart className="size-4" /> Submit endorsement
          </button>
        </div>
      </div>
    </AppShell>
  );
}
