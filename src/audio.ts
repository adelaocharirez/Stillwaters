// Narration uses the device's built-in speech voices until real recordings are added.
// Ambient sound is a soft synthesized pad, so the app ships with no audio files.

const hasTTS = () =>
  typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";

function pickVoice(): SpeechSynthesisVoice | null {
  try {
    const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith("en"));
    if (!voices.length) return null;
    const score = (v: SpeechSynthesisVoice) => {
      let s = 0;
      if (/natural|premium|enhanced|neural/i.test(v.name)) s += 6;
      if (/samantha|serena|daniel|karen|moira|ava|allison|google uk english/i.test(v.name)) s += 4;
      if (v.lang.toLowerCase() === "en-us" || v.lang.toLowerCase() === "en-gb") s += 1;
      if (v.localService) s += 1;
      return s;
    };
    return [...voices].sort((a, b) => score(b) - score(a))[0];
  } catch {
    return null;
  }
}

export const tts = {
  get available() {
    return hasTTS();
  },
  // Call from a click handler so mobile browsers allow speech later.
  prime() {
    if (!hasTTS()) return;
    try {
      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0;
      window.speechSynthesis.speak(u);
    } catch {
      /* ignore */
    }
  },
  speak(text: string, onEnd: () => void, onError: () => void) {
    if (!hasTTS()) return onError();
    try {
      const u = new SpeechSynthesisUtterance(text);
      const v = pickVoice();
      if (v) u.voice = v;
      u.rate = 0.86;
      u.pitch = 0.95;
      u.onend = () => onEnd();
      u.onerror = () => onError();
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {
      onError();
    }
  },
  cancel() {
    if (!hasTTS()) return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* ignore */
    }
  },
};

class Ambient {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private nodes: (OscillatorNode | AudioBufferSourceNode)[] = [];
  private target = 0.055;

  // Call from a click handler.
  prime() {
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AC) return;
        this.ctx = new AC();
      }
      void this.ctx.resume();
    } catch {
      /* audio unavailable */
    }
  }

  start(sleepy: boolean) {
    const ctx = this.ctx;
    if (!ctx || this.master) return;
    try {
      const master = ctx.createGain();
      master.gain.value = 0;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = sleepy ? 520 : 760;
      filter.connect(master);
      master.connect(ctx.destination);

      // D major open voicing: D3, A3, D4, F#4
      const freqs = [146.83, 220, 293.66, 369.99];
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator();
        o.type = i % 2 ? "triangle" : "sine";
        o.frequency.value = f;
        o.detune.value = (i - 1.5) * 4;
        const g = ctx.createGain();
        g.gain.value = 0.22 / (1 + i * 0.35);
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.06 + i * 0.023;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.1;
        lfo.connect(lfoGain);
        lfoGain.connect(g.gain);
        o.connect(g);
        g.connect(filter);
        o.start();
        lfo.start();
        this.nodes.push(o, lfo);
      });
      this.master = master;
      master.gain.setTargetAtTime(this.target, ctx.currentTime, 2.5);
    } catch {
      /* audio unavailable */
    }
  }

  setMuted(muted: boolean) {
    if (!this.ctx || !this.master) return;
    this.master.gain.setTargetAtTime(muted ? 0 : this.target, this.ctx.currentTime, 0.4);
  }

  stop() {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    try {
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.6);
    } catch {
      /* ignore */
    }
    const nodes = this.nodes;
    this.nodes = [];
    this.master = null;
    window.setTimeout(() => {
      nodes.forEach((n) => {
        try {
          n.stop();
        } catch {
          /* already stopped */
        }
      });
      try {
        master.disconnect();
      } catch {
        /* ignore */
      }
    }, 2500);
  }
}

export const ambient = new Ambient();
