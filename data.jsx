// Static data: tarot cards, avatars, zodiac signs, copy
const TAROT_DECK = [
  { name: 'The Fool', upright: 'New beginnings, leap of faith', kw: 'beginnings · innocence' },
  { name: 'The Magician', upright: 'Manifestation, willpower', kw: 'will · creation' },
  { name: 'The High Priestess', upright: 'Intuition, the unconscious', kw: 'intuition · mystery' },
  { name: 'The Empress', upright: 'Abundance, nurturing', kw: 'abundance · earth' },
  { name: 'The Emperor', upright: 'Authority, structure', kw: 'order · power' },
  { name: 'The Lovers', upright: 'Love, alignment, choices', kw: 'union · choice' },
  { name: 'The Chariot', upright: 'Direction, control', kw: 'drive · victory' },
  { name: 'Strength', upright: 'Inner strength, courage', kw: 'courage · grace' },
  { name: 'The Hermit', upright: 'Soul-searching, solitude', kw: 'reflection · light' },
  { name: 'Wheel of Fortune', upright: 'Cycles, fate', kw: 'cycles · turning' },
  { name: 'Justice', upright: 'Fairness, truth, cause + effect', kw: 'truth · balance' },
  { name: 'The Hanged Man', upright: 'Pause, surrender, new perspective', kw: 'surrender · pause' },
  { name: 'Death', upright: 'Transformation, endings', kw: 'change · release' },
  { name: 'Temperance', upright: 'Balance, moderation, patience', kw: 'balance · alchemy' },
  { name: 'The Devil', upright: 'Attachment, shadow self', kw: 'shadow · binding' },
  { name: 'The Tower', upright: 'Sudden change, awakening', kw: 'rupture · clarity' },
  { name: 'The Star', upright: 'Hope, faith, renewal', kw: 'hope · clarity' },
  { name: 'The Moon', upright: 'Intuition, illusion, dreams', kw: 'dreams · veiled' },
  { name: 'The Sun', upright: 'Joy, vitality, success', kw: 'joy · light' },
  { name: 'Judgement', upright: 'Rebirth, awakening, calling', kw: 'awakening · call' },
  { name: 'The World', upright: 'Completion, fulfillment', kw: 'wholeness · arrival' },
  { name: 'Eight of Cups', upright: 'Walking away, seeking deeper meaning', kw: 'departure · search' },
  { name: 'Three of Wands', upright: 'Expansion, foresight', kw: 'horizon · expansion' },
  { name: 'Ace of Pentacles', upright: 'New prosperity, opportunity', kw: 'seed · opportunity' },
  { name: 'Knight of Swords', upright: 'Action, ambition, drive', kw: 'cut · forward' },
  { name: 'Queen of Cups', upright: 'Compassion, calm, intuitive', kw: 'soft · deep' },
];

// Pick N unique cards
const drawCards = (n) => {
  const pool = [...TAROT_DECK];
  const out = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    out.push({ ...pool[idx], reversed: Math.random() < 0.25 });
    pool.splice(idx, 1);
  }
  return out;
};

const AVATARS = [
  { id: 'luna', name: 'Luna', title: 'The Mystic', tone: 'gentle · empathic',
    desc: 'Speaks in soft tides. Best when your question carries weight.',
    accent: '#c885a8', glyph: '☽', greeting: "Welcome, dear one. I sense Mercury stirring in your chart today. What weighs on your mind?" },
  { id: 'orion', name: 'Orion', title: 'The Sage', tone: 'wise · ancient',
    desc: 'Old as the first stars. Answers with patience and depth.',
    accent: '#d4af37', glyph: '✶', greeting: "Greetings. The cosmos has been waiting. Speak what you would learn." },
  { id: 'raven', name: 'Raven', title: 'The Witch', tone: 'direct · edgy',
    desc: 'No sugar. No softening. Just the truth, sharply read.',
    accent: '#8b6dd6', glyph: '☾', greeting: "Sit. The cards already know. Tell me what you came for." },
  { id: 'celeste', name: 'Celeste', title: 'The Oracle', premium: true, tone: 'visionary · cosmic',
    desc: 'Sees the threads where futures fork. Premium-only.',
    accent: '#e8c5ff', glyph: '✦', greeting: "" },
  { id: 'kai', name: 'Kai', title: 'The Shaman', premium: true, tone: 'grounded · primal',
    desc: 'Earth and breath. Reads the body and the land.',
    accent: '#7dc88a', glyph: '◉', greeting: "" },
];

