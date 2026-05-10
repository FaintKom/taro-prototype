// Onboarding flow
const { Icon: OIcon } = window;
const { StarBg: OStarBg, ZodiacGlyph: OZG } = window.TaroAtoms;

function OnboardingFlow({ onComplete }) {
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState({ name: '', date: { d: 14, m: 4, y: 1995 }, time: { h: 6, m: 32 }, place: '' });

  const steps = [
    <Welcome onNext={() => setStep(1)} key="w"/>,
    <NameStep value={data.name} onChange={n => setData({...data, name: n})} onNext={() => setStep(2)} onBack={() => setStep(0)} key="n"/>,
    <BirthDateStep value={data.date} onChange={v => setData({...data, date: v})} onNext={() => setStep(3)} onBack={() => setStep(1)} key="d"/>,
    <BirthTimeStep value={data.time} onChange={v => setData({...data, time: v})} onNext={() => setStep(4)} onBack={() => setStep(2)} key="t"/>,
    <PlaceStep value={data.place} onChange={v => setData({...data, place: v})} onNext={() => setStep(5)} onBack={() => setStep(3)} key="p"/>,
    <ChartReveal data={data} onComplete={() => onComplete(data)} key="r"/>,
  ];
  return steps[step];
}

function Welcome({ onNext }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-deep)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
      <OStarBg/>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 110, height: 110, borderRadius: '50%', position: 'relative', marginBottom: 32 }}>
          <svg viewBox="0 0 110 110" width="110" height="110">
            <defs>
              <radialGradient id="welcG" cx=".5" cy=".5">
                <stop offset="0" stopColor="#fef3d6"/>
                <stop offset="1" stopColor="#d4a64f"/>
              </radialGradient>
            </defs>
            <circle cx="55" cy="55" r="40" fill="none" stroke="var(--gold)" strokeWidth=".5" strokeDasharray="2 3"/>
            <circle cx="55" cy="55" r="50" fill="none" stroke="var(--gold)" strokeWidth=".3" strokeDasharray="1 4"/>
            <g transform="translate(55,55)">
              <path d="M 0 -28 L 5 -8 L 28 -5 L 10 5 L 16 28 L 0 14 L -16 28 L -10 5 L -28 -5 L -5 -8 Z" fill="url(#welcG)"/>
            </g>
          </svg>
        </div>
        <div className="serif" style={{ color: 'var(--gold)', letterSpacing: '0.5em', fontSize: 14, marginBottom: 8 }}>WELCOME TO</div>
        <div className="serif" style={{ color: 'var(--ink)', fontSize: 56, fontWeight: 500, letterSpacing: '0.1em', lineHeight: 1 }}>TARO</div>
        <div className="serif" style={{ marginTop: 24, fontSize: 18, color: 'var(--ink-soft)', lineHeight: 1.5, fontStyle: 'italic' }}>
          Daily horoscopes,<br/>tarot, and an oracle<br/>who actually listens.
        </div>
      </div>
      <div style={{ position: 'relative', width: '100%', paddingBottom: 36 }}>
        <button className="btn-primary" style={{ width: '100%' }} onClick={onNext}>Begin your journey</button>
        <div style={{ marginTop: 14, fontSize: 12, color: 'var(--ink-dim)' }}>By continuing you accept Terms & Privacy</div>
      </div>
    </div>
  );
}

