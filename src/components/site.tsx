import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Copy, Check } from "lucide-react";
import type { ItemStatus, AgStatus } from "@/lib/demo-store";

export function Proto({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-foreground/40 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{children}</span>;
}

export function StatusBadge({ s }: { s: ItemStatus | AgStatus }) {
  const c = s === "Approved" ? "bg-success/15 text-success"
    : s === "Awaiting review" || s === "Waiting for client" ? "bg-warning/20 text-foreground"
    : s === "Needs changes" ? "bg-destructive/10 text-destructive"
    : s === "Accepted" ? "bg-provider-soft text-provider"
    : "bg-muted text-muted-foreground";
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${c}`}>{s}</span>;
}

export function RequestId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(id); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* ignore */ }
  };
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-foreground bg-card p-4">
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Request ID</p>
        <p className="font-mono text-2xl font-bold tracking-wider sm:text-3xl" aria-live="polite">{id}</p>
      </div>
      <button onClick={copy} className="ml-auto inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-bold text-background">
        {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}{copied ? "Copied" : "Copy ID"}
      </button>
    </div>
  );
}

const nav = [
  { to: "/", label: "Home" },
  { to: "/start", label: "Start" },
  { to: "/provider", label: "Provider" },
  { to: "/client", label: "Client" },
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
          <Link to="/" className="font-display text-xl font-extrabold">NoTrap<span className="text-client">.co</span></Link>
          <nav aria-label="Main" className="flex gap-1 text-sm">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} activeOptions={{ exact: true }} className="rounded-full px-3 py-1.5 font-bold text-muted-foreground hover:bg-muted" activeProps={{ className: "bg-foreground !text-background" }}>{n.label}</Link>
            ))}
          </nav>
        </div>
        <div className="bg-warning/25 px-4 py-1.5 text-center text-xs">Demo prototype — data stays in this browser only. Nothing is uploaded, sent, recorded or encrypted.</div>
      </header>
      <main className="flex-1">{children}</main>
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
