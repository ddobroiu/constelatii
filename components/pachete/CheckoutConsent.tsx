"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import Link from "next/link";
import { LEGAL_LINKS } from "@/lib/legal";

type Ctx = { accepted: boolean; showError: boolean; setShowError: (v: boolean) => void };

const CheckoutConsentContext = createContext<Ctx>({ accepted: false, showError: false, setShowError: () => {} });

export function useCheckoutConsent() {
  return useContext(CheckoutConsentContext);
}

/**
 * Bifa obligatorie înainte de plată (OUG 34/2014 art. 16 lit. a și m): acordul cu Termenii,
 * cererea de furnizare imediată și luarea la cunoștință a pierderii dreptului de retragere.
 * Aceeași bifă e verificată și pe server, în /api/checkout.
 */
export default function CheckoutConsent({ children }: { children: ReactNode }) {
  const [accepted, setAccepted] = useState(false);
  const [showError, setShowError] = useState(false);

  return (
    <CheckoutConsentContext.Provider value={{ accepted, showError, setShowError }}>
      <label
        className={`flex max-w-2xl items-start gap-3 rounded-xl border p-4 text-sm text-foreground/70 ${
          showError && !accepted ? "border-red-300/60 bg-red-300/5" : "border-white/10 bg-white/5"
        }`}
      >
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => {
            setAccepted(e.target.checked);
            if (e.target.checked) setShowError(false);
          }}
          required
          aria-required="true"
          className="mt-1 shrink-0 accent-accent"
        />
        <span>
          Sunt de acord cu{" "}
          <Link href={LEGAL_LINKS.terms} target="_blank" className="text-accent hover:underline">
            Termenii și condițiile
          </Link>{" "}
          și solicit furnizarea imediată a conținutului/serviciului digital. Iau la cunoștință că, odată cu începerea
          executării, îmi pierd dreptul de retragere de 14 zile (OUG 34/2014, art. 16 lit. a și m). Am citit{" "}
          <Link href={LEGAL_LINKS.privacy} target="_blank" className="text-accent hover:underline">
            Politica de confidențialitate
          </Link>
          .
        </span>
      </label>
      {showError && !accepted && (
        <p role="alert" className="-mt-6 text-sm text-red-300/80">
          Bifează acordul de mai sus ca să poți continua spre plată.
        </p>
      )}
      {children}
    </CheckoutConsentContext.Provider>
  );
}
