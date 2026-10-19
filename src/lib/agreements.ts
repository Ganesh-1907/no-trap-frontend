import { useCallback, useEffect, useState } from "react";
import { api, getStoredUser, type SessionUser } from "./api";

// Agreements live in Postgres (via the NoTrap API); uploaded files live in Cloudflare R2 (item.assetId).
export type Party = "provider" | "client";
export type Section = "Documentation" | "Voice Records" | "Scope of Work";
export type ItemStatus = "Draft" | "Awaiting review" | "Approved" | "Needs changes" | "Saved";
export type AgStatus = "Draft" | "Waiting for client" | "Accepted" | "Approved" | "Cancelled";
export type Item = {
  id: string;
  section: Section;
  name: string;
  by: Party;
  status: ItemStatus;
  assetId?: string | undefined;
  note?: string | undefined;
};
export type Agreement = {
  id: string;
  title: string;
  status: AgStatus;
  items: Item[];
  createdAt: number;
  providerName: string;
  providerEmail: string;
  clientName: string;
  clientEmail: string;
  itemCount: number;
  approvedCount: number;
  changesCount: number;
  pendingCount: number;
  clientApprovedAt?: number | undefined;
  providerApprovedAt?: number | undefined;
  /** When a reminder was last emailed to whoever the agreement is waiting on. */
  lastRemindedAt?: number | undefined;
};

type SummaryRow = {
  id: string;
  title: string;
  status: string;
  created_at: string;
  provider_email: string;
  provider_first_name: string | null;
  provider_last_name: string | null;
  client_email: string;
  client_first_name: string | null;
  client_last_name: string | null;
  item_count: string | number;
  approved_item_count: string | number;
  changes_count: string | number;
  pending_count: string | number;
  client_approved_at: string | null;
  provider_approved_at: string | null;
};
type ItemRow = {
  id: string;
  section: Section;
  name: string;
  by: Party;
  status: string;
  asset_id: string | null;
  note: string | null;
};

const AG_STATUS: Record<string, AgStatus> = {
  draft: "Draft",
  waiting_for_client: "Waiting for client",
  accepted: "Accepted",
  approved: "Approved",
  cancelled: "Cancelled",
};
const ITEM_STATUS: Record<string, ItemStatus> = {
  draft: "Draft",
  awaiting_review: "Awaiting review",
  approved: "Approved",
  needs_changes: "Needs changes",
  saved: "Saved",
};

const fullName = (first: string | null, last: string | null, fallback: string) =>
  [first, last].filter(Boolean).join(" ") || fallback;

function toAgreement(r: SummaryRow, items: ItemRow[] = []): Agreement {
  return {
    id: r.id,
    title: r.title,
    status: AG_STATUS[r.status] ?? "Draft",
    createdAt: new Date(r.created_at).getTime(),
    providerName: fullName(r.provider_first_name, r.provider_last_name, r.provider_email),
    providerEmail: r.provider_email,
    clientName: fullName(r.client_first_name, r.client_last_name, r.client_email),
    clientEmail: r.client_email,
    itemCount: Number(r.item_count),
    approvedCount: Number(r.approved_item_count),
    changesCount: Number(r.changes_count),
    pendingCount: Number(r.pending_count),
    clientApprovedAt: r.client_approved_at ? new Date(r.client_approved_at).getTime() : undefined,
    providerApprovedAt: r.provider_approved_at
      ? new Date(r.provider_approved_at).getTime()
      : undefined,
    items: items.map((i) => ({
      id: i.id,
      section: i.section,
      name: i.name,
      by: i.by,
      status: ITEM_STATUS[i.status] ?? "Draft",
      assetId: i.asset_id ?? undefined,
      note: i.note ?? undefined,
    })),
  };
}

export async function listAgreements(): Promise<Agreement[]> {
  const { agreements } = await api<{ agreements: SummaryRow[] }>("/agreements");
  return agreements.map((r) => toAgreement(r));
}

export async function fetchAgreement(id: string): Promise<{ agreement: Agreement; side: Party }> {
  const data = await api<{
    agreement: SummaryRow;
    items: ItemRow[];
    side: Party;
    lastRemindedAt?: string | null;
  }>(`/agreements/${encodeURIComponent(id)}`);
  const agreement = toAgreement(data.agreement, data.items);
  if (data.lastRemindedAt) agreement.lastRemindedAt = new Date(data.lastRemindedAt).getTime();
  return { agreement, side: data.side };
}

