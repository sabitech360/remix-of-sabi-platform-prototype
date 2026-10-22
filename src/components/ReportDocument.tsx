import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import { useUser } from "@clerk/clerk-react";
import { Download } from "lucide-react";

/** A4 at 96dpi, minus 14mm print margins top and bottom. */
const PAGE_HEIGHT_PX = 1123 - 106;
const MAX_PAGES = 2;

type Props = {
  toolLabel: string;
  markdown: string;
  details?: { label: string; value: string }[];
};

function ReportBody({ toolLabel, markdown, details = [] }: Props) {
  const { user } = useUser();
  const name = user?.fullName || user?.firstName || "SABI Teacher";
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="sabi-report">
      <header className="sabi-report-head">
        <div>
          <p className="sabi-report-brand">SABI</p>
          <h1 className="sabi-report-title">{toolLabel}</h1>
        </div>
        <div className="sabi-report-teacher">
          <p className="sabi-report-name">{name}</p>
          {email && <p>{email}</p>}
          <p>{date}</p>
        </div>
      </header>

      {details.length > 0 && (
        <dl className="sabi-report-meta">
          {details.map((d) => (
            <div key={d.label}>
              <dt>{d.label}</dt>
              <dd>{d.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="sabi-report-content">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>

      <footer className="sabi-report-foot">
        Prepared with SABI for {name}. Review and adapt to your learners before use.
      </footer>
    </div>
  );
}

export function ReportDocument(props: Props) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Measure at A4 width so the page count matches the printed PDF.
  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    setPages(Math.max(1, Math.ceil(el.scrollHeight / PAGE_HEIGHT_PX)));
  }, [props.markdown, props.toolLabel, mounted]);

  const fits = pages <= MAX_PAGES;

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4 print:hidden">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            fits ? "bg-primary-soft text-primary" : "bg-destructive/10 text-destructive"
          }`}
        >
          {fits
            ? `${pages} of ${MAX_PAGES} pages`
            : `${pages} pages - ask SABI to shorten it to ${MAX_PAGES}`}
        </span>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 text-sm font-semibold bg-primary text-primary-foreground px-3.5 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Download className="size-4" /> Download PDF
        </button>
      </div>

      {/* On-screen paper preview */}
      <div className="sabi-paper print:hidden">
        <ReportBody {...props} />
      </div>

      {/* Off-screen A4-width copy used for page measuring */}
      <div ref={measureRef} aria-hidden className="sabi-measure print:hidden">
        <ReportBody {...props} />
      </div>

      {/* Print-only copy, portaled to <body> so the PDF contains only the report */}
      {mounted &&
        createPortal(
          <div id="sabi-print-root">
            <ReportBody {...props} />
          </div>,
          document.body,
        )}
    </div>
  );
}