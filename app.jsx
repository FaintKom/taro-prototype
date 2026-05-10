// Main app shell — navigation, state, screens
const { useState, useEffect, useRef } = React;

const SCREENS_WITH_NAV = ['home','tarot','diary','altar','profile'];

function App() {
  const [tweaks, setTweaks] = useState(window.TWEAK_DEFAULTS);
  useEffect(() => {
    const onChange = (e) => setTweaks(prev => ({ ...prev, ...e.detail }));
    window.addEventListener('tweakchange', onChange);
    return () => window.removeEventListener('tweakchange', onChange);
  }, []);

  // Onboarding state
  const [onboarded, setOnboarded] = useState(true);
  const [user, setUser] = useState({ name: 'Maya', sun: 'aries', moon: 'cancer', rising: 'leo' });

  // Currency / streak
  const [balance, setBalance] = useState(50);
  const [streak, setStreak] = useState(4);
  const [checkedIn, setCheckedIn] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  // Diary
  const [entries, setEntries] = useState({
    '2026-05-04': { mood: 4, note: 'Felt clear-headed' },
    '2026-05-05': { mood: 3, note: '' },
    '2026-05-06': { mood: 5, note: 'Coffee with Jordan' },
    '2026-05-07': { mood: 2, note: 'Mercury squared something' },
    '2026-05-08': { mood: 4, note: '' },
  });

  // Navigation — stack model
  const [stack, setStack] = useState([{ name: 'home' }]);
  const top = stack[stack.length - 1];
  const goto = (s) => setStack(prev => {
    const next = typeof s === 'string' ? { name: s } : s;
    if (SCREENS_WITH_NAV.includes(next.name)) return [next]; // tab swap resets stack
    return [...prev, next];
  });
  const pop = () => setStack(prev => prev.length > 1 ? prev.slice(0, -1) : prev);

  // Modals
  const [streakModal, setStreakModal] = useState(false);
  const [notEnough, setNotEnough] = useState(null);
  const [adRunning, setAdRunning] = useState(false);

  // Card style + cosmetic
  const cardStyle = tweaks.cardStyle || 'ornate';

  // Apply tweaks → CSS variables
  useEffect(() => {
    const root = document.documentElement;
    if (tweaks.gold)  root.style.setProperty('--gold', tweaks.gold);
    if (tweaks.bgDeep) root.style.setProperty('--bg-deep', tweaks.bgDeep);
    if (tweaks.bgCard) root.style.setProperty('--bg-card', tweaks.bgCard);
    if (tweaks.fontScale) root.style.setProperty('--font-scale', tweaks.fontScale);
  }, [tweaks]);

  const checkIn = () => {
    setCheckedIn(true);
    const earned = (streak + 1) % 7 === 0 ? 10 : 2;
    setBalance(b => b + earned);
    setStreak(s => s + 1);
    setStreakModal({ streak: streak + 1, coins: earned });
  };

  const onAd = () => {
    setAdRunning(true);
    setTimeout(() => {
      setAdRunning(false);
      setBalance(b => b + 5);
      if (notEnough) setNotEnough(null);
    }, 1800);
  };

  const spendCoins = (n) => setBalance(b => Math.max(0, b - n));
  const openNotEnough = (needed) => setNotEnough({ needed });

  const onCompleteOnboarding = (data) => {
    setUser({ ...user, name: data.name });
    setOnboarded(true);
  };

  // Screen routing
  let screen;
  if (!onboarded) {
    screen = <window.TaroOnboarding.OnboardingFlow onComplete={onCompleteOnboarding}/>;
  } else if (top.name === 'home') {
    screen = <window.TaroHomeTarot.HomeScreen user={user} balance={balance} streak={streak} checkedIn={checkedIn}
      onCheckIn={checkIn} goto={goto} openShop={() => goto('shop')} cardStyle={cardStyle}/>;
  } else if (top.name === 'tarot') {
    screen = <window.TaroHomeTarot.TarotSpreadSelect goto={goto} balance={balance} openNotEnough={openNotEnough} cardStyle={cardStyle}/>;
  } else if (top.name === 'tarot-focus') {
    screen = <window.TaroHomeTarot.TarotFocus spread={top.spread}
      onShuffle={(q) => { spendCoins(top.spread.coins); goto({ name: 'tarot-shuffle', spread: top.spread, q }); }}
      onBack={pop}/>;
  } else if (top.name === 'tarot-shuffle') {
    screen = <window.TaroHomeTarot.TarotShuffle cardStyle={cardStyle}
      onDone={() => {
        const cards = window.TaroData.drawCards(top.spread.cards);
        setStack(prev => [...prev.slice(0, -1), { name: 'tarot-reveal', spread: top.spread, cards, q: top.q }]);
      }}/>;
  } else if (top.name === 'tarot-reveal') {
    screen = <window.TaroHomeTarot.TarotReveal spread={top.spread} cards={top.cards} cardStyle={cardStyle}
      user={user}
      onBack={() => setStack([{ name: 'tarot' }])}
      onNew={() => setStack([{ name: 'tarot' }])}/>;
  } else if (top.name === 'diary') {
    screen = <window.TaroChatDiary.DiaryScreen entries={entries} balance={balance}
      logMood={(k, m, n) => setEntries(e => ({ ...e, [k]: { mood: m, note: n } }))}/>;
  } else if (top.name === 'altar') {
    screen = <window.TaroAltar.AltarScreen user={user} balance={balance} goto={goto}/>;
  } else if (top.name === 'profile') {
    screen = <window.TaroProfile.ProfileScreen user={user} balance={balance} streak={streak} isPremium={isPremium}
      goto={goto} openShop={() => goto('shop')} openSettings={() => {}}/>;
  } else if (top.name === 'shop') {
    screen = <window.TaroProfile.ShopScreen balance={balance} onBack={pop} onAd={onAd} onBuy={(n) => setBalance(b => b + n)}/>;
  } else if (top.name === 'moon') {
    screen = <window.TaroProfile.MoonScreen onBack={pop}/>;
  } else if (top.name === 'compat') {
    screen = <window.TaroProfile.CompatScreen onBack={pop} user={user} balance={balance} openNotEnough={openNotEnough} spendCoins={spendCoins}/>;
  } else if (top.name === 'history') {
    screen = <window.TaroProfile.HistoryScreen onBack={pop}/>;
  } else if (top.name === 'natal') {
    screen = <window.TaroOnboarding.NatalScreen user={user} onBack={pop}/>;
  } else if (top.name === 'chat') {
    screen = <window.TaroChatDiary.ChatAvatarSelect onPick={(a) => goto({ name: 'chat-session', avatar: a })} onBack={pop} isPremium={isPremium}/>;
  } else if (top.name === 'chat-session') {
    screen = <window.TaroChatDiary.ChatSession avatar={top.avatar} balance={balance} onBack={pop}
      onAd={onAd} openNotEnough={openNotEnough} spendCoins={spendCoins}/>;
  } else {
    screen = <div style={{ padding: 60, color: '#fff' }}>Coming soon: {top.name}</div>;
  }

  const showNav = onboarded && SCREENS_WITH_NAV.includes(top.name);

  return (
    <>
      {screen}
      {showNav && <BottomNav active={top.name} goto={goto}/>}
      {streakModal && <window.TaroModals.StreakModal {...streakModal} onClose={() => setStreakModal(false)}/>}
      {notEnough && <window.TaroModals.NotEnoughSheet needed={notEnough.needed} balance={balance}
        onAd={onAd} onShop={() => { setNotEnough(null); goto('shop'); }} onClose={() => setNotEnough(null)}/>}
      {adRunning && <AdOverlay/>}
    </>
  );
}

