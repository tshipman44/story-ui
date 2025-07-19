// api/play.mjs  (ESM – Vercel nodejs18.x runtime)
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const STORY_DATA = {"characters": [
    {
      "char_id": "ch_1",
      "display_name": "Hercule Poirot",
      "role //public, proactively volunteered to the detective": "Renowned Belgian private detective. He lives in England after being displaced by the war in Europe. Asked to investigate the case by his old friend Hastings.\n",
      "description //public, freely given to the detective": "He was hardly more than five feet four inches but carried himself with great dignity. His head was exactly the shape of an egg, and he always perched it a little on one side. His moustache was very stiff and military. Even if everything on his face was covered, the tips of moustache and the pink-tipped nose would be visible. The neatness of his attire was almost incredible; I believe a speck of dust would have caused him more pain than a bullet wound. Yet this quaint dandified little man who, I was sorry to see, now limped badly, had been in his time one of the most celebrated members of the Belgian police.",
      "motivations //secret, never provided directly to the detective": "Poirot focuses on getting people to talk. He casts himself in the role of \"Papa Poirot\", a benign confessor, especially to young women. Poirot believes sincerely in restoring order and harmony to a chaotic world, often through revealing the truth. He is driven by a sense of justice and a belief that order leads to happiness for individuals and society. His meticulous nature, reliance on his \"little grey cells,\" and understanding of human psychology are all tools he uses to achieve this goal. He has a tendency to refer to himself in the third person.",
      "isSuspect": false,
      "alibi_summary": "N/A",
      "relationships": "{ \"ch_2\":\"friend\";  \"ch_3\":\"rival\"; \"ch_4\":\"victim\";  \"ch_5\":\"prime suspect\";  \"ch_6\":\"suspect\";  \"ch_7\":\"suspect\";  \"ch_8\":\"suspect\";  \"ch_9\":\"suspect\";  \"ch_10\":\"suspect\";  \"ch_11\":\"expert\";  \"ch_12\":\"suspect\"}        ",
      "revealed _to_reader?": true
    },
    {
      "char_id": "ch_2",
      "display_name": "Arthur Hastings",
      "role //public, proactively volunteered to the detective": "Poirot's friend, and the narrator of the story. He is a guest at Styles Court while on sick leave from the Western Front in the Great War.",
      "description //public, freely given to the detective": "Arthur Hastings is a 30-year-old soldier on leave from World War I after having been injured in battle. While on leave, Hastings runs into John Cavendish, an old friend who invites him to spend time at Styles Court, his family’s estate in the English countryside. Hastings is glad to accept this invitation, especially when he meets John’s beautiful wife, Mary Cavendish, to whom Hastings takes an immediate liking. Hastings has grand ideas of becoming a detective himself, priding himself in having “a certain talent for deduction,” so he’s quite excited to work alongside Poirot. His contributions to the investigation, however, are rarely of much use, and it soon becomes clear that Hastings lacks the knack for detective work that Poirot exemplifies so perfectly. At times, Hastings even grows frustrated because he can’t follow Poirot’s reasoning, and though he thinks of himself as a keen observer of human behavior, he’s actually rather gullible and impulsive.",
      "motivations //secret, never provided directly to the detective": "In contrast to Poirot, he often seems very naïve and incredulous, but he still unwittingly manages to help the skilled detective from time to time by accidentally pointing something out that gives Poirot a new idea. By mentioning that Poirot had to straighten some spill holders and ornaments in Styles, he prompts Poirot to realise that someone had moved them, causing Poirot to discover a crucial piece of evidence. Hastings represents the traditional English gentleman—not too bright but absolutely scrupulous, a throwback to the Victorian-era gentleman who is always concerned about \"fair play\". Hastings himself notes that he is somewhat old-fashioned. While Poirot, who is not above lying, surreptitiously reads other people's letters or eavesdrops, Hastings is horrified of such acts and usually refuses to perform them to help Poirot in one of his cases. Although he lacks Poirot's intellect, Poirot often compliments Hastings' ability to remember facts and details about their cases even if he deplores the manner in which Hastings tells the story at times. Hastings is in love with Cynthia Murdoch and proposes to her at the conclusion of the story, which she rejects. ",
      "isSuspect": false,
      "alibi_summary": "N/A",
      "relationships": "{ \"ch_1\":\"friend\";  \"ch_6\":\"friend\"; \"ch_10\":\"infatuation\"; \"ch_4\":\"victim\";  \"ch_5\":\"suspect\";  \"ch_6\":\"suspect\";  \"ch_7\":\"suspect\";  \"ch_8\":\"suspect\";  \"ch_9\":\"suspect\";  \"ch_11\":\"suspect\";  \"ch_12\":\"suspect\"}        ",
      "revealed _to_reader?": true
    },
    {
      "char_id": "ch_3",
      "display_name": "Inspector Japp",
      "role //public, proactively volunteered to the detective": "A Scotland Yard detective, and the investigating officer. He is an acquaintance of Poirot at the time of the novel's setting.",
      "description //public, freely given to the detective": "James Japp, while being a competent detective, is no match for Poirot; he frequently finds himself a step behind the great detective but has developed a grudging respect for the man's abilities over their years together. Japp and Hastings often commiserate on their confusion and inability to keep up with Poirot on cases. Japp and Hastings are also generally astonished to find that Poirot cannot understand anything typically English (like cricket, which he maintains is utter nonsense). Japp is characterized as someone who is outspoken, pragmatic, conservative, dogmatic, conscientious, and a tad bit stingy.",
      "motivations //secret, never provided directly to the detective": "Japp is hungry to solve the case, mostly to advance his own career. He has a friendly kind of rivalry with Poirot, whom he views as a genius, but views himself as a peer, despite the available evidence.",
      "isSuspect": false,
      "alibi_summary": "N/A",
      "relationships": "{ \"ch_1\":\"rival\"}        ",
      "revealed _to_reader?": true
    },
    {
      "char_id": "ch_4",
      "display_name": "Emily Inglethorp",
      "role //public, proactively volunteered to the detective": "A wealthy old woman in her 70s, and the wife of Alfred Inglethorp. She inherited her fortune and her home of Styles Court following the death of her first husband, Mr Cavendish. She is the victim of the case.\n",
      "description //public, freely given to the detective": "Emily Inglethorp is the victim, whose death drives the plot forward. She is described by Evelyn Howard as \"a selfish old woman in her way. She was very generous, but she always wanted a return. She never let people forget what she had done for them—and, that way she missed love. Don’t think she ever realized it, though, or felt the lack of it. Hope not, anyway.\"\nThe whole family is depedent on her. \nEmily Inglethorp was a lady who liked to make her own plans, and expected other people to fall in with them, and in this case she certainly had the whip hand, namely: the purse strings.\nShe changes her will at least once a year.",
      "motivations //secret, never provided directly to the detective": "VICTIM. She is characterized as a selfish person who doesn't let the rest of the family have a life of their won. She wants the family to revolve around her.",
      "isSuspect": false,
      "alibi_summary": "N/A",
      "relationships": "{ \"ch_1\":\"acquaintance\";  \"ch_5\":\"husband\"; \"ch_6\":\"stepson\";  \"ch_7\":\"daughter-in-law\"; \"ch_8\":\"stepson\"; \"ch_9\":\"companion\"; \"ch_10\":\"friend\"; \"ch_11\":\"patient\";\"ch_12\":\"maid\"}        ",
      "revealed _to_reader?": true
    },
    {
      "char_id": "ch_5",
      "display_name": "Alfred Inglethorp",
      "role //public, proactively volunteered to the detective": "Emily's second husband and 20 years younger than she is. ",
      "description //public, freely given to the detective": "Alfred is considered by Emily's family to be a spoiled fortune-hunter. Generally despised by other characters except Emily and Evelyn. Alfred has a beard and wears Pince-nez glasses",
      "motivations //secret, never provided directly to the detective": "MURDERER. Chief beneficiary of Emily's will, and having an affair with Evelyn Howard. He wants to look suspicious to be charged so he can avoid culpability by triggering double jeopardy.",
      "isSuspect": true,
      "alibi_summary": " Left Styles Court early on the evening of 17 July (≈ 7 p.m.), walking with Dr Bauerstein as far as the lodge gate, then went on alone to spend the night in the village inn. Witnesses there saw him retire and breakfast next morning, placing him miles from the house during the fatal convulsions just after 12:30 a.m. When police press him, he pointedly refuses to detail his movements at 6 p.m.—a silence meant to keep their attention on him while the real mechanism of poisoning (the doctored sleeping‑medicine prepared earlier) goes unnoticed.",
      "relationships": "{ \"ch_1\":\"acquaintance\";  \"ch_4\":\"wife\"; \"ch_6\":\"stepson-in-law\";  \"ch_7\":\"daughter-in-law\"; \"ch_8\":\"stepson-in-law\"; \"ch_9\":\"secret lover\"; \"ch_10\":\"friend\"; \"ch_11\":\"patient\";\"ch_12\":\"maid\"}        ",
      "revealed _to_reader?": true
    },
    {
      "char_id": "ch_6",
      "display_name": "John Cavendish",
      "role //public, proactively volunteered to the detective": "Emily's elder stepson, from her first husband's previous marriage, and the brother of Lawrence. John has known Hastings for many years, he formerly practised as a barrister and is currently a country squire. It is he who invites Hastings to Styles near the beginning of the story. He is going through some issues with his marriage to his wife Mary.",
      "description //public, freely given to the detective": "“I drill with the volunteers twice a week, and lend a hand at the farms… It’s a jolly good life taking it all round\"",
      "motivations //secret, never provided directly to the detective": "Acute money worries – he confides to Hastings that he is “at [his] wits’ end for money,” and that the estate should be his. \nJealous resentment of his step‑mother’s new husband and control of the purse‑strings.\nJohn is having an affair he is keeping secret of his wife",
      "isSuspect": true,
      "alibi_summary": " After coffee (≈ 8 p.m.) John remained in the smoking‑room/library until about ten, then went to bed in the left wing. He was still in bed when Lawrence roused him after 1 a.m.; servants saw him break open the bedroom door with Hastings. His only unexplained absence is an evening stroll to the billiard‑room corridor, well before the poison acted",
      "relationships": "{ \"ch_2\":\"friend\";  \"ch_4\":\"stepmother\"; \"ch_5\":\"stepfather\";  \"ch_7\":\"wife\"; \"ch_8\":\"brother\"; \"ch_9\":\"acquaintence\"; \"ch_10\":\"friend\"; \"ch_11\":\"patient\";\"ch_12\":\"maid\"}        ",
      "revealed _to_reader?": true
    },
    {
      "char_id": "ch_7",
      "display_name": "Mary Cavendish",
      "role //public, proactively volunteered to the detective": "John's wife, and a friend of Dr Bauerstein",
      "description //public, freely given to the detective": "A beautiful woman, she is described by Hastings, \"Her tall, slender form…those wonderful tawny eyes…the intense power of stillness she possessed.”",
      "motivations //secret, never provided directly to the detective": " * Growing infatuation with Dr Bauerstein and desire to “be free” of a loveless marriage. ",
      "isSuspect": true,
      "alibi_summary": " Played tennis until 7 p.m.; poured the coffee in the drawing‑room; joined Hastings outdoors, and by midnight was in her own room (right wing). When the alarm sounded she was already with Cynthia, trying to unbolt the communicating door (witnessed by John and Hastings).",
      "relationships": "{ \"ch_2\":\"acquaintence\";  \"ch_4\":\"stepmother-in-law\"; \"ch_5\":\"stepfather-in-law\";  \"ch_8\":\"brother-in-law\"; \"ch_6\":\"husband\"; \"ch_9\":\"acquaintence\"; \"ch_10\":\"acquaintence\"; \"ch_11\":\"infatuation\";\"ch_12\":\"maid\"}        ",
      "revealed _to_reader?": true
    },
    {
      "char_id": "ch_8",
      "display_name": "Lawrence Cavendish",
      "role //public, proactively volunteered to the detective": "Emily's younger stepson, from her first husband's previous marriage, and the brother of John. Known to have studied medicine and qualified as a doctor",
      "description //public, freely given to the detective": "“[Lawrence] had qualified as a doctor but early relinquished the profession…while pursuing literary ambitions.”",
      "motivations //secret, never provided directly to the detective": " * Professional curiosity about poisons—he is caught handling strychnine in the hospital cupboard. \n* Deep‑seated fear that the family fortune might be lost.\n",
      "isSuspect": true,
      "alibi_summary": " Says he read in his room till about 11 p.m., then slept in the same corridor as his mother. He was the first to hear her convulsions (≈ 1 a.m.), fetched Hastings, and helped force the door. No evidence places him outside the house after 11 p.m.",
      "relationships": "{ \"ch_2\":\"acquaintence\";  \"ch_4\":\"stepmother\"; \"ch_5\":\"stepfather\";  \"ch_7\":\"sister-in-law\"; \"ch_6\":\"brother\"; \"ch_9\":\"acquaintence\"; \"ch_10\":\"friend\"; \"ch_11\":\"patient\";\"ch_12\":\"maid\"}        ",
      "revealed _to_reader?": true
    },
    {
      "char_id": "ch_9",
      "display_name": "Evelyn Howard",
      "role //public, proactively volunteered to the detective": "Emily's lady's companion, and a second cousin of Alfred Inglethorp, of whom she nevertheless expresses a strong dislike.",
      "description //public, freely given to the detective": "A pleasant-looking woman of about forty, with a deep voice, almost manly in its stentorian tones, and had a sensible square body. She was vocal about her negative views of Emily marrying Alfred Inglethorp, who had presented himself as a distant cousin of Evelyn. Evelyn was described as \"not precisely young and beautiful\" by John Cavendish, but he pointed out she knew how to do her job. She had blue eyes and a sunburnt face. \nShe believes that murders are typically committed by men, because she believes it to be a violent crime. ",
      "motivations //secret, never provided directly to the detective": "ACCOMPLICE. She is having an affair with  Alfred Inglethorp. She is trying to make Alfred look guilty so he can avoid culpability by triggering double jeopardy. she secretly buys strychnine to frame Alfred and protect her friend’s money.",
      "isSuspect": true,
      "alibi_summary": "Quarrelled with Emily about Alfred on the afternoon of the 16 th and left Styles that evening. She spent the night of the 17 th/18 th nursing at Middlingham Hospital 15 miles away (confirmed by colleagues and her letter to Hastings). ",
      "relationships": "{ \"ch_2\":\"acquaintence\";  \"ch_4\":\"companion\"; \"ch_5\":\"secret lover\";  \"ch_7\":\"acquaintence\"; \"ch_6\":\"acquaintence\"; \"ch_9\":\"acquaintence\"; \"ch_10\":\"acquaintence\"; \"ch_11\":\"patient\";\"ch_12\":\"maid\"}        ",
      "revealed _to_reader?": true
    },
    {
      "char_id": "ch_10",
      "display_name": "Cynthia Murdoch",
      "role //public, proactively volunteered to the detective": "The daughter of a deceased friend of the family, an orphan. She performs war-time work at a nearby hospital's dispensary.",
      "description //public, freely given to the detective": " “A fresh‑looking young creature, full of life and vigour…great loose waves of auburn hair…with dark eyes she would have been a beauty.” ",
      "motivations //secret, never provided directly to the detective": "* Severe dependency—financially on Emily, socially on the Cavendishes—makes her eager to stay in favour.\n* Access to—and almost flippant comfort with—dangerous drugs in the dispensary (“Oh, hundreds [poisoned]!”)",
      "isSuspect": true,
      "alibi_summary": " Home by 7 p.m.; took a bromide sleeping‑draft and bolted her bedroom door. When the household tried that door during the emergency it was still bolted and Cynthia was so heavily sedated she had to be shaken awake, corroborated by John, Mary and Dorcas.",
      "relationships": "{ \"ch_2\":\"acquaintence\";  \"ch_4\":\"friend\"; \"ch_5\":\"friend\";   \"ch_6\":\"friend\"; \"ch_7\":\"friend\"; \"ch_8\":\"infatuation\"; \"ch_9\":\"friend\"; \"ch_11\":\"patient\";\"ch_12\":\"maid\"}        ",
      "revealed _to_reader?": true
    },
    {
      "char_id": "ch_11",
      "display_name": "Dr. Bauerstein",
      "role //public, proactively volunteered to the detective": "A well-known toxicologist, living not far from Styles",
      "description //public, freely given to the detective": " “A tall bearded man…very dark, with a melancholy, clean‑shaven face.”",
      "motivations //secret, never provided directly to the detective": " * Romantic interest in Mary; his frequent consults give them cover to meet.\n* Wartime suspicion—temporarily arrested as a potential German spy, a fact he keeps quiet.",
      "isSuspect": true,
      "alibi_summary": "Arrived at Styles soaked and muddy about 8 p.m. (fell into a pond collecting ferns); had coffee, then walked to the lodge gate with Alfred Inglethorp and parted. A village constable saw him entering his own cottage near 10 p.m.; he claims to have been reading scientific papers until bed‑time. No witness places him back at Styles that night.",
      "relationships": "{ \"ch_2\":\"acquaintence\";  \"ch_4\":\"friend\"; \"ch_5\":\"friend\";   \"ch_6\":\"friend\"; \"ch_7\":\"friend\"; \"ch_8\":\"infatuation\"; \"ch_9\":\"friend\"; \"ch_12\":\"maid\"}        ",
      "revealed _to_reader?": true
    },
    {
      "char_id": "ch_12",
      "display_name": "Dorcas",
      "role //public, proactively volunteered to the detective": "A maid at Styles. Loyal to Mrs Inglethorp",
      "description //public, freely given to the detective": " “She was the very model and picture of a good old‑fashioned servant…grey hair in stiff waves under her white cap.”",
      "motivations //secret, never provided directly to the detective": " * Absolute loyalty to the “old mistress” and bitter dislike of Alfred Inglethorp—feelings she tries to hide from new management. ",
      "isSuspect": true,
      "alibi_summary": " Cleared the coffee tray a little after 8 p.m., then polished silver in the pantry before retiring to the servants’ wing (separate corridor, door B on Poirot’s plan). She was roused by the commotion and witnessed the failed attempts to enter the bedroom. Servants’ passage and locked doors physically separated her from the scene of the poisoning.",
      "relationships": "{ \"ch_2\":\"acquaintence\";  \"ch_4\":\"loved employer\"; \"ch_5\":\"employer's spouse\";  \"ch_7\":\"employer's relative\"; \"ch_6\":\"employer's relative\"; \"ch_9\":\"employer's relative\"; \"ch_10\":\"employer's relative\"; \"ch_11\":\"patient\"}        ",
      "revealed _to_reader?": true
    }
  ],
  "clues": [
    {
      "clue_id": "C1",
      "title": "Arrival at Styles / knowledge Poirot is nearby",
      "found_in_scene": "scene_01",
      "points_to": "scene_02",
      "isRedHerring": false,
      "revealed": "narrative"
    },
    {
      "clue_id": "C2",
      "title": "Met the Inglethorps & Cavendishes",
      "found_in_scene": "scene_02 ",
      "points_to": "scene_03",
      "isRedHerring": false,
      "revealed": "narrative"
    },
    {
      "clue_id": "C3",
      "title": "Heard Evelyn Howard’s warning & the torn‑will quarrel",
      "found_in_scene": "scene_03",
      "points_to": "scene_04",
      "isRedHerring": false,
      "revealed": "narrative"
    },
    {
      "clue_id": "C4",
      "title": "Saw Alfred’s strychnine purchase",
      "found_in_scene": "scene_04",
      "points_to": "scene_05",
      "isRedHerring": false,
      "revealed": "narrative"
    },
    {
      "clue_id": "C5",
      "title": "Noted Emily’s odd coffee/cocoa & sugar switch",
      "found_in_scene": "scene_05",
      "points_to": "scene_06",
      "isRedHerring": false,
      "revealed": "narrative"
    },
    {
      "clue_id": "C6",
      "title": "Night‑time corridor observations (bitter smell, John wandering)",
      "found_in_scene": "scene_06",
      "points_to": "scene_07",
      "isRedHerring": false,
      "revealed": "narrative"
    },
    {
      "clue_id": "C7",
      "title": "Witnessed Emily’s convulsions / locked‑door crisis",
      "found_in_scene": "scene_07",
      "points_to": "scene_08",
      "isRedHerring": false,
      "revealed": "narrative"
    },
    {
      "clue_id": "C8",
      "title": "Doctors confirm strychnine poisoning",
      "found_in_scene": "scene_08",
      "points_to": "scene_09",
      "isRedHerring": false,
      "revealed": "The user must question the doctor to confirm cause of death"
    },
    {
      "clue_id": "C9",
      "title": "Poirot formally engaged",
      "found_in_scene": "scene_09",
      "points_to": "scene_10",
      "isRedHerring": false,
      "revealed": "The user must request help, or follow up on the description of C1"
    },
    {
      "clue_id": "C10",
      "title": "Difference between coffee‑cup and cocoa‑cup established",
      "found_in_scene": "scene_10",
      "points_to": "scene_11",
      "isRedHerring": false,
      "revealed": "The user must question Dorcas, the maid, or examine the cups carefully."
    },
    {
      "clue_id": "C11",
      "title": "Dispensary label & Cynthia’s stray strychnine tablets",
      "found_in_scene": "scene_11",
      "points_to": "scene_12",
      "isRedHerring": false,
      "revealed": "Ask Cynthia to help with stock checking. This triggers a timed hidden‑object mini‑task: match bottles to the ledger before the matron returns. A mismatch (“strychnine – 10 gr missing”) flashes red; clicking the empty space flips a fallen label. "
    },
    {
      "clue_id": "C12",
      "title": "Mary’s secret meeting with Dr Bauerstein",
      "found_in_scene": "scene_12",
      "points_to": "scene_13",
      "isRedHerring": false,
      "revealed": "After dinner, choose “Take a cigarette outside”. If the player first picked up the field‑glasses in Hastings’s room, they can eavesdrop from the yew arch by holding the binoculars steady (simple mouse‑balance). Success logs C12; failure lets the meeting finish unheard, but the player can try again another night"
    },
    {
      "clue_id": "C13",
      "title": "Inquest revelations: chemist’s evidence & “murder by person unknown”",
      "found_in_scene": "scene_13",
      "points_to": "scene_14",
      "isRedHerring": false,
      "revealed": "Attend the inquest; the player may cross‑examine witnesses through multiple‑choice questions. Asking the chemist about “the poison‑register entry” triggers a reveal"
    },
    {
      "clue_id": "C14",
      "title": "Bromide‑bottle test proves clean / delayed‑action theory",
      "found_in_scene": "scene_14",
      "points_to": "scene_15",
      "isRedHerring": false,
      "revealed": "Poirot asks the player to recreate Cynthia’s night‑routine. "
    },
    {
      "clue_id": "C15",
      "title": "Police arrest Alfred; Evelyn returns with alibi letter",
      "found_in_scene": "scene_15",
      "points_to": "scene_16",
      "isRedHerring": false,
      "revealed": "The player chooses to confront Evelyn about the postmark"
    },
    {
      "clue_id": "C16",
      "title": "Inn‑clock discrepancy that weakens Alfred’s alibi",
      "found_in_scene": "scene_16",
      "points_to": "scene_17",
      "isRedHerring": false,
      "revealed": "If the player looks at the signed guest book entry, note the discrepancy between the bar clock and the player's pocket watch."
    },
    {
      "clue_id": "C17",
      "title": "Charred scrap of a will favouring Alfred",
      "found_in_scene": "scene_17",
      "points_to": "scene_18",
      "isRedHerring": false,
      "revealed": "Revealed to the player if they inspect the safe."
    },
    {
      "clue_id": "C18",
      "title": "False‑beard gum link (impersonation clue)",
      "found_in_scene": "scene_18",
      "points_to": "scene_19",
      "isRedHerring": false,
      "revealed": "Triggered by the player investigating Alfred's dresser earlier and finding the beard gum pot"
    },
    {
      "clue_id": "C19",
      "title": "Poirot’s complete reconstruction (gathering of suspects)",
      "found_in_scene": "scene_19",
      "points_to": "scene_20",
      "isRedHerring": false,
      "revealed": "Requires either 80% of possible clues, or discussing the psychology of the case in depth with Poirot."
    },
    {
      "clue_id": "C20",
      "title": "Evelyn’s confession & full solution confirmed",
      "found_in_scene": "scene_20",
      "points_to": "scene_21",
      "isRedHerring": false,
      "revealed": "narrative"
    },
    {
      "clue_id": "C21",
      "title": "Final link—Emily’s torn will dated day of quarrel; Dorcas’s memory of clock striking 4 when quarrel ended clinches timing.",
      "found_in_scene": "scene_21",
      "points_to": "N/A",
      "isRedHerring": "",
      "revealed": "narrative"
    },
    {
      "clue_id": "C22",
      "title": "A half‑torn page from Taylor’s Poisons in Practice, heavily under‑lined beside the entry for digitalis. It is tucked between Lawrence’s manuscript poems.\t",
      "found_in_scene": "scene_10",
      "points_to": "scene_11",
      "isRedHerring": true,
      "revealed": "Points to Lawrence’s old medical training and a second poison altogether, encouraging the detective to waste time testing for digitalis that never existed.\n"
    },
    {
      "clue_id": "C23",
      "title": "Distinct muddy footprints matching John Cavendish’s field boots lead up to, then away from, the flower‑bed beneath Emily’s window.        ",
      "found_in_scene": "scene_06",
      "points_to": "scene_07",
      "isRedHerring": true,
      "revealed": "Revealed by looking out the window"
    },
    {
      "clue_id": "C24",
      "title": "A jeweller’s chit for an engraved brooch: “To B— With all my love, M.” found folded in Mary’s glove.\t",
      "found_in_scene": "scene_12",
      "points_to": "scene_13",
      "isRedHerring": true,
      "revealed": "Revealed by searching the area"
    },
    {
      "clue_id": "C25",
      "title": "A crumpled inventory tag labelled “STRYCHNINE HYDROCHLORIDE – 10 gr”, still smelling faintly of lavender soap, wedged behind Cynthia’s poison cupboard. The handwriting matches Evelyn Howard’s neat capitals.",
      "found_in_scene": "scene_11",
      "points_to": "scene_12",
      "isRedHerring": false,
      "revealed": "Revealed by searching behind the cupboard in scene 11"
    },
    {
      "clue_id": "C26",
      "title": "A scrap of olive‑green ribbon stiff with spirit‑gum caught in the hinge of the dispatch‑case. Microscopic fibres of black hair cling to the gum.",
      "found_in_scene": "scene_17",
      "points_to": "scene18",
      "isRedHerring": false,
      "revealed": "Discovered by a careful examination of the dispatch-case. Hinted at if the user discovers C18"
    }
  ],
  "scenes": [
    {
      "scene_id": "scene_01",
      "timestamp": "1917-07-16T18:15:00.000Z",
      "location": "loc_01",
      "summary": "Captain Hastings, on medical leave, arrives in Essex and is driven to Styles Court by his old friend John Cavendish. He sees a Belgian refugee camp and recalls hearing that the famous detective Hercule Poirot is in the area. He meets Cynthia Murdoch on the way in and catches his first glimpse of the gracious—but faintly tense—household.",
      "clues_revealed": "C1",
      "required_clues": "None",
      "unlocks_when": "storyPhase == \"pre-murder\"       ",
      "status": "eligible",
      "preferred_next_scene": "scene_02",
      "possible_next_scenes": "scene_02, scene_03, scene_04"
    },
    {
      "scene_id": "scene_02",
      "timestamp": "1917-07-16T20:30:00.000Z",
      "location": "loc_02",
      "summary": "Hastings is introduced to Emily Inglethorp, Alfred Inglethorp, Lawrence Cavendish, Mary Cavendish, and Evelyn Howard. Emily Inglethorp, the Lady of the house and Alfred Inglethorp, her second husband, seem oddly formal; Evelyn’s hostility toward Alfred crackles.",
      "clues_revealed": "C2",
      "required_clues": "C1",
      "unlocks_when": "storyPhase == \"pre-murder\"       ",
      "status": "eligible",
      "preferred_next_scene": "scene_03",
      "possible_next_scenes": "scene_03, scene_04, scene_05"
    },
    {
      "scene_id": "scene_03",
      "timestamp": "1917-07-16T23:00:00.000Z",
      "location": "loc_03",
      "summary": "Evelyn and Emily quarrel loudly about Alfred’s influence and Emily’s new will. Evelyn announces she will leave at once. Dinner is to be served soon.",
      "clues_revealed": "C3",
      "required_clues": "C2",
      "unlocks_when": "storyPhase == \"pre-murder\"       ",
      "status": "eligible",
      "preferred_next_scene": "scene_04",
      "possible_next_scenes": "scene_04, scene_05"
    },
    {
      "scene_id": "scene_04",
      "timestamp": "1917-07-17T02:10:00.000Z",
      "location": "loc_04",
      "summary": "Lawrence Cavendish arrives to the house for dinner. He mentions offhandedly that he saw Alfred (bearded, nervous) purchasing strychnine in Emily's name, claiming it is “to put down a dog.” They eat dinner with a simmering tension in the room.",
      "clues_revealed": "C4",
      "required_clues": "C2",
      "unlocks_when": "storyPhase == \"pre-murder\"       ",
      "status": "eligible",
      "preferred_next_scene": "scene_05",
      "possible_next_scenes": "scene_05 "
    },
    {
      "scene_id": "scene_05",
      "timestamp": "1917-07-17T04:05:00.000Z",
      "location": "loc_05",
      "summary": "After dinner, coffee is served. Emily takes her usual cocoa instead, prepared by Dorcas in the pantry. Family disperses; Alfred and Dr Bauerstein stroll to the lodge gate.",
      "clues_revealed": "C5",
      "required_clues": "C2",
      "unlocks_when": "storyPhase == \"pre-murder\"       ",
      "status": "eligible",
      "preferred_next_scene": "scene_06",
      "possible_next_scenes": "scene_06 "
    },
    {
      "scene_id": "scene_06",
      "timestamp": "1917-07-17T06:45:00.000Z",
      "location": "loc_06",
      "summary": "Hastings, unable to sleep, sees a dim light under Emily’s door and hears a metallic chink. John strolls in pajamas, claiming he came to shut windows.",
      "clues_revealed": "C6",
      "required_clues": "C5",
      "unlocks_when": "storyPhase == \"pre-murder\"       ",
      "status": "eligible",
      "preferred_next_scene": "scene_07",
      "possible_next_scenes": "scene_07"
    },
    {
      "scene_id": "scene_07",
      "timestamp": "1917-07-17T08:30:00.000Z",
      "location": "loc_07",
      "summary": "Emily wakes in agony, knocks over the table, bolts her door. Lawrence hears her cries; John and Hastings race to help but must break the door.",
      "clues_revealed": "C7",
      "required_clues": "C5",
      "unlocks_when": "storyPhase == \"pre-murder\"       ",
      "phase_change_to": "investigation",
      "status": "eligible",
      "preferred_next_scene": "scene_08",
      "possible_next_scenes": "scene_08 "
    },
    {
      "scene_id": "scene_08",
      "timestamp": "1917-07-17T09:05:00.000Z",
      "location": "loc_08",
      "summary": "Dr Bauerstein and Dr Wilkins pronounce Emily dead; symptoms suggest strychnine poisoning.",
      "clues_revealed": "C8",
      "required_clues": "C7",
      "unlocks_when": "storyPhase == \"investigation\"       ",
      "status": "locked",
      "preferred_next_scene": "scene_09",
      "possible_next_scenes": "scene_09"
    },
    {
      "scene_id": "scene_09",
      "timestamp": "1917-07-17T16:50:00.000Z",
      "location": "loc_09",
      "summary": "Hastings fetches Poirot, who agrees to investigate on condition of secrecy.",
      "clues_revealed": "C9",
      "required_clues": "C8, C1",
      "unlocks_when": "storyPhase == \"investigation\"       ",
      "status": "locked",
      "preferred_next_scene": "scene_10",
      "possible_next_scenes": "scene_10, scene_11, scene_12"
    },
    {
      "scene_id": "scene_10",
      "timestamp": "1917-07-17T18:30:00.000Z",
      "location": "loc_10",
      "summary": "Poirot questions Dorcas and discovers a key difference between Emily’s coffee‑cup and cocoa‑cup; he collects the latter for analysis.",
      "clues_revealed": "C10",
      "required_clues": "C9, C5",
      "unlocks_when": "storyPhase == \"investigation\"       ",
      "status": "locked",
      "preferred_next_scene": "scene_11",
      "possible_next_scenes": "scene_11, scene_12, scene_13"
    },
    {
      "scene_id": "scene_11",
      "timestamp": "1917-07-17T19:45:00.000Z",
      "location": "loc_11",
      "summary": "Poirot examines poison cupboard; finds loose strychnine tablets and a soiled label from “Strychnine Hydrochloride.”",
      "clues_revealed": "C11",
      "required_clues": "C9",
      "unlocks_when": "storyPhase == \"investigation\"       ",
      "status": "locked",
      "preferred_next_scene": "scene_12",
      "possible_next_scenes": "scene_13, scene_14"
    },
    {
      "scene_id": "scene_12",
      "timestamp": "1917-07-17T23:15:00.000Z",
      "location": "loc_12",
      "summary": "Poirot observes Mary secretly meeting Dr Bauerstein. Their tense conversation ends abruptly when they spot Hastings.",
      "clues_revealed": "C12",
      "required_clues": "C9",
      "unlocks_when": "storyPhase == \"investigation\"       ",
      "status": "locked",
      "preferred_next_scene": "scene_13",
      "possible_next_scenes": "scene_13 "
    },
    {
      "scene_id": "scene_13",
      "timestamp": "1917-07-18T17:20:00.000Z",
      "location": "loc_13",
      "summary": "At the inquest, chemist testifies to Alfred’s strychnine purchase; Alfred claims Emily ordered it. Jury returns “Wilful murder by person or persons unknown.”",
      "clues_revealed": "C13",
      "required_clues": "C10 | C11 | C12",
      "unlocks_when": "storyPhase == \"investigation\"       ",
      "status": "locked",
      "preferred_next_scene": "scene_14",
      "possible_next_scenes": "scene_14, scene_15 "
    },
    {
      "scene_id": "scene_14",
      "timestamp": "1917-07-18T20:00:00.000Z",
      "location": "loc_14",
      "summary": "Poirot reenacts the night of the murder: Cynthia swallows her habitual bromide, bolts door, sleeps. Bromide bottle proves uncontaminated.",
      "clues_revealed": "C14",
      "required_clues": "C10 | C11",
      "unlocks_when": "storyPhase == \"investigation\"       ",
      "status": "locked",
      "preferred_next_scene": "scene_15",
      "possible_next_scenes": "scene_15 "
    },
    {
      "scene_id": "scene_15",
      "timestamp": "1917-07-19T01:35:00.000Z",
      "location": "loc_15",
      "summary": "Police arrest Alfred on circumstantial evidence. Evelyn Howard returns unexpectedly, providing Alfred an alibi letter (time‑stamped 08:00 a.m.).",
      "clues_revealed": "C15",
      "required_clues": "C13",
      "unlocks_when": "storyPhase == \"investigation\"       ",
      "status": "locked",
      "preferred_next_scene": "scene_16",
      "possible_next_scenes": "scene_16, scene_17"
    },
    {
      "scene_id": "scene_16",
      "timestamp": "1917-07-19T18:10:00.000Z",
      "location": "loc_16",
      "summary": "Poirot verifies Alfred’s overnight stay: landlord saw him retire at 22:30 and again at breakfast.",
      "clues_revealed": "C16",
      "required_clues": "C15",
      "unlocks_when": "storyPhase == \"investigation\"       ",
      "status": "locked",
      "preferred_next_scene": "scene_17",
      "possible_next_scenes": "scene_17, scene_18 "
    },
    {
      "scene_id": "scene_17",
      "timestamp": "1917-07-19T22:00:00.000Z",
      "location": "loc_17",
      "summary": "Poirot and Hastings find a charred corner of a will leaving everything to Alfred; Poirot pockets it silently.",
      "clues_revealed": "C17",
      "required_clues": "C15, C3 ",
      "unlocks_when": "storyPhase == \"investigation\"       ",
      "status": "locked",
      "preferred_next_scene": "scene_18",
      "possible_next_scenes": "scene_18 "
    },
    {
      "scene_id": "scene_18",
      "timestamp": "1917-07-20T16:00:00.000Z",
      "location": "loc_18",
      "summary": "Poirot melts a false beard gum sample found in Alfred’s dressing‑case; gum identical to that on scrap of fake beard hair in Emily’s lock.",
      "clues_revealed": "C18",
      "required_clues": "C16 | C17",
      "unlocks_when": "storyPhase == \"investigation\"       ",
      "status": "locked",
      "preferred_next_scene": "scene_19",
      "possible_next_scenes": "scene_19 "
    },
    {
      "scene_id": "scene_19",
      "timestamp": "1917-07-21T05:00:00.000Z",
      "location": "loc_19",
      "summary": "Poirot assembles family, Inspector Japp, and lays out sequence: Evelyn and Alfred conspired to appear guilty by planting strychnine in coffee sugar and staging beard sighting, banking on double‑jeopardy. But Mary unwittingly removed the sugar; strychnine left unused.\n",
      "clues_revealed": "C19",
      "required_clues": "C14, C16, C17, C18",
      "unlocks_when": "storyPhase == \"reveal\"       ",
      "status": "locked",
      "preferred_next_scene": "scene_20",
      "possible_next_scenes": "scene_20 "
    },
    {
      "scene_id": "scene_20",
      "timestamp": "1917-07-21T05:25:00.000Z",
      "location": "loc_20",
      "summary": "Poirot exposes Evelyn’s handwriting on chemist label, Alfred’s forged beard hair, and Lawrence’s suppressed witness about tonic spoon. Evelyn collapses and confesses.",
      "clues_revealed": "C20",
      "required_clues": "C19 ",
      "unlocks_when": "storyPhase == \"reveal\"       ",
      "status": "locked",
      "preferred_next_scene": "scene_21",
      "possible_next_scenes": "scene_21 "
    },
    {
      "scene_id": "scene_21",
      "timestamp": "1917-07-21T17:30:00.000Z",
      "location": "loc_21",
      "summary": "Police take Evelyn and Alfred into custody. Family reconciles; John inherits; Poirot and Hastings share quietly triumphant breakfast.",
      "clues_revealed": "C21",
      "required_clues": "C20",
      "unlocks_when": "storyPhase == \"reveal\"       ",
      "status": "locked",
      "preferred_next_scene": "N/A",
      "possible_next_scenes": "N/A"
    }
  ],
  "locations": [
    {
      "loc_id": "loc_01",
      "display_name": "Styles St Mary railway station → Styles Court driveway",
      "description": "“An absurd little station, with no apparent reason for existence, perched up in the midst of green fields and country lanes.” A mile of rutted road then threads the sleepy Essex village before the high beeches of Styles Court’s lodge swing into view. The drive curves past Victorian shrubberies and lawns “so green and peaceful under the afternoon sun,” finally straightening to give the first full sight of the Elizabethan façade—red‑brick, mullioned, faintly austere against the flat country sky. The journey feels like a deliberate shedding of wartime anxieties; Hastings remarks that he “had suddenly strayed into another world,” an impression Poirot later exploits by treating the drive itself as a psychological boundary: once you pass the gates you are in Mrs Inglethorp’s domain, ruled as completely as any fief."
    },
    {
      "loc_id": "loc_02",
      "display_name": "Styles Court—morning‑room",
      "description": "A small, low‑ceilinged sitting‑room on the garden front, lined with pale panelling and crowded with Mrs Inglethorp’s spinning pamphlets and docketed charity lists. “We went into the little morning‑room,” Poirot tells Miss Howard, shutting the door on echoing corridors; light pours through “the long window” that opens straight onto the lawn where he is later seen “gambolling wildly.” The room’s intimacy makes it ideal for quiet conspiracies and sudden revelations—Poirot stages two crucial interviews here, counting on its domestic scale to disarm resentment."
    },
    {
      "loc_id": "loc_03",
      "display_name": "Styles Court—rose‑garden path",
      "description": "It runs between formal beds of standard roses and a clipped yew hedge that screens it from the front lawn; Hastings notes only the raised voices carrying “down the garden,” but Dorcas later confirms the spot by pointing to crushed petals on the gravel. The narrowness of the walk forces combatants close, turning a scent‑laden idyll into a duelling ground of words—an ironic foreshadowing of the poison that will follow."
    },
    {
      "loc_id": "loc_04",
      "display_name": "Village High Street chemist",
      "description": "A cramped, oak‑beamed shop heavy with “the mingled smell of carbolic and dried herbs.” Assistant Mr Mace later arrives at Leastways Cottage, “his face a curious mingling of terror and agitation,” begging Poirot to confirm a rumour about strychnine, and we learn the counter is only a few feet from the street‑door—easy for a bearded stranger to step in, sign the poison‑register, and vanish. "
    },
    {
      "loc_id": "loc_05",
      "display_name": "Styles Court—drawing‑room",
      "description": "A large, cool chamber with French windows to the terrace. After supper on the 17th, Cynthia and Hastings sit “by the open window,” fanning themselves in the breathless heat while Alfred Inglethorp “poured out” his wife’s coffee at the side‑table. The room’s gracious proportions tempt guests to linger, yet the wide door into the hall ensures every movement is on display—perfect for the subtle stage‑play of coffee cups."
    },
    {
      "loc_id": "loc_06",
      "display_name": "Styles Court—upstairs corridor (left wing)",
      "description": "Running above the servants’ quarters, this passage links Hastings’s bedroom to Lawrence’s and Cynthia’s. Doors are “bolted” on the night of the tragedy, and the swing‑door by the pantry table marks the point where Annie sets down Mrs Inglethorp’s cocoa at 7:15 p.m. With gas lamps flickering and floorboards that creak under unaccustomed weight, the corridor becomes a nocturnal racetrack for alibis. "
    },
    {
      "loc_id": "loc_07",
      "display_name": "Emily’s bedroom (center wing)",
      "description": "Hastings first enters through the splintered lock and notes the heavy walnut furniture, a reading‑lamp instead of candlesticks, and a tray holding a spirit‑lamp and cocoa saucepan: “A small quantity of dark fluid remained in the saucepan.” Carpet stains, a smashed coffee‑cup ground “into powder,” and the tell‑tale dispatch‑case make the room both crime‑scene and locked‑room puzzle, its barred French window staring over the same rose‑garden now silent in the moonlight. "
    },
    {
      "loc_id": "loc_08",
      "display_name": "Emily’s bedroom",
      "description": "Hastings first enters through the splintered lock and notes the heavy walnut furniture, a reading‑lamp instead of candlesticks, and a tray holding a spirit‑lamp and cocoa saucepan: “A small quantity of dark fluid remained in the saucepan.” Carpet stains, a smashed coffee‑cup ground “into powder,” and the tell‑tale dispatch‑case make the room both crime‑scene and locked‑room puzzle, its barred French window staring over the same rose‑garden now silent in the moonlight. "
    },
    {
      "loc_id": "loc_09",
      "display_name": "Village—Belgian Refugees’ farm cottage",
      "description": "A white‑washed, thatched cottage on Church Lane, lent to Poirot and his compatriots. Upstairs, his study looks onto “the village street,” the window propped wide to the summer air; Hastings notices “tiny Russian cigarettes” and a china pot for used matches—Poirot’s domestic neatness mirroring his mental order. Behind the house lie allotments the refugees cultivate, subtly reminding us why Emily’s wartime philanthropy bound Poirot to this case."
    },
    {
      "loc_id": "loc_10",
      "display_name": "Styles Court—boudoir",
      "description": "Emily’s private sitting‑room between the front hall and garden. Its long French window opens beside a garden bench where Mary Cavendish admits reading while overhearing “voices inside, raised in anger.” The room contains the purple despatch‑case, a lace‑draped Davenport, and the small upright safe that will later yield a half‑burned will. Curtains of old‑rose brocade give the space an unexpectedly feminine warmth—one reason, perhaps, why visitors lower their guard here."
    },
    {
      "loc_id": "loc_11",
      "display_name": "Styles Court—dispensary at the Red Cross Hospital (Cynthia’s workplace)",
      "description": "Seven miles away in Tadminster, the dispensary is a slate‑floored back‑room “where I work…in the dispensary,” Cynthia tells Hastings with mock pride. Ranks of amber bottles and a faint reek of ether overlay the whistle of passing supply‑lorries outside. Its disciplined layout contrasts with Styles’s rambling comfort and underscores Cynthia’s easy competence with drugs—knowledge that later casts a long shadow. "
    },
    {
      "loc_id": "loc_12",
      "display_name": "Styles Court—garden bench",
      "description": "A curved teak seat set just below the boudoir window, half hidden by clipped laurels. Mary’s tawny‑eyed stillness there allows her to eavesdrop on Emily’s quarrel “more audible where you were than in the hall,” the bench thus turning from ornament to inadvertent witness box. "
    },
    {
      "loc_id": "loc_13",
      "display_name": "Coroner’s Court, Styles St Mary",
      "description": "Held in the assembly‑room over the village post‑office: bare deal tables, benches crowded with “the jury looking up, interested,” and windows propped by hymn‑books to admit dusty July heat. The Coroner’s formal questions echo under the roof‑beams while gossiping villagers crane through the door. It is here that Lawrence suggests the tonic overdose and Dorcas “dispelled even that possibility.” "
    },
    {
      "loc_id": "loc_14",
      "display_name": "Styles Court—Cynthia’s bedroom",
      "description": "A girlish room adjoining Emily’s, its door bolted on the fatal night. Hastings notes the iron bedstead strewn with tennis‑flannels, a cheap travel trunk, and the lingering smell of violet sachets—details underscoring Cynthia’s in‑between social status. The connecting door becomes vital proof that no one could have slipped through without waking her. "
    },
    {
      "loc_id": "loc_15",
      "display_name": "Styles Court—drawing‑room",
      "description": "A large, cool chamber with French windows to the terrace. After supper on the 17th, Cynthia and Hastings sit “by the open window,” fanning themselves in the breathless heat while Alfred Inglethorp “poured out” his wife’s coffee at the side‑table. The room’s gracious proportions tempt guests to linger, yet the wide door into the hall ensures every movement is on display—perfect for the subtle stage‑play of coffee cups. "
    },
    {
      "loc_id": "loc_16",
      "display_name": "Village inn—public bar",
      "description": "Mentioned only in passing when Alfred Inglethorp offers to “walk down to the village” and see the agent over accounts. The Bells & Motley’s low‑beamed bar is cramped, oak‑scented, and thick with khaki uniforms; gossip from this taproom furnishes Poirot with rumours that Bauerstein is a German spy. Though Christie gives no set‑piece description, the inn functions as Styles St Mary’s social clearing‑house."
    },
    {
      "loc_id": "loc_17",
      "display_name": "Styles Court—Emily’s boudoir safe",
      "description": "A small upright Chubb, painted dull green to match the wainscot, recess‑mounted near the fire. Inside lies the curtailed will: Poirot notices “a small purple despatch‑case, with a key in the lock,” and later the charred scraps of another document in the grate beside it. The safe’s domestic scale belies its lethal importance. "
    },
    {
      "loc_id": "loc_18",
      "display_name": "Poirot’s refuge cottage",
      "description": "A white‑washed, thatched cottage on Church Lane, lent to Poirot and his compatriots. Upstairs, his study looks onto “the village street,” the window propped wide to the summer air; Hastings notices “tiny Russian cigarettes” and a china pot for used matches—Poirot’s domestic neatness mirroring his mental order. Behind the house lie allotments the refugees cultivate, subtly reminding us why Emily’s wartime philanthropy bound Poirot to this case."
    },
    {
      "loc_id": "loc_19",
      "display_name": "Styles Court—library (gathering of all suspects)",
      "description": "Paneled in dark oak with a Jacobean plaster ceiling; heavy curtains mute the tick of the ormolu clock as Poirot arranges chairs “like a popular lecturer,” preparing to unmask the murderer. Hastings, feeling the weight of history, reflects that “now at last, I had Poirot to myself,” framing the library as confessional as well as courtroom."
    },
    {
      "loc_id": "loc_20",
      "display_name": "Library",
      "description": "Paneled in dark oak with a Jacobean plaster ceiling; heavy curtains mute the tick of the ormolu clock as Poirot arranges chairs “like a popular lecturer,” preparing to unmask the murderer. Hastings, feeling the weight of history, reflects that “now at last, I had Poirot to myself,” framing the library as confessional as well as courtroom."
    },
    {
      "loc_id": "loc_21",
      "display_name": "Styles Court—drawing‑room",
      "description": "A large, cool chamber with French windows to the terrace. After supper on the 17th, Cynthia and Hastings sit “by the open window,” fanning themselves in the breathless heat while Alfred Inglethorp “poured out” his wife’s coffee at the side‑table. The room’s gracious proportions tempt guests to linger, yet the wide door into the hall ensures every movement is on display—perfect for the subtle stage‑play of coffee cups. "
    }
  ],
  "globalstate": [
    {
      "story_title": "Mysterious Affair at Styles",
      "current_scene": "",
      "detective_confidence": "",
      "last_saved": "",
      "turnsSinceLastProgress": "",
      "storyPhase": "",
      "revealedCluesGlobal": ""
    }
  ]
}

