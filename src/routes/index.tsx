import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Mic, ClipboardList, Lock, User, Check, MessageSquareWarning, Send, Info } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NoTrap.co — Shared agreements for providers and clients" },
      { name: "description", content: "One shared record of documentation, voice notes and scope of work between a service provider and their client." },
      { property: "og:title", content: "NoTrap.co — Shared agreements, no surprises" },
      { property: "og:description", content: "Providers propose, clients approve. Both sides see the same record." },
    ],
  }),
  component: Index,
});

type Role = "provider" | "client";
type Status = "Pending approval" | "Approved" | "Changes requested" | "Saved";
type Rec = { id: number; kind: "Documentation" | "Scope of Work" | "Voice Record"; title: string; by: Role; status: Status };

const initial: Rec[] = [
  { id: 1, kind: "Documentation", title: "Kitchen renovation — material list", by: "provider", status: "Pending approval" },
  { id: 2, kind: "Scope of Work", title: "Phase 1: demolition & plumbing", by: "provider", status: "Approved" },
  { id: 3, kind: "Voice Record", title: "Call notes — budget discussion", by: "client", status: "Saved" },
];

const kinds = [
  { k: "Documentation", icon: FileText, rule: "Sent by provider · Client approves" },
  { k: "Voice Records", icon: Mic, rule: "Saved by either party · No approval" },
  { k: "Scope of Work", icon: ClipboardList, rule: "Sent by provider · Client approves" },
] as const;

