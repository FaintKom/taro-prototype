// Profile, Shop, Moon, Compatibility, History
const { Icon: PIcon } = window;
const { StarBg: PStarBg, SubHeader: PSubHeader, Ornament: POrnament, ZodiacGlyph: PZG } = window.TaroAtoms;

function ProfileScreen({ user, balance, streak, isPremium, goto, openShop, openSettings }) {
  const { ZODIAC, cap } = window.TaroData;
  const sun = ZODIAC.find(z => z.sign === user.sun);
  const moon = ZODIAC.find(z => z.sign === user.moon);
  const rising = ZODIAC.find(z => z.sign === user.rising);

  const items = [
    { Icon: PIcon.sparkle, label: 'My Natal Chart', sub: 'Full chart, free forever', go: 'natal' },
    { Icon: PIcon.heart, label: 'Compatibility', sub: 'Compare with someone', go: 'compat' },
    { Icon: PIcon.moon, label: 'Moon Calendar', sub: 'Phases & favorable days', go: 'moon' },
    { Icon: PIcon.history, label: 'Reading History', sub: '12 readings saved', go: 'history' },
    { Icon: PIcon.shop, label: 'Coin Shop', sub: 'Earn or buy coins', go: 'shop' },
    { Icon: PIcon.starFill, label: isPremium ? 'Premium · Active' : 'Premium', sub: isPremium ? 'Until Aug 12' : '$4.99 / mo · No ads', go: 'premium' },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingBottom: 100 }} className="no-scroll">
      <PStarBg/>
      <div style={{ position: 'relative', padding: '46px 16px 0' }}>
        {/* avatar header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'radial-gradient(circle, var(--gold), var(--bg-elev))',
            border: '2px solid var(--gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontFamily: 'var(--serif)', fontWeight: 600, color: '#1a1530',
          }}>{user.name[0]}</div>
          <div style={{ flex: 1 }}>
            <div className="serif" style={{ fontSize: 22, color: 'var(--ink)', fontWeight: 500 }}>{user.name}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>Member since May 2026</div>
          </div>
          <button onClick={openSettings} style={{ color: 'var(--ink-soft)' }}><PIcon.settings size={22}/></button>
        </div>

        {/* big sign tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <BigSignTile label="Sun" sign={sun} symbol="☀"/>
          <BigSignTile label="Moon" sign={moon} symbol="☾"/>
          <BigSignTile label="Rising" sign={rising} symbol="↑"/>
        </div>

        {/* stat ribbon */}
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <StatPill icon={<PIcon.coin size={18}/>} value={balance} label="coins" onClick={openShop}/>
          <StatPill icon={<PIcon.flame size={18}/>} value={streak} label="day streak"/>
          <StatPill icon={<PIcon.starFill size={16}/>} value={isPremium ? 'PRO' : 'Free'} label="tier"/>
        </div>

        <POrnament>Your space</POrnament>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {items.map((it, i) => (
            <button key={it.go} onClick={() => goto(it.go)} style={{
              width: '100%', padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 14,
              borderBottom: i < items.length - 1 ? '1px solid var(--line-soft)' : 'none',
              textAlign: 'left',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'var(--bg-elev)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--gold)',
              }}><it.Icon size={18}/></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, color: 'var(--ink)', fontWeight: 500 }}>{it.label}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>{it.sub}</div>
              </div>
              <PIcon.back size={18} style={{ transform: 'rotate(180deg)', color: 'var(--ink-dim)' }}/>
            </button>
          ))}
        </div>

        <POrnament>Streak rewards</POrnament>
        <div className="card" style={{ padding: 16 }}>
          <StreakTrack current={streak}/>
        </div>
        <div style={{ height: 16 }}/>
      </div>
    </div>
  );
}

function BigSignTile({ label, sign, symbol }) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 14,
      padding: '14px 8px', textAlign: 'center',
    }}>
      <div className="serif" style={{ fontSize: 26, color: 'var(--gold)', lineHeight: 1 }}>{sign.glyph}</div>
      <div style={{ fontSize: 9, color: 'var(--ink-dim)', textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: 8 }}>
        {symbol} {label}
      </div>
      <div className="serif" style={{ fontSize: 14, color: 'var(--ink)', marginTop: 4, fontWeight: 500 }}>
        {sign.sign[0].toUpperCase() + sign.sign.slice(1)}
      </div>
    </div>
  );
}

