/**
 * Galmudug News brand mark: stylized Galmudug map silhouette bearing a white
 * five-pointed star, wrapped by a crescent swoosh — per the owner's mockups.
 * Pure SVG, colored with theme tokens so it follows the flag palette.
 */
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* Crescent swooshes */}
      <path
        d="M50 6 A29 29 0 1 0 58 38"
        fill="none"
        className="stroke-ocean-500"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M54 13 A21 21 0 1 0 56 34"
        fill="none"
        className="stroke-ocean-300"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Stylized Galmudug territory: straight northern border, long
          Indian-ocean coastline running NE→SW, inland bulge to the west */}
      <path
        d="M22 18 L47 12 L52 20 L44 30 L40 40 L32 50 L24 46 L18 38 L16 28 Z"
        className="fill-ocean-500"
      />
      {/* Star of Unity */}
      <polygon
        points="32.0,22.0 34.3,28.1 40.6,28.4 35.7,32.4 37.4,38.6 32.0,35.0 26.6,38.6 28.3,32.4 23.4,28.4 29.7,28.1"
        fill="#fff"
      />
    </svg>
  );
}

/**
 * Full lockup: mark at left, single-line all-caps "GALMUDUG.COM"
 * wordmark (".COM" in the flag green), strapline underneath.
 */
export function LogoLockup({
  strap,
  compact = false,
}: {
  strap?: string;
  compact?: boolean;
}) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark size={compact ? 34 : 42} />
      <span className="flex flex-col">
        <span
          className={`whitespace-nowrap font-display font-extrabold uppercase leading-none tracking-tight ${
            compact ? "text-base" : "text-lg sm:text-xl"
          }`}
        >
          <span className="text-ocean-600">Galmudug</span>
          <span className="text-acacia-600">.com</span>
        </span>
        {strap && !compact && (
          <span className="mt-1 whitespace-nowrap text-[9px] font-medium tracking-[0.08em] text-ink/50">
            {strap}
          </span>
        )}
      </span>
    </span>
  );
}