function BottomNav({ active, goto }) {
  const I = window.Icon;
  const items = [
    { id: 'home', label: 'Today', icon: I.sun },
    { id: 'tarot', label: 'Tarot', icon: I.cards },
    { id: 'diary', label: 'Diary', icon: I.diary },
    { id: 'altar', label: 'Altar', icon: I.altar },
    { id: 'profile', label: 'You', icon: I.moon },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingBottom: 'max(env(safe-area-inset-bottom), 18px)',
      paddingTop: 8,
      background: 'color-mix(in srgb, var(--bg-deep) 88%, transparent)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--line-soft)',
      zIndex: 50,
    }}>
      <div style={{ display: 'flex' }}>
        {items.map(it => {
          const on = active === it.id;
          return (
            <button key={it.id} onClick={() => goto(it.id)} style={{
              flex: 1, padding: '8px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              color: on ? 'var(--gold)' : 'var(--ink-dim)',
            }}>
              <div style={{ transition: 'transform .2s', transform: on ? 'scale(1.1)' : 'scale(1)', display: 'flex' }}><it.icon size={22} sw={on ? 1.7 : 1.4}/></div>
              <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: on ? 600 : 400 }}>{it.label}</div>
              {on && <div style={{ position: 'absolute', top: 4, width: 4, height: 4, borderRadius: '50%', background: 'var(--gold)' }}/>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AdOverlay() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#000', zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
      <div className="serif" style={{ fontSize: 13, letterSpacing: '0.4em', color: 'var(--ink-dim)', marginBottom: 14 }}>SPONSORED · CAN'T SKIP · 0:23</div>
      <div style={{ width: 200, height: 110, borderRadius: 10, background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700 }}>
        Cosmic Coffee Co.
      </div>
      <div style={{ marginTop: 20, fontSize: 13, color: 'var(--ink-soft)' }}>+5 coins after this</div>
    </div>
  );
}

window.TaroApp = App;
