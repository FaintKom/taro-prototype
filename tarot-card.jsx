// Tarot card visual — silhouette style with name plate
const { Icon: TCIcon } = window;

// Map card name to a silhouette glyph approach (decorative SVG, abstract)
function CardArt({ name, reversed }) {
  // pick a deterministic seed from name to vary art
  const seed = name.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  const variant = seed % 6;
  const flip = reversed ? 'rotate(180 60 90)' : '';
  return (
    <svg viewBox="0 0 120 180" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <linearGradient id={`bg-${seed}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--bg-elev)"/>
          <stop offset="1" stopColor="var(--bg-card)"/>
        </linearGradient>
        <radialGradient id={`glow-${seed}`} cx=".5" cy=".5" r=".6">
          <stop offset="0" stopColor="var(--gold)" stopOpacity=".25"/>
          <stop offset="1" stopColor="var(--gold)" stopOpacity="0"/>
        </radialGradient>
      </defs>
      {/* card bg */}
      <rect width="120" height="180" fill={`url(#bg-${seed})`}/>
      {/* inner border */}
      <rect x="6" y="6" width="108" height="168" fill="none" stroke="var(--gold)" strokeWidth=".5" opacity=".5"/>
      <rect x="9" y="9" width="102" height="162" fill="none" stroke="var(--gold)" strokeWidth=".3" opacity=".3"/>
      {/* central glow */}
      <circle cx="60" cy="90" r="50" fill={`url(#glow-${seed})`}/>
      {/* silhouette variants */}
      <g transform={flip}>
        {variant === 0 && (
          // Sun/Star
          <g stroke="var(--gold)" strokeWidth="1" fill="none">
            <circle cx="60" cy="80" r="18" fill="var(--gold)" opacity=".6"/>
            {[...Array(12)].map((_,i)=>{
              const a = (i*30) * Math.PI/180;
              return <line key={i} x1={60+22*Math.cos(a)} y1={80+22*Math.sin(a)} x2={60+34*Math.cos(a)} y2={80+34*Math.sin(a)}/>;
            })}
          </g>
        )}
        {variant === 1 && (
          // Moon crescent
          <g>
            <circle cx="60" cy="85" r="28" fill="var(--gold)" opacity=".7"/>
            <circle cx="68" cy="82" r="26" fill="var(--bg-card)"/>
            <circle cx="50" cy="60" r="1.5" fill="var(--gold-soft)"/>
            <circle cx="80" cy="115" r="1" fill="var(--gold-soft)"/>
            <circle cx="40" cy="100" r="1" fill="var(--gold-soft)"/>
          </g>
        )}
        {variant === 2 && (
          // Tower
          <g stroke="var(--gold)" strokeWidth="1" fill="none">
            <path d="M50 120 L50 60 L70 60 L70 120 Z" fill="var(--gold)" opacity=".4"/>
            <path d="M48 60 L72 60 L66 50 L54 50 Z" fill="var(--gold)" opacity=".6"/>
            <line x1="60" y1="50" x2="60" y2="40"/>
            <circle cx="60" cy="38" r="2" fill="var(--gold)"/>
            <line x1="55" y1="75" x2="65" y2="75"/>
            <line x1="55" y1="90" x2="65" y2="90"/>
            <line x1="55" y1="105" x2="65" y2="105"/>
          </g>
        )}
        {variant === 3 && (
          // Figure / robed
          <g>
            <path d="M60 50 Q50 50 50 65 L45 130 L75 130 L70 65 Q70 50 60 50 Z" fill="var(--gold)" opacity=".5" stroke="var(--gold)" strokeWidth=".7"/>
            <circle cx="60" cy="55" r="6" fill="var(--gold)" opacity=".8"/>
            <path d="M55 65 Q60 70 65 65" fill="none" stroke="var(--bg-card)" strokeWidth=".7"/>
          </g>
        )}
        {variant === 4 && (
          // Wheel
          <g stroke="var(--gold)" strokeWidth="1" fill="none">
            <circle cx="60" cy="85" r="32"/>
            <circle cx="60" cy="85" r="20"/>
            <circle cx="60" cy="85" r="6" fill="var(--gold)" opacity=".7"/>
            {[0,45,90,135].map(a=>(
              <line key={a} x1={60+32*Math.cos(a*Math.PI/180)} y1={85+32*Math.sin(a*Math.PI/180)}
                    x2={60-32*Math.cos(a*Math.PI/180)} y2={85-32*Math.sin(a*Math.PI/180)}/>
            ))}
          </g>
        )}
        {variant === 5 && (
          // Cup / chalice
          <g>
            <path d="M45 65 L75 65 L72 95 Q60 105 48 95 Z" fill="var(--gold)" opacity=".55" stroke="var(--gold)" strokeWidth=".7"/>
            <rect x="56" y="105" width="8" height="14" fill="var(--gold)" opacity=".55"/>
            <ellipse cx="60" cy="120" rx="14" ry="3" fill="var(--gold)" opacity=".55"/>
            <path d="M55 70 Q60 75 65 70" fill="none" stroke="var(--bg-card)" strokeWidth=".7"/>
          </g>
        )}
      </g>
      {/* card name plate */}
      <rect x="10" y="148" width="100" height="22" fill="var(--bg-deep)" opacity=".85"/>
      <text x="60" y="162" textAnchor="middle" fill="var(--gold)" fontSize="9"
        fontFamily="Cormorant Garamond, serif" fontWeight="600" letterSpacing="1">
        {name.toUpperCase()}
      </text>
      {reversed && (
        <text x="60" y="20" textAnchor="middle" fill="var(--gold-soft)" fontSize="6" letterSpacing="2" opacity=".7">REVERSED</text>
      )}
      {/* corner ornaments */}
      <g fill="var(--gold)" opacity=".5">
        <circle cx="14" cy="14" r="1"/><circle cx="106" cy="14" r="1"/>
        <circle cx="14" cy="166" r="1"/><circle cx="106" cy="166" r="1"/>
      </g>
    </svg>
  );
}

// Card backs by style: ornate (default), geometric, occult
function CardBack({ style = 'ornate' }) {
  return (
    <svg viewBox="0 0 120 180" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <linearGradient id="cb-grad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="var(--bg-elev)"/>
          <stop offset=".5" stopColor="var(--bg-card)"/>
          <stop offset="1" stopColor="var(--bg-mid)"/>
        </linearGradient>
      </defs>
      <rect width="120" height="180" fill="url(#cb-grad)"/>
      <rect x="6" y="6" width="108" height="168" fill="none" stroke="var(--gold)" strokeWidth=".6" opacity=".6"/>
      {style === 'ornate' && (
        <g stroke="var(--gold)" strokeWidth=".6" fill="none" opacity=".75">
          <circle cx="60" cy="90" r="44"/>
          <circle cx="60" cy="90" r="30"/>
          <circle cx="60" cy="90" r="16"/>
          {[...Array(8)].map((_,i)=>{
            const a = (i*45)*Math.PI/180;
            return <line key={i} x1={60+16*Math.cos(a)} y1={90+16*Math.sin(a)} x2={60+44*Math.cos(a)} y2={90+44*Math.sin(a)}/>;
          })}
          <circle cx="60" cy="90" r="3" fill="var(--gold)"/>
        </g>
      )}
      {style === 'geometric' && (
        <g stroke="var(--gold)" strokeWidth=".7" fill="none" opacity=".75">
          {[...Array(6)].map((_,i)=>(
            <polygon key={i} points="60,50 78,80 78,100 60,130 42,100 42,80"
              transform={`rotate(${i*30} 60 90)`}/>
          ))}
          <circle cx="60" cy="90" r="4" fill="var(--gold)"/>
        </g>
      )}
      {style === 'occult' && (
        <g stroke="var(--gold)" strokeWidth=".7" fill="none" opacity=".75">
          <polygon points="60,55 92,115 28,115" />
          <polygon points="60,125 28,65 92,65" />
          <circle cx="60" cy="90" r="32"/>
          <circle cx="60" cy="90" r="2" fill="var(--gold)"/>
          {[0,72,144,216,288].map(a=>(
            <circle key={a} cx={60+30*Math.cos((a-90)*Math.PI/180)} cy={90+30*Math.sin((a-90)*Math.PI/180)} r="1.5" fill="var(--gold)"/>
          ))}
        </g>
      )}
      {/* corners */}
      <g fill="var(--gold)" opacity=".7">
        <circle cx="14" cy="14" r="1.5"/><circle cx="106" cy="14" r="1.5"/>
        <circle cx="14" cy="166" r="1.5"/><circle cx="106" cy="166" r="1.5"/>
      </g>
    </svg>
  );
}

function TarotCard({ card, faceUp, onClick, style = 'ornate', size = 'md', glow = false }) {
  const sizes = { sm: { w: 60, h: 90 }, md: { w: 100, h: 150 }, lg: { w: 200, h: 300 }, xl: { w: 240, h: 360 } };
  const { w, h } = sizes[size];
  return (
    <div className={`tarot-card ${faceUp ? 'flipped' : ''} ${glow ? 'glow-pulse' : ''}`}
      onClick={onClick} style={{ width: w, height: h, borderRadius: 12 }}>
      <div className="tarot-card-inner">
        <div className="tarot-card-face tarot-card-back">
          <CardBack style={style} />
        </div>
        <div className="tarot-card-face tarot-card-front">
          {card && <CardArt name={card.name} reversed={card.reversed} />}
        </div>
      </div>
    </div>
  );
}

window.TarotCard = TarotCard;
window.CardBack = CardBack;
window.CardArt = CardArt;
