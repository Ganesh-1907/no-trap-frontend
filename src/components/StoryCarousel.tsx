import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  Plus,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Users,
} from "lucide-react";

export function StoryCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: false,
    containScroll: "trimSnaps",
  });

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  // Interactive approval state for Slide 3
  const [isApproved, setIsApproved] = React.useState(false);

  const scrollPrev = React.useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const scrollTo = React.useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Keyboard navigation
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );

  const slides = [
    {
      id: 1,
      sceneBadge: "Scene 1",
      badgeColor: "bg-[#E5F6EE] text-[#0B7C62] border-[#BCECD6]",
      title: "The original plan",
      speaker: "Service Provider",
      speechBubble: "“Let's build a 5-page website.”",
      statusLabel: "Original scope agreed",
      statusPillText: "5 pages · 4 weeks",
      statusPillColor: "bg-[#E5F6EE] text-[#0B7C62] border-[#BCECD6]",
      imageSrc: "/story-scene-1.png",
      imageAlt: "Service provider setting up the initial 5-page website agreement on his laptop",
      content: (
        <div className="space-y-3.5">
          <p className="text-sm sm:text-base text-[#596780] leading-relaxed">
            The project starts with clarity. Both sides agree on a fixed deliverable set, a clear 4-week timeline, and payment milestones.
          </p>

          {/* Document Scope Card */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-background p-3.5 sm:p-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#EAEFEA]">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#0B7C62]" />
                <span className="text-xs sm:text-sm font-bold text-[#0D1527]">Website Agreement</span>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#E5F6EE] px-2 py-0.5 text-[11px] font-bold text-[#0B7C62]">
                <Check className="h-3 w-3 stroke-[3]" /> Agreed
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl bg-white p-2.5 border border-[#ECEEEF]">
                <span className="text-[11px] uppercase font-bold text-[#8896A6] block">Scope</span>
                <span className="font-extrabold text-[#0D1527] text-sm">5 Website Pages</span>
                <span className="text-[11px] text-[#69788D] block mt-0.5">Home, About, Services, Portfolio, Contact</span>
              </div>
              <div className="rounded-xl bg-white p-2.5 border border-[#ECEEEF]">
                <span className="text-[11px] uppercase font-bold text-[#8896A6] block">Timeline</span>
                <span className="font-extrabold text-[#0D1527] text-sm">4 Weeks Total</span>
                <span className="text-[11px] text-[#69788D] block mt-0.5">Milestone schedule agreed</span>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#69788D] pt-2 border-t border-[#ECEEEF]">
              <span>Payment terms: 50% deposit, 50% on completion</span>
              <span className="font-bold text-[#0B7C62]">Zero disputes</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      sceneBadge: "Scene 2",
      badgeColor: "bg-[#FEF0E6] text-[#D9531E] border-[#FCD9C6]",
      title: "One more request...",
      speaker: "Client",
      speechBubble: "“Can we add 3 more pages?”",
      statusLabel: "New change requested",
      statusPillText: "+3 pages requested",
      statusPillColor: "bg-[#FEF0E6] text-[#D9531E] border-[#FCD9C6]",
      imageSrc: "/story-scene-2.png",
      imageAlt: "Client video calling the provider requesting 3 additional pages",
      content: (
        <div className="space-y-3.5">
          <p className="text-sm sm:text-base text-[#596780] leading-relaxed">
            Midway through the project, ideas evolve. A simple verbal request to add extra features can quietly cause scope creep if not recorded.
          </p>

          {/* Scope Comparison & Orange Highlight Card */}
          <div className="rounded-2xl border border-[#FCD9C6] bg-[#FFF8F3] p-3.5 sm:p-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#F7E1D2]">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-[#F1592A]" />
                <span className="text-xs sm:text-sm font-bold text-[#0D1527]">Scope Expansion Request</span>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF0E6] px-2 py-0.5 text-[11px] font-bold text-[#D9531E]">
                Pending review
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between rounded-xl bg-white/80 p-2.5 border border-[#ECEEEF] text-xs">
                <span className="text-[#69788D]">Original Scope:</span>
                <span className="font-bold text-[#0D1527]">5 Pages (Home, About, Services, Portfolio, Contact)</span>
              </div>

              {/* Highlighted New Request */}
              <div className="flex items-center justify-between rounded-xl bg-[#FEF0E6] p-2.5 border border-[#FBDBC9] text-xs">
                <div className="flex items-center gap-1.5">
                  <Plus className="h-3.5 w-3.5 text-[#F1592A] stroke-[3]" />
                  <span className="font-extrabold text-[#D9531E]">Requested Additions:</span>
                </div>
                <span className="font-extrabold text-[#D9531E]">3 Pages (Blog, Case Studies, Pricing)</span>
              </div>
            </div>

            <p className="mt-2.5 text-[11px] text-[#A2522B] leading-normal">
              ⚠ Unplanned additions without written agreement lead to confusion and delays.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      sceneBadge: "Scene 3",
      badgeColor: "bg-[#EBF3FE] text-[#1E60D9] border-[#CDE1FD]",
      title: "Make the change clear",
      speaker: "Both Parties",
      speechBubble: "“Let's agree on the extra cost and time first.”",
      statusLabel: isApproved ? "Change approved" : "Pending client approval",
      statusPillText: isApproved ? "Approved · Scope updated" : "Review → Approve",
      statusPillColor: isApproved ? "bg-[#E5F6EE] text-[#0B7C62] border-[#BCECD6]" : "bg-[#FFF6E5] text-[#9A6400] border-[#FCE2B3]",
      imageSrc: "/story-scene-3.png",
      imageAlt: "Provider and client reviewing extra cost and timeline terms together",
      content: (
        <div className="space-y-3.5">
          <p className="text-sm sm:text-base text-[#596780] leading-relaxed">
            Instead of debating later, NoTrap generates an explicit change request. Both sides see the estimated time, cost, and deliverables upfront.
          </p>

          {/* Change Request Card with Demo Values & Interactive State */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-3.5 sm:p-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#F0F2F4]">
              <span className="text-xs sm:text-sm font-bold text-[#0D1527]">Change Request #01</span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold transition-colors ${
                  isApproved ? "bg-[#E5F6EE] text-[#0B7C62]" : "bg-[#FFF6E5] text-[#9A6400]"
                }`}
              >
                {isApproved ? <Check className="h-3 w-3 stroke-[3]" /> : <Clock className="h-3 w-3" />}
                {isApproved ? "Approved by client" : "Awaiting review"}
              </span>
            </div>

            {/* Illustrative Demo Values */}
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl bg-background p-2 border border-[#ECEEEF]">
                <span className="text-[11px] uppercase font-bold text-[#8896A6] block">Scope</span>
                <span className="font-extrabold text-[#0D1527] text-sm">+3 Pages</span>
              </div>
              <div className="rounded-xl bg-background p-2 border border-[#ECEEEF]">
                <span className="text-[11px] uppercase font-bold text-[#8896A6] block">Extra Cost</span>
                <span className="font-extrabold text-[#F1592A] text-sm">+$600</span>
              </div>
              <div className="rounded-xl bg-background p-2 border border-[#ECEEEF]">
                <span className="text-[11px] uppercase font-bold text-[#8896A6] block">Extra Time</span>
                <span className="font-extrabold text-[#0D1527] text-sm">+1 Week</span>
              </div>
            </div>

            {/* Interactive Approval Simulator */}
            <div className="mt-3 pt-2.5 border-t border-[#F0F2F4] flex items-center justify-between gap-2">
              <span className="text-[11px] text-[#69788D] italic">
                {isApproved ? "✓ Official scope is updated." : "Scope only updates after approval."}
              </span>
              <button
                type="button"
                onClick={() => setIsApproved(!isApproved)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                  isApproved
                    ? "bg-[#E5F6EE] text-[#0B7C62] hover:bg-[#D5EFE1]"
                    : "bg-foreground text-white hover:bg-[#182638] shadow-xs"
                }`}
              >
                {isApproved ? (
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
      ),
    },
    {
      id: 4,
      sceneBadge: "Scene 4",
      badgeColor: "bg-[#E5F6EE] text-[#0B7C62] border-[#BCECD6]",
      title: "No surprises",
      speaker: "Both Parties",
      speechBubble: "“Everyone knows what was agreed.”",
      statusLabel: "Project completed",
      statusPillText: "Clear scope. Happy client.",
      statusPillColor: "bg-[#E5F6EE] text-[#0B7C62] border-[#BCECD6]",
      imageSrc: "/story-scene-4.png",
      imageAlt: "Provider and client celebrating successful website completion on schedule",
      content: (
        <div className="space-y-3.5">
          <p className="text-sm sm:text-base text-[#596780] leading-relaxed">
            The final delivery matches every agreed expectation. The client got the extra pages they wanted; the provider got paid for the extra work.
          </p>

          {/* Shared Completed Record Card */}
          <div className="rounded-2xl border border-[#BCECD6] bg-[#F4FBF7] p-3.5 sm:p-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#D8F0E2]">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#0B7C62]" />
                <span className="text-xs sm:text-sm font-bold text-[#0D1527]">Final Shared Record</span>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#E5F6EE] px-2 py-0.5 text-[11px] font-bold text-[#0B7C62]">
                <Check className="h-3 w-3 stroke-[3]" /> 100% Completed
              </span>
            </div>

            <div className="mt-3 space-y-1.5 text-xs text-[#0D1527]">
              <div className="flex items-center justify-between rounded-lg bg-white/90 p-2 border border-[#E2EBE5]">
                <span className="text-[#596780]">Total Scope Delivered:</span>
                <span className="font-extrabold text-[#0D1527]">8 Pages (5 original + 3 approved)</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/90 p-2 border border-[#E2EBE5]">
                <span className="text-[#596780]">Timeline Completed:</span>
                <span className="font-extrabold text-[#0B7C62]">5 Weeks (Delivered on schedule)</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/90 p-2 border border-[#E2EBE5]">
                <span className="text-[#596780]">Disputes &amp; Friction:</span>
                <span className="font-extrabold text-[#0B7C62]">Zero disputes</span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-[#D8F0E2] flex items-center gap-2 text-xs font-bold text-[#0B7C62]">
              <Users className="h-3.5 w-3.5 shrink-0" />
              <span>Clear scope. Approved changes. Better relationships.</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section
      id="story-carousel"
      aria-label="Scope-Creep Story Carousel"
      className="relative w-full py-16 sm:py-20 lg:py-24 bg-background overflow-hidden border-t border-[#EAE6DB]"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Container */}
      <div className="mx-auto w-full max-w-[1920px] px-6 sm:px-10 lg:px-12 xl:px-14">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-10 sm:pb-12">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#BCECD6] bg-[#D8F5E9] px-3.5 py-1.5 shadow-2xs">
              <span className="text-xs sm:text-[13px] font-black tracking-wider text-[#0B7C62] uppercase">
                A STORY EVERY FREELANCER KNOWS
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="mt-4 font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#0D1527]">
              It started with 5 pages...
            </h2>

            {/* Description */}
            <p className="mt-3 text-[#596780] text-base sm:text-lg leading-relaxed font-medium">
              One small request can change an entire project. NoTrap helps both sides stay aligned when requirements change.
            </p>
          </div>

          {/* Top-Right Badge & Controls */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="hidden sm:flex h-11 w-11 items-center justify-center rounded-full border border-[#BCECD6] bg-[#D8F5E9] text-[#0B7C62] shrink-0 shadow-2xs">
              <ShieldCheck className="h-6 w-6 stroke-[2.2]" />
            </div>

            {/* Desktop Slide Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                aria-label="Previous story slide"
                className={`flex h-11 w-11 items-center justify-center rounded-full border border-[#D5DCD8] bg-white text-[#0D1527] shadow-2xs transition active:scale-95 cursor-pointer ${
                  !canScrollPrev ? "opacity-35 cursor-not-allowed" : "hover:bg-[#F2F6F4] hover:border-[#BCECD6]"
                }`}
              >
                <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                disabled={!canScrollNext}
                aria-label="Next story slide"
                className={`flex h-11 w-11 items-center justify-center rounded-full border border-[#D5DCD8] bg-white text-[#0D1527] shadow-2xs transition active:scale-95 cursor-pointer ${
                  !canScrollNext ? "opacity-35 cursor-not-allowed" : "hover:bg-[#F2F6F4] hover:border-[#BCECD6]"
                }`}
              >
                <ChevronRight className="h-5 w-5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Viewport with Embla */}
        <div
          ref={emblaRef}
          className="overflow-hidden cursor-grab active:cursor-grabbing -mx-4 px-4 sm:-mx-6 sm:px-6"
        >
          <div className="flex touch-pan-y -ml-4 sm:-ml-6 py-2">
            {slides.map((slide, index) => {
              const isActive = index === selectedIndex;
              return (
                <div
                  key={slide.id}
                  className={`min-w-0 shrink-0 pl-4 sm:pl-6 basis-[90%] sm:basis-[82%] lg:basis-[72%] xl:basis-[62%] transition-all duration-300 ${
                    isActive ? "opacity-100 scale-100" : "opacity-60 scale-[0.98] pointer-events-none sm:pointer-events-auto"
                  }`}
                  onClick={() => !isActive && scrollTo(index)}
                >
                  {/* Slide Card Container */}
                  <div className="h-full rounded-3xl border border-[#E5EAE7] bg-white p-5 sm:p-7 lg:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                      {/* Left: Illustration with Speech Bubble */}
                      <div className="lg:col-span-6 relative">
                        {/* Rounded Image Frame */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#ECEFF1] bg-background shadow-xs">
                          <img
                            src={slide.imageSrc}
                            alt={slide.imageAlt}
                            className="h-full w-full object-cover select-none"
                            loading={index === 0 ? "eager" : "lazy"}
                          />
                        </div>

                        {/* Floating Speech Bubble */}
                        <div className="mt-3.5 flex items-start gap-2.5 rounded-2xl border border-[#E5ECE8] bg-[#FDFBF7] p-3 shadow-xs">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-white text-[11px] font-bold">
                            {slide.speaker.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <span className="text-[11px] uppercase font-bold tracking-wider text-[#8A97A8] block">
                              {slide.speaker}
                            </span>
                            <p className="text-xs sm:text-sm font-semibold text-[#0D1527] italic">
                              {slide.speechBubble}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right: Scene Badge, Heading, and Scope Card */}
                      <div className="lg:col-span-6 flex flex-col justify-between h-full">
                        <div>
                          {/* Scene Badge */}
                          <div className="flex items-center justify-between">
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-black tracking-wide uppercase ${slide.badgeColor}`}
                            >
                              {slide.sceneBadge}
                            </span>
                            <span className="text-xs font-bold text-[#8A97A8]">
                              Step 0{slide.id} of 04
                            </span>
                          </div>

                          {/* Scene Heading */}
                          <h3 className="mt-3 font-display font-black text-2xl sm:text-3xl tracking-tight text-[#0D1527]">
                            {slide.title}
                          </h3>

                          {/* Dynamic Content */}
                          <div className="mt-4">{slide.content}</div>
                        </div>

                        {/* Status Label Pill */}
                        <div className="mt-5 pt-4 border-t border-[#EEF2F0] flex items-center justify-between">
                          <span className="text-xs text-[#8A97A8] font-medium">Status:</span>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs sm:text-[13px] font-extrabold ${slide.statusPillColor}`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {slide.statusPillText}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Bottom Bar: Note, Pagination Dots & Counter */}
        <div className="mt-8 pt-4 border-t border-[#EAE6DB] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          {/* Supporting Subtitle */}
          <span className="text-[#758496] font-medium text-center sm:text-left">
            A project story, from first request to final agreement.
          </span>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2" role="tablist" aria-label="Story carousel slides">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                role="tab"
                aria-selected={index === selectedIndex}
                aria-label={`Go to slide ${index + 1}: ${slide.title}`}
                onClick={() => scrollTo(index)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  index === selectedIndex
                    ? "h-2.5 w-7 bg-[#0D1527]"
                    : "h-2.5 w-2.5 bg-[#D5DCD8] hover:bg-[#8F9CA9]"
                }`}
              />
            ))}
          </div>

          {/* Slide Counter (01 / 04) */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="font-extrabold text-[#0D1527]">0{selectedIndex + 1}</span>
            <span className="text-[#8F9CA9]">/</span>
            <span className="text-[#8F9CA9]">04</span>
          </div>
        </div>
      </div>
    </section>
  );
}
