// Home + Tarot screens
const { Icon: HIcon } = window;
const { StarBg: HStarBg, Ornament: HOrnament, ZodiacGlyph } = window.TaroAtoms;

function HomeScreen({ user, balance, streak, checkedIn, onCheckIn, goto, openShop, cardStyle }) {
  const { ZODIAC, cap, HOROSCOPE_TEXT } = window.TaroData;
  const sun = ZODIAC.find(z => z.sign === user.sun);
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden', paddingBottom: 100 }} className="no-scroll">
      <HStarBg/>

      {/* Top bar */}
      <div style={{ position: 'relative', padding: '50px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="display" style={{ fontSize: 22, color: 'var(--gold)', letterSpacing: '0.25em', fontWeight: 500 }}>TARO</div>
        <window.TaroAtoms.CoinPill balance={balance} streak={streak} onCoinClick={openShop}/>
      </div>

      <div style={{ position: 'relative', padding: '0 16px' }}>
        {/* Greeting */}
        <div style={{ marginTop: 8, marginBottom: 4 }}>
          <div style={{ color: 'var(--ink-dim)', fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase' }}>{dateStr}</div>
          <div className="serif" style={{ fontSize: 28, color: 'var(--ink)', fontWeight: 500, marginTop: 4, lineHeight: 1.2 }}>
            Good morning, {user.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <ZodiacGlyph sign={user.sun} size={22}/>
            <span style={{ color: 'var(--gold-soft)', fontSize: 13, letterSpacing: '0.15em' }}>{cap(sun.sign).toUpperCase()} · SUN</span>
          </div>
        </div>

        {/* Today's horoscope card */}
        <div className="card fade-up" style={{ marginTop: 20, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 18px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="serif" style={{ color: 'var(--gold)', fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase' }}>Today's Horoscope</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink-soft)', fontSize: 12 }}>
              <HIcon.moonPhase size={14} phase={3}/>
              <span>Waxing Gibbous in Scorpio</span>
            </div>
          </div>
          <div style={{ padding: '14px 18px 20px', color: 'var(--ink)', fontSize: 14.5, lineHeight: 1.65, fontFamily: 'var(--serif)', fontWeight: 400 }}>
            {HOROSCOPE_TEXT}
          </div>
          <div style={{ padding: '0 18px 18px', display: 'flex', gap: 16, fontSize: 12, color: 'var(--ink-soft)', borderTop: '1px solid var(--line-soft)', paddingTop: 14 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--amber)', display: 'inline-block' }}/>Lucky color · Amber</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><HIcon.sparkle size={12}/>Lucky number · 7</span>
          </div>
        </div>

        {/* Check-in */}
        <button onClick={!checkedIn ? onCheckIn : undefined} className="fade-up" style={{
          marginTop: 14, width: '100%', padding: '16px 18px', borderRadius: 18,
          background: checkedIn ? 'var(--bg-card)' : 'linear-gradient(135deg, color-mix(in srgb, var(--gold) 15%, var(--bg-card)), var(--bg-card))',
          border: `1px solid ${checkedIn ? 'var(--line-soft)' : 'var(--gold)'}`,
          display: 'flex', alignItems: 'center', gap: 14, opacity: checkedIn ? .6 : 1,
          cursor: checkedIn ? 'default' : 'pointer',
        }}>
          <div style={{ lineHeight: 1, color: checkedIn ? 'var(--good)' : 'var(--gold)', display: 'flex' }}>{checkedIn ? <HIcon.check size={26}/> : <HIcon.flame size={26}/>}</div>
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 600 }}>
              {checkedIn ? `Checked in · Day ${streak}` : `Claim today · +2 coins`}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 3 }}>
              {checkedIn ? 'Come back tomorrow to keep your streak alive' : `Day ${streak} streak · 7-day bonus in ${Math.max(7-(streak%7), 0)}`}
            </div>
          </div>
          {!checkedIn && <HIcon.coin size={22}/>}
        </button>

        {/* Quick actions */}
        <HOrnament>Quick readings</HOrnament>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <ActionCard Icon={HIcon.cards} title="Tarot" sub="From 5 coins" onClick={() => goto('tarot')}/>
          <ActionCard Icon={HIcon.eye} title="Ask the Oracle" sub="3 coins / msg" onClick={() => goto('chat')}/>
          <ActionCard Icon={HIcon.heart} title="Compatibility" sub="15 coins" onClick={() => goto('compat')}/>
          <ActionCard Icon={HIcon.moon} title="Moon Calendar" sub="Free · today" onClick={() => goto('moon')}/>
        </div>

        {/* transit ribbon */}
        <div className="card fade-up" style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-mid)' }}>
          <div style={{ fontSize: 22, color: 'var(--gold)', fontFamily: 'var(--serif)' }}>{'☿︎'}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600 }}>Mercury trines your natal Venus</div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>A graceful day for difficult conversations</div>
          </div>
          <HIcon.back size={18} style={{ transform: 'rotate(180deg)', color: 'var(--ink-dim)' }}/>
        </div>
      </div>
    </div>
  );
}

function ActionCard({ Icon, title, sub, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 16,
      padding: '18px 14px 16px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 6,
      transition: 'transform .15s, border-color .2s', position: 'relative', overflow: 'hidden',
    }} onMouseDown={e => e.currentTarget.style.transform = 'scale(.97)'}
       onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{ color: 'var(--gold)', display: 'flex' }}><Icon size={26} sw={1.3}/></div>
      <div className="display" style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', marginTop: 8, letterSpacing: '0.1em' }}>{title.toUpperCase()}</div>
      <div style={{ fontSize: 11, color: 'var(--ink-soft)', letterSpacing: '0.05em' }}>{sub}</div>
    </button>
  );
}