function StepShell({ progress, onBack, title, sub, children, footer }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-deep)', display: 'flex', flexDirection: 'column' }}>
      <OStarBg/>
      <div style={{ position: 'relative', padding: '46px 16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ color: 'var(--ink)' }}><OIcon.back size={22}/></button>
          <div style={{ flex: 1, height: 3, background: 'var(--bg-elev)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'var(--gold)', borderRadius: 2, transition: 'width .3s' }}/>
          </div>
          <span style={{ fontSize: 11, color: 'var(--ink-dim)', letterSpacing: '0.2em' }}>{Math.round(progress)}%</span>
        </div>
      </div>
      <div style={{ position: 'relative', flex: 1, padding: '0 28px', display: 'flex', flexDirection: 'column' }}>
        <div className="serif" style={{ fontSize: 28, color: 'var(--ink)', fontWeight: 500, lineHeight: 1.2 }}>{title}</div>
        {sub && <div style={{ marginTop: 10, fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>{sub}</div>}
        <div style={{ marginTop: 32, flex: 1 }}>{children}</div>
      </div>
      <div style={{ position: 'relative', padding: '20px 28px 36px' }}>{footer}</div>
    </div>
  );
}

function NameStep({ value, onChange, onNext, onBack }) {
  return (
    <StepShell progress={20} onBack={onBack} title="What should we call you?" sub="The stars know you by your true name. We'll just use this one."
      footer={<button className="btn-primary" style={{ width: '100%' }} onClick={onNext} disabled={!value.trim()}>Continue</button>}>
      <input className="input" autoFocus placeholder="Your name" value={value} onChange={e => onChange(e.target.value)} style={{ fontSize: 18, fontFamily: 'var(--serif)' }}/>
    </StepShell>
  );
}

function BirthDateStep({ value, onChange, onNext, onBack }) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return (
    <StepShell progress={40} onBack={onBack} title="When were you born?" sub="Your birth date sets your sun sign — the public face of you."
      footer={<button className="btn-primary" style={{ width: '100%' }} onClick={onNext}>Continue</button>}>
      <Wheel3
        cols={[
          { values: [...Array(31)].map((_,i)=>i+1), value: value.d, onChange: d => onChange({...value, d}) },
          { values: months.map((m,i)=>({ label: m, val: i+1 })), value: value.m, onChange: m => onChange({...value, m}) },
          { values: [...Array(50)].map((_,i)=>1976+i), value: value.y, onChange: y => onChange({...value, y}) },
        ]}/>
      <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--gold)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <OZG sign="aries" size={28}/>
        <div>
          <div className="serif" style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 500 }}>Aries Sun</div>
          <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>The Ram · Cardinal fire · "I am"</div>
        </div>
      </div>
    </StepShell>
  );
}

function BirthTimeStep({ value, onChange, onNext, onBack }) {
  return (
    <StepShell progress={60} onBack={onBack} title="What time, exactly?" sub="Time decides your rising sign — the mask the world meets first. Even a rough guess helps."
      footer={
        <div>
          <button className="btn-primary" style={{ width: '100%' }} onClick={onNext}>Continue</button>
          <button onClick={onNext} style={{ width: '100%', marginTop: 10, color: 'var(--ink-soft)', fontSize: 13 }}>I don't know — skip</button>
        </div>
      }>
      <Wheel3
        cols={[
          { values: [...Array(12)].map((_,i)=>i+1), value: value.h, onChange: h => onChange({...value, h}) },
          { values: [...Array(60)].map((_,i)=>String(i).padStart(2,'0')), value: String(value.m).padStart(2,'0'), onChange: m => onChange({...value, m: +m}) },
          { values: ['AM', 'PM'], value: 'AM', onChange: () => {} },
        ]}/>
    </StepShell>
  );
}

function PlaceStep({ value, onChange, onNext, onBack }) {
  const suggestions = ['Brooklyn, NY', 'San Francisco, CA', 'London, UK', 'Mexico City, MX'];
  return (
    <StepShell progress={80} onBack={onBack} title="Where, on Earth?" sub="Latitude tells us the precise sky overhead the moment you arrived."
      footer={<button className="btn-primary" style={{ width: '100%' }} onClick={onNext} disabled={!value.trim()}>Continue</button>}>
      <input className="input" autoFocus placeholder="City, Country" value={value} onChange={e => onChange(e.target.value)} style={{ fontSize: 16 }}/>
      <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {suggestions.map(s => (
          <button key={s} onClick={() => onChange(s)} style={{
            padding: '7px 12px', fontSize: 12, borderRadius: 999,
            background: 'var(--bg-card)', border: '1px solid var(--line)', color: 'var(--ink-soft)',
          }}>{s}</button>
        ))}
      </div>
    </StepShell>
  );
}

