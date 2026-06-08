import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ArrowRight, BadgeCheck, Briefcase, Check, GraduationCap, Heart, MapPin, School, Sparkles, Sun, Globe2, Languages, Users } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Get started — SABI" }] }),
  component: Onboarding,
});

type Role = "teacher" | "parent" | null;

const teacherCats = [
  { id: "school", label: "School Vacancies", icon: School },
  { id: "private", label: "Private Tutoring", icon: GraduationCap },
  { id: "afterschool", label: "Afterschool Support", icon: Sun },
  { id: "online", label: "Online Teaching", icon: Globe2 },
  { id: "holiday", label: "Holiday Classes", icon: Sparkles },
  { id: "language", label: "Language Coaching", icon: Languages },
];

const subjects = ["Mathematics", "English", "Physics", "Chemistry", "Biology", "Krio", "French", "ICT", "Literature", "Government"];
const neighbourhoods = ["Wilkinson Road", "Hill Station", "Aberdeen", "Murray Town", "Kingtom", "Lumley", "Goderich", "Remote / Online"];

function Onboarding() {
  const [role, setRole] = useState<Role>(null);
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [area, setArea] = useState("Wilkinson Road");
  const [picks, setPicks] = useState<string[]>([]);
  const [subjectPicks, setSubjectPicks] = useState<string[]>([]);

  function togglePick(id: string, list: string[], setList: (v: string[]) => void) {
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }

  if (!role) {
    return (
      <AppShell>
        <div className="px-4 lg:px-8 py-12 max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Welcome to SABI</p>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mt-1">How will you use <em className="font-serif italic font-normal">SABI Earn</em>?</h1>
          <p className="text-muted-foreground mt-2">We'll personalise your matches and feed.</p>

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <RoleCard
              icon={<Briefcase className="size-6" />}
              title="I'm a teacher"
              desc="Find tutoring, school and holiday opportunities matched to me."
              onClick={() => setRole("teacher")}
            />
            <RoleCard
              icon={<Users className="size-6" />}
              title="I'm a parent / guardian"
              desc="Post a tutoring need, find trusted teachers, endorse great ones."
              onClick={() => setRole("parent")}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-6 text-center">
            Or <Link to="/" className="text-primary font-semibold">skip for now</Link>
          </p>
        </div>
      </AppShell>
    );
  }

  const totalSteps = 3;
  const isTeacher = role === "teacher";

  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-10 max-w-2xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Onboarding · {isTeacher ? "Teacher" : "Parent"}</p>

        {/* Stepper */}
        <ol className="mt-3 flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <li key={i} className="flex-1 flex items-center gap-2">
              <span className={`size-7 rounded-full grid place-items-center text-xs font-bold ${i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {i < step ? <Check className="size-3.5" /> : i + 1}
              </span>
              {i < totalSteps - 1 && <span className={`flex-1 h-px ${i < step ? "bg-primary" : "bg-border"}`} />}
            </li>
          ))}
        </ol>

        <div className="mt-6 bg-card border border-border rounded-2xl p-6">
          {step === 0 && (
            <>
              <h2 className="text-xl font-bold tracking-tight">{isTeacher ? "Set up your teacher profile" : "Tell us about you"}</h2>
              <p className="text-sm text-muted-foreground mt-1">This appears on your endorsements and applications.</p>
              <div className="mt-5 space-y-4">
                <Field label="Full name" value={name} onChange={setName} placeholder={isTeacher ? "e.g. Foday Kamara" : "e.g. Aminata Bangura"} />
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Neighbourhood</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {neighbourhoods.map((n) => {
                      const on = area === n;
                      return (
                        <button key={n} onClick={() => setArea(n)} className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold border ${on ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/40"}`}>
                          <MapPin className="size-3.5" /> {n}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="text-xl font-bold tracking-tight">{isTeacher ? "What kind of opportunities interest you?" : "What kind of help are you looking for?"}</h2>
              <p className="text-sm text-muted-foreground mt-1">Pick all that apply. You can change these later.</p>
              <div className="mt-5 grid sm:grid-cols-2 gap-2">
                {teacherCats.map((c) => {
                  const on = picks.includes(c.id);
                  return (
                    <button key={c.id} onClick={() => togglePick(c.id, picks, setPicks)} className={`flex items-center gap-3 p-3 rounded-xl border text-left ${on ? "border-primary bg-primary-soft" : "border-border hover:border-primary/40"}`}>
                      <c.icon className="size-5 text-primary" />
                      <span className="font-semibold text-sm flex-1">{c.label}</span>
                      {on && <Check className="size-4 text-primary" />}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{isTeacher ? "Subjects you teach" : "Subjects your child needs help in"}</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {subjects.map((s) => {
                    const on = subjectPicks.includes(s);
                    return (
                      <button key={s} onClick={() => togglePick(s, subjectPicks, setSubjectPicks)} className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${on ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/40"}`}>
                        {on && <Check className="size-3.5 inline mr-1" />}{s}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-bold tracking-tight">Your first recommended {isTeacher ? "opportunities" : "teachers"}</h2>
              <p className="text-sm text-muted-foreground mt-1">Based on your picks in <strong>{area}</strong>.</p>
              <div className="mt-5 space-y-3">
                {isTeacher ? (
                  <>
                    <RecCard title="WASSCE Maths tutor (SS3)" by="Mrs. Aminata Bangura · Parent" meta="2.4 km · Le 350k/session" />
                    <RecCard title="Afterschool homework club lead" by="Murray Town Parents Co-op" meta="4.1 km · Le 2.8M/month" />
                    <RecCard title="Senior Mathematics Lead" by="Prince of Wales School" meta="6.8 km · Full-time" />
                  </>
                ) : (
                  <>
                    <RecCard title="Mariama Kallon" by="Maths · 4.9★ · 47 reviews" meta="Wilkinson Road · 1.2 km" />
                    <RecCard title="Ibrahim Sesay" by="Physics · 4.8★ · 31 reviews" meta="Hill Station · 3.4 km" />
                    <RecCard title="Fatmata Conteh" by="English · 4.95★ · 22 reviews" meta="Aberdeen · 5.1 km" />
                  </>
                )}
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="px-5 py-2.5 rounded-full border border-border font-semibold text-sm disabled:opacity-40">
            Back
          </button>
          {step < totalSteps - 1 ? (
            <button onClick={() => setStep((s) => s + 1)} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
              Continue <ArrowRight className="size-4" />
            </button>
          ) : (
            <button onClick={() => navigate({ to: isTeacher ? "/jobs" : "/recommendations" })} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
              Go to {isTeacher ? "Opportunities" : "Recommendations"} <ArrowRight className="size-4" />
            </button>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function RoleCard({ icon, title, desc, onClick }: { icon: React.ReactNode; title: string; desc: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-left p-6 rounded-2xl border border-border bg-card hover:border-primary/60 hover:shadow-[var(--shadow-soft)] transition">
      <div className="size-12 rounded-2xl bg-primary-soft text-primary grid place-items-center">{icon}</div>
      <h3 className="font-bold tracking-tight mt-4">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{desc}</p>
      <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-primary">Continue <ArrowRight className="size-4" /></span>
    </button>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-1 w-full px-4 py-2.5 rounded-xl bg-muted text-sm border border-transparent focus:bg-background focus:border-border focus:ring-2 focus:ring-primary/20 focus:outline-none" />
    </label>
  );
}

function RecCard({ title, by, meta }: { title: string; by: string; meta: string }) {
  return (
    <div className="rounded-xl border border-border p-4 flex items-center gap-3">
      <div className="size-10 rounded-xl bg-primary-soft text-primary grid place-items-center"><BadgeCheck className="size-5" /></div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{by} · {meta}</p>
      </div>
      <Heart className="size-4 text-muted-foreground" />
    </div>
  );
}
