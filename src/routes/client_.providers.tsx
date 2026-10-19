import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { AuthRequired, SiteShell } from "@/components/site";
import { ActionLink, AsideCard, DirectoryPage, PersonCard } from "@/components/workspace";
import { listMyProviders, useSessionUser, type ProviderLink } from "@/lib/agreements";

export const Route = createFileRoute("/client_/providers")({
  head: () => ({
    meta: [
      { title: "My providers — NoTrap.co" },
      { name: "description", content: "Service providers who have added you as a client." },
    ],
  }),
  component: MyProviders,
});

function MyProviders() {
  const { user, ready } = useSessionUser();
  const [rows, setRows] = useState<ProviderLink[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.isClient) return;
    listMyProviders()
      .then(setRows)
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load providers"));
  }, [user]);

  if (!ready) return <SiteShell><p className="p-10 text-center text-muted-foreground">Loading…</p></SiteShell>;
  if (!user?.isClient) return <AuthRequired role="client" />;

  return (
    <DirectoryPage
      side="client"
      title="My providers"
      subtitle="Service providers who added you as a client and can share agreements with you."
      actions={
        <ActionLink to="/client" side="client">
          ← Dashboard
        </ActionLink>
      }
      aside={
        <AsideCard
          side="client"
          image="/hero-client.png"
          badge="How it works"
          heading="Providers invite you in"
          blurb="You can't be added to an agreement unless a provider onboards you first."
          points={[
            { title: "They add you", text: "A provider adds your email as a client." },
            { title: "You create your account", text: "Sign up with the same email; a code confirms it's you." },
            { title: "Agreements appear", text: "Anything they send shows on your dashboard." },
          ]}
        />
      }
    >
      {error && <div role="alert" className="rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-sm font-semibold text-destructive">{error}</div>}
      {rows === null && !error ? (
        <div className="flex items-center justify-center gap-2 rounded-3xl border border-border bg-card p-10 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading providers…
        </div>
      ) : rows?.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card/60 p-8 text-center">
          <p className="font-display text-lg font-black text-foreground">No providers yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Providers who add {user.email} as a client will show up here.</p>
        </div>
      ) : (
        rows?.map((p) => (
          <PersonCard
            key={p.link_id}
            side="provider"
            name={`${p.first_name} ${p.last_name}`.trim() || p.email}
            email={p.email}
            badges={[
              ...(p.business_name ? [{ text: p.business_name, tone: "muted" as const }] : []),
              { text: `Since ${new Date(p.linked_at).toLocaleDateString()}`, tone: "muted" as const },
            ]}
          />
        ))
      )}
    </DirectoryPage>
  );
}