function Wheel3({ cols }) {
  return (
    <div style={{ position: 'relative', height: 200, background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden', display: 'flex' }}>
      {/* highlight band */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)',
        height: 40, background: 'color-mix(in srgb, var(--gold) 8%, transparent)',
        borderTop: '1px solid var(--gold)', borderBottom: '1px solid var(--gold)',
        pointerEvents: 'none', zIndex: 2,
      }}/>
      {cols.map((col, i) => <Wheel key={i} {...col}/>)}
    </div>
  );
}

function Wheel({ values, value, onChange }) {
  const ref = React.useRef();
  const itemH = 36;
  const norm = values.map(v => typeof v === 'object' ? v : { label: v, val: v });
  const idx = norm.findIndex(v => v.val === value);

  React.useEffect(() => {
    if (ref.current) ref.current.scrollTop = idx * itemH;
  }, []);

  return (
    <div ref={ref} className="no-scroll" style={{ flex: 1, height: '100%', overflowY: 'auto', scrollSnapType: 'y mandatory', padding: '80px 0', position: 'relative' }}
      onScroll={e => {
        const i = Math.round(e.currentTarget.scrollTop / itemH);
        if (norm[i] && norm[i].val !== value) onChange(norm[i].val);
      }}>
      {norm.map((v, i) => (
        <div key={i} style={{
          height: itemH, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontFamily: 'var(--serif)', scrollSnapAlign: 'center',
          color: i === idx ? 'var(--gold)' : 'var(--ink-soft)',
          fontWeight: i === idx ? 600 : 400,
          opacity: Math.abs(i - idx) > 2 ? 0.3 : 1 - Math.abs(i - idx) * 0.25,
        }}>{v.label}</div>
      ))}
    </div>
  );
}

function ChartReveal({ data, onComplete }) {
  const [phase, setPhase] = React.useState(0); // 0 calculating, 1 reveal
  React.useEffect(() => {
    const t = setTimeout(() => setPhase(1), 2400);
    return () => clearTimeout(t);
  }, []);

  if (phase === 0) return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-deep)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <OStarBg/>
      <div style={{ position: 'relative', width: 200, height: 200, animation: 'spin 8s linear infinite' }}>
        <svg viewBox="0 0 200 200" width="200" height="200">
          <circle cx="100" cy="100" r="80" fill="none" stroke="var(--gold)" strokeWidth=".5"/>
          <circle cx="100" cy="100" r="60" fill="none" stroke="var(--gold)" strokeWidth=".3" strokeDasharray="2 2"/>
          {[...Array(12)].map((_, i) => {
            const a = (i*30 - 90) * Math.PI/180;
            return <line key={i} x1={100+Math.cos(a)*60} y1={100+Math.sin(a)*60} x2={100+Math.cos(a)*80} y2={100+Math.sin(a)*80} stroke="var(--gold)" strokeWidth=".5"/>;
          })}
          {['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'].map((g, i) => {
            const a = (i*30 - 75) * Math.PI/180;
            return <text key={i} x={100+Math.cos(a)*70} y={100+Math.sin(a)*70+3} textAnchor="middle" fill="var(--gold)" fontSize="9" fontFamily="serif">{g}</text>;
          })}
        </svg>
      </div>
      <div className="serif" style={{ position: 'relative', marginTop: 36, fontSize: 16, letterSpacing: '0.3em', color: 'var(--ink)' }}>CALCULATING YOUR CHART</div>
      <div style={{ position: 'relative', marginTop: 8, color: 'var(--ink-soft)', fontSize: 12 }}>Aligning planets to the moment you arrived</div>
    </div>
  );

  // reveal — chart
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-deep)', overflowY: 'auto' }} className="no-scroll">
      <OStarBg/>
      <div style={{ position: 'relative', padding: '60px 28px 32px', textAlign: 'center' }} className="fade-up">
        <div className="serif" style={{ color: 'var(--gold)', letterSpacing: '0.4em', fontSize: 11, textTransform: 'uppercase' }}>Your Sky</div>
        <div className="serif" style={{ fontSize: 28, color: 'var(--ink)', fontWeight: 500, marginTop: 8, lineHeight: 1.2 }}>{data.name}, this is you.</div>

        <div style={{ marginTop: 24 }}>
          <NatalWheel sun="aries" moon="cancer" rising="leo" small/>
        </div>

        <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-around' }}>
          <BigSign label="Sun" sign="aries" symbol="☀"/>
          <BigSign label="Moon" sign="cancer" symbol="☾"/>
          <BigSign label="Rising" sign="leo" symbol="↑"/>
        </div>

        <div className="card" style={{ marginTop: 28, textAlign: 'left', fontSize: 14, lineHeight: 1.7, color: 'var(--ink)', fontFamily: 'var(--serif)' }}>
          You are <em style={{ color: 'var(--gold)' }}>fire wrapped in water</em>. Aries pushes; Cancer holds; Leo dazzles. You feel everything twice — once fast, once deep — and the world reads you as warmer than you feel inside. You are made for big love and big work.
        </div>
      </div>
      <div style={{ position: 'relative', padding: '0 28px 36px' }}>
        <button className="btn-primary" style={{ width: '100%' }} onClick={onComplete}>
          Enter Taro · 50 coins to start
        </button>
      </div>
    </div>
  );
}

