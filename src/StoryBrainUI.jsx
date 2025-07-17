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
  <div className={`w-full px-6 sm:px-8 lg:px-12 ${className}`}>
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
const Footer = ({ mood, onSubmit, loading }) => (
  <footer
    className="fixed inset-x-0 bottom-0 z-20 flex flex-col items-center
               justify-center gap-3 bg-slate-900/80 py-3 shadow-inner backdrop-blur"
  >
    {/* free‑text input */}
    <form
      onSubmit={onSubmit}
      /* width caps at 24 rem and is centered */
      className="flex w-full max-w-sm mx-auto overflow-hidden rounded-lg
                 bg-slate-700/80 shadow focus-within:ring-2
                 focus-within:ring-indigo-400"
    >
      <input
        name="free"
        aria-label="Custom action"
        disabled={loading}
        placeholder="Or type your own action…"
        className="flex-1 bg-transparent px-3 py-2 text-sm
                   placeholder-slate-400 focus:outline-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 px-4 py-2 text-sm font-semibold text-white
                   transition hover:bg-indigo-500 disabled:opacity-50"
      >
        Send
      </button>
    </form>

    {/* mustache HUD (scaled for mobile) */}
    <div className="mt-1">
      <Mustache mood={mood} className="w-40 sm:w-48" />
    </div>
  </footer>
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
  
      
<main className="flex-1 overflow-y-auto pb-[14rem] pt-4">
<Container className="">  {/* narrative + buttons */}
<article className="max-w-2xl mx-auto whitespace-pre-wrap leading-relaxed space-y-4">
        {narrative}
      </article>
      <div className="mt-8 max-w-sm mx-auto">
        {choices.map((c) => (
          <ChoiceButton key={c} label={c} onClick={() => playTurn (c)} />
        ))}
      </div>


</Container>
</main>
  <Footer
  mood={mustacheMood}
  loading={loading}
  onSubmit={(e) => {
    e.preventDefault();
    const free = new FormData(e.target).get("free")?.toString().trim();
    if (free) playTurn(free);
    e.target.reset();
  }}
/> 
  </div>
);

}
