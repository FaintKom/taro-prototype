// 3D Sacred Space — isometric room with placeable mystic objects
const { Icon: AIcon } = window;
const { StarBg: AStarBg, SubHeader: ASubHeader, Ornament: AOrnament, CoinPill: ACoinPill } = window.TaroAtoms;

// ───── object catalog ─────
const ALTAR_ITEMS = [
  // crystals
  { id: 'amethyst', cat: 'crystal', name: 'Amethyst',  hint: 'clarity · calm' },
  { id: 'quartz',   cat: 'crystal', name: 'Quartz',    hint: 'amplify' },
  { id: 'selenite', cat: 'crystal', name: 'Selenite',  hint: 'cleanse' },
  { id: 'obsidian', cat: 'crystal', name: 'Obsidian',  hint: 'protect · ground' },
  // candles
  { id: 'candle-tall',  cat: 'candle', name: 'Tall taper',  hint: 'focus' },
  { id: 'candle-short', cat: 'candle', name: 'Pillar',      hint: 'warmth' },
  // incense
  { id: 'incense-sage',  cat: 'incense', name: 'Sage stick',  hint: 'cleanse' },
  { id: 'incense-palo',  cat: 'incense', name: 'Palo santo',  hint: 'open space' },
  // tarot stand
  { id: 'tarot-stand',  cat: 'tarot', name: 'Tarot stand',   hint: 'three cards' },
  // plants
  { id: 'lavender', cat: 'plant', name: 'Lavender',     hint: 'soothe' },
  { id: 'pampas',   cat: 'plant', name: 'Pampas',       hint: 'softness' },
  // orb
  { id: 'orb',      cat: 'orb', name: 'Crystal ball',   hint: 'see · scry' },
  // wall
  { id: 'moon-art',  cat: 'wall', name: 'Moon phase art',  hint: 'rhythm' },
  { id: 'star-map',  cat: 'wall', name: 'Star map',        hint: 'cosmos' },
];

const CATS = [
  { id: 'all',     label: 'All' },
  { id: 'crystal', label: 'Crystals' },
  { id: 'candle',  label: 'Candles' },
  { id: 'incense', label: 'Incense' },
  { id: 'tarot',   label: 'Tarot' },
  { id: 'plant',   label: 'Plants' },
  { id: 'orb',     label: 'Orb' },
  { id: 'wall',    label: 'Wall' },
];

// 8 placement zones — 4 floor (front), altar table (3 slots), 2 wall
const ZONES = [
  { id: 'wall-l', kind: 'wall',  x: -90, y: -120, z: -60, label: 'wall · left' },
  { id: 'wall-r', kind: 'wall',  x:  90, y: -120, z: -60, label: 'wall · right' },
  { id: 'altar-l',kind: 'altar', x: -55, y:  -10, z:  20, label: 'altar · left' },
  { id: 'altar-c',kind: 'altar', x:   0, y:  -15, z:  20, label: 'altar · center' },
  { id: 'altar-r',kind: 'altar', x:  55, y:  -10, z:  20, label: 'altar · right' },
  { id: 'floor-l',kind: 'floor', x:-110, y:  60, z: 110, label: 'floor · left' },
  { id: 'floor-r',kind: 'floor', x: 110, y:  60, z: 110, label: 'floor · right' },
  { id: 'floor-f',kind: 'floor', x:   0, y:  85, z: 160, label: 'floor · front' },
];