function StatPill({ icon, value, label, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 12,
      padding: '10px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    }}>
      <div style={{ fontSize: 18 }}>{icon}</div>
      <div className="serif" style={{ fontSize: 18, color: 'var(--ink)', fontWeight: 500, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 9, color: 'var(--ink-dim)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{label}</div>
    </button>
  );
}

function StreakTrack({ current }) {
  const milestones = [7, 30, 100, 365];
  const next = milestones.find(m => m > current) || 365;
  const prev = milestones.filter(m => m <= current).pop() || 0;
  const pct = ((current - prev) / (next - prev)) * 100;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <div className="serif" style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 500 }}>Day {current}</div>
        <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Next reward at {next}</div>
      </div>
      <div style={{ height: 8, background: 'var(--bg-elev)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--amber), var(--gold))', borderRadius: 4 }}/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
        {milestones.map(m => (
          <div key={m} style={{ textAlign: 'center', flex: 1 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', margin: '0 auto',
              border: `1.5px solid ${current >= m ? 'var(--gold)' : 'var(--line)'}`,
              background: current >= m ? 'var(--gold)' : 'var(--bg-elev)',
              color: current >= m ? '#1a1530' : 'var(--ink-dim)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700,
            }}>{m}</div>
            <div style={{ fontSize: 9, color: 'var(--ink-dim)', marginTop: 4 }}>{m === 7 ? 'Spark' : m === 30 ? 'Glow' : m === 100 ? 'Stargazer' : 'Master'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ───── Shop ─────
function ShopScreen({ balance, onBack, onAd, onBuy }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-deep)', overflowY: 'auto', paddingBottom: 100 }} className="no-scroll">
      <PStarBg/>
      <PSubHeader title="Coin Shop" onBack={onBack}/>
      <div style={{ position: 'relative', padding: '20px 16px' }}>
        <div className="card" style={{
          background: 'linear-gradient(135deg, color-mix(in srgb, var(--gold) 18%, var(--bg-card)), var(--bg-card))',
          textAlign: 'center', padding: '20px',
        }}>
          <div style={{ fontSize: 12, color: 'var(--gold)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>Your balance</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 }}>
            <PIcon.coin size={32}/>
            <span className="serif" style={{ fontSize: 38, color: 'var(--ink)', fontWeight: 500 }}>{balance}</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 4 }}>coins</div>
        </div>

        <POrnament>Free coins</POrnament>
        <button onClick={onAd} className="card" style={{
          width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14,
          background: 'var(--bg-card)', cursor: 'pointer',
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'linear-gradient(135deg, var(--gold), var(--amber))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1530',
          }}><PIcon.ad size={20}/></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 600 }}>Watch a short video</div>
            <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>3 of 10 used today · 30s</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--gold)', fontWeight: 700 }}>
            +5 <PIcon.coin size={16}/>
          </div>
        </button>

        <POrnament>Coin packs</POrnament>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            { coins: 50, price: '$0.99', badge: '' },
            { coins: 150, price: '$1.99', badge: 'POPULAR' },
            { coins: 500, price: '$4.99', badge: 'BEST VALUE' },
          ].map(p => (
            <button key={p.coins} onClick={() => onBuy(p.coins)} style={{
              background: p.badge === 'BEST VALUE' ? 'linear-gradient(180deg, color-mix(in srgb, var(--gold) 20%, var(--bg-card)), var(--bg-card))' : 'var(--bg-card)',
              border: `1px solid ${p.badge ? 'var(--gold)' : 'var(--line)'}`,
              borderRadius: 14, padding: '16px 8px', textAlign: 'center', position: 'relative',
            }}>
              {p.badge && (
                <div style={{
                  position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--gold)', color: '#1a1530', fontSize: 9, fontWeight: 700,
                  padding: '2px 8px', borderRadius: 999, letterSpacing: '0.1em', whiteSpace: 'nowrap',
                }}>{p.badge}</div>
              )}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                <PIcon.coin size={32}/>
              </div>
              <div className="serif" style={{ fontSize: 22, color: 'var(--ink)', fontWeight: 500 }}>{p.coins}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>coins</div>
              <div style={{
                marginTop: 10, padding: '8px 0', background: 'var(--gold)', color: '#1a1530',
                borderRadius: 999, fontSize: 12, fontWeight: 700,
              }}>{p.price}</div>
            </button>
          ))}
        </div>

        <POrnament>Premium</POrnament>
        <div className="card" style={{
          background: 'linear-gradient(135deg, color-mix(in srgb, var(--violet) 18%, var(--bg-card)), var(--bg-card))',
          border: '1px solid var(--violet)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 22 }}>⭐</span>
            <div className="serif" style={{ fontSize: 20, color: 'var(--ink)', fontWeight: 500 }}>Taro Premium</div>
            <div style={{ marginLeft: 'auto', color: 'var(--gold)', fontSize: 14, fontWeight: 700 }}>$4.99/mo</div>
          </div>
          <ul style={{ margin: 0, padding: '0 0 0 4px', listStyle: 'none', fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.9 }}>
            <li>✦ No ads, ever</li>
            <li>✦ +5 free coins every day</li>
            <li>✦ Better AI · deeper readings</li>
            <li>✦ 2 exclusive oracle voices</li>
            <li>✦ Premium card-back designs</li>
          </ul>
          <button className="btn-primary" style={{ width: '100%', marginTop: 14, background: 'linear-gradient(180deg, var(--violet), color-mix(in srgb, var(--violet) 60%, #000))', color: '#fff' }}>
            Subscribe
          </button>
        </div>
        <div style={{ height: 20 }}/>
      </div>
    </div>
  );
}

