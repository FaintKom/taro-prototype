// Chat + Diary screens
const { Icon: CIcon } = window;
const { StarBg: CStarBg, SubHeader, Ornament: COrnament } = window.TaroAtoms;

function ChatAvatarSelect({ onPick, onBack, isPremium }) {
  const { AVATARS } = window.TaroData;
  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingBottom: 100 }} className="no-scroll">
      <CStarBg/>
      <div style={{ position: 'relative', padding: '50px 16px 16px' }}>
        <div style={{ marginBottom: 18 }}>
          <div style={{ color: 'var(--gold)', fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase' }}>Oracle</div>
          <div className="serif" style={{ fontSize: 28, color: 'var(--ink)', fontWeight: 500, marginTop: 2, lineHeight: 1.2 }}>Choose your guide</div>
          <div style={{ color: 'var(--ink-soft)', fontSize: 13, marginTop: 6 }}>Each speaks differently. Pick whose voice you need today.</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {AVATARS.map(a => {
            const locked = a.premium && !isPremium;
            return (
              <button key={a.id} onClick={() => !locked && onPick(a)} style={{
                background: 'var(--bg-card)', border: `1px solid ${locked ? 'var(--line-soft)' : 'var(--line)'}`,
                borderRadius: 18, padding: 14, textAlign: 'left',
                display: 'flex', gap: 14, alignItems: 'center', position: 'relative',
                opacity: locked ? .55 : 1,
              }}>
                <AvatarPortrait avatar={a}/>
                <div style={{ flex: 1 }}>
                  <div className="serif" style={{ fontSize: 20, color: 'var(--ink)', fontWeight: 500 }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 2 }}>{a.title} · {a.tone}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 6, lineHeight: 1.4 }}>{a.desc}</div>
                </div>
                {locked && (
                  <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--gold)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em' }}>
                    <CIcon.lock size={12}/> PREMIUM
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AvatarPortrait({ avatar, size = 64 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `radial-gradient(circle, ${avatar.accent}40, var(--bg-elev))`,
      border: `1.5px solid ${avatar.accent}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
    }}>
      <span className="serif" style={{ fontSize: size*0.5, color: avatar.accent, lineHeight: 1 }}>{avatar.glyph}</span>
      {/* halo dots */}
      {[...Array(6)].map((_, i) => {
        const a = (i*60 - 90)*Math.PI/180;
        return <div key={i} style={{
          position: 'absolute', width: 2, height: 2, borderRadius: '50%',
          background: avatar.accent, opacity: .6,
          left: size/2 + (size/2 + 4)*Math.cos(a) - 1,
          top: size/2 + (size/2 + 4)*Math.sin(a) - 1,
        }}/>;
      })}
    </div>
  );
}

function ChatSession({ avatar, balance, onBack, onAd, openNotEnough, spendCoins }) {
  const [messages, setMessages] = React.useState([
    { role: 'assistant', text: avatar.greeting || `The cosmos waits.` }
  ]);
  const [input, setInput] = React.useState('');
  const [streaming, setStreaming] = React.useState(null);
  const scrollRef = React.useRef();

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, streaming]);

  const send = () => {
    if (!input.trim()) return;
    if (balance < 3) { openNotEnough(3); return; }
    spendCoins(3);
    const userText = input.trim();
    setInput('');
    setMessages(m => [...m, { role: 'user', text: userText }]);

    // streaming reply
    const reply = generateReply(avatar, userText);
    setStreaming('');
    let i = 0;
    const id = setInterval(() => {
      i += 3;
      setStreaming(reply.slice(0, i));
      if (i >= reply.length) {
        clearInterval(id);
        setStreaming(null);
        setMessages(m => [...m, { role: 'assistant', text: reply }]);
      }
    }, 22);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-deep)', display: 'flex', flexDirection: 'column' }}>
      <CStarBg withNebula={false}/>
      {/* header */}
      <div style={{ position: 'relative', padding: '46px 16px 12px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--line-soft)', background: 'color-mix(in srgb, var(--bg-deep) 90%, transparent)', backdropFilter: 'blur(12px)', zIndex: 5 }}>
        <button onClick={onBack} style={{ color: 'var(--ink)' }}><CIcon.back size={22}/></button>
        <AvatarPortrait avatar={avatar} size={36}/>
        <div style={{ flex: 1 }}>
          <div className="serif" style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 500, lineHeight: 1.1 }}>{avatar.name}</div>
          <div style={{ fontSize: 11, color: avatar.accent, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{avatar.title}</div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <CIcon.coin size={14}/> 3 / msg
        </div>
      </div>

      {/* messages */}
      <div ref={scrollRef} className="no-scroll" style={{ position: 'relative', flex: 1, overflowY: 'auto', padding: '16px 14px' }}>
        {messages.map((m, i) => (
          <Bubble key={i} m={m} avatar={avatar}/>
        ))}
        {streaming !== null && (
          <Bubble m={{ role: 'assistant', text: streaming }} avatar={avatar} streaming/>
        )}
        {streaming === null && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '4px 10px', marginTop: 4 }}>
            <AvatarPortrait avatar={avatar} size={24}/>
            <div style={{ background: `color-mix(in srgb, ${avatar.accent} 12%, var(--bg-card))`, padding: '8px 14px', borderRadius: 18, border: `1px solid ${avatar.accent}40` }}>
              <span className="typing-dot" style={{ background: avatar.accent }}/>
              <span className="typing-dot" style={{ background: avatar.accent }}/>
              <span className="typing-dot" style={{ background: avatar.accent }}/>
            </div>
          </div>
        )}

        {balance < 6 && (
          <div style={{ marginTop: 16, padding: 14, background: 'var(--bg-card)', border: '1px solid var(--gold)', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 22 }}>⚠️</div>
            <div style={{ flex: 1, fontSize: 12, color: 'var(--ink-soft)' }}>{balance} coins remaining. Need more?</div>
            <button onClick={onAd} style={{ background: 'var(--gold)', color: '#1a1530', padding: '6px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <CIcon.ad size={12}/> +5
            </button>
          </div>
        )}
      </div>

      {/* input */}
      <div style={{ position: 'relative', padding: '10px 12px 30px', borderTop: '1px solid var(--line-soft)', background: 'var(--bg-deep)', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        <textarea value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Ask the stars…" rows={1}
          style={{
            flex: 1, background: 'var(--bg-card)', border: '1px solid var(--line)',
            borderRadius: 22, padding: '12px 16px', color: 'var(--ink)', fontSize: 14.5,
            outline: 'none', resize: 'none', maxHeight: 100,
          }}/>
        <button onClick={send} style={{
          width: 44, height: 44, borderRadius: '50%',
          background: input.trim() ? avatar.accent : 'var(--bg-elev)',
          color: input.trim() ? '#1a1530' : 'var(--ink-dim)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'background .2s',
        }}>
          <CIcon.send size={18}/>
        </button>
      </div>
    </div>
  );
}

function Bubble({ m, avatar, streaming }) {
  if (m.role === 'user') return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
      <div style={{
        maxWidth: '78%', background: 'var(--bg-elev)', color: 'var(--ink)',
        padding: '10px 14px', borderRadius: '18px 18px 4px 18px',
        fontSize: 14.5, lineHeight: 1.4, border: '1px solid var(--line-soft)',
      }}>{m.text}</div>
    </div>
  );
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 10 }}>
      <AvatarPortrait avatar={avatar} size={28}/>
      <div style={{
        maxWidth: '78%',
        background: `linear-gradient(135deg, color-mix(in srgb, ${avatar.accent} 15%, var(--bg-card)), var(--bg-card))`,
        padding: '12px 16px', borderRadius: '18px 18px 18px 4px',
        fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink)',
        border: `1px solid ${avatar.accent}40`,
        fontFamily: 'var(--serif)',
        position: 'relative',
      }}>
        {m.text}
        {streaming && <span style={{ color: avatar.accent }}>▍</span>}
      </div>
    </div>
  );
}

function generateReply(avatar, q) {
  const tones = {
    luna:   `I hear what's beneath the question. The stars show movement in your tenth house — career, recognition, the public face. ${q.toLowerCase().includes('job') ? 'Yes, the door is open. But know that the version of you who walks through it must be willing to leave something behind.' : 'There is a softening you have been resisting. Allow it. The answer arrives by the next moon.'} Trust the timing.`,
    orion:  `An old question, asked in many lives. Mars in your chart shows action — but Saturn asks for patience. Both are right. ${q ? 'What you seek is already in motion; you simply have not noticed it yet.' : 'The cosmos turns slowly. So must you.'} Wait three days. Then move.`,
    raven:  `Don't soften it. The cards are clear: stop waiting for permission. ${q ? 'You already know the answer — you wanted me to confirm it.' : 'Something in your life is dead and you are still feeding it.'} Cut it loose. The stars are not subtle this week.`,
  };
  return tones[avatar.id] || tones.luna;
}

// ───── Diary ─────
function DiaryScreen({ entries, logMood, balance }) {
  const { MOOD_LABELS, MOON_PHASES } = window.TaroData;
  const MoodFace = window.MoodFace;
  const [mood, setMood] = React.useState(null);
  const [note, setNote] = React.useState('');
  const todayKey = new Date().toISOString().slice(0,10);
  const todayLogged = entries[todayKey];

  const monthDays = [];
  const today = new Date();
  const year = today.getFullYear(), month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  for (let i = 0; i < firstDay; i++) monthDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) monthDays.push(d);

  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingBottom: 100 }} className="no-scroll">
      <CStarBg withNebula={false}/>
      <div style={{ position: 'relative', padding: '50px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <div style={{ color: 'var(--gold)', fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase' }}>Diary</div>
            <div className="serif" style={{ fontSize: 28, color: 'var(--ink)', fontWeight: 500, marginTop: 2, lineHeight: 1.2 }}>How is your sky?</div>
          </div>
          <window.TaroAtoms.CoinPill balance={balance}/>
        </div>

        {!todayLogged ? (
          <div className="card fade-up">
            <div style={{ color: 'var(--gold)', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 14 }}>Today · {today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
              {MOOD_LABELS.map((lbl, i) => (
                <button key={i} onClick={() => setMood(i+1)} title={lbl} style={{
                  width: 52, height: 52,
                  borderRadius: '50%',
                  background: mood === i+1 ? 'color-mix(in srgb, var(--gold) 15%, transparent)' : 'var(--bg-elev)',
                  border: `2px solid ${mood === i+1 ? 'var(--gold)' : 'transparent'}`,
                  transition: 'all .2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: mood === i+1 ? 'var(--gold)' : 'var(--ink-soft)',
                }}><MoodFace level={i+1} size={30}/></button>
              ))}
            </div>
            <textarea className="input" value={note} onChange={e => setNote(e.target.value)}
              placeholder="A note for the stars… (optional)" rows={2}
              style={{ resize: 'none', fontFamily: 'var(--serif)', fontSize: 14 }}/>

            {/* astro context */}
            <div style={{ marginTop: 14, padding: 12, background: 'var(--bg-elev)', borderRadius: 12, fontSize: 12, color: 'var(--ink-soft)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <CIcon.moonPhase size={16} phase={3}/> Waxing Gibbous in Scorpio
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--violet)', fontFamily: 'var(--serif)' }}>{'☿︎'}</span> Mercury trines your natal Sun
              </div>
            </div>

            <button className="btn-primary" disabled={!mood} onClick={() => { logMood(todayKey, mood, note); setMood(null); setNote(''); }}
              style={{ width: '100%', marginTop: 14 }}>
              Save entry
            </button>
          </div>
        ) : (
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ color: 'var(--gold)' }}><MoodFace level={todayLogged.mood} size={40}/></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Logged today</div>
              <div className="serif" style={{ fontSize: 16, color: 'var(--ink)', marginTop: 4 }}>{todayLogged.note || 'Saved.'}</div>
            </div>
            <CIcon.check size={20} style={{ color: 'var(--good)' }}/>
          </div>
        )}

        <COrnament>May 2026</COrnament>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 14 }}>
          {['M','T','W','T','F','S','S'].map((d,i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: 10, color: 'var(--ink-dim)', letterSpacing: '0.1em' }}>{d}</div>
          ))}
          {monthDays.map((d, i) => {
            if (!d) return <div key={i}/>;
            const key = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            const e = entries[key];
            const isToday = d === today.getDate();
            const moonIdx = (d + 4) % 8;
            return (
              <div key={i} style={{
                aspectRatio: '1', borderRadius: 8,
                background: isToday ? 'color-mix(in srgb, var(--gold) 14%, var(--bg-card))' : 'var(--bg-card)',
                border: `1px solid ${isToday ? 'var(--gold)' : 'var(--line-soft)'}`,
                padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ fontSize: 9, color: 'var(--ink-dim)', alignSelf: 'flex-start' }}>{d}</div>
                <div style={{ lineHeight: 1, color: 'var(--gold)' }}>{e ? <MoodFace level={e.mood} size={16}/> : null}</div>
                <div style={{ opacity: .6, color: 'var(--ink-dim)', display: 'flex' }}><CIcon.moonPhase size={9} phase={moonIdx}/></div>
              </div>
            );
          })}
        </div>

        <COrnament>Insights</COrnament>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <InsightRow label="Average mood" value="3.8 / 5" trend="up"/>
          <InsightRow label="Best days correlate with" value="Moon in Taurus" />
          <InsightRow label="Low days often around" value="Mercury squares" />
        </div>
      </div>
    </div>
  );
}

function InsightRow({ label, value, trend }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: 'var(--ink-dim)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{label}</div>
        <div className="serif" style={{ fontSize: 16, color: 'var(--ink)', marginTop: 2, fontWeight: 500 }}>{value}</div>
      </div>
      {trend === 'up' && <span style={{ color: 'var(--good)', fontSize: 14 }}>↗</span>}
    </div>
  );
}

window.TaroChatDiary = { ChatAvatarSelect, ChatSession, DiaryScreen };
