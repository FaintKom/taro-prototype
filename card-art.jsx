// Tarot card visuals — face & back
function CardBack({ style = 'ornate' }) {
  if (style === 'ornate') return (
    <svg viewBox="0 0 100 150" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <linearGradient id="cbo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b1e6a"/>
          <stop offset="1" stopColor="#1a0e3a"/>
        </linearGradient>
        <radialGradient id="cbo-r" cx=".5" cy=".5" r=".55">
          <stop offset="0" stopColor="#d4a64f" stopOpacity=".6"/>
          <stop offset="1" stopColor="#d4a64f" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="100" height="150" fill="url(#cbo-g)"/>
      <rect x="3" y="3" width="94" height="144" fill="none" stroke="#d4a64f" strokeWidth="0.4" opacity=".8"/>
      <rect x="6" y="6" width="88" height="138" fill="none" stroke="#d4a64f" strokeWidth="0.2" opacity=".5"/>
      <ellipse cx="50" cy="75" rx="32" ry="48" fill="url(#cbo-r)"/>
      {/* central star */}
      <g transform="translate(50,75)">
        <path d="M 0 -22 L 4 -6 L 22 -4 L 8 4 L 12 22 L 0 12 L -12 22 L -8 4 L -22 -4 L -4 -6 Z" fill="#d4a64f" opacity=".95"/>
        <circle r="3" fill="#1a0e3a"/>
        <circle r="1.5" fill="#d4a64f"/>
      </g>
      {/* corner flourishes */}
      {[[10,10],[90,10],[10,140],[90,140]].map(([x,y],i) => (
        <g key={i} transform={`translate(${x},${y})`}>
          <circle r="2.5" fill="none" stroke="#d4a64f" strokeWidth=".4"/>
          <circle r="1" fill="#d4a64f"/>
        </g>
      ))}
      {/* arabesque rings */}
      <circle cx="50" cy="75" r="28" fill="none" stroke="#d4a64f" strokeWidth=".25" opacity=".7"/>
      <circle cx="50" cy="75" r="34" fill="none" stroke="#d4a64f" strokeWidth=".15" opacity=".4" strokeDasharray="2 2"/>
      {/* sparkle dots */}
      {[[28,30],[72,30],[28,120],[72,120],[50,32],[50,118]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r=".7" fill="#d4a64f" opacity=".8"/>
      ))}
    </svg>
  );
  if (style === 'geometric') return (
    <svg viewBox="0 0 100 150" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="100" height="150" fill="#0e0a26"/>
      <g stroke="#7a5cc7" strokeWidth=".4" fill="none" opacity=".9">
          {[20,40,60,80,100,120].map(y => (
            <g key={y}>
              <line x1="0" y1={y} x2="100" y2={y-15} opacity=".3"/>
              <line x1="0" y1={y-15} x2="100" y2={y} opacity=".3"/>
            </g>
          ))}
      </g>
      <g transform="translate(50,75)">
        <polygon points="0,-30 26,-15 26,15 0,30 -26,15 -26,-15" fill="none" stroke="#d4a64f" strokeWidth=".7"/>
        <polygon points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11" fill="none" stroke="#d4a64f" strokeWidth=".5"/>
        <circle r="8" fill="#d4a64f" opacity=".15"/>
        <circle r="3" fill="#d4a64f"/>
      </g>
    </svg>
  );
  // occult
  return (
    <svg viewBox="0 0 100 150" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="100" height="150" fill="#13091f"/>
      <rect x="3" y="3" width="94" height="144" fill="none" stroke="#a87fd6" strokeWidth=".4"/>
      <g transform="translate(50,75)" stroke="#d4a64f" fill="none" strokeWidth=".4">
        <circle r="26"/>
        <circle r="20" opacity=".6"/>
        {/* pentagram-ish star */}
        <path d="M 0 -22 L 13 14 L -18 -8 L 18 -8 L -13 14 Z" strokeWidth=".5"/>
        {/* zodiac glyphs around */}
        {['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'].map((g, i) => {
          const a = (i*30 - 90) * Math.PI / 180;
          return <text key={i} x={Math.cos(a)*30} y={Math.sin(a)*30+2} textAnchor="middle" fill="#d4a64f" fontSize="4" fontFamily="serif">{g}</text>;
        })}
      </g>
    </svg>
  );
}

