import { useEffect, useState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { resendOtp, verifyOtp, type SessionUser } from "../lib/api";

const RESEND_COOLDOWN_SEC = 30;

export function OtpVerify({
  email,
  onVerified,
  onBack,
  notice,
}: {
  email: string;
  onVerified: (user: SessionUser) => void;
  onBack?: () => void;
  notice?: string;
}) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(notice ?? null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SEC);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await verifyOtp(email, otp.trim());
      onVerified(res.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function onResend() {
    setError(null);
    setInfo(null);
    try {
      await resendOtp(email);
      setInfo("A new code is on its way.");
      setCooldown(RESEND_COOLDOWN_SEC);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend code");
    }
  }

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-8 shadow-md">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-success/15 text-success">
        <MailCheck className="h-7 w-7" aria-hidden="true" />
      </div>
      <h1 className="mt-5 text-center font-display text-2xl font-black tracking-tight text-foreground">
        Check your email
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        We sent a 6-digit code to <b className="text-foreground">{email}</b>. Enter it below to
        verify your account.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          maxLength={6}
          placeholder="000000"
          aria-label="6-digit verification code"
          className="w-full rounded-xl border border-border bg-background px-3.5 py-3 text-center font-mono text-2xl tracking-[0.5em] outline-none transition focus:border-foreground focus:ring-1 focus:ring-foreground"
        />

        {info && (
          <div
            role="status"
            className="rounded-xl border border-border bg-muted/50 px-3.5 py-2.5 text-sm font-medium text-foreground"
          >
            {info}
          </div>
        )}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-destructive/20 bg-destructive/10 px-3.5 py-2.5 text-sm font-medium text-destructive"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-base font-black text-background transition hover:opacity-90 disabled:opacity-60"
        >
          {loading && <Loader2 className="h-5 w-5 animate-spin" />}
          Verify &amp; continue
        </button>
      </form>

      <div className="mt-4 flex items-center justify-between text-sm">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="font-semibold text-muted-foreground hover:text-foreground"
          >
            Back
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={onResend}
          disabled={cooldown > 0}
          className="font-bold text-foreground hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
        >
          {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
        </button>
      </div>
    </div>
  );
}
