import { useEffect, useState } from "react";

/**
 * Skeleton StoryBrain front‑end
 * --------------------------------------------------
 * • Assumes the API is deployed at Vercel under
 *   https://mystery-api.vercel.app/api/play  (change if needed).
 * • Keeps all state client‑side; no Redux or router yet.
 * • TailwindCSS utility classes for quick styling (works automatically on Vercel).
 */
/* ── helper: create or reuse a playerId ── */
function getOrCreatePlayerId() {
  const stored = localStorage.getItem("playerId");
  if (stored) return stored;

  // browser‑native UUID v4 (works in all modern browsers)
  const id = crypto.randomUUID();
  localStorage.setItem("playerId", id);
  return id;
}

const API_URL  = "/api/play";        // same-origin
const PLAYER_ID = getOrCreatePlayerId();   // ← use the helper here

export default function StoryBrainUI() {
  const [narrative, setNarrative] = useState("…loading…");
  const [choices, setChoices] = useState([]);
  const [loading, setLoading] = useState(false);

  // initial turn – send a synthetic "begin"
  useEffect(() => {
    playTurn("begin");
  }, []);

  async function playTurn(action) {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: PLAYER_ID, userAction: action })
      });
      const data = await res.json();
      setNarrative(data.narrative);
      setChoices(data.choices);
    } catch (err) {
      setNarrative("🚨 Error contacting the story engine. Check console.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center p-6">
      <div className="max-w-prose w-full bg-white shadow rounded-2xl p-6 space-y-6">
        <p className="font-serif whitespace-pre-wrap leading-relaxed">{narrative}</p>

        <div className="grid gap-3">
          {choices.map((c) => (
            <button
              key={c}
              className="border rounded-lg py-2 px-4 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => playTurn(c)}
              disabled={loading}
            >
              {c}
            </button>
          ))}
        </div>

        {/* fallback free‑text input for ad‑hoc actions */}
        <form
          className="flex gap-2 pt-4"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const freeText = formData.get("free").toString();
            if (freeText.trim()) playTurn(freeText.trim());
            e.target.reset();
          }}
        >
          <input
            name="free"
            className="flex-1 border rounded-lg p-2"
            placeholder="Or type your own action…"
            disabled={loading}
          />
          <button className="border rounded-lg py-2 px-4" disabled={loading}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