/* ─── env vars ─────────────────────────── */
const {
  OPENAI_KEY,
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
} = process.env;

/* ─── clients ──────────────────────────── */
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const openai   = new OpenAI({ apiKey: OPENAI_KEY });

/* ─── helpers ──────────────────────────── */


async function fetchPlayerRow(playerId) {
  const { data, error, status } = await supabase
    .from("PlayerState")
    .select("*")
    .eq("player_id", playerId)
    .maybeSingle();                 // ← avoids throw on no rows

  if (error && status !== 406) throw error;  // 406 = no rows

  if (!data) {
    const defaults = {
      player_id:     playerId,
      story_phase:   "pre-murder",
      current_scene: "scene_01",
      revealed_clues: [],
      turns_since_last_progress: 0,
      updated_at:    new Date().toISOString(),
    };

    const { data: inserted, error: insertErr } = await supabase
      .from("PlayerState")
      .insert(defaults)
      .select("*");                 // returns an array

    if (insertErr) throw insertErr;
    return inserted[0];            // ← grab the first row
  }

  return data;                      // object when row already exists
}


async function updatePlayerRow(playerId, { phase, scene, revealed, turns }) {
  const { error } = await supabase
    .from("PlayerState")
    .update({
      story_phase:   phase,
      current_scene: scene,
      revealed_clues: revealed,
      turns_since_last_progress: turns,
      updated_at:    new Date().toISOString(),
    })
    .eq("player_id", playerId);

  if (error) throw error;
}
function buildSystemPrompt({ phase, scene, revealed, turns, availableScenes, availableClues }) {
  const lines = [

    // ── Header ──────────────────────────
    "You are **StoryBrain v0.5**, the narrative engine for an adaptive Agatha‑Christie‑style mystery based on *The Mysterious Affair at Styles.*",
    "You hold an internal object called **StoryState** (see “Current StoryState” below).",

    "────────────────────────────────────────",
    "## ⚠️  OUTPUT FORMAT – STRICT",
    "Return **one** valid JSON object and nothing else.",
    "Schema (order doesn’t matter, keys do):",
    "",
    "{",
    '  "narrative": [ { "type": "text", "content": "..." }, { "type": "keyword", "content": "...", "action": "..." } ],',
    '  "hints":     ["string", …],',
    '  "stateDelta": {',
    '    "revealedClues":        ["clue_id", …],',
    '    "readerKnowledgeUpdates":[{"object_id":"id","confidence":0-1}, …],',
    '    "global": {',
    '      "mustacheMood": "neutral",',
    '      "current_scene": "scene_id",',
    '      "confidencePoirotKnowsKiller": 0-1,',
    '      "turnsSinceLastProgress": <int>,',
    '      "storyPhase": "<pre-murder|investigation|reveal>"',
    "    }",
    "  }",
    "}",
    "",
    "*Always include all three top‑level keys even if some arrays are empty.*",
    "*Do NOT wrap the JSON in Markdown or prose.*",
    "*Do NOT call any functions; this JSON is the only response.*",

    "────────────────────────────────────────",
    "## Story rules",
    "0. **You are a state machine.** Your primary goal is to return a perfectly formed JSON object that accurately updates the game state according to all rules.",
    "1. **Maintain canon:** never contradict facts in StoryState. The story is always told from Hastings’s POV in strict first person.",
    "2. *Fair‑play mystery:* a clue used to solve the case must have been (or become) discoverable by the reader.",
    "3. Do not name the murderer until **confidencePoirotKnowsKiller > 0.85** *and* the player explicitly accuses.",
    "4. CRITICAL PLOT MOMENT: After narrating scene_05 you must set current_scene = 'scene_06' in stateDelta.",
    "5. Keep diction era‑appropriate for the 1920s–30s.",
    "6. Before emitting a scene, consider only Scenes where unlocks_when equals the current storyPhase AND status == 'eligible'.",
    "7. Always output in stateDelta.global: current_scene, storyPhase, turnsSinceLastProgress, revealedCluesGlobal.",
    "8. If the player reveals a clue → turnsSinceLastProgress = 0; otherwise increment it.",
    "9. HINTS: The 'hints' array MUST contain 1-2 short, imperative action phrases to guide a stuck player (e.g., 'Ask about the will,' or 'Examine the fireplace').",
    "10. When a scene contains phase_change_to, update storyPhase and reset turnsSinceLastProgress.",
    "11. If confidencePoirotKnowsKiller ≥ 0.8 during investigation, change storyPhase to 'reveal'.",
    "12. Poirot always speaks in an arch tone with occasional French phrases.",
    "13. Merge stateDelta.revealedClues into revealedCluesGlobal (dedupe).",
    "14. mustacheMood: neutral by default; surprised when a brand‑new clue is revealed; thoughtful when analysing.",
    "15. Poirot is absent until storyPhase === 'investigation'.",
    "16. After clue C8, one suggested hint must involve seeking Poirot’s help.",
    "17. Any narrative information matching a clue must list that clue_id in stateDelta.revealedClues.",
"18. STRUCTURED NARRATIVE – Write in Hastings’s *first‑person* voice and vary what’s clickable:",
"   • Embed **1–3 keyword clauses** scattered through the paragraph (never all at the end).  Each clause must start with “I …” and end with punctuation.",
"   • At least **one** keyword each turn must involve an object, person, or action that could reveal or advance the plot — not just scenic details.",
"   • Good example of the required structure:",
"     [",
"       {\"type\":\"text\",\"content\":\"As I examined the room, \"},",
"       {\"type\":\"keyword\",\"content\":\"I noticed a half‑burned letter on the grate.\",\"action\":\"Examine the half‑burned letter\"},",
"       {\"type\":\"text\",\"content\":\" The air smelled faintly of bitter almonds.\"}",
"     ]",
"   • Wrap the clause exactly as written inside the keyword object and supply a clear, unique imperative in the `action` field (e.g. \"Examine the half‑burned letter\").",
"   • Do NOT reuse an `action` that appeared in previous turns, and do NOT insert extra line‑breaks around keyword segments; the array must read as seamless prose.",
"19. SCENE ADVANCE – Immediately after narrating a scene:",
"   • If every clue listed in that scene’s `clues_revealed` field is now present in revealedCluesGlobal,",
"     set stateDelta.global.current_scene to that scene’s `preferred_next_scene`.",
"   • Reset turnsSinceLastProgress to 0 when you advance.  Never leave the reader stuck in a scene once its required clue(s) are found.",



    "────────────────────────────────────────",
    "## Current StoryState (trimmed)",
    "{",
    `  "storyPhase": "${phase}",`,
    `  "currentScene": "${scene}",`,
    `  "turnsSinceLastProgress": ${turns || 0},`,
    `  "revealedCluesGlobal": ${JSON.stringify(revealed)},`,
    `  "characters": ${JSON.stringify(STORY_DATA.characters)},`,
    `  "clues": ${JSON.stringify(availableClues)},`,
    `  "scenes": ${JSON.stringify(availableScenes)},`,
    `  "locations": ${JSON.stringify(STORY_DATA.locations)}`,
    "}",
    "",
    "────────────────────────────────────────",
    "## Initialization reminder",
    "On the next user message, begin the scene currently in scene_01."
  ];

  return lines.join("\n");
}



