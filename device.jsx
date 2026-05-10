// Custom Taro Android device frame — dark, mystical
function TaroDevice({ children, statusBarTint = 'light' }) {
  const fg = statusBarTint === 'light' ? 'rgba(255,255,255,.85)' : 'rgba(0,0,0,.85)';
  return (
    <div style={{
      width: 412, height: 892, borderRadius: 44, overflow: 'hidden',
      background: '#000',
      border: '10px solid #1a1a22',
      boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1.5px rgba(80,80,100,.3) inset, 0 0 80px rgba(212,175,55,.06)',
      position: 'relative',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* status bar */}
      <div style={{
        height: 36, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 22px',
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50,
        pointerEvents: 'none',
      }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: fg, fontFamily: 'system-ui' }}>9:41</span>
        <div style={{
          position: 'absolute', left: '50%', top: 8, transform: 'translateX(-50%)',
          width: 22, height: 22, borderRadius: 100, background: '#0a0a0a',
          boxShadow: '0 0 0 2px rgba(40,40,50,.7)',
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="14" height="10" viewBox="0 0 14 10"><path d="M7 9.7L.3 3a9.5 9.5 0 0113.4 0L7 9.7z" fill={fg}/></svg>
          <svg width="14" height="10" viewBox="0 0 14 10"><path d="M13 9V1L1 9h12z" fill={fg}/></svg>
          <svg width="22" height="11" viewBox="0 0 22 11">
            <rect x="1" y="1" width="18" height="9" rx="2" fill="none" stroke={fg} strokeWidth="1"/>
            <rect x="3" y="3" width="13" height="5" rx="1" fill={fg}/>
            <rect x="20" y="4" width="1.5" height="3" rx=".5" fill={fg}/>
          </svg>
        </div>
      </div>

      {/* content */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'var(--bg-deep)' }}>
        {children}
      </div>

      {/* gesture bar */}
      <div style={{
        height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent', position: 'absolute', bottom: 0, left: 0, right: 0,
        zIndex: 50, pointerEvents: 'none',
      }}>
        <div style={{ width: 124, height: 4, borderRadius: 2, background: 'rgba(255,255,255,.5)' }} />
      </div>
    </div>
  );
}

window.TaroDevice = TaroDevice;
