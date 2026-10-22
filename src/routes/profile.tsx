import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, GraduationCap, Mail, School, Plus, Check, X } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — SABI Studio" }] }),
  component: Profile,
});

type TeacherProfile = {
  headline: string;
  location: string;
  education: string;
  school: string;
  experience: string;
  about: string;
  subjects: string;
  gradeLevels: string[];
};

const EMPTY: TeacherProfile = {
  headline: "",
  location: "",
  education: "",
  school: "",
  experience: "",
  about: "",
  subjects: "",
  gradeLevels: [],
};

const GRADE_OPTIONS = [
  "Early Years", "Primary 1-3", "Primary 4-6",
  "JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3",
];

function Profile() {
  const { user, isLoaded } = useUser();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<TeacherProfile>(EMPTY);

  const fullName = user?.fullName || user?.firstName || "SABI Teacher";
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const initials = fullName.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();

  const saved: TeacherProfile = {
    ...EMPTY,
    ...((user?.unsafeMetadata?.profile as Partial<TeacherProfile> | undefined) ?? {}),
  };
  const subjectList = saved.subjects.split(",").map((s) => s.trim()).filter(Boolean);

  const completeness = Math.round(
    ([saved.headline, saved.location, saved.education, saved.school, saved.experience, saved.about, subjectList.length ? "x" : "", saved.gradeLevels.length ? "x" : ""]
      .filter(Boolean).length / 8) * 100,
  );

  const startEdit = () => {
    setDraft(saved);
    setError("");
    setEditing(true);
  };

  const save = async () => {
    if (!user) return;
    setSaving(true);
    setError("");
    try {
      await user.update({ unsafeMetadata: { ...user.unsafeMetadata, profile: draft } });
      setEditing(false);
    } catch (e) {
      console.error("Profile save error:", e);
      setError("Could not save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const toggleGrade = (g: string) =>
    setDraft((d) => ({
      ...d,
      gradeLevels: d.gradeLevels.includes(g) ? d.gradeLevels.filter((x) => x !== g) : [...d.gradeLevels, g],
    }));

  const set = (k: keyof TeacherProfile) => (v: string) => setDraft((d) => ({ ...d, [k]: v }));

  if (!isLoaded) {
    return (
      <AppShell>
        <div className="min-h-[50vh] grid place-items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        {/* Cover */}
        <div className="h-40 lg:h-56 bg-gradient-to-br from-[oklch(0.35_0.22_290)] via-primary to-[oklch(0.5_0.28_310)] relative overflow-hidden">
          <div className="absolute -bottom-20 -right-10 size-72 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="px-4 lg:px-8 -mt-20 relative z-10">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end gap-6">
            <div className="size-32 rounded-3xl bg-gradient-to-br from-[oklch(0.7_0.15_30)] to-[oklch(0.45_0.2_25)] grid place-items-center text-white text-4xl font-bold ring-4 ring-background shadow-lg shrink-0 relative z-10 overflow-hidden">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt={fullName} className="size-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{fullName}</h1>
              <p className="text-muted-foreground mt-1">
                {[saved.headline, saved.experience && `${saved.experience} years experience`].filter(Boolean).join(" · ") ||
                  "Add your title and experience"}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                {email && <span className="inline-flex items-center gap-1"><Mail className="size-3.5" />{email}</span>}
                {saved.location && <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" />{saved.location}</span>}
                {saved.education && <span className="inline-flex items-center gap-1"><GraduationCap className="size-3.5" />{saved.education}</span>}
                {saved.school && <span className="inline-flex items-center gap-1"><School className="size-3.5" />{saved.school}</span>}
              </div>
            </div>
            {!editing && (
              <button onClick={startEdit} className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                Edit profile
              </button>
            )}
          </div>

          {/* Edit form */}
          {editing && (
            <div className="mt-8 bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg tracking-tight">Edit your profile</h2>
                <button onClick={() => setEditing(false)} className="size-8 grid place-items-center rounded-full hover:bg-muted" aria-label="Cancel">
                  <X className="size-4" />
                </button>
              </div>

              <div className="mt-5 grid sm:grid-cols-2 gap-4">
                <Field label="Title" value={draft.headline} onChange={set("headline")} placeholder="e.g. Senior Physics Educator" />
                <Field label="Years of experience" value={draft.experience} onChange={set("experience")} placeholder="e.g. 12" />
                <Field label="Location" value={draft.location} onChange={set("location")} placeholder="e.g. Freetown, Sierra Leone" />
                <Field label="School or organisation" value={draft.school} onChange={set("school")} placeholder="e.g. Prince of Wales School" />
                <div className="sm:col-span-2">
                  <Field label="Qualification" value={draft.education} onChange={set("education")} placeholder="e.g. B.Ed. Physics, Fourah Bay College" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">About you</label>
                  <textarea
                    rows={4}
                    value={draft.about}
                    onChange={(e) => set("about")(e.target.value)}
                    placeholder="A short introduction to how and what you teach."
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Field label="Subjects (separate with commas)" value={draft.subjects} onChange={set("subjects")} placeholder="e.g. Physics, Mathematics, Basic Science" />
                </div>
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Grade levels</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {GRADE_OPTIONS.map((g) => {
                  const on = draft.gradeLevels.includes(g);
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleGrade(g)}
                      className={`text-sm px-3 py-1 rounded-full border font-medium ${
                        on ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/40"
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>

              {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
              <div className="mt-6 flex gap-2">
                <button
                  onClick={save}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50"
                >
                  <Check className="size-4" /> {saving ? "Saving..." : "Save profile"}
                </button>
                <button onClick={() => setEditing(false)} className="px-5 py-2.5 rounded-full border border-border font-semibold text-sm hover:bg-muted">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* About + subjects */}
          <div className="mt-8 grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
              <h2 className="font-bold text-lg tracking-tight">About</h2>
              <p className="mt-3 text-sm text-foreground/80 leading-relaxed">
                {saved.about || "Tell parents and schools about yourself. Select Edit profile to add a short introduction."}
              </p>

              <h3 className="mt-6 font-semibold text-sm uppercase tracking-wider text-muted-foreground">Subjects</h3>
              <div className="flex flex-wrap gap-2 mt-3">
                {subjectList.length ? (
                  subjectList.map((s) => (
                    <span key={s} className="text-sm px-3 py-1 rounded-full bg-primary-soft text-primary font-medium">{s}</span>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No subjects added yet.</span>
                )}
              </div>

              <h3 className="mt-6 font-semibold text-sm uppercase tracking-wider text-muted-foreground">Grade levels</h3>
              <div className="flex flex-wrap gap-2 mt-3">
                {saved.gradeLevels.length ? (
                  saved.gradeLevels.map((g) => (
                    <span key={g} className="text-sm px-3 py-1 rounded-full border border-border font-medium">{g}</span>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No grade levels added yet.</span>
                )}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-bold text-lg tracking-tight">Profile strength</h2>
              <p className="mt-3 text-3xl font-bold tracking-tight">{completeness}%</p>
              <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${completeness}%` }} />
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                A complete profile helps parents and schools find you in SABI Earn matches.
              </p>
            </div>
          </div>

          {/* Private teaching services */}
          <div className="mt-10">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">SABI Earn</p>
                <h2 className="text-xl font-bold tracking-tight mt-1">Private teaching services</h2>
                <p className="text-sm text-muted-foreground mt-1">Services you offer directly to parents and students nearby.</p>
              </div>
              <button disabled className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold opacity-50 cursor-not-allowed">
                <Plus className="size-4" /> Add a service
              </button>
            </div>
            <div className="mt-4 rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
              You have not listed any services yet. Service listings are coming soon.
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-10 mb-10 bg-card border border-border rounded-2xl p-6">
            <h2 className="font-bold text-lg tracking-tight">Parent reviews</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              No reviews yet. Reviews from parents and schools will appear here once you start teaching through SABI Earn.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}