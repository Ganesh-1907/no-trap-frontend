import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, UserCheck, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
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
      <section className="mx-auto max-w-4xl px-4 py-16">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-muted/60 px-3.5 py-1 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Step 1 · Select Your Perspective
          </span>
          <h1 className="mt-3 font-display text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            Who are you in this agreement?
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Your account works both ways: be a provider on one agreement and a client on the next. Switch any time.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Service Provider Card */}
          <Link
            to="/provider"
            className="group flex flex-col justify-between rounded-3xl border-2 border-provider/30 bg-card p-6 sm:p-8 transition-all hover:border-provider hover:shadow-xl hover:-translate-y-1"
          >
            <div>
              {/* Illustration showcase */}
              <div className="relative mb-6 flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-provider/15 via-provider/5 to-transparent p-4 border border-provider/20">
                <img
                  src="/hero-provider.png"
                  alt="Service Provider Alex"
                  className="h-full w-auto object-contain drop-shadow transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-3 left-3 rounded-lg bg-background/90 backdrop-blur px-2.5 py-1 font-mono text-[11px] font-bold text-provider border border-provider/20 shadow-xs">
                  Alex · Provider View
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-provider text-background shadow-md shadow-provider/20">
                  <Briefcase className="h-5 w-5" aria-hidden />
                </div>
                <span className="rounded-full bg-provider/15 px-3 py-1 text-xs font-bold text-provider">
                  Freelancer / Agency
                </span>
              </div>

              <h2 className="mt-4 font-display text-2xl font-black text-foreground">
                Service Provider
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Define the deliverables, upload technical docs, attach voice memos, and generate a shared agreement request ID.
              </p>

              <ul className="mt-5 space-y-2 text-xs font-semibold text-foreground/80">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-provider shrink-0" />
                  Define 5-page or multi-milestone scope
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-provider shrink-0" />
                  Prevent unpaid revisions and scope creep
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-provider shrink-0" />
                  Propose change requests with clear extra costs
                </li>
              </ul>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-5">
              <span className="text-sm font-black text-provider group-hover:underline">
                Create agreement request
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-provider text-background transition-transform group-hover:translate-x-1 shadow-xs">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>

          {/* Client Card */}
          <Link
            to="/client"
            className="group flex flex-col justify-between rounded-3xl border-2 border-client/30 bg-card p-6 sm:p-8 transition-all hover:border-client hover:shadow-xl hover:-translate-y-1"
          >
            <div>
              {/* Illustration showcase */}
              <div className="relative mb-6 flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-client/15 via-client/5 to-transparent p-4 border border-client/20">
                <img
                  src="/hero-client.png"
                  alt="Client Sarah"
                  className="h-full w-auto object-contain drop-shadow transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-3 left-3 rounded-lg bg-background/90 backdrop-blur px-2.5 py-1 font-mono text-[11px] font-bold text-client border border-client/20 shadow-xs">
                  Sarah · Client View
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-client text-background shadow-md shadow-client/20">
                  <UserCheck className="h-5 w-5" aria-hidden />
                </div>
                <span className="rounded-full bg-client/15 px-3 py-1 text-xs font-bold text-client">
                  Client / Buyer
                </span>
              </div>

              <h2 className="mt-4 font-display text-2xl font-black text-foreground">
                Client
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                See the agreements your providers share with you, review every deliverable and voice memo, and sign off with full clarity.</p>

              <ul className="mt-5 space-y-2 text-xs font-semibold text-foreground/80">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-client shrink-0" />
                  Know exactly what deliverables are included
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-client shrink-0" />
                  Sign off on milestones before releasing funds
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-client shrink-0" />
                  Request adjustments or revisions with 1 click
                </li>
              </ul>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-5">
              <span className="text-sm font-black text-client group-hover:underline">
                Enter Request ID & review
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-client text-background transition-transform group-hover:translate-x-1 shadow-xs">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-10 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-provider" /> Mutual protection
          </span>
          <span>·</span>
          <span>Zero disputes</span>
          <span>·</span>
          <span>Free interactive simulation</span>
        </div>
      </section>
    </SiteShell>
  );
}