// ───── object renderers (CSS / SVG art) ─────
function ObjectArt({ id, scale = 1 }) {
  const s = (n) => `${n * scale}px`;
  switch (id) {
    case 'amethyst':
    case 'quartz':
    case 'selenite':
    case 'obsidian': {
      const grad = {
        amethyst: ['#9b6dd6', '#5a2c8a', '#c9a8e8'],
        quartz:   ['#f4f0e0', '#b8b0a0', '#fff8df'],
        selenite: ['#fefcf2', '#d8d2b8', '#fffce8'],
        obsidian: ['#1a1a26', '#000', '#3a3550'],
      }[id];
      return (
        <svg width={s(48)} height={s(72)} viewBox="0 0 48 72" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id={`g-${id}`} x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor={grad[2]}/>
              <stop offset=".5" stopColor={grad[0]}/>
              <stop offset="1" stopColor={grad[1]}/>
            </linearGradient>
          </defs>
          {/* shadow on floor */}
          <ellipse cx="24" cy="68" rx="14" ry="3" fill="rgba(0,0,0,.5)"/>
          {/* main crystal */}
          <polygon points="24,8 38,28 32,64 16,64 10,28" fill={`url(#g-${id})`} stroke={grad[1]} strokeWidth=".5"/>
          <polygon points="24,8 38,28 24,32 10,28" fill="rgba(255,255,255,.18)"/>
          <polygon points="24,32 32,64 24,60 16,64" fill="rgba(0,0,0,.25)"/>
          {/* mini cluster */}
          <polygon points="6,58 12,46 16,64 4,64" fill={`url(#g-${id})`} opacity=".85"/>
          <polygon points="36,60 42,50 44,64 34,64" fill={`url(#g-${id})`} opacity=".85"/>
          {/* highlight */}
          <polyline points="24,10 26,28 32,30" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth=".8"/>
        </svg>
      );
    }
    case 'candle-tall':
    case 'candle-short': {
      const tall = id === 'candle-tall';
      const h = tall ? 80 : 50;
      const w = tall ? 14 : 22;
      return (
        <svg width={s(w + 16)} height={s(h + 24)} viewBox={`0 0 ${w+16} ${h+24}`} style={{ overflow: 'visible' }}>
          <ellipse cx={(w+16)/2} cy={h+22} rx={w/2 + 2} ry="2.5" fill="rgba(0,0,0,.5)"/>
          {/* base/holder */}
          <rect x="2" y={h+12} width={w+12} height="6" rx="1" fill="#3a2a1a"/>
          <rect x="0" y={h+10} width={w+16} height="3" rx="1" fill="#5a4226"/>
          {/* candle body */}
          <rect x="8" y="18" width={w} height={h - 4} rx="1" fill="#f4ead2"/>
          <rect x="8" y="18" width={w/3} height={h - 4} fill="rgba(255,255,255,.35)"/>
          <rect x={8 + w*0.7} y="18" width={w*0.3} height={h - 4} fill="rgba(0,0,0,.12)"/>
          {/* drips */}
          <path d={`M 8 28 q ${w/2} 4 ${w} 0 v 8 q -${w/2} -2 -${w} 0 z`} fill="rgba(0,0,0,.06)"/>
          {/* wick */}
          <line x1={8 + w/2} y1="14" x2={8 + w/2} y2="20" stroke="#1a1a1a" strokeWidth="1"/>
          {/* flame — animated */}
          <g style={{ transformOrigin: `${8 + w/2}px 14px`, animation: 'flameFlicker 1.4s ease-in-out infinite' }}>
            <ellipse cx={8 + w/2} cy="9" rx="3" ry="6" fill="#ff9a3c"/>
            <ellipse cx={8 + w/2} cy="8" rx="1.6" ry="3.5" fill="#ffe28a"/>
            <ellipse cx={8 + w/2} cy="7.5" rx=".7" ry="1.8" fill="#fff"/>
          </g>
          {/* glow */}
          <circle cx={8 + w/2} cy="9" r="14" fill="#ffb35a" opacity=".18" style={{ filter: 'blur(4px)', animation: 'flameGlow 1.4s ease-in-out infinite' }}/>
        </svg>
      );
    }
    case 'incense-sage':
    case 'incense-palo': {
      const tied = id === 'incense-sage';
      return (
        <svg width={s(40)} height={s(76)} viewBox="0 0 40 76" style={{ overflow: 'visible' }}>
          <ellipse cx="20" cy="72" rx="10" ry="2" fill="rgba(0,0,0,.45)"/>
          {/* holder dish */}
          <ellipse cx="20" cy="68" rx="14" ry="3" fill="#4a3520"/>
          <ellipse cx="20" cy="66" rx="14" ry="3" fill="#6a4d2e"/>
          {/* stick */}
          {tied ? (
            <>
              <rect x="18" y="20" width="4" height="48" fill="#7a8a3a"/>
              <rect x="17" y="32" width="6" height="2" fill="#c9a76b"/>
              <rect x="17" y="44" width="6" height="2" fill="#c9a76b"/>
              <rect x="17" y="56" width="6" height="2" fill="#c9a76b"/>
              {/* leaves */}
              <ellipse cx="16" cy="26" rx="3" ry="6" fill="#8a9a4a" transform="rotate(-15 16 26)"/>
              <ellipse cx="24" cy="28" rx="3" ry="6" fill="#7a8a3a" transform="rotate(15 24 28)"/>
            </>
          ) : (
            <rect x="17" y="18" width="6" height="50" fill="#a87545" rx="1"/>
          )}
          {/* ember tip */}
          <circle cx="20" cy="18" r="2" fill="#ff7a2a"/>
          <circle cx="20" cy="18" r="1" fill="#ffd06a"/>
          {/* smoke */}
          <g style={{ animation: 'smokeRise 4s ease-out infinite' }}>
            <path d="M 20 16 q 3 -8 -2 -14 q -3 -6 4 -12 q 3 -4 -1 -10" fill="none" stroke="rgba(220,210,230,.4)" strokeWidth="3" strokeLinecap="round"/>
          </g>
          <g style={{ animation: 'smokeRise 4s ease-out infinite .8s' }}>
            <path d="M 20 16 q -3 -7 1 -13 q 3 -6 -2 -11" fill="none" stroke="rgba(220,210,230,.3)" strokeWidth="2" strokeLinecap="round"/>
          </g>
        </svg>
      );
    }
    case 'tarot-stand': {
      return (
        <svg width={s(64)} height={s(60)} viewBox="0 0 64 60" style={{ overflow: 'visible' }}>
          <ellipse cx="32" cy="56" rx="22" ry="3" fill="rgba(0,0,0,.5)"/>
          {/* stand */}
          <rect x="6" y="46" width="52" height="6" rx="1" fill="#5a4226"/>
          <rect x="6" y="44" width="52" height="3" fill="#7a5a36"/>
          {/* 3 cards leaning back */}
          {[-18, 0, 18].map((dx, i) => (
            <g key={i} transform={`translate(${32 + dx} 18) rotate(${(i-1)*4})`}>
              <rect x="-9" y="0" width="18" height="28" rx="1.5" fill="#1a1430" stroke="#d4af37" strokeWidth=".7"/>
              <text x="0" y="17" textAnchor="middle" fill="#d4af37" fontSize="10" fontFamily="serif">✦</text>
            </g>
          ))}
        </svg>
      );
    }
    case 'lavender': {
      return (
        <svg width={s(46)} height={s(72)} viewBox="0 0 46 72" style={{ overflow: 'visible' }}>
          <ellipse cx="23" cy="68" rx="14" ry="3" fill="rgba(0,0,0,.5)"/>
          {/* pot */}
          <path d="M 8 50 L 38 50 L 35 68 L 11 68 Z" fill="#8a6a3a"/>
          <rect x="6" y="48" width="34" height="4" rx="1" fill="#a8855a"/>
          {/* stems */}
          {[-10, -4, 2, 8].map((dx, i) => (
            <g key={i} transform={`translate(${23 + dx} 0)`}>
              <line x1="0" y1="50" x2={dx*0.3} y2="14" stroke="#5a7a3a" strokeWidth="1"/>
              {/* lavender heads */}
              {[14, 20, 26, 32, 38].map((y, j) => (
                <circle key={j} cx={dx*0.3 * (1 - y/50)} cy={y} r="2.5" fill="#a87fd6" opacity={.9 - j*0.1}/>
              ))}
            </g>
          ))}
        </svg>
      );
    }
    case 'pampas': {
      return (
        <svg width={s(50)} height={s(80)} viewBox="0 0 50 80" style={{ overflow: 'visible' }}>
          <ellipse cx="25" cy="76" rx="14" ry="3" fill="rgba(0,0,0,.5)"/>
          <path d="M 12 60 L 38 60 L 35 76 L 15 76 Z" fill="#6a5a3a"/>
          <rect x="10" y="58" width="30" height="4" rx="1" fill="#8a755a"/>
          {/* pampas plumes */}
          {[
            { x: 20, h: 50, lean: -8 },
            { x: 25, h: 56, lean: 0 },
            { x: 30, h: 48, lean: 8 },
          ].map((p, i) => (
            <g key={i} transform={`translate(${p.x} 60) rotate(${p.lean})`}>
              <line x1="0" y1="0" x2="0" y2={-p.h*0.6} stroke="#8a7a5a" strokeWidth="1"/>
              <ellipse cx="0" cy={-p.h + 4} rx="6" ry={p.h*0.45} fill="#e8d8b8" opacity=".9"/>
              <ellipse cx="0" cy={-p.h + 4} rx="3" ry={p.h*0.4} fill="#fff5e0" opacity=".6"/>
            </g>
          ))}
        </svg>
      );
    }
    case 'orb': {
      return (
        <svg width={s(48)} height={s(60)} viewBox="0 0 48 60" style={{ overflow: 'visible' }}>
          <defs>
            <radialGradient id="orb-grad" cx=".35" cy=".3" r=".7">
              <stop offset="0" stopColor="#fff"/>
              <stop offset=".3" stopColor="#d4c8e8"/>
              <stop offset=".8" stopColor="#5a3c8a"/>
              <stop offset="1" stopColor="#1a0c2a"/>
            </radialGradient>
          </defs>
          <ellipse cx="24" cy="56" rx="14" ry="2.5" fill="rgba(0,0,0,.5)"/>
          {/* base */}
          <path d="M 14 48 L 34 48 L 30 56 L 18 56 Z" fill="#3a2a1a"/>
          <ellipse cx="24" cy="48" rx="10" ry="2" fill="#5a4226"/>
          {/* orb */}
          <circle cx="24" cy="28" r="18" fill="url(#orb-grad)"/>
          <ellipse cx="18" cy="22" rx="5" ry="3" fill="rgba(255,255,255,.6)"/>
          <circle cx="24" cy="28" r="18" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth=".5"/>
        </svg>
      );
    }
    case 'moon-art': {
      return (
        <svg width={s(80)} height={s(50)} viewBox="0 0 80 50" style={{ overflow: 'visible' }}>
          <rect x="0" y="0" width="80" height="50" rx="2" fill="#1a1430" stroke="#d4af37" strokeWidth=".8"/>
          {[0,1,2,3,4,5,6,7].map(i => {
            const cx = 6 + i*9.5;
            return <g key={i}>
              <circle cx={cx} cy="25" r="3.5" fill="none" stroke="#d4af37" strokeWidth=".4" opacity=".5"/>
              {i === 0 && <circle cx={cx} cy="25" r="3" fill="#0a0618"/>}
              {i === 4 && <circle cx={cx} cy="25" r="3" fill="#f1dfa3"/>}
              {i > 0 && i < 4 && <path d={`M ${cx} 22 a 3 3 0 0 1 0 6 a ${i*0.9} 3 0 0 0 0 -6 z`} fill="#f1dfa3"/>}
              {i > 4 && <path d={`M ${cx} 22 a 3 3 0 0 0 0 6 a ${(8-i)*0.9} 3 0 0 1 0 -6 z`} fill="#f1dfa3"/>}
            </g>;
          })}
        </svg>
      );
    }
    case 'star-map': {
      return (
        <svg width={s(64)} height={s(64)} viewBox="0 0 64 64" style={{ overflow: 'visible' }}>
          <rect x="0" y="0" width="64" height="64" rx="2" fill="#0a0618" stroke="#d4af37" strokeWidth=".8"/>
          <circle cx="32" cy="32" r="22" fill="none" stroke="#d4af37" strokeWidth=".3" opacity=".4"/>
          <circle cx="32" cy="32" r="14" fill="none" stroke="#d4af37" strokeWidth=".3" opacity=".4"/>
          {/* constellation */}
          {[[20,18],[28,22],[36,20],[42,28],[40,38],[32,42],[24,38],[28,30]].map((p, i, arr) => (
            <g key={i}>
              <circle cx={p[0]} cy={p[1]} r="1" fill="#f1dfa3"/>
              {i > 0 && <line x1={arr[i-1][0]} y1={arr[i-1][1]} x2={p[0]} y2={p[1]} stroke="#d4af37" strokeWidth=".3" opacity=".5"/>}
            </g>
          ))}
          {/* dust stars */}
          {[[10,12],[54,16],[12,52],[52,48],[8,32],[56,32]].map((p, i) => (
            <circle key={i} cx={p[0]} cy={p[1]} r=".5" fill="#fff" opacity=".7"/>
          ))}
        </svg>
      );
    }
    default: return null;
  }
}

