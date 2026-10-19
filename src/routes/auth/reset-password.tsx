import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Loader2, KeyRound, Eye, EyeOff, CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { resetPassword } from "../../lib/api";

export const Route = createFileRoute("/auth/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — NoTrap" }] }),
  validateSearch: (search: Record<string, unknown>): { token?: string | undefined } => ({
    token: typeof search["token"] === "string" ? (search["token"] as string) : undefined,
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token } = useSearch({ from: "/auth/reset-password" });
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (!token) {
      setError("Missing reset token — please open the link from your email again.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setLoading(false);
    }
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
              <span className="text-muted-foreground">Remember credentials? </span>
              <Link to="/auth/signin" className="font-bold text-foreground hover:underline">
                Sign in
              </Link>
            </div>
          </div>

          {/* Form Content */}
          <div className="mx-auto my-auto w-full max-w-md py-8">
            <Link
              to="/auth/signin"
              className="group mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to sign in
            </Link>

            {done ? (
              <div className="rounded-3xl border border-border/80 bg-card p-8 text-center shadow-md">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-success/15 text-success">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h1 className="mt-5 font-display text-2xl font-black text-foreground">Password updated</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your new password has been set successfully. You can now sign in to your NoTrap account.
                </p>
                <Link
                  to="/auth/signin"
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-black text-background transition hover:opacity-90 shadow-md"
                >
                  Proceed to sign in
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h1 className="font-display text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                    Set new password
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                    Choose a strong password with at least 8 characters to secure your account.
                  </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-4" noValidate>
                  <label className="block">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-foreground">New password</span>
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
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">Confirm new password</span>
                    <div className="relative mt-1">
                      <input
                        type={showConfirm ? "text" : "password"}
                        required
                        minLength={8}
                        autoComplete="new-password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="Re-enter your new password"
                        className="w-full rounded-xl border border-border bg-card px-3.5 py-3 pr-11 text-sm placeholder:text-muted-foreground/50 outline-none transition focus:border-foreground focus:ring-1 focus:ring-foreground"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-muted-foreground hover:text-foreground focus:outline-none"
                        aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                      >
                        {showConfirm ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
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
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                    Update password
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </form>

                <div className="mt-8 flex items-center justify-center gap-4 text-[11px] font-semibold text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-provider" /> 256-bit SSL
                  </span>
                  <span>·</span>
                  <span>Direct token verification</span>
                  <span>·</span>
                  <span>End-to-end secure</span>
                </div>
              </>
            )}
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
              <Sparkles className="h-4 w-4 text-client" /> Security & Clarity
            </span>
            <span className="text-xs font-bold text-muted-foreground">
              NoTrap.co
            </span>
          </div>

          {/* Central Graphic */}
          <div className="relative z-10 my-auto flex flex-col items-center">
            <div className="relative w-full max-w-lg rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-md">
              <img
                src="/story-scene-3.png"
                alt="Clear agreements and transparent updates"
                className="w-full max-h-[340px] rounded-2xl object-contain drop-shadow"
              />
              <div className="mt-5 rounded-xl bg-background/90 p-4 shadow-xs border border-border/40">
                <p className="text-xs font-black text-foreground">Transparent change approvals</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Once your password is reset, resume reviewing deliverables and managing change requests seamlessly.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom quote card */}
          <div className="relative z-10 rounded-2xl border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur">
            <p className="font-display text-base font-extrabold italic text-foreground">
              “Define the work. Agree on the changes. Build something great together.”
            </p>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-bold text-provider">The NoTrap Way</span>
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
