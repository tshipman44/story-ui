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
      "title": "I have heard that Hercule Poirot was in Essex",
      "found_in_scene": "scene_01",
      "points_to": "scene_02",
      "isRedHerring": false,
      "revealed": "narrative"
    },
    {
      "clue_id": "C2",
      "title": "I observed some family tension",
      "found_in_scene": "scene_02",
      "points_to": "scene_03",
      "isRedHerring": false,
      "revealed": "narrative"
    },
    {
      "clue_id": "C3",
      "title": "I heard of the difficulty with inheritance",
      "found_in_scene": "scene_03",
      "points_to": "scene_04",
      "isRedHerring": false,
      "revealed": "narrative"
    },
    {
      "clue_id": "C4",
      "title": "I learned about Alfred purchasising strychninne",
      "found_in_scene": "scene_04",
      "points_to": "scene_05",
      "isRedHerring": false,
      "revealed": "narrative"
    },
    {
      "clue_id": "C5",
      "title": "I noted Emily’s odd coffee/cocoa & sugar switch",
      "found_in_scene": "scene_05",
      "points_to": "scene_06",
      "isRedHerring": false,
      "revealed": "narrative"
    },
    {
      "clue_id": "C6",
      "title": "I noticed goings-on in the night time",
      "found_in_scene": "scene_06",
      "points_to": "scene_07",
      "isRedHerring": false,
      "revealed": "narrative"
    },
    {
      "clue_id": "C7",
      "title": "I saw the terrible death of Emily Inglethorp",
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
      "title": "I have engaged Poirot",
      "found_in_scene": "scene_09",
      "points_to": "scene_10",
      "isRedHerring": false,
      "revealed": "The user must request help, or follow up on the description of C1"
    },
    {
      "clue_id": "C10",
      "title": "I have established the difference between cups",
      "found_in_scene": "scene_10",
      "points_to": "scene_11",
      "isRedHerring": false,
      "revealed": "The user must question Dorcas, the maid, or examine the cups carefully."
    },
    {
      "clue_id": "C11",
      "title": "I learned of another source of strychnine",
      "found_in_scene": "scene_11",
      "points_to": "scene_12",
      "isRedHerring": false,
      "revealed": "Ask Cynthia to help with stock checking."
    },
    {
      "clue_id": "C12",
      "title": "I learned of Mary's affair with Dr. Bauerstein",
      "found_in_scene": "scene_12",
      "points_to": "scene_13",
      "isRedHerring": false,
      "revealed": "The user must overhear Mary with Dr. Bauerstein."
    },
    {
      "clue_id": "C13",
      "title": "I have learned the medical evidence at the inquest",
      "found_in_scene": "scene_13",
      "points_to": "scene_14",
      "isRedHerring": false,
      "revealed": "Attend the inquest."
    },
    {
      "clue_id": "C14",
      "title": "Poirot and I have a new theory on the poisoning",
      "found_in_scene": "scene_14",
      "points_to": "scene_15",
      "isRedHerring": false,
      "revealed": "Poirot asks the player to recreate Cynthia’s night‑routine. "
    },
    {
      "clue_id": "C15",
      "title": "I have learned of Alfred's alibi",
      "found_in_scene": "scene_15",
      "points_to": "scene_16",
      "isRedHerring": false,
      "revealed": "The player chooses to confront Evelyn about the postmark"
    },
    {
      "clue_id": "C16",
      "title": "I have weakened Alfred's alibi by checking the clock",
      "found_in_scene": "scene_16",
      "points_to": "scene_17",
      "isRedHerring": false,
      "revealed": "If the player looks at the signed guest book entry, note the discrepancy between the bar clock and the player's pocket watch."
    },
    {
      "clue_id": "C17",
      "title": "I have found a charred scrap of the will favoring Alfred",
      "found_in_scene": "scene_17",
      "points_to": "scene_18",
      "isRedHerring": false,
      "revealed": "Revealed to the player if they inspect the safe."
    },
    {
      "clue_id": "C18",
      "title": "I have found evidence of a fake beard",
      "found_in_scene": "scene_18",
      "points_to": "scene_19",
      "isRedHerring": false,
      "revealed": "Triggered by the player investigating Alfred's dresser earlier and finding the beard gum pot"
    },
    {
      "clue_id": "C19",
      "title": "I have heard Poirot's theory of the case",
      "found_in_scene": "scene_19",
      "points_to": "scene_20",
      "isRedHerring": false,
      "revealed": "Requires either 80% of possible clues, or discussing the psychology of the case in depth with Poirot."
    },
    {
      "clue_id": "C20",
      "title": "I have learned the full solution",
      "found_in_scene": "scene_20",
      "points_to": "scene_21",
      "isRedHerring": false,
      "revealed": "narrative"
    },
    {
      "clue_id": "C21",
      "title": "I have put together the final pieces",
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
      "title": "I have found muddy footprints leading to the window",
      "found_in_scene": "scene_06",
      "points_to": "scene_07",
      "isRedHerring": true,
      "revealed": "Revealed by looking out the window"
    },
    {
      "clue_id": "C24",
      "title": "I have found an engraving chit labeled, 'To B, from Mary'",
      "found_in_scene": "scene_12",
      "points_to": "scene_13",
      "isRedHerring": true,
      "revealed": "Revealed by searching the area"
    },
    {
      "clue_id": "C25",
      "title": "I found a tag for Strychnine tablets, written in Evelyn's handwriting",
      "found_in_scene": "scene_11",
      "points_to": "scene_12",
      "isRedHerring": false,
      "revealed": "Revealed by searching behind the cupboard in scene 11"
    },
    {
      "clue_id": "C26",
      "title": "I have found a scrap of green ribbon with spirit gum",
      "found_in_scene": "scene_17",
      "points_to": "scene18",
      "isRedHerring": false,
      "revealed": "Discovered by a careful examination of the dispatch-case. Hinted at if the user discovers C18"
    }
  ],
