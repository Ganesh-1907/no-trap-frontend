import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Check, Copy, FilePlus2, Loader2, UserPlus } from "lucide-react";
import { AuthRequired, SiteShell } from "@/components/site";
import { ActionLink, DirectoryPage, PersonCard } from "@/components/workspace";
import { useSessionUser } from "@/lib/agreements";
import { addClient, listClients } from "@/lib/api";

export const Route = createFileRoute("/provider_/clients")({
  head: () => ({
    meta: [
      { title: "My clients — NoTrap.co" },
      { name: "description", content: "Onboard clients by email and manage the people you work with." },
    ],
  }),
  component: ProviderClientsPage,
});

type ClientRow = {
  link_id: string;
  client_user_id: string;
  client_email: string;
  client_first_name: string;
  client_last_name: string;
  client_account_status: string;
  client_company: string | null;
  agreement_count: string | number;
  link_status: string;
};

const emptyForm = { email: "", firstName: "", lastName: "", phone: "", company: "", sendEmail: true };
const inputCls =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/50 outline-none transition focus:border-foreground focus:ring-1 focus:ring-foreground";

function ProviderClientsPage() {
  const { user, ready } = useSessionUser();
  const [rows, setRows] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listClients();
      setRows(((res.clients as ClientRow[]) ?? []).filter((c) => c.link_status === "active"));
    } catch {
      setMessage("Could not load clients. Are you signed in as a provider?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.isProvider) void refresh();
  }, [refresh, user]);

  if (!ready) return <SiteShell><p className="p-10 text-center text-muted-foreground">Loading…</p></SiteShell>;
  if (!user?.isProvider) return <AuthRequired role="provider" />;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    setInviteUrl(null);
    try {
      const res = await addClient({
        email: form.email.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim() || undefined,
        company: form.company.trim() || undefined,
        sendEmail: form.sendEmail,
      });
      setMessage(res.message);
      if (res.inviteUrl && !res.emailed) setInviteUrl(res.inviteUrl);
      setForm(emptyForm);
      await refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to add client");
    } finally {
      setBusy(false);
    }
  }

  return (
    <DirectoryPage
      side="provider"
      title="My clients"
      subtitle="Onboard a client by email. New people get an invite to create their account; existing users are linked straight away."
      actions={
        <>
          <ActionLink to="/provider" side="provider">
            ← Dashboard
          </ActionLink>
          <ActionLink to="/provider/new" side="provider" primary>
            <FilePlus2 className="h-3.5 w-3.5" aria-hidden /> New agreement
          </ActionLink>
        </>
      }
      aside={
        <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-6 shadow-xs" noValidate>
          <h2 className="flex items-center gap-2 font-display text-lg font-black text-foreground">
            <UserPlus className="h-5 w-5 text-provider" aria-hidden /> Onboard a client
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            We email them an invite. They sign up with this address and then see everything you share.
          </p>
          <div className="mt-5 space-y-3.5">
            <Field label="Email" required>
              <input type="email" required inputMode="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="client@company.com" className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="First name" required>
                <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="e.g. Sarah" className={inputCls} />
              </Field>
              <Field label="Last name" required>
                <input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="e.g. Jenkins" className={inputCls} />
              </Field>
            </div>
            <Field label="Company">
              <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="e.g. Acme Studio Inc." className={inputCls} />
            </Field>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-foreground">
              <input type="checkbox" checked={form.sendEmail} onChange={(e) => setForm({ ...form, sendEmail: e.target.checked })} className="h-4 w-4 rounded border-border" />
              <span>Email them the invite now</span>
            </label>
          </div>
          {message && (
            <p role="status" className="mt-4 rounded-xl border border-border bg-muted/60 px-3.5 py-2.5 text-sm font-medium">
              {message}
            </p>
          )}
          {inviteUrl && (
            <div className="mt-3 rounded-xl border border-warning/40 bg-warning/15 p-3.5 text-sm">
              <p className="font-bold text-foreground">Share this signup link:</p>
              <code className="mt-1 block select-all break-all rounded-lg border border-warning/30 bg-background/80 p-2 font-mono text-[11px] text-foreground">{inviteUrl}</code>
              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard?.writeText(inviteUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1 text-xs font-bold text-background"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy link"}
              </button>
            </div>
          )}
          <button
            type="submit"
            disabled={busy}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-provider px-6 py-3 text-sm font-black text-background transition hover:opacity-90 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            Add client
          </button>
        </form>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-3xl border border-border bg-card p-10 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading clients…
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card/60 p-8 text-center">
          <p className="font-display text-lg font-black text-foreground">No clients yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Add your first client with the form to get started.</p>
        </div>
      ) : (
        rows.map((c) => (
          <PersonCard
            key={c.link_id}
            side="client"
            name={`${c.client_first_name} ${c.client_last_name}`.trim() || c.client_email}
            email={c.client_email}
            badges={[
              c.client_account_status === "invited"
                ? { text: "Invited · not signed up yet", tone: "warn" }
                : { text: "Active", tone: "good" },
              { text: `${String(c.agreement_count)} agreements`, tone: "muted" },
              ...(c.client_company ? [{ text: c.client_company, tone: "muted" as const }] : []),
            ]}
            trailing={
              <Link to="/provider/new" search={{ client: c.client_user_id }} className="shrink-0 text-xs font-bold text-provider hover:underline">
                New agreement →
              </Link>
            }
          />
        ))
      )}
    </DirectoryPage>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wider text-foreground">
        {label}
        {required ? " *" : ""}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
