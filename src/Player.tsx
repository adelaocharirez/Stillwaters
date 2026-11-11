import { useEffect, useMemo, useRef, useState } from "react";
import { Horizon } from "./Horizon";
import { ambient, tts } from "./audio";
import { STAGES, buildScript, readMs, type Session, type Silence } from "./content";
import type { Sky } from "./sky";

type Props = {
  session: Session;
  sky: Sky;
  narrate: boolean;
  ambientOn: boolean;
  silence: Silence;
  onClose: () => void;
  onComplete: (sessionId: string, seconds: number) => void;
  onJournal: (sessionId: string) => void;
};

function BreathCue() {
  const [inhale, setInhale] = useState(true);
  useEffect(() => {
    let t = 0;
    const loop = (i: boolean) => {
      setInhale(i);
      t = window.setTimeout(() => loop(!i), i ? 4000 : 6000);
    };
    loop(true);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <p className="breath" aria-live="polite">
      {inhale ? "Breathe in" : "Breathe out"}
    </p>
  );
}

const Icon = {
  close: <path d="M6 6l12 12M18 6L6 18" />,
  play: <path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none" />,
  pause: <path d="M8 5.5v13M16 5.5v13" strokeWidth="3" />,
  prev: <path d="M7 5v14M18 5.5v13l-9-6.5z" />,
  next: <path d="M17 5v14M6 5.5v13l9-6.5z" />,
  sound: <path d="M4 9.5v5h4l5 4v-13l-5 4zM16.5 9a4 4 0 010 6M18.8 6.8a7 7 0 010 10.4" />,
  mute: <path d="M4 9.5v5h4l5 4v-13l-5 4zM17 9.5l4 5M21 9.5l-4 5" />,
};
const Svg = ({ d, size = 22 }: { d: keyof typeof Icon; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {Icon[d]}
  </svg>
);

export function Player({ session, sky, narrate, ambientOn, silence, onClose, onComplete, onJournal }: Props) {
  const script = useMemo(() => buildScript(session, silence), [session, silence]);
  const { steps, display, carryIndex } = script;
  const useVoice = narrate && tts.available;

  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [done, setDone] = useState(false);
  const [muted, setMuted] = useState(!ambientOn);
  const waitLeft = useRef(0);
  const startedAt = useRef(Date.now());
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;
  const activeRef = useRef<HTMLSpanElement | null>(null);

  const stageStart = (s: number) => steps.findIndex((x) => x.stage === s);
  const breathIdx = steps.findIndex((x) => x.kind === "wait" && x.label === "breathe");

  useEffect(() => {
    if (ambientOn) ambient.start(session.focus === "sleep");
    return () => {
      ambient.stop();
      tts.cancel();
    };
  }, [ambientOn, session.focus]);

  useEffect(() => {
    ambient.setMuted(muted || !playing);
  }, [muted, playing]);

  useEffect(() => {
    if (!playing || done) return;
    if (idx >= steps.length) {
      setDone(true);
      setPlaying(false);
      ambient.stop();
      completeRef.current(session.id, Math.round((Date.now() - startedAt.current) / 1000));
      return;
    }
    const st = steps[idx];
    let finished = false;
    let timer = 0;
    const t0 = performance.now();
    const next = () => {
      if (finished) return;
      finished = true;
      waitLeft.current = 0;
      window.clearTimeout(timer);
      setIdx((i) => i + 1);
    };
    let waitMs = 0;
    if (st.kind === "say") {
      const est = readMs(st.text);
      if (useVoice) {
        timer = window.setTimeout(next, est * 2 + 5000); // watchdog if the voice never reports an end
        tts.speak(st.text, next, () => {
          if (finished) return;
          window.clearTimeout(timer);
          timer = window.setTimeout(next, est);
        });
      } else {
        timer = window.setTimeout(next, est);
      }
    } else {
      waitMs = waitLeft.current > 0 ? waitLeft.current : st.ms;
      timer = window.setTimeout(next, waitMs);
    }
    return () => {
      if (!finished && st.kind === "wait") waitLeft.current = Math.max(400, waitMs - (performance.now() - t0));
      finished = true;
      window.clearTimeout(timer);
      tts.cancel();
    };
  }, [idx, playing, done, steps, useVoice, session.id]);

  const atEnd = idx >= steps.length;
  const cur = steps[Math.min(idx, steps.length - 1)];
  const stage = done || atEnd ? 3 : cur.stage;

  let active = -1;
  for (let i = 0; i <= Math.min(idx, steps.length - 1); i++) {
    const s = steps[i];
    if (s.stage === stage && s.kind === "say" && s.chunk >= 0) active = s.chunk;
  }
  const inBreath = !done && cur.kind === "wait" && cur.label === "breathe";
  const inSilence = !done && cur.kind === "wait" && cur.label === "silence" && cur.ms > 5000;
  const showCarry = idx >= carryIndex || done;

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [active, stage]);

  const goStage = (s: number) => {
    waitLeft.current = 0;
    tts.cancel();
    setDone(false);
    setIdx(Math.max(0, Math.min(steps.length - 1, stageStart(s))));
    setPlaying(true);
  };
  const back = () => {
    const here = stageStart(stage);
    goStage(idx <= here + 1 && stage > 0 ? stage - 1 : stage);
  };
  const forward = () => {
    if (stage >= 3) {
      waitLeft.current = 0;
      setIdx(carryIndex);
      setPlaying(true);
    } else goStage(stage + 1);
  };

  const stageLen = (s: number) => steps.filter((x) => x.stage === s).length;
  const fraction = (s: number) => {
    if (done || s < stage) return 1;
    if (s > stage) return 0;
    return Math.min(1, Math.max(0, (idx - stageStart(s)) / stageLen(s)));
  };

  const chunks = display[stage];
  const minutesPrayed = Math.max(1, Math.round((Date.now() - startedAt.current) / 60000));

  return (
    <div className="player" role="dialog" aria-label={`Prayer: ${session.title}`}>
      <div className="player-top">
        <button className="icon-btn" onClick={onClose} aria-label="Close prayer">
          <Svg d="close" />
        </button>
        <div className="segments" role="progressbar" aria-label="Progress" aria-valuemin={0} aria-valuemax={4} aria-valuenow={done ? 4 : stage}>
          {STAGES.map((n, i) => (
            <div key={n} className="seg">
              <i style={{ transform: `scaleX(${fraction(i)})` }} />
            </div>
          ))}
        </div>
        <button className="icon-btn" onClick={() => setMuted((m) => !m)} aria-label={muted ? "Turn sound on" : "Turn sound off"} aria-pressed={muted}>
          <Svg d={muted ? "mute" : "sound"} />
        </button>
      </div>

      <div className="player-sky">
        <Horizon
          breathing
          paused={!playing}
          stars={sky.name === "night"}
          cycleKey={Math.max(0, breathIdx) * 2 + (playing ? 1 : 0)}
        />
      </div>

      {done ? (
        <div className="player-body done-view">
          <p className="stage-name">Prayer complete</p>
          <p className="carry-line">{session.carry}</p>
          <p className="soft">You spent about {minutesPrayed} {minutesPrayed === 1 ? "minute" : "minutes"} with God today.</p>
          <div className="stack">
            <button className="primary" onClick={onClose}>Finish</button>
            <button className="ghost" onClick={() => onJournal(session.id)}>Write it in your journal</button>
          </div>
        </div>
      ) : (
        <>
          <div className="player-body">
            <p className="stage-name">{STAGES[stage]}</p>
            {stage === 1 && (
              <p className="ref">
                {session.ref} <span>King James Version</span>
              </p>
            )}
            {inBreath && playing ? (
              <BreathCue key="breath" />
            ) : (
              <div className={`text stage-${stage}`}>
                {chunks.map((c, i) => (
                  <span
                    key={i}
                    ref={i === active ? activeRef : undefined}
                    className={active === -1 ? "chunk mid" : i === active ? "chunk on" : i < active ? "chunk past" : "chunk"}
                  >
                    {c}{" "}
                  </span>
                ))}
                {stage === 3 && showCarry && <p className="carry-line small">{session.carry}</p>}
              </div>
            )}
            {inSilence && playing && <p className="rest">Rest in the quiet</p>}
            {!playing && <p className="rest">Paused</p>}
          </div>

          <div className="player-controls">
            <button className="icon-btn big-ghost" onClick={back} aria-label="Previous section">
              <Svg d="prev" />
            </button>
            <button className="play" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"}>
              <Svg d={playing ? "pause" : "play"} size={30} />
            </button>
            <button className="icon-btn big-ghost" onClick={forward} aria-label="Next section">
              <Svg d="next" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
