import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  ArrowRight,
  Check,
  CheckCircle2,
  Sparkles,
  FileCheck,
} from "lucide-react";

export function FinalCtaBanner() {
  const [inView, setInView] = React.useState(false);
  const sectionRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToHowItWorks = () => {
    const el = document.getElementById("how-it-works");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="final-cta"
      aria-label="Final Call to Action — Start Your Next Project"
      className="relative w-full py-20 sm:py-24 lg:py-28 bg-foreground text-white overflow-hidden border-t border-[#1C2C42]"
    >
      {/* Decorative Organic Wave & Glow Accents */}
      <div
        aria-hidden="true"
        className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#0B7C62]/25 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#F1592A]/20 blur-3xl pointer-events-none"
      />

      {/* Subtle Curved Wave SVG in Background */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full text-white/[0.03] pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 1440 600"
        fill="none"
      >
        <path
          d="M0,160 C320,300 480,50 800,200 C1120,350 1280,100 1440,220 L1440,600 L0,600 Z"
          fill="currentColor"
        />
        <path
          d="M0,220 C360,100 640,320 960,180 C1200,80 1360,260 1440,240"
          stroke="rgba(47, 209, 158, 0.15)"
          strokeWidth="2"
        />
      </svg>

      {/* Main Container */}
      <div
        className={`relative mx-auto w-full max-w-[1280px] px-6 sm:px-8 lg:px-12 transition-all duration-700 ease-out motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
          {/* ======================================================== */}
          {/* Left Column (Copy & Actions) */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* Eyebrow Label with Shield Icon */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0B7C62]/60 bg-[#0B7C62]/20 px-3.5 py-1.5 shadow-2xs backdrop-blur-xs">
              <ShieldCheck className="h-4 w-4 text-[#2FD19E] shrink-0 stroke-[2.2]" />
              <span className="text-xs sm:text-[13px] font-black tracking-wider text-[#2FD19E] uppercase">
                YOUR NEXT PROJECT STARTS HERE
              </span>
            </div>

            {/* Large White Headline */}
            <h2 className="mt-5 font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[56px] leading-[1.12] tracking-tight text-white">
              Make clarity your first deliverable.
            </h2>

            {/* Description */}
            <p className="mt-5 text-[#9EAFC2] text-base sm:text-lg lg:text-xl leading-relaxed font-medium max-w-xl">
              Set expectations early, handle changes transparently, and keep everyone on the same page — from the first conversation to the final delivery.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
              {/* Primary Bright Mint CTA */}
              <Link
                to="/start"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#2FD19E] hover:bg-[#25B889] text-[#0B1829] px-7 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg font-extrabold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0"
              >
                <span>Create your first agreement</span>
                <ArrowRight className="h-5 w-5 stroke-[2.5]" />
              </Link>

              {/* Secondary Outlined CTA */}
              <button
                type="button"
                onClick={scrollToHowItWorks}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 hover:border-white/60 bg-white/5 hover:bg-white/10 text-white px-6 sm:px-7 py-3.5 sm:py-4 text-base sm:text-lg font-bold transition-all cursor-pointer shrink-0 backdrop-blur-xs"
              >
                <span>Explore how it works</span>
              </button>
            </div>

            {/* Supporting Benefits */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-bold text-[#CAD5E2] w-full">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2FD19E]/20 text-[#2FD19E]">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
                <span>Clear scope</span>
              </div>

              <div className="h-3.5 w-px bg-white/20 hidden sm:block" />

              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2FD19E]/20 text-[#2FD19E]">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
                <span>Agreed changes</span>
              </div>

              <div className="h-3.5 w-px bg-white/20 hidden sm:block" />

              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2FD19E]/20 text-[#2FD19E]">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
                <span>Shared records</span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* Right Column (Illustration) */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Soft Behind-Frame Glow */}
            <div
              aria-hidden="true"
              className="absolute -top-4 -left-4 h-48 w-48 rounded-full bg-[#2FD19E]/15 blur-2xl pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -right-4 h-52 w-52 rounded-full bg-[#F1592A]/20 blur-2xl pointer-events-none"
            />

            {/* Glass Container Frame */}
            <div className="relative w-full max-w-[460px] rounded-3xl border border-white/15 bg-white/5 p-4 sm:p-5 backdrop-blur-md shadow-2xl hover:border-white/25 transition-all">
              {/* Recurring Characters Celebrating Frame */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-background">
                <img
                  src="/story-scene-4.png"
                  alt="Service provider in teal hoodie and client in orange top celebrating successful project completion"
                  className="h-full w-full object-cover select-none"
                  loading="lazy"
                />

                {/* Floating Mint Pill: Project Signed */}
                <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#2FD19E] px-3 py-1 shadow-md text-[#0B1829]">
                  <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span className="text-xs font-black tracking-wide">
                    Project Completed
                  </span>
                </div>

                {/* Floating Sparkle Pill */}
                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-foreground/90 border border-white/20 px-2.5 py-1 text-white shadow-xs backdrop-blur-xs">
                  <Sparkles className="h-3 w-3 text-[#F1592A]" />
                  <span className="text-[11px] font-bold text-[#CAD5E2]">100% Clarity</span>
                </div>
              </div>

              {/* Bottom Floating Shared Record Card */}
              <div className="mt-3.5 flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-foreground/90 p-3 sm:p-3.5 backdrop-blur-md text-white shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2FD19E]/20 text-[#2FD19E] shadow-2xs">
                    <FileCheck className="h-5 w-5 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-extrabold text-white block truncate">
                      Shared Project Agreement
                    </span>
                    <span className="text-[11px] text-[#2FD19E] font-semibold block">
                      Approved scope · Zero disputes
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-extrabold text-[#CAD5E2] bg-white/10 px-2.5 py-1 rounded-full shrink-0">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#2FD19E]" />
                  <span>Protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