// ───── Moon Calendar ─────
function MoonScreen({ onBack }) {
  const { MOON_PHASES } = window.TaroData;
  const today = new Date();
  const phase = MOON_PHASES[3]; // waxing gibbous

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-deep)', overflowY: 'auto', paddingBottom: 100 }} className="no-scroll">
      <PStarBg/>
      <PSubHeader title="Moon Calendar" onBack={onBack}/>
      <div style={{ position: 'relative', padding: '12px 16px' }}>
        {/* big moon */}
        <div className="card" style={{ textAlign: 'center', padding: '28px 16px' }}>
          <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto', animation: 'moonShine 3s ease-in-out infinite' }}>
            <svg viewBox="0 0 160 160" width="160" height="160">
              <defs>
                <radialGradient id="moonG" cx=".4" cy=".4">
                  <stop offset="0" stopColor="#fef3d6"/>
                  <stop offset="1" stopColor="var(--gold-soft)"/>
                </radialGradient>
              </defs>
              <circle cx="80" cy="80" r="60" fill="url(#moonG)"/>
              <circle cx="100" cy="80" r="55" fill="var(--bg-deep)" opacity=".88"/>
              {/* craters */}
              <circle cx="68" cy="70" r="4" fill="rgba(0,0,0,.15)"/>
              <circle cx="58" cy="92" r="3" fill="rgba(0,0,0,.15)"/>
              <circle cx="78" cy="105" r="2.5" fill="rgba(0,0,0,.15)"/>
              <circle cx="55" cy="65" r="2" fill="rgba(0,0,0,.12)"/>
            </svg>
          </div>
          <div className="serif" style={{ fontSize: 22, color: 'var(--ink)', marginTop: 16, fontWeight: 500 }}>{phase.name}</div>
          <div style={{ fontSize: 13, color: 'var(--gold-soft)', marginTop: 4 }}>in Scorpio · 78% illuminated</div>
          <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 16, lineHeight: 1.6, padding: '0 8px' }}>
            A time of crescendo. What you have been building gathers light. Tend it carefully — three days until the full moon.
          </div>
        </div>

        <POrnament>This month</POrnament>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { date: 'May 12', phase: 'Full Moon', sign: 'Scorpio', label: 'Release · let go' },
            { date: 'May 19', phase: 'Last Quarter', sign: 'Aquarius', label: 'Reflect · question' },
            { date: 'May 26', phase: 'New Moon', sign: 'Gemini', label: 'Begin · plant seeds' },
            { date: 'Jun 2', phase: 'First Quarter', sign: 'Virgo', label: 'Refine · adjust' },
          ].map((d, i) => (
            <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14 }}>
              <div style={{ color: 'var(--gold)' }}>
                <PIcon.moonPhase size={32} phase={[4,6,0,2][i]}/>
              </div>
              <div style={{ flex: 1 }}>
                <div className="serif" style={{ fontSize: 15, color: 'var(--ink)', fontWeight: 500 }}>{d.phase} <span style={{ color: 'var(--ink-dim)', fontSize: 12, fontFamily: 'var(--sans)' }}>· {d.sign}</span></div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>{d.label}</div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 600 }}>{d.date}</div>
            </div>
          ))}
        </div>

        <POrnament>Today's energy</POrnament>
        <div className="card">
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <Tag good>Begin projects</Tag>
            <Tag good>Conversation</Tag>
            <Tag good>Self-care</Tag>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Tag>Big purchases</Tag>
            <Tag>Quick decisions</Tag>
          </div>
        </div>
        <div style={{ height: 20 }}/>
      </div>
    </div>
  );
}

