/**
 * Decorative divider inspired by the diamond motifs of Somali woven mats
 * (dermo) and alindi textiles. Purely ornamental — hidden from AT.
 */
export default function WeaveDivider({
  className = "text-sand-300",
}: {
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={`flex justify-center py-2 ${className}`}>
      <svg width="220" height="16" viewBox="0 0 220 16" fill="none">
        {Array.from({ length: 11 }).map((_, i) => (
          <path
            key={i}
            d={`M${i * 20 + 2} 8 L${i * 20 + 10} 2 L${i * 20 + 18} 8 L${i * 20 + 10} 14 Z`}
            stroke="currentColor"
            strokeWidth="1.5"
            fill={i % 2 === 0 ? "currentColor" : "none"}
            opacity={i % 2 === 0 ? 0.5 : 1}
          />
        ))}
      </svg>
    </div>
  );
}
