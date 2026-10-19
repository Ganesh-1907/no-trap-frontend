import { Link, useNavigate, type LinkProps } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, Check, Loader2, Search, ShieldCheck } from "lucide-react";
import { SiteShell } from "@/components/site";
import { rememberSide } from "@/components/auth-menu";
import type { Agreement, Party } from "@/lib/agreements";

/** Where an agreement is in the review cycle, and whose turn it is. */
export type Phase = {
  label: string;
  /** Who has to act next (null = nobody: finished or cancelled). */
  waitingOn: Party | null;
  tone: "neutral" | "warn" | "danger" | "good" | "info";
};

export function phaseOf(a: Agreement): Phase {
  switch (a.status) {
    case "Draft":
      return { label: "Draft", waitingOn: "provider", tone: "neutral" };
    case "Waiting for client":
      return { label: "Awaiting client acceptance", waitingOn: "client", tone: "warn" };
    case "Approved":
      return { label: "Approved by both", waitingOn: null, tone: "good" };
    case "Cancelled":
      return { label: "Cancelled", waitingOn: null, tone: "neutral" };
    case "Accepted":
      if (a.clientApprovedAt)
        return { label: "Ready to countersign", waitingOn: "provider", tone: "info" };
      if (a.changesCount > 0)
        return { label: "Changes requested", waitingOn: "provider", tone: "danger" };
      if (a.pendingCount > 0)
        return { label: "Client reviewing", waitingOn: "client", tone: "warn" };
      return { label: "Awaiting client sign-off", waitingOn: "client", tone: "warn" };
  }
}

const toneClass: Record<Phase["tone"], string> = {
  neutral: "bg-muted text-muted-foreground",
  warn: "bg-warning/20 text-foreground",
  danger: "bg-destructive/10 text-destructive",
  good: "bg-success/15 text-success",
  info: "bg-provider-soft text-provider",
};

export function PhaseBadge({ a }: { a: Agreement }) {
  const p = phaseOf(a);
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${toneClass[p.tone]}`}>
      {p.label}
    </span>
  );
}

const accent = {
  provider: {
    solid: "bg-provider text-background",
    soft: "bg-provider-soft text-provider",
    text: "text-provider",
  },
  client: {
    solid: "bg-client text-background",
    soft: "bg-client-soft text-client",
    text: "text-client",
  },
} as const;

export const sideLabel = (s: Party) => (s === "provider" ? "Service provider" : "Client");
export const otherSide = (s: Party): Party => (s === "provider" ? "client" : "provider");

/* ───────────────────────────── Dashboard (same layout for both roles) ───────────────────────────── */

function StatTile({ label, value, tone }: { label: string; value: number; tone?: "alert" }) {
  return (
    <div
      className={`rounded-2xl border p-4 ${tone === "alert" && value > 0 ? "border-warning/50 bg-warning/10" : "border-border bg-card"}`}
    >
      <b className="block font-display text-3xl font-black text-foreground">{value}</b>
      <span className="mt-0.5 block text-xs font-semibold text-muted-foreground">{label}</span>
    </div>
  );
}

export function AgreementList({
  side,
  agreements,
  emptyTitle,
  emptyHint,
}: {
  side: Party;
  agreements: Agreement[];
  emptyTitle: string;
  emptyHint: ReactNode;
}) {
  if (agreements.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-card/60 p-8 text-center">
        <p className="font-display text-lg font-black text-foreground">{emptyTitle}</p>
        <p className="mt-1 text-sm text-muted-foreground">{emptyHint}</p>
      </div>
    );
  }
  return (
    <ul className="space-y-3">
      {agreements.map((a) => {
        const p = phaseOf(a);
        const mine = p.waitingOn === side;
        const other = side === "provider" ? a.clientName : a.providerName;
        return (
          <li key={a.id}>
            <Link
              to="/agreement/$id"
              params={{ id: a.id }}
              className={`group flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4 transition hover:border-foreground hover:shadow-sm ${mine ? "border-warning/60" : "border-border"}`}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-muted-foreground">{a.id}</span>
                  <PhaseBadge a={a} />
                  {mine && (
                    <span className="rounded-full bg-foreground px-2 py-0.5 text-[11px] font-black uppercase tracking-wide text-background">
                      Your turn
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate font-display text-base font-black text-foreground">
                  {a.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {side === "provider" ? "Client" : "Provider"}: {other} · {a.itemCount}{" "}
                  {a.itemCount === 1 ? "item" : "items"}
                </p>
              </div>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground"
                aria-hidden
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** "Open by Request ID" box, identical on both dashboards. */
function FindById({ side }: { side: Party }) {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const v = id.trim().toUpperCase();
        if (v) void navigate({ to: "/agreement/$id", params: { id: v } });
      }}
      className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-3 sm:flex-row sm:items-center"
    >
      <label
        htmlFor={`rid-${side}`}
        className="shrink-0 text-xs font-bold uppercase tracking-wider text-foreground"
      >
        Open by Request ID
      </label>
      <input
        id={`rid-${side}`}
        value={id}
        onChange={(e) => setId(e.target.value.toUpperCase())}
        placeholder="NT-XXXX-XXXX"
        className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 font-mono text-sm font-bold uppercase tracking-wider outline-none focus:border-foreground"
      />
      <button
        type="submit"
        className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black ${accent[side].solid}`}
      >
        <Search className="h-3.5 w-3.5" aria-hidden /> Open
      </button>
    </form>
  );
}

