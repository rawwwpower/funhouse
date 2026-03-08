"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/callback`,
      },
    });

    if (!error) {
      setSent(true);
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-primary)]">
      <div className="w-full max-w-md space-y-8 px-6">
        {/* Logo / Brand */}
        <div className="text-center">
          <h1 className="font-display text-5xl font-bold tracking-tight text-[var(--color-amber)]">
            ohara
          </h1>
          <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
            Your personal Tree of Knowledge
          </p>
        </div>

        {sent ? (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-8 text-center">
            <div className="mx-auto mb-4 text-4xl">📬</div>
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Check your email
            </h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              We sent a magic link to{" "}
              <span className="font-medium text-[var(--color-amber)]">
                {email}
              </span>
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-4 text-sm text-[var(--color-text-secondary)] underline hover:text-[var(--color-text-primary)]"
            >
              Try a different email
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleLogin}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-8 space-y-4"
          >
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[var(--color-text-secondary)]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="robin@ohara.island"
              required
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-amber)] focus:outline-none focus:ring-1 focus:ring-[var(--color-amber)]"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[var(--color-amber)] px-4 py-3 font-medium text-[var(--color-bg-primary)] transition-colors hover:bg-[var(--color-gold)] disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send magic link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