function Proto({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-foreground/40 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{children}</span>;
}

function StatusBadge({ s }: { s: Status }) {
  const c = s === "Approved" ? "bg-success/15 text-success" : s === "Pending approval" ? "bg-warning/20 text-foreground" : s === "Changes requested" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground";
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${c}`}>{s}</span>;
}

function Index() {
  const [role, setRole] = useState<Role>("provider");
  const [recs, setRecs] = useState<Rec[]>(initial);
  const [note, setNote] = useState<string | null>(null);

  const add = (kind: Rec["kind"]) => {
    const isVoice = kind === "Voice Record";
    setRecs((r) => [{ id: Date.now(), kind, title: isVoice ? "Example voice record (not recorded)" : `New ${kind.toLowerCase()} (example)`, by: role, status: isVoice ? "Saved" : "Pending approval" }, ...r]);
  };
  const setStatus = (id: number, status: Status) => setRecs((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
  const start = () => document.getElementById("preview")?.scrollIntoView({ behavior: "smooth" });
  const tone = role === "provider" ? "bg-provider" : "bg-client";

  return (
    <div className="min-h-screen font-sans">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="/" className="font-display text-xl font-extrabold">NoTrap<span className="text-client">.co</span></a>
          <button onClick={() => setNote("Sign-in isn't built yet — this is a prototype.")} className="inline-flex items-center gap-2 rounded-full border border-foreground px-4 py-2 text-sm font-bold hover:bg-foreground hover:text-background">
            <User className="h-4 w-4" aria-hidden /> Profile / Log in
          </button>
        </div>
        {note && <div role="status" className="bg-warning/25 px-4 py-2 text-center text-sm">{note} <button className="ml-2 underline" onClick={() => setNote(null)}>Dismiss</button></div>}
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 pt-14 pb-10 text-center">
          <Proto>Prototype preview</Proto>
          <h1 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-extrabold leading-tight sm:text-6xl">One agreement. Two sides. <span className="text-provider">No</span> <span className="text-client">traps.</span></h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Providers propose, clients approve, and both see exactly the same record.</p>
          <button onClick={start} className="mt-8 rounded-full bg-foreground px-8 py-4 text-lg font-bold text-background shadow-lg hover:scale-105 transition">Start an agreement</button>
        </section>

        <section aria-label="How it works" className="mx-auto grid max-w-6xl gap-4 px-4 pb-16 md:grid-cols-[1fr_1.4fr_1fr] md:items-stretch">
          <div className="rounded-2xl bg-provider p-6 text-background">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80">Left side</p>
            <h2 className="font-display text-2xl font-extrabold">Service Provider</h2>
            <ul className="mt-4 space-y-2 text-sm"><li>→ Send Documentation for approval</li><li>→ Send Scope of Work for approval</li><li>→ Save Voice Records</li></ul>
          </div>
          <div className="grid gap-3">
            {kinds.map(({ k, icon: I, rule }) => (
              <div key={k} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
                <I className="h-6 w-6 shrink-0" aria-hidden />
                <div className="min-w-0"><p className="font-bold">{k}</p><p className="text-xs text-muted-foreground">{rule}</p></div>
              </div>
            ))}
            <p className="text-center text-xs text-muted-foreground">Shared records — both sides see the same items</p>
          </div>
          <div className="rounded-2xl bg-client p-6 text-foreground">
            <p className="text-xs font-bold uppercase tracking-widest opacity-70">Right side</p>
            <h2 className="font-display text-2xl font-extrabold">Client</h2>
            <ul className="mt-4 space-y-2 text-sm"><li>← Approve or request changes to Documentation</li><li>← Approve or request changes to Scope of Work</li><li>← Save Voice Records</li></ul>
          </div>
        </section>

        <section id="preview" className="border-y border-border bg-muted/60 py-16">
          <div className="mx-auto max-w-4xl px-4">
            <div className="flex flex-wrap items-center gap-3"><h2 className="font-display text-3xl font-extrabold">Try it: onboarding preview</h2><Proto>Demo data · resets on reload</Proto></div>
            <p className="mt-2 text-sm text-muted-foreground">Choose a side to explore its actions. Nothing is saved, sent, or recorded.</p>

            <div role="radiogroup" aria-label="Choose your role" className="mt-6 grid grid-cols-2 gap-2 rounded-full bg-card p-1.5 border border-border">
              {(["provider", "client"] as Role[]).map((r) => (
                <button key={r} role="radio" aria-checked={role === r} onClick={() => setRole(r)}
                  className={`rounded-full py-3 font-bold transition ${role === r ? (r === "provider" ? "bg-provider text-background" : "bg-client text-foreground") : "text-muted-foreground hover:bg-muted"}`}>
                  {r === "provider" ? "Service Provider" : "Client"}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold">Agreement: Kitchen renovation</h3>
                <span className="text-xs text-muted-foreground">Viewing as <b>{role === "provider" ? "Service Provider" : "Client"}</b></span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {role === "provider" && <>
                  <button onClick={() => add("Documentation")} className={`inline-flex items-center gap-2 rounded-lg ${tone} px-4 py-2 text-sm font-bold text-background`}><Send className="h-4 w-4" aria-hidden />Send Documentation</button>
                  <button onClick={() => add("Scope of Work")} className={`inline-flex items-center gap-2 rounded-lg ${tone} px-4 py-2 text-sm font-bold text-background`}><Send className="h-4 w-4" aria-hidden />Send Scope of Work</button>
                </>}
                <button onClick={() => add("Voice Record")} className="inline-flex items-center gap-2 rounded-lg border border-foreground px-4 py-2 text-sm font-bold"><Mic className="h-4 w-4" aria-hidden />Save Voice Record <span className="text-xs font-normal">(simulated)</span></button>
              </div>
              {role === "client" && <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><Info className="h-4 w-4" aria-hidden />Only the provider can submit Documentation and Scope of Work. You approve or request changes.</p>}

              <ul className="mt-5 divide-y divide-border">
                {recs.map((r) => {
                  const canReview = role === "client" && r.kind !== "Voice Record" && r.status === "Pending approval";
                  return (
                    <li key={r.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{r.kind}</p>
                        <p className="truncate font-medium">{r.title}</p>
                        <span className={`mt-1 inline-block rounded px-1.5 text-[11px] font-bold ${r.by === "provider" ? "bg-provider-soft text-provider" : "bg-client-soft text-foreground"}`}>Added by {r.by === "provider" ? "Service Provider" : "Client"}</span>
                      </div>
                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                        <StatusBadge s={r.status} />
                        {canReview && <>
                          <button onClick={() => setStatus(r.id, "Approved")} className="inline-flex items-center gap-1 rounded-lg bg-success px-3 py-1 text-xs font-bold text-background"><Check className="h-3 w-3" aria-hidden />Approve</button>
                          <button onClick={() => setStatus(r.id, "Changes requested")} className="inline-flex items-center gap-1 rounded-lg border border-destructive px-3 py-1 text-xs font-bold text-destructive"><MessageSquareWarning className="h-3 w-3" aria-hidden />Request changes</button>
                        </>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-16">
          <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6">
            <Lock className="mt-1 h-6 w-6 shrink-0" aria-hidden />
            <div>
              <h2 className="font-display text-2xl font-extrabold">Privacy is the point</h2>
              <p className="mt-2 text-muted-foreground">Our goal: only the client and the service provider can access their shared records — not even NoTrap.co.</p>
              <p className="mt-3 text-sm font-bold">Honest status: this is a front-end prototype. Encryption, accounts, storage and voice recording are <u>not yet built</u>.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-6 text-sm">
          <span className="font-display font-extrabold">NoTrap.co</span>
          <nav aria-label="Footer" className="flex gap-5 text-muted-foreground">
            {["Privacy", "Terms", "Contact"].map((l) => <span key={l} aria-disabled="true">{l} <span className="text-[10px] uppercase">(placeholder)</span></span>)}
          </nav>
        </div>
      </footer>
    </div>
  );
}