/** One dashboard layout shared by /provider and /client so both roles feel identical. */
export function DashboardPage({
  side,
  title,
  subtitle,
  actions,
  agreements,
  loading,
  error,
  emptyTitle,
  emptyHint,
  aside,
}: {
  side: Party;
  title: string;
  subtitle: string;
  actions: ReactNode;
  agreements: Agreement[];
  loading: boolean;
  error: string | null;
  emptyTitle: string;
  emptyHint: ReactNode;
  aside: ReactNode;
}) {
  useEffect(() => rememberSide(side), [side]);
  const mine = agreements.filter((a) => phaseOf(a).waitingOn === side).length;
  const theirs = agreements.filter((a) => {
    const w = phaseOf(a).waitingOn;
    return w !== null && w !== side;
  }).length;
  const done = agreements.filter((a) => a.status === "Approved").length;

  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${accent[side].soft}`}
            >
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              {sideLabel(side)} dashboard
            </span>
            <h1 className="mt-2 font-display text-2xl font-black text-foreground sm:text-4xl">
              {title}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground sm:text-base">{subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {actions}
            <ActionLink to={side === "provider" ? "/client" : "/provider"} side={otherSide(side)}>
              Switch to {otherSide(side)} view
            </ActionLink>
          </div>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-12">
          <div className="min-w-0 space-y-5 lg:col-span-8">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatTile label="All agreements" value={agreements.length} />
              <StatTile label="Needs your action" value={mine} tone="alert" />
              <StatTile label={`Waiting on ${otherSide(side)}`} value={theirs} />
              <StatTile label="Approved by both" value={done} />
            </div>

            <FindById side={side} />

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-sm font-semibold text-destructive"
              >
                {error}
              </div>
            )}
            {loading ? (
              <div className="flex items-center justify-center gap-2 rounded-3xl border border-border bg-card p-10 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading agreements…
              </div>
            ) : (
              <AgreementList
                side={side}
                agreements={agreements}
                emptyTitle={emptyTitle}
                emptyHint={emptyHint}
              />
            )}
          </div>

          <div className="min-w-0 lg:col-span-4">{aside}</div>
        </div>
      </section>
    </SiteShell>
  );
}

/** Right-hand illustration + three value points, same structure for both roles. */
export function AsideCard({
  side,
  image,
  badge,
  heading,
  blurb,
  points,
}: {
  side: Party;
  image: string;
  badge: string;
  heading: string;
  blurb: string;
  points: { title: string; text: string }[];
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-xs sm:p-7">
      <div
        className={`mx-auto mb-4 flex h-36 w-36 items-center justify-center rounded-3xl p-2 ${side === "provider" ? "bg-provider-soft/60" : "bg-client-soft/50"}`}
      >
        <img src={image} alt="" className="h-32 w-auto object-contain drop-shadow-sm" />
      </div>
      <div className="text-center">
        <span
          className={`inline-block rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider ${accent[side].soft}`}
        >
          {badge}
        </span>
        <h3 className="mt-2 font-display text-xl font-black text-foreground">{heading}</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">{blurb}</p>
      </div>
      <div className="mt-6 space-y-3.5 border-t border-border/60 pt-5">
        {points.map((p, i) => (
          <div key={p.title} className="flex items-start gap-3">
            <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${accent[side].soft}`}
            >
              {i + 1}
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">{p.title}</h4>
              <p className="mt-0.5 text-[11px] leading-normal text-muted-foreground">{p.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Small action button used on every dashboard header (primary = filled). */
export function ActionLink({
  to,
  primary,
  side,
  children,
}: {
  to: NonNullable<LinkProps["to"]>;
  primary?: boolean;
  side: Party;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-black transition ${
        primary
          ? `${accent[side].solid} shadow-sm hover:opacity-90`
          : "border border-border bg-card text-foreground hover:border-foreground"
      }`}
    >
      {children}
    </Link>
  );
}

/* ───────────────────────────── Agreement workspace pieces ───────────────────────────── */

const STEPS = ["Drafted", "Sent", "Accepted", "Client approved", "Provider signed"] as const;

function stepIndex(a: Agreement): number {
  if (a.status === "Approved") return 5;
  if (a.clientApprovedAt) return 4;
  if (a.status === "Accepted") return 3;
  if (a.status === "Waiting for client") return 2;
  return 1;
}

/** Horizontal progress through the shared review cycle. */
export function Stepper({ a }: { a: Agreement }) {
  const done = stepIndex(a);
  return (
    <ol className="mt-4 grid grid-cols-5 gap-1.5" aria-label="Agreement progress">
      {STEPS.map((label, i) => {
        const complete = i < done;
        const current = i === done;
        return (
          <li key={label} className="min-w-0">
            <div
              className={`h-1.5 rounded-full ${complete ? "bg-success" : current ? "bg-warning" : "bg-border"}`}
            />
            <p
              className={`mt-1.5 flex items-center gap-1 truncate text-[11px] font-bold uppercase tracking-wide ${complete ? "text-success" : current ? "text-foreground" : "text-muted-foreground"}`}
            >
              {complete && <Check className="h-3 w-3 shrink-0" aria-hidden />}
              <span className="truncate">{label}</span>
            </p>
          </li>
        );
      })}
    </ol>
  );
}

/** Provider ↔ client, always shown in the same two-card layout. */
export function PartyStrip({ a, me }: { a: Agreement; me: Party }) {
  const cards: { side: Party; name: string; email: string; signed?: number | undefined }[] = [
    {
      side: "provider",
      name: a.providerName,
      email: a.providerEmail,
      signed: a.providerApprovedAt,
    },
    { side: "client", name: a.clientName, email: a.clientEmail, signed: a.clientApprovedAt },
  ];
  return (
    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {cards.map((c) => (
        <div
          key={c.side}
          className="flex min-w-0 items-center gap-3 rounded-2xl border border-border/70 bg-background/60 p-3"
        >
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black ${accent[c.side].soft}`}
          >
            {(c.name || c.email).charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-foreground">
              {c.name}{" "}
              {me === c.side && <span className="font-medium text-muted-foreground">(you)</span>}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              {sideLabel(c.side)} · {c.email}
            </p>
          </div>
          {c.signed ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-black uppercase text-success">
              <Check className="h-3 w-3" aria-hidden /> Signed
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

/* ───────────────────────────── Directory pages (clients / providers) ───────────────────────────── */

/** List on the left, a card on the right: used by "My clients" and "My providers" so both read the same. */
export function DirectoryPage({
  side,
  title,
  subtitle,
  actions,
  children,
  aside,
}: {
  side: Party;
  title: string;
  subtitle: string;
  actions?: ReactNode;
  children: ReactNode;
  aside: ReactNode;
}) {
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${accent[side].soft}`}
            >
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              {sideLabel(side)}
            </span>
            <h1 className="mt-2 font-display text-2xl font-black text-foreground sm:text-4xl">
              {title}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground sm:text-base">{subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2">{actions}</div>
        </div>
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-12">
          <div className="min-w-0 space-y-3 lg:col-span-8">{children}</div>
          <div className="min-w-0 lg:col-span-4">{aside}</div>
        </div>
      </section>
    </SiteShell>
  );
}

/** One person in a directory (a client or a provider). */
export function PersonCard({
  side,
  name,
  email,
  badges,
  trailing,
}: {
  side: Party;
  name: string;
  email: string;
  badges: { text: string; tone?: "good" | "warn" | "muted" }[];
  trailing?: ReactNode;
}) {
  const tones = {
    good: "bg-success/15 text-success",
    warn: "bg-warning/20 text-foreground",
    muted: "bg-muted text-muted-foreground",
  } as const;
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-border bg-card p-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black ${accent[side].soft}`}
      >
        {(name || email).charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-foreground">{name}</p>
        <p className="truncate text-xs text-muted-foreground">{email}</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {badges.map((b) => (
            <span
              key={b.text}
              className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${tones[b.tone ?? "muted"]}`}
            >
              {b.text}
            </span>
          ))}
        </div>
      </div>
      {trailing}
    </div>
  );
}
