import { useId } from "react";

type Props = {
  breathing?: boolean;
  paused?: boolean;
  cycleKey?: number;
  stars?: boolean;
};

const STARS = [
  [34, 30, 1.4], [82, 64, 1], [128, 22, 1.2], [168, 78, 0.9], [214, 36, 1.3], [262, 70, 1],
  [304, 26, 1.4], [330, 92, 0.9], [58, 110, 0.9], [286, 118, 1],
];

const BARS = [
  { w: 96, o: 0.78 }, { w: 82, o: 0.6 }, { w: 66, o: 0.46 }, { w: 52, o: 0.34 },
  { w: 40, o: 0.25 }, { w: 28, o: 0.17 }, { w: 18, o: 0.1 },
];

/** The signature image: a sun over still water. The sun breathes during prayer. */
export function Horizon({ breathing = false, paused = false, cycleKey = 0, stars = false }: Props) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className={`horizon${paused ? " paused" : ""}`}
      viewBox="0 0 360 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--sky-top)" }} />
          <stop offset=".55" style={{ stopColor: "var(--sky-mid)" }} />
          <stop offset="1" style={{ stopColor: "var(--sky-low)" }} />
        </linearGradient>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--sky-low)", stopOpacity: 0.55 }} />
          <stop offset=".45" style={{ stopColor: "var(--sky-mid)", stopOpacity: 0.85 }} />
          <stop offset="1" style={{ stopColor: "var(--sky-top)" }} />
        </linearGradient>
        <radialGradient id={`${id}g`}>
          <stop offset="0" style={{ stopColor: "var(--glow)", stopOpacity: 0.6 }} />
          <stop offset=".55" style={{ stopColor: "var(--glow)", stopOpacity: 0.16 }} />
          <stop offset="1" style={{ stopColor: "var(--glow)", stopOpacity: 0 }} />
        </radialGradient>
        <radialGradient id={`${id}o`}>
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".7" style={{ stopColor: "var(--glow)" }} />
          <stop offset="1" style={{ stopColor: "var(--glow)" }} />
        </radialGradient>
      </defs>

      <rect width="360" height="190" fill={`url(#${id}s)`} />
      {stars &&
        STARS.map(([x, y, r], i) => (
          <circle key={i} className="star" cx={x} cy={y} r={r} fill="#eef3f2" style={{ animationDelay: `${i * 0.7}s` }} />
        ))}

      <g key={cycleKey} className={breathing ? "orb breathe" : "orb"}>
        <circle cx="180" cy="140" r="118" fill={`url(#${id}g)`} />
        <circle cx="180" cy="140" r="33" fill={`url(#${id}o)`} />
      </g>

      <path
        d="M0 190 L0 172 C38 158 72 160 112 174 C150 186 172 188 204 187 C250 185 288 162 328 160 C346 159 354 162 360 166 L360 190Z"
        style={{ fill: "var(--sky-top)", opacity: 0.78 }}
      />
      <rect y="190" width="360" height="110" fill={`url(#${id}w)`} />

      <g style={{ fill: "var(--glow)" }}>
        {BARS.map((b, i) => (
          <rect
            key={i}
            className="ripple"
            x={180 - b.w / 2}
            y={198 + i * 13}
            width={b.w}
            height="4.5"
            rx="2.25"
            opacity={b.o}
            style={{ animationDelay: `${i * 0.5}s`, animationDuration: `${6 + (i % 3)}s` }}
          />
        ))}
      </g>
      <rect y="189" width="360" height="1" style={{ fill: "var(--glow)", opacity: 0.35 }} />
    </svg>
  );
}