function NatalWheel({ sun, moon, rising, small }) {
  const size = small ? 240 : 320;
  return (
    <svg viewBox="0 0 320 320" width={size} height={size} style={{ display: 'block', margin: '0 auto' }}>
      <defs>
        <radialGradient id="wG" cx=".5" cy=".5">
          <stop offset="0" stopColor="#3b1e6a" stopOpacity=".4"/>
          <stop offset="1" stopColor="transparent"/>
        </radialGradient>
      </defs>
      <circle cx="160" cy="160" r="155" fill="url(#wG)"/>
      <circle cx="160" cy="160" r="140" fill="none" stroke="var(--gold)" strokeWidth=".5"/>
      <circle cx="160" cy="160" r="120" fill="none" stroke="var(--gold)" strokeWidth=".3" opacity=".6"/>
      <circle cx="160" cy="160" r="80" fill="none" stroke="var(--gold)" strokeWidth=".3" opacity=".5"/>
      <circle cx="160" cy="160" r="50" fill="none" stroke="var(--gold)" strokeWidth=".3" opacity=".5"/>

      {/* 12 houses */}
      {[...Array(12)].map((_, i) => {
        const a = (i*30) * Math.PI/180;
        return <line key={i} x1={160+Math.cos(a)*50} y1={160+Math.sin(a)*50} x2={160+Math.cos(a)*140} y2={160+Math.sin(a)*140} stroke="var(--gold)" strokeWidth=".3" opacity=".5"/>;
      })}
      {/* zodiac glyphs */}
      {['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'].map((g, i) => {
        const a = (i*30 + 15 - 180) * Math.PI/180;
        return <text key={i} x={160+Math.cos(a)*130} y={160+Math.sin(a)*130+5} textAnchor="middle" fill="var(--gold)" fontSize="14" fontFamily="serif">{g}</text>;
      })}
      {/* planet markers */}
      {[
        { sym: '☀', a: 30, r: 95, color: '#f5cf5d' },
        { sym: '☾', a: 110, r: 95, color: '#a4c8ff' },
        { sym: '↑', a: 200, r: 110, color: '#f5a063' },
        { sym: '♀', a: 60, r: 70, color: '#f5879b' },
        { sym: '♂', a: 145, r: 70, color: '#e35e5e' },
        { sym: '☿', a: 250, r: 95, color: '#a87fd6' },
        { sym: '♃', a: 320, r: 70, color: '#9bd47a' },
      ].map((p, i) => {
        const a = (p.a - 180) * Math.PI/180;
        return (
          <g key={i} transform={`translate(${160+Math.cos(a)*p.r},${160+Math.sin(a)*p.r})`}>
            <circle r="10" fill="var(--bg-deep)" stroke={p.color} strokeWidth=".7"/>
            <text textAnchor="middle" y="4" fill={p.color} fontSize="11" fontFamily="serif">{p.sym}</text>
          </g>
        );
      })}
      {/* aspect lines (just decorative) */}
      <g stroke="var(--rose)" strokeWidth=".4" opacity=".5">
        <line x1="220" y1="100" x2="100" y2="200"/>
        <line x1="180" y1="80" x2="240" y2="220"/>
      </g>
      <g stroke="var(--good)" strokeWidth=".4" opacity=".4">
        <line x1="100" y1="140" x2="220" y2="140"/>
      </g>
    </svg>
  );
}

