// Shared visual atoms used across screens
const { Icon: AIcon } = window;

// Coin balance pill
function CoinPill({ balance, streak, onCoinClick }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <button onClick={onCoinClick} style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'var(--bg-card)', border: '1px solid var(--line)',
        padding: '6px 12px 6px 8px', borderRadius: 999,
      }}>
        <AIcon.coin size={18}/>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{balance}</span>
      </button>
      {streak !== undefined && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'var(--bg-card)', border: '1px solid var(--line)',
          padding: '6px 12px 6px 8px', borderRadius: 999,
        }}>
          <span style={{ fontSize: 14 }}>🔥</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{streak}</span>
        </div>
      )}
    </div>
  );
}

// Sub-screen header (back arrow + title + right slot)
function SubHeader({ title, onBack, right }) {
  return (
    <div style={{
      padding: '50px 16px 12px', display: 'flex',
      alignItems: 'center', gap: 12,
      background: 'var(--bg-deep)',
      borderBottom: '1px solid var(--line-soft)',
    }}>
      {onBack && (
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--ink)',
        }}>
          <AIcon.back size={22}/>
        </button>
      )}
      <div style={{ flex: 1, fontSize: 17, fontWeight: 600, color: 'var(--ink)' }}>{title}</div>
      {right}
    </div>
  );
}

// Bottom tab bar
function TabBar({ tab, setTab }) {
  const items = [
    { id: 'home',  label: 'Today',  icon: AIcon.home },
    { id: 'tarot', label: 'Tarot',  icon: AIcon.cards },
    { id: 'chat',  label: 'Chat',   icon: AIcon.chat },
    { id: 'diary', label: 'Diary',  icon: AIcon.diary },
    { id: 'you',   label: 'You',    icon: AIcon.user },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'color-mix(in srgb, var(--bg-deep) 92%, transparent)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--line-soft)',
      padding: '10px 8px 28px',
      display: 'flex', justifyContent: 'space-around',
      zIndex: 30,
    }}>
      {items.map(({ id, label, icon: Ic }) => {
        const active = tab === id;
        return (
          <button key={id} onClick={() => setTab(id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 4, padding: '4px 12px', position: 'relative',
            color: active ? 'var(--gold)' : 'var(--ink-dim)',
            transition: 'color .2s',
          }}>
            {active && (
              <div style={{
                position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                width: 24, height: 3, borderRadius: 2, background: 'var(--gold)',
              }}/>
            )}
            <Ic size={22}/>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.4 }}>{label.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
}

// Star background decoration
function StarBg({ withNebula = true }) {
  return (
    <>
      {withNebula && <div className="nebula" />}
      <div className="stars" />
    </>
  );
}

// Zodiac glyph rendered nicely
function ZodiacGlyph({ sign, size = 28, color = 'var(--gold)' }) {
  const Z = window.TaroData.ZODIAC.find(z => z.sign === sign) || window.TaroData.ZODIAC[0];
  return (
    <span className="serif" style={{ color, fontSize: size, lineHeight: 1, fontWeight: 400 }}>
      {Z.glyph}
    </span>
  );
}

// Section title with ornament
function Ornament({ children }) {
  return (
    <div className="serif" style={{
      display: 'flex', alignItems: 'center', gap: 12,
      color: 'var(--gold)', fontSize: 12, letterSpacing: '0.35em',
      textTransform: 'uppercase', fontWeight: 500,
      margin: '20px 0 12px',
    }}>
      <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, var(--line))' }}/>
      <span>{children}</span>
      <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, var(--line), transparent)' }}/>
    </div>
  );
}

// Coin fly animation — fires N coins from position to top-right corner
function CoinBurst({ from, count = 6, onDone }) {
  React.useEffect(() => {
    const t = setTimeout(() => onDone && onDone(), 1100);
    return () => clearTimeout(t);
  }, [onDone]);
  // target ~ top-right of phone (relative to from x/y)
  const targetX = 360, targetY = 76; // approx
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
      {[...Array(count)].map((_, i) => {
        const dx = targetX - from.x + (Math.random()*20 - 10);
        const dy = targetY - from.y + (Math.random()*20 - 10);
        return (
          <div key={i} style={{
            position: 'absolute',
            left: from.x, top: from.y,
            animation: `coinFly 1s ${i*0.05}s cubic-bezier(.4,.2,.2,1) forwards`,
            ['--dx']: `${dx}px`, ['--dy']: `${dy}px`,
          }}>
            <AIcon.coin size={24}/>
          </div>
        );
      })}
    </div>
  );
}

// Confetti burst (streak celebration)
function Confetti({ count = 40 }) {
  const colors = ['var(--gold)', 'var(--violet)', 'var(--rose)', 'var(--amber)', '#fff'];
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 100 }}>
      {[...Array(count)].map((_, i) => {
        const left = Math.random()*100;
        const dx = (Math.random()-0.5)*80;
        const delay = Math.random()*0.6;
        const dur = 1.4 + Math.random()*1;
        const c = colors[i % colors.length];
        const size = 6 + Math.random()*6;
        return (
          <div key={i} style={{
            position: 'absolute', top: '20%', left: `${left}%`,
            width: size, height: size*0.4, background: c, borderRadius: 1,
            animation: `confettiFall ${dur}s ${delay}s ease-out forwards`,
            ['--dx']: `${dx}px`,
          }}/>
        );
      })}
    </div>
  );
}

window.TaroAtoms = { CoinPill, SubHeader, TabBar, StarBg, ZodiacGlyph, Ornament, CoinBurst, Confetti };
