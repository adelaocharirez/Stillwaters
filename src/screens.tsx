import { useState } from "react";
import { Horizon } from "./Horizon";
import { FOCI, SESSIONS, focusLabel, sessionById, sessionMinutes, type Focus, type Session } from "./content";
import { currentRun, dayKey, lastDays, latestCompletion, totals, type JournalEntry, type State } from "./store";
import { greeting, type Sky } from "./sky";

export type Tab = "today" | "library" | "journal" | "you";
type Update = (p: Partial<State> | ((s: State) => Partial<State>)) => void;

const P = {
  today: "M3 17h18M7 17a5 5 0 0110 0M12 5v3M5.2 9.2l1.8 1.8M18.8 9.2L17 11",
  library: "M5 5h4v14H5zM11 5h4v14h-4zM17.5 6l3 .8-3.2 12.2-3-.8",
  journal: "M6 4h11a1 1 0 011 1v15H7a1 1 0 01-1-1zM6 17h12M10 8h5",
  you: "M12 12a4 4 0 100-8 4 4 0 000 8zM4.5 20a7.5 7.5 0 0115 0",
  check: "M5 12.5l4.5 4.5L19 7.5",
  lock: "M7 11V8a5 5 0 0110 0v3M6 11h12v9H6z",
  play: "M8 5.5v13l11-6.5z",
};
const Ico = ({ d, size = 22, fill = false }: { d: keyof typeof P; size?: number; fill?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={P[d]} />
  </svg>
);

export function TabBar({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  const items: { id: Tab; label: string }[] = [
    { id: "today", label: "Today" },
    { id: "library", label: "Library" },
    { id: "journal", label: "Journal" },
    { id: "you", label: "You" },
  ];
  return (
    <nav className="tabbar" aria-label="Main">
      {items.map((it) => (
        <button key={it.id} className={tab === it.id ? "tab on" : "tab"} onClick={() => onTab(it.id)} aria-current={tab === it.id ? "page" : undefined}>
          <Ico d={it.id} />
          <span>{it.label}</span>
        </button>
      ))}
    </nav>
  );
}

/* ---------------- Today ---------------- */

export function Today(props: {
  s: State;
  sky: Sky;
  session: Session;
  next: Session;
  isFree: (x: Session) => boolean;
  onBegin: (x: Session) => void;
  onJournal: () => void;
}) {
  const { s, sky, session, next, isFree, onBegin, onJournal } = props;
  const run = currentRun(s.completions);
  const week = lastDays(7, s.completions);
  const doneToday = !!s.completions[dayKey()]?.length;
  const t = totals(s.completions);
  const last = latestCompletion(s.completions);
  const lastSession = last ? sessionById(last.sessionId) : undefined;
  const name = s.name.trim();
  const date = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const note = doneToday
    ? "You prayed today. Come back tomorrow, or pray again whenever you like."
    : t.days === 0
      ? "Your first prayer is ready."
      : run === 0
        ? "Welcome back. Today's prayer is ready."
        : "Today's prayer is ready.";

  return (
    <div className="screen">
      <header className="top">
        <div>
          <h2 className="hello">{greeting()}{name ? `, ${name}` : ""}</h2>
          <p className="date">{date}</p>
        </div>
        {run > 0 && (
          <div className="run" title="Days in a row">
            <Ico d="check" size={16} />
            <span>{run} {run === 1 ? "day" : "days"}</span>
          </div>
        )}
      </header>

      <div className="hero">
        <Horizon stars={sky.name === "night"} />
      </div>

      <section className="today-card" aria-labelledby="today-title">
        <div className="meta">
          <span className="pill">{focusLabel(session.focus)}</span>
          <span className="pill">{sessionMinutes(session, s.silence)} min</span>
          {doneToday && (
            <span className="pill ok">
              <Ico d="check" size={14} /> Done today
            </span>
          )}
        </div>
        <h1 id="today-title">{session.title}</h1>
        <p className="ref-line">{session.ref}</p>
        <p className="soft">{note}</p>
        <button className="primary" onClick={() => onBegin(session)}>
          <Ico d="play" size={18} fill /> {doneToday ? "Pray again" : "Begin prayer"}
        </button>
      </section>

      <section className="block" aria-label="This week">
        <h3>This week</h3>
        <div className="week">
          {week.map((d) => (
            <div key={d.key} className={`day${d.done ? " done" : ""}${d.today ? " today" : ""}`}>
              <span className="dot">{d.done && <Ico d="check" size={14} />}</span>
              <span className="dl">{d.letter}</span>
            </div>
          ))}
        </div>
      </section>

      {lastSession && (
        <section className="block carry-card">
          <h3>What you carried last</h3>
          <p className="carry-line small">{lastSession.carry}</p>
          <button className="link" onClick={onJournal}>Write about it</button>
        </section>
      )}

      {next.id !== session.id && (
        <section className="block">
          <h3>Up next in {focusLabel(next.focus)}</h3>
          <button className="row" onClick={() => onBegin(next)}>
            <span className="row-title">
              {next.title}
              <small>{next.ref}</small>
            </span>
            <span className="row-meta">{sessionMinutes(next, s.silence)} min</span>
            {isFree(next) ? <Ico d="play" size={18} fill /> : <Ico d="lock" size={18} />}
          </button>
        </section>
      )}
    </div>
  );
}

/* ---------------- Library ---------------- */

export function Library(props: {
  s: State;
  isFree: (x: Session) => boolean;
  onOpen: (x: Session) => void;
}) {
  const { s, isFree, onOpen } = props;
  const done = new Set(Object.values(s.completions).flat().map((c) => c.sessionId));
  const ordered = [...FOCI].sort((a, b) => (a.id === s.focus ? -1 : b.id === s.focus ? 1 : 0));
  return (
    <div className="screen">
      <header className="top single">
        <h2 className="page-title">Library</h2>
        <p className="date">{SESSIONS.length} prayers across six journeys</p>
      </header>
      {ordered.map((f) => (
        <section key={f.id} className="block" aria-label={f.label}>
          <div className="journey-head">
            <h3>{f.label}</h3>
            {f.id === s.focus && <span className="pill">Your focus</span>}
          </div>
          <p className="soft">{f.blurb}</p>
          <ul className="list">
            {SESSIONS.filter((x) => x.focus === f.id).map((x) => (
              <li key={x.id}>
                <button className="row" onClick={() => onOpen(x)}>
                  <span className="row-title">
                    {x.title}
                    <small>{x.ref}</small>
                  </span>
                  <span className="row-meta">{sessionMinutes(x, s.silence)} min</span>
                  {done.has(x.id) ? <Ico d="check" size={18} /> : isFree(x) ? <Ico d="play" size={18} fill /> : <Ico d="lock" size={18} />}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/* ---------------- Journal ---------------- */

export function Journal(props: {
  entries: JournalEntry[];
  prefillSession?: string;
  onSave: (text: string, sessionId?: string) => void;
  onDelete: (id: string) => void;
  onPrefillUsed: () => void;
}) {
  const { entries, prefillSession, onSave, onDelete, onPrefillUsed } = props;
  const [composing, setComposing] = useState(!!prefillSession);
  const [text, setText] = useState("");
  const [sessionId, setSessionId] = useState<string | undefined>(prefillSession);
  const [confirm, setConfirm] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const prompt = sessionId ? sessionById(sessionId) : undefined;

  const close = () => {
    setComposing(false);
    setText("");
    setSessionId(undefined);
    onPrefillUsed();
  };
  const save = () => {
    if (!text.trim()) return;
    onSave(text.trim(), sessionId);
    close();
  };
  const copyAll = async () => {
    const body = entries
      .map((e) => `${new Date(e.ts).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}\n${e.text}`)
      .join("\n\n");
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="screen">
      <header className="top single">
        <h2 className="page-title">Journal</h2>
        <p className="date">Private to this device</p>
      </header>

      {composing ? (
        <section className="block compose">
          {prompt && (
            <p className="prompt">
              From <em>{prompt.title}</em>: {prompt.carry}
            </p>
          )}
          <label htmlFor="entry" className="sr">Journal entry</label>
          <textarea
            id="entry"
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What is on your heart today?"
            rows={7}
          />
          <div className="btn-row">
            <button className="primary" onClick={save} disabled={!text.trim()}>Save entry</button>
            <button className="ghost" onClick={close}>Cancel</button>
          </div>
        </section>
      ) : (
        <div className="btn-row">
          <button className="primary" onClick={() => setComposing(true)}>New entry</button>
          {entries.length > 0 && (
            <button className="ghost" onClick={copyAll}>{copied ? "Copied" : "Copy all"}</button>
          )}
        </div>
      )}

      {entries.length === 0 && !composing && (
        <p className="empty">
          Nothing here yet. After you pray, write down the thought you want to carry, or just start with what you are thankful for.
        </p>
      )}

      <ul className="entries">
        {entries.map((e) => {
          const ss = e.sessionId ? sessionById(e.sessionId) : undefined;
          return (
            <li key={e.id} className="entry">
              <div className="entry-head">
                <time>{new Date(e.ts).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</time>
                {ss && <span className="pill">{ss.title}</span>}
              </div>
              <p>{e.text}</p>
              {confirm === e.id ? (
                <div className="btn-row tight">
                  <span className="soft">Delete this entry?</span>
                  <button className="link danger" onClick={() => { onDelete(e.id); setConfirm(null); }}>Delete</button>
                  <button className="link" onClick={() => setConfirm(null)}>Keep</button>
                </div>
              ) : (
                <button className="link muted" onClick={() => setConfirm(e.id)}>Delete</button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------------- You ---------------- */

function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} className={on ? "switch on" : "switch"} onClick={() => onChange(!on)}>
      <i />
    </button>
  );
}

export function You(props: { s: State; update: Update; onReset: () => void; onPaywall: () => void }) {
  const { s, update, onReset, onPaywall } = props;
  const t = totals(s.completions);
  const run = currentRun(s.completions);
  const [confirmReset, setConfirmReset] = useState(false);
  return (
    <div className="screen">
      <header className="top single">
        <h2 className="page-title">You</h2>
      </header>

      <section className="stats" aria-label="Your prayer life">
        <div><b>{t.days}</b><span>{t.days === 1 ? "day prayed" : "days prayed"}</span></div>
        <div><b>{t.minutes}</b><span>{t.minutes === 1 ? "minute" : "minutes"} in prayer</span></div>
        <div><b>{run}</b><span>{run === 1 ? "day" : "days"} in a row</span></div>
      </section>

      <section className="block">
        <h3>Membership</h3>
        {s.premium ? (
          <p className="soft">Your free trial is active (demo). Every prayer in the library is open.</p>
        ) : (
          <>
            <p className="soft">Today's prayer is always free. Membership opens every journey in the library.</p>
            <button className="primary" onClick={onPaywall}>Try 7 days free</button>
          </>
        )}
      </section>

      <section className="block">
        <h3>Prayer</h3>
        <div className="field">
          <label htmlFor="nm">Your first name</label>
          <input id="nm" value={s.name} onChange={(e) => update({ name: e.target.value })} placeholder="Optional" autoComplete="given-name" />
        </div>
        <div className="field">
          <span className="label" id="focus-l">Focus for your daily prayer</span>
          <div className="chips" role="radiogroup" aria-labelledby="focus-l">
            {FOCI.map((f) => (
              <button key={f.id} role="radio" aria-checked={s.focus === f.id} className={s.focus === f.id ? "chip on" : "chip"} onClick={() => update({ focus: f.id as Focus })}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <span className="label" id="sil-l">Length of silence</span>
          <div className="chips" role="radiogroup" aria-labelledby="sil-l">
            {(["short", "standard", "long"] as const).map((k) => (
              <button key={k} role="radio" aria-checked={s.silence === k} className={s.silence === k ? "chip on" : "chip"} onClick={() => update({ silence: k })}>
                {k === "short" ? "Short" : k === "standard" ? "Standard" : "Long"}
              </button>
            ))}
          </div>
        </div>
        <div className="toggle-row">
          <span>Spoken guidance<small>Uses your device's voice until recordings are added</small></span>
          <Switch on={s.narrate} onChange={(v) => update({ narrate: v })} label="Spoken guidance" />
        </div>
        <div className="toggle-row">
          <span>Ambient sound<small>A soft tone under the prayer</small></span>
          <Switch on={s.ambient} onChange={(v) => update({ ambient: v })} label="Ambient sound" />
        </div>
        <div className="field">
          <label htmlFor="pt">Reminder time</label>
          <input id="pt" type="time" value={s.prayerTime} onChange={(e) => update({ prayerTime: e.target.value })} />
          <p className="fine">Push reminders arrive with the installed app. Your time is saved for then.</p>
        </div>
      </section>

      <section className="block">
        <h3>Privacy</h3>
        <p className="soft">There are no ads and no tracking. Your prayers and journal stay on this device. Your faith is not data we sell.</p>
        {confirmReset ? (
          <div className="btn-row tight">
            <span className="soft">Erase all progress and entries?</span>
            <button className="link danger" onClick={() => { onReset(); setConfirmReset(false); }}>Erase</button>
            <button className="link" onClick={() => setConfirmReset(false)}>Keep</button>
          </div>
        ) : (
          <button className="link muted" onClick={() => setConfirmReset(true)}>Erase everything on this device</button>
        )}
      </section>
      <p className="fine center">Scripture quotations are from the King James Version.</p>
    </div>
  );
}

/* ---------------- Onboarding ---------------- */

const TIMES = [
  { label: "Morning", time: "07:00" },
  { label: "Midday", time: "12:15" },
  { label: "Evening", time: "18:30" },
  { label: "Bedtime", time: "21:30" },
];

export function Onboarding({ sky, onDone }: { sky: Sky; onDone: (p: Partial<State>) => void }) {
  const [step, setStep] = useState(0);
  const [focus, setFocus] = useState<Focus>("peace");
  const [time, setTime] = useState("07:00");
  const [name, setName] = useState("");

  return (
    <div className="onboard">
      <div className={step === 0 ? "onboard-sky" : "onboard-sky small"}>
        <Horizon breathing stars={sky.name === "night"} />
      </div>
      <div className="onboard-body">
        {step === 0 && (
          <>
            <p className="wordmark">Stillwaters</p>
            <h1>A few quiet minutes with God, before the day gets loud.</h1>
            <p className="soft">One guided prayer each day. Scripture read slowly, a moment of stillness, and one thought to carry.</p>
            <button className="primary" onClick={() => setStep(1)}>Get started</button>
            <p className="fine">No ads. Your prayers stay on your device.</p>
          </>
        )}
        {step === 1 && (
          <>
            <h1 className="sm">What do you most need prayer for right now?</h1>
            <div className="options" role="radiogroup" aria-label="Focus">
              {FOCI.map((f) => (
                <button key={f.id} role="radio" aria-checked={focus === f.id} className={focus === f.id ? "option on" : "option"} onClick={() => setFocus(f.id)}>
                  <b>{f.label}</b>
                  <span>{f.blurb}</span>
                </button>
              ))}
            </div>
            <button className="primary" onClick={() => { setTime(focus === "sleep" ? "21:30" : "07:00"); setStep(2); }}>Continue</button>
          </>
        )}
        {step === 2 && (
          <>
            <h1 className="sm">When would you like to pray?</h1>
            <div className="chips" role="radiogroup" aria-label="Prayer time">
              {TIMES.map((t) => (
                <button key={t.label} role="radio" aria-checked={time === t.time} className={time === t.time ? "chip on" : "chip"} onClick={() => setTime(t.time)}>
                  {t.label}
                </button>
              ))}
            </div>
            <div className="field">
              <label htmlFor="ob-name">What should we call you?</label>
              <input id="ob-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="First name, optional" autoComplete="given-name" />
            </div>
            <button className="primary" onClick={() => onDone({ focus, prayerTime: time, name: name.trim(), onboarded: true })}>Open my first prayer</button>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- Paywall ---------------- */

export function Paywall(props: { reason?: string; onClose: () => void; onStart: () => void }) {
  const [plan, setPlan] = useState<"year" | "month">("year");
  return (
    <div className="sheet-wrap" role="dialog" aria-label="Membership">
      <button className="scrim" onClick={props.onClose} aria-label="Close" />
      <div className="sheet">
        <h2>Pray every day, with every journey open</h2>
        {props.reason && <p className="soft">{props.reason}</p>}
        <ul className="perks">
          <li>All six journeys: peace, anxiety, gratitude, family, grief and sleep</li>
          <li>New prayers as they are written and reviewed</li>
          <li>No ads, ever</li>
        </ul>
        <div className="plans" role="radiogroup" aria-label="Plan">
          <button role="radio" aria-checked={plan === "year"} className={plan === "year" ? "plan on" : "plan"} onClick={() => setPlan("year")}>
            <span><b>Yearly</b><small>$49.99 a year, about $4.17 a month</small></span>
            <em>Best value</em>
          </button>
          <button role="radio" aria-checked={plan === "month"} className={plan === "month" ? "plan on" : "plan"} onClick={() => setPlan("month")}>
            <span><b>Monthly</b><small>$6.99 a month</small></span>
          </button>
        </div>
        <button className="primary" onClick={props.onStart}>Start 7-day free trial</button>
        <p className="fine center">
          {plan === "year" ? "Then $49.99 a year." : "Then $6.99 a month."} Cancel anytime. This is a demo build, so no card is charged.
        </p>
        <button className="link center-btn" onClick={props.onClose}>Not now</button>
      </div>
    </div>
  );
}
