// Prayer content. Scripture is the King James Version (public domain).
// Reflections and prayers are original drafts and need review by your pastor advisor before launch.

export type Focus = "peace" | "anxiety" | "gratitude" | "family" | "grief" | "sleep";

export type Session = {
  id: string;
  focus: Focus;
  order: number; // position inside its journey; order 0 is always free
  title: string;
  ref: string;
  refSpoken: string;
  verse: string;
  keyLine: string;
  reflection: string;
  prayer: string;
  carry: string;
};

export const FOCI: { id: Focus; label: string; blurb: string }[] = [
  { id: "peace", label: "Peace", blurb: "Quiet the noise before the day begins." },
  { id: "anxiety", label: "Anxiety", blurb: "Hand your worries to God, one at a time." },
  { id: "gratitude", label: "Gratitude", blurb: "Notice what you have already been given." },
  { id: "family", label: "Family", blurb: "Pray for the people under your roof." },
  { id: "grief", label: "Grief", blurb: "Sit with God in the hard places." },
  { id: "sleep", label: "Sleep", blurb: "Lay the day down and rest." },
];

export const SESSIONS: Session[] = [
  // PEACE
  {
    id: "peace-still", focus: "peace", order: 0, title: "Be still",
    ref: "Psalm 46:10", refSpoken: "Psalm forty-six, verse ten.",
    verse: "Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.",
    keyLine: "Be still, and know that I am God.",
    reflection: "Stillness is not the absence of noise. It is a decision to stop arguing with the day before it begins. Before you answer a single message or solve a single problem, you are allowed to simply be here, known and held. Notice what in you is hurrying, and let it rest.",
    prayer: "God, you are God and I am not. I set down the list I have been carrying. Quiet the part of me that rehearses what might go wrong. Let your presence be the first thing I notice today. Teach me to be still enough to hear you, and steady enough to move when you say go.",
    carry: "I do not have to hold this day together. God does.",
  },
  {
    id: "peace-kept", focus: "peace", order: 1, title: "Kept in peace",
    ref: "Isaiah 26:3", refSpoken: "Isaiah twenty-six, verse three.",
    verse: "Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.",
    keyLine: "Thou wilt keep him in perfect peace.",
    reflection: "A mind that is stayed is a mind with an anchor. Thoughts will still drift, and that is normal. Peace here is not a feeling you have to produce. It is a gift that is kept for you, the way a harbor keeps a ship. Each time your attention wanders and you bring it back, you are practicing trust.",
    prayer: "Lord, my thoughts are many and loud. I fasten them to you. When they pull away, bring me back gently, as many times as it takes. Keep me in your peace today, in traffic, in conversation, in the unfinished work. I trust you with what I cannot control.",
    carry: "When my mind drifts, I come back to God.",
  },
  {
    id: "peace-world", focus: "peace", order: 2, title: "Not as the world gives",
    ref: "John 14:27", refSpoken: "John, chapter fourteen, verse twenty-seven.",
    verse: "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.",
    keyLine: "Let not your heart be troubled.",
    reflection: "The peace the world offers depends on circumstances going well. The peace Jesus gives is meant to be present even when they do not. He does not tell the disciples to feel nothing. He tells them where to take what they feel. Whatever is troubling you this morning, you can bring it to him without tidying it first.",
    prayer: "Jesus, I receive the peace you leave with me. I name what troubles my heart today, and I hand it to you. Where I am afraid, be my courage. Where I am tired, be my rest. Let your peace go with me into every room I enter.",
    carry: "Christ's peace goes with me into every room.",
  },
  // ANXIETY
  {
    id: "anx-request", focus: "anxiety", order: 0, title: "Make it a request",
    ref: "Philippians 4:6-7", refSpoken: "Philippians, chapter four, verses six and seven.",
    verse: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.",
    keyLine: "Let your requests be made known unto God.",
    reflection: "Anxiety wants you to carry tomorrow's problems into this morning. Paul's answer is practical: name the worry, turn it into a request, and add a thank you for what you already have. It is a way of moving the weight out of your chest and into God's hands. You can do it in one sentence. You can do it again at noon.",
    prayer: "God, I name my worries before you now. I am asking you for help with each of them. I am also thankful for the breath I am taking, the people who love me, and the ways you have carried me before. Let your peace stand guard over my heart and mind today.",
    carry: "Turn each worry into a request.",
  },
  {
    id: "anx-cast", focus: "anxiety", order: 1, title: "Cast your care",
    ref: "1 Peter 5:6-7", refSpoken: "First Peter, chapter five, verses six and seven.",
    verse: "Humble yourselves therefore under the mighty hand of God, that he may exalt you in due time: Casting all your care upon him; for he careth for you.",
    keyLine: "He careth for you.",
    reflection: "Casting is a strong word. It is a throw, not a gentle handoff. You do not have to sort your worries before you give them away. God is not irritated by the size of what you bring. The reason offered is simple and enough: he cares for you.",
    prayer: "Father, I throw my cares to you, the large ones and the small. I do not have to understand them to give them. Thank you that you are not tired of me. Today when a worry returns, remind me that I have already placed it in your hands.",
    carry: "God cares for me, so I can put this down.",
  },
  {
    id: "anx-fear", focus: "anxiety", order: 2, title: "I am with thee",
    ref: "Isaiah 41:10", refSpoken: "Isaiah forty-one, verse ten.",
    verse: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.",
    keyLine: "Fear thou not; for I am with thee.",
    reflection: "Notice the order. The promise comes before the command. You are told not to fear because God is with you, not simply because fear is unhelpful. Strengthen, help, uphold. Three promises, all in the first person. The God who says them is the one who will meet you in whatever today holds.",
    prayer: "Lord, you say you are with me. I hold you to that this morning. Strengthen me where I feel weak. Help me with what is too heavy. Uphold me when I would fall. Let me walk into today knowing I am not walking alone.",
    carry: "I am not facing today alone.",
  },
  // GRATITUDE
  {
    id: "grat-everything", focus: "gratitude", order: 0, title: "In every thing",
    ref: "1 Thessalonians 5:18", refSpoken: "First Thessalonians, chapter five, verse eighteen.",
    verse: "In every thing give thanks: for this is the will of God in Christ Jesus concerning you.",
    keyLine: "In every thing give thanks.",
    reflection: "Paul does not say to give thanks for everything. He says in everything, in the middle of whatever you are facing. Gratitude is not denial of difficulty. It is a way of noticing that, even now, there is something to receive. Start small: a bed, a roof, a face you are glad to see.",
    prayer: "God, I begin with the small things. Thank you for this day, for breath, for the people who have shown me kindness. Thank you for what you have already carried me through. Open my eyes today to the good I would have walked past.",
    carry: "Look for one thing to thank God for today.",
  },
  {
    id: "grat-gates", focus: "gratitude", order: 1, title: "Through his gates",
    ref: "Psalm 100:4", refSpoken: "Psalm one hundred, verse four.",
    verse: "Enter into his gates with thanksgiving, and into his courts with praise: be thankful unto him, and bless his name.",
    keyLine: "Be thankful unto him, and bless his name.",
    reflection: "Thanksgiving is described here as a doorway. You do not have to feel close to God first and then give thanks. Thanks is how you walk in. If your heart feels flat today, begin anyway with the facts: what is good, what is given, what has not been taken.",
    prayer: "Lord, I come through the door of thanks. Thank you for being faithful when I am not. Thank you for the ordinary gifts of this week. Let gratitude soften whatever has hardened in me, and let me bless your name with my day.",
    carry: "Thanks is the way in.",
  },
  {
    id: "grat-new", focus: "gratitude", order: 2, title: "New every morning",
    ref: "Lamentations 3:22-23", refSpoken: "Lamentations, chapter three, verses twenty-two and twenty-three.",
    verse: "It is of the LORD's mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.",
    keyLine: "They are new every morning: great is thy faithfulness.",
    reflection: "Yesterday's mistakes were met with yesterday's mercy. Today has its own supply. The writer of Lamentations says this in the middle of grief, which is why it carries weight. Mercy is not a stock that runs low. It is issued fresh, whether or not you felt close to God yesterday.",
    prayer: "Faithful God, thank you for mercy that is new today. I leave yesterday's failures with you. I receive this day as a gift I did not earn. Help me to give to others the same patience you give to me.",
    carry: "Mercy is new today.",
  },
  // FAMILY
  {
    id: "fam-house", focus: "family", order: 0, title: "Me and my house",
    ref: "Joshua 24:15", refSpoken: "Joshua, chapter twenty-four, verse fifteen.",
    verse: "But as for me and my house, we will serve the LORD.",
    keyLine: "As for me and my house, we will serve the LORD.",
    reflection: "Leadership at home rarely looks dramatic. It looks like a quiet decision made again each morning about what kind of household you are building. You cannot control every person under your roof. You can decide what you will bring to it: your presence, your patience, your prayer.",
    prayer: "Lord, I place my household in your hands. Thank you for each person in it, with all their differences. Where there is tension, bring peace. Where there is distance, bring us closer. Help me to serve you in the ordinary tasks of this home today.",
    carry: "My home is where I serve today.",
  },
  {
    id: "fam-way", focus: "family", order: 1, title: "The way to go",
    ref: "Proverbs 22:6", refSpoken: "Proverbs, chapter twenty-two, verse six.",
    verse: "Train up a child in the way he should go: and when he is old, he will not depart from it.",
    keyLine: "Train up a child in the way he should go.",
    reflection: "Training is mostly watching. Children learn what we love by seeing what we do when we think the moment is small. If you are a parent, grandparent, teacher, or mentor, this verse is a reminder of how much a steady example matters. If you carry worry about a young person, bring that here too.",
    prayer: "God, I pray for the young people you have placed in my life. Show me how to guide them with patience and truth. Give me words when I need them and silence when I should listen. Protect them where I cannot, and draw them toward you. Where I have failed, be gracious.",
    carry: "My example teaches more than my words.",
  },
  // GRIEF
  {
    id: "grief-near", focus: "grief", order: 0, title: "Close to the brokenhearted",
    ref: "Psalm 34:18", refSpoken: "Psalm thirty-four, verse eighteen.",
    verse: "The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.",
    keyLine: "The LORD is nigh unto them that are of a broken heart.",
    reflection: "You do not have to be strong in this prayer. The verse does not say God is near to people who have recovered. It says he is near to the brokenhearted, now. Grief keeps no schedule, and this may be a hard hour. You can sit here without fixing anything. Being close is already the comfort.",
    prayer: "God, you know who I miss. You know the weight I woke up with. I do not have the words, so I sit here with you. Stay near. Hold what I cannot hold. Give me enough strength for this hour, and then for the next.",
    carry: "God is near, and I do not have to be strong.",
  },
  {
    id: "grief-mourn", focus: "grief", order: 1, title: "Blessed are they that mourn",
    ref: "Matthew 5:4", refSpoken: "Matthew, chapter five, verse four.",
    verse: "Blessed are they that mourn: for they shall be comforted.",
    keyLine: "Blessed are they that mourn: for they shall be comforted.",
    reflection: "Jesus names mourners among the blessed, which is surprising until you notice what he promises: comfort. Mourning is treated as a sign that something mattered. Your sorrow is not a failure of faith. It is the other side of love, and it is seen.",
    prayer: "Jesus, you wept at a friend's grave. You know this ground. Comfort me in the ways that I need, through people, through quiet, through your word. Let me grieve honestly, and let me not grieve alone.",
    carry: "My sorrow is seen, and comfort is promised.",
  },
  {
    id: "grief-tears", focus: "grief", order: 2, title: "Every tear",
    ref: "Revelation 21:4", refSpoken: "Revelation, chapter twenty-one, verse four.",
    verse: "And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.",
    keyLine: "God shall wipe away all tears from their eyes.",
    reflection: "This is a promise about where the story ends. It does not ask you to pretend the loss is small today. It tells you that grief is not the final word, and that God himself will do the tender work of wiping tears. Hold it loosely if you need to. It is still true.",
    prayer: "Father, thank you for the promise that sorrow will not last forever. Until then, carry me. Let hope be a small light in the room, enough to see the next step. Bring me people who will sit with me, and bring me rest tonight.",
    carry: "Sorrow is not the end of the story.",
  },
  // SLEEP
  {
    id: "sleep-safety", focus: "sleep", order: 0, title: "Lay me down",
    ref: "Psalm 4:8", refSpoken: "Psalm four, verse eight.",
    verse: "I will both lay me down in peace, and sleep: for thou, LORD, only makest me dwell in safety.",
    keyLine: "I will both lay me down in peace, and sleep.",
    reflection: "The day is over, whether or not the list is finished. Sleep is an act of trust. You stop, and the world keeps going because God never stops. Let your body go heavy. Whatever is unresolved will still be in God's care in the morning.",
    prayer: "Lord, I lay this day down. The things I did well, and the things I did not. The conversations I replay and the ones I avoided. Keep watch while I rest. Let me wake with a quiet mind.",
    carry: "God keeps watch, so I can rest.",
  },
  {
    id: "sleep-keeper", focus: "sleep", order: 1, title: "He will not slumber",
    ref: "Psalm 121:3-4", refSpoken: "Psalm one hundred twenty-one, verses three and four.",
    verse: "He will not suffer thy foot to be moved: he that keepeth thee will not slumber. Behold, he that keepeth Israel shall neither slumber nor sleep.",
    keyLine: "He that keepeth thee will not slumber.",
    reflection: "You are allowed to stop watching. Someone else is on duty. The psalm pictures a guardian who does not tire, and it says so twice. Let your muscles loosen one at a time, starting at the jaw.",
    prayer: "Keeper of Israel, keeper of me, I give you the night. Watch over the people I love. Quiet my thoughts, and soften my shoulders. I will sleep, because you do not.",
    carry: "I will sleep, because he does not.",
  },
];