function BigSign({ label, sign, symbol }) {
  const { ZODIAC } = window.TaroData;
  const z = ZODIAC.find(x => x.sign === sign);
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="serif" style={{ fontSize: 28, color: 'var(--gold)', lineHeight: 1 }}>{z.glyph}</div>
      <div style={{ fontSize: 9, color: 'var(--ink-dim)', textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: 8 }}>{symbol} {label}</div>
      <div className="serif" style={{ fontSize: 13, color: 'var(--ink)', marginTop: 4, fontWeight: 500 }}>{sign[0].toUpperCase() + sign.slice(1)}</div>
    </div>
  );
}

// Natal chart screen (full)
function NatalScreen({ user, onBack }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-deep)', overflowY: 'auto', paddingBottom: 100 }} className="no-scroll">
      <OStarBg/>
      <window.TaroAtoms.SubHeader title="My Natal Chart" onBack={onBack}/>
      <div style={{ position: 'relative', padding: '12px 16px 24px' }}>
        <div className="card" style={{ background: 'radial-gradient(ellipse at top, color-mix(in srgb, var(--violet) 18%, var(--bg-card)), var(--bg-card))', padding: '20px 0' }}>
          <NatalWheel/>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, padding: '0 8px' }}>
          <BigSign label="Sun" sign={user.sun} symbol="☀"/>
          <BigSign label="Moon" sign={user.moon} symbol="☾"/>
          <BigSign label="Rising" sign={user.rising} symbol="↑"/>
        </div>

        <window.TaroAtoms.Ornament>The big three</window.TaroAtoms.Ornament>
        {[
          { label: 'Sun · Aries · 1st house', text: 'You lead with action. The world sees a starter, an initiator. You don\'t wait for permission.' },
          { label: 'Moon · Cancer · 4th house', text: 'Inside, you are tides. You feel everything, and you know your home is sacred.' },
          { label: 'Rising · Leo · ascending', text: 'First impressions: warmth, theater, generosity. People remember you.' },
        ].map((p, i) => (
          <div key={i} className="card" style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{p.label}</div>
            <div style={{ fontSize: 14, color: 'var(--ink)', marginTop: 6, lineHeight: 1.6, fontFamily: 'var(--serif)' }}>{p.text}</div>
          </div>
        ))}

        <window.TaroAtoms.Ornament>Other placements</window.TaroAtoms.Ornament>
        <div className="card" style={{ padding: 0 }}>
          {[
            ['Mercury', 'Pisces', '12th'],
            ['Venus', 'Taurus', '2nd'],
            ['Mars', 'Cancer', '4th'],
            ['Jupiter', 'Sagittarius', '7th'],
            ['Saturn', 'Pisces', '12th'],
          ].map((p, i) => (
            <div key={i} style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: i < 4 ? '1px solid var(--line-soft)' : 'none' }}>
              <span style={{ fontSize: 14, color: 'var(--ink)' }}>{p[0]}</span>
              <span style={{ fontSize: 13, color: 'var(--gold-soft)' }}>{p[1]} · {p[2]} house</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.TaroOnboarding = { OnboardingFlow, NatalScreen };
