"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { CONSENT_CHANGE_EVENT } from "@/lib/consent";
import {
  isTikTokExcludedPath,
  isTikTokLoaded,
  loadTikTok,
  marketingAccepted,
  revokeTikTok,
  tiktokPage,
} from "@/lib/tiktok";

/**
 * Încarcă TikTok Pixel doar după acordul pentru „Marketing / reclame” și doar pe
 * paginile publice (nu pe cont, autentificare, plată). La navigarea client-side
 * trimite un page view; prima vizualizare o trimite deja încărcarea pixelului.
 */
export default function TikTokPixel() {
  const pathname = usePathname();
  const pathRef = useRef(pathname);
  const lastPaged = useRef<string | null>(null);

  useEffect(() => {
    pathRef.current = pathname;
    if (isTikTokExcludedPath(pathname) || !marketingAccepted()) return;
    if (!isTikTokLoaded()) {
      if (loadTikTok()) lastPaged.current = pathname;
    } else if (lastPaged.current !== pathname) {
      tiktokPage();
      lastPaged.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    function onConsent() {
      if (!marketingAccepted()) {
        revokeTikTok();
        return;
      }
      const path = pathRef.current;
      if (isTikTokExcludedPath(path)) {
        // deja încărcat (ex. pentru CompletePayment): doar reactivăm acordul
        if (isTikTokLoaded()) loadTikTok({ trackPage: false });
        return;
      }
      const wasLoaded = isTikTokLoaded();
      if (loadTikTok() && !wasLoaded) lastPaged.current = path;
    }
    window.addEventListener(CONSENT_CHANGE_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onConsent);
  }, []);

  return null;
}
