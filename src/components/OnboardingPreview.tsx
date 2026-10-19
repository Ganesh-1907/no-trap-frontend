import * as React from "react";
import {
  FileText,
  Mic,
  Check,
  CheckCircle2,
  Send,
  AlertCircle,
  Sparkles,
  Users,
  Clock,
  Layers,
  IndianRupee,
  Plus,
  Play,
  RotateCcw,
  ShieldCheck,
  MessageSquareWarning,
  Info,
} from "lucide-react";

type Role = "provider" | "client";
type Status = "Pending approval" | "Approved" | "Changes requested" | "Saved";
type Category = "All" | "Scope of Work" | "Change Request" | "Documentation" | "Voice Record";

interface RecordItem {
  id: number;
  kind: "Scope of Work" | "Change Request" | "Documentation" | "Voice Record";
  title: string;
  description: string;
  by: Role;
  authorName: string;
  timestamp: string;
  status: Status;
  extraMeta?: {
    scope?: string;
    cost?: string;
    time?: string;
    duration?: string;
  };
}

const initialRecords: RecordItem[] = [
  {
    id: 1,
    kind: "Scope of Work",
    title: "Core Scope: 5 Website Pages",
    description: "Home, About, Services, Portfolio, Contact & Lead Form with responsive layouts for mobile and desktop.",
    by: "provider",
    authorName: "Alex (Provider)",
    timestamp: "Agreed on kickoff",
    status: "Approved",
    extraMeta: {
      scope: "5 Pages",
      time: "4 Weeks",
      cost: "₹60,000",
    },
  },
  {
    id: 2,
    kind: "Change Request",
    title: "Change Request #01: Add 3 Pages (Blog, Case Studies, Pricing)",
    description: "Expansion request from client call. Explicitly recorded before starting design work to prevent scope creep.",
    by: "provider",
    authorName: "Alex (Provider)",
    timestamp: "Yesterday, 4:30 PM",
    status: "Pending approval",
    extraMeta: {
      scope: "+3 Pages",
      cost: "+₹15,000",
      time: "+5 Days",
    },
  },
  {
    id: 3,
    kind: "Documentation",
    title: "Brand Assets, Copy Deck & Figma Components",
    description: "High-resolution SVG logos, typographic hierarchy, brand color tokens, and approved copywriting deck.",
    by: "client",
    authorName: "Sarah (Client)",
    timestamp: "Kickoff Day 2",
    status: "Approved",
  },
  {
    id: 4,
    kind: "Voice Record",
    title: "Call Notes — Mobile Navigation & Payment Gateway",
    description: "Discussed hamburger menu animation and Razorpay integration requirements for client consultation booking.",
    by: "client",
    authorName: "Sarah (Client)",
    timestamp: "2 days ago",
    status: "Saved",
    extraMeta: {
      duration: "2m 14s",
    },
  },
  {
    id: 5,
    kind: "Documentation",
    title: "Revision Policy & Acceptance Milestones",
    description: "Two inclusive revision rounds per milestone; any further expansions handled via structured change requests.",
    by: "provider",
    authorName: "Alex (Provider)",
    timestamp: "Agreed on kickoff",
    status: "Approved",
  },
];

