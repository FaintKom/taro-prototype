// Icons — line-art celestial style. Stroke 1.5, currentColor.
const I = (props, paths) => (
  <svg width={props.size || 20} height={props.size || 20} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={props.sw || 1.5}
    strokeLinecap="round" strokeLinejoin="round" style={props.style}>
    {paths}
  </svg>
);

const Icon = {
  // tabs
  home:    (p) => I(p, <><path d="M3 11l9-7 9 7v9a2 2 0 01-2 2h-4v-7H9v7H5a2 2 0 01-2-2v-9z"/></>),
  cards:   (p) => I(p, <><rect x="4" y="6" width="9" height="13" rx="1.5"/><rect x="11" y="3" width="9" height="13" rx="1.5"/></>),
  chat:    (p) => I(p, <><path d="M21 12a8 8 0 01-12.5 6.6L4 20l1.4-4.5A8 8 0 1121 12z"/></>),
  diary:   (p) => I(p, <><path d="M5 4a2 2 0 012-2h10a2 2 0 012 2v18l-7-3-7 3V4z"/></>),
  user:    (p) => I(p, <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></>),
  // ui
  back:    (p) => I(p, <><path d="M15 6l-6 6 6 6"/></>),
  close:   (p) => I(p, <><path d="M6 6l12 12M18 6L6 18"/></>),
  plus:    (p) => I(p, <><path d="M12 5v14M5 12h14"/></>),
  check:   (p) => I(p, <><path d="M5 13l4 4L19 7"/></>),
  share:   (p) => I(p, <><path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7M16 6l-4-4-4 4M12 2v14"/></>),
  save:    (p) => I(p, <><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"/></>),
  refresh: (p) => I(p, <><path d="M3 12a9 9 0 0115-6.7L21 8M21 3v5h-5"/><path d="M21 12a9 9 0 01-15 6.7L3 16M3 21v-5h5"/></>),
  send:    (p) => I(p, <><path d="M3 11l18-8-8 18-2-8-8-2z"/></>),
  bell:    (p) => I(p, <><path d="M6 8a6 6 0 0112 0c0 7 3 7 3 9H3c0-2 3-2 3-9zM10 20a2 2 0 004 0"/></>),
  settings:(p) => I(p, <><circle cx="12" cy="12" r="3"/><path d="M19 12c0 .5-.1 1-.2 1.4l2 1.5-1.5 2.6-2.4-.9c-.7.6-1.5 1-2.4 1.3l-.4 2.5h-3l-.4-2.5c-.9-.3-1.7-.7-2.4-1.3l-2.4.9-1.5-2.6 2-1.5c-.1-.4-.2-.9-.2-1.4s.1-1 .2-1.4l-2-1.5 1.5-2.6 2.4.9c.7-.6 1.5-1 2.4-1.3l.4-2.5h3l.4 2.5c.9.3 1.7.7 2.4 1.3l2.4-.9 1.5 2.6-2 1.5c.1.4.2.9.2 1.4z"/></>),
  // mystic
  star:    (p) => I({ ...p, sw: p.sw || 1.2 }, <><path d="M12 2l2.5 7L22 11l-6 4.5L18 23l-6-4-6 4 2-7.5L2 11l7.5-2L12 2z"/></>),
  starFill:(p) => <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="currentColor" style={p.style}><path d="M12 2l2.5 7L22 11l-6 4.5L18 23l-6-4-6 4 2-7.5L2 11l7.5-2L12 2z"/></svg>,
  moon:    (p) => I(p, <><path d="M21 13A9 9 0 1111 3a7 7 0 0010 10z"/></>),
  sun:     (p) => I(p, <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/></>),
  rising:  (p) => I(p, <><path d="M3 18h18M12 6l-5 5h3v4h4v-4h3l-5-5z"/></>),
  flame:   (p) => I(p, <><path d="M12 2c2 4-2 5 0 9 1 2 4 2 4 6a6 6 0 11-12 0c0-3 2-4 3-6 1-2-1-3 0-5 1-2 4-2 5-4z"/></>),
  coin:    (p) => <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" style={p.style}><circle cx="12" cy="12" r="10" fill="var(--gold)"/><circle cx="12" cy="12" r="7.5" fill="none" stroke="rgba(0,0,0,.3)" strokeWidth="1"/><text x="12" y="16" textAnchor="middle" fontFamily="serif" fontSize="11" fontWeight="700" fill="rgba(0,0,0,.6)">★</text></svg>,
  sparkle: (p) => I(p, <><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"/></>),
  eye:     (p) => I(p, <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></>),
  heart:   (p) => I(p, <><path d="M12 21s-7-4.5-9-9c-1.5-3.5 1-7 5-7 2 0 3.5 1 4 2 .5-1 2-2 4-2 4 0 6.5 3.5 5 7-2 4.5-9 9-9 9z"/></>),
  calendar:(p) => I(p, <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></>),
  history: (p) => I(p, <><path d="M3 12a9 9 0 109-9 9.7 9.7 0 00-7 3L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></>),
  shop:    (p) => I(p, <><path d="M3 8h18l-2 12H5L3 8z"/><path d="M8 8V5a4 4 0 018 0v3"/></>),
  ad:      (p) => I(p, <><polygon points="6 4 20 12 6 20 6 4"/></>),
  orb:     (p) => I(p, <><circle cx="12" cy="13" r="7"/><path d="M9 10c1-1.5 2.5-2 4-2"/><path d="M8 3l1.5 2.5L12 7l-2.5 1.5L8 11l-1.5-2.5L4 7l2.5-1.5L8 3z" fill="currentColor" stroke="none" opacity=".7"/></>),
  warn:    (p) => I(p, <><path d="M12 3l10 18H2L12 3z"/><path d="M12 10v5M12 18v.5"/></>),
  sunrise: (p) => I(p, <><path d="M3 18h18M5 18a7 7 0 0114 0M12 4v3M5.5 7.5l2 2M18.5 7.5l-2 2"/></>),
  cardJoker:(p) => I(p, <><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8l6 6M15 8l-6 6" strokeWidth="1"/><circle cx="9" cy="8" r=".8" fill="currentColor"/><circle cx="15" cy="8" r=".8" fill="currentColor"/></>),
  moonPhase: (p) => {
    // p.phase: 0..7 (0=new, 4=full)
    const phase = p.phase || 0;
    const r = 9, cx = 12, cy = 12;
    let mask;
    if (phase === 0) mask = <circle cx={cx} cy={cy} r={r} fill="var(--bg-elev, #2a2236)"/>;
    else if (phase === 4) mask = <circle cx={cx} cy={cy} r={r} fill="currentColor"/>;
    else {
      // crescent / gibbous / quarter via two circles
      const lit = phase < 4;
      const k = phase < 4 ? phase : 8 - phase; // 1,2,3 thickness from edge
      const offset = (k === 2) ? 0 : (k === 1 ? r * 0.6 : -r * 0.6);
      const flipped = phase > 4;
      mask = <>
        <circle cx={cx} cy={cy} r={r} fill="var(--bg-elev, #2a2236)"/>
        <path d={`M ${cx} ${cy-r} A ${r} ${r} 0 ${flipped?0:1} ${flipped?0:1} ${cx} ${cy+r} A ${Math.abs(offset)||r} ${r} 0 ${flipped?0:1} ${k===2?0:(phase<4?0:1)} ${cx} ${cy-r}`} fill="currentColor"/>
      </>;
    }
    return <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" style={p.style}>
      <circle cx={cx} cy={cy} r={r+0.5} fill="none" stroke="currentColor" strokeWidth=".6" opacity=".4"/>
      {mask}
    </svg>;
  },
  altar:   (p) => I(p, <><path d="M12 2l2 4h-4l2-4z" fill="currentColor" stroke="none" opacity=".6"/><path d="M6 10h12M5 10l1 10h12l1-10"/><path d="M9 6v4M15 6v4M12 14v3"/><circle cx="12" cy="18" r="1" fill="currentColor" stroke="none"/></>),
  lock:    (p) => I(p, <><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></>),
  google:  (p) => <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" style={p.style}>
    <path fill="#fff" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 01-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4z"/>
    <path fill="#fff" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1a5.9 5.9 0 01-5.6-4.1H3.1V17A10 10 0 0012 22z" opacity=".75"/>
    <path fill="#fff" d="M6.4 14a6 6 0 010-3.9V7.5H3.1a10 10 0 000 9l3.3-2.5z" opacity=".5"/>
    <path fill="#fff" d="M12 6c1.5 0 2.8.5 3.9 1.5l2.9-2.9A10 10 0 003.1 7.5l3.3 2.6A5.9 5.9 0 0112 6z" opacity=".9"/>
  </svg>,
};

window.Icon = Icon;
