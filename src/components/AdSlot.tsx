"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT, adsEnabled } from "@/content/site-config";

/**
 * A single AdSense display unit.
 *
 * Renders nothing at all when ads are not configured (no publisher id, or no
 * slot id for this placement), so the layout never shows an empty grey box
 * while the site is unapproved or ads are switched off.
 *
 * `format="auto"` + `fullWidthResponsive` lets one unit serve desktop and
 * mobile, which keeps the page responsive without extra placements.
 */
export default function AdSlot({
  slot,
  label,
  className = "",
  format = "auto",
}: {
  slot: string;
  /** Localized "Advertisement" caption — required for transparency. */
  label: string;
  className?: string;
  format?: "auto" | "rectangle" | "horizontal";
}) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!adsEnabled() || !slot || pushed.current) return;
    pushed.current = true;
    try {
      // AdSense reads queued objects off this global once its script loads.
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {
      // A blocked or failed ad must never break the page.
    }
  }, [slot]);

  if (!adsEnabled() || !slot) return null;

  return (
    <aside
      aria-label={label}
      className={`my-6 overflow-hidden text-center ${className}`}
    >
      <span className="block pb-1 text-[10px] font-medium uppercase tracking-[0.15em] text-ink/35">
        {label}
      </span>
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