"scenes": [
    {
      "scene_id": "scene_01",
      "entry_narrative": "You are Captain Arthur Hastings, on a month's sick leave from the Great War. Having no near relations or friends, you had ran across John Cavendish, an old friend who you knew from boyhood. You had often stayed at Styles, his mother's house in Essex. You remembered fondly the time you spent there with John and his brother Lawrence. John invited you to stay and spend your leave there, and you accepted. You took the train to Essex to meet him. The train slows, screeching into the absurdly quaint station of Styles St. Mary. The air is thick with the scent of summer green. As you step onto the platform, you see your old friend, John Cavendish, waving from his motorcar.",
      "events": [
        {
          "event_id": "E1_DriveToStyles",
          "trigger": "Player gets in the car, greets John, or agrees to go to Styles Court.",
          "narrative": "The drive to Styles Court is a pleasant one, winding through sleepy Essex lanes. You pass a small, newly-established Belgian refugee camp, and the sight jogs your memory—you'd heard the famous detective Hercule Poirot was staying in the area. As the car turns into the grand driveway, you meet Miss Cynthia Murdoch, a vibrant young woman who is a ward of the family. The manor itself, Styles Court, looms ahead—a magnificent Elizabethan façade, beautiful, yet somehow holding its secrets close.",
          "reveals_clue": "C1",
          "moves_to_scene": "scene_02"
        }
      ],
      "unlocks_when": "storyPhase == \"pre-murder\"",
      "status": "eligible"
    },
    {
      "scene_id": "scene_02",
      "entry_narrative": "John leads you into the morning-room. The entire family seems to be present, and the air is dense with unspoken tensions. You are introduced to the matriarch, Emily Inglethorp, and her much younger husband, Alfred, who hovers near her chair. You also meet John's brother Lawrence, John's enchanting wife Mary, and Emily's companion, the formidable Evelyn Howard, whose hostility towards Alfred is almost a physical presence in the room.",
      "events": [
        {
          "event_id": "E2_MeetTheFamily",
          "trigger": "Player attempts to greet the family, asks John to make introductions, or observes the room.",
          "narrative": "The introductions are made. Lady Emily is gracious but commands the room with an iron will. Alfred seems nervous, fussing with his pince-nez. You can't help but notice the way Evelyn Howard glares at him when she thinks no one is looking. The tension is palpable.",
          "reveals_clue": "C2",
          "moves_to_scene": "scene_03"
        }
      ],
      "unlocks_when": "storyPhase == \"pre-murder\"",
      "status": "eligible"
    },
    {
      "scene_id": "scene_03",
      "entry_narrative": "The group begins to disperse from the morning-room, the strained pleasantries having run their course. You move in to the Rose Garden path, where you hear the beginnings of a heated discussion.",
      "events": [
        {
          "event_id": "E3_OverhearQuarrel",
          "trigger": "Player lingers, moves towards the sound of the argument, or asks about the tension.",
          "narrative": "You find a reason to remain behind as the voices from the drawing-room grow louder. It is Evelyn and Emily, arguing fiercely over Alfred's influence and a new will. 'He has the arts of a devil!' you hear Evelyn declare. The argument ends with Evelyn announcing she will leave Styles at once.",
          "reveals_clue": "C3",
          "moves_to_scene": "scene_04"
        }
      ],
      "unlocks_when": "storyPhase == \"pre-murder\"",
      "status": "eligible"
    },
    {
      "scene_id": "scene_04",
      "entry_narrative": "With Evelyn Howard's dramatic departure hanging in the air, the family gathers awkwardly for dinner. Lawrence Cavendish, John's brother, arrives just as you are sitting down, looking slightly dishevelled.",
      "events": [
        {
          "event_id": "E4_PoisonPurchase",
          "trigger": "Player engages Lawrence in conversation or asks about his day.",
          "narrative": "Making small talk, Lawrence mentions off-handedly that he saw Alfred in the village chemist earlier. 'Looked devilishly nervous, the fellow did,' Lawrence remarks. 'Buying a great deal of strychnine, enough to put down a mad dog, he said.' A sudden, sharp silence falls over the dinner table.",
          "reveals_clue": "C4",
          "moves_to_scene": "scene_05"
        }
      ],
      "unlocks_when": "storyPhase == \"pre-murder\"",
      "status": "eligible"
    },
    {
      "scene_id": "scene_05",
      "entry_narrative": "Dinner has concluded, and the family has retired to the drawing-room for coffee. The atmosphere is still incredibly strained. Dorcas, the maid, brings in the coffee service.",
      "events": [
        {
          "event_id": "E5_CocoaRitual",
          "trigger": "Player observes the coffee service or pays close attention to Emily.",
          "narrative": "You watch as Mary Cavendish pours the coffee. When she offers a cup to her stepmother-in-law, Emily waves it away. 'No coffee for me tonight, Mary dear. I shall have my cocoa, as usual.' Dorcas appears with a cup of cocoa on a separate tray, which Emily accepts. Shortly after, the family begins to disperse for the evening.",
          "reveals_clue": "C5",
          "moves_to_scene": "scene_06"
        }
      ],
      "unlocks_when": "storyPhase == \"pre-murder\"",
      "status": "eligible"
    },
    {
      "scene_id": "scene_06",
      "entry_narrative": "The house is quiet, but sleep evades you. You decide to take a brief stroll down the upstairs corridor to clear your head. The gas lamps cast long, flickering shadows.",
      "events": [
        {
          "event_id": "E6-1_SeeLight",
          "trigger": "Player approaches Emily's room or looks towards her door.",
          "narrative": "As you pass Mrs. Inglethorp's room, you notice a faint sliver of light from beneath her door, followed by the soft, metallic chink of something being set down on a marble-topped surface. A moment later, the light is extinguished. Shortly after, you see John Cavendish in his pajamas, who seems startled to see you and mutters something about closing windows before quickly retiring to his room.",
          "reveals_clue": "C6",
          "moves_to_scene": "scene_07"
        },
        {
          "event_id": "E6-2_SeeFootprints",
          "trigger": "Player looks out a nearby corridor window.",
          "narrative": "Glancing out the large corridor window at the moonlit garden below, you notice something odd in the flowerbed directly under Emily's window: a set of distinct, muddy footprints leading away from the house.",
          "reveals_clue": "C23",
          "moves_to_scene": null
        }
      ],
      "unlocks_when": "storyPhase == \"pre-murder\"",
      "status": "eligible"
    },
    {
      "scene_id": "scene_07",
      "entry_narrative": "You have only just returned to your room when a violent cry shatters the silence of the house, followed by the sound of a crash from Mrs. Inglethorp's room!",
      "events": [
        {
          "event_id": "E7-1_BreakDoor",
          "trigger": "Player rushes out of their room, investigates the noise, or tries to help.",
          "narrative": "You race into the corridor. Lawrence and John are already there, trying to force the locked door to Emily's room. With a combined effort, the lock splinters and you all burst in. The scene is one of chaos: a small table is overturned, and Emily Inglethorp is in the throes of terrible convulsions. It's a truly horrific sight.",
          "reveals_clue": "C7",
          "moves_to_scene": "scene_08"
        }
      ],
      "unlocks_when": "storyPhase == \"pre-murder\"",
      "phase_change_to": "investigation",
      "status": "eligible"
    },
    {
      "scene_id": "scene_08",
      "entry_narrative": "The local physician, Dr. Wilkins, has been summoned and arrives along with Dr. Bauerstein who was staying nearby. They have been with Mrs. Inglethorp for some time. The household waits in a dreadful, anticipatory silence.",
      "events": [
        {
          "event_id": "E8-1_HearDiagnosis",
          "trigger": "Player asks one of the doctors for news or waits for them to emerge from the room.",
          "narrative": "Dr. Wilkins emerges from the bedroom, his face grim. 'I am sorry,' he says, his voice low. 'She is gone.' Dr. Bauerstein adds, his toxicologist's mind clearly at work, 'The symptoms... the violent convulsions... it is unmistakably strychnine poisoning.'",
          "reveals_clue": "C8",
          "moves_to_scene": "scene_09"
        }
      ],
      "unlocks_when": "storyPhase == \"investigation\"",
      "status": "locked"
    },
    {
      "scene_id": "scene_09",
      "entry_narrative": "The local police have been called, but you feel a sense of helplessness. The official investigation will be slow and clumsy. You recall the Belgian refugee camp nearby and the rumor that the great Hercule Poirot is among them. The thought takes root: only he can solve this.",
      "events": [
        {
          "event_id": "E9-1_FetchPoirot",
          "trigger": "Player decides to go to the refugee camp, explicitly seeks out Poirot, or follows a hint to get help.",
          "narrative": "You make your way to the cottage where the Belgian refugees are housed. There, you find the man himself, Hercule Poirot, meticulously arranging items on his mantlepiece. You lay out the terrible events of the night. His egg-shaped head tilts. 'A crime of this nature,' he says, his eyes gleaming, 'it is of the first order. I will assist, mon ami, but we must be discreet.'",
          "reveals_clue": "C9",
          "moves_to_scene": "scene_10"
        }
      ],
      "unlocks_when": "storyPhase == \"investigation\"",
      "status": "locked"
    },
    {
      "scene_id": "scene_10",
      "entry_narrative": "You and Poirot have returned to Styles Court. The police are present, but Poirot, with an air of quiet authority, begins his own methodical investigation. He asks to speak with the maid, Dorcas, in the boudoir.",
      "events": [
        {
          "event_id": "E10-1_QuestionDorcas",
          "trigger": "Player listens to the interview with Dorcas or asks her about the night of the murder.",
          "narrative": "Poirot gently questions the loyal maid about the after-dinner coffee service. She confirms that Mrs. Inglethorp did not take coffee, but her usual cocoa. Poirot's eyes light up. 'And the cup, was it her usual?' he asks. Dorcas explains the coffee cups are all the same, but Mrs. Inglethorp's cocoa cup was a special one, kept on a tray in this very room. Poirot nods slowly. 'We must find this cocoa cup,' he declares.",
          "reveals_clue": "C10",
          "moves_to_scene": "scene_11"
        }
      ],
      "unlocks_when": "storyPhase == \"investigation\"",
      "status": "locked"
    },
    {
      "scene_id": "scene_11",
      "entry_narrative": "Following the conversation with Dorcas, Poirot leads you to the dispensary at the nearby Red Cross Hospital where Cynthia works. The room is lined with amber bottles and smells faintly of ether.",
      "events": [
        {
          "event_id": "E11-1_ExamineCupboard",
          "trigger": "Player chooses to examine the poison cupboard or follows Poirot's lead.",
          "narrative": "Poirot's eyes scan the shelves before settling on the poison cupboard. Inside, among the neatly arranged bottles, he points out a small box of loose strychnine tablets. More importantly, wedged behind the cupboard, he retrieves a soiled label from a chemist's bottle, clearly marked 'Strychnine Hydrochloride.'",
          "reveals_clue": "C11",
          "moves_to_scene": "scene_12"
        }
      ],
      "unlocks_when": "storyPhase == \"investigation\"",
      "status": "locked"
    },
    {
      "scene_id": "scene_12",
      "entry_narrative": "Back at Styles Court that evening, the mood is somber. After dinner, Poirot suggests a stroll in the garden. From the shadows of a yew hedge, he motions for you to be silent, pointing towards a garden bench.",
      "events": [
        {
          "event_id": "E12-1_ObserveMeeting",
          "trigger": "Player agrees to watch from the shadows or looks where Poirot is pointing.",
          "narrative": "You see two figures in a hushed, intense conversation: Mary Cavendish and Dr. Bauerstein. Their body language is secretive, their faces filled with anxiety. The conversation ends abruptly as they seem to sense your presence, and they part ways with a final, worried glance.",
          "reveals_clue": "C12",
          "moves_to_scene": "scene_13"
        }
      ],
      "unlocks_when": "storyPhase == \"investigation\"",
      "status": "locked"
    },
    {
      "scene_id": "scene_13",
      "entry_narrative": "The day of the inquest arrives. You and Poirot take seats in the crowded assembly-room over the village post-office. The air is stuffy and thick with morbid curiosity as the coroner begins the proceedings.",
      "events": [
        {
          "event_id": "E13-1_HearInquest",
          "trigger": "Player listens to the proceedings.",
          "narrative": "The local chemist is called to the stand. He testifies that he sold a quantity of strychnine to Mr. Alfred Inglethorp, who signed the poison-register. When questioned, Alfred does not deny it, claiming his wife asked him to purchase it for a dog. After all testimonies, the jury returns a verdict of 'Wilful murder by person or persons unknown.'",
          "reveals_clue": "C13",
          "moves_to_scene": "scene_14"
        }
      ],
      "unlocks_when": "storyPhase == \"investigation\"",
      "status": "locked"
    },
    {
      "scene_id": "scene_14",
      "entry_narrative": "That evening, Poirot gathers a few of you in Cynthia's room. 'We must reconstruct the events of that night,' he announces. He hands Cynthia her usual bromide sleeping-draft.",
      "events": [
        {
          "event_id": "E14-1_Reenactment",
          "trigger": "Player observes the reenactment.",
          "narrative": "You watch as Cynthia drinks the bromide, just as she did on the night of the murder, and bolts her door. Poirot then retrieves the bromide bottle for testing. Later, he confirms his suspicions: the bromide bottle is completely uncontaminated with poison. The method of delivery remains a mystery.",
          "reveals_clue": "C14",
          "moves_to_scene": "scene_15"
        }
      ],
      "unlocks_when": "storyPhase == \"investigation\"",
      "status": "locked"
    },
    {
      "scene_id": "scene_15",
      "entry_narrative": "The official investigation, led by Inspector Japp, has focused squarely on the most obvious suspect. You are in the drawing-room when Japp enters, looking resolute.",
      "events": [
        {
          "event_id": "E15-1_WitnessArrest",
          "trigger": "Player watches the events unfold.",
          "narrative": "Inspector Japp formally arrests Alfred Inglethorp for the murder of his wife. As a stunned silence falls over the family, Evelyn Howard makes a dramatic and unexpected return to Styles Court. She produces a letter, she claims, that provides a solid alibi for Alfred.",
          "reveals_clue": "C15",
          "moves_to_scene": "scene_16"
        }
      ],
      "unlocks_when": "storyPhase == \"investigation\"",
      "status": "locked"
    },
{
      "scene_id": "scene_16",
      "entry_narrative": "Despite the alibi letter from Evelyn, Poirot seems unconvinced. 'Let us take a trip to the village, Hastings,' he says. 'I wish to speak with the landlord of the inn where Monsieur Inglethorp stayed.'",
      "events": [
        {
          "event_id": "E16-1_InterviewLandlord",
          "trigger": "Player accompanies Poirot to the inn or asks the landlord about Alfred.",
          "narrative": "At the inn, the landlord confirms Alfred's story. He saw him retire for the night and saw him again at breakfast. The alibi appears solid. Poirot, however, seems more interested in the clock on the wall than the landlord's testimony.",
          "reveals_clue": "C16",
          "moves_to_scene": "scene_17"
        }
      ],
      "unlocks_when": "storyPhase == \"investigation\"",
      "status": "locked"
    },
    {
      "scene_id": "scene_17",
      "entry_narrative": "Back at Styles, Poirot's attention turns to the fireplace in Emily Inglethorp's boudoir. 'A fire in July, Hastings. It is curious, no?' he remarks, kneeling to examine the grate.",
      "events": [
        {
          "event_id": "E17-1_FindWillScrap",
          "trigger": "Player helps Poirot search the fireplace or examines the ashes.",
          "narrative": "Sifting through the ashes, Poirot carefully retrieves a small, charred scrap of paper. Though mostly burned, you can just make out a few words. It appears to be a fragment of a will, and the name 'Alfred Inglethorp' is clearly visible. Poirot says nothing, merely tucking it into his wallet with a thoughtful expression.",
          "reveals_clue": "C17",
          "moves_to_scene": "scene_18"
        }
      ],
      "unlocks_when": "storyPhase == \"investigation\"",
      "status": "locked"
    },
    {
      "scene_id": "scene_18",
      "entry_narrative": "Poirot is in his element, his 'little grey cells' working at full capacity. He leads you to Alfred Inglethorp's dressing-room, now sealed by the police. With a nod from Inspector Japp, you enter.",
      "events": [
        {
          "event_id": "E18-1_FindBeardGum",
          "trigger": "Player searches the dressing-case or watches Poirot's examination.",
          "narrative": "Poirot ignores the obvious, instead picking up a small pot from the dressing-table. He later demonstrates that the spirit-gum inside is identical to a residue found on a scrap of fake black beard hair discovered near Emily's bed. Someone, it seems, was wearing a disguise.",
          "reveals_clue": "C18",
          "moves_to_scene": "scene_19"
        }
      ],
      "unlocks_when": "storyPhase == \"investigation\"",
      "status": "locked"
    },
    {
      "scene_id": "scene_19",
      "entry_narrative": "'The time has come,' Poirot announces dramatically. 'Assemble everyone in the library. Tonight, we shall expose the truth!'",
      "events": [
        {
          "event_id": "E19-1_TheReveal",
          "trigger": "Player gathers in the library with the others.",
          "narrative": "With everyone gathered, Poirot begins his reconstruction. He lays out the intricate plot: how Alfred and his secret lover, Evelyn Howard, conspired to make Alfred look guilty to exploit the laws of double jeopardy. He explains their plan to poison Emily via the coffee, a plan that was unwittingly thwarted by Mary Cavendish. 'But,' Poirot says, pausing for effect, 'that does not mean a murder was not committed...'",
          "reveals_clue": "C19",
          "moves_to_scene": "scene_20"
        }
      ],
      "unlocks_when": "storyPhase == \"reveal\"",
      "status": "locked"
    },
    {
      "scene_id": "scene_20",
      "entry_narrative": "Poirot continues, his voice sharp and clear, holding the room captive. He turns his attention to the true method of the murder.",
      "events": [
        {
          "event_id": "E20-1_FinalAccusation",
          "trigger": "Player listens to the conclusion of Poirot's explanation.",
          "narrative": "'The poison was not in the coffee at all!' Poirot declares. 'It was in her evening tonic, administered later by a trusted hand!' He produces the chemist's label with Evelyn's handwriting and explains how Alfred, disguised with the false beard, created a diversion while his accomplice committed the crime. Under the weight of the evidence, Evelyn Howard collapses and confesses.",
          "reveals_clue": "C20",
          "moves_to_scene": "scene_21"
        }
      ],
      "unlocks_when": "storyPhase == \"reveal\"",
      "status": "locked"
    },
    {
      "scene_id": "scene_21",
      "entry_narrative": "In the aftermath of the confession, a quiet order begins to settle over Styles Court. Inspector Japp takes Alfred and Evelyn into custody.",
      "events": [
        {
          "event_id": "E21-1_Epilogue",
          "trigger": "Player waits for the conclusion of the story.",
          "narrative": "The following morning, the atmosphere in the house is transformed. With the truth revealed, the family begins to reconcile. You learn that John Cavendish will inherit the estate after all. You and Poirot share a quiet, well-deserved breakfast, the mystery finally solved.",
          "reveals_clue": "C21",
          "moves_to_scene": null
        }
      ],
      "unlocks_when": "storyPhase == \"reveal\"",
      "status": "locked"
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
    '  "narrative": "string— vivid prose in Agatha Christie’s voice",',
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
"0. **PRIME DIRECTIVE:** Your highest priority is to write a beautiful, immersive narrative. Fulfilling the JSON schema is your second priority.",
"1. **NARRATIVE FLOW:** Always begin a new scene by presenting its `entry_narrative`.",
"2. **EVENT MATCHING:** After the entry narrative, compare the player's action to the `trigger` descriptions for the events in the current scene. If there is a logical match, you MUST:",
"   a. Narrate that event's `narrative` as the main response.",
"   b. Add the `reveals_clue` ID to the `stateDelta.revealedClues` array if it exists.",
"   c. Set the `stateDelta.global.current_scene` to the event's `moves_to_scene` ID.",
"3. **DEFAULT REACTION:** If the player's action does not logically match any event `trigger`, you MUST generate a 'default reaction.' A default reaction has three parts:",
"   a. The narrative must describe Hastings performing the unexpected action.",
"   b. Any characters present must react in a believable, in-character way appropriate to the 1920s setting.",
"   c. The `stateDelta` you return MUST NOT reveal any new clues or change the `current_scene`.",
"4. **HINTS:** The 'hints' array must contain 1-2 short, imperative phrases that suggest actions which would match an available event `trigger`.",
"5. **Maintain canon:** The story is always told from Hastings’s POV in strict first person. Never contradict facts in StoryState.",
"6. *Fair‑play mystery:* A clue used to solve the case must have been (or become) discoverable by the reader.",
"7. **PHASE CHANGE:** When an event moves the story to a scene that has a `phase_change_to` property, you MUST update `storyPhase` in the stateDelta.",
"8. **POIROT:** Poirot is absent until `storyPhase` is 'investigation'. After clue C8 is revealed, one suggested hint MUST involve seeking his help.",
"9. Do not name the murderer until **confidencePoirotKnowsKiller > 0.85** *and* the player explicitly accuses.",


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

  const currentSceneObject = STORY_DATA.scenes.find(s => s.scene_id === g.current_scene);

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
  events:    currentSceneObject ? currentSceneObject.events : [],
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
