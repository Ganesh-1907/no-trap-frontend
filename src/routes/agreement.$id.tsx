import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, MessageSquareWarning, Mic, CheckCircle2, Upload } from "lucide-react";
import { SiteShell, StatusBadge, Proto } from "@/components/site";
import { updateAgreement, useAgreement, uid, type Party, type Section, type ItemStatus } from "@/lib/demo-store";

export const Route = createFileRoute("/agreement/$id")({
  validateSearch: (s: Record<string, unknown>) => ({ as: (s.as === "client" ? "client" : "provider") as Party }),
  head: () => ({
    meta: [
      { title: "Agreement review — NoTrap.co" },
      { name: "description", content: "Review the shared Documentation, Voice Records and Scope of Work for this agreement." },
      { property: "og:title", content: "Agreement review — NoTrap.co" },
      { property: "og:description", content: "One shared record, visible to provider and client." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Review,
});

const order: Section[] = ["Documentation", "Voice Records", "Scope of Work"];

function Review() {
  const { id } = Route.useParams();
  const { as } = Route.useSearch();
  const { agreement: a, ready } = useAgreement(id);

  if (!ready) return <SiteShell><p className="p-10 text-center text-muted-foreground">Loading…</p></SiteShell>;
  if (!a) return <SiteShell><div className="p-10 text-center"><p className="font-bold">Agreement not found in this browser.</p><Link to="/start" className="mt-4 inline-block underline">Start an agreement</Link></div></SiteShell>;

  const visible = a.status === "Accepted" || a.status === "Approved" || as === "provider";
  const setItem = (iid: string, status: ItemStatus) => updateAgreement(a.id, (x) => ({ ...x, items: x.items.map((i) => (i.id === iid ? { ...i, status } : i)) }));
  const addVoice = (files: FileList | null) => {
    if (!files?.length) return;
    updateAgreement(a.id, (x) => ({ ...x, items: [...x.items, ...Array.from(files).map((f) => ({ id: uid(), section: "Voice Records" as const, name: f.name, by: as, status: "Saved" as const }))] }));
  };
  const reviewable = a.items.filter((i) => i.section !== "Voice Records");
  const allApproved = reviewable.every((i) => i.status === "Approved");
  const approveAll = () => updateAgreement(a.id, (x) => ({ ...x, status: "Approved", items: x.items.map((i) => (i.section !== "Voice Records" ? { ...i, status: "Approved" } : i)) }));
  const needsChanges = reviewable.some((i) => i.status === "Needs changes");

  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex flex-wrap items-center gap-3">
          <Proto>Demo only</Proto>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${as === "provider" ? "bg-provider text-background" : "bg-client text-foreground"}`}>Viewing as {as === "provider" ? "Service Provider" : "Client"}</span>
          <Link to="/agreement/$id" params={{ id }} search={{ as: as === "provider" ? "client" : "provider" }} className="text-xs underline text-muted-foreground">Switch view (demo)</Link>
        </div>
        <h1 className="mt-3 font-display text-3xl font-extrabold">{a.title}</h1>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm"><span className="font-mono font-bold">{a.id}</span><StatusBadge s={a.status} /></div>

        {a.status === "Approved" && (
          <div role="status" className="mt-5 flex items-center gap-3 rounded-2xl bg-success/15 p-5 text-success">
            <CheckCircle2 className="h-8 w-8 shrink-0" aria-hidden />
            <div><p className="font-display text-xl font-extrabold">{as === "client" ? "You approved this agreement" : "Client approved this agreement"}</p><p className="text-sm">Approval recorded in this demo only — not legally binding or stored.</p></div>
          </div>
        )}
        {a.status === "Waiting for client" && <p className="mt-5 rounded-xl bg-warning/20 px-4 py-3 text-sm">Waiting for the client to accept the request.</p>}

        {visible ? (
          <div className="mt-6 grid gap-4">
            {order.map((s) => {
              const items = a.items.filter((i) => i.section === s);
              return (
                <div key={s} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-bold">{s}</h2>
                    {s === "Voice Records" && a.status !== "Waiting for client" && (
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-foreground px-3 py-1.5 text-sm font-bold focus-within:ring-2 focus-within:ring-ring">
                        <Mic className="h-4 w-4" aria-hidden /><Upload className="h-3 w-3" aria-hidden />Add voice file
                        <input type="file" accept="audio/*" multiple className="sr-only" onChange={(e) => { addVoice(e.target.files); e.target.value = ""; }} />
                      </label>
                    )}
                  </div>
                  {items.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">Nothing here.</p> : (
                    <ul className="mt-3 divide-y divide-border">
                      {items.map((i) => {
                        const canReview = as === "client" && s !== "Voice Records" && a.status === "Accepted";
                        return (
                          <li key={i.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                              <p className="truncate font-medium">{i.name}</p>
                              <span className={`mt-1 inline-block rounded px-1.5 text-[11px] font-bold ${i.by === "provider" ? "bg-provider-soft text-provider" : "bg-client-soft text-foreground"}`}>Added by {i.by === "provider" ? "Service Provider" : "Client"}</span>
                            </div>
                            <div className="flex shrink-0 flex-wrap items-center gap-2">
                              <StatusBadge s={i.status} />
                              {canReview && <>
                                <button onClick={() => setItem(i.id, "Approved")} className="inline-flex items-center gap-1 rounded-lg bg-success px-3 py-1 text-xs font-bold text-background"><Check className="h-3 w-3" aria-hidden />Approve</button>
                                <button onClick={() => setItem(i.id, "Needs changes")} className="inline-flex items-center gap-1 rounded-lg border border-destructive px-3 py-1 text-xs font-bold text-destructive"><MessageSquareWarning className="h-3 w-3" aria-hidden />Needs changes</button>
                              </>}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        ) : <p className="mt-6 text-muted-foreground">Accept the request first to see the agreement records.</p>}

        {as === "client" && a.status === "Accepted" && (
          <div className="mt-6 rounded-2xl border-2 border-foreground bg-card p-5">
            <p className="text-sm">{needsChanges ? "You've marked some items as needing changes. Approving the agreement will approve all items." : allApproved ? "All items approved. Ready to approve the agreement." : "Approve to accept all Documentation and Scope of Work."}</p>
            <button onClick={approveAll} className="mt-3 w-full rounded-full bg-success py-3 font-bold text-background">Approve agreement</button>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
