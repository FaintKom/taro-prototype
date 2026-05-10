// Modals
const { Icon: MIcon } = window;

function StreakModal({ streak, coins, onClose }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(10, 6, 26, .85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 100,
      backdropFilter: 'blur(8px)',
    }} onClick={onClose}>
      <div className="fade-up" onClick={e => e.stopPropagation()} style={{
        background: 'linear-gradient(180deg, color-mix(in srgb, var(--gold) 18%, var(--bg-card)), var(--bg-card))',
        border: '1px solid var(--gold)',
        borderRadius: 22, padding: '32px 24px', textAlign: 'center', width: '100%', maxWidth: 320,
        boxShadow: '0 22px 60px rgba(0,0,0,.6)',
      }}>
        <div style={{ marginBottom: 12, color: 'var(--gold)', display: 'flex', justifyContent: 'center' }}><MIcon.flame size={56}/></div>
        <div className="serif" style={{ fontSize: 26, color: 'var(--ink)', fontWeight: 500 }}>Day {streak} streak!</div>
        <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 8, lineHeight: 1.5 }}>
          The stars reward your devotion. {7 - (streak % 7)} days until your next bonus.
        </div>
        <div style={{ marginTop: 20, padding: 16, background: 'var(--bg-deep)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>Coins earned</span>
          <span className="serif" style={{ fontSize: 22, color: 'var(--gold)', fontWeight: 600 }}>+{coins}</span>
          <MIcon.coin size={20}/>
        </div>
        <button className="btn-primary" onClick={onClose} style={{ width: '100%', marginTop: 18 }}>Beautiful</button>
      </div>
    </div>
  );
}

function NotEnoughSheet({ needed, balance, onAd, onShop, onClose }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(10,6,26,.7)', zIndex: 100,
      display: 'flex', alignItems: 'flex-end',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="slide-up" style={{
        width: '100%', background: 'var(--bg-card)', borderTopLeftRadius: 24, borderTopRightRadius: 24,
        borderTop: '1px solid var(--gold)', padding: '24px 20px 36px',
      }}>
        <div style={{ width: 36, height: 4, background: 'var(--line)', borderRadius: 2, margin: '0 auto 18px' }}/>
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div className="serif" style={{ fontSize: 22, color: 'var(--ink)', fontWeight: 500 }}>Not enough coins</div>
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 6 }}>
            You need <b style={{ color: 'var(--gold)' }}>{needed}</b>; you have <b>{balance}</b>.
          </div>
        </div>
        <button onClick={onAd} className="card" style={{
          width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10,
          background: 'linear-gradient(135deg, color-mix(in srgb, var(--gold) 16%, var(--bg-elev)), var(--bg-elev))',
          border: '1px solid var(--gold)',
        }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--gold)', color: '#1a1530', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MIcon.ad size={20}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 600 }}>Watch a video</div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>30 seconds · free</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--gold)', fontWeight: 700 }}>+5 <MIcon.coin size={16}/></div>
        </button>
        <button onClick={onShop} className="card" style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-elev)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}><MIcon.shop size={20}/></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 600 }}>Visit the shop</div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Packs from $0.99</div>
          </div>
          <MIcon.back size={18} style={{ transform: 'rotate(180deg)', color: 'var(--ink-dim)' }}/>
        </button>
        <button onClick={onClose} style={{ width: '100%', marginTop: 14, padding: 12, color: 'var(--ink-soft)', fontSize: 13 }}>Maybe later</button>
      </div>
    </div>
  );
}

function CoinFlyAnim({ from, to, onDone }) {
  React.useEffect(() => {
    const t = setTimeout(onDone, 900);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 90 }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute', left: from.x, top: from.y,
          animation: `coinFly 0.9s ${i*0.05}s cubic-bezier(.4,0,.2,1) forwards`,
          '--toX': `${to.x - from.x}px`, '--toY': `${to.y - from.y}px`,
          color: 'var(--gold)',
        }}><MIcon.coin size={20}/></div>
      ))}
    </div>
  );
}

window.TaroModals = { StreakModal, NotEnoughSheet, CoinFlyAnim };