// 3. the Vercel handler
const CORS = {
  origin:  "*",
  methods: "POST, OPTIONS",
  headers: "Content-Type",
};

export default async function handler(req, res) {
  // CORS pre-flight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin",  CORS.origin);
    res.setHeader("Access-Control-Allow-Methods", CORS.methods);
    res.setHeader("Access-Control-Allow-Headers", CORS.headers);
    res.status(200).end();        // 200 is fine for pre-flight
    return;
  }

  // Reject everything except POST
  if (req.method !== "POST") {
    res.setHeader("Access-Control-Allow-Origin", CORS.origin);
    return res.status(405).end("Use POST");
  }


  const { playerId, userAction } = req.body;

try {
  // -- pull current state
  const row = await fetchPlayerRow(playerId);   // row is the object you need

  const {
    story_phase: phase,
    current_scene: scene,
    revealed_clues: revealed,            
    turns_since_last_progress      
  } = row;


// Filter scenes to only include those available in the current phase
const availableScenes = STORY_DATA.scenes.filter(s => s.unlocks_when.includes(phase));
const availableSceneIds = availableScenes.map(s => s.scene_id.trim());
const availableClues = STORY_DATA.clues.filter(c => availableSceneIds.includes(c.found_in_scene.trim()));
   

    // -- build prompt & call OpenAI
    const systemPrompt = buildSystemPrompt({ phase, scene, revealed, turns: turns_since_last_progress, availableScenes: availableScenes,
  availableClues: availableClues });
console.log("--- SYSTEM PROMPT ---", systemPrompt);   
  const chat = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userAction },
      ],
    });