const ZODIAC = [
  { sign: 'aries',       glyph: '♈', dates: 'Mar 21–Apr 19', element: 'fire',  ruler: 'Mars' },
  { sign: 'taurus',      glyph: '♉', dates: 'Apr 20–May 20', element: 'earth', ruler: 'Venus' },
  { sign: 'gemini',      glyph: '♊', dates: 'May 21–Jun 20', element: 'air',   ruler: 'Mercury' },
  { sign: 'cancer',      glyph: '♋', dates: 'Jun 21–Jul 22', element: 'water', ruler: 'Moon' },
  { sign: 'leo',         glyph: '♌', dates: 'Jul 23–Aug 22', element: 'fire',  ruler: 'Sun' },
  { sign: 'virgo',       glyph: '♍', dates: 'Aug 23–Sep 22', element: 'earth', ruler: 'Mercury' },
  { sign: 'libra',       glyph: '♎', dates: 'Sep 23–Oct 22', element: 'air',   ruler: 'Venus' },
  { sign: 'scorpio',     glyph: '♏', dates: 'Oct 23–Nov 21', element: 'water', ruler: 'Pluto' },
  { sign: 'sagittarius', glyph: '♐', dates: 'Nov 22–Dec 21', element: 'fire',  ruler: 'Jupiter' },
  { sign: 'capricorn',   glyph: '♑', dates: 'Dec 22–Jan 19', element: 'earth', ruler: 'Saturn' },
  { sign: 'aquarius',    glyph: '♒', dates: 'Jan 20–Feb 18', element: 'air',   ruler: 'Uranus' },
  { sign: 'pisces',      glyph: '♓', dates: 'Feb 19–Mar 20', element: 'water', ruler: 'Neptune' },
];

const cap = (s) => s ? s[0].toUpperCase() + s.slice(1) : s;

// Sample horoscope text rotation
const HOROSCOPE_TEXT = `The stars suggest a day of slow, deliberate energy. Mercury's shift into your communication zone sharpens what you say — but listen first. A small choice this morning carries more weight than it should. Trust the quieter voice. By evening, something you've been holding loosens its grip. Let it.`;

// Spreads
const SPREADS = [
  { id: 'yesno',  name: 'Yes / No',                cards: 1, coins: 5,  hint: 'Quick answer · 1 card', desc: 'Perfect for simple yes-or-no questions.' },
  { id: 'ppf',    name: 'Past · Present · Future', cards: 3, coins: 10, hint: 'Classic spread · 3 cards', desc: 'Understand your journey and what lies ahead.' },
  { id: 'celtic', name: 'Celtic Cross',            cards: 10, coins: 25, hint: 'Deep insight · 10 cards', desc: 'Comprehensive reading for complex situations.' },
];

const PPF_LABELS = ['Past', 'Present', 'Future'];
const CELTIC_LABELS = ['Self','Crossing','Foundation','Past','Crown','Future','Approach','Environment','Hopes','Outcome'];

// 1..5 mood index — rendered via <MoodFace level={n}/>
const MOOD_LABELS = ['Heavy', 'Off', 'Steady', 'Bright', 'Soaring'];

const MOON_PHASES = [
  { name: 'New Moon',         phase: 0 },
  { name: 'Waxing Crescent',  phase: 1 },
  { name: 'First Quarter',    phase: 2 },
  { name: 'Waxing Gibbous',   phase: 3 },
  { name: 'Full Moon',        phase: 4 },
  { name: 'Waning Gibbous',   phase: 5 },
  { name: 'Last Quarter',     phase: 6 },
  { name: 'Waning Crescent',  phase: 7 },
];

// Mood face — line-art SVG, level 1..5
function MoodFace({ level = 3, size = 28, color = 'currentColor' }) {
  // mouth path varies by level
  const mouths = {
    1: 'M 8 16 Q 12 12 16 16',  // frown
    2: 'M 8 15 Q 12 13 16 15',
    3: 'M 8 15 L 16 15',         // flat
    4: 'M 8 14 Q 12 16 16 14',
    5: 'M 8 13 Q 12 17 16 13',   // big smile
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round">
      <circle cx="12" cy="12" r="9.5"/>
      <circle cx="9" cy="10" r=".9" fill={color} stroke="none"/>
      <circle cx="15" cy="10" r=".9" fill={color} stroke="none"/>
      <path d={mouths[level] || mouths[3]}/>
    </svg>
  );
}
window.MoodFace = MoodFace;

window.TaroData = { TAROT_DECK, drawCards, AVATARS, ZODIAC, cap, HOROSCOPE_TEXT, SPREADS, PPF_LABELS, CELTIC_LABELS, MOOD_LABELS, MOON_PHASES };
