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

const loadingMessages = [
  "Poirot strokes his mustache thoughtfully...",
  "The pieces of the puzzle shift...",
  "Something stirs in the shadows of Styles Court...",
  "The little grey cells are working...",
  "Things are becoming more clear..."
];

const Container = ({ children, className = "" }) => (
  <div className={`m-1 px-6 sm:px-10 lg:px-24 ${className}`}>
    {children}
  </div>
);

const Header = () => (
  <header className="sticky top-0 z-50 w-full bg-slate-900/80
                     backdrop-blur text-white shadow-md">
    <Container className="w-full">
      <h1 className="py-3 text-center text-lg sm:text-3xl font-semibold tracking-wide font-serif">
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
  placeholder,
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
          placeholder={placeholder}
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
      <Mustache mood={mood} className={`w-full h-full ${loading ? 'animate-pulse' : ''}`} />
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
  // The state variable is 'Choices' and the setter is 'setChoices'
  const [choices, setChoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mustacheMood, setMustacheMood] = useState("neutral");
  const [scene, setScene] = useState("scene_01");
  const [isNotebookOpen, setNotebookOpen] = useState(false);
  const [revealedClues, setRevealedClues] = useState([]);
  const [unreadClueCount, setUnreadClueCount] = useState(0);
  const [isMobileChoicesOpen, setIsMobileChoicesOpen] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState(null); 
  const narrativeEndRef = useRef(null);
  const [lastAction, setLastAction] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("");


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


// In StoryBrainUI.jsx
  function getContextualPrompt() {
    if (!suggestedQuestions) return "Or type your own action…";
    
    const useSerious = Math.random() < 0.8;
    const pool = useSerious ? suggestedQuestions.serious : suggestedQuestions.chaotic;
    const selected = pool[Math.floor(Math.random() * pool.length)];
    
    return `Try: "${selected}"`;
  }

async function playTurn(action) {
  if (action === 'action_restart_game') {
    localStorage.removeItem('playerId');
    window.location.reload();
    return;
  }
  
  setLoading(true);
  setChoices([]);
  setIsMobileChoicesOpen(false);
    // Set state for the new loading indicator
    setLastAction(action);
    const randomMsg = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    setLoadingMessage(randomMsg);
        const currentNarrative = narrative;


  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerId: PLAYER_ID,
        userAction: action,
        currentNarrative: action === "begin" ? "" : currentNarrative,
      }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Server responded with ${res.status}`);
    }
    
    const finalData = await res.json();

    setNarrative(finalData.narrative);

setChoices(finalData.choices || []);

    setScene(finalData.scene);
    setSuggestedQuestions(finalData.suggested_questions || null); 
    if (finalData.stateDelta?.global?.mustacheMood) {
      setMustacheMood(finalData.stateDelta.global.mustacheMood);
    }
    if (finalData.newlyRevealedClues?.length > 0) {
      setRevealedClues(prev => [...prev, ...finalData.newlyRevealedClues]);
      setUnreadClueCount(prev => prev + finalData.newlyRevealedClues.length);
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
  }, [narrative, loading]);


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
      <main className="w-full flex-1 flex flex-col lg:flex-row gap-8 max-w-5xl p-4 overflow-y-auto lg:overflow-hidden pb-32 lg:pb-0">
        
        {/* Column 1: Narrative */}
        <div className="flex-1 transition-all duration-1000 lg:overflow-y-auto lg:pb-44 pr-2">
          {/* UPDATED: Conditional rendering for loading indicator */}
          <article className="whitespace-pre-wrap leading-relaxed bg-slate-900/70 p-6 rounded-lg backdrop-blur-sm">
            {loading && lastAction !== "begin" ? (
              <>
                {/* The new loading indicator at the top */}
                <div className="border-b border-slate-600 pb-4 mb-4">
                  <p className="font-semibold text-slate-200">{`> ${lastAction}`}</p>
                  <p className="text-slate-400 italic animate-pulse mt-2">{loadingMessage}</p>
                </div>
                {/* The old narrative, faded out */}
                <div className="opacity-50">
                  {narrative}
                </div>
              </>
            ) : (
              // The normal view when not loading
              narrative
            )}
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
        placeholder={getContextualPrompt()} 
      />
      {isNotebookOpen && <NotebookModal clues={revealedClues} onClose={() => {
        setNotebookOpen(false);
        setUnreadClueCount(0);
      }} />}
    </div>
  );
} 