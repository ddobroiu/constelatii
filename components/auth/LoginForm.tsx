"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import GoogleButton from "@/components/auth/GoogleButton";
import { safeRedirect } from "@/lib/auth/redirect";
import { MARKETING_CHOICE_COOKIE } from "@/lib/lifecycle/consent";

// Erorile cu care Auth.js se întoarce aici (?error=) după „Continuă cu Google”.
function authErrorMessage(code: string | null): string | null {
  if (!code || code === "CredentialsSignin") return null;
  if (code === "AccessDenied")
    return "Nu am putut intra cu Google. Adresa de e-mail a contului Google trebuie să fie confirmată.";
  return "Autentificarea cu Google nu a reușit. Încearcă din nou sau intră cu e-mail și parolă.";
}

export default function LoginForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = safeRedirect(searchParams.get("callbackUrl"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(() => authErrorMessage(searchParams.get("error")));
  const [loading, setLoading] = useState(false);

  // Contul creat cu Google de aici n-a văzut anunțul despre e-mailuri: fără
  // alegere, primește doar bun venit (vezi lib/auth/google.ts).
  useEffect(() => {
    try {
      document.cookie = `${MARKETING_CHOICE_COOKIE}=; path=/; max-age=0`;
    } catch {
      // cookie-uri blocate: nimic de șters
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setError("Email sau parolă incorectă.");
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="mb-6 text-center text-2xl font-semibold">Autentificare</h1>

      {googleEnabled && (
        <div className="mb-4">
          <GoogleButton redirect={callbackUrl} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          <label className="mb-1 block text-xs text-foreground/50">Parolă</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        {error && <p className="text-sm text-red-300/80">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Se autentifică…" : "Autentifică-te"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-foreground/50">
        Nu ai cont încă?{" "}
        <Link href="/inregistrare" className="text-accent hover:underline">
          Creează unul
        </Link>
      </p>
    </div>
  );
}