// Get the raw text from the AI
const rawResponse = chat.choices[0].message.content;

// Find the first '{' and the last '}' to extract the JSON object
const firstBrace = rawResponse.indexOf('{');
const lastBrace = rawResponse.lastIndexOf('}');

if (firstBrace === -1 || lastBrace === -1) {
  throw new Error("AI response did not contain a valid JSON object.");
}

const jsonString = rawResponse.substring(firstBrace, lastBrace + 1);

// Clean up trailing commas that might cause errors
const cleanedResponse = jsonString.replace(/,\s*([}\]])/g, "$1");
    
// Now, parse the clean and valid JSON
const assistant = JSON.parse(cleanedResponse);


    let nextTurnsSinceProgress = row.turns_since_last_progress || 0;

    const oldClues = new Set(row.revealed_clues);
    const newClues = new Set(assistant.stateDelta.revealedClues || []);
    const phaseChanged = row.story_phase !== assistant.stateDelta.global.storyPhase;

    // Progress is made if new clues are found or the story phase changes.
    if (newClues.size > oldClues.size || phaseChanged) {
      nextTurnsSinceProgress = 0;
    } else {
      nextTurnsSinceProgress += 1;
    }
    // -- merge stateDelta
    const g = assistant.stateDelta.global;
    const mergedRevealed = [
      ...new Set([
        ...revealed,
        ...(assistant.stateDelta.revealedClues || []),
      ]),
    ];
