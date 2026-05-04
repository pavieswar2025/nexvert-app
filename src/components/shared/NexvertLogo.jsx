/**
 * NexvertLogo — inline SVG logo component
 * Variant: primary (N-arrow mark + NEXVERT wordmark)
 * Props:
 *   height  — rendered height in px (width scales proportionally)
 *   mono    — if true, renders full parchment (no orange) for reverse situations
 */
export default function NexvertLogo({ height = 36, mono = false }) {
  const accent = mono ? '#f0ede8' : '#ff5c35';
  const w = Math.round(height * 4.2); // aspect ratio ~4.2:1

  return (
    <svg
      width={w}
      height={height}
      viewBox="0 0 210 50"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Nexvert"
      role="img"
    >
      {/* ── N mark ── */}
      {/* Left stroke */}
      <rect x="2" y="4" width="7" height="36" fill="#f0ede8" />
      {/* Right stroke */}
      <rect x="29" y="4" width="7" height="36" fill="#f0ede8" />
      {/* Diagonal stroke */}
      <polygon points="9,4 17,4 36,40 29,40" fill="#f0ede8" />
      {/* Arrow accent — forward-right pointing */}
      <polygon points="30,5 43,18 30,31 30,23 20,23 20,13 30,13" fill={accent} />

      {/* ── Wordmark ── */}
      <text
        x="52"
        y="38"
        fontFamily="'Barlow Condensed', 'Barlow', sans-serif"
        fontSize="36"
        fontWeight="900"
        letterSpacing="2"
        fill="#f0ede8"
      >
        NEXVERT
      </text>

      {/* ── Tagline underline bar ── */}
      <rect x="52" y="43" width="22" height="2.5" rx="1.25" fill={accent} />
    </svg>
  );
}