export async function createAgreement(title: string, clientUserId: string): Promise<string> {
  const { agreement } = await api<{ agreement: { id: string } }>("/agreements", {
    method: "POST",
    body: JSON.stringify({ title, clientUserId }),
  });
  return agreement.id;
}

export const renameAgreement = (id: string, title: string) =>
  api(`/agreements/${id}`, { method: "PATCH", body: JSON.stringify({ title }) });

const STATUS_WIRE = {
  "Waiting for client": "waiting_for_client",
  Accepted: "accepted",
  Cancelled: "cancelled",
} as const;

/** Provider: send / cancel. Client: accept. */
export const setAgreementStatus = (id: string, status: keyof typeof STATUS_WIRE) =>
  api(`/agreements/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: STATUS_WIRE[status] }),
  });

export const addItem = (
  id: string,
  item: { section: Section; name: string; assetId?: string | undefined },
) => api(`/agreements/${id}/items`, { method: "POST", body: JSON.stringify(item) });

/** Client review decision. A note is required when asking for changes. */
export const reviewItem = (
  id: string,
  itemId: string,
  status: "Approved" | "Needs changes",
  note?: string,
) =>
  api(`/agreements/${id}/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ status: status === "Approved" ? "approved" : "needs_changes", note }),
  });

/** Provider: rename or replace the file on a draft / flagged item. */
export const replaceItem = (
  id: string,
  itemId: string,
  patch: { name?: string | undefined; assetId?: string | undefined },
) => api(`/agreements/${id}/items/${itemId}`, { method: "PATCH", body: JSON.stringify(patch) });

export const removeItem = (id: string, itemId: string) =>
  api(`/agreements/${id}/items/${itemId}`, { method: "DELETE" });

/** Email whoever the agreement is waiting on. The server allows one reminder per 24 hours. */
export const remindParty = (id: string) =>
  api(`/agreements/${id}/remind`, { method: "POST", body: "{}" });

export const REMINDER_COOLDOWN_MS = 24 * 60 * 60 * 1000;

/** Provider: permanently remove a draft or cancelled agreement (and its stored files). */
export const deleteAgreement = (id: string) => api(`/agreements/${id}`, { method: "DELETE" });

/** Client: email the provider the flagged items and notes. */
export const requestChanges = (id: string) =>
  api(`/agreements/${id}/request-changes`, { method: "POST", body: "{}" });

/** Provider: send fixed items back for another review. */
export const resubmit = (id: string) =>
  api(`/agreements/${id}/resubmit`, { method: "POST", body: "{}" });

/** Client sign-off (optionally approving every pending item at once). */
export const approveAgreement = (id: string, approveAll = false) =>
  api(`/agreements/${id}/approve`, { method: "POST", body: JSON.stringify({ approveAll }) });

/** Provider counter-signature: makes the agreement final. */
export const countersign = (id: string) =>
  api(`/agreements/${id}/countersign`, { method: "POST", body: "{}" });

export type ProviderLink = {
  link_id: string;
  provider_user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  business_name: string | null;
  linked_at: string;
};

export async function listMyProviders(): Promise<ProviderLink[]> {
  const res = await api<{ providers?: ProviderLink[] }>("/clients/my-providers");
  return res.providers ?? [];
}

/** Load one agreement from the API; call `refresh()` after any change. */
export function useAgreement(id: string | undefined) {
  const [agreement, setAgreement] = useState<Agreement | undefined>();
  const [side, setSide] = useState<Party>("provider");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!id) {
      setAgreement(undefined);
      setReady(true);
      return;
    }
    try {
      const r = await fetchAgreement(id);
      setAgreement(r.agreement);
      setSide(r.side);
      setError(null);
    } catch (err) {
      setAgreement(undefined);
      setError(err instanceof Error ? err.message : "Could not load agreement");
    } finally {
      setReady(true);
    }
  }, [id]);

  useEffect(() => {
    setReady(false);
    void refresh();
  }, [refresh]);

  return { agreement, side, ready, error, refresh };
}

/** Signed-in user, read after mount (localStorage isn't available during SSR). */
export function useSessionUser(): { user: SessionUser | null; ready: boolean } {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setUser(getStoredUser());
    setReady(true);
  }, []);
  return { user, ready };
}
