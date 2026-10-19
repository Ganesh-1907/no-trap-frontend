import * as React from "react";
import { ShieldCheck, CheckCircle2, FileCheck, Sparkles } from "lucide-react";

export function BrandQuoteBanner() {
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

  return (
    <section
      ref={sectionRef}
      id="brand-quote"
      aria-label="The NoTrap Promise"
      className="relative w-full py-20 sm:py-24 lg:py-28 bg-background overflow-hidden border-t border-[#EAE6DB]"
    >
      {/* Background Soft Organic Shapes */}
      <div className="absolute top-1/2 -left-20 -translate-y-1/2 h-80 w-80 rounded-full bg-[#E8F5EF]/70 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-20 -translate-y-1/2 h-80 w-80 rounded-full bg-[#FEF0E6]/60 blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div
        className={`mx-auto w-full max-w-[1280px] px-6 sm:px-8 lg:px-12 transition-all duration-700 ease-out motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
          {/* ======================================================== */}
          {/* Left Column (55%): Eyebrow, Main Headline, Supporting Text */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* Small Eyebrow Label with Shield/Check Icon */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#BCECD6] bg-[#D8F5E9] px-3.5 py-1.5 shadow-2xs">
              <ShieldCheck className="h-4 w-4 text-[#0B7C62] shrink-0 stroke-[2.2]" />
              <span className="text-xs sm:text-[13px] font-black tracking-wider text-[#0B7C62] uppercase">
                THE NOTRAP PROMISE
              </span>
            </div>

            {/* Large Bold Navy Headline with Teal Highlight & Orange Underline */}
            <h2 className="mt-5 font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-[44px] xl:text-[52px] leading-[1.14] tracking-tight text-[#0D1527]">
              “Good projects don't need guesswork.
              <br />
              They need{" "}
              <span className="relative inline-block text-[#0B7C62]">
                clear agreements.”
                {/* Hand-Drawn Orange SVG Underline */}
                <svg
                  className="absolute -bottom-2 sm:-bottom-2.5 left-0 w-full h-3 sm:h-4 text-[#F1592A] pointer-events-none select-none"
                  viewBox="0 0 260 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 13C60 4 170 3 257 10C200 16 100 17 28 15"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </h2>

            {/* Supporting Text */}
            <p className="mt-6 text-[#596780] text-lg sm:text-xl lg:text-[21px] leading-relaxed font-medium max-w-xl">
              “Define the work. Agree on the changes. Build something great together.”
            </p>

            {/* Optional Small Brand Signature */}
            <div className="mt-6 sm:mt-8 flex items-center gap-3">
              <div className="h-0.5 w-8 bg-[#0B7C62]/40 rounded-full" />
              <span className="font-display font-bold text-sm sm:text-base text-[#0B7C62] tracking-wide">
                — The NoTrap way.
              </span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* Right Column (45%): Recurring Characters & Shared Agreement */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Soft Mint & Peach Organic Shapes Behind Characters */}
            <div
              aria-hidden="true"
              className="absolute -top-4 -left-4 h-48 w-48 rounded-full bg-[#D8F5E9]/80 blur-2xl pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -right-4 h-52 w-52 rounded-full bg-[#FEF0E6]/90 blur-2xl pointer-events-none"
            />

            {/* Illustration Frame Container */}
            <div className="relative w-full max-w-[460px] rounded-3xl border border-[#E5EAE7] bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
              {/* Illustration of Both Characters Reviewing the Shared Agreement */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#ECEFF1] bg-background">
                <img
                  src="/story-scene-3.png"
                  alt="Service provider in teal hoodie and client in orange top reviewing their shared signed project agreement"
                  className="h-full w-full object-cover select-none"
                  loading="lazy"
                />

                {/* Floating Green Approval Checkmark Pill */}
                <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-[#BCECD6] bg-white/95 px-3 py-1 shadow-xs backdrop-blur-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#0B7C62]" />
                  <span className="text-xs font-black text-[#0B7C62]">
                    Agreed &amp; Signed
                  </span>
                </div>

                {/* Subtle Sparkle Accent Top-Right */}
                <div className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 border border-[#FCD9C6] text-[#F1592A] shadow-xs">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Floating Shared Agreement Mini-Card & Curved Connecting Arrow */}
              <div className="mt-3.5 flex items-center justify-between gap-3 rounded-2xl border border-[#BCECD6] bg-[#F4FBF7] p-3 sm:p-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D8F5E9] text-[#0B7C62] shadow-2xs">
                    <FileCheck className="h-5 w-5 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-extrabold text-[#0D1527] block truncate">
                      Shared Project Agreement
                    </span>
                    <span className="text-[11px] text-[#0B7C62] font-semibold block">
                      100% mutual visibility &amp; zero disputes
                    </span>
                  </div>
                </div>

                {/* Small Decorative Curved Arrow SVG */}
                <svg
                  className="h-6 w-10 text-[#0B7C62] shrink-0 pointer-events-none hidden sm:block"
                  viewBox="0 0 40 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M4 18 C 16 6, 26 6, 34 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M28 14 L 34 14 L 33 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
