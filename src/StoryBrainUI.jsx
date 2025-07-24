import { useEffect, useState, useRef } from "react";
import Mustache from "./mustache.jsx";     // ← new line
import scene1Image from './assets/scene_01.png';
import scene2Image from './assets/scene_02.png';
import scene3Image from './assets/scene_03.png';
import scene4Image from './assets/scene_04.png';
import scene5Image from './assets/scene_05.png';
import scene6Image from './assets/scene_06.png';
import scene7Image from './assets/scene_07.png';
import scene8Image from './assets/scene_08.png';
import scene9Image from './assets/scene_09.png';
import scene10Image from './assets/scene_10.png';
import scene11Image from './assets/scene_11.png';
import scene12Image from './assets/scene_12.png';
import scene13Image from './assets/scene_13.png';
import scene14Image from './assets/scene_14.png';
import scene15Image from './assets/scene_15.png';
import scene16Image from './assets/scene_16.png';
import scene17Image from './assets/scene_17.png';
import scene18Image from './assets/scene_18.png';
import scene19Image from './assets/scene_19.png';
import scene20Image from './assets/scene_20.png';
import scene21Image from './assets/scene_21.png';
import scene22Image from './assets/scene_22.png';
import notebookIcon from './assets/notebook.png';

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
  <div className={`m-1 px-6 sm:px-10 lg:px-24 ${className}`}>
    {children}
  </div>
);

const Header = () => (
  <header className="sticky top-0 z-50 w-full bg-slate-900/80
                     backdrop-blur text-white shadow-md">
    <Container className="w-full">
      <h1 className="py-3 text-center text-2xl sm:text-3xl font-semibold tracking-wide font-serif">
        The Mysterious Affair at Styles
      </h1>
    </Container>
  </header>
);
   
const ChoiceButton = ({ label, onClick }) => (
  <button
    onClick={onClick}      className="w-full rounded-lg py-3 px-4 text-sm font-semibold shadow-sm transition
               mb-3 first:mt-2 last:mb-0 active:scale-[0.98] active:brightness-90
               focus:outline-none focus:ring-2 focus:ring-slate-500 
               bg-slate-700 text-white hover:bg-slate-600"


  >
    {label}
  </button>
);
const Footer = ({
  mood,
  onSubmit,
  loading,
  onNotebookClick,
  unreadClueCount,
}) => (
  <footer className="fixed bottom-0 left-0 right-0 z-40 flex flex-col items-center gap-3 px-4 py-3
                     bg-slate-900/80 shadow-inner backdrop-blur">
    {/* ── form ── */}
    <div className="w-full max-w-sm">
      <form
        onSubmit={onSubmit}
        className="flex overflow-hidden rounded-lg
                   bg-slate-900/80 border border-slate-600 shadow
                   focus-within:ring-2 focus-within:ring-indigo-500"
      >
        <input
          name="free"
          aria-label="Custom action"
          disabled={loading}
          placeholder="Or type your own action…"
          className="flex-1 bg-transparent px-4 py-3 text-sm placeholder-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-slate-700 px-4 py-3 text-sm font-semibold text-white
                     transition hover:bg-slate-600 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>

    {/* ── image row ── */}
    <div className="w-full max-w-sm flex justify-center gap-4 h-28">
      {/* mustache */}
      <div className="flex-1 relative overflow-hidden rounded-lg">
        <Mustache mood={mood} className="w-full h-full" />
      </div>

      {/* notebook */}
      <div className="flex-1 relative">
        <div className="h-full overflow-hidden rounded-lg">
          <button
            onClick={onNotebookClick}
            className="w-full h-full transition active:scale-95 hover:ring-2 hover:ring-indigo-300"
          >
            <img
              src={notebookIcon}
              alt="Open Clue Notebook"
              className="w-full h-full object-cover object-top"
            />
          </button>
        </div>

        {unreadClueCount > 0 && (
          <span
            className="absolute -top-1 -right-1 z-10
                       flex items-center justify-center
                       w-5 h-5 rounded-full bg-red-500 text-[10px] font-bold text-white
                       ring-2 ring-slate-900 animate-ping-short pointer-events-none"
          >
            {unreadClueCount}
          </span>
        )}
      </div>
    </div>
  </footer>
);