// ───── isometric room ─────
function IsoRoom({ vibe, placements, selectedZone, onZoneTap }) {
  const palette = {
    mystic: {
      wallL: '#1f1844', wallR: '#15102e', floor: '#0a0618', accent: '#d4af37',
      floorHi: '#18143a', wallLHi: '#2a2060', ambientR: 'rgba(212,175,55,.06)', ambientL: 'rgba(160,120,220,.04)',
    },
    boho: {
      wallL: '#3a2a1c', wallR: '#2a1d12', floor: '#1c1208', accent: '#e8c98a',
      floorHi: '#2a1e12', wallLHi: '#4a3824', ambientR: 'rgba(232,201,138,.06)', ambientL: 'rgba(180,140,80,.04)',
    },
    cosmic: {
      wallL: '#0a0c2e', wallR: '#050722', floor: '#020414', accent: '#9b7de0',
      floorHi: '#0c0e30', wallLHi: '#12164a', ambientR: 'rgba(155,125,224,.06)', ambientL: 'rgba(100,80,200,.04)',
    },
  }[vibe];

  const sortedZones = [...ZONES].sort((a, b) => {
    const depthA = a.kind === 'wall' ? -200 : (a.y + a.z);
    const depthB = b.kind === 'wall' ? -200 : (b.y + b.z);
    return depthA - depthB;
  });

  return (
    <div style={{
      position: 'relative', width: 320, height: 400, margin: '0 auto',
      perspective: 800, perspectiveOrigin: '50% 32%',
    }}>
      {/* room container */}
      <div style={{
        position: 'absolute', left: '50%', top: '48%',
        transformStyle: 'preserve-3d',
        transform: 'translate(-50%, -50%) rotateX(52deg) rotateZ(-45deg)',
        width: 280, height: 280,
      }}>
        {/* floor */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse 80% 60% at 30% 30%, ${palette.floorHi}, transparent 70%),
            linear-gradient(135deg, ${palette.floor}, ${palette.wallR})
          `,
          boxShadow: `inset 0 0 100px rgba(0,0,0,.7)`,
        }}>
          {/* tile grid */}
          <div style={{ position: 'absolute', inset: 0,
            backgroundImage: `
              linear-gradient(${palette.accent}18 1px, transparent 1px),
              linear-gradient(90deg, ${palette.accent}18 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px', opacity: .35,
          }}/>
          {/* floor reflection / wet-look sheen */}
          <div style={{ position: 'absolute', inset: 0,
            background: `linear-gradient(135deg, rgba(255,255,255,.03) 0%, transparent 40%, transparent 60%, rgba(255,255,255,.015) 100%)`,
          }}/>
          {/* central rune */}
          <svg width="130" height="130" viewBox="0 0 100 100" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', opacity: .45 }}>
            <circle cx="50" cy="50" r="42" fill="none" stroke={palette.accent} strokeWidth=".4"/>
            <circle cx="50" cy="50" r="32" fill="none" stroke={palette.accent} strokeWidth=".3" strokeDasharray="2 4"/>
            <circle cx="50" cy="50" r="22" fill="none" stroke={palette.accent} strokeWidth=".2" strokeDasharray="1 3"/>
            <polygon points="50,12 82,72 18,72" fill="none" stroke={palette.accent} strokeWidth=".5"/>
            <polygon points="50,88 18,28 82,28" fill="none" stroke={palette.accent} strokeWidth=".4" opacity=".5"/>
            <text x="50" y="55" textAnchor="middle" fill={palette.accent} fontSize="10" fontFamily="serif" opacity=".8">✦</text>
          </svg>
        </div>

        {/* left wall */}
        <div style={{
          position: 'absolute', left: 0, top: 0, width: 280, height: 220,
          background: `
            linear-gradient(180deg, ${palette.wallLHi} 0%, ${palette.wallL} 30%, color-mix(in srgb, ${palette.wallL} 50%, #000) 100%)
          `,
          transform: 'rotateX(-90deg)', transformOrigin: 'top',
        }}>
          {/* light gradient from top-left */}
          <div style={{ position: 'absolute', inset: 0,
            background: `radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,255,255,.06), transparent 60%)`,
          }}/>
          {/* moulding lines */}
          <div style={{ position: 'absolute', top: 12, left: 10, right: 10, height: 1, background: palette.accent, opacity: .25 }}/>
          <div style={{ position: 'absolute', top: 15, left: 10, right: 10, height: 1, background: palette.accent, opacity: .12 }}/>
          {/* ambient occlusion at floor junction */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 40,
            background: 'linear-gradient(0deg, rgba(0,0,0,.5) 0%, transparent 100%)',
          }}/>
        </div>

        {/* right wall */}
        <div style={{
          position: 'absolute', left: 0, top: 0, width: 280, height: 220,
          background: `
            linear-gradient(180deg, ${palette.wallR} 0%, color-mix(in srgb, ${palette.wallR} 45%, #000) 100%)
          `,
          transform: 'rotateY(90deg) rotateX(-90deg)', transformOrigin: 'top left',
        }}>
          <div style={{ position: 'absolute', top: 12, left: 10, right: 10, height: 1, background: palette.accent, opacity: .2 }}/>
          <div style={{ position: 'absolute', top: 15, left: 10, right: 10, height: 1, background: palette.accent, opacity: .08 }}/>
          {/* ambient occlusion at floor junction */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 40,
            background: 'linear-gradient(0deg, rgba(0,0,0,.5) 0%, transparent 100%)',
          }}/>
        </div>

        {/* corner shadow where walls meet */}
        <div style={{
          position: 'absolute', left: -2, top: -2, width: 8, height: 8,
          background: 'radial-gradient(circle, rgba(0,0,0,.4), transparent)',
          transform: 'translateZ(1px)',
        }}/>

        {/* altar table */}
        <div style={{
          position: 'absolute', left: 65, top: 65, width: 150, height: 100,
          transformStyle: 'preserve-3d',
          transform: 'translateZ(38px)',
        }}>
          {/* table shadow on floor */}
          <div style={{
            position: 'absolute', left: 10, right: 10, bottom: -42, height: 20,
            background: 'radial-gradient(ellipse, rgba(0,0,0,.6) 0%, rgba(0,0,0,.2) 40%, transparent 70%)',
            transform: 'translateZ(-38px)',
            filter: 'blur(4px)',
          }}/>
          {/* table front face (visible edge) */}
          <div style={{
            position: 'absolute', left: 0, top: 0, width: 150, height: 8,
            background: `linear-gradient(180deg, #6a4d2e, #3a2a1a)`,
            transform: 'rotateX(-90deg)', transformOrigin: 'top',
          }}/>
          {/* table right face */}
          <div style={{
            position: 'absolute', right: 0, top: 0, width: 8, height: 100,
            background: `linear-gradient(90deg, #5a4226, #2a1a10)`,
            transform: 'rotateY(90deg)', transformOrigin: 'right',
          }}/>
          {/* table top */}
          <div style={{ position: 'absolute', inset: 0,
            background: `linear-gradient(135deg, #6a4d2e, #4a3520)`,
            boxShadow: 'inset 0 0 30px rgba(0,0,0,.4), inset 0 -2px 4px rgba(0,0,0,.3)',
            borderRadius: 2,
          }}>
            <div style={{ position: 'absolute', inset: 5, border: `1px solid ${palette.accent}`, opacity: .35, borderRadius: 2 }}/>
            <div style={{ position: 'absolute', inset: 8, border: `1px solid ${palette.accent}`, opacity: .15, borderRadius: 1 }}/>
          </div>
          {/* legs — all four corners */}
          {[[6, 6], [6, 88], [144, 6], [144, 88]].map(([lx, ly], i) => (
            <div key={i} style={{
              position: 'absolute', left: lx, top: ly, width: 5, height: 36,
              background: `linear-gradient(90deg, #4a3520, #2a1a10)`,
              transform: 'rotateX(-90deg)', transformOrigin: 'top',
            }}/>
          ))}
        </div>
      </div>

      {/* — object overlay with depth sorting — */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {sortedZones.map(z => {
          const item = placements[z.id];
          const sx = 160 + z.x;
          const sy = 190 + z.y + z.z * 0.22;
          const depthFactor = 1 - (z.z - 20) * 0.001;
          const objScale = z.kind === 'wall' ? 0.85 : (z.kind === 'altar' ? 1.0 : depthFactor);
          const isCandle = item?.startsWith('candle');
          const isIncense = item?.startsWith('incense');
          const shadowSkewX = z.kind === 'floor' ? 15 : 8;
          const shadowOpacity = z.kind === 'floor' ? 0.55 : 0.35;

          return (
            <div key={z.id} style={{
              position: 'absolute', left: sx, top: sy,
              transform: `translate(-50%, -100%) scale(${objScale})`,
              transformOrigin: 'bottom center',
              pointerEvents: 'auto',
              zIndex: z.kind === 'wall' ? 1 : Math.round(sy),
            }}>
              {/* ground contact shadow */}
              {item && z.kind !== 'wall' && (
                <div style={{
                  position: 'absolute', bottom: -2, left: '50%',
                  width: 50, height: 12,
                  transform: `translate(-50%, 0) skewX(${shadowSkewX}deg)`,
                  background: `radial-gradient(ellipse 100% 100%, rgba(0,0,0,${shadowOpacity}), transparent 70%)`,
                  filter: 'blur(3px)',
                  pointerEvents: 'none',
                }}/>
              )}
              {/* tap target */}
              <button onClick={() => onZoneTap(z)} style={{
                position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
                width: item ? 65 : 44, height: item ? 85 : 32,
                borderRadius: z.kind === 'wall' ? 4 : '50%',
                border: selectedZone?.id === z.id ? `2px dashed ${palette.accent}` : '1px dashed transparent',
                background: item ? 'transparent' : `${palette.accent}15`,
                animation: item ? 'none' : 'zonePulse 2.4s ease-in-out infinite',
                cursor: 'pointer',
                zIndex: 10,
              }}/>
              {/* placed object */}
              {item && (
                <div className="fade-up" style={{
                  position: 'relative',
                  filter: `drop-shadow(2px 8px 6px rgba(0,0,0,.55))`,
                }}>
                  <ObjectArt id={item} scale={z.kind === 'wall' ? 0.85 : 1}/>
                  {/* candle warm glow on surrounding surfaces */}
                  {isCandle && (
                    <div style={{
                      position: 'absolute', left: '50%', top: '30%',
                      width: 80, height: 80, transform: 'translate(-50%, -50%)',
                      background: 'radial-gradient(circle, rgba(255,179,90,.2), transparent 60%)',
                      pointerEvents: 'none', mixBlendMode: 'screen',
                      animation: 'flameGlow 1.4s ease-in-out infinite',
                    }}/>
                  )}
                  {/* incense smoke ambient */}
                  {isIncense && (
                    <div style={{
                      position: 'absolute', left: '50%', top: 0,
                      width: 40, height: 40, transform: 'translate(-50%, -60%)',
                      background: 'radial-gradient(circle, rgba(200,190,220,.08), transparent 60%)',
                      pointerEvents: 'none',
                    }}/>
                  )}
                </div>
              )}
              {!item && <div style={{
                position: 'absolute', left: '50%', top: '100%', transform: 'translate(-50%, 4px)',
                fontSize: 9, color: palette.accent, opacity: .5,
                fontFamily: 'var(--sans)', letterSpacing: '0.15em', textTransform: 'uppercase',
                whiteSpace: 'nowrap', pointerEvents: 'none',
              }}>+</div>}
            </div>
          );
        })}
      </div>

      {/* ambient lighting effects */}
      {Object.values(placements).some(id => id?.startsWith('candle')) && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `
            radial-gradient(ellipse 50% 35% at 50% 55%, rgba(255,179,90,.12), transparent 65%),
            radial-gradient(ellipse 70% 50% at 50% 65%, rgba(255,140,50,.06), transparent 80%)
          `,
          mixBlendMode: 'screen',
        }}/>
      )}
      {/* vignette for depth */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 65% 55% at 50% 45%, transparent 40%, rgba(0,0,0,.4) 100%)',
      }}/>
    </div>
  );
}

