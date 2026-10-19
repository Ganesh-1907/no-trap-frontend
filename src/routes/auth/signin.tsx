import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Loader2, LogIn, Eye, EyeOff, CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { ApiClientError, signin, type SessionUser } from "../../lib/api";
import { OtpVerify } from "../../components/otp-verify";
import { homeFor, useRedirectIfSignedIn } from "../../components/auth-menu";

export const Route = createFileRoute("/auth/signin")({
  head: () => ({ meta: [{ title: "Sign in — NoTrap" }] }),
  component: SignInPage,
});

function SignInPage() {
  useRedirectIfSignedIn();
  const router = useRouterState({ select: (s) => s.location.href });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState<string | null>(null);

  function goHome(user: SessionUser) {
    window.location.href = homeFor(user);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await signin(email.trim(), password);
      goHome(res.user);
    } catch (err) {
      if (err instanceof ApiClientError && err.code === "email_not_verified") {
        setVerifyEmail(email.trim());
        return;
      }
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  void router;

  if (verifyEmail) {
    return (
      <div className="flex min-h-dvh safe-top items-center justify-center bg-background p-6 font-sans antialiased">
        <div className="w-full max-w-md">
          <OtpVerify
            email={verifyEmail}
            notice="Your email isn't verified yet. We just sent you a new code."
            onVerified={goHome}
            onBack={() => setVerifyEmail(null)}
          />
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
              <span className="text-muted-foreground">New to NoTrap? </span>
              <Link to="/auth/signup" className="font-bold text-foreground hover:underline">
                Sign up
              </Link>
            </div>
          </div>

          {/* Form Content */}
          <div className="mx-auto my-auto w-full max-w-md py-8">
            <Link
              to="/"
              className="group mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to home
            </Link>

            <div className="mb-8">
              <h1 className="font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                Welcome back
              </h1>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Sign in to manage your active agreements, review changes, and collaborate.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">Email address</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-card px-3.5 py-3 text-sm placeholder:text-muted-foreground/50 outline-none transition focus:border-foreground focus:ring-1 focus:ring-foreground"
                  placeholder="you@example.com"
                />
              </label>

              <label className="block">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">Password</span>
                  <Link to="/auth/forgot-password" className="text-xs font-semibold text-muted-foreground hover:text-foreground hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card px-3.5 py-3 pr-11 text-sm placeholder:text-muted-foreground/50 outline-none transition focus:border-foreground focus:ring-1 focus:ring-foreground"
                    placeholder="Enter your password"
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
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
                Sign in to dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            <div className="mt-8 flex items-center justify-center gap-4 text-[11px] font-semibold text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-provider" /> 256-bit SSL
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-client" /> Instant access
              </span>
              <span>·</span>
              <span>Zero data selling</span>
            </div>
          </div>

          {/* Subtle footer */}
          <div className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} NoTrap.co · Protecting projects from scope creep.
          </div>
        </div>

        {/* Right Illustration & Value Showcase Column */}
        <div className="relative hidden flex-col justify-between overflow-hidden border-l border-border/80 bg-gradient-to-br from-background via-provider-soft/50 to-client-soft/50 p-10 lg:flex lg:col-span-5 xl:col-span-6 xl:p-14">
          {/* Top badge */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/80 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-foreground shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-client" /> Welcome back to clarity
            </span>
            <span className="text-xs font-bold text-muted-foreground">
              NoTrap.co
            </span>
          </div>

          {/* Central Hero Graphic Showcase */}
          <div className="relative z-10 my-auto flex flex-col items-center">
            <div className="relative w-full max-w-lg rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-md">
              <img
                src="/hero-workflow.png"
                alt="NoTrap agreement workflow and alignment"
                className="w-full max-h-[360px] rounded-2xl object-contain drop-shadow"
              />

              <div className="mt-6 space-y-2.5">
                <div className="flex items-center gap-3 rounded-xl bg-background/90 p-3 shadow-xs border border-border/40">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-provider/15 text-provider">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-foreground">Continuous project alignment</p>
                    <p className="truncate text-[11px] text-muted-foreground">Everything agreed in writing before work begins.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-background/90 p-3 shadow-xs border border-border/40">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-client/15 text-client">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-foreground">Shared auditable history</p>
                    <p className="truncate text-[11px] text-muted-foreground">All change requests, invoices, and approvals documented.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom quote card */}
          <div className="relative z-10 rounded-2xl border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur">
            <p className="font-display text-base font-extrabold italic text-foreground">
              “One shared journey. Zero confusion.”
            </p>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-bold text-provider">Clear scope · Approved changes · Better relationships</span>
              <span className="font-mono font-bold text-foreground">NoTrap.co</span>
            </div>
          </div>

          {/* Ambient gradient circles */}
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-client/10 blur-3xl" />
          <div className="pointer-events-none absolute -top-20 -left-20 h-96 w-96 rounded-full bg-provider/10 blur-3xl" />
        </div>
      </div>
    </div>
  );
}
