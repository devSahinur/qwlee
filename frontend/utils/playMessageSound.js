// Tiny notification chime synthesised via the Web Audio API. No audio
// asset to ship and no autoplay-policy headaches with <audio> tags;
// the AudioContext is only created on-demand (after the user has
// already interacted with the page by, e.g., opening the inbox).
//
// Honours a "qwlee:mute" localStorage flag so users can silence
// notifications without us shipping a settings UI yet.

let ctx;

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    ctx = new Ctx();
  }
  return ctx;
}

export function isMuted() {
  try {
    return localStorage.getItem("qwlee:mute") === "1";
  } catch {
    return false;
  }
}

export function setMuted(v) {
  try {
    if (v) localStorage.setItem("qwlee:mute", "1");
    else localStorage.removeItem("qwlee:mute");
  } catch {
    /* ignore */
  }
}

// Two soft bell tones (E5 → A5). Plays on the user's gesture-thawed
// AudioContext; any failure is swallowed so a broken speaker can't
// break the message flow.
export default function playMessageSound() {
  if (isMuted()) return;
  const audioCtx = getCtx();
  if (!audioCtx) return;
  try {
    if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
    const now = audioCtx.currentTime;
    const tones = [
      { freq: 659.25, start: 0, dur: 0.18 },   // E5
      { freq: 880.0, start: 0.12, dur: 0.22 },  // A5
    ];
    for (const t of tones) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = t.freq;
      gain.gain.setValueAtTime(0.0001, now + t.start);
      gain.gain.exponentialRampToValueAtTime(0.18, now + t.start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + t.start + t.dur);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(now + t.start);
      osc.stop(now + t.start + t.dur + 0.02);
    }
  } catch {
    /* swallow — never let a sound bug break the message handler */
  }
}
