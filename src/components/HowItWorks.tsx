import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  FileText,
  FileCheck,
  CheckCircle2,
  Check,
  Plus,
  ArrowRight,
  ShieldCheck,
  Users,
  AlertCircle,
  IndianRupee,
  Calendar,
  Layers,
  Lock,
  Sparkles,
  MessageSquare,
} from "lucide-react";

export function HowItWorks() {
  // Interactive change-request approval state for Step 3
  const [isStep3Approved, setIsStep3Approved] = React.useState(false);

  // Active step tracking via IntersectionObserver
  const [activeStep, setActiveStep] = React.useState<number>(1);
  const stepRefs = [
    React.useRef<HTMLDivElement>(null),
    React.useRef<HTMLDivElement>(null),
    React.useRef<HTMLDivElement>(null),
    React.useRef<HTMLDivElement>(null),
  ];

  React.useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    const observers: IntersectionObserver[] = [];

    stepRefs.forEach((ref, index) => {
      if (!ref.current) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveStep(index + 1);
            }
          });
        },
        {
          root: null,
          rootMargin: "-20% 0px -20% 0px",
          threshold: 0.25,
        }
      );

      observer.observe(ref.current);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return (
    <section
      id="how-it-works"
      aria-label="How NoTrap Works — From First Agreement to Final Delivery"
      className="relative w-full py-20 sm:py-24 lg:py-28 bg-background overflow-hidden border-t border-[#EAE6DB]"
    >
      {/* Background Soft Organic Shapes */}
      <div className="absolute top-1/4 -left-40 h-96 w-96 rounded-full bg-[#E8F5EF]/60 blur-3xl pointer-events-none" />
      <div className="absolute top-2/3 -right-40 h-96 w-96 rounded-full bg-[#FFF0E6]/50 blur-3xl pointer-events-none" />

      <div className="relative mx-auto w-full max-w-[1280px] px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto pb-14 sm:pb-18 lg:pb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#BCECD6] bg-[#D8F5E9] px-4 py-1.5 shadow-2xs">
            <ShieldCheck className="h-4 w-4 text-[#0B7C62] shrink-0" />
            <span className="text-xs sm:text-[13px] font-black tracking-wider text-[#0B7C62] uppercase">
              HOW NOTRAP WORKS
            </span>
          </div>

          <h2 className="mt-4 font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#0D1527]">
            One shared journey. Zero confusion.
          </h2>

          <p className="mt-4 text-[#596780] text-base sm:text-lg lg:text-xl leading-relaxed font-medium max-w-2xl mx-auto">
            From the first requirement to final project completion, both sides stay aligned through a clear agreement and approval process.
          </p>
        </div>

        {/* Timeline Steps Container */}
        <div className="relative">
          {/* Desktop Central Spine Timeline Line */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute left-1/2 top-24 bottom-24 -translate-x-1/2 w-0.5 bg-[#DFECE3]"
          >
            {/* Dynamic progress highlight */}
            <div
              className="w-full bg-[#0B7C62] transition-all duration-500 ease-out rounded-full"
              style={{
                height: `${Math.min(100, Math.max(0, ((activeStep - 1) / 3) * 100))}%`,
              }}
            />
          </div>

          {/* ======================================================== */}
          {/* STEP 1: CREATE AN AGREEMENT */}
          {/* ======================================================== */}
          <div
            ref={stepRefs[0]}
            className="relative pb-16 sm:pb-20 lg:pb-28"
          >
            {/* Mobile Vertical Spine Left Connector */}
            <div
              aria-hidden="true"
              className="lg:hidden absolute left-4 top-2 bottom-0 w-0.5 bg-[#DFECE3]"
            />
            <div
              aria-hidden="true"
              className="lg:hidden absolute left-1.5 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#0B7C62] text-white text-xs font-black shadow-xs ring-4 ring-[#FAF7F2] z-10"
            >
              01
            </div>

            <div className="pl-12 lg:pl-0 relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 xl:gap-28 items-center">
              {/* Desktop Center Numbered Node */}
              <div
                aria-hidden="true"
                className={`hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 rounded-full font-display font-black text-sm items-center justify-center transition-all duration-300 z-10 shadow-sm ${
                  activeStep >= 1
                    ? "bg-[#0B7C62] text-white ring-4 ring-[#D8F5E9] scale-105 shadow-md"
                    : "bg-white text-[#758496] border-2 border-[#D5DCD8]"
                }`}
              >
                01
              </div>

              {/* Desktop Left: Illustration & Floating Document Card */}
              <div className="relative order-2 lg:order-1">
                <div className="rounded-3xl border border-[#E5EAE7] bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
                  {/* Service provider illustration frame */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#ECEFF1] bg-background">
                    <img
                      src="/story-scene-1.png"
                      alt="Service provider creating a website project agreement on his laptop"
                      className="h-full w-full object-cover select-none"
                      loading="lazy"
                    />
                    {/* Floating pill tag */}
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-[#BCECD6] bg-white/95 px-3 py-1 shadow-xs backdrop-blur-xs">
                      <span className="h-2 w-2 rounded-full bg-[#0B7C62]" />
                      <span className="text-xs font-extrabold text-[#0B7C62]">Agreement Created</span>
                    </div>
                  </div>

                  {/* Floating Document Card with Checklist */}
                  <div className="mt-3.5 rounded-2xl border border-[#E2E8F0] bg-background p-3.5 sm:p-4">
                    <div className="flex items-center justify-between pb-2 border-b border-[#EAEFEA]">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[#0B7C62]" />
                        <span className="text-xs sm:text-sm font-bold text-[#0D1527]">
                          Website Agreement #01
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#E5F6EE] px-2 py-0.5 text-[11px] font-bold text-[#0B7C62]">
                        <Check className="h-3 w-3 stroke-[3]" /> Draft Ready
                      </span>
                    </div>

                    <div className="mt-3 space-y-2 text-xs">
                      <div className="flex items-center justify-between rounded-lg bg-white p-2 border border-[#ECEEEF]">
                        <span className="text-[#69788D]">Scope:</span>
                        <span className="font-bold text-[#0D1527]">5 Website Pages</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-white p-2 border border-[#ECEEEF]">
                        <span className="text-[#69788D]">Timeline:</span>
                        <span className="font-bold text-[#0D1527]">4 Weeks Total</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-white p-2 border border-[#ECEEEF]">
                        <span className="text-[#69788D]">Revision Limits:</span>
                        <span className="font-bold text-[#0D1527]">2 Feedback Rounds</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-white p-2 border border-[#ECEEEF]">
                        <span className="text-[#69788D]">Payment Terms:</span>
                        <span className="font-bold text-[#0B7C62]">50% upfront, 50% on delivery</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Right: Content & Value Chips */}
              <div className="order-1 lg:order-2 space-y-4 sm:space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#BCECD6] bg-[#D8F5E9] px-3 py-1">
                  <span className="text-xs font-black tracking-wider text-[#0B7C62] uppercase">
                    STEP 01 — CREATE AN AGREEMENT
                  </span>
                </div>

                <h3 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-[#0D1527]">
                  Every great project starts with clarity.
                </h3>

                <p className="text-[#596780] text-base sm:text-lg leading-relaxed font-medium">
                  Whether you're a service provider or a client, start by defining the requirements, deliverables, timeline, revision limits, and payment terms.
                </p>

                {/* Feature Chips */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5 rounded-xl bg-white p-3 border border-[#E5EAE7] shadow-2xs">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#D8F5E9] text-[#0B7C62]">
                      <FileText className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-[#0D1527]">Clear deliverables defined</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl bg-white p-3 border border-[#E5EAE7] shadow-2xs">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#D8F5E9] text-[#0B7C62]">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-[#0D1527]">4-week agreed timeline</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl bg-white p-3 border border-[#E5EAE7] shadow-2xs">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#D8F5E9] text-[#0B7C62]">
                      <Layers className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-[#0D1527]">Explicit revision limits</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl bg-white p-3 border border-[#E5EAE7] shadow-2xs">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#D8F5E9] text-[#0B7C62]">
                      <IndianRupee className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-[#0D1527]">Fair payment structure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* STEP 2: REVIEW & APPROVE */}
          {/* ======================================================== */}
          <div
            ref={stepRefs[1]}
            className="relative pb-16 sm:pb-20 lg:pb-28"
          >
            {/* Mobile Vertical Spine Left Connector */}
            <div
              aria-hidden="true"
              className="lg:hidden absolute left-4 top-2 bottom-0 w-0.5 bg-[#DFECE3]"
            />
            <div
              aria-hidden="true"
              className="lg:hidden absolute left-1.5 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#0B7C62] text-white text-xs font-black shadow-xs ring-4 ring-[#FAF7F2] z-10"
            >
              02
            </div>

            <div className="pl-12 lg:pl-0 relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 xl:gap-28 items-center">
              {/* Desktop Center Numbered Node */}
              <div
                aria-hidden="true"
                className={`hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 rounded-full font-display font-black text-sm items-center justify-center transition-all duration-300 z-10 shadow-sm ${
                  activeStep >= 2
                    ? "bg-[#0B7C62] text-white ring-4 ring-[#D8F5E9] scale-105 shadow-md"
                    : "bg-white text-[#758496] border-2 border-[#D5DCD8]"
                }`}
              >
                02
              </div>

              {/* Desktop Left: Content & Value Chips */}
              <div className="space-y-4 sm:space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#BCECD6] bg-[#D8F5E9] px-3 py-1">
                  <span className="text-xs font-black tracking-wider text-[#0B7C62] uppercase">
                    STEP 02 — REVIEW &amp; APPROVE
                  </span>
                </div>

                <h3 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-[#0D1527]">
                  Same terms. Same understanding.
                </h3>

                <p className="text-[#596780] text-base sm:text-lg leading-relaxed font-medium">
                  Both sides review the proposed agreement, request corrections if needed, and approve the final terms, including payment milestones.
                </p>

                {/* Feature Chips */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5 rounded-xl bg-white p-3 border border-[#E5EAE7] shadow-2xs">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#D8F5E9] text-[#0B7C62]">
                      <Users className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-[#0D1527]">Both sides review together</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl bg-white p-3 border border-[#E5EAE7] shadow-2xs">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#D8F5E9] text-[#0B7C62]">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-[#0D1527]">Instant corrections if needed</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl bg-white p-3 border border-[#E5EAE7] shadow-2xs">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#D8F5E9] text-[#0B7C62]">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-[#0D1527]">Mutual written approval</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl bg-white p-3 border border-[#E5EAE7] shadow-2xs">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#D8F5E9] text-[#0B7C62]">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-[#0D1527]">Milestone payment locked</span>
                  </div>
                </div>
              </div>

              {/* Desktop Right: Illustration & Dual-Approval Card */}
              <div className="relative">
                <div className="rounded-3xl border border-[#E5EAE7] bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
                  {/* Both characters reviewing frame */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#ECEFF1] bg-background">
                    <img
                      src="/story-scene-3.png"
                      alt="Provider and client reviewing the same agreement document and payment milestones"
                      className="h-full w-full object-cover select-none"
                      loading="lazy"
                    />
                    {/* Floating pill tag */}
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-[#BCECD6] bg-white/95 px-3 py-1 shadow-xs backdrop-blur-xs">
                      <Check className="h-3.5 w-3.5 text-[#0B7C62] stroke-[3]" />
                      <span className="text-xs font-extrabold text-[#0B7C62]">Approved by Both</span>
                    </div>
                  </div>

                  {/* Floating Dual Sign-off & Milestones Card */}
                  <div className="mt-3.5 rounded-2xl border border-[#BCECD6] bg-[#F4FBF7] p-3.5 sm:p-4">
                    <div className="flex items-center justify-between pb-2 border-b border-[#D8F0E2]">
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-[#0B7C62]" />
                        <span className="text-xs sm:text-sm font-bold text-[#0D1527]">
                          Mutual Approval &amp; Milestones
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#E5F6EE] px-2 py-0.5 text-[11px] font-bold text-[#0B7C62]">
                        <Check className="h-3 w-3 stroke-[3]" /> Legally Signed
                      </span>
                    </div>

                    <div className="mt-3 space-y-2 text-xs">
                      {/* Provider Signature */}
                      <div className="flex items-center justify-between rounded-lg bg-white p-2 border border-[#E2EBE5]">
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0B7C62] text-[11px] font-bold text-white">
                            P
                          </span>
                          <span className="font-semibold text-[#0D1527]">Service Provider</span>
                        </div>
                        <span className="font-bold text-[#0B7C62] flex items-center gap-1">
                          <Check className="h-3.5 w-3.5 stroke-[3]" /> Signed &amp; Committed
                        </span>
                      </div>

                      {/* Client Signature */}
                      <div className="flex items-center justify-between rounded-lg bg-white p-2 border border-[#E2EBE5]">
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F1592A] text-[11px] font-bold text-white">
                            C
                          </span>
                          <span className="font-semibold text-[#0D1527]">Client Sign-off</span>
                        </div>
                        <span className="font-bold text-[#0B7C62] flex items-center gap-1">
                          <Check className="h-3.5 w-3.5 stroke-[3]" /> Terms Approved
                        </span>
                      </div>

                      {/* Payment Milestone */}
                      <div className="flex items-center justify-between rounded-lg bg-[#E5F6EE]/60 p-2 border border-[#BCECD6] text-[11px]">
                        <span className="text-[#0B7C62] font-semibold">Milestone 1 (50% Deposit):</span>
                        <span className="font-extrabold text-[#0B7C62]">Secured in Escrow ✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* STEP 3: CHANGES WITHOUT CONFUSION */}
          {/* ======================================================== */}
          <div
            ref={stepRefs[2]}
            className="relative pb-16 sm:pb-20 lg:pb-28"
          >
            {/* Mobile Vertical Spine Left Connector */}
            <div
              aria-hidden="true"
              className="lg:hidden absolute left-4 top-2 bottom-0 w-0.5 bg-[#DFECE3]"
            />
            <div
              aria-hidden="true"
              className="lg:hidden absolute left-1.5 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#0B7C62] text-white text-xs font-black shadow-xs ring-4 ring-[#FAF7F2] z-10"
            >
              03
            </div>

            <div className="pl-12 lg:pl-0 relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 xl:gap-28 items-center">
              {/* Desktop Center Numbered Node */}
              <div
                aria-hidden="true"
                className={`hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 rounded-full font-display font-black text-sm items-center justify-center transition-all duration-300 z-10 shadow-sm ${
                  activeStep >= 3
                    ? "bg-[#0B7C62] text-white ring-4 ring-[#D8F5E9] scale-105 shadow-md"
                    : "bg-white text-[#758496] border-2 border-[#D5DCD8]"
                }`}
              >
                03
              </div>

              {/* Desktop Left: Illustration & Interactive Change Request Card */}
              <div className="relative order-2 lg:order-1">
                <div className="rounded-3xl border border-[#FCD9C6] bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
                  {/* Client requesting change frame */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#ECEFF1] bg-background">
                    <img
                      src="/story-scene-2.png"
                      alt="Client requesting additional website pages and provider reviewing"
                      className="h-full w-full object-cover select-none"
                      loading="lazy"
                    />
                    {/* Floating pill tag */}
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-[#FCD9C6] bg-white/95 px-3 py-1 shadow-xs backdrop-blur-xs">
                      <span className="h-2 w-2 rounded-full bg-[#F1592A]" />
                      <span className="text-xs font-extrabold text-[#D9531E]">
                        {isStep3Approved ? "Change Approved" : "Change Requested"}
                      </span>
                    </div>
                  </div>

                  {/* Floating Change-Request Card with Demo Values */}
                  <div
                    className={`mt-3.5 rounded-2xl border p-3.5 sm:p-4 transition-colors ${
                      isStep3Approved
                        ? "border-[#BCECD6] bg-[#F4FBF7]"
                        : "border-[#FCD9C6] bg-[#FFF8F3]"
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#F5E1D4]">
                      <div className="flex items-center gap-2">
                        <AlertCircle
                          className={`h-4 w-4 ${isStep3Approved ? "text-[#0B7C62]" : "text-[#F1592A]"}`}
                        />
                        <span className="text-xs sm:text-sm font-bold text-[#0D1527]">
                          Change Request #01
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                          isStep3Approved
                            ? "bg-[#E5F6EE] text-[#0B7C62]"
                            : "bg-[#FEF0E6] text-[#D9531E]"
                        }`}
                      >
                        {isStep3Approved ? (
                          <>
                            <Check className="h-3 w-3 stroke-[3]" /> Approved &amp; Added to Scope
                          </>
                        ) : (
                          "Pending Approval"
                        )}
                      </span>
                    </div>

                    {/* 3 Highlighted Demo Values */}
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="rounded-xl bg-white p-2.5 border border-[#ECEEEF]">
                        <span className="text-[11px] uppercase font-bold text-[#8896A6] block">
                          Scope
                        </span>
                        <span className="font-extrabold text-[#D9531E] text-sm">+3 Pages</span>
                      </div>
                      <div className="rounded-xl bg-white p-2.5 border border-[#ECEEEF]">
                        <span className="text-[11px] uppercase font-bold text-[#8896A6] block">
                          Extra Cost
                        </span>
                        <span className="font-extrabold text-[#0D1527] text-sm">+₹15,000</span>
                      </div>
                      <div className="rounded-xl bg-white p-2.5 border border-[#ECEEEF]">
                        <span className="text-[11px] uppercase font-bold text-[#8896A6] block">
                          Extra Time
                        </span>
                        <span className="font-extrabold text-[#0D1527] text-sm">+5 Days</span>
                      </div>
                    </div>

                    {/* Interactive Simulator Button */}
                    <div className="mt-3 pt-2.5 border-t border-[#F5E1D4] flex items-center justify-between gap-2">
                      <span className="text-[11px] text-[#69788D] italic">
                        {isStep3Approved
                          ? "✓ Scope officially updated in project."
                          : "Scope updates only after approval."}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsStep3Approved(!isStep3Approved)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                          isStep3Approved
                            ? "bg-[#E5F6EE] text-[#0B7C62] hover:bg-[#D5EFE1]"
                            : "bg-foreground text-white hover:bg-[#182638] shadow-xs"
                        }`}
                      >
                        {isStep3Approved ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Approved (Undo)</span>
                          </>
                        ) : (
                          <>
                            <span>Approve change</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Right: Content & Value Chips */}
              <div className="order-1 lg:order-2 space-y-4 sm:space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#FCD9C6] bg-[#FEF0E6] px-3 py-1">
                  <span className="text-xs font-black tracking-wider text-[#D9531E] uppercase">
                    STEP 03 — CHANGES WITHOUT CONFUSION
                  </span>
                </div>

                <h3 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-[#0D1527]">
                  New requirements? No surprises.
                </h3>

                <p className="text-[#596780] text-base sm:text-lg leading-relaxed font-medium">
                  Either party can propose a change. The receiving party reviews the updated scope, cost, and timeline before approving it. Approved changes become part of the shared project record.
                </p>

                {/* Feature Chips */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5 rounded-xl bg-white p-3 border border-[#E5EAE7] shadow-2xs">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FEF0E6] text-[#D9531E]">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-[#0D1527]">Zero verbal misunderstandings</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl bg-white p-3 border border-[#E5EAE7] shadow-2xs">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FEF0E6] text-[#D9531E]">
                      <Plus className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-[#0D1527]">Transparent +3 pages added</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl bg-white p-3 border border-[#E5EAE7] shadow-2xs">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FEF0E6] text-[#D9531E]">
                      <IndianRupee className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-[#0D1527]">+₹15,000 cost upfront</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl bg-white p-3 border border-[#E5EAE7] shadow-2xs">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#D8F5E9] text-[#0B7C62]">
                      <Check className="h-4 w-4 stroke-[3]" />
                    </div>
                    <span className="font-bold text-[#0D1527]">Scope updates after approval</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* STEP 4: COMPLETE WITH CONFIDENCE */}
          {/* ======================================================== */}
          <div
            ref={stepRefs[3]}
            className="relative pb-12 sm:pb-16 lg:pb-20"
          >
            {/* Mobile Vertical Spine Left Connector */}
            <div
              aria-hidden="true"
              className="lg:hidden absolute left-4 top-2 bottom-0 w-0.5 bg-[#DFECE3]"
            />
            <div
              aria-hidden="true"
              className="lg:hidden absolute left-1.5 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#0B7C62] text-white text-xs font-black shadow-xs ring-4 ring-[#FAF7F2] z-10"
            >
              04
            </div>

            <div className="pl-12 lg:pl-0 relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 xl:gap-28 items-center">
              {/* Desktop Center Numbered Node */}
              <div
                aria-hidden="true"
                className={`hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 rounded-full font-display font-black text-sm items-center justify-center transition-all duration-300 z-10 shadow-sm ${
                  activeStep >= 4
                    ? "bg-[#0B7C62] text-white ring-4 ring-[#D8F5E9] scale-105 shadow-md"
                    : "bg-white text-[#758496] border-2 border-[#D5DCD8]"
                }`}
              >
                04
              </div>

              {/* Desktop Left: Content & Value Chips */}
              <div className="space-y-4 sm:space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#BCECD6] bg-[#D8F5E9] px-3 py-1">
                  <span className="text-xs font-black tracking-wider text-[#0B7C62] uppercase">
                    STEP 04 — COMPLETE WITH CONFIDENCE
                  </span>
                </div>

                <h3 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-[#0D1527]">
                  Finish the project. Keep the clarity.
                </h3>

                <p className="text-[#596780] text-base sm:text-lg leading-relaxed font-medium">
                  Deliver the agreed work, settle payments, confirm completion, and retain the full history of agreements and approved changes.
                </p>

                {/* Feature Chips */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5 rounded-xl bg-white p-3 border border-[#E5EAE7] shadow-2xs">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#D8F5E9] text-[#0B7C62]">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-[#0D1527]">100% deliverables verified</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl bg-white p-3 border border-[#E5EAE7] shadow-2xs">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#D8F5E9] text-[#0B7C62]">
                      <Lock className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-[#0D1527]">Final payment settled cleanly</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl bg-white p-3 border border-[#E5EAE7] shadow-2xs">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#D8F5E9] text-[#0B7C62]">
                      <FileCheck className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-[#0D1527]">Full change history preserved</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl bg-white p-3 border border-[#E5EAE7] shadow-2xs">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#D8F5E9] text-[#0B7C62]">
                      <Users className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-[#0D1527]">Repeat client relationships</span>
                  </div>
                </div>
              </div>

              {/* Desktop Right: Illustration & Project Completion Card */}
              <div className="relative">
                <div className="rounded-3xl border border-[#BCECD6] bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
                  {/* Both characters celebrating frame */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#ECEFF1] bg-background">
                    <img
                      src="/story-scene-4.png"
                      alt="Provider and client celebrating successful project completion with full clarity"
                      className="h-full w-full object-cover select-none"
                      loading="lazy"
                    />
                    {/* Floating pill tag */}
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-[#BCECD6] bg-white/95 px-3 py-1 shadow-xs backdrop-blur-xs">
                      <Sparkles className="h-3.5 w-3.5 text-[#0B7C62]" />
                      <span className="text-xs font-extrabold text-[#0B7C62]">Project Completed</span>
                    </div>
                  </div>

                  {/* Floating Completed Agreement & Shared Record Card */}
                  <div className="mt-3.5 rounded-2xl border border-[#BCECD6] bg-[#F4FBF7] p-3.5 sm:p-4">
                    <div className="flex items-center justify-between pb-2 border-b border-[#D8F0E2]">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#0B7C62]" />
                        <span className="text-xs sm:text-sm font-bold text-[#0D1527]">
                          Final Delivery &amp; Settle Payment
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#E5F6EE] px-2 py-0.5 text-[11px] font-bold text-[#0B7C62]">
                        <Check className="h-3 w-3 stroke-[3]" /> 100% Completed
                      </span>
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs text-[#0D1527]">
                      <div className="flex items-center justify-between rounded-lg bg-white/90 p-2 border border-[#E2EBE5]">
                        <span className="text-[#596780]">Total Scope Delivered:</span>
                        <span className="font-extrabold text-[#0D1527]">
                          8 Pages (5 Original + 3 Approved)
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-white/90 p-2 border border-[#E2EBE5]">
                        <span className="text-[#596780]">Timeline Completed:</span>
                        <span className="font-extrabold text-[#0B7C62]">
                          5 Weeks (Delivered on schedule)
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-white/90 p-2 border border-[#E2EBE5]">
                        <span className="text-[#596780]">Final Payment Settled:</span>
                        <span className="font-extrabold text-[#0B7C62]">Released &amp; Confirmed</span>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-[#D8F0E2] flex items-center gap-2 text-xs font-bold text-[#0B7C62]">
                      <Users className="h-3.5 w-3.5 shrink-0" />
                      <span>Clear scope. Approved changes. Better relationships.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 3 BOTTOM CALL TO ACTION */}
        {/* ======================================================== */}
        <div className="mt-12 sm:mt-16 lg:mt-20 rounded-3xl border border-[#D5E5DC] bg-gradient-to-b from-[#F2FAF6] to-[#E5F4EC] p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden shadow-xs">
          {/* Subtle background glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-96 rounded-full bg-white/60 blur-2xl pointer-events-none" />

          <div className="relative max-w-2xl mx-auto space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#BCECD6] bg-white/80 px-3.5 py-1 shadow-2xs backdrop-blur-xs">
              <span className="text-xs font-black tracking-wider text-[#0B7C62] uppercase">
                START WITH NOTRAP
              </span>
            </div>

            <h3 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#0D1527]">
              Ready to make your next project clearer?
            </h3>

            <p className="text-[#596780] text-base sm:text-lg leading-relaxed font-medium">
              Create a shared project agreement in minutes. Record change requests with zero friction and protect both sides from scope creep.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/start"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-foreground px-8 py-4 text-base sm:text-lg font-bold text-white shadow-md hover:bg-[#182638] hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer shrink-0"
              >
                <span>Create Your First Agreement</span>
                <ArrowRight className="h-5 w-5 stroke-[2.5]" />
              </Link>
            </div>

            <p className="text-xs text-[#8A98A8] font-medium">
              No credit card required · Free for your first 3 agreements
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
