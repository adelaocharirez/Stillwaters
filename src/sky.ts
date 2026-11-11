import { useEffect, useState } from "react";

export type Sky = { name: "dawn" | "day" | "dusk" | "night"; top: string; mid: string; low: string; glow: string };

const SKIES: Record<Sky["name"], Sky> = {
  night: { name: "night", top: "#070f19", mid: "#0f2033", low: "#1d3b52", glow: "#dce8ee" },
  dawn: { name: "dawn", top: "#11263b", mid: "#3b5f7d", low: "#e0a38c", glow: "#ffe2b8" },
  day: { name: "day", top: "#17476a", mid: "#3d84a8", low: "#9fd0d9", glow: "#f3f6e8" },
  dusk: { name: "dusk", top: "#19234a", mid: "#4c4478", low: "#cf7f87", glow: "#ffd3b0" },
};

export function skyFor(date = new Date()): Sky {
  const h = date.getHours() + date.getMinutes() / 60;
  if (h >= 5 && h < 8.5) return SKIES.dawn;
  if (h >= 8.5 && h < 17) return SKIES.day;
  if (h >= 17 && h < 20.5) return SKIES.dusk;
  return SKIES.night;
}

export function useSky(): Sky {
  const [sky, setSky] = useState<Sky>(skyFor());
  useEffect(() => {
    const t = window.setInterval(() => setSky((cur) => (skyFor().name === cur.name ? cur : skyFor())), 60000);
    return () => window.clearInterval(t);
  }, []);
  return sky;
}

export const greeting = (d = new Date()) => {
  const h = d.getHours();
  if (h < 5) return "Good evening";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};