// ───── inventory picker ─────
function ItemPicker({ zone, onPick, onClose, vibe }) {
  const [cat, setCat] = React.useState('all');
  // filter by zone kind compatibility
  const compat = (i) => {
    if (zone.kind === 'wall') return i.cat === 'wall';
    if (zone.kind === 'altar') return ['crystal','candle','incense','tarot','orb'].includes(i.cat);
    return ['crystal','candle','plant','incense'].includes(i.cat);
  };
  const items = ALTAR_ITEMS.filter(i => compat(i) && (cat === 'all' || i.cat === cat));

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(7,6,26,.7)', zIndex: 100,
      display: 'flex', alignItems: 'flex-end',
    }}>
      <div onClick={e => e.stopPropagation()} className="sheet" style={{
        width: '100%', background: 'var(--bg-card)', borderTopLeftRadius: 24, borderTopRightRadius: 24,
        borderTop: '1px solid var(--gold)', padding: '20px 16px 28px',
      }}>
        <div style={{ width: 36, height: 4, background: 'var(--line)', borderRadius: 2, margin: '0 auto 14px' }}/>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div className="display" style={{ fontSize: 9, color: 'var(--gold)' }}>Place on</div>
            <div className="serif" style={{ fontSize: 20, color: 'var(--ink)', fontWeight: 500 }}>{zone.label}</div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--ink-soft)' }}><AIcon.close size={20}/></button>
        </div>

        {/* category chips */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 10 }} className="no-scroll">
          {CATS.filter(c => c.id === 'all' || items.some(i => i.cat === c.id) || ALTAR_ITEMS.some(i => i.cat === c.id && (zone.kind === 'wall' ? c.id === 'wall' : c.id !== 'wall'))).map(c => (
            <button key={c.id} onClick={() => setCat(c.id)} style={{
              flexShrink: 0, padding: '6px 12px', borderRadius: 999,
              background: cat === c.id ? 'color-mix(in srgb, var(--gold) 18%, var(--bg-elev))' : 'var(--bg-elev)',
              border: `1px solid ${cat === c.id ? 'var(--gold)' : 'var(--line-soft)'}`,
              color: cat === c.id ? 'var(--gold)' : 'var(--ink-soft)',
              fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500,
            }}>{c.label}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 10, maxHeight: 320, overflowY: 'auto' }} className="no-scroll">
          {items.map(it => (
            <button key={it.id} onClick={() => onPick(it.id)} className="card" style={{
              padding: '12px 8px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              transition: 'transform .15s, border-color .2s',
            }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(.96)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>
              <div style={{ height: 64, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                <ObjectArt id={it.id} scale={0.7}/>
              </div>
              <div className="serif" style={{ fontSize: 12, color: 'var(--ink)', fontWeight: 500, textAlign: 'center', lineHeight: 1.1 }}>{it.name}</div>
              <div style={{ fontSize: 9, color: 'var(--ink-dim)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{it.hint}</div>
            </button>
          ))}
          {/* remove option */}
          <button onClick={() => onPick(null)} className="card" style={{
            padding: '12px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            borderStyle: 'dashed', opacity: .7,
          }}>
            <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-dim)' }}>
              <AIcon.close size={28}/>
            </div>
            <div className="serif" style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Empty</div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ───── main screen ─────
function AltarScreen({ balance }) {
  const VIBES = [
    { id: 'mystic', label: 'Mystic Niche',  hint: 'velvet · shadow' },
    { id: 'boho',   label: 'Boho Corner',   hint: 'warm · grounded' },
    { id: 'cosmic', label: 'Cosmic Deck',   hint: 'star · drift' },
  ];
  const [vibe, setVibe] = React.useState(() => localStorage.getItem('taro-altar-vibe') || 'mystic');
  const [placements, setPlacements] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('taro-altar') || '{}'); }
    catch { return {}; }
  });
  const [picking, setPicking] = React.useState(null);

  React.useEffect(() => { localStorage.setItem('taro-altar', JSON.stringify(placements)); }, [placements]);
  React.useEffect(() => { localStorage.setItem('taro-altar-vibe', vibe); }, [vibe]);

  // seed if empty
  React.useEffect(() => {
    if (Object.keys(placements).length === 0) {
      setPlacements({
        'altar-c': 'amethyst',
        'altar-l': 'candle-tall',
        'altar-r': 'incense-sage',
        'wall-l': 'moon-art',
      });
    }
  }, []);

  const placedCount = Object.values(placements).filter(Boolean).length;

  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingBottom: 120 }} className="no-scroll">
      <AStarBg withNebula={true}/>
      <div style={{ position: 'relative', padding: '50px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <div className="display" style={{ fontSize: 10, color: 'var(--gold)' }}>Sacred Space</div>
            <div className="serif foil-text" style={{ fontSize: 30, fontWeight: 500, marginTop: 2, lineHeight: 1.1 }}>
              Your altar
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 4 }}>{placedCount} of {ZONES.length} places set</div>
          </div>
          <ACoinPill balance={balance}/>
        </div>

        {/* vibe selector */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {VIBES.map(v => (
            <button key={v.id} onClick={() => setVibe(v.id)} style={{
              flex: 1, padding: '10px 6px', borderRadius: 12,
              background: vibe === v.id ? 'color-mix(in srgb, var(--gold) 14%, var(--bg-card))' : 'var(--bg-card)',
              border: `1px solid ${vibe === v.id ? 'var(--gold)' : 'var(--line-soft)'}`,
              textAlign: 'center',
            }}>
              <div className="serif" style={{ fontSize: 13, color: vibe === v.id ? 'var(--gold)' : 'var(--ink)', fontWeight: 500 }}>{v.label}</div>
              <div style={{ fontSize: 10, color: 'var(--ink-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>{v.hint}</div>
            </button>
          ))}
        </div>

        {/* the room */}
        <div style={{
          position: 'relative', borderRadius: 22, overflow: 'hidden',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,.04), transparent 70%), var(--bg-deep)',
          border: '1px solid var(--line)',
          boxShadow: 'var(--shadow-deep)',
          padding: '20px 0 8px',
        }}>
          <IsoRoom vibe={vibe} placements={placements} selectedZone={picking}
            onZoneTap={(z) => setPicking(z)}/>
          <div style={{ textAlign: 'center', fontSize: 10, color: 'var(--ink-dim)', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: 4 }}>
            tap a glowing spot to place
          </div>
        </div>

        {/* meaning ribbon */}
        <AOrnament>What you've gathered</AOrnament>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Object.entries(placements).filter(([_, id]) => id).map(([zid, id]) => {
            const item = ALTAR_ITEMS.find(x => x.id === id);
            const zone = ZONES.find(z => z.id === zid);
            if (!item) return null;
            return (
              <div key={zid} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12 }}>
                <div style={{ width: 44, height: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', flexShrink: 0 }}>
                  <ObjectArt id={id} scale={0.55}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="serif" style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>{item.hint} · <span style={{ color: 'var(--ink-dim)' }}>{zone.label}</span></div>
                </div>
                <button onClick={() => setPlacements(p => ({ ...p, [zid]: null }))} style={{ color: 'var(--ink-dim)' }}><AIcon.close size={16}/></button>
              </div>
            );
          })}
          {placedCount === 0 && (
            <div style={{ textAlign: 'center', padding: 20, color: 'var(--ink-dim)', fontSize: 13 }}>
              The space is empty. Tap a glowing spot above to begin.
            </div>
          )}
        </div>

        <button onClick={() => setPlacements({})} className="btn-ghost" style={{ width: '100%', marginTop: 16 }}>
          Clear the altar
        </button>
      </div>

      {picking && (
        <ItemPicker zone={picking} vibe={vibe}
          onPick={(id) => { setPlacements(p => ({ ...p, [picking.id]: id })); setPicking(null); }}
          onClose={() => setPicking(null)}/>
      )}
    </div>
  );
}

window.TaroAltar = { AltarScreen };