// ───── Tarot flow: select → focus → reveal ─────
function TarotSpreadSelect({ goto, balance, openNotEnough, cardStyle }) {
  const { SPREADS } = window.TaroData;
  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingBottom: 100 }} className="no-scroll">
      <HStarBg/>
      <div style={{ position: 'relative', padding: '50px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <div style={{ color: 'var(--gold)', fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase' }}>Tarot</div>
            <div className="serif" style={{ fontSize: 28, color: 'var(--ink)', fontWeight: 500, marginTop: 2 }}>Choose your spread</div>
          </div>
          <window.TaroAtoms.CoinPill balance={balance}/>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {SPREADS.map(s => (
            <button key={s.id} onClick={() => {
              if (balance < s.coins) openNotEnough(s.coins);
              else goto({ name: 'tarot-focus', spread: s });
            }} style={{
              background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 18,
              padding: 16, textAlign: 'left', display: 'flex', gap: 14, alignItems: 'center',
            }}>
              {/* preview cards */}
              <div style={{ position: 'relative', width: 70, height: 100, flexShrink: 0 }}>
                {[...Array(Math.min(s.cards, 3))].map((_, i) => (
                  <div key={i} style={{
                    position: 'absolute', left: i*8, top: i*-2, width: 56, height: 84,
                    transform: `rotate(${(i-1)*6}deg)`, borderRadius: 6, overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,.4)',
                  }}>
                    <window.CardBack style={cardStyle}/>
                  </div>
                ))}
              </div>
              <div style={{ flex: 1 }}>
                <div className="serif" style={{ fontSize: 18, color: 'var(--ink)', fontWeight: 500 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 4 }}>{s.hint}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-dim)', marginTop: 6, lineHeight: 1.4 }}>{s.desc}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--gold)', fontWeight: 600, fontSize: 14 }}>
                <HIcon.coin size={16}/> {s.coins}
              </div>
            </button>
          ))}
        </div>

        <HOrnament>Premium card backs</HOrnament>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }} className="no-scroll">
          {['ornate','geometric','occult'].map(s => (
            <div key={s} style={{ flexShrink: 0, width: 80, height: 120, borderRadius: 8, overflow: 'hidden', border: s === cardStyle ? '2px solid var(--gold)' : '1px solid var(--line)' }}>
              <window.CardBack style={s}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TarotFocus({ spread, onShuffle, onBack }) {
  const [q, setQ] = React.useState('');
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-deep)', display: 'flex', flexDirection: 'column' }}>
      <HStarBg/>
      <window.TaroAtoms.SubHeader title={spread.name} onBack={onBack}/>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 28px', textAlign: 'center', gap: 28 }}>
        {/* glow */}
        <div style={{ position: 'absolute', left: '50%', top: '32%', transform: 'translate(-50%, -50%)', width: 280, height: 280, background: 'radial-gradient(circle, color-mix(in srgb, var(--gold) 20%, transparent), transparent 70%)', pointerEvents: 'none' }}/>

        <div style={{ position: 'relative' }}>
          <div className="serif" style={{ fontSize: 13, color: 'var(--gold)', letterSpacing: '0.5em', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}><HIcon.sparkle size={12}/> Focus <HIcon.sparkle size={12}/></div>
          <div className="serif" style={{ fontSize: 26, color: 'var(--ink)', lineHeight: 1.3, fontWeight: 500 }}>
            Take a breath.<br/>What do you wish to know?
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <textarea className="input" value={q} onChange={e=>setQ(e.target.value)}
            placeholder="(optional) Hold a question in your mind…"
            style={{ minHeight: 80, resize: 'none', textAlign: 'center', fontFamily: 'var(--serif)', fontSize: 15 }}/>
          <div style={{ fontSize: 11, color: 'var(--ink-dim)', marginTop: 8 }}>The cards respond best when you bring something specific.</div>
        </div>

        <button className="btn-primary" onClick={() => onShuffle(q)} style={{ position: 'relative' }}>
          Draw the cards · {spread.coins} <HIcon.coin size={16} style={{ verticalAlign: 'middle', marginLeft: 4 }}/>
        </button>
      </div>
    </div>
  );
}

function TarotShuffle({ onDone, cardStyle }) {
  React.useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-deep)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <HStarBg/>
      <div style={{ position: 'relative', width: 200, height: 240 }}>
        {[
          { delay: 0, anim: 'shuffle1' },
          { delay: 0.2, anim: 'shuffle2' },
          { delay: 0.4, anim: 'shuffle3' },
          { delay: 0.1, anim: 'shuffle1' },
          { delay: 0.3, anim: 'shuffle2' },
        ].map((c, i) => (
          <div key={i} style={{
            position: 'absolute', left: '50%', top: '50%', marginLeft: -50, marginTop: -75,
            width: 100, height: 150, borderRadius: 8, overflow: 'hidden',
            animation: `${c.anim} 1.4s ${c.delay}s ease-in-out infinite`,
            boxShadow: '0 8px 24px rgba(0,0,0,.5)',
          }}>
            <window.CardBack style={cardStyle}/>
          </div>
        ))}
      </div>
      <div className="serif" style={{ position: 'relative', marginTop: 60, fontSize: 18, color: 'var(--ink)', letterSpacing: '0.25em', fontWeight: 500 }}>
        Shuffling the deck…
      </div>
      <div style={{ position: 'relative', marginTop: 8, color: 'var(--ink-soft)', fontSize: 13 }}>
        The cards are aligning with your question
      </div>
    </div>
  );
}

