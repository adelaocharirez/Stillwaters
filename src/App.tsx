import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Player } from "./Player";
import { Journal, Library, Onboarding, Paywall, TabBar, Today, You, type Tab } from "./screens";
import { SESSIONS, todaysSession, type Session } from "./content";
import { ambient, tts } from "./audio";
import { dayKey, useStore } from "./store";
import { useSky } from "./sky";

export default function App() {
  const [s, update, reset] = useStore();
  const sky = useSky();
  const [tab, setTab] = useState<Tab>("today");
  const [playing, setPlaying] = useState<Session | null>(null);
  const [paywall, setPaywall] = useState<string | null>(null);
  const [prefill, setPrefill] = useState<string | undefined>();

  const session = useMemo(() => todaysSession(s.focus), [s.focus]);
  const next = useMemo(() => {
    const pool = SESSIONS.filter((x) => x.focus === s.focus);
    return pool[(pool.findIndex((x) => x.id === session.id) + 1) % pool.length];
  }, [s.focus, session]);

  // Today's prayer and the first prayer of every journey are free.
  const isFree = (x: Session) => s.premium || x.id === session.id || x.order === 0;

  useEffect(() => {
    document.documentElement.style.setProperty("color-scheme", "dark");
  }, []);

  const begin = (x: Session) => {
    if (!isFree(x)) {
      setPaywall(`"${x.title}" is part of the ${x.focus} journey.`);
      return;
    }
    ambient.prime(); // must happen inside the tap so the browser allows sound
    tts.prime();
    setPlaying(x);
  };

  const complete = (sessionId: string, seconds: number) =>
    update((st) => {
      const k = dayKey();
      return { completions: { ...st.completions, [k]: [...(st.completions[k] ?? []), { sessionId, seconds }] } };
    });

  const vars = {
    "--sky-top": sky.top,
    "--sky-mid": sky.mid,
    "--sky-low": sky.low,
    "--glow": sky.glow,
  } as CSSProperties;

  return (
    <div className="stage" style={vars} data-sky={sky.name}>
      <div className="device">
        {!s.onboarded ? (
          <Onboarding sky={sky} onDone={(p) => update(p)} />
        ) : (
          <>
            <main className="content" id="main">
              {tab === "today" && (
                <Today
                  s={s}
                  sky={sky}
                  session={session}
                  next={next}
                  isFree={isFree}
                  onBegin={begin}
                  onJournal={() => {
                    setPrefill(undefined);
                    setTab("journal");
                  }}
                />
              )}
              {tab === "library" && <Library s={s} isFree={isFree} onOpen={begin} />}
              {tab === "journal" && (
                <Journal
                  key={prefill ?? "j"}
                  entries={s.journal}
                  prefillSession={prefill}
                  onPrefillUsed={() => setPrefill(undefined)}
                  onSave={(text, sessionId) =>
                    update((st) => ({
                      journal: [{ id: crypto.randomUUID?.() ?? String(Date.now()), day: dayKey(), ts: Date.now(), text, sessionId }, ...st.journal],
                    }))
                  }
                  onDelete={(id) => update((st) => ({ journal: st.journal.filter((e) => e.id !== id) }))}
                />
              )}
              {tab === "you" && <You s={s} update={update} onReset={() => { reset(); setTab("today"); }} onPaywall={() => setPaywall("")} />}
            </main>
            <TabBar tab={tab} onTab={setTab} />
          </>
        )}

        {playing && (
          <Player
            session={playing}
            sky={sky}
            narrate={s.narrate}
            ambientOn={s.ambient}
            silence={s.silence}
            onClose={() => setPlaying(null)}
            onComplete={complete}
            onJournal={(id) => {
              setPlaying(null);
              setPrefill(id);
              setTab("journal");
            }}
          />
        )}

        {paywall !== null && (
          <Paywall
            reason={paywall || undefined}
            onClose={() => setPaywall(null)}
            onStart={() => {
              update({ premium: true });
              setPaywall(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