function Tag({ children, good }) {
  return (
    <span style={{
      fontSize: 11, padding: '5px 10px', borderRadius: 999,
      background: good ? 'color-mix(in srgb, var(--good) 18%, var(--bg-elev))' : 'var(--bg-elev)',
      border: `1px solid ${good ? 'var(--good)' : 'var(--line-soft)'}`,
      color: good ? 'var(--good)' : 'var(--ink-soft)', fontWeight: 500, letterSpacing: '0.05em',
    }}>{children}</span>
  );
}

// ───── Compatibility ─────
function CompatScreen({ onBack, user, openNotEnough, balance, spendCoins }) {
  const [step, setStep] = React.useState('input'); // input → loading → result
  const [partner, setPartner] = React.useState({ name: '', date: { d: 22, m: 7, y: 1996 } });

  const begin = () => {
    if (balance < 15) { openNotEnough(15); return; }
    spendCoins(15);
    setStep('loading');
    setTimeout(() => setStep('result'), 2400);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-deep)', overflowY: 'auto', paddingBottom: 100 }} className="no-scroll">
      <PStarBg/>
      <PSubHeader title="Compatibility" onBack={onBack}/>
      {step === 'input' && (
        <div style={{ position: 'relative', padding: '20px 16px' }}>
          <div className="serif" style={{ fontSize: 22, color: 'var(--ink)', fontWeight: 500, marginBottom: 6 }}>
            How do your stars meet?
          </div>
          <div style={{ color: 'var(--ink-soft)', fontSize: 13, marginBottom: 24 }}>
            Compare your chart with someone else's.
          </div>

          <PairCircles userName={user.name} partnerName={partner.name || '?'}/>

          <div style={{ marginTop: 24, marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: 'var(--ink-dim)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Their name</label>
            <input className="input" placeholder="e.g. Jordan" value={partner.name} onChange={e => setPartner({...partner, name: e.target.value})} style={{ marginTop: 6 }}/>
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--ink-dim)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Their birth date</label>
            <div style={{ marginTop: 8, padding: 14, background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 14, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--ink)' }}>July 22, 1996</span>
              <span style={{ color: 'var(--gold)' }}>↓</span>
            </div>
          </div>
          <button className="btn-primary" disabled={!partner.name} style={{ width: '100%', marginTop: 24 }} onClick={begin}>
            Read together · 15 <PIcon.coin size={16} style={{ verticalAlign: 'middle' }}/>
          </button>
        </div>
      )}
      {step === 'loading' && (
        <div style={{ position: 'relative', padding: '60px 16px', textAlign: 'center' }}>
          <PairCircles userName={user.name} partnerName={partner.name} animating/>
          <div className="serif" style={{ marginTop: 40, fontSize: 18, color: 'var(--ink)', letterSpacing: '0.2em' }}>Tracing the threads…</div>
        </div>
      )}
      {step === 'result' && <CompatResult user={user} partner={partner}/>}
    </div>
  );
}

function PairCircles({ userName, partnerName, animating }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', height: 160 }}>
      <div style={{
        width: 110, height: 110, borderRadius: '50%',
        background: 'radial-gradient(circle, var(--gold)50, transparent)',
        border: '1.5px solid var(--gold)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'absolute', left: '50%', marginLeft: -120,
        animation: animating ? 'pulse-soft 1.6s ease-in-out infinite' : 'none',
      }}>
        <span className="serif" style={{ color: 'var(--gold)', fontSize: 26 }}>{userName[0]}</span>
      </div>
      <div style={{
        width: 110, height: 110, borderRadius: '50%',
        background: 'radial-gradient(circle, var(--rose)50, transparent)',
        border: '1.5px solid var(--rose)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'absolute', left: '50%', marginLeft: 10,
        animation: animating ? 'pulse-soft-rev 1.6s ease-in-out infinite' : 'none',
      }}>
        <span className="serif" style={{ color: 'var(--rose)', fontSize: 26 }}>{partnerName[0] || '?'}</span>
      </div>
      {/* connection */}
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <line x1="50%" y1="50%" x2="50%" y2="50%" stroke="var(--gold)" strokeWidth="1" opacity=".4"/>
      </svg>
    </div>
  );
}