const NotebookModal = ({ clues, onClose }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
    <div className="bg-slate-800 border border-slate-600 rounded-lg p-6 w-full max-w-md shadow-lg">
      <h2 className="text-2xl font-serif mb-4 text-white">Detective's Notebook</h2>
      <ul className="list-disc list-inside space-y-3 text-slate-300 h-64 overflow-y-auto pr-2">
        {clues.length > 0 ? (
          clues.map(clue => <li key={clue.clue_id}>{clue.title}</li>)
        ) : (
          <li>No clues discovered yet.</li>
        )}
      </ul>
      <button 
  onClick={onClose} 
  className="mt-6 w-full font-semibold py-2 rounded-lg transition
             active:scale-[0.98] active:brightness-90
             focus:outline-none focus:ring-2 focus:ring-slate-500
             bg-slate-700 text-white hover:bg-slate-600"
>
        Close
      </button>
    </div>
  </div>
);

export default function StoryBrainUI() {
  const [narrative, setNarrative] = useState("…loading…");
  // The state variable is 'hints' and the setter is 'setChoices'
  const [choices, setChoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mustacheMood, setMustacheMood] = useState("neutral");
  const [scene, setScene] = useState("scene_01");
  const [isNotebookOpen, setNotebookOpen] = useState(false);
  const [revealedClues, setRevealedClues] = useState([]);
  const [unreadClueCount, setUnreadClueCount] = useState(0);
  const [isMobileChoicesOpen, setIsMobileChoicesOpen] = useState(false);
  const narrativeEndRef = useRef(null);


  const sceneImages = {
    'scene_01': scene1Image,
    'scene_02': scene2Image,
    'scene_03': scene3Image,
    'scene_04': scene4Image,
    'scene_05': scene5Image,
    'scene_06': scene6Image,
    'scene_07': scene7Image,
    'scene_08': scene8Image,
    'scene_09': scene9Image,
    'scene_10': scene10Image,
    'scene_11': scene11Image,
    'scene_12': scene12Image,
    'scene_13': scene13Image,
    'scene_14': scene14Image,
    'scene_15': scene15Image,
    'scene_16': scene16Image,
    'scene_17': scene17Image,
    'scene_18': scene18Image,
    'scene_19': scene19Image,
    'scene_20': scene20Image,
    'scene_21': scene21Image,
    'scene_22': scene22Image,
  };


async function playTurn(action) {
  if (action === 'action_restart_game') {
    localStorage.removeItem('playerId');
    window.location.reload();
    return;
  }
  
  setLoading(true);
  setChoices([]);
  setIsMobileChoicesOpen(false);

  let baseNarrative = "";
  setNarrative(prev => {
    baseNarrative = prev;
    if (action === "begin") return "…loading…";
    return prev + `\n\n> ${action}\n\n`;
  });

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerId: PLAYER_ID,
        userAction: action,
        currentNarrative: action === "begin" ? "" : baseNarrative,
      }),
    });

    if (!res.ok) throw new Error(`Server responded with ${res.status}`);

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();
      setNarrative(data.narrative);
      const combined = (data.choices || []).map((choice, index) => ({
        event_id: choice.event_id,
        label: (data.hints || [])[index] || choice.trigger,
      }));
      setChoices(combined);
      setScene(data.scene);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = "";
    const delimiter = /\|{2,}~DATA~\|{2,}/;
    let narrativeComplete = false;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      fullResponse += decoder.decode(value, { stream: true });

      if (!narrativeComplete) {
        const delimiterMatch = fullResponse.match(delimiter);
        if (delimiterMatch) {
          narrativeComplete = true;
          const narrativeToShow = fullResponse.substring(0, delimiterMatch.index);
          setNarrative(prev => {
            const base = (action === "begin" ? "" : baseNarrative + `\n\n> ${action}\n\n`);
            return base + narrativeToShow;
          });
        } else {
          setNarrative(prev => {
            const base = (action === "begin" ? "" : baseNarrative + `\n\n> ${action}\n\n`);
            return base + fullResponse;
          });
        }
      }
    }

    // --- AFTER THE STREAM IS FULLY READ ---
    
    // ✅ DEBUGGING: Log the raw response from the server
    console.log("--- RAW RESPONSE FROM SERVER ---");
    console.log(fullResponse);

const delim            = "|||~DATA~|||";
const jsonStart        = fullResponse.lastIndexOf(delim);
if (jsonStart === -1) {
console.warn("No delimiter in stream – fallback");
return;
}
const finalNarrative   = fullResponse.slice(0, jsonStart);
const jsonDataString   = fullResponse.slice(jsonStart + delim.length).trim();

    // ✅ DEBUGGING: Log the part we are about to parse as JSON
    console.log("--- JSON PART TO BE PARSED ---");
    console.log(jsonDataString);


