import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Briefcase } from "lucide-react";
import { AuthRequired, SiteShell } from "@/components/site";
import { ActionLink, AsideCard, DashboardPage } from "@/components/workspace";
import { listAgreements, useSessionUser, type Agreement } from "@/lib/agreements";

export const Route = createFileRoute("/client")({
  head: () => ({
    meta: [
      { title: "Client dashboard — NoTrap.co" },
      { name: "description", content: "Review, approve or request changes on agreements from your service providers." },
      { property: "og:title", content: "Client dashboard — NoTrap.co" },
      { property: "og:description", content: "Clients: review every agreement item before work begins." },
    ],
  }),
  component: ClientDashboard,
});

function ClientDashboard() {
  const { user, ready } = useSessionUser();
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.isClient) return;
    listAgreements()
      .then((all) => setAgreements(all.filter((a) => a.clientEmail.toLowerCase() === user.email.toLowerCase())))
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load agreements"))
      .finally(() => setLoading(false));
  }, [user]);

  if (!ready) return <SiteShell><p className="p-10 text-center text-muted-foreground">Loading…</p></SiteShell>;
  if (!user?.isClient) return <AuthRequired role="client" />;

  return (
    <DashboardPage
      side="client"
      title="Your agreements"
      subtitle="Review the documents, voice records and scope each provider shares, approve what's right and ask for changes on what isn't."
      actions={
        <ActionLink to="/client/providers" side="client">
          <Briefcase className="h-3.5 w-3.5" aria-hidden /> My providers
        </ActionLink>
      }
      agreements={agreements}
      loading={loading}
      error={error}
      emptyTitle="Nothing shared with you yet"
      emptyHint={`Agreements your providers send to ${user.email} will appear here.`}
      aside={
        <AsideCard
          side="client"
          image="/hero-client.png"
          badge="The client's view"
          heading="Never wonder what was agreed"
          blurb="Every deliverable, voice note and revision rule is written down before work begins."
          points={[
            { title: "Review item by item", text: "Open each document and scope item, then approve it or flag it with a note." },
            { title: "Ask for changes", text: "Flagged items go back to the provider, who fixes them and resubmits for your review." },
            { title: "Sign off when it's right", text: "Approve once everything is correct; the provider countersigns to make it final." },
          ]}
        />
      }
    />
  );
}