function TarotReveal({ spread, cards, onBack, onNew, cardStyle, user }) {
  const { PPF_LABELS, CELTIC_LABELS } = window.TaroData;
  const [flipped, setFlipped] = React.useState(cards.map(() => false));
  const [showInterp, setShowInterp] = React.useState(false);
  const labels = spread.cards === 1 ? ['Answer'] : spread.cards === 3 ? PPF_LABELS : CELTIC_LABELS;

  const flip = (i) => {
    if (flipped[i]) return;
    const next = [...flipped]; next[i] = true; setFlipped(next);
    if (next.every(Boolean)) setTimeout(() => setShowInterp(true), 700);
  };

  const allFlipped = flipped.every(Boolean);

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-deep)', overflowY: 'auto' }} className="no-scroll">
      <HStarBg/>
      <window.TaroAtoms.SubHeader title={spread.name} onBack={onBack}
        right={!allFlipped && <button onClick={() => setFlipped(cards.map(() => true)) || setTimeout(() => setShowInterp(true), 800)} style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 500 }}>Reveal all</button>}/>
      <div style={{ position: 'relative', padding: '20px 16px 40px' }}>
        {!allFlipped && (
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div className="serif" style={{ fontSize: 14, color: 'var(--gold)', letterSpacing: '0.4em', textTransform: 'uppercase' }}>Tap to reveal</div>
          </div>
        )}

        {/* Layout cards by spread */}
        {spread.cards === 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
            <window.TarotCard card={cards[0]} faceUp={flipped[0]} onClick={() => flip(0)} style={cardStyle} size="lg" glow={!flipped[0]}/>
          </div>
        )}
        {spread.cards === 3 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, justifyItems: 'center' }}>
            {cards.map((c, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <window.TarotCard card={c} faceUp={flipped[i]} onClick={() => flip(i)} style={cardStyle} size="md" glow={!flipped[i]}/>
                <div style={{ fontSize: 10, color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 8 }}>{labels[i]}</div>
              </div>
            ))}
          </div>
        )}
        {spread.cards === 10 && (
          <CelticLayout cards={cards} flipped={flipped} onFlip={flip} cardStyle={cardStyle} labels={labels}/>
        )}

        {showInterp && <TarotInterp spread={spread} cards={cards} labels={labels} user={user} onNew={onNew}/>}
      </div>
    </div>
  );
}

