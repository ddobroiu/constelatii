"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { LEGAL_LINKS } from "@/lib/legal";
import { SIGNUP_MARKETING_NOTICE, SIGNUP_OPT_OUT_LABEL } from "@/lib/lifecycle/consent";

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") ?? undefined;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [marketingOptOut, setMarketingOptOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!acceptTerms) {
      setError("Pentru a crea contul trebuie să accepți Termenii și condițiile.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/inregistrare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, ref, acceptTerms, marketingOptOut }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Înregistrarea a eșuat.");
      }

      const signInResult = await signIn("credentials", { email, password, redirect: false });
      if (signInResult?.error) throw new Error("Contul a fost creat, dar autentificarea automată a eșuat. Te rugăm să te autentifici.");

      router.push("/cont");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "A apărut o eroare neașteptată.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="mb-2 text-center text-2xl font-semibold">Creează cont</h1>
      {ref && <p className="mb-6 text-center text-sm text-accent">Ai fost recomandat de un prieten 🎉</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-xs text-foreground/50">Prenume și nume</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-foreground/50">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-foreground/50">Parolă (minimum 8 caractere)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        <label className="flex items-start gap-2 text-xs text-foreground/60">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            required
            className="mt-0.5 shrink-0 accent-accent"
          />
          <span>
            Am cel puțin 18 ani și sunt de acord cu{" "}
            <Link href={LEGAL_LINKS.terms} target="_blank" className="text-accent hover:underline">
              Termenii și condițiile
            </Link>
            . Am citit{" "}
            <Link href={LEGAL_LINKS.privacy} target="_blank" className="text-accent hover:underline">
              Politica de confidențialitate
            </Link>
            .
          </span>
        </label>

        <p className="text-xs leading-relaxed text-foreground/50">{SIGNUP_MARKETING_NOTICE}</p>
        <label className="flex items-start gap-2 text-xs text-foreground/60">
          <input
            type="checkbox"
            checked={marketingOptOut}
            onChange={(e) => setMarketingOptOut(e.target.checked)}
            className="mt-0.5 shrink-0 accent-accent"
          />
          <span>{SIGNUP_OPT_OUT_LABEL}</span>
        </label>

        {error && <p className="text-sm text-red-300/80">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Se creează contul…" : "Creează cont"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-foreground/50">
        Ai deja cont?{" "}
        <Link href="/autentificare" className="text-accent hover:underline">
          Autentifică-te
        </Link>
      </p>
    </div>
  );
}
