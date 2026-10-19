import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Check,
  CheckCircle2,
  ClipboardList,
  FileText,
  Hourglass,
  Loader2,
  MessageSquareWarning,
  Mic,
  RefreshCw,
  Send,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react";
import { AuthRequired, RequestId, SiteShell, StatusBadge } from "@/components/site";
import { PartyStrip, PhaseBadge, Stepper } from "@/components/workspace";
import {
  addItem,
  approveAgreement,
  countersign,
  deleteAgreement,
  REMINDER_COOLDOWN_MS,
  remindParty,
  removeItem,
  renameAgreement,
  replaceItem,
  requestChanges,
  resubmit,
  reviewItem,
  setAgreementStatus,
  useAgreement,
  useSessionUser,
  type Agreement,
  type Item,
  type Party,
  type Section,
} from "@/lib/agreements";
import { openAsset, storeFiles } from "@/lib/api";

export const Route = createFileRoute("/agreement/$id")({
  // `as` is ignored: which side you are comes from your account, not the URL.
  validateSearch: (s: Record<string, unknown>): { as?: Party | undefined } => ({
    as: s["as"] === "client" ? "client" : s["as"] === "provider" ? "provider" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Agreement — NoTrap.co" },
      {
        name: "description",
        content:
          "Review the shared documentation, voice records and scope of work for this agreement.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Workspace,
});

const SECTIONS: {
  s: Section;
  icon: typeof FileText;
  hint: string;
  accept: string;
  tint: string;
}[] = [
  {
    s: "Documentation",
    icon: FileText,
    hint: "Needs client approval",
    accept: ".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt",
    tint: "bg-provider-soft text-provider",
  },
  {
    s: "Voice Records",
    icon: Mic,
    hint: "Saved for both sides · no approval needed",
    accept: "audio/*",
    tint: "bg-client-soft text-client",
  },
  {
    s: "Scope of Work",
    icon: ClipboardList,
    hint: "Needs client approval",
    accept: ".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg",
    tint: "bg-primary/10 text-primary",
  },
];

const TEMPLATES: { label: string; title: string; doc: string; voice: string; scope: string }[] = [
  {
    label: "🌐 5-Page Website",
    title: "5-Page Website Redesign & Brand Agreement",
    doc: "Website Sitemap & Wireframes.pdf",
    voice: "Kickoff Note - Payment Terms & Revisions.mp3",
    scope: "5 Pages Scope (Home, About, Services, Work, Contact)",
  },
  {
    label: "📱 Mobile App MVP",
    title: "Mobile App MVP UI/UX Design Agreement",
    doc: "Figma Component Library & User Flows.pdf",
    voice: "Discovery Call - Navigation & Auth Notes.mp3",
    scope: "App Scope (12 Screens + Prototype + iOS Guidelines)",
  },
  {
    label: "🎨 Brand Identity",
    title: "Brand Identity & Design System Agreement",
    doc: "Brand Strategy Deck & Moodboards.pdf",
    voice: "Brand Voice Alignment Call.mp3",
    scope: "Deliverables (Logo Suite, Color System, Brand Guide)",
  },
];

type Msg = { kind: "ok" | "error"; text: string };

function Workspace() {
  const { id } = Route.useParams();
  const navigate = Route.useNavigate();
  const { user, ready: sessionReady } = useSessionUser();
  const { agreement: a, side: me, ready, error: loadError, refresh } = useAgreement(id);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Msg | null>(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (a) setTitle(a.title);
  }, [a?.id, a?.title]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!sessionReady || !ready)
    return (
      <SiteShell>
        <p className="p-10 text-center text-muted-foreground">Loading…</p>
      </SiteShell>
    );
  if (!user) return <AuthRequired role="client" />;
  if (!a) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-md px-4 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <ClipboardList className="h-8 w-8" />
          </div>
          <p className="mt-4 font-display text-xl font-bold text-foreground">Agreement not found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {loadError ?? "This agreement isn't on your account."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/provider"
              className="rounded-xl border border-border bg-card px-5 py-2.5 text-xs font-bold text-foreground"
            >
              Provider dashboard
            </Link>
            <Link
              to="/client"
              className="rounded-xl bg-foreground px-5 py-2.5 text-xs font-bold text-background"
            >
              Client dashboard
            </Link>
          </div>
        </div>
      </SiteShell>
    );
  }

  const other = me === "provider" ? a.clientName : a.providerName;
  const providerEdit =
    me === "provider" && (a.status === "Draft" || (a.status === "Accepted" && !a.clientApprovedAt));
  const clientReview = me === "client" && a.status === "Accepted" && !a.clientApprovedAt;
  const showItems = me === "provider" || a.status === "Accepted" || a.status === "Approved";
  const canAddVoice =
    a.status !== "Cancelled" &&
    (me === "provider" || a.status === "Accepted" || a.status === "Approved");
  const reviewable = a.items.filter((i) => i.section !== "Voice Records");

  const run = async (fn: () => Promise<unknown>, ok?: string) => {
    setBusy(true);
    setMsg(null);
    try {
      await fn();
      await refresh();
      if (ok) setMsg({ kind: "ok", text: ok });
    } catch (err) {
      setMsg({ kind: "error", text: err instanceof Error ? err.message : "Something went wrong" });
    } finally {
      setBusy(false);
    }
  };

  const addFiles = (section: Section, files: FileList | null) => {
    if (!files?.length) return;
    return run(async () => {
      const stored = await storeFiles(Array.from(files));
      for (const f of stored) await addItem(a.id, { section, name: f.name, assetId: f.assetId });
    });
  };

  const remind = () =>
    run(async () => {
      await remindParty(a.id);
    }, `Reminder emailed to ${other}. You can send another in 24 hours.`);

  const removeAgreement = async () => {
    if (
      !window.confirm(
        `Permanently delete "${a.title}" and its uploaded files? This can't be undone.`,
      )
    )
      return;
    setBusy(true);
    setMsg(null);
    try {
      await deleteAgreement(a.id);
      await navigate({ to: "/provider" });
    } catch (err) {
      setMsg({ kind: "error", text: err instanceof Error ? err.message : "Could not delete" });
      setBusy(false);
    }
  };

  const applyTemplate = (t: (typeof TEMPLATES)[number]) =>
    run(async () => {
      await renameAgreement(a.id, t.title);
      await addItem(a.id, { section: "Documentation", name: t.doc });
      await addItem(a.id, { section: "Voice Records", name: t.voice });
      await addItem(a.id, { section: "Scope of Work", name: t.scope });
    });

  const send = () =>
    run(async () => {
      const t = title.trim() || "Untitled agreement";
      if (t !== a.title) await renameAgreement(a.id, t);
      await setAgreementStatus(a.id, "Waiting for client");
    }, `Sent to ${a.clientName}. They've been emailed.`);

  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to={me === "client" ? "/client" : "/provider"}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />{" "}
            {me === "client" ? "Client dashboard" : "Provider dashboard"}
          </Link>
          <PhaseBadge a={a} />
        </div>

        {/* Header: identity, progress, parties (identical for both roles) */}
        <div className="mt-5 rounded-3xl border border-border bg-card p-6 shadow-xs sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-sm font-bold text-muted-foreground">{a.id}</span>
            <StatusBadge s={a.status} />
          </div>
          {me === "provider" && a.status === "Draft" ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => {
                const t = title.trim();
                if (t && t !== a.title) void run(() => renameAgreement(a.id, t));
              }}
              aria-label="Agreement title"
              placeholder="Agreement title"
              className="mt-2 w-full rounded-xl border border-transparent bg-transparent px-0 py-1 font-display text-2xl font-black text-foreground outline-none transition focus:border-border focus:bg-background focus:px-3 sm:text-3xl"
            />
          ) : (
            <h1 className="mt-2 font-display text-2xl font-black text-foreground sm:text-3xl">
              {a.title}
            </h1>
          )}
          <Stepper a={a} />
          <PartyStrip a={a} me={me} />
          {me === "provider" && a.status !== "Cancelled" && (
            <div className="mt-5">
              <RequestId id={a.id} />
            </div>
          )}
        </div>

        {msg && (
          <div
            role={msg.kind === "error" ? "alert" : "status"}
            className={`mt-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${msg.kind === "error" ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-success/30 bg-success/10 text-success"}`}
          >
            {msg.kind === "error" ? (
              <XCircle className="h-4 w-4 shrink-0" />
            ) : (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            )}
            {msg.text}
          </div>
        )}

        <NextStep
          a={a}
          me={me}
          other={other}
          busy={busy}
          total={reviewable.length}
          onSend={send}
          onRemind={remind}
          onDelete={removeAgreement}
          onTemplate={applyTemplate}
          onCancel={() => run(() => setAgreementStatus(a.id, "Cancelled"), "Agreement cancelled.")}
          onAccept={() =>
            run(() => setAgreementStatus(a.id, "Accepted"), "Accepted. Review each item below.")
          }
          onRequestChanges={() =>
            run(() => requestChanges(a.id), `${other} has been emailed your change requests.`)
          }
          onResubmit={() => run(() => resubmit(a.id), `Sent back to ${other} for review.`)}
          onApprove={(all) =>
            run(
              () => approveAgreement(a.id, all),
              "You approved this agreement. The provider will countersign.",
            )
          }
          onCountersign={() =>
            run(() => countersign(a.id), "Countersigned. The agreement is final.")
          }
        />

        {/* Sections: same cards for both roles */}
        {showItems ? (
          <div className="mt-6 grid grid-cols-1 gap-5">
            {SECTIONS.map((sec) => (
              <SectionCard
                key={sec.s}
                sec={sec}
                a={a}
                me={me}
                busy={busy}
                providerEdit={providerEdit}
                clientReview={clientReview}
                canAddVoice={canAddVoice}
                onAddFiles={(files) => addFiles(sec.s, files)}
                onAddText={(name) => run(() => addItem(a.id, { section: sec.s, name }))}
                onApprove={(item) => run(() => reviewItem(a.id, item.id, "Approved"))}
                onFlag={(item, note) => run(() => reviewItem(a.id, item.id, "Needs changes", note))}
                onReplace={(item, file) =>
                  run(async () => {
                    const [stored] = await storeFiles([file]);
                    await replaceItem(a.id, item.id, {
                      name: stored?.name,
                      assetId: stored?.assetId,
                    });
                  }, "File replaced. Resubmit when you're done.")
                }
                onRemove={(item) => run(() => removeItem(a.id, item.id))}
                onError={(text) => setMsg({ kind: "error", text })}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-border bg-card p-8 text-center shadow-xs">
            <p className="text-sm font-semibold text-muted-foreground">
              Accept the request to see and review the agreement records.
            </p>
          </div>
        )}
      </section>
    </SiteShell>
  );
}

/* ─────────────────────────── The "what happens next" card ─────────────────────────── */

function NextStep(props: {
  a: Agreement;
  me: Party;
  other: string;
  busy: boolean;
  total: number;
  onSend: () => void;
  onRemind: () => void;
  onDelete: () => void;
  onTemplate: (t: (typeof TEMPLATES)[number]) => void;
  onCancel: () => void;
  onAccept: () => void;
  onRequestChanges: () => void;
  onResubmit: () => void;
  onApprove: (all: boolean) => void;
  onCountersign: () => void;
}) {
  const { a, me, other, busy, total } = props;
  const reviewed = a.approvedCount;
  const bar = total > 0 ? Math.round((reviewed / total) * 100) : 0;

  const Card = ({
    tone,
    icon: Icon,
    title,
    children,
  }: {
    tone: "info" | "warn" | "danger" | "good" | "muted";
    icon: typeof Check;
    title: string;
    children?: React.ReactNode;
  }) => {
    const toneCls = {
      info: "border-provider/30 bg-provider-soft/50",
      warn: "border-warning/40 bg-warning/15",
      danger: "border-destructive/30 bg-destructive/5",
      good: "border-success/30 bg-success/10",
      muted: "border-border bg-card",
    }[tone];
    return (
      <div className={`mt-4 rounded-3xl border-2 p-5 sm:p-6 ${toneCls}`}>
        <p className="flex items-center gap-2 font-display text-base font-black text-foreground">
          <Icon className="h-5 w-5 shrink-0" aria-hidden /> {title}
        </p>
        {children}
      </div>
    );
  };
  const Btn = ({
    onClick,
    disabled,
    kind = "dark",
    children,
  }: {
    onClick: () => void;
    disabled?: boolean;
    kind?: "dark" | "good" | "ghost" | "danger";
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={busy || disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-black transition disabled:opacity-50 ${
        {
          dark: "bg-foreground text-background hover:opacity-90",
          good: "bg-success text-background hover:opacity-90",
          ghost: "border border-border bg-card text-foreground hover:border-foreground",
          danger:
            "border border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20",
        }[kind]
      }`}
    >
      {busy && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
  const Row = ({ children }: { children: React.ReactNode }) => (
    <div className="mt-4 flex flex-wrap gap-2.5">{children}</div>
  );
  const P = ({ children }: { children: React.ReactNode }) => (
    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{children}</p>
  );
  // One reminder per 24h; the server enforces it, the button just shows the wait.
  const cooldownLeft = a.lastRemindedAt ? a.lastRemindedAt + REMINDER_COOLDOWN_MS - Date.now() : 0;
  const cooling = cooldownLeft > 0;
  const Remind = () => (
    <Btn kind="ghost" onClick={props.onRemind} disabled={cooling}>
      <Bell className="h-4 w-4" aria-hidden />
      {cooling
        ? `Reminder sent · again in ${Math.ceil(cooldownLeft / 3_600_000)}h`
        : `Send reminder to ${other}`}
    </Btn>
  );

  if (a.status === "Cancelled") {
    return (
      <Card tone="muted" icon={XCircle} title="This agreement was cancelled">
        {me === "provider" && (
          <Row>
            <Btn kind="danger" onClick={props.onDelete}>
              <Trash2 className="h-4 w-4" aria-hidden /> Delete agreement
            </Btn>
          </Row>
        )}
      </Card>
    );
  }
  if (a.status === "Approved") {
    return (
      <Card tone="good" icon={CheckCircle2} title="Approved by both sides">
        <P>
          Scope and deliverables are mutually agreed. This is now the shared record; work can
          proceed without scope creep.
        </P>
      </Card>
    );
  }

  if (me === "provider") {
    if (a.status === "Draft") {
      return (
        <Card tone="info" icon={Send} title={`Ready to send to ${other}?`}>
          <P>
            Add documents, voice records and scope below. {other} is only notified when you send it.
          </P>
          {a.items.length === 0 && (
            <div className="mt-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                ⚡ Quick-start templates
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    disabled={busy}
                    onClick={() => props.onTemplate(t)}
                    className="rounded-xl border border-provider/40 bg-provider/10 px-3 py-1.5 text-xs font-bold text-provider transition hover:bg-provider/20 disabled:opacity-50"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <Row>
            <Btn onClick={props.onSend} disabled={a.items.length === 0}>
              <Send className="h-4 w-4" aria-hidden /> Send to {other}
            </Btn>
            <Btn kind="ghost" onClick={props.onCancel}>
              Cancel agreement
            </Btn>
            <Btn kind="danger" onClick={props.onDelete}>
              <Trash2 className="h-4 w-4" aria-hidden /> Delete draft
            </Btn>
          </Row>
        </Card>
      );
    }
    if (a.status === "Waiting for client") {
      return (
        <Card tone="warn" icon={Hourglass} title={`Waiting for ${other} to accept`}>
          <P>They've been emailed. You can still cancel the request until they accept.</P>
          <Row>
            <Remind />
            <Btn kind="ghost" onClick={props.onCancel}>
              Cancel request
            </Btn>
          </Row>
        </Card>
      );
    }
    if (a.clientApprovedAt) {
      return (
        <Card tone="info" icon={CheckCircle2} title={`${other} approved. Your turn to countersign`}>
          <P>Everything is approved. Countersigning makes the agreement final for both sides.</P>
          <Row>
            <Btn kind="good" onClick={props.onCountersign}>
              <Check className="h-4 w-4" aria-hidden /> Countersign &amp; finalize
            </Btn>
          </Row>
        </Card>
      );
    }
    if (a.changesCount > 0) {
      return (
        <Card
          tone="danger"
          icon={MessageSquareWarning}
          title={`${other} requested changes on ${a.changesCount} ${a.changesCount === 1 ? "item" : "items"}`}
        >
          <P>
            Read each note below, replace or remove the flagged items, add anything missing, then
            resubmit for another review.
          </P>
          <Row>
            <Btn onClick={props.onResubmit}>
              <RefreshCw className="h-4 w-4" aria-hidden /> Resubmit for review
            </Btn>
          </Row>
        </Card>
      );
    }
    return (
      <Card tone="warn" icon={Hourglass} title={`${other} is reviewing`}>
        <Progress bar={bar} reviewed={reviewed} total={total} />
        <P>
          {a.pendingCount > 0
            ? "You'll be emailed when they approve or ask for changes."
            : "All items look approved. Waiting for their final sign-off."}
        </P>
        <Row>
          <Remind />
        </Row>
      </Card>
    );
  }

  // client
  if (a.status === "Waiting for client") {
    return (
      <Card tone="warn" icon={Send} title="Action required: review and accept">
        <P>
          {other} shared this agreement with you. Accept to open each item for review. Nothing is
          approved until you say so.
        </P>
        <Row>
          <Btn onClick={props.onAccept}>Accept request &amp; review scope</Btn>
        </Row>
      </Card>
    );
  }
  if (a.clientApprovedAt) {
    return (
      <Card
        tone="info"
        icon={Hourglass}
        title="You approved. Waiting for the provider to countersign"
      >
        <P>{other} has been emailed. The agreement becomes final once they countersign.</P>
        <Row>
          <Remind />
        </Row>
      </Card>
    );
  }
  if (a.changesCount > 0) {
    return (
      <Card
        tone="danger"
        icon={MessageSquareWarning}
        title={`You flagged ${a.changesCount} ${a.changesCount === 1 ? "item" : "items"} for changes`}
      >
        <Progress bar={bar} reviewed={reviewed} total={total} />
        <P>
          Send your notes to {other}. They'll update the items and resubmit, then you review again.
          You can't sign off while items are flagged.
        </P>
        <Row>
          <Btn onClick={props.onRequestChanges}>
            <Send className="h-4 w-4" aria-hidden /> Send change requests to {other}
          </Btn>
        </Row>
      </Card>
    );
  }
  return (
    <Card tone="warn" icon={ClipboardList} title="Review each item, then sign off">
      <Progress bar={bar} reviewed={reviewed} total={total} />
      <P>Approve what's right, or flag an item with a note if something should change.</P>
      <Row>
        {a.pendingCount > 0 ? (
          <Btn kind="good" onClick={() => props.onApprove(true)}>
            <Check className="h-4 w-4" aria-hidden /> Approve all &amp; sign off
          </Btn>
        ) : (
          <Btn kind="good" onClick={() => props.onApprove(false)}>
            <Check className="h-4 w-4" aria-hidden /> Sign off agreement
          </Btn>
        )}
      </Row>
    </Card>
  );
}

function Progress({ bar, reviewed, total }: { bar: number; reviewed: number; total: number }) {
  return (
    <div className="mt-3">
      <div className="h-2 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-success transition-all"
          style={{ width: `${bar}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs font-semibold text-muted-foreground">
        {reviewed} of {total} items approved
      </p>
    </div>
  );
}

/* ─────────────────────────── One section (Documentation / Voice / Scope) ─────────────────────────── */

function SectionCard(props: {
  sec: (typeof SECTIONS)[number];
  a: Agreement;
  me: Party;
  busy: boolean;
  providerEdit: boolean;
  clientReview: boolean;
  canAddVoice: boolean;
  onAddFiles: (files: FileList | null) => void;
  onAddText: (name: string) => void;
  onApprove: (item: Item) => void;
  onFlag: (item: Item, note: string) => void;
  onReplace: (item: Item, file: File) => void;
  onRemove: (item: Item) => void;
  onError: (text: string) => void;
}) {
  const { sec, a, me, busy } = props;
  const Icon = sec.icon;
  const items = a.items.filter((i) => i.section === sec.s);
  const isVoice = sec.s === "Voice Records";
  const canAdd = isVoice ? props.canAddVoice : me === "provider" && props.providerEdit;
  const [text, setText] = useState("");

  return (
    <div className="min-w-0 rounded-3xl border border-border bg-card p-6 shadow-xs sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${sec.tint}`}
          >
            <Icon className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="font-display text-base font-black text-foreground sm:text-lg">
              {sec.s}
            </h2>
            <span className="text-xs text-muted-foreground">
              {items.length} {items.length === 1 ? "record" : "records"} · {sec.hint}
            </span>
          </div>
        </div>
        {canAdd && (
          <label
            className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-background shadow-xs transition hover:opacity-90 focus-within:ring-2 focus-within:ring-ring ${isVoice ? "bg-client" : "bg-provider"} ${busy ? "pointer-events-none opacity-60" : ""}`}
          >
            {isVoice ? (
              <Mic className="h-4 w-4" aria-hidden />
            ) : (
              <Upload className="h-4 w-4" aria-hidden />
            )}
            {isVoice ? "Add voice memo" : "Add files"}
            <input
              type="file"
              multiple
              accept={sec.accept}
              className="sr-only"
              onChange={(e) => {
                props.onAddFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        )}
      </div>

      {sec.s === "Scope of Work" && canAdd && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const v = text.trim();
            if (v) {
              props.onAddText(v);
              setText("");
            }
          }}
          className="mt-4 flex gap-2"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Or type a scope item, e.g. 2 rounds of revisions included"
            className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-foreground"
          />
          <button
            type="submit"
            disabled={busy || !text.trim()}
            className="rounded-xl bg-foreground px-4 py-2 text-xs font-bold text-background disabled:opacity-50"
          >
            Add
          </button>
        </form>
      )}

      {items.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-border/70 p-6 text-center">
          <p className="text-xs font-medium text-muted-foreground">
            No files in {sec.s.toLowerCase()} yet.
          </p>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-border/60">
          {items.map((i) => (
            <ItemRow
              key={i.id}
              item={i}
              me={me}
              busy={busy}
              providerEdit={props.providerEdit}
              clientReview={props.clientReview}
              onApprove={props.onApprove}
              onFlag={props.onFlag}
              onReplace={props.onReplace}
              onRemove={props.onRemove}
              onError={props.onError}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function ItemRow(props: {
  item: Item;
  me: Party;
  busy: boolean;
  providerEdit: boolean;
  clientReview: boolean;
  onApprove: (item: Item) => void;
  onFlag: (item: Item, note: string) => void;
  onReplace: (item: Item, file: File) => void;
  onRemove: (item: Item) => void;
  onError: (text: string) => void;
}) {
  const { item: i, me, busy } = props;
  const isVoice = i.section === "Voice Records";
  const [flagging, setFlagging] = useState(false);
  const [note, setNote] = useState(i.note ?? "");
  const replaceRef = useRef<HTMLInputElement>(null);

  const reviewable = props.clientReview && !isVoice;
  const providerCanFix =
    me === "provider" &&
    props.providerEdit &&
    !isVoice &&
    (i.status === "Draft" || i.status === "Needs changes");
  const canRemove = isVoice ? i.by === me : providerCanFix;

  const btn =
    "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition active:scale-95 disabled:opacity-50";

  return (
    <li className="min-w-0 py-4">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-foreground">{i.name}</p>
          <span
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${i.by === "provider" ? "bg-provider-soft text-provider" : "bg-client-soft text-foreground"}`}
          >
            Added by {i.by === "provider" ? "Service Provider" : "Client"}
          </span>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {i.assetId && (
            <button
              type="button"
              onClick={() =>
                openAsset(i.assetId!).catch((e) =>
                  props.onError(e instanceof Error ? e.message : "Could not open file"),
                )
              }
              className={`${btn} border border-border text-foreground hover:bg-muted`}
            >
              Open
            </button>
          )}
          <StatusBadge s={i.status} />
          {reviewable && i.status !== "Approved" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => props.onApprove(i)}
              className={`${btn} bg-success text-background hover:opacity-90`}
            >
              <Check className="h-3.5 w-3.5" aria-hidden /> Approve
            </button>
          )}
          {reviewable && (
            <button
              type="button"
              disabled={busy}
              onClick={() => setFlagging((v) => !v)}
              className={`${btn} border border-destructive/60 bg-destructive/10 text-destructive hover:bg-destructive/20`}
            >
              <MessageSquareWarning className="h-3.5 w-3.5" aria-hidden />{" "}
              {i.status === "Needs changes" ? "Edit note" : "Needs changes"}
            </button>
          )}
          {providerCanFix && i.assetId !== undefined && (
            <>
              <input
                ref={replaceRef}
                type="file"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) props.onReplace(i, f);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                disabled={busy}
                onClick={() => replaceRef.current?.click()}
                className={`${btn} border border-border text-foreground hover:bg-muted`}
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden /> Replace file
              </button>
            </>
          )}
          {canRemove && (
            <button
              type="button"
              disabled={busy}
              onClick={() => props.onRemove(i)}
              aria-label={`Remove ${i.name}`}
              className={`${btn} border border-border text-muted-foreground hover:text-destructive`}
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden />
            </button>
          )}
        </div>
      </div>

      {i.status === "Needs changes" && i.note && !flagging && (
        <div className="mt-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-sm">
          <b className="text-destructive">
            {me === "provider" ? "Client asked for:" : "Your note:"}
          </b>{" "}
          <span className="text-foreground">{i.note}</span>
        </div>
      )}

      {flagging && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!note.trim()) return;
            props.onFlag(i, note.trim());
            setFlagging(false);
          }}
          className="mt-2.5 space-y-2"
        >
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            maxLength={1000}
            autoFocus
            placeholder="What should change? Be specific so the provider can fix it."
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-foreground"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={busy || !note.trim()}
              className={`${btn} bg-destructive text-background disabled:opacity-50`}
            >
              Save change request
            </button>
            <button
              type="button"
              onClick={() => setFlagging(false)}
              className={`${btn} border border-border text-foreground`}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </li>
  );
}
