import { useCallback, useEffect, useState } from "react";
import type { Focus, Silence } from "./content";

export type Completion = { sessionId: string; seconds: number };
export type JournalEntry = { id: string; day: string; ts: number; text: string; sessionId?: string };

export type State = {
  onboarded: boolean;
  name: string;
  focus: Focus;
  prayerTime: string; // "07:00"
  narrate: boolean;
  ambient: boolean;
  silence: Silence;
  premium: boolean; // demo flag until real payments are connected
  completions: Record<string, Completion[]>;
  journal: JournalEntry[];
};

const KEY = "stillwaters:v1";

const initial: State = {
  onboarded: false,
  name: "",
  focus: "peace",
  prayerTime: "07:00",
  narrate: true,
  ambient: true,
  silence: "standard",
  premium: false,
  completions: {},
  journal: [],
};

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...initial, ...JSON.parse(raw) };
  } catch {
    /* storage unavailable */
  }
  return initial;
}

export function useStore() {
  const [state, setState] = useState<State>(load);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state]);
  const update = useCallback(
    (patch: Partial<State> | ((s: State) => Partial<State>)) =>
      setState((s) => ({ ...s, ...(typeof patch === "function" ? patch(s) : patch) })),
    []
  );
  const reset = useCallback(() => setState(initial), []);
  return [state, update, reset] as const;
}

export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function currentRun(c: State["completions"]): number {
  const d = new Date();
  if (!c[dayKey(d)]) d.setDate(d.getDate() - 1);
  let n = 0;
  while (c[dayKey(d)]) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function lastDays(n: number, c: State["completions"]) {
  const out: { key: string; letter: string; done: boolean; today: boolean }[] = [];
  const d = new Date();
  d.setDate(d.getDate() - (n - 1));
  for (let i = 0; i < n; i++) {
    const key = dayKey(d);
    out.push({
      key,
      letter: d.toLocaleDateString("en-US", { weekday: "narrow" }),
      done: !!c[key],
      today: i === n - 1,
    });
    d.setDate(d.getDate() + 1);
  }
  return out;
}

export function totals(c: State["completions"]) {
  const days = Object.keys(c).filter((k) => c[k].length).length;
  const seconds = Object.values(c).flat().reduce((a, x) => a + x.seconds, 0);
  return { days, minutes: Math.round(seconds / 60) };
}

export function latestCompletion(c: State["completions"]): { day: string; sessionId: string } | null {
  const days = Object.keys(c).filter((k) => c[k].length).sort();
  if (!days.length) return null;
  const day = days[days.length - 1];
  return { day, sessionId: c[day][c[day].length - 1].sessionId };
}
