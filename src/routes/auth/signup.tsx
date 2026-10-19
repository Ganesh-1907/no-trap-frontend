import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Loader2, UserPlus, Eye, EyeOff, CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { signup, type SessionUser } from "../../lib/api";
import { OtpVerify } from "../../components/otp-verify";
import { homeFor, useRedirectIfSignedIn } from "../../components/auth-menu";

export const Route = createFileRoute("/auth/signup")({
  validateSearch: (s: Record<string, unknown>): { email?: string | undefined; invited?: string | undefined } => ({
    email: typeof s["email"] === "string" ? (s["email"] as string) : undefined,
    invited: typeof s["invited"] === "string" || typeof s["invited"] === "number" ? String(s["invited"]) : undefined,
  }),
  head: () => ({ meta: [{ title: "Sign up — NoTrap" }] }),
  component: SignUpPage,
});

function SignUpPage() {
  useRedirectIfSignedIn();
  const { email: invitedEmail, invited } = Route.useSearch();
  const isInvite = Boolean(invited && invitedEmail);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(invitedEmail ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  function onVerified(user: SessionUser) {
    // Invited people came here to see what a provider shared with them; everyone else picks a side on /start.
    window.location.href = isInvite ? "/client" : homeFor(user);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await signup({
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim() || undefined,
        // One optional name serves both sides of the account.
        businessName: businessName.trim() || undefined,
        company: businessName.trim() || undefined,
      });
      setPendingEmail(res.email);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  if (pendingEmail) {
    return (
      <div className="flex min-h-dvh safe-top items-center justify-center bg-background p-6 font-sans antialiased">
        <div className="w-full max-w-md">
          <OtpVerify email={pendingEmail} onVerified={onVerified} onBack={() => setPendingEmail(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh safe-top bg-background font-sans antialiased">
      <div className="grid min-h-dvh lg:grid-cols-12">
        {/* Left Form Column */}
        <div className="flex flex-col justify-between p-6 sm:p-10 lg:col-span-7 xl:col-span-6 xl:p-14">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <Link to="/" className="font-display text-2xl font-black tracking-tight text-foreground transition hover:opacity-85">
              NoTrap<span className="text-client">.co</span>
            </Link>
            <div className="text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/auth/signin" className="font-bold text-foreground hover:underline">
                Sign in
              </Link>
            </div>
          </div>

          {/* Form Content */}
          <div className="mx-auto my-8 w-full max-w-md">
            <Link
              to="/"
              className="group mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to home
            </Link>

            <div className="mb-6">
              <h1 className="font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                Create account
              </h1>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Start with crystal-clear project scope, recorded changes, and mutual agreement.
              </p>
            </div>

            {isInvite && (
              <div role="status" className="mb-4 rounded-2xl border border-client/30 bg-client-soft/60 px-4 py-3 text-sm text-foreground">
                <b>You've been invited.</b> Someone added <b>{invitedEmail}</b> as their client. Create your account with
                this address to see the agreements they share with you.
              </div>
            )}

            <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">First name</span>
                  <input
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoComplete="given-name"
                    placeholder="e.g. Alex"
                    className="mt-1 w-full rounded-xl border border-border bg-card px-3.5 py-3 text-sm placeholder:text-muted-foreground/50 outline-none transition focus:border-foreground focus:ring-1 focus:ring-foreground"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">Last name</span>
                  <input
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    autoComplete="family-name"
                    placeholder="e.g. Chen"
                    className="mt-1 w-full rounded-xl border border-border bg-card px-3.5 py-3 text-sm placeholder:text-muted-foreground/50 outline-none transition focus:border-foreground focus:ring-1 focus:ring-foreground"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">Email address</span>
                <input
                  type="email"
                  required
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly={isInvite}
                  placeholder="alex@example.com"
                  className="mt-1 w-full rounded-xl border border-border bg-card px-3.5 py-3 text-sm placeholder:text-muted-foreground/50 outline-none transition focus:border-foreground focus:ring-1 focus:ring-foreground"
                />
              </label>

              <label className="block">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">Password</span>
                  <span className="text-[11px] font-medium text-muted-foreground">Min 8 characters</span>
                </div>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full rounded-xl border border-border bg-card px-3.5 py-3 pr-11 text-sm placeholder:text-muted-foreground/50 outline-none transition focus:border-foreground focus:ring-1 focus:ring-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-muted-foreground hover:text-foreground focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                  </button>
                </div>
              </label>

              <label className="block">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">Phone number</span>
                  <span className="text-[11px] font-medium text-muted-foreground">Optional</span>
                </div>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 000-0000"
                  className="mt-1 w-full rounded-xl border border-border bg-card px-3.5 py-3 text-sm placeholder:text-muted-foreground/50 outline-none transition focus:border-foreground focus:ring-1 focus:ring-foreground"
                />
              </label>

              <label className="block">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">Business or company name</span>
                  <span className="text-[11px] font-medium text-muted-foreground">Optional</span>
                </div>
                <input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  autoComplete="organization"
                  placeholder="e.g. Studio Chen or Sarah Brands Inc."
                  className="mt-1 w-full rounded-xl border border-border bg-card px-3.5 py-3 text-sm placeholder:text-muted-foreground/50 outline-none transition focus:border-foreground focus:ring-1 focus:ring-foreground"
                />
              </label>

              {error && (
                <div role="alert" className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 px-3.5 py-2.5 text-sm font-medium text-destructive">
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-base font-black text-background transition hover:opacity-90 disabled:opacity-60 shadow-lg shadow-foreground/10"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UserPlus className="h-5 w-5" />}
                Create account
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-4 text-[11px] font-semibold text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-provider" /> Encrypted records
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-client" /> Dual approval
              </span>
              <span>·</span>
              <span>Privacy first</span>
            </div>
          </div>

          {/* Subtle footer */}
          <div className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} NoTrap.co · Built for clear client & freelancer agreements.
          </div>
        </div>

        {/* Right Illustration & Value Showcase Column */}
        <div className="relative hidden flex-col justify-between overflow-hidden border-l border-border/80 bg-gradient-to-br from-background via-provider-soft/50 to-client-soft/50 p-10 lg:flex lg:col-span-5 xl:col-span-6 xl:p-14">
          {/* Top badge */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/80 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-foreground shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-provider" /> The NoTrap Promise
            </span>
            <span className="text-xs font-bold text-muted-foreground">
              One shared record
            </span>
          </div>

          {/* Central Hero Graphic Showcase */}
          <div className="relative z-10 my-auto flex flex-col items-center">
            <div className="relative w-full max-w-lg rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-md">
              <img
                src="/hero-scene.png"
                alt="NoTrap service provider and client agreement"
                className="w-full max-h-[360px] rounded-2xl object-contain drop-shadow"
              />

              <div className="mt-6 space-y-2.5">
                <div className="flex items-center gap-3 rounded-xl bg-background/90 p-3 shadow-xs border border-border/40">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-provider/15 text-provider">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-foreground">Scope defined upfront</p>
                    <p className="truncate text-[11px] text-muted-foreground">Agreed deliverables, deadlines, and revision rules.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-background/90 p-3 shadow-xs border border-border/40">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-client/15 text-client">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-foreground">Change requests approved before work starts</p>
                    <p className="truncate text-[11px] text-muted-foreground">Extra cost and extra timeline agreed transparently.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom quote card */}
          <div className="relative z-10 rounded-2xl border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur">
            <p className="font-display text-base font-extrabold italic text-foreground">
              “Good projects don’t need guesswork. They need clear agreements.”
            </p>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-bold text-provider">Clear scope · Approved changes · Better relationships</span>
              <span className="font-mono font-bold text-foreground">NoTrap.co</span>
            </div>
          </div>

          {/* Decorative ambient gradient circles in background */}
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-client/10 blur-3xl" />
          <div className="pointer-events-none absolute -top-20 -left-20 h-96 w-96 rounded-full bg-provider/10 blur-3xl" />
        </div>
      </div>
    </div>
  );
}
