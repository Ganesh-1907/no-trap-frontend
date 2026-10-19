import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Copy, Check, Home, PlayCircle, Briefcase, UserCheck, Sparkles } from "lucide-react";
import type { ItemStatus, AgStatus } from "@/lib/agreements";
import { AuthMenu } from "@/components/auth-menu";

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
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-foreground bg-card p-4 shadow-xs">
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Request ID</p>
        <p className="font-mono text-2xl font-black tracking-wider sm:text-3xl" aria-live="polite">{id}</p>
      </div>
      <button
        onClick={copy}
        className="ml-auto inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-xs font-black text-background transition hover:opacity-90 shadow-sm"
      >
        {copied ? <Check className="h-4 w-4 text-success" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
        {copied ? "Copied ID" : "Copy ID"}
      </button>
    </div>
  );
}

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/start", label: "Start", icon: PlayCircle },
  { to: "/provider", label: "Provider", icon: Briefcase },
  { to: "/client", label: "Client", icon: UserCheck },
] as const;

/** Bottom tab bar shown on phones (and in the Capacitor app). */
export function MobileNav() {
  return (
    <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-50 flex sm:hidden items-center justify-around border-t border-border bg-background/95 backdrop-blur px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      >
        {nav.map((n) => {
          const Icon = n.icon;
          return (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: true }}
              className="flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-bold text-muted-foreground transition hover:text-foreground"
              activeProps={{ className: "!text-foreground !font-black !scale-105" }}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>{n.label}</span>
            </Link>
          );
        })}
      </nav>
  );
}

/** Logo, main links and the profile menu. Shared by the app shell and the home page so they always match. */
export function HeaderBar() {
  return (
    <div className="mx-auto flex w-full max-w-[1580px] items-center gap-3 px-4 py-3 sm:px-8 lg:px-10 2xl:max-w-[1640px]">
      <Link to="/" className="shrink-0 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
        NoTrap<span className="text-client">.co</span>
      </Link>
      <nav aria-label="Main" className="hidden flex-1 justify-center gap-1 text-sm sm:flex">
        {nav.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            activeOptions={{ exact: true }}
            className="rounded-full px-4 py-2 text-sm font-bold text-muted-foreground transition hover:bg-muted"
            activeProps={{ className: "bg-foreground !text-background shadow-xs" }}
          >
            {n.label}
          </Link>
        ))}
      </nav>
      <div className="ml-auto shrink-0">
        <AuthMenu />
      </div>
    </div>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col font-sans">
      <header className="safe-top sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <HeaderBar />
      </header>

      <main className="flex-1 pb-20 sm:pb-8">{children}</main>

      <MobileNav />

      <footer className="border-t border-border bg-card/40">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-6 text-sm">
          <span className="font-display font-extrabold text-foreground">NoTrap.co</span>
          <nav aria-label="Footer" className="flex gap-5 text-xs text-muted-foreground">
            <span>Clear scope</span>
            <span>·</span>
            <span>Approved changes</span>
            <span>·</span>
            <span>Better relationships</span>
          </nav>
        </div>
      </footer>
    </div>
  );
}

/** Shown on pages that need a signed-in user of a given role. */
export function AuthRequired(_props: { role?: "provider" | "client" }) {
  return (
    <SiteShell>
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="font-display text-2xl font-black text-foreground">
          Sign in to continue
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Agreements and their files are stored securely on your account, so you need to be signed in.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/auth/signin" className="rounded-xl bg-foreground px-5 py-2.5 text-xs font-bold text-background">Sign in</Link>
          <Link to="/auth/signup" className="rounded-xl border border-border bg-card px-5 py-2.5 text-xs font-bold text-foreground">Create account</Link>
        </div>
      </div>
    </SiteShell>
  );
}