// Card face — generated from the card data
function TarotCardFace({ card }) {
  const colors = {
    'major': { bg1: '#3b1e6a', bg2: '#1a0e3a', accent: '#d4a64f' },
    'cups':  { bg1: '#1e3a5c', bg2: '#0f1f3a', accent: '#7fc6f5' },
    'wands': { bg1: '#5c2a1e', bg2: '#3a140f', accent: '#f5a063' },
    'swords':{ bg1: '#3b3b4a', bg2: '#1f1f2a', accent: '#d8d8e0' },
    'pents': { bg1: '#2d4a2a', bg2: '#152a14', accent: '#a4d066' },
  };
  const c = colors[card.suit] || colors.major;
  return (
    <div style={{
      width: '100%', height: '100%',
      background: `linear-gradient(150deg, ${c.bg1}, ${c.bg2})`,
      border: `1px solid ${c.accent}`,
      borderRadius: 'inherit', padding: '6%',
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
      transform: card.reversed ? 'rotate(180deg)' : 'none',
    }}>
      <svg viewBox="0 0 100 150" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <rect x="3" y="3" width="94" height="144" fill="none" stroke={c.accent} strokeWidth=".3" opacity=".5"/>
      </svg>
      {/* number / suit at top */}
      <div style={{ position: 'relative', textAlign: 'center', color: c.accent, fontFamily: 'var(--serif)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
        {card.suit === 'major' ? `· ${card.num} ·` : ''}
      </div>
      {/* central illustration */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CardArt card={card} accent={c.accent}/>
      </div>
      {/* name */}
      <div style={{ position: 'relative', textAlign: 'center', color: c.accent, fontFamily: 'var(--serif)', fontSize: 7.5, letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 600 }}>
        {card.name}
      </div>
    </div>
  );
}

function CardArt({ card, accent }) {
  // Symbol mapping for major arcana + simpler suit motifs
  const symbols = {
    'The Fool': '☉', 'The Magician': '∞', 'The High Priestess': '☾',
    'The Empress': '♀', 'The Emperor': '♃', 'The Hierophant': '✠',
    'The Lovers': '☥', 'The Chariot': '⚔', 'Strength': '∞',
    'The Hermit': '✦', 'Wheel of Fortune': '⊕', 'Justice': '⚖',
    'The Hanged Man': '☥', 'Death': '☠', 'Temperance': '♒',
    'The Devil': '⛧', 'The Tower': '⚡', 'The Star': '✶',
    'The Moon': '☽', 'The Sun': '☀', 'Judgement': '✟', 'The World': '⊙',
  };
  const sym = symbols[card.name];
  if (sym) return (
    <div style={{ position: 'relative', textAlign: 'center' }}>
      <div style={{ fontSize: 36, color: accent, lineHeight: 1, fontFamily: 'serif' }}>{sym}</div>
      <svg viewBox="0 0 60 60" width="60" height="60" style={{ position: 'absolute', inset: '50% 50% auto auto', transform: 'translate(50%, -50%)', zIndex: -1 }}>
        <circle cx="30" cy="30" r="22" fill="none" stroke={accent} strokeWidth=".5" opacity=".4"/>
        <circle cx="30" cy="30" r="28" fill="none" stroke={accent} strokeWidth=".3" opacity=".25" strokeDasharray="2 2"/>
      </svg>
    </div>
  );
  // suit cards — just display number + glyph
  const suitGlyph = { cups: '🜄', wands: '🜂', swords: '🜁', pents: '🜃' }[card.suit] || '✦';
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 28, color: accent }}>{suitGlyph}</div>
      <div style={{ fontSize: 11, color: accent, marginTop: 4, letterSpacing: '0.15em' }}>{card.num}</div>
    </div>
  );
}

function TarotCard({ card, faceUp, onClick, style = 'ornate', size = 'md', glow }) {
  const sizes = {
    sm: { w: 60, h: 90 },
    md: { w: 90, h: 135 },
    lg: { w: 180, h: 270 },
  };
  const s = sizes[size];
  return (
    <div onClick={onClick} style={{
      width: s.w, height: s.h, perspective: 1000, cursor: onClick ? 'pointer' : 'default',
      animation: glow ? 'cardGlow 2s ease-in-out infinite' : 'none',
    }}>
      <div style={{
        width: '100%', height: '100%', position: 'relative',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.7s cubic-bezier(.2,.8,.2,1)',
        transform: faceUp ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}>
        {/* back */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          borderRadius: size === 'sm' ? 4 : 8, overflow: 'hidden',
          boxShadow: '0 8px 22px rgba(0,0,0,.5)',
        }}>
          <CardBack style={style}/>
        </div>
        {/* face */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: size === 'sm' ? 4 : 8, overflow: 'hidden',
          boxShadow: '0 8px 22px rgba(0,0,0,.5)',
        }}>
          <TarotCardFace card={card}/>
        </div>
      </div>
    </div>
  );
}

window.CardBack = CardBack;
window.TarotCard = TarotCard;