function CelticLayout({ cards, flipped, onFlip, cardStyle, labels }) {
  // 10-card cross + staff
  const layout = [
    { x: 90,  y: 100, r: 0 },   // 1 self (center)
    { x: 90,  y: 100, r: 90 },  // 2 crossing (rotated on top)
    { x: 90,  y: 200, r: 0 },   // 3 foundation (below)
    { x: 10,  y: 100, r: 0 },   // 4 past (left)
    { x: 90,  y: 0,   r: 0 },   // 5 crown (above)
    { x: 170, y: 100, r: 0 },   // 6 future (right)
    { x: 260, y: 220, r: 0 },   // 7 approach
    { x: 260, y: 150, r: 0 },   // 8 environment
    { x: 260, y: 80,  r: 0 },   // 9 hopes
    { x: 260, y: 10,  r: 0 },   // 10 outcome
  ];
  return (
    <div style={{ position: 'relative', width: 360, height: 340, margin: '0 auto' }}>
      {cards.map((c, i) => {
        const L = layout[i];
        return (
          <div key={i} style={{
            position: 'absolute', left: L.x, top: L.y,
            transform: L.r ? `rotate(${L.r}deg)` : '',
            width: 60, height: 90, zIndex: i === 1 ? 2 : 1,
          }}>
            <window.TarotCard card={c} faceUp={flipped[i]} onClick={() => onFlip(i)} style={cardStyle} size="sm" glow={!flipped[i]}/>
            {flipped[i] && (
              <div style={{ position: 'absolute', top: -10, left: '50%', transform: `translate(-50%, -100%) rotate(-${L.r||0}deg)`, fontSize: 8, color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                {i+1} · {labels[i]}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TarotInterp({ spread, cards, labels, user, onNew }) {
  const [streamed, setStreamed] = React.useState('');
  const synthesis = React.useMemo(() => buildInterp(spread, cards, labels, user), []);
  React.useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 4;
      setStreamed(synthesis.slice(0, i));
      if (i >= synthesis.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [synthesis]);

  return (
    <div className="fade-up" style={{ marginTop: 32 }}>
      <window.TaroAtoms.Ornament>The Reading</window.TaroAtoms.Ornament>
      <div className="card" style={{ background: 'var(--bg-card)' }}>
        <div style={{ fontSize: 14.5, lineHeight: 1.7, color: 'var(--ink)', fontFamily: 'var(--serif)', whiteSpace: 'pre-line' }}>
          {streamed}<span style={{ opacity: streamed.length < synthesis.length ? 1 : 0, color: 'var(--gold)' }}>▍</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button className="btn-ghost" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <window.Icon.save size={16}/> Save
        </button>
        <button className="btn-ghost" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <window.Icon.share size={16}/> Share
        </button>
        <button className="btn-ghost" onClick={onNew} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <window.Icon.refresh size={16}/> New
        </button>
      </div>
    </div>
  );
}

function buildInterp(spread, cards, labels, user) {
  if (spread.cards === 1) {
    const c = cards[0];
    return `The cards lean toward ${c.reversed ? 'no — at least, not yet' : 'yes, but on your terms'}. ${c.name} ${c.reversed ? 'reversed' : ''} speaks of ${c.kw}. Move slowly. The answer is forming.`;
  }
  const lines = cards.map((c, i) =>
    `${labels[i]} · ${c.name}${c.reversed ? ' (reversed)' : ''}\n${c.upright}. In the position of ${labels[i].toLowerCase()}, this asks you to ${c.reversed ? 'release' : 'lean into'} ${c.kw.split(' · ')[0]}.\n`
  ).join('\n');
  const close = `\nOverall — your ${labels[0].toLowerCase()} carries weight your ${labels[labels.length-1].toLowerCase()} hasn't yet asked for. Trust the slow turning.`;
  return lines + close;
}

window.TaroHomeTarot = { HomeScreen, TarotSpreadSelect, TarotFocus, TarotShuffle, TarotReveal };
