const API_BASE =
  (import.meta.env["VITE_API_URL"] as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:4000/api";

export type Role = "provider" | "client";

export type SessionUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  isProvider: boolean;
  isClient: boolean;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: SessionUser;
};

export type SignupPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string | undefined;
  businessName?: string | undefined;
  company?: string | undefined;
};

export type AddClientPayload = {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | undefined;
  company?: string | undefined;
  sendEmail?: boolean;
};

export type PresignPayload = {
  filename: string;
  mimeType: string;
  kind?: "document" | "audio" | "video" | "image" | "other";
  agreementId?: string | undefined;
  sizeBytes?: number;
  durationSec?: number;
};

export type UploadResult = {
  assetId: string;
  publicUrl?: string | undefined;
  r2Key: string;
};

const ACCESS_KEY = "notrap_access";
const REFRESH_KEY = "notrap_refresh";
const USER_KEY = "notrap_user";

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

export function getStoredUser(): SessionUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

export function saveSession(res: AuthResponse): void {
  localStorage.setItem(ACCESS_KEY, res.accessToken);
  localStorage.setItem(REFRESH_KEY, res.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(res.user));
}

export function clearSession(): void {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

export class ApiClientError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) return false;
      try {
        const res = await fetch(`${API_BASE}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
        if (!res.ok) return false;
        const data = (await res.json()) as AuthResponse;
        saveSession(data);
        return true;
      } catch {
        return false;
      } finally {
        setTimeout(() => {
          refreshPromise = null;
        }, 0);
      }
    })();
  }
  return refreshPromise;
}

export async function api<T = unknown>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const { auth = true, headers, ...rest } = options;
  const doFetch = async (token?: string) =>
    fetch(`${API_BASE}${path}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers as Record<string, string> | undefined),
      },
    });

  let token: string | undefined = auth ? (getAccessToken() ?? undefined) : undefined;
  let res = await doFetch(token);

  if (res.status === 401 && auth) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      token = getAccessToken() ?? undefined;
      res = await doFetch(token);
    } else {
      clearSession();
    }
  }

  const text = await res.text();
  const data: unknown = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const err = (data as { error?: { code?: string; message?: string } } | null)?.error;
    throw new ApiClientError(res.status, err?.code ?? "error", err?.message ?? res.statusText);
  }
  return data as T;
}

// ─── Auth helpers ────────────────────────────────────────────────────────────

export async function signin(email: string, password: string): Promise<AuthResponse> {
  const data = await api<AuthResponse>("/auth/signin", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ email, password }),
  });
  saveSession(data);
  return data;
}

export type SignupResult = { requiresVerification: true; email: string };

/** Step 1 of signup: creates the account and emails a 6-digit code. No session yet. */
export async function signup(payload: SignupPayload): Promise<SignupResult> {
  return api<SignupResult>("/auth/signup", {
    method: "POST",
    auth: false,
    body: JSON.stringify(payload),
  });
}

/** Step 2 of signup: confirm the emailed code and start a session. */
export async function verifyOtp(email: string, otp: string): Promise<AuthResponse> {
  const data = await api<AuthResponse>("/auth/verify-otp", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ email, otp }),
  });
  saveSession(data);
  return data;
}

export async function resendOtp(email: string): Promise<void> {
  await api("/auth/resend-otp", { method: "POST", auth: false, body: JSON.stringify({ email }) });
}

export async function forgotPassword(email: string): Promise<void> {
  await api("/auth/forgot-password", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, password: string): Promise<void> {
  await api("/auth/reset-password", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ token, password }),
  });
}

export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken();
  try {
    await api("/auth/logout", { method: "POST", body: JSON.stringify({ refreshToken }) });
  } catch {
    // ignore
  }
  clearSession();
}

// ─── Files (R2) ──────────────────────────────────────────────────────────────

export type PresignResponse = {
  assetId: string;
  r2Key: string;
  uploadUrl: string;
  publicUrl?: string;
  expiresInSec: number;
};

export async function presignUpload(payload: PresignPayload): Promise<PresignResponse> {
  return api<PresignResponse>("/files/presign", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function uploadFileToR2(
  file: File,
  opts: {
    kind?: "document" | "audio" | "video" | "image" | "other";
    agreementId?: string | undefined;
  } = {},
): Promise<UploadResult> {
  // Sent through the API (which stores it in Cloudflare R2), so no bucket CORS setup is needed.
  const kind = opts.kind ?? kindFromFile(file);
  return api<UploadResult>("/files/upload", {
    method: "POST",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
      "x-filename": encodeURIComponent(file.name),
      "x-kind": kind,
    },
    body: file,
  });
}

export function kindFromFile(file: File): "document" | "audio" | "video" | "image" | "other" {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("audio/")) return "audio";
  if (file.type.startsWith("video/")) return "video";
  return "document";
}

/** Store picked files in R2 when signed in; otherwise keep only the names (demo mode). */
export async function storeFiles(files: File[]): Promise<{ name: string; assetId?: string }[]> {
  const signedIn = isSignedIn();
  const out: { name: string; assetId?: string }[] = [];
  for (const f of files) {
    if (!signedIn) {
      out.push({ name: f.name });
      continue;
    }
    const up = await uploadFileToR2(f);
    out.push({ name: f.name, assetId: up.assetId });
  }
  return out;
}

export function isSignedIn(): boolean {
  return typeof window !== "undefined" && !!getAccessToken();
}

/**
 * Fetch a short-lived signed link from R2 for a stored file and open it.
 * The tab is opened synchronously (inside the click) so popup blockers allow it.
 */
export async function openAsset(assetId: string): Promise<void> {
  const tab = window.open("", "_blank");
  try {
    const { url } = await api<{ url: string }>(`/files/${assetId}/download`);
    if (tab) {
      tab.opener = null;
      tab.location.href = url;
    } else {
      window.location.href = url;
    }
  } catch (err) {
    tab?.close();
    throw err;
  }
}

// ─── Clients (provider) ──────────────────────────────────────────────────────

export async function addClient(payload: AddClientPayload): Promise<{
  clientUserId: string;
  created: boolean;
  emailed: boolean;
  inviteUrl?: string | undefined;
  message: string;
}> {
  return api("/clients", { method: "POST", body: JSON.stringify(payload) });
}

export async function listClients(): Promise<{ clients: unknown[] }> {
  return api("/clients");
}

export { API_BASE };