function CompatResult({ user, partner }) {
  return (
    <div style={{ position: 'relative', padding: '20px 16px' }} className="fade-up">
      <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
        <div style={{ color: 'var(--gold)', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Synastry score</div>
        <div className="serif" style={{ fontSize: 56, color: 'var(--ink)', fontWeight: 500, lineHeight: 1, margin: '8px 0' }}>87<span style={{ fontSize: 24, color: 'var(--ink-dim)' }}>/100</span></div>
        <div style={{ fontSize: 13, color: 'var(--gold-soft)' }}>A rare alignment — fire meets water</div>
      </div>

      <POrnament>The aspects</POrnament>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { label: 'Sun trine Moon', desc: 'Easy understanding, natural rhythm', good: true },
          { label: 'Venus conjunct Mars', desc: 'Magnetic pull, real chemistry', good: true },
          { label: 'Mercury square Saturn', desc: 'Some communication friction', good: false },
          { label: 'Jupiter sextile Sun', desc: 'You make each other braver', good: true },
        ].map((a, i) => (
          <div key={i} className="card" style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 14 }}>
            <div style={{ fontSize: 18, color: a.good ? 'var(--good)' : 'var(--rose)', display: 'flex' }}>{a.good ? <PIcon.check size={20}/> : <PIcon.warn size={20}/>}</div>
            <div style={{ flex: 1 }}>
              <div className="serif" style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{a.label}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>{a.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <POrnament>The reading</POrnament>
      <div className="card">
        <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink)', fontFamily: 'var(--serif)' }}>
          You are not made for an easy love — but for a true one. {user.name}'s Aries fire meets {partner.name}'s Cancer waters and the steam is real. Where you push, they hold. Where you race, they listen. The friction is the gift; the friction is also the work.
        </div>
      </div>
      <div style={{ height: 20 }}/>
    </div>
  );
}

// ───── History ─────
function HistoryScreen({ onBack }) {
  const [filter, setFilter] = React.useState('all');
  const items = [
    { type: 'tarot', Icon: PIcon.cardJoker, title: '3-Card Reading', meta: 'May 10 · 10 coins', sub: '"Career question" · The Moon, 8 of Cups, Star' },
    { type: 'chat',  Icon: PIcon.orb, title: 'Chat with Luna', meta: 'May 9 · 12 coins', sub: '4 messages' },
    { type: 'tarot', Icon: PIcon.cardJoker, title: 'Yes / No', meta: 'May 8 · 5 coins', sub: '"Should I message them?"' },
    { type: 'compat',Icon: PIcon.heart, title: 'Compatibility · Jordan', meta: 'May 6 · 15 coins', sub: 'Score 87 / 100' },
    { type: 'tarot', Icon: PIcon.cardJoker, title: 'Celtic Cross', meta: 'May 4 · 25 coins', sub: '"Big move" · 10-card deep reading' },
    { type: 'natal', Icon: PIcon.sparkle, title: 'Natal Chart', meta: 'May 1 · free', sub: 'Aries Sun, Cancer Moon, Leo Rising' },
  ];
  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter);
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'tarot', label: 'Tarot' },
    { id: 'chat', label: 'Chat' },
    { id: 'natal', label: 'Natal' },
    { id: 'compat', label: 'Compat' },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-deep)', overflowY: 'auto', paddingBottom: 100 }} className="no-scroll">
      <PStarBg/>
      <PSubHeader title="Reading History" onBack={onBack}/>
      <div style={{ position: 'relative', padding: '12px 16px' }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }} className="no-scroll">
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              flexShrink: 0, padding: '7px 14px', borderRadius: 999, fontSize: 12,
              background: filter === f.id ? 'var(--gold)' : 'var(--bg-card)',
              color: filter === f.id ? '#1a1530' : 'var(--ink-soft)',
              border: '1px solid var(--line)', fontWeight: 500,
            }}>{f.label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((it, i) => (
            <div key={i} className="card" style={{ display: 'flex', gap: 12, padding: 14 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'var(--bg-elev)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--gold)', flexShrink: 0,
              }}><it.Icon size={20}/></div>
              <div style={{ flex: 1 }}>
                <div className="serif" style={{ fontSize: 15, color: 'var(--ink)', fontWeight: 500 }}>{it.title}</div>
                <div style={{ fontSize: 11, color: 'var(--gold-soft)', marginTop: 2 }}>{it.meta}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 6, lineHeight: 1.4 }}>{it.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.TaroProfile = { ProfileScreen, ShopScreen, MoonScreen, CompatScreen, HistoryScreen };