export const focusLabel = (f: Focus) => FOCI.find((x) => x.id === f)!.label;
export const sessionById = (id: string) => SESSIONS.find((s) => s.id === id);

export function todaysSession(focus: Focus, date = new Date()): Session {
  const pool = SESSIONS.filter((s) => s.focus === focus);
  const start = new Date(date.getFullYear(), 0, 0).getTime();
  const dayOfYear = Math.floor((date.getTime() - start) / 86400000);
  return pool[dayOfYear % pool.length];
}

// ---------- Guided session script ----------

export type Step =
  | { kind: "say"; text: string; stage: number; chunk: number } // chunk: index in stage's display chunks, -1 = not shown
  | { kind: "wait"; ms: number; stage: number; label: "breathe" | "silence" | "gap" };

export const STAGES = ["Settle", "Scripture", "Reflection", "Prayer"] as const;

export const SILENCE_MULT = { short: 0.6, standard: 1, long: 1.7 } as const;
export type Silence = keyof typeof SILENCE_MULT;

const splitSentences = (t: string) => t.split(/(?<=[.?!])\s+/).filter(Boolean);
const splitVerse = (t: string) => t.split(/(?<=[:;.])\s+/).filter(Boolean);

export function settleText(focus: Focus): string {
  return focus === "sleep"
    ? "Let your body grow heavy. Unclench your jaw. The day is finished, and you can set it down. We will breathe together for a moment."
    : "Settle in. Let your shoulders drop. You are here, and that is enough. We will breathe together for a moment.";
}