export function OnboardingPreview() {
  const [role, setRole] = React.useState<Role>("provider");
  const [records, setRecords] = React.useState<RecordItem[]>(initialRecords);
  const [activeCategory, setActiveCategory] = React.useState<Category>("All");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3500);
  };

  const handleStatusChange = (id: number, newStatus: Status) => {
    setRecords((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, status: newStatus } : rec))
    );
    if (newStatus === "Approved") {
      showToast("✓ Record approved and locked into shared agreement!");
    } else if (newStatus === "Changes requested") {
      showToast("💬 Revision requested. The other party has been notified.");
    }
  };

  const handleAddRecord = (kind: RecordItem["kind"]) => {
    const isVoice = kind === "Voice Record";
    const newId = Date.now();
    let newRec: RecordItem;

    if (kind === "Change Request") {
      newRec = {
        id: newId,
        kind: "Change Request",
        title: `Change Request #${records.filter((r) => r.kind === "Change Request").length + 1}: Additional Feature`,
        description: "New requested deliverable with upfront time & cost estimation for client approval.",
        by: role,
        authorName: role === "provider" ? "Alex (Provider)" : "Sarah (Client)",
        timestamp: "Just now",
        status: "Pending approval",
        extraMeta: {
          scope: "+1 Feature",
          cost: "+₹8,000",
          time: "+3 Days",
        },
      };
    } else if (isVoice) {
      newRec = {
        id: newId,
        kind: "Voice Record",
        title: `Voice Note: Quick requirement update`,
        description: "Simulated voice memo transcribed and stored in shared project history.",
        by: role,
        authorName: role === "provider" ? "Alex (Provider)" : "Sarah (Client)",
        timestamp: "Just now",
        status: "Saved",
        extraMeta: {
          duration: "1m 30s",
        },
      };
    } else if (kind === "Scope of Work") {
      newRec = {
        id: newId,
        kind: "Scope of Work",
        title: `Scope Addition: New Milestone Deliverable`,
        description: "Detailed specification of extra deliverables submitted for mutual sign-off.",
        by: role,
        authorName: role === "provider" ? "Alex (Provider)" : "Sarah (Client)",
        timestamp: "Just now",
        status: "Pending approval",
      };
    } else {
      newRec = {
        id: newId,
        kind: "Documentation",
        title: `Documentation: Updated Specifications`,
        description: "Supporting project specifications and technical requirements document.",
        by: role,
        authorName: role === "provider" ? "Alex (Provider)" : "Sarah (Client)",
        timestamp: "Just now",
        status: "Pending approval",
      };
    }

    setRecords((prev) => [newRec, ...prev]);
    showToast(`✓ New ${kind.toLowerCase()} submitted to shared agreement!`);
  };

  const handleReset = () => {
    setRecords(initialRecords);
    showToast("↺ Demo data reset to initial project state");
  };

  const filteredRecords = records.filter((r) => {
    if (activeCategory === "All") return true;
    return r.kind === activeCategory;
  });

  const pendingCount = records.filter((r) => r.status === "Pending approval").length;
  const approvedCount = records.filter((r) => r.status === "Approved").length;

  return (
    <section
      id="preview"
      aria-label="Interactive Onboarding Simulator"
      className="relative w-full py-20 sm:py-24 bg-background border-t border-[#EAE6DB] overflow-hidden"
    >
      {/* Background Soft Blobs */}
      <div className="absolute top-10 left-1/4 h-80 w-80 rounded-full bg-[#E5F6EE]/60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 h-80 w-80 rounded-full bg-[#FFF0E6]/60 blur-3xl pointer-events-none" />

      <div className="relative mx-auto w-full max-w-[1240px] px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto pb-12 sm:pb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#BCECD6] bg-[#D8F5E9] px-4 py-1.5 shadow-2xs">
            <Sparkles className="h-4 w-4 text-[#0B7C62] shrink-0" />
            <span className="text-xs sm:text-[13px] font-black tracking-wider text-[#0B7C62] uppercase">
              INTERACTIVE DEMO · NO SIGNUP NEEDED
            </span>
          </div>

          <h2 className="mt-4 font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#0D1527]">
            Try it: live agreement simulator
          </h2>

          <p className="mt-3.5 text-[#596780] text-base sm:text-lg leading-relaxed font-medium max-w-2xl mx-auto">
            Switch between the <b>Service Provider</b> and <b>Client</b> roles to experience how scope changes, voice records, and mutual sign-offs work with zero friction.
          </p>

          {/* Toast Notification Banner */}
          {toastMessage && (
            <div
              role="status"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#0D1527] px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-lg animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <span>{toastMessage}</span>
            </div>
          )}
        </div>

        {/* Role Switcher Tabs */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-3">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#69788D]">
              Select your perspective to take actions:
            </span>
          </div>

          <div
            role="radiogroup"
            aria-label="Choose your role"
            className="grid grid-cols-2 gap-2 p-2 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm"
          >
            {/* Service Provider Tab */}
            <button
              type="button"
              role="radio"
              aria-checked={role === "provider"}
              onClick={() => setRole("provider")}
              className={`flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl font-bold transition-all cursor-pointer ${
                role === "provider"
                  ? "bg-[#0B7C62] text-white shadow-md scale-[1.01]"
                  : "text-[#596780] hover:bg-background hover:text-[#0D1527]"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black transition-colors ${
                  role === "provider" ? "bg-white/20 text-white" : "bg-[#D8F5E9] text-[#0B7C62]"
                }`}
              >
                P
              </div>
              <div className="text-left">
                <span className="block text-sm sm:text-base font-extrabold leading-tight">
                  Service Provider
                </span>
                <span
                  className={`hidden sm:block text-[11px] leading-tight ${
                    role === "provider" ? "text-white/80" : "text-[#758496]"
                  }`}
                >
                  Propose scope &amp; changes
                </span>
              </div>
            </button>

            {/* Client Tab */}
            <button
              type="button"
              role="radio"
              aria-checked={role === "client"}
              onClick={() => setRole("client")}
              className={`flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl font-bold transition-all cursor-pointer ${
                role === "client"
                  ? "bg-[#F1592A] text-white shadow-md scale-[1.01]"
                  : "text-[#596780] hover:bg-background hover:text-[#0D1527]"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black transition-colors ${
                  role === "client" ? "bg-white/20 text-white" : "bg-[#FEF0E6] text-[#F1592A]"
                }`}
              >
                C
              </div>
              <div className="text-left">
                <span className="block text-sm sm:text-base font-extrabold leading-tight">
                  Client
                </span>
                <span
                  className={`hidden sm:block text-[11px] leading-tight ${
                    role === "client" ? "text-white/80" : "text-[#758496]"
                  }`}
                >
                  Review terms &amp; approve
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Main Agreement Workspace Card */}
        <div className="mt-8 rounded-3xl border border-[#E0E6E2] bg-white shadow-md overflow-hidden">
          {/* Top Bar: Agreement Details & Two-Party Presence */}
          <div className="bg-background border-b border-[#EAEFEA] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-foreground text-white shadow-xs">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-black text-lg sm:text-xl text-[#0D1527]">
                    Agreement #01: Website Redesign &amp; Scope Expansion
                  </h3>
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[#E5F6EE] px-2.5 py-0.5 text-xs font-bold text-[#0B7C62]">
                    <Check className="h-3 w-3 stroke-[3]" /> Active
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-[#69788D]">
                  <span>Viewing perspective:</span>
                  <span
                    className={`font-extrabold px-2 py-0.5 rounded-full ${
                      role === "provider"
                        ? "bg-[#D8F5E9] text-[#0B7C62]"
                        : "bg-[#FEF0E6] text-[#D9531E]"
                    }`}
                  >
                    {role === "provider" ? "Service Provider (Alex)" : "Client (Sarah)"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Party Presence Badges */}
            <div className="flex items-center gap-2 self-start md:self-auto text-xs">
              <div className="flex items-center gap-1.5 rounded-full border border-[#BCECD6] bg-[#E5F6EE] px-3 py-1 text-[#0B7C62] font-bold">
                <span className="h-2 w-2 rounded-full bg-[#0B7C62]" />
                <span>Alex (Signed)</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-[#FCD9C6] bg-[#FEF0E6] px-3 py-1 text-[#D9531E] font-bold">
                <span className="h-2 w-2 rounded-full bg-[#F1592A]" />
                <span>Sarah (Signed)</span>
              </div>
              <button
                type="button"
                onClick={handleReset}
                title="Reset simulator data"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D5DCD8] hover:bg-[#F2F6F4] text-[#69788D] hover:text-[#0D1527] transition cursor-pointer ml-1"
                aria-label="Reset demo data"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Project Metrics Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-5 bg-[#FDFBF7] border-b border-[#EAEFEA] text-xs">
            <div className="rounded-xl bg-white p-3 border border-[#ECEEEF]">
              <span className="text-[11px] uppercase font-bold text-[#8896A6] block">
                Agreed Scope
              </span>
              <span className="font-extrabold text-[#0D1527] text-sm sm:text-base">
                5 Pages <span className="text-[#F1592A] text-xs">(+3 Pending)</span>
              </span>
            </div>
            <div className="rounded-xl bg-white p-3 border border-[#ECEEEF]">
              <span className="text-[11px] uppercase font-bold text-[#8896A6] block">
                Timeline
              </span>
              <span className="font-extrabold text-[#0D1527] text-sm sm:text-base">
                4 Weeks <span className="text-[#F1592A] text-xs">(+5 Days)</span>
              </span>
            </div>
            <div className="rounded-xl bg-white p-3 border border-[#ECEEEF]">
              <span className="text-[11px] uppercase font-bold text-[#8896A6] block">
                Agreed Budget
              </span>
              <span className="font-extrabold text-[#0D1527] text-sm sm:text-base">
                ₹60,000 <span className="text-[#F1592A] text-xs">(+₹15,000)</span>
              </span>
            </div>
            <div className="rounded-xl bg-white p-3 border border-[#ECEEEF]">
              <span className="text-[11px] uppercase font-bold text-[#8896A6] block">
                Dispute Status
              </span>
              <span className="font-extrabold text-[#0B7C62] text-sm sm:text-base flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> 0 Disputes
              </span>
            </div>
          </div>

          {/* Actions & Role Specific Instructions */}
          <div className="p-5 sm:p-6 bg-white border-b border-[#F0F2F4]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-extrabold text-[#8A98A8] block">
                  Interactive Simulator Actions
                </span>
                <p className="text-xs sm:text-sm font-semibold text-[#0D1527] mt-0.5">
                  {role === "provider"
                    ? "As Provider: Submit scope changes, send documentation, or record voice memos."
                    : "As Client: Review incoming requests, approve/request revisions, or add voice notes."}
                </p>
              </div>

              {/* Action Buttons based on Role */}
              <div className="flex flex-wrap items-center gap-2">
                {role === "provider" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleAddRecord("Change Request")}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#FEF0E6] hover:bg-[#FCD9C6] text-[#D9531E] px-3.5 py-2 text-xs font-bold transition cursor-pointer border border-[#FCD9C6]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Propose Change</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddRecord("Scope of Work")}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B7C62] hover:bg-[#096650] text-white px-3.5 py-2 text-xs font-bold transition cursor-pointer shadow-xs"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Send Scope</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddRecord("Voice Record")}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#D5DCD8] bg-white hover:bg-background text-[#0D1527] px-3.5 py-2 text-xs font-bold transition cursor-pointer"
                    >
                      <Mic className="h-3.5 w-3.5 text-[#F1592A]" />
                      <span>Record Voice Note</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setRecords((prev) =>
                          prev.map((r) =>
                            r.status === "Pending approval" ? { ...r, status: "Approved" } : r
                          )
                        );
                        showToast("✓ All pending requests approved by client!");
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B7C62] hover:bg-[#096650] text-white px-3.5 py-2 text-xs font-bold transition cursor-pointer shadow-xs"
                    >
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                      <span>Approve Pending ({pendingCount})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddRecord("Voice Record")}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#D5DCD8] bg-white hover:bg-background text-[#0D1527] px-3.5 py-2 text-xs font-bold transition cursor-pointer"
                    >
                      <Mic className="h-3.5 w-3.5 text-[#F1592A]" />
                      <span>Add Voice Feedback</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {role === "client" && (
              <div className="mt-3.5 flex items-center gap-2 rounded-xl bg-[#FFF8F3] border border-[#FCD9C6] p-2.5 text-xs text-[#A2522B]">
                <Info className="h-4 w-4 shrink-0 text-[#F1592A]" />
                <span>
                  <b>Client Note:</b> You have authority to review change requests and release payments. Scope only updates after your written sign-off.
                </span>
              </div>
            )}
          </div>

          {/* Filter Category Chips */}
          <div className="bg-background px-5 sm:px-6 py-3 border-b border-[#EAEFEA] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              {(["All", "Scope of Work", "Change Request", "Documentation", "Voice Record"] as Category[]).map(
                (cat) => {
                  const count =
                    cat === "All"
                      ? records.length
                      : records.filter((r) => r.kind === cat).length;
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 rounded-full font-bold transition cursor-pointer ${
                        isActive
                          ? "bg-[#0D1527] text-white"
                          : "bg-white text-[#69788D] border border-[#ECEEEF] hover:bg-[#F2F6F4]"
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                }
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-[#69788D]">
              <span className="flex items-center gap-1 font-bold text-[#0B7C62]">
                <span className="h-2 w-2 rounded-full bg-[#0B7C62]" />
                {approvedCount} Approved
              </span>
              <span className="flex items-center gap-1 font-bold text-[#F1592A]">
                <span className="h-2 w-2 rounded-full bg-[#F1592A]" />
                {pendingCount} Pending
              </span>
            </div>
          </div>

          {/* Record Items List */}
          <div className="divide-y divide-[#F0F2F4]">
            {filteredRecords.map((item) => {
              const isPending = item.status === "Pending approval";
              const isApproved = item.status === "Approved";
              const isChangeRequested = item.status === "Changes requested";
              const isClient = role === "client";

              return (
                <div
                  key={item.id}
                  className={`p-5 sm:p-6 transition-colors ${
                    isPending ? "bg-[#FFFDF9]" : "hover:bg-background/50"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Record Info */}
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Kind Tag */}
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider ${
                            item.kind === "Change Request"
                              ? "bg-[#FEF0E6] text-[#D9531E] border border-[#FCD9C6]"
                              : item.kind === "Scope of Work"
                              ? "bg-[#E5F6EE] text-[#0B7C62] border border-[#BCECD6]"
                              : item.kind === "Voice Record"
                              ? "bg-[#F3EEFF] text-[#6938D3] border border-[#E1D4FC]"
                              : "bg-[#EBF3FE] text-[#1E60D9] border border-[#CDE1FD]"
                          }`}
                        >
                          {item.kind}
                        </span>

                        {/* Author */}
                        <span className="text-xs text-[#69788D] flex items-center gap-1">
                          <span>by</span>
                          <b className="text-[#0D1527]">{item.authorName}</b>
                        </span>

                        <span className="text-xs text-[#8A98A8]">· {item.timestamp}</span>
                      </div>

                      {/* Title */}
                      <h4 className="font-display font-extrabold text-base sm:text-lg text-[#0D1527]">
                        {item.title}
                      </h4>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-[#596780] leading-relaxed">
                        {item.description}
                      </p>

                      {/* Extra Metadata Pill (Scope, Cost, Time) */}
                      {item.extraMeta && (
                        <div className="pt-1.5 flex flex-wrap items-center gap-2 text-xs">
                          {item.extraMeta.scope && (
                            <span className="inline-flex items-center gap-1 rounded-lg bg-[#FEF0E6] px-2.5 py-1 font-bold text-[#D9531E] border border-[#FCD9C6]">
                              <Plus className="h-3 w-3 stroke-[3]" /> Scope: {item.extraMeta.scope}
                            </span>
                          )}
                          {item.extraMeta.cost && (
                            <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 font-extrabold text-[#0D1527] border border-[#ECEEEF]">
                              <IndianRupee className="h-3 w-3 text-[#F1592A]" /> Cost: {item.extraMeta.cost}
                            </span>
                          )}
                          {item.extraMeta.time && (
                            <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 font-bold text-[#596780] border border-[#ECEEEF]">
                              <Clock className="h-3 w-3" /> Timeline: {item.extraMeta.time}
                            </span>
                          )}
                          {item.extraMeta.duration && (
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F3EEFF] px-2.5 py-1 font-bold text-[#6938D3] border border-[#E1D4FC]">
                              <Play className="h-3 w-3 fill-current" /> Play memo ({item.extraMeta.duration})
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions and Status */}
                    <div className="flex flex-wrap items-center gap-3 self-start lg:self-center shrink-0">
                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${
                          isApproved
                            ? "bg-[#E5F6EE] text-[#0B7C62] border border-[#BCECD6]"
                            : isPending
                            ? "bg-[#FEF0E6] text-[#D9531E] border border-[#FCD9C6]"
                            : isChangeRequested
                            ? "bg-[#FEECEB] text-[#D92D20] border border-[#FECDCA]"
                            : "bg-[#F2F4F7] text-[#344054] border border-[#EAECF0]"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {item.status}
                      </span>

                      {/* Interactive Client Review Actions */}
                      {isClient && isPending && (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(item.id, "Approved")}
                            className="inline-flex items-center gap-1 rounded-full bg-[#0B7C62] hover:bg-[#096650] text-white px-3.5 py-1.5 text-xs font-bold transition cursor-pointer shadow-xs"
                          >
                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                            <span>Approve</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(item.id, "Changes requested")}
                            className="inline-flex items-center gap-1 rounded-full border border-[#D5DCD8] hover:border-[#D92D20] hover:text-[#D92D20] bg-white px-3 py-1.5 text-xs font-bold text-[#596780] transition cursor-pointer"
                          >
                            <MessageSquareWarning className="h-3.5 w-3.5" />
                            <span>Revise</span>
                          </button>
                        </div>
                      )}

                      {/* Undo Action if already approved */}
                      {isClient && (isApproved || isChangeRequested) && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(item.id, "Pending approval")}
                          className="text-[11px] font-bold text-[#8A98A8] hover:text-[#0D1527] underline cursor-pointer"
                        >
                          Reset status
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