let finalData = {};
try {
  // skip parsing if it doesn’t look like JSON
  if (!jsonDataString || jsonDataString.trim()[0] !== "{") {
   throw new Error("non‑JSON payload");
  }
  finalData = JSON.parse(jsonDataString);
} catch (e) {
  console.error("Delimiter missing or JSON invalid – falling back", e);
  // keep the old choices so the UI doesn’t crash
  return;
}

    if (jsonDataString) {
      // ✅ DEBUGGING: Add a specific try/catch for the parsing
      try {
        const finalData = JSON.parse(jsonDataString);
        const combined = (finalData.choices || []).map((choice, index) => ({
          event_id: choice.event_id,
          label: (finalData.hints || [])[index] || choice.trigger,
        }));
        setChoices(combined);
        setScene(finalData.scene);
        if (finalData.stateDelta?.global?.mustacheMood) {
          setMustacheMood(finalData.stateDelta.global.mustacheMood);
        }
        if (finalData.newlyRevealedClues?.length > 0) {
          setRevealedClues(prev => [...prev, ...finalData.newlyRevealedClues]);
          setUnreadClueCount(prev => prev + finalData.newlyRevealedClues.length);
        }
      } catch (e) {
          console.error("JSON PARSE FAILED:", e);
          console.error("The string that failed to parse was:", jsonDataString);
          throw e; // Re-throw to see the original error
      }
    } else {
        console.error("Stream finished but no data payload was found.");
    }

  } catch (err) {
    setNarrative(`🚨 Error contacting the story engine. Check console.\n(${err.message})`);
    console.error(err);
  } finally {
    setLoading(false);
  }
}

  useEffect(() => { playTurn("begin"); }, []);
  
  // ✅ SCROLL FIX: Add a useEffect to scroll to the bottom when narrative changes
  useEffect(() => {
    narrativeEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [narrative]);


  function handleSubmit(e) {
    e.preventDefault();
    const txt = new FormData(e.target).get("free")?.trim();
    if (txt) playTurn(txt);
    e.target.reset();
  }

  return (
    <div
      className="flex w-screen h-screen flex-col items-center bg-slate-800 text-slate-100 bg-cover bg-center"
      style={{ backgroundImage: `url(${sceneImages[scene] || sceneImages['scene_01']})` }}
    >
      <Header />
      <main className="w-full flex-1 flex flex-col lg:flex-row gap-8 max-w-5xl p-4 overflow-y-auto lg:overflow-hidden pb-40 lg:pb-0">
        {/* Column 1: Narrative */}
        <div className="flex-1 transition-all duration-1000 lg:overflow-y-auto lg:pb-44 pr-2">
          <article className="whitespace-pre-wrap leading-relaxed space-y-6 bg-slate-900/70 p-6 rounded-lg backdrop-blur-sm">
            {narrative}
            <div ref={narrativeEndRef} />
          </article>

        </div>

        {/* Column 2: Buttons */}
  <div className="w-full lg:w-2/5 flex flex-col gap-3 pt-6 lg:overflow-y-auto pb-16">

  {/* This div now correctly WRAPS the list of choices. */}
  {/* It's hidden on mobile by default, but becomes visible when the button is clicked. */}
  {/* It's always visible on large screens (lg:block). */}
  <div className={`${isMobileChoicesOpen ? 'block' : 'hidden'} lg:block`}>
    {choices.map((choice) => (
      <div key={choice.event_id} className="w-full max-w-sm mx-auto">
        <ChoiceButton
          label={choice.label}
          onClick={() => playTurn(choice.event_id)}
        />
      </div>
    ))}
  </div>

  {/* This div for the 'Investigate my options' button remains the same. */}
  {/* It's visible on mobile by default, and hidden when choices are open or on large screens. */}
  <div className={`${isMobileChoicesOpen ? 'hidden' : 'block'} lg:hidden w-full max-w-sm mx-auto`}>
    { !loading && choices.length > 0 && (
      <ChoiceButton
        label="Investigate my options"
        onClick={() => setIsMobileChoicesOpen(true)}
      />
    )}
  </div>
  
</div>
      </main>

      <Footer
        mood={mustacheMood}
        loading={loading}
        onNotebookClick={() => setNotebookOpen(true)}
        onSubmit={handleSubmit}
        unreadClueCount={unreadClueCount}
      />
      {isNotebookOpen && <NotebookModal clues={revealedClues} onClose={() => {
        setNotebookOpen(false);
        setUnreadClueCount(0);
      }} />}
    </div>
  );
} 