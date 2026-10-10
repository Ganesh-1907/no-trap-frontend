import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, UserCheck } from "lucide-react";
import { SiteShell } from "@/components/site";

export const Route = createFileRoute("/start")({
  head: () => ({
    meta: [
      { title: "Start an agreement — NoTrap.co" },
      { name: "description", content: "Choose whether you are the service provider or the client to start a shared agreement." },
      { property: "og:title", content: "Start an agreement — NoTrap.co" },
      { property: "og:description", content: "Pick your side: Service Provider or Client." },
    ],
  }),
  component: Start,
});

function Start() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-4 py-14">
        <h1 className="text-center font-display text-4xl font-extrabold">Who are you in this agreement?</h1>
        <p className="mt-2 text-center text-muted-foreground">Pick your side to continue.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Link to="/provider" className="group rounded-2xl bg-provider p-8 text-background transition hover:scale-[1.02]">
            <Briefcase className="h-8 w-8" aria-hidden />
            <h2 className="mt-4 font-display text-2xl font-extrabold">Service Provider</h2>
            <p className="mt-2 text-sm opacity-90">Create a request, add documentation, voice records and scope of work, then send it to your client.</p>
            <span className="mt-6 inline-block font-bold underline">Create a request →</span>
          </Link>
          <Link to="/client" className="group rounded-2xl bg-client p-8 text-foreground transition hover:scale-[1.02]">
            <UserCheck className="h-8 w-8" aria-hidden />
            <h2 className="mt-4 font-display text-2xl font-extrabold">Client</h2>
            <p className="mt-2 text-sm">Enter the Request ID your provider shared, review everything, and approve.</p>
            <span className="mt-6 inline-block font-bold underline">Enter a Request ID →</span>
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
