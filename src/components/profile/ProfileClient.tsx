"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { DownloadHistory } from "@/components/profile/DownloadHistory";
import { createClient } from "@/lib/supabase/client";
import type { ProfileRow } from "@/lib/types";

type Mode = "signin" | "signup";

export function ProfileClient({
  user,
  profile,
  returnTo,
}: {
  user: { id: string; email: string } | null;
  profile: ProfileRow | null;
  returnTo: string;
}) {
  const router = useRouter();

  if (user) {
    return (
      <div className="nb-card">
        <p className="display text-lg text-ink">
          HELLO,{" "}
          <span className="text-magenta">
            {(profile?.full_name ?? profile?.username ?? "there").toUpperCase()}
          </span>
        </p>
        <dl className="mt-5 space-y-2 font-mono text-xs">
          <div className="flex justify-between gap-4">
            <dt className="uppercase tracking-wider text-muted">Email</dt>
            <dd className="text-ink">{user.email}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="uppercase tracking-wider text-muted">Username</dt>
            <dd className="text-ink">{profile?.username ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="uppercase tracking-wider text-muted">Tier</dt>
            <dd className="text-ink">{profile?.account_tier ?? "standard"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="uppercase tracking-wider text-muted">Role</dt>
            <dd className="text-ink">{profile?.role ?? "user"}</dd>
          </div>
        </dl>

        {profile?.role === "admin" && (
          <Link
            href="/admin"
            className="nb-btn nb-btn--orange mt-6"
          >
            Admin console →
          </Link>
        )}

        <EditProfile
          profile={profile}
          onSaved={() => router.refresh()}
        />

        <DownloadHistory userId={user.id} />

        <button
          type="button"
          className="nb-btn nb-btn--secondary mt-5"
          onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            router.push("/profile");
            router.refresh();
          }}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <SignInUpFlow
      returnTo={returnTo}
      onSuccess={() => {
        router.push(returnTo);
        router.refresh();
      }}
    />
  );
}

function EditProfile({
  profile,
  onSaved,
}: {
  profile: ProfileRow | null;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState(profile?.username ?? "");
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) {
      setError("Username is required.");
      return;
    }
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      const { error } = await createClient()
        .from("profiles")
        .update({
          username: trimmed,
          full_name: fullName.trim() || null,
        })
        .eq("id", profile?.id ?? "");
      if (error) {
        setError(
          /duplicate|already exists|23505/i.test(error.message)
            ? "That username is taken."
            : error.message
        );
        return;
      }
      setSaved(true);
      onSaved();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-5 border-t-[3px] border-dashed border-ink pt-4">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setError(null);
          setSaved(false);
          setUsername(profile?.username ?? "");
          setFullName(profile?.full_name ?? "");
        }}
        className="py-1.5 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-ink no-underline hover:text-magenta md:py-0"
      >
        {open ? "Close profile editor ✕" : "Edit profile →"}
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <label className="block">
            <span className="mb-1.5 block font-mono text-[0.65rem] font-bold uppercase tracking-wider text-muted">
              Username *
            </span>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="nb-input w-full"
              placeholder="yourname"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block font-mono text-[0.65rem] font-bold uppercase tracking-wider text-muted">
              Display name
            </span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="nb-input w-full"
              placeholder="Optional"
            />
          </label>

          {error && (
            <p className="border-2 border-ink bg-surface2 px-3 py-2 font-mono text-xs text-orange">
              {error}
            </p>
          )}
          {saved && (
            <p className="border-2 border-ink bg-surface2 px-3 py-2 font-mono text-xs text-muted">
              Profile saved.
            </p>
          )}

          <button type="submit" disabled={busy} className="nb-btn">
            {busy ? "Saving…" : "Save profile"}
          </button>
        </form>
      )}
    </div>
  );
}

function SignInUpFlow({
  returnTo,
  onSuccess,
}: {
  returnTo: string;
  onSuccess: () => void;
}) {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setNotice(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);

    try {
      const supabase = createClient();
      const origin = window.location.origin;

      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setError(error.message);
          return;
        }
        onSuccess();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(
              returnTo
            )}`,
          },
        });
        if (error) {
          setError(error.message);
          return;
        }
        if (data.session) {
          // Email confirmation is disabled — straight in.
          onSuccess();
        } else {
          setNotice(
            "Account created! Check your email to confirm, then sign in."
          );
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const sendMagicLink = async () => {
    if (!email.trim()) {
      setError("Enter your email first.");
      return;
    }
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      const supabase = createClient();
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(
            returnTo
          )}`,
        },
      });
      if (error) {
        setError(error.message);
        return;
      }
      setNotice("Magic link sent — check your inbox.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="nb-card">
      <div className="mb-6 flex gap-2.5">
        <button
          type="button"
          onClick={() => switchMode("signin")}
          className={`nb-chip ${mode === "signin" ? "nb-chip--on" : ""}`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => switchMode("signup")}
          className={`nb-chip ${mode === "signup" ? "nb-chip--on" : ""}`}
        >
          Create account
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block font-mono text-[0.65rem] font-bold uppercase tracking-wider text-muted">
            Email
          </span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="nb-input w-full"
            placeholder="you@example.com"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block font-mono text-[0.65rem] font-bold uppercase tracking-wider text-muted">
            Password
          </span>
          <input
            type="password"
            required
            minLength={6}
            autoComplete={
              mode === "signin" ? "current-password" : "new-password"
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="nb-input w-full"
            placeholder="••••••••"
          />
        </label>

        {error && (
          <p className="border-2 border-ink bg-surface2 px-3 py-2 font-mono text-xs text-orange">
            {error}
          </p>
        )}
        {notice && (
          <p className="border-2 border-ink bg-surface2 px-3 py-2 font-mono text-xs text-muted">
            {notice}
          </p>
        )}

        <button type="submit" disabled={busy} className="nb-btn w-full">
          {busy
            ? "Working…"
            : mode === "signin"
              ? "Sign in →"
              : "Create account →"}
        </button>
      </form>

      <div className="mt-5 border-t-[3px] border-dashed border-ink pt-4">
        <button
          type="button"
          disabled={busy}
          onClick={sendMagicLink}
          className="py-1.5 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-ink no-underline hover:text-magenta md:py-0"
        >
          Or send a magic link →
        </button>
      </div>
    </div>
  );
}