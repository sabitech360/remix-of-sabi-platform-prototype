import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Send, Download, Paperclip } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/tools/$slug")({
  head: () => ({
    meta: [{ title: "SABI Tool" }],
  }),
  component: ToolDetail,
});

type ToolField = {
  key: string;
  label: string;
  placeholder: string;
};

type ToolConfig = {
  label: string;
  placeholder: string;
  endpoint: string;
  fields: ToolField[];
};

const TOOL_CONFIG: Record<string, ToolConfig> = {
  "sabi-lesson-plan": {
    label: "Lesson Plan",
    placeholder: "Ask SABI to refine, translate, or adjust...",
    endpoint: "/api/tools/plan",
    fields: [
      { key: "grade", label: "Grade / Class", placeholder: "e.g. Primary 5" },
      { key: "subject", label: "Subject", placeholder: "e.g. Mathematics" },
      { key: "topic", label: "Topic", placeholder: "e.g. Multi-step fractions" },
      { key: "duration", label: "Duration", placeholder: "e.g. 40 minutes" },
      { key: "objectives", label: "Learning Objectives", placeholder: "What should students be able to do?" },
      { key: "curriculum", label: "Curriculum (optional)", placeholder: "e.g. Sierra Leone NaCCA" },
      { key: "context", label: "Classroom Context (optional)", placeholder: "e.g. Mixed ability, 35 students" },
    ],
  },
  "sabi-diagnose": {
    label: "Class Diagnostic",
    placeholder: "Ask SABI to adjust or expand the diagnostic...",
    endpoint: "/api/tools/diagnose",
    fields: [
      { key: "grade", label: "Grade / Class", placeholder: "e.g. JSS2" },
      { key: "subject", label: "Subject", placeholder: "e.g. English Language" },
      { key: "topic", label: "Topic or Skill Area", placeholder: "e.g. Reading comprehension" },
      { key: "objectives", label: "What concerns you about this class?", placeholder: "e.g. Students struggle with inference questions" },
      { key: "context", label: "Classroom Context (optional)", placeholder: "e.g. 40 students, mixed ability" },
    ],
  },
  "sabi-unit-series": {
    label: "Unit Series",
    placeholder: "Ask SABI to extend or adjust the unit...",
    endpoint: "/api/tools/unit",
    fields: [
      { key: "grade", label: "Grade / Class", placeholder: "e.g. SS1" },
      { key: "subject", label: "Subject", placeholder: "e.g. Biology" },
      { key: "topic", label: "Unit Topic", placeholder: "e.g. Cell Biology" },
      { key: "duration", label: "Number of Weeks", placeholder: "e.g. 4 weeks" },
      { key: "objectives", label: "Learning Goals", placeholder: "What should students achieve by end of unit?" },
      { key: "curriculum", label: "Curriculum (optional)", placeholder: "e.g. WAEC syllabus" },
    ],
  },
  "sabi-slides": {
    label: "Slide Deck",
    placeholder: "Ask SABI to add a slide or change the tone...",
    endpoint: "/api/tools/slides",
    fields: [
      { key: "grade", label: "Grade / Class", placeholder: "e.g. JSS3" },
      { key: "subject", label: "Subject", placeholder: "e.g. Physics" },
      { key: "topic", label: "Topic", placeholder: "e.g. Newton's Laws of Motion" },
      { key: "duration", label: "Number of Slides", placeholder: "e.g. 8 slides" },
      { key: "objectives", label: "Key Points to Cover", placeholder: "What are the main ideas to get across?" },
      { key: "context", label: "Audience Context (optional)", placeholder: "e.g. Visual learners, beginner level" },
    ],
  },
  "sabi-explain": {
    label: "Concept Explanation",
    placeholder: "Ask SABI to simplify or use a different analogy...",
    endpoint: "/api/tools/explain",
    fields: [
      { key: "grade", label: "Grade / Class", placeholder: "e.g. Primary 6" },
      { key: "subject", label: "Subject", placeholder: "e.g. Science" },
      { key: "topic", label: "Concept to Explain", placeholder: "e.g. Photosynthesis" },
      { key: "objectives", label: "What do students find confusing?", placeholder: "e.g. They don't understand where the energy comes from" },
      { key: "context", label: "Local Context (optional)", placeholder: "e.g. Use examples from farming or markets" },
    ],
  },
  "sabi-project": {
    label: "Project Activity",
    placeholder: "Ask SABI to adapt for different resources...",
    endpoint: "/api/tools/project",
    fields: [
      { key: "grade", label: "Grade / Class", placeholder: "e.g. JSS1" },
      { key: "subject", label: "Subject", placeholder: "e.g. Integrated Science" },
      { key: "topic", label: "Project Theme", placeholder: "e.g. Water purification" },
      { key: "duration", label: "Duration", placeholder: "e.g. 2 weeks" },
      { key: "objectives", label: "Learning Goals", placeholder: "What skills should students develop?" },
      { key: "context", label: "Available Resources (optional)", placeholder: "e.g. Limited lab equipment, outdoor space available" },
    ],
  },
  "sabi-exercise": {
    label: "Exercise Sheet",
    placeholder: "Ask SABI to add more questions or increase difficulty...",
    endpoint: "/api/tools/practice",
    fields: [
      { key: "grade", label: "Grade / Class", placeholder: "e.g. Primary 4" },
      { key: "subject", label: "Subject", placeholder: "e.g. Mathematics" },
      { key: "topic", label: "Topic", placeholder: "e.g. Long division" },
      { key: "duration", label: "Number of Questions", placeholder: "e.g. 15 questions" },
      { key: "objectives", label: "Skills to Practice", placeholder: "e.g. Dividing 3-digit numbers by 1-digit" },
      { key: "context", label: "Difficulty Level (optional)", placeholder: "e.g. Mixed ability — include easy, medium, hard" },
    ],
  },
  "sabi-check": {
    label: "Formative Assessment",
    placeholder: "Ask SABI to adjust difficulty or format...",
    endpoint: "/api/tools/check",
    fields: [
      { key: "grade", label: "Grade / Class", placeholder: "e.g. JSS2" },
      { key: "subject", label: "Subject", placeholder: "e.g. English" },
      { key: "topic", label: "Topic Just Taught", placeholder: "e.g. Narrative tenses" },
      { key: "duration", label: "Format", placeholder: "e.g. 5 exit ticket questions" },
      { key: "objectives", label: "What to Check For", placeholder: "e.g. Can students identify past perfect tense?" },
    ],
  },
  "sabi-grade": {
    label: "Grading Rubric",
    placeholder: "Ask SABI to adjust criteria or scoring...",
    endpoint: "/api/tools/grade",
    fields: [
      { key: "grade", label: "Grade / Class", placeholder: "e.g. SS2" },
      { key: "subject", label: "Subject", placeholder: "e.g. English Literature" },
      { key: "topic", label: "Assessment Task", placeholder: "e.g. Essay on Things Fall Apart" },
      { key: "duration", label: "Total Marks", placeholder: "e.g. 50 marks" },
      { key: "objectives", label: "What Are You Assessing?", placeholder: "e.g. Argument, evidence, language use, structure" },
    ],
  },
  "sabi-feedback": {
    label: "Student Feedback",
    placeholder: "Ask SABI to adjust the tone or add specific comments...",
    endpoint: "/api/tools/feedback",
    fields: [
      { key: "grade", label: "Grade / Class", placeholder: "e.g. Primary 6" },
      { key: "subject", label: "Subject", placeholder: "e.g. Mathematics" },
      { key: "topic", label: "Task or Assignment", placeholder: "e.g. Fraction worksheet" },
      { key: "objectives", label: "What did the student do / struggle with?", placeholder: "e.g. Got most questions right but made sign errors" },
      { key: "context", label: "Tone (optional)", placeholder: "e.g. Encouraging, growth-focused" },
    ],
  },
  "sabi-reflect": {
    label: "Reflection",
    placeholder: "Ask SABI to expand on any area...",
    endpoint: "/api/tools/reflect",
    fields: [
      { key: "grade", label: "Grade / Class", placeholder: "e.g. JSS1" },
      { key: "subject", label: "Subject", placeholder: "e.g. Science" },
      { key: "topic", label: "Lesson or Experience to Reflect On", placeholder: "e.g. Today's lab session on magnetism" },
      { key: "objectives", label: "What went well / what didn't?", placeholder: "e.g. Students were engaged but ran out of time" },
      { key: "context", label: "Focus Area (optional)", placeholder: "e.g. Classroom management, differentiation" },
    ],
  },
  "sabi-craft": {
    label: "Custom Material",
    placeholder: "Describe what you want to create...",
    endpoint: "/api/tools/craft",
    fields: [
      { key: "grade", label: "Grade / Class", placeholder: "e.g. Any" },
      { key: "subject", label: "Subject", placeholder: "e.g. Any" },
      { key: "topic", label: "What do you want to create?", placeholder: "e.g. A fun vocabulary game for JSS1 English" },
      { key: "objectives", label: "Purpose", placeholder: "e.g. Help students remember new words from the unit" },
      { key: "context", label: "Any specific requirements? (optional)", placeholder: "e.g. No internet needed, works in groups" },
    ],
  },
};

