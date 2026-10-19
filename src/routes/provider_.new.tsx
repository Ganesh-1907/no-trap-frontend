import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FilePlus2, Loader2, Users } from "lucide-react";
import { AuthRequired, SiteShell } from "@/components/site";
import { ActionLink, AsideCard, DirectoryPage } from "@/components/workspace";
import { createAgreement, useSessionUser } from "@/lib/agreements";
import { listClients } from "@/lib/api";

export const Route = createFileRoute("/provider_/new")({
  validateSearch: (s: Record<string, unknown>): { client?: string | undefined } => ({
    client: typeof s["client"] === "string" ? (s["client"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "New agreement — NoTrap.co" },
      { name: "description", content: "Pick a client and start a new agreement." },
    ],
  }),
  component: NewAgreement,
});

type ClientRow = {
  client_user_id: string;
  client_email: string;
  client_first_name: string;
  client_last_name: string;
  client_account_status: string;
  link_status: string;
};

function NewAgreement() {
  const { client: preselected } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { user, ready } = useSessionUser();
  const [clients, setClients] = useState<ClientRow[] | null>(null);
  const [clientId, setClientId] = useState(preselected ?? "");
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.isProvider) return;
    listClients()
      .then((r) => setClients((r.clients as ClientRow[]).filter((c) => c.link_status === "active")))
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load clients"));
  }, [user]);

  if (!ready) return <SiteShell><p className="p-10 text-center text-muted-foreground">Loading…</p></SiteShell>;
  if (!user?.isProvider) return <AuthRequired role="provider" />;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const id = await createAgreement(title.trim() || "Untitled agreement", clientId);
      await navigate({ to: "/agreement/$id", params: { id } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create agreement");
      setBusy(false);
    }
  }

  return (
    <DirectoryPage
      side="provider"
      title="New agreement"
      subtitle="Choose which client this is for, give it a title, then add documents, voice records and scope."
      actions={
        <ActionLink to="/provider" side="provider">
          ← Dashboard
        </ActionLink>
      }
      aside={
        <AsideCard
          side="provider"
          image="/hero-provider.png"
          badge="Before you start"
          heading="Clients first, then agreements"
          blurb="Each agreement belongs to one client you've onboarded."
          points={[
            { title: "Not onboarded yet?", text: "Add them under My clients. They'll get an email invite to create their account." },
            { title: "Add your content", text: "Documents, voice records and scope go in on the next screen." },
            { title: "Send when ready", text: "The client is only notified once you send it." },
          ]}
        />
      }
    >
      <form onSubmit={submit} className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-xs">
        <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
          Client *
          <select
            required
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            disabled={clients === null}
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold normal-case tracking-normal outline-none focus:border-foreground"
          >
            <option value="">{clients === null ? "Loading clients…" : "Select a client…"}</option>
            {clients?.map((c) => (
              <option key={c.client_user_id} value={c.client_user_id}>
                {c.client_first_name} {c.client_last_name} · {c.client_email}
                {c.client_account_status === "invited" ? " (invited, not signed up yet)" : ""}
              </option>
            ))}
          </select>
        </label>
        {clients?.length === 0 && (
          <p className="flex items-center gap-2 rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
            <Users className="h-4 w-4 shrink-0" aria-hidden />
            <span>
              You haven't onboarded any clients. <Link to="/provider/clients" className="font-bold text-provider underline">Add a client</Link> first.
            </span>
          </p>
        )}
        <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
          Agreement title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Website Redesign & Brand Scope Agreement"
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-base font-semibold normal-case tracking-normal outline-none focus:border-foreground"
          />
        </label>
        {error && (
          <div role="alert" className="rounded-xl border border-destructive/20 bg-destructive/10 px-3.5 py-2.5 text-sm font-medium text-destructive">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={busy || !clientId}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-provider px-6 py-3.5 text-sm font-black text-background transition hover:opacity-90 disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <FilePlus2 className="h-4 w-4" aria-hidden />}
          Create agreement
        </button>
      </form>
    </DirectoryPage>
  );
}
