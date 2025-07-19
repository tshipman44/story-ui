import { useEffect, useState } from "react";
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
  <header className="sticky top-0 z-10 bg-slate-900 text-white shadow-md">
    <Container className="w-full max-w-5xl mx-auto">
      <h1 className="py-3 text-center text-2xl sm:text-3xl font-semibold tracking-wide font-serif">
        The Mysterious Affair at Styles
      </h1>
    </Container>
  </header>
);
   
const ChoiceButton = ({ label, onClick }) => (
  <button
    onClick={onClick} className="w-full rounded-lg py-3 px-4 text-sm font-semibold shadow-sm transition
           mb-3 first:mt-2 last:mb-0 active:scale-[0.98] active:brightness-90
           focus:outline-none focus:ring-2 focus:ring-slate-500 
           bg-slate-700 text-slate-100 hover:bg-slate-600
           dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"


  >
    {label}
  </button>
);
const Footer = ({ mood, onSubmit, loading, onNotebookClick }) => (
  <footer
    className="fixed bottom-0 left-0 right-0 flex flex-col items-center gap-3 px-4 py-3
             bg-slate-900/80 shadow-inner backdrop-blur"
  >
    {/* Form - Centered on its own line */}
    <div className="w-full max-w-sm">
      <form
        onSubmit={onSubmit}
        className="
          flex overflow-hidden rounded-lg
          bg-slate-900/80 border border-slate-600 shadow
          focus-within:ring-2 focus-within:ring-indigo-500
        "
      >
        <input
          name="free"
          aria-label="Custom action"
          disabled={loading}
          placeholder="Or type your own action…"
          className="flex-1 bg-transparent px-4 py-3 text-sm
                     placeholder-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-slate-700 px-4 py-3 text-sm font-semibold text-slate-100
             transition hover:bg-slate-600 disabled:opacity-50
             dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"


        >
          Send
        </button>
      </form>
    </div>

    {/* Container for the two images below the form */}
   <div className="w-full max-w-sm flex flex-row items-stretch justify-center gap-4 h-24">
     {/* Mustache on the left */}
<div className="flex-1">
  <Mustache mood={mood} className="w-full h-full object-contain" />
</div>

{/* Notebook on the right */}
<div className="flex-1">
   <button onClick={onNotebookClick} className="w-full h-full transition-transform active:scale-95">
    <img src={notebookIcon} alt="Open Clue Notebook" className="w-full h-full object-contain rounded-lg" />
  </button>
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
        className="mt-6 w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg transition hover:bg-indigo-500"
      >
        Close
      </button>
    </div>
  </div>
);

export default function StoryBrainUI() {
  const [narrative, setNarrative] = useState("…loading…");
  const [choices, setChoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mustacheMood, setMustacheMood] = useState("neutral");
const [scene, setScene] = useState(1);
const [isNotebookOpen, setNotebookOpen] = useState(false);
const [revealedClues, setRevealedClues] = useState([]); 

const sceneImages = {
    1: scene1Image,
    2: scene2Image,
3: scene3Image,
4: scene4Image,
5: scene5Image,
6: scene6Image,
7: scene7Image,
8: scene8Image,
9: scene9Image,
10: scene10Image,
11: scene11Image,
12: scene12Image,
13: scene13Image,
14: scene14Image,
15: scene15Image,
16: scene16Image,
17: scene17Image,
18: scene18Image,
19: scene19Image,
20: scene20Image,
    // ... add more scenes and images as needed
  };
  // initial turn – send a synthetic "begin"
  useEffect(() => {
    playTurn("begin");
  }, []);

//...
  async function playTurn(action) {
    setLoading(true);
    // Optimistically update the narrative with the player's action
    setNarrative(current => current + `\n\n> ${action}`);
    
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: PLAYER_ID, userAction: action })
      });
      const data = await res.json();
      
      // If data.narrative is missing, show the error from the API instead.
      setNarrative(data.narrative || `🚨 Error: ${data.error}`);
      // If data.choices is missing, default to an empty array to prevent a crash.
      setChoices(data.choices || []);

      // grab the mood if present
      setMustacheMood(
        data.stateDelta?.global?.mustacheMood ?? "neutral"
      );
      
      const sceneString = data.scene; // This will be "scene_01", "scene_02", etc.
      if (sceneString) {
        // Split the string by '_' and parse the second part as an integer
        const sceneNumber = parseInt(sceneString.split('_')[1], 10);
        // Only update the state if we successfully got a number
        if (!isNaN(sceneNumber)) {
          setScene(sceneNumber);
        }
      }

      // Add newly revealed clues to our list, avoiding duplicates
      if (data.newlyRevealedClues) {
        setRevealedClues(prevClues => {
          const newClues = data.newlyRevealedClues.filter(
            newClue => !prevClues.some(prevClue => prevClue.clue_id === newClue.clue_id)
          );
          return [...prevClues, ...newClues];
        });
      }

    } catch (err) {
      setNarrative("🚨 Error contacting the story engine. Check console.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }


return (
  <div 
     className="flex w-screen h-screen flex-col items-center bg-slate-800 text-slate-100 bg-cover bg-center"
     style={{ backgroundImage: `url(${sceneImages[scene] || sceneImages[1]})` }}
   >
    <Header />

    {/* MAIN SCROLL AREA */}
  
      
    <main className="w-full flex-1 flex flex-col lg:flex-row gap-8 max-w-5xl p-4 overflow-hidden">


  {/* Column 1: Narrative (No background styles here) */}
  <div 
    className="flex-1 overflow-y-auto bg-cover bg-center transition-all duration-1000 pb-40"
 
  >
    <article className="whitespace-pre-wrap leading-relaxed space-y-6
                        bg-slate-900/70 p-6 rounded-lg backdrop-blur-sm">
      {narrative}
    </article>
  </div>

  {/* Column 2: Buttons (this column will not scroll) */}
  <div className="w-full lg:w-2/5 flex flex-col gap-3 pt-6">
    {choices.map((c) => (
      <div className="w-full max-w-sm mx-auto"> 
        <ChoiceButton key={c} label={c} onClick={() => playTurn(c)} />
      </div>
    ))}
  </div>
</main>
 {/* ✅ keep ONLY the new unified footer */}
    <Footer
      mood={mustacheMood}
      loading={loading}
  onNotebookClick={() => setNotebookOpen(true)}
      onSubmit={(e) => {
        e.preventDefault();
        const txt = new FormData(e.target).get("free")?.toString().trim();
        if (txt) playTurn(txt);
        e.target.reset();
      }}
    />
{/* Conditionally render the notebook modal */}
    {isNotebookOpen && <NotebookModal clues={revealedClues} onClose={() => setNotebookOpen(false)} />}
  </div>
);
}
