import { useEffect, useState } from "react";
import Mustache from "./mustache.jsx";     // ← new line

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

const Container = ({ children, className = "" }) => (
  <div className={`mx-auto max-w-3xl px-6 sm:px-8 lg:px-12 ${className}`}>
    {children}
  </div>
);

const Header = () => (
  <header className="sticky top-0 z-10 bg-slate-900 text-white shadow-md">
    <Container>
      <h1 className="py-3 text-center text-2xl sm:text-3xl font-semibold tracking-wide">
        The Mysterious Affair at Styles
      </h1>
    </Container>
  </header>
);
   
const ChoiceButton = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full rounded-lg bg-indigo-600 py-3 px-4 text-sm font-semibold text-white shadow-sm
               transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-3
               first:mt-2 last:mb-0"
  >
    {label}
  </button>
);
export default function StoryBrainUI() {
  const [narrative, setNarrative] = useState("…loading…");
  const [choices, setChoices] = useState([]);
  const [loading, setLoading] = useState(false);
const [mustacheMood, setMustacheMood] = useState("neutral");


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
// grab the mood if present
setMustacheMood(
data.stateDelta?.global?.mustacheMood ?? "neutral"
);
    } catch (err) {
      setNarrative("🚨 Error contacting the story engine. Check console.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

return (
  <div className="flex h-screen flex-col bg-slate-800 text-slate-100">
    <Header />

    {/* MAIN SCROLL AREA */}
  
      
<main className="flex-1 overflow-y-auto pb-[11rem] pt-4">
<Container className="">  {/* narrative + buttons */}
<article className="mx-auto max-w-prose whitespace-pre-wrap leading-relaxed space-y-4">
        {narrative}
      </article>
      <div className="mt-8 max-w-sm">
        {choices.map((c) => (
          <ChoiceButton key={c} label={c} onClick={() => playTurn (c)} />
        ))}
      </div>
{/* free‑text bar now inside the same container */}
    <form
      className="sticky bottom-[5.5rem] mx-auto mt-6 flex max-w-sm
                 overflow-hidden rounded-lg bg-slate-700/80 shadow
                backdrop-blur focus-within:ring-2 focus-within:ring-indigo-400"
        onSubmit={(e) => {
          e.preventDefault();
          const freeText = new FormData(e.target).get("free")?.toString() || "";
          if (freeText.trim()) playTurn(freeText.trim());
          e.target.reset();
        }}
      >
        <input
          name="free"
          aria-label="Custom action"
          className="flex-1 bg-transparent px-3 py-2 text-sm
placeholder-slate-400 focus:outline-none"
          placeholder="Or type your own action…"
          disabled={loading}
        />
        <button
          type="submit"
className="bg-indigo-600 px-4 py-2 text-sm font-semibold text-white
transition hover:bg-indigo-500 disabled:opacity-50"

          disabled={loading}
        >
          Send
        </button>
      </form>

</Container>
</main>
    {/* PERSISTENT MUSTACHE “HUD” */}
    <footer className="fixed inset-x-0 bottom-0 flex justify-center bg-slate-900/80 py-2 shadow-inner backdrop-blur">
      <Mustache mood={mustacheMood} />
    </footer>
  </div>
);

}
