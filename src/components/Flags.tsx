import type { Dictionary } from "@/lib/i18n";

/** Somali-flag "UN blue" shared by both flags. */
const FLAG_BLUE = "#4189dd";
const STAR_GREEN = "#009a49";

/** Points string for a five-pointed star, point-up, centered at (cx, cy). */
function starPoints(cx: number, cy: number, outer: number): string {
  const inner = outer * 0.382;
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    points.push(
      `${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`
    );
  }
  return points.join(" ");
}

function FlagFrame({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 900 540"
      role="img"
      aria-label={label}
      className="h-auto w-full rounded-lg border border-sand-200 shadow-sm"
    >
      {children}
    </svg>
  );
}

/**
 * Flag of Galmudug State: light-blue field, white chevron at the hoist
 * bearing two green five-pointed stars, and a large white five-pointed
 * star in the fly.
 */
export function GalmudugFlag({ label }: { label: string }) {
  return (
    <FlagFrame label={label}>
      <rect width="900" height="540" fill={FLAG_BLUE} />
      <polygon points="0,0 400,270 0,540" fill="#fff" />
      <polygon points={starPoints(95, 270, 62)} fill={STAR_GREEN} />
      <polygon points={starPoints(255, 270, 62)} fill={STAR_GREEN} />
      <polygon points={starPoints(620, 270, 135)} fill="#fff" />
    </FlagFrame>
  );
}

/** Flag of the Federal Republic of Somalia: light-blue field, centered white star. */
export function SomaliaFlag({ label }: { label: string }) {
  return (
    <FlagFrame label={label}>
      <rect width="900" height="540" fill={FLAG_BLUE} />
      <polygon points={starPoints(450, 270, 145)} fill="#fff" />
    </FlagFrame>
  );
}

/** Encyclopedic flags section shown on the Region overview page. */
export default function FlagsBlock({ dict }: { dict: Dictionary }) {
  const t = dict.region.symbols;
  return (
    <section className="mt-10" aria-labelledby="flags-heading">
      <h2
        id="flags-heading"
        className="font-display text-2xl font-semibold text-ocean-800"
      >
        {t.title}
      </h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <figure>
          <GalmudugFlag label={t.galmudugAlt} />
          <figcaption className="mt-2 text-sm text-ink/70">
            {t.galmudugCaption}
          </figcaption>
        </figure>
        <figure>
          <SomaliaFlag label={t.somaliaAlt} />
          <figcaption className="mt-2 text-sm text-ink/70">
            {t.somaliaCaption}
          </figcaption>
        </figure>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ink/70">{t.note}</p>
    </section>
  );
}
