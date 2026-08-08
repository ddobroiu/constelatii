"use client";

import { useState } from "react";

export default function ReferralLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <input
        readOnly
        value={url}
        onFocus={(e) => e.target.select()}
        className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-foreground/80 outline-none"
      />
      <button
        type="button"
        onClick={copy}
        className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-accent-soft"
      >
        {copied ? "Copiat!" : "Copiază link"}
      </button>
    </div>
  );
}
