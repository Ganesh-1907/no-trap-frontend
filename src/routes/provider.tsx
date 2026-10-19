import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Users } from "lucide-react";
import { AuthRequired, SiteShell } from "@/components/site";
import { ActionLink, AsideCard, DashboardPage } from "@/components/workspace";
import { listAgreements, useSessionUser, type Agreement } from "@/lib/agreements";

export const Route = createFileRoute("/provider")({
  head: () => ({
    meta: [
      { title: "Provider dashboard — NoTrap.co" },
      { name: "description", content: "Create agreements, onboard clients and track every review in one place." },
      { property: "og:title", content: "Provider dashboard — NoTrap.co" },
      { property: "og:description", content: "Service providers: create, send and countersign agreements." },
    ],
  }),
  component: ProviderDashboard,
});

function ProviderDashboard() {
  const { user, ready } = useSessionUser();
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.isProvider) return;
    listAgreements()
      .then((all) => setAgreements(all.filter((a) => a.providerEmail.toLowerCase() === user.email.toLowerCase())))
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load agreements"))
      .finally(() => setLoading(false));
  }, [user]);

  if (!ready) return <SiteShell><p className="p-10 text-center text-muted-foreground">Loading…</p></SiteShell>;
  if (!user?.isProvider) return <AuthRequired role="provider" />;

  return (
    <DashboardPage
      side="provider"
      title="Your agreements"
      subtitle="Onboard a client, build the agreement with documents, voice records and scope, send it, then countersign once they approve."
      actions={
        <>
          <ActionLink to="/provider/clients" side="provider">
            <Users className="h-3.5 w-3.5" aria-hidden /> My clients
          </ActionLink>
          <ActionLink to="/provider/new" side="provider" primary>
            <Plus className="h-3.5 w-3.5" aria-hidden /> New agreement
          </ActionLink>
        </>
      }
      agreements={agreements}
      loading={loading}
      error={error}
      emptyTitle="No agreements yet"
      emptyHint="Add a client first, then create your first agreement for them."
      aside={
        <AsideCard
          side="provider"
          image="/hero-provider.png"
          badge="The service provider's view"
          heading="Agree on scope before work starts"
          blurb="Everything you promise sits in one shared record your client signs off on."
          points={[
            { title: "Onboard clients by email", text: "New clients get an invite to create their account; existing ones are linked straight away." },
            { title: "Fix what they flag", text: "Change requests come with notes. Update the item, resubmit, and they review again." },
            { title: "Countersign to finalize", text: "Once the client approves, your signature makes the agreement final for both sides." },
          ]}
        />
      }
    />
  );
}
