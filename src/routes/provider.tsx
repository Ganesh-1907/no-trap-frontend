import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, Mic, ClipboardList, Upload, Send, Hourglass, CheckCircle2 } from "lucide-react";
import { SiteShell, RequestId, StatusBadge, Proto } from "@/components/site";
import { newRequestId, saveAgreement, updateAgreement, useAgreement, uid, type Section } from "@/lib/demo-store";

export const Route = createFileRoute("/provider")({
  validateSearch: (s: Record<string, unknown>) => ({ id: typeof s.id === "string" ? s.id : undefined }),
  head: () => ({
    meta: [
      { title: "Provider setup — NoTrap.co" },
      { name: "description", content: "Set up an agreement request with documentation, voice records and scope of work." },
      { property: "og:title", content: "Provider setup — NoTrap.co" },
      { property: "og:description", content: "Create a Request ID and send your agreement to the client." },
    ],
  }),
  component: Provider,
});

const sections: { s: Section; icon: typeof FileText; accept: string; hint: string }[] = [
  { s: "Documentation", icon: FileText, accept: ".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt", hint: "Needs client approval" },
  { s: "Voice Records", icon: Mic, accept: "audio/*", hint: "Saved for both sides · no approval" },
  { s: "Scope of Work", icon: ClipboardList, accept: ".pdf,.doc,.docx,.txt", hint: "Needs client approval" },
];

function Provider() {
  const { id: searchId } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!searchId) {
      const id = newRequestId();
      saveAgreement({ id, title: "Untitled agreement", status: "Draft", items: [], createdAt: Date.now() });
      navigate({ search: { id }, replace: true });
    }
  }, [searchId, navigate]);

  const { agreement: a } = useAgreement(searchId);
  useEffect(() => { if (a && !title) setTitle(a.title === "Untitled agreement" ? "" : a.title); }, [a]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!a) return <SiteShell><p className="p-10 text-center text-muted-foreground">Preparing request…</p></SiteShell>;
  const locked = a.status !== "Draft";

  const addFiles = (section: Section, files: FileList | null) => {
    if (!files?.length) return;
    updateAgreement(a.id, (x) => ({ ...x, items: [...x.items, ...Array.from(files).map((f) => ({ id: uid(), section, name: f.name, by: "provider" as const, status: section === "Voice Records" ? "Saved" as const : "Draft" as const }))] }));
  };
  const send = () => updateAgreement(a.id, (x) => ({ ...x, title: title.trim() || "Untitled agreement", status: "Waiting for client", items: x.items.map((i) => (i.status === "Draft" ? { ...i, status: "Awaiting review" } : i)) }));

  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex flex-wrap items-center gap-3"><h1 className="font-display text-3xl font-extrabold">Agreement setup</h1><Proto>Demo only</Proto></div>
        <p className="mt-1 text-sm text-muted-foreground">Share this Request ID with your client so they can find and accept the request.</p>
        <div className="mt-5"><RequestId id={a.id} /></div>

        {a.status === "Waiting for client" && <Banner icon={Hourglass} tone="bg-warning/20">Request sent (simulated). Waiting for the client to open <b>{a.id}</b> and accept.</Banner>}
        {a.status === "Accepted" && <Banner icon={Hourglass} tone="bg-provider-soft">The client accepted the request and is reviewing it.</Banner>}
        {a.status === "Approved" && <Banner icon={CheckCircle2} tone="bg-success/15 text-success">The client approved this agreement.</Banner>}

        <label className="mt-6 block text-sm font-bold" htmlFor="title">Agreement title</label>
        <input id="title" disabled={locked} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Kitchen renovation" className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 disabled:opacity-60" />

        <div className="mt-6 grid gap-4">
          {sections.map(({ s, icon: I, accept, hint }) => {
            const items = a.items.filter((i) => i.section === s);
            const canAdd = !locked || s === "Voice Records";
            return (
              <div key={s} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2"><I className="h-5 w-5 shrink-0" aria-hidden /><h2 className="font-bold">{s}</h2><span className="text-xs text-muted-foreground">· {hint}</span></div>
                  {canAdd && (
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-provider px-3 py-1.5 text-sm font-bold text-background focus-within:ring-2 focus-within:ring-ring">
                      <Upload className="h-4 w-4" aria-hidden />Add files
                      <input type="file" multiple accept={accept} className="sr-only" onChange={(e) => { addFiles(s, e.target.files); e.target.value = ""; }} />
                    </label>
                  )}
                </div>
                {items.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No files yet.</p> : (
                  <ul className="mt-3 divide-y divide-border">
                    {items.map((i) => (
                      <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                        <div className="min-w-0"><p className="truncate text-sm font-medium">{i.name}</p><p className="text-[11px] text-muted-foreground">Added by {i.by === "provider" ? "Service Provider" : "Client"}</p></div>
                        <StatusBadge s={i.status} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Only file names are kept, in this browser. Files are not uploaded anywhere.</p>

        <div className="mt-6 flex flex-wrap gap-3">
          {!locked && <button onClick={send} disabled={a.items.length === 0} className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 font-bold text-background disabled:opacity-40"><Send className="h-4 w-4" aria-hidden />Send Request to Client</button>}
          {locked && <Link to="/agreement/$id" params={{ id: a.id }} search={{ as: "provider" }} className="rounded-full border border-foreground px-6 py-3 font-bold">Open agreement review</Link>}
          <Link to="/provider" search={{ id: undefined }} className="rounded-full px-6 py-3 font-bold text-muted-foreground underline">Start a new request</Link>
        </div>
      </section>
    </SiteShell>
  );
}

function Banner({ icon: I, tone, children }: { icon: typeof Hourglass; tone: string; children: React.ReactNode }) {
  return <div role="status" className={`mt-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${tone}`}><I className="h-5 w-5 shrink-0" aria-hidden /><span>{children}</span></div>;
}
