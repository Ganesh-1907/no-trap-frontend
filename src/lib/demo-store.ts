import { useEffect, useState } from "react";

// Demo-only store: lives in this browser's localStorage. Nothing is sent or stored on a server.
export type Party = "provider" | "client";
export type Section = "Documentation" | "Voice Records" | "Scope of Work";
export type ItemStatus = "Draft" | "Awaiting review" | "Approved" | "Needs changes" | "Saved";
export type Item = { id: string; section: Section; name: string; by: Party; status: ItemStatus };
export type AgStatus = "Draft" | "Waiting for client" | "Accepted" | "Approved";
export type Agreement = { id: string; title: string; status: AgStatus; items: Item[]; createdAt: number };

const KEY = "notrap-demo-agreements";
const EVT = "notrap-demo-change";

function readAll(): Record<string, Agreement> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}
function writeAll(all: Record<string, Agreement>) {
  localStorage.setItem(KEY, JSON.stringify(all));
  window.dispatchEvent(new Event(EVT));
}

export function newRequestId() {
  const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const pick = () => Array.from({ length: 4 }, () => c[Math.floor(Math.random() * c.length)]).join("");
  return `NT-${pick()}-${pick()}`;
}

export function getAgreement(id: string) { return readAll()[id.trim().toUpperCase()]; }

export function saveAgreement(a: Agreement) { const all = readAll(); all[a.id] = a; writeAll(all); }

export function updateAgreement(id: string, fn: (a: Agreement) => Agreement) {
  const a = getAgreement(id); if (a) saveAgreement(fn(a));
}

export function useAgreement(id: string | undefined) {
  const [a, setA] = useState<Agreement | undefined>(undefined);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const load = () => { setA(id ? getAgreement(id) : undefined); setReady(true); };
    load();
    window.addEventListener(EVT, load);
    window.addEventListener("storage", load);
    return () => { window.removeEventListener(EVT, load); window.removeEventListener("storage", load); };
  }, [id]);
  return { agreement: a, ready };
}

export const uid = () => Math.random().toString(36).slice(2, 10);
