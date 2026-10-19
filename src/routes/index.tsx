import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { StoryCarousel } from "@/components/StoryCarousel";
import { HowItWorks } from "@/components/HowItWorks";
import { BrandQuoteBanner } from "@/components/BrandQuoteBanner";
import { FinalCtaBanner } from "@/components/FinalCtaBanner";
import { OnboardingPreview } from "@/components/OnboardingPreview";
import { HeaderBar, MobileNav } from "@/components/site";
import {
  FileText,
  Mic,
  Lock,
  User,
  Check,
  MessageSquareWarning,
  Send,
  Info,
  ArrowLeftRight,
  ShieldCheck,
  ArrowRight,
  Play,
  Users,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NoTrap.co — Shared agreements for providers and clients" },
      { name: "description", content: "One shared record of documentation, voice notes and scope of work between a service provider and their client." },
      { property: "og:title", content: "NoTrap.co — Shared agreements, no surprises" },
      { property: "og:description", content: "Providers propose, clients approve. Both sides see the same record." },
    ],
  }),
  component: Index,
});

function Index() {
  const [note, setNote] = useState<string | null>(null);
  const start = () => document.getElementById("preview")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-dvh font-sans bg-background">
      <header className="sticky top-0 z-20 border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <HeaderBar />
        {note && (
          <div role="status" className="bg-warning/25 px-4 py-2 text-center text-sm">
            {note} <button className="ml-2 underline" onClick={() => setNote(null)}>Dismiss</button>
          </div>
        )}
      </header>

      <main className="overflow-x-clip pb-20 sm:pb-0">
        {/* Hero Section: occupies the full viewport height down to the bottom wave */}
        <section className="relative min-h-[calc(100vh-62px)] lg:h-[calc(100vh-62px)] flex flex-col justify-between overflow-hidden bg-background">
          <div className="mx-auto w-full max-w-[1580px] 2xl:max-w-[1660px] px-6 sm:px-8 lg:px-10 pt-2 sm:pt-3 lg:pt-4 pb-2 flex-1 flex flex-col justify-center">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-3 lg:gap-4 xl:gap-6 w-full">
              {/* Left Column: Copy & Actions */}
              <div className="w-full lg:w-[48%] xl:w-[47%] shrink-0 flex flex-col items-start z-10">
                {/* Mint Pill Badge */}
                <div className="inline-flex items-center gap-2.5 rounded-full border border-[#BCECD6] bg-[#D8F5E9] px-4 py-2 shadow-2xs">
                  <ShieldCheck className="h-4.5 w-4.5 text-[#0B7C62] shrink-0" />
                  <span className="text-xs sm:text-[13px] font-black tracking-wider text-[#0B7C62] uppercase">
                    CLEAR AGREEMENTS. NO SCOPE CREEP.
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="mt-4 sm:mt-5 lg:mt-6 font-display font-black text-5xl sm:text-6xl lg:text-[60px] xl:text-[72px] 2xl:text-[80px] leading-[1.05] tracking-tight text-[#0D1527]">
                  Turn Ideas into<br />
                  Agreements.<br />
                  <span className="text-[#F1592A]">Not Disputes.</span>
                </h1>

                {/* Subtitle */}
                <p className="mt-4 sm:mt-5 text-[#596780] text-base sm:text-lg lg:text-[20px] xl:text-[22px] leading-relaxed max-w-xl font-medium">
                  NoTrap helps freelancers, agencies, and clients agree on the work upfront, track every change, and keep projects on time and on budget.
                </p>

                {/* Call to Actions */}
                <div className="mt-6 sm:mt-7 lg:mt-8 flex flex-wrap sm:flex-nowrap items-center gap-3.5 sm:gap-4">
                  <button
                    onClick={start}
                    className="inline-flex items-center justify-center gap-2.5 sm:gap-3 rounded-full bg-foreground px-7 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg font-bold text-white shadow-md hover:bg-[#182638] hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer shrink-0"
                  >
                    <span>Start an agreement</span>
                    <ArrowRight className="h-5 w-5 stroke-[2.5]" />
                  </button>
                  <button
                    onClick={start}
                    className="inline-flex items-center justify-center gap-2.5 sm:gap-3 rounded-full border border-[#CFD6DE] bg-white/80 hover:bg-white px-6 sm:px-7 py-3.5 sm:py-4 text-base sm:text-lg font-bold text-[#0D1527] transition cursor-pointer shadow-2xs shrink-0"
                  >
                    <span className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-foreground text-white shrink-0">
                      <Play className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current ml-0.5" />
                    </span>
                    <span>Watch how it works</span>
                  </button>
                </div>

                {/* 3 Value Propositions with Dividers */}
                <div className="mt-8 sm:mt-9 lg:mt-10 flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-5 xl:gap-6 w-full">
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#D8F5E9] text-[#0B7C62]">
                      <Zap className="h-5.5 w-5.5 stroke-[2.2] fill-[#0B7C62]" />
                    </div>
                    <span className="text-xs sm:text-[14px] xl:text-[15px] font-bold text-[#2C3B4E] leading-snug">
                      Clear scope<br />from day one
                    </span>
                  </div>

                  <div className="hidden sm:block h-7 w-px bg-[#D6DFD9] shrink-0" />

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#D8F5E9] text-[#0B7C62]">
                      <ArrowLeftRight className="h-5.5 w-5.5 stroke-[2]" />
                    </div>
                    <span className="text-xs sm:text-[14px] xl:text-[15px] font-bold text-[#2C3B4E] leading-snug">
                      Track &amp; approve<br />all changes
                    </span>
                  </div>

                  <div className="hidden sm:block h-7 w-px bg-[#D6DFD9] shrink-0" />

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#D8F5E9] text-[#0B7C62]">
                      <Users className="h-5.5 w-5.5 stroke-[2]" />
                    </div>
                    <span className="text-xs sm:text-[14px] xl:text-[15px] font-bold text-[#2C3B4E] leading-snug">
                      Better client<br />relationships
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Workflow Illustration */}
              <div className="w-full lg:w-[52%] xl:w-[53%] flex items-center justify-center lg:justify-start z-10 mt-6 lg:mt-0 lg:-ml-4 xl:-ml-6">
                <div className="relative w-full max-w-[880px] xl:max-w-[980px] 2xl:max-w-[1060px]">
                  <img
                    src="/hero-workflow.png"
                    alt="NoTrap agreement workflow connecting service provider, project agreement, and client"
                    className="w-full h-auto object-contain block select-none pointer-events-none drop-shadow-xs"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Organic Bottom Wave - naturally framing the hero */}
          <div className="w-full shrink-0 overflow-hidden leading-none pointer-events-none -mb-1 -mt-8 sm:-mt-12 lg:-mt-16 xl:-mt-20 z-0">
            <svg
              className="w-full h-24 sm:h-28 lg:h-36 xl:h-44 text-[#DFECE3]"
              viewBox="0 0 1440 140"
              preserveAspectRatio="none"
            >
              {/* Layer 1: Warm Sand Wave */}
              <path
                d="M 0 40 C 240 75, 420 95, 640 80 C 880 65, 1120 25, 1440 45 L 1440 140 L 0 140 Z"
                fill="#F8EFE4"
              />
              {/* Layer 2: Pale Mint/Sage Wave */}
              <path
                d="M 520 140 C 660 85, 780 48, 920 48 C 1080 48, 1200 110, 1330 106 C 1370 104, 1410 88, 1440 70 L 1440 140 L 520 140 Z"
                fill="#DFECE3"
              />
              <path
                d="M 520 140 C 660 85, 780 48, 920 48 C 1080 48, 1200 110, 1330 106 C 1370 104, 1410 88, 1440 70"
                fill="none"
                stroke="#CFE0D5"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        </section>

        {/* Section 2: Scope-Creep Story Carousel */}
        <StoryCarousel />

        {/* Section 3: How NoTrap Works — From First Agreement to Final Delivery */}
        <HowItWorks />

        {/* Section 4: Brand Quote Banner */}
        <BrandQuoteBanner />

        {/* Section 5: Final Call-to-Action Banner */}
        <FinalCtaBanner />

        {/* Onboarding Preview Section */}
        <OnboardingPreview />

        {/* Privacy Section */}
        <section className="mx-auto max-w-3xl px-6 py-16">
          <div className="flex items-start gap-4 rounded-3xl border border-[#E0E6E2] bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-background text-[#0B7C62] border border-[#EAEFEA]">
              <Lock className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h2 className="font-display text-2xl font-black text-[#0D1527]">Privacy is the point</h2>
              <p className="mt-2 text-sm sm:text-base text-[#596780] leading-relaxed">
                Our goal: only the client and the service provider can access their shared records — not even NoTrap.co.
              </p>
              <div className="mt-3.5 inline-flex items-center gap-1.5 rounded-lg bg-background px-3 py-1.5 text-xs font-bold text-[#69788D] border border-[#ECEEEF]">
                <Info className="h-3.5 w-3.5 text-[#0B7C62]" />
                <span>Honest status: accounts, agreements and files are stored on our servers. End-to-end encryption is not built yet.</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-6 text-sm">
          <span className="font-display font-extrabold">NoTrap.co</span>
          <nav aria-label="Footer" className="flex gap-5 text-muted-foreground">
            {["Privacy", "Terms", "Contact"].map((l) => (
              <span key={l} aria-disabled="true">{l} <span className="text-[11px] uppercase">(placeholder)</span></span>
            ))}
          </nav>
        </div>
      </footer>
      <MobileNav />
    </div>
  );
}