const getConfig = (slug: string): ToolConfig => {
  return TOOL_CONFIG[slug] || {
    label: slug.split("-").map((w: string) => w[0].toUpperCase() + w.slice(1)).join(" "),
    placeholder: "Describe what you need...",
    endpoint: "/api/tools/plan",
    fields: [
      { key: "grade", label: "Grade / Class", placeholder: "e.g. Primary 5" },
      { key: "subject", label: "Subject", placeholder: "e.g. Mathematics" },
      { key: "topic", label: "Topic", placeholder: "e.g. Fractions" },
      { key: "objectives", label: "Learning Objectives", placeholder: "What should students learn?" },
    ],
  };
};

type Message = { role: "assistant" | "user"; content: string };

function ToolDetail() {
  const { slug } = Route.useParams();
  const config = getConfig(slug);

  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: `Hi! I'm SABI. Fill in the details below and I'll generate your ${config.label} instantly.` },
  ]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [followUp, setFollowUp] = useState("");
  const [showForm, setShowForm] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleGenerate = async () => {
    const required = config.fields.filter(f => !f.label.includes("optional"));
    const hasRequired = required.every(f => form[f.key]?.trim());

    if (!hasRequired) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Please fill in all required fields before generating.",
      }]);
      return;
    }

    setLoading(true);
    setShowForm(false);

    const userMessage = config.fields
      .filter(f => form[f.key])
      .map(f => `${f.label}: ${form[f.key]}`)
      .join("\n");

    setMessages(prev => [
      ...prev,
      { role: "user", content: userMessage },
      { role: "assistant", content: `Generating your ${config.label}...` },
    ]);

    try {
      const res = await fetch(`http://127.0.0.1:8000${config.endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade: form.grade || "",
          subject: form.subject || "",
          topic: form.topic || "",
          duration: form.duration || "45 minutes",
          objectives: form.objectives || "",
          curriculum: form.curriculum || "",
          context: form.context || "",
        }),
      });

      const data = await res.json();
      setOutput(data.output);
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: "assistant", content: `Your ${config.label} is ready! Check the preview on the right. What would you like to refine?` },
      ]);
    } catch {
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: "assistant", content: "Something went wrong. Make sure the backend is running on port 8000." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUp = async () => {
    if (!followUp.trim() || !output) return;
    const question = followUp;
    setFollowUp("");
    setLoading(true);
    setMessages(prev => [...prev, { role: "user", content: question }]);

    try {
      const res = await fetch(`http://127.0.0.1:8000${config.endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade: form.grade || "",
          subject: form.subject || "",
          topic: form.topic || "",
          duration: form.duration || "45 minutes",
          objectives: `Previous output:\n${output}\n\nTeacher request: ${question}`,
          curriculum: form.curriculum || "",
          context: form.context || "",
        }),
      });
      const data = await res.json();
      setOutput(data.output);
      setMessages(prev => [...prev, { role: "assistant", content: "Updated! Check the preview on the right." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-6 lg:py-8 max-w-7xl mx-auto">
        <Link
          to="/tools"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="size-4" /> All tools
        </Link>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left — chat + form */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl flex flex-col h-[70vh] lg:h-[calc(100vh-10rem)] overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center gap-3">
              <div className="size-9 rounded-lg bg-gradient-to-br from-primary to-[oklch(0.4_0.25_300)] grid place-items-center text-primary-foreground">
                <Sparkles className="size-4" />
              </div>
              <div>
                <h2 className="font-semibold tracking-tight leading-none">{config.label}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Powered by SABI AI</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "assistant"
                      ? "bg-muted rounded-tl-sm"
                      : "ml-auto bg-primary text-primary-foreground rounded-tr-sm"
                  }`}
                >
                  {msg.content}
                </div>
              ))}

              {showForm && (
                <div className="bg-muted/50 rounded-2xl p-4 space-y-3">
                  {config.fields.map(field => (
                    <div key={field.key}>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        value={form[field.key] || ""}
                        onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                        className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  ))}
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground rounded-xl py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Generating..." : `Generate ${config.label}`}
                  </button>
                </div>
              )}

              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="text-xs text-primary hover:underline"
                >
                  ← Edit inputs
                </button>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-border">
              <div className="flex items-end gap-2 bg-muted rounded-2xl p-2">
                <textarea
                  placeholder={output ? config.placeholder : "Fill in the form above to get started..."}
                  rows={1}
                  value={followUp}
                  disabled={!output || loading}
                  onChange={e => setFollowUp(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleFollowUp();
                    }
                  }}
                  className="flex-1 bg-transparent text-sm focus:outline-none resize-none py-2 disabled:opacity-40"
                />
                <button
                  onClick={handleFollowUp}
                  disabled={loading || !output || !followUp.trim()}
                  className="size-9 rounded-xl bg-primary text-primary-foreground grid place-items-center hover:bg-primary/90 transition-colors shrink-0 disabled:opacity-40"
                >
                  <Send className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right — output preview */}
          <div className="lg:col-span-3 bg-card border border-border rounded-2xl overflow-hidden flex flex-col h-[70vh] lg:h-[calc(100vh-10rem)]">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between bg-muted/30 shrink-0">
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Preview · {config.label}
              </p>
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                disabled={!output}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary px-3 py-1.5 rounded-lg hover:bg-primary-soft transition-colors disabled:opacity-40"
              >
                <Download className="size-4" /> Copy
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 lg:p-10">
              {!output && !loading && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Sparkles className="size-10 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground text-sm">
                    Fill in the form and click Generate to see your {config.label} here.
                  </p>
                </div>
              )}
              {loading && (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4" />
                  <p className="text-muted-foreground text-sm">
                    SABI is generating your {config.label}...
                  </p>
                </div>
              )}
              {output && !loading && (
  <div className="max-w-[65ch] mx-auto prose prose-sm prose-neutral dark:prose-invert">
    <ReactMarkdown>{output}</ReactMarkdown>
  </div>
)}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}