const newlyRevealedClues = (assistant.stateDelta.revealedClues || [])
  .map(clueId => STORY_DATA.clues.find(c => c.clue_id === clueId))
  .filter(Boolean);

const updatePayload = {
  phase: g.storyPhase,
  scene: g.current_scene,
  revealed: mergedRevealed,
  turns: nextTurnsSinceProgress
};
console.log("--- Updating Supabase with ---", updatePayload);

   await updatePlayerRow(playerId, {
         phase: g.storyPhase,
         scene: g.current_scene,
         revealed: mergedRevealed,
         turns: nextTurnsSinceProgress
     });

    // -- send narrative + choices back
res.setHeader("Access-Control-Allow-Origin", CORS.origin);
res.status(200).json({
  narrative: assistant.narrative,
  hints:     assistant.hints,
  scene:     assistant.stateDelta.global.current_scene, 
  stateDelta: assistant.stateDelta, 
  newlyRevealedClues: newlyRevealedClues
});

  } catch (err) {
    console.error(err);
    res.setHeader("Access-Control-Allow-Origin", CORS.origin);
    res.status(500).json({ error: err.message });
  }
}

if (process.env.LOCAL_DEV === 'true') {
  (async () => {
    const express    = (await import('express')).default;
    const bodyParser = (await import('body-parser')).default;

    const app = express();
    app.use(bodyParser.json());

    // mount the existing handler you exported above
    app.post('/play', (req, res) => handler(req, res));

    const PORT = 8787;
    app.listen(PORT, () =>
      console.log(`Local API listening on http://localhost:${PORT}/play`));
  })();
}