export type Script = { steps: Step[]; display: string[][]; carryIndex: number };

export function buildScript(s: Session, silence: Silence): Script {
  const m = SILENCE_MULT[silence];
  const sleepy = s.focus === "sleep";
  const steps: Step[] = [];
  const display: string[][] = [[], [], [], []];

  const say = (text: string, stage: number, show: boolean, gap = 900) => {
    let chunk = -1;
    if (show) {
      display[stage].push(text);
      chunk = display[stage].length - 1;
    }
    steps.push({ kind: "say", text, stage, chunk });
    if (gap) steps.push({ kind: "wait", ms: gap, stage, label: "gap" });
  };
  const wait = (secs: number, stage: number, label: "breathe" | "silence") =>
    steps.push({ kind: "wait", ms: Math.round(secs * 1000 * m), stage, label });

  // 0 Settle
  splitSentences(settleText(s.focus)).forEach((t) => say(t, 0, true, 700));
  wait(30, 0, "breathe");

  // 1 Scripture
  say(s.refSpoken, 1, false, 1400);
  splitVerse(s.verse).forEach((t) => say(t, 1, true, 1300));
  wait(10, 1, "silence");
  say("Once more, slowly.", 1, false, 900);
  say(s.keyLine, 1, false, 600);
  wait(12, 1, "silence");

  // 2 Reflection
  splitSentences(s.reflection).forEach((t) => say(t, 2, true, 900));
  wait(15, 2, "silence");

  // 3 Prayer
  say("Let us pray.", 3, false, 2000);
  splitSentences(s.prayer).forEach((t) => say(t, 3, true, 1200));
  wait(sleepy ? 75 : 60, 3, "silence");
  say("Amen.", 3, false, 1500);
  const carryIndex = steps.length;
  say(sleepy ? `Rest well. ${s.carry}` : `Carry this with you today. ${s.carry}`, 3, false, 0);

  return { steps, display, carryIndex };
}

export const readMs = (text: string) => Math.max(1200, text.split(/\s+/).length * 450 + 300);

export function sessionSeconds(s: Session, silence: Silence): number {
  const { steps } = buildScript(s, silence);
  const ms = steps.reduce((a, st) => a + (st.kind === "say" ? readMs(st.text) : st.ms), 0);
  return Math.round(ms / 1000);
}

export const sessionMinutes = (s: Session, silence: Silence) =>
  Math.max(1, Math.round(sessionSeconds(s, silence) / 60));
