"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { CONSENT_CHANGE_EVENT } from "@/lib/consent";
import { isMetaExcludedPath, isMetaLoaded, loadMetaPixel, metaPage, revokeMeta } from "@/lib/meta-pixel";
import { marketingAccepted } from "@/lib/tiktok";

/**
 * Încarcă Meta Pixel doar după acordul pentru „Marketing / reclame” și doar pe
 * paginile publice. La navigarea client-side trimite PageView; primul îl trimite
 * deja încărcarea pixelului.
 */
export default function MetaPixel() {
  const pathname = usePathname();
  const pathRef = useRef(pathname);
  const lastPaged = useRef<string | null>(null);

  useEffect(() => {
    pathRef.current = pathname;
    if (isMetaExcludedPath(pathname) || !marketingAccepted()) return;
    if (!isMetaLoaded()) {
      if (loadMetaPixel()) lastPaged.current = pathname;
    } else if (lastPaged.current !== pathname) {
      metaPage();
      lastPaged.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    function onConsent() {
      if (!marketingAccepted()) {
        revokeMeta();
        return;
      }
      const path = pathRef.current;
      if (isMetaExcludedPath(path)) {
        if (isMetaLoaded()) loadMetaPixel({ trackPage: false });
        return;
      }
      const wasLoaded = isMetaLoaded();
      if (loadMetaPixel() && !wasLoaded) lastPaged.current = path;
    }
    window.addEventListener(CONSENT_CHANGE_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onConsent);
  }, []);

  return null;
}
