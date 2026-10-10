import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { SiteShell, StatusBadge, Proto } from "@/components/site";
import { getAgreement, updateAgreement, useAgreement, type Section } from "@/lib/demo-store";

export const Route = createFileRoute("/client")({
  validateSearch: (s: Record<string, unknown>) => ({ id: typeof s.id === "string" ? s.id : undefined }),
  head: () => ({
    meta: [
      { title: "Open a request — NoTrap.co" },
      { name: "description", content: "Enter the Request ID from your service provider to review and accept the agreement." },
      { property: "og:title", content: "Open a request — NoTrap.co" },
      { property: "og:description", content: "Clients: enter a Request ID to review an agreement." },
    ],
  }),
  component: Client,
});

function Client() {
  const { id } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [input, setInput] = useState(id ?? "");
  const [err, setErr] = useState<string | null>(null);
  const { agreement: a } = useAgreement(id);

  const lookup = (e: React.FormEvent) => {
    e.preventDefault();
    const v = input.trim().toUpperCase();
    const found = getAgreement(v);
    if (!found || found.status === "Draft") { setErr("No sent request found with that ID in this browser (demo only)."); return; }
    setErr(null); navigate({ search: { id: v } });
  };
  const accept = () => {
    if (!a) return;
    updateAgreement(a.id, (x) => ({ ...x, status: "Accepted" }));
    navigate({ to: "/agreement/$id", params: { id: a.id }, search: { as: "client" } });
  };
  const count = (s: Section) => a?.items.filter((i) => i.section === s).length ?? 0;

  return (
    <SiteShell>
      <section className="mx-auto max-w-2xl px-4 py-12">
        <div className="flex flex-wrap items-center gap-3"><h1 className="font-display text-3xl font-extrabold">Open a request</h1><Proto>Demo only</Proto></div>
        <p className="mt-1 text-sm text-muted-foreground">Enter the Request ID your service provider shared with you.</p>
        <form onSubmit={lookup} className="mt-6 flex gap-2">
          <label htmlFor="rid" className="sr-only">Request ID</label>
          <input id="rid" value={input} onChange={(e) => setInput(e.target.value)} placeholder="NT-XXXX-XXXX" className="min-w-0 flex-1 rounded-lg border-2 border-foreground bg-card px-3 py-3 font-mono text-lg uppercase tracking-wider" />
          <button className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-client px-5 font-bold"><Search className="h-4 w-4" aria-hidden />Find</button>
        </form>
        {err && <p role="alert" className="mt-3 text-sm text-destructive">{err}</p>}
        <p className="mt-2 text-xs text-muted-foreground">Tip: in this demo, create a request on the Provider page in the same browser first.</p>

        {a && a.status !== "Draft" && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Request from Service Provider</p><StatusBadge s={a.status} /></div>
            <p className="mt-1 font-mono text-xl font-bold">{a.id}</p>
            <h2 className="mt-3 font-display text-2xl font-extrabold">{a.title}</h2>
            <ul className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
              {(["Documentation", "Voice Records", "Scope of Work"] as Section[]).map((s) => <li key={s} className="rounded-lg bg-muted p-2"><b className="block text-lg">{count(s)}</b>{s}</li>)}
            </ul>
            {a.status === "Waiting for client"
              ? <button onClick={accept} className="mt-6 w-full rounded-full bg-foreground py-3 font-bold text-background">Accept request</button>
              : <Link to="/agreement/$id" params={{ id: a.id }} search={{ as: "client" }} className="mt-6 block w-full rounded-full bg-foreground py-3 text-center font-bold text-background">Open agreement</Link>}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
