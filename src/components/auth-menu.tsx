import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Briefcase, LayoutDashboard, LogOut, UserCheck, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSessionUser } from "@/lib/agreements";
import { getAccessToken, getStoredUser, logout, type SessionUser } from "@/lib/api";

const SIDE_KEY = "notrap_last_side";

/** Remember which side (provider / client) the user used last, so we can land them there next time. */
export function rememberSide(side: "provider" | "client"): void {
  try {
    localStorage.setItem(SIDE_KEY, side);
  } catch {
    // storage unavailable (private mode): not critical
  }
}

/**
 * Where to send someone after signing in. Every account can be a provider and a client,
 * so go where they last were; brand-new users pick a side on /start.
 */
export function homeFor(_user?: SessionUser): "/provider" | "/client" | "/start" {
  try {
    const last = localStorage.getItem(SIDE_KEY);
    if (last === "provider") return "/provider";
    if (last === "client") return "/client";
  } catch {
    // ignore
  }
  return "/start";
}

/** Sign-in / sign-up pages are pointless once you're signed in: send people to their dashboard. */
export function useRedirectIfSignedIn(): void {
  useEffect(() => {
    const user = getStoredUser();
    if (user && getAccessToken()) window.location.replace(homeFor(user));
  }, []);
}

const initials = (u: SessionUser) =>
  `${u.firstName?.[0] ?? ""}${u.lastName?.[0] ?? ""}`.toUpperCase() || u.email[0]?.toUpperCase() || "?";

const itemCls = "flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg px-3 text-sm font-semibold";

/**
 * Right-hand side of every header: a profile menu when signed in, Sign in / Sign up when not.
 * Used by the app shell and the home page so both always agree.
 */
export function AuthMenu() {
  const { user, ready } = useSessionUser();

  // Reserve the space before the session is read so the header doesn't jump.
  if (!ready) return <div className="h-11 w-11" aria-hidden />;

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/auth/signup"
          className="hidden items-center rounded-full border border-foreground px-5 py-2 text-sm font-bold transition hover:bg-foreground hover:text-background sm:inline-flex"
        >
          Sign up
        </Link>
        <Link
          to="/auth/signin"
          className="inline-flex items-center rounded-full bg-foreground px-5 py-2 text-sm font-bold text-background transition hover:opacity-90"
        >
          Sign in
        </Link>
      </div>
    );
  }

  const roleLabel = "Provider & client";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open profile menu"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-sm font-black text-background outline-none ring-offset-2 ring-offset-background transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
      >
        {initials(user)}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2">
        <DropdownMenuLabel className="px-3 py-2 font-normal">
          <p className="truncate text-sm font-black text-foreground">
            {[user.firstName, user.lastName].filter(Boolean).join(" ") || user.email}
          </p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          <span className="mt-1.5 inline-block rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground">{roleLabel}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user.isProvider && (
          <>
            <DropdownMenuItem asChild className={itemCls}>
              <Link to="/provider"><LayoutDashboard className="h-4 w-4" aria-hidden /> Provider dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className={itemCls}>
              <Link to="/provider/clients"><Users className="h-4 w-4" aria-hidden /> My clients</Link>
            </DropdownMenuItem>
          </>
        )}
        {user.isClient && (
          <>
            <DropdownMenuItem asChild className={itemCls}>
              <Link to="/client"><UserCheck className="h-4 w-4" aria-hidden /> Client dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className={itemCls}>
              <Link to="/client/providers"><Briefcase className="h-4 w-4" aria-hidden /> My providers</Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => void logout().finally(() => (window.location.href = "/"))}
          className={`${itemCls} text-destructive focus:text-destructive`}
        >
          <LogOut className="h-4 w-4" aria-hidden /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
