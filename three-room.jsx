// Voxel room builder — Three.js isometric diorama for altar screen
(function() {

const VIBES = {
  mystic: {
    wallL: 0x7b5ea7, wallR: 0x8b6eb7, trim: 0xc8b0e8,
    bg: 0xf0dcc8, carpet: 0x2d5a4a, cushion: 0x9b3b6e,
    cushionAlt: 0xd4a64f, rugEdge: 0xd4a64f, pot: 0x6a3d7d,
  },
  boho: {
    wallL: 0x8a6b4a, wallR: 0x9a7b5a, trim: 0xd4b896,
    bg: 0xf0e0c8, carpet: 0x8a4030, cushion: 0xb85c3a,
    cushionAlt: 0xe8c98a, rugEdge: 0xe8c98a, pot: 0x8a6540,
  },
  cosmic: {
    wallL: 0x3a4a7a, wallR: 0x4a5a8a, trim: 0xa8b8d8,
    bg: 0x10102a, carpet: 0x1a2048, cushion: 0x6a3a8a,
    cushionAlt: 0x9b7de0, rugEdge: 0x9b7de0, pot: 0x4a3a6a,
  },
};

window.buildVoxelRoom = function(canvas, W, H, initialVibe) {
  const T = window.THREE;
  if (!T) return null;

  // ─── Renderer ───
  const renderer = new T.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  // ─── Camera (fixed isometric) ───
  const aspect = W / H;
  var zoom = 5.2;
  var zoomMin = 3.5, zoomMax = 8;
  const camera = new T.OrthographicCamera(-zoom * aspect, zoom * aspect, zoom, -zoom, 0.1, 100);
  camera.position.set(10, 12, 10);
  camera.lookAt(0, 1.8, 0);
  camera.updateProjectionMatrix();

  function applyZoom() {
    camera.left = -zoom * aspect;
    camera.right = zoom * aspect;
    camera.top = zoom;
    camera.bottom = -zoom;
    camera.updateProjectionMatrix();
  }

  // wheel zoom
  canvas.addEventListener('wheel', function(e) {
    e.preventDefault();
    zoom += e.deltaY * 0.005;
    zoom = Math.max(zoomMin, Math.min(zoomMax, zoom));
    applyZoom();
  }, { passive: false });

  // pinch zoom
  var lastPinchDist = 0;
  canvas.addEventListener('touchstart', function(e) {
    if (e.touches.length === 2) {
      var dx = e.touches[0].clientX - e.touches[1].clientX;
      var dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinchDist = Math.sqrt(dx * dx + dy * dy);
    }
  }, { passive: true });
  canvas.addEventListener('touchmove', function(e) {
    if (e.touches.length === 2) {
      e.preventDefault();
      var dx = e.touches[0].clientX - e.touches[1].clientX;
      var dy = e.touches[0].clientY - e.touches[1].clientY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (lastPinchDist > 0) {
        zoom *= lastPinchDist / dist;
        zoom = Math.max(zoomMin, Math.min(zoomMax, zoom));
        applyZoom();
      }
      lastPinchDist = dist;
    }
  }, { passive: false });
  canvas.addEventListener('touchend', function() { lastPinchDist = 0; }, { passive: true });

  // ─── Scene ───
  const scene = new T.Scene();
  scene.background = new T.Color(0xf0dcc8);

  // ─── Lighting ───
  scene.add(new T.AmbientLight(0xfff5e6, 0.6));
  const dirLight = new T.DirectionalLight(0xffeedd, 1.2);
  dirLight.position.set(8, 12, 6);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.set(1024, 1024);
  dirLight.shadow.camera.left = -10; dirLight.shadow.camera.right = 10;
  dirLight.shadow.camera.top = 10; dirLight.shadow.camera.bottom = -10;
  dirLight.shadow.bias = -0.002; dirLight.shadow.radius = 3;
  scene.add(dirLight);
  const fillLight = new T.DirectionalLight(0xc8b8ff, 0.3);
  fillLight.position.set(-6, 8, -4);
  scene.add(fillLight);
  const warmGlow = new T.PointLight(0xffaa44, 0.5, 12);
  warmGlow.position.set(-1, 3, -1);
  scene.add(warmGlow);

  // ─── Helper ───
  function box(w, h, dp, mt) {
    const mesh = new T.Mesh(new T.BoxGeometry(w, h, dp), mt);
    mesh.castShadow = true; mesh.receiveShadow = true;
    return mesh;
  }
  function boxAt(w, h, dp, mt, x, y, z) {
    const m = box(w, h, dp, mt);
    m.position.set(x, y, z);
    return m;
  }

  // ─── Vibe-dependent materials ───
  const vm = {
    wallL:      new T.MeshStandardMaterial({ color: 0x7b5ea7, roughness: 0.85 }),
    wallR:      new T.MeshStandardMaterial({ color: 0x8b6eb7, roughness: 0.85 }),
    trim:       new T.MeshStandardMaterial({ color: 0xc8b0e8, roughness: 0.7 }),
    carpet:     new T.MeshStandardMaterial({ color: 0x2d5a4a, roughness: 0.95 }),
    cushion:    new T.MeshStandardMaterial({ color: 0x9b3b6e, roughness: 0.9 }),
    cushionAlt: new T.MeshStandardMaterial({ color: 0xd4a64f, roughness: 0.85 }),
    rugEdge:    new T.MeshStandardMaterial({ color: 0xd4a64f, roughness: 0.9 }),
    pot:        new T.MeshStandardMaterial({ color: 0x6a3d7d, roughness: 0.7 }),
  };

  // ─── Static materials ───
  const mFloor    = new T.MeshStandardMaterial({ color: 0xf5e6d0, roughness: 0.9 });
  const mFloorAlt = new T.MeshStandardMaterial({ color: 0xe8d5b8, roughness: 0.9 });
  const mWood     = new T.MeshStandardMaterial({ color: 0x8b6b4a, roughness: 0.7 });
  const mWoodD    = new T.MeshStandardMaterial({ color: 0x6b4c30, roughness: 0.75 });
  const mWoodL    = new T.MeshStandardMaterial({ color: 0xc49a6c, roughness: 0.65 });
  const mCandle   = new T.MeshStandardMaterial({ color: 0xf5e8d0, roughness: 0.6 });
  const mFlame    = new T.MeshStandardMaterial({ color: 0xffaa33, emissive: 0xff8800, emissiveIntensity: 1.5, roughness: 0.3 });
  const mGold     = new T.MeshStandardMaterial({ color: 0xd4a64f, roughness: 0.3, metalness: 0.7 });
  const mCrystal1 = new T.MeshStandardMaterial({ color: 0xcc88ff, roughness: 0.2, metalness: 0.3 });
  const mCrystal2 = new T.MeshStandardMaterial({ color: 0x88ccff, roughness: 0.2, metalness: 0.3 });
  const mCrystal3 = new T.MeshStandardMaterial({ color: 0xff88cc, roughness: 0.2, metalness: 0.3 });
  const mBooks    = [
    new T.MeshStandardMaterial({ color: 0x8b2252, roughness: 0.8 }),
    new T.MeshStandardMaterial({ color: 0x2a4858, roughness: 0.8 }),
    new T.MeshStandardMaterial({ color: 0x6b3a8a, roughness: 0.8 }),
    new T.MeshStandardMaterial({ color: 0xcc8833, roughness: 0.8 }),
    new T.MeshStandardMaterial({ color: 0x3a5a2a, roughness: 0.8 }),
  ];
  const mBlack    = new T.MeshStandardMaterial({ color: 0x2a2030, roughness: 0.8 });
  const mScreen   = new T.MeshStandardMaterial({ color: 0x1a1830, emissive: 0x332266, emissiveIntensity: 0.3, roughness: 0.3 });
  const mTarot    = new T.MeshStandardMaterial({ color: 0x1a0a30, roughness: 0.6 });
  const mTarotG   = new T.MeshStandardMaterial({ color: 0xd4a64f, emissive: 0xaa8833, emissiveIntensity: 0.2, roughness: 0.4 });
  const mMoonF    = new T.MeshStandardMaterial({ color: 0xd4a64f, roughness: 0.4, metalness: 0.5 });
  const mStar     = new T.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffaa00, emissiveIntensity: 0.5, roughness: 0.3, metalness: 0.5 });
  const mPlantG   = new T.MeshStandardMaterial({ color: 0x4a8a3a, roughness: 0.8 });
  const mPlantD   = new T.MeshStandardMaterial({ color: 0x2a5a2a, roughness: 0.8 });
  const mCouch    = new T.MeshStandardMaterial({ color: 0xddd8cc, roughness: 0.85 });
  const mCouchS   = new T.MeshStandardMaterial({ color: 0xc8c0b0, roughness: 0.85 });
  const mDoor     = new T.MeshStandardMaterial({ color: 0x9a7550, roughness: 0.6 });
  const mDoorH    = new T.MeshStandardMaterial({ color: 0xd4a64f, roughness: 0.3, metalness: 0.8 });
  const mWinF     = new T.MeshStandardMaterial({ color: 0xc49a6c, roughness: 0.6 });
  const mWinGl    = new T.MeshStandardMaterial({ color: 0xddeeff, roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.4 });
  const mWinLt    = new T.MeshStandardMaterial({ color: 0xfff8e0, emissive: 0xfff0c0, emissiveIntensity: 0.3, transparent: true, opacity: 0.5 });
  const mIncense  = new T.MeshStandardMaterial({ color: 0x4a3020, roughness: 0.9 });
  const mSmoke    = new T.MeshStandardMaterial({ color: 0xccbbaa, transparent: true, opacity: 0.2, roughness: 1 });
  const mCrBall   = new T.MeshStandardMaterial({ color: 0xaabbff, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.6 });

  // ─── Room constants ───
  const R = 8, WH = 6, WT = 0.4;
  const room = new T.Group();

  // ─── Floor ───
  for (let x = 0; x < R; x++) for (let z = 0; z < R; z++) {
    const tile = box(0.98, 0.3, 0.98, (x + z) % 2 === 0 ? mFloor : mFloorAlt);
    tile.position.set(x - R / 2 + 0.5, -0.15, z - R / 2 + 0.5);
    room.add(tile);
  }

  // ─── Walls ───
  const wBack = box(R, WH, WT, vm.wallL);
  wBack.position.set(0, WH / 2, -R / 2 + WT / 2); room.add(wBack);
  const wLeft = box(WT, WH, R, vm.wallR);
  wLeft.position.set(-R / 2 + WT / 2, WH / 2, 0); room.add(wLeft);

  // Trim top
  let tmp;
  tmp = box(R + 0.1, 0.25, WT + 0.15, vm.trim);
  tmp.position.set(0, WH + 0.12, -R / 2 + WT / 2); room.add(tmp);
  tmp = box(WT + 0.15, 0.25, R + 0.1, vm.trim);
  tmp.position.set(-R / 2 + WT / 2, WH + 0.12, 0); room.add(tmp);

  // Baseboard
  tmp = box(R, 0.3, 0.15, vm.trim);
  tmp.position.set(0, 0.15, -R / 2 + WT + 0.07); room.add(tmp);
  tmp = box(0.15, 0.3, R, vm.trim);
  tmp.position.set(-R / 2 + WT + 0.07, 0.15, 0); room.add(tmp);

  // ─── Window (back wall) ───
  (function() {
    const g = new T.Group();
    [[1.8,.15,.2,0,.9],[1.8,.15,.2,0,-.9],[.15,1.95,.2,-.82,0],[.15,1.95,.2,.82,0],[.1,1.95,.15,0,0]].forEach(function(p) {
      const f = box(p[0],p[1],p[2],mWinF); f.position.set(p[3],p[4],0); g.add(f);
    });
    const gl = box(1.6,1.7,.05,mWinGl); gl.position.set(0,0,-.05); g.add(gl);
    const gw = box(1.6,1.7,.02,mWinLt); gw.position.set(0,0,-.1); g.add(gw);
    g.position.set(2, 3.5, -R/2+WT+.05);
    room.add(g);
  })();

  // ─── Door (left wall) ───
  (function() {
    const g = new T.Group();
    g.add(boxAt(1.5,3,.2,mDoor, 0,1.5,0));
    g.add(boxAt(1.8,.15,.25,mWoodD, 0,3.07,0));
    g.add(boxAt(.15,3.15,.25,mWoodD, -.82,1.5,0));
    g.add(boxAt(.15,3.15,.25,mWoodD, .82,1.5,0));
    g.add(boxAt(.08,.25,.12,mDoorH, .5,1.5,.15));
    g.add(boxAt(1,.8,.05,mWoodD, 0,2.2,.12));
    g.add(boxAt(1,1,.05,mWoodD, 0,.7,.12));
    g.position.set(-R/2+WT+.05, 0, -.5);
    g.rotation.y = Math.PI / 2;
    room.add(g);
  })();

  // ─── Candle factory ───
  function mkCandle(x, y, z, h) {
    h = h || 0.5;
    const g = new T.Group();
    const body = new T.Mesh(new T.CylinderGeometry(.08,.08,h,8), mCandle);
    body.position.set(0,h/2,0); body.castShadow = true; g.add(body);
    const fm = new T.Mesh(new T.ConeGeometry(.04,.12,6), mFlame);
    fm.position.set(0,h+.06,0); fm.userData.isFlame = true; g.add(fm);
    const cl = new T.PointLight(0xff8833, 0.4, 3);
    cl.position.set(0,h+.15,0); g.add(cl);
    g.position.set(x, y, z);
    return g;
  }

  // ─── Crystals cluster ───
  function mkCrystals(x, y, z) {
    const g = new T.Group();
    const specs = [
      {h:.6,r:.1,m:mCrystal1,rx:.1,rz:0,px:0,pz:0},
      {h:.45,r:.08,m:mCrystal2,rx:-.15,rz:.2,px:.15,pz:.08},
      {h:.35,r:.07,m:mCrystal3,rx:.2,rz:-.1,px:-.12,pz:.1},
      {h:.5,r:.09,m:mCrystal1,rx:-.1,rz:-.15,px:-.05,pz:-.12},
      {h:.3,r:.06,m:mCrystal2,rx:.15,rz:.1,px:.1,pz:-.08},
    ];
    specs.forEach(function(c) {
      const mesh = new T.Mesh(new T.CylinderGeometry(0,c.r,c.h,6), c.m);
      mesh.position.set(c.px, c.h/2, c.pz);
      mesh.rotation.x = c.rx; mesh.rotation.z = c.rz;
      mesh.castShadow = true; g.add(mesh);
    });
    const base = new T.Mesh(new T.DodecahedronGeometry(.2,0), mWoodD);
    base.position.set(0,.05,0); base.scale.set(1,.4,1); base.castShadow = true; g.add(base);
    g.position.set(x, y, z);
    return g;
  }

  // ─── Bookshelf ───
  (function() {
    const g = new T.Group();
    g.add(boxAt(2.2,3,.15,mWoodD, 0,1.5,-.3));
    g.add(boxAt(.15,3,.7,mWood, -1.02,1.5,0));
    g.add(boxAt(.15,3,.7,mWood, 1.02,1.5,0));
    g.add(boxAt(2.35,.12,.7,mWood, 0,3,0));
    for (var i = 0; i < 3; i++) {
      const s = box(2.05,.1,.65,mWood); s.position.set(0,.75+i*.95,.02); g.add(s);
    }
    for (var row = 0; row < 3; row++) {
      const y = .8 + row * .95; var bx = -.8;
      for (var b = 0; b < 5 + Math.floor(Math.random()*3); b++) {
        const bw = .12 + Math.random()*.08, bh = .55 + Math.random()*.25;
        const book = box(bw, bh, .4, mBooks[b % 5]);
        book.position.set(bx + bw/2, y + bh/2, .05); g.add(book);
        bx += bw + .02; if (bx > .8) break;
      }
    }
    g.position.set(-2.2, 0, -R/2+WT+.35);
    room.add(g);
  })();

  // ─── Wall shelf (left wall) ───
  (function() {
    const g = new T.Group();
    g.add(box(1.8,.1,.5,mWood));
    const bl = box(.08,.3,.4,mWoodD); bl.position.set(-.7,-.2,0); g.add(bl);
    const br = box(.08,.3,.4,mWoodD); br.position.set(.7,-.2,0); g.add(br);
    g.add(mkCrystals(-.4,.05,.05));
    g.add(mkCandle(.3,.05,0,.35));
    g.add(mkCandle(.6,.05,0,.25));
    g.position.set(-R/2+WT+.25, 4.5, -1);
    g.rotation.y = Math.PI / 2;
    room.add(g);
  })();

  // ─── Moon decor (back wall) ───
  (function() {
    const g = new T.Group();
    const ring = new T.Mesh(new T.TorusGeometry(.5,.06,8,24), mMoonF);
    ring.rotation.x = Math.PI/2; g.add(ring);
    const mo = new T.Mesh(new T.CircleGeometry(.4,16), mGold);
    mo.rotation.y = Math.PI; g.add(mo);
    const mc = new T.Mesh(new T.CircleGeometry(.32,16), vm.wallL);
    mc.position.set(.12,.05,.01); mc.rotation.y = Math.PI; g.add(mc);
    g.position.set(-.5, 4.8, -R/2+WT+.08);
    room.add(g);
  })();

  // ─── Stars (back wall) ───
  function mkStar(x, y, z, sz) {
    sz = sz || .15;
    const shape = new T.Shape();
    for (var i = 0; i < 10; i++) {
      const a = (i * Math.PI) / 5 - Math.PI / 2;
      const r = i % 2 === 0 ? sz : sz * .4;
      if (i === 0) shape.moveTo(Math.cos(a)*r, Math.sin(a)*r);
      else shape.lineTo(Math.cos(a)*r, Math.sin(a)*r);
    }
    shape.closePath();
    const mesh = new T.Mesh(new T.ExtrudeGeometry(shape, { depth: .04, bevelEnabled: false }), mStar);
    mesh.position.set(x, y, z); mesh.castShadow = true;
    return mesh;
  }
  room.add(mkStar(1.5, 5, -R/2+WT+.05, .15));
  room.add(mkStar(.5, 5.3, -R/2+WT+.05, .1));
  room.add(mkStar(2.8, 4.5, -R/2+WT+.05, .12));

  // ─── Tarot table ───
  (function() {
    const g = new T.Group();
    const top = box(2,.12,1.2,mWoodL); top.position.set(0,1,0); g.add(top);
    [[-0.8,-.45],[.8,-.45],[-.8,.45],[.8,.45]].forEach(function(p) {
      const leg = box(.12,1,.12,mWood); leg.position.set(p[0],.5,p[1]); g.add(leg);
    });
    for (var i = 0; i < 3; i++) {
      const card = box(.35,.03,.55,mTarot);
      card.position.set(-.5+i*.5, 1.08, -.1+(i===1?.1:0));
      card.rotation.y = (i-1)*.15; g.add(card);
      const border = box(.37,.02,.57,mTarotG);
      border.position.set(-.5+i*.5, 1.06, -.1+(i===1?.1:0));
      border.rotation.y = (i-1)*.15; g.add(border);
    }
    g.position.set(1, 0, .5);
    room.add(g);
  })();

  // ─── Couch ───
  (function() {
    const g = new T.Group();
    g.add(boxAt(2.5,.5,1.2,mCouch, 0,.4,0));
    g.add(boxAt(2.5,.7,.3,mCouchS, 0,1,-.45));
    g.add(boxAt(.3,.5,1.2,mCouchS, -1.25,.55,0));
    g.add(boxAt(.3,.5,1.2,mCouchS, 1.25,.55,0));
    const p1 = box(.6,.25,.45,vm.cushion); p1.position.set(-.7,.78,-.15); p1.rotation.z = .15; g.add(p1);
    const p2 = box(.6,.25,.45,vm.cushionAlt); p2.position.set(.5,.78,-.2); p2.rotation.z = -.1; g.add(p2);
    g.position.set(.5, 0, 2.8);
    room.add(g);
  })();

  // ─── Rug ───
  (function() {
    const g = new T.Group();
    g.add(boxAt(3.5,.04,2.5,vm.carpet, 0,.02,0));
    [[3.3,.045,.1,0,-1.1],[3.3,.045,.1,0,1.1],[.1,.045,2.3,-1.55,0],[.1,.045,2.3,1.55,0]].forEach(function(p) {
      const b = box(p[0],p[1],p[2],vm.rugEdge); b.position.set(p[3],.03,p[4]); g.add(b);
    });
    const c = new T.Mesh(new T.CircleGeometry(.4,8), vm.rugEdge);
    c.rotation.x = -Math.PI/2; c.position.set(0,.05,0); g.add(c);
    g.position.set(.8, 0, 1.5);
    room.add(g);
  })();

  // ─── Desk ───
  (function() {
    const g = new T.Group();
    g.add(boxAt(1.8,.1,.9,mWood, 0,1.3,0));
    [[-.75,-.3],[.75,-.3],[-.75,.3],[.75,.3]].forEach(function(p) {
      const leg = box(.1,1.3,.1,mWoodD); leg.position.set(p[0],.65,p[1]); g.add(leg);
    });
    g.add(boxAt(1.2,.8,.06,mBlack, 0,1.9,-.2));
    g.add(boxAt(1.1,.7,.02,mScreen, 0,1.9,-.15));
    g.add(boxAt(.15,.3,.15,mBlack, 0,1.5,-.2));
    g.add(boxAt(.7,.04,.25,mBlack, 0,1.37,.15));
    const cb = new T.Mesh(new T.SphereGeometry(.15,16,16), mCrBall);
    cb.position.set(.65,1.5,.1); cb.castShadow = true; g.add(cb);
    const cbb = new T.Mesh(new T.CylinderGeometry(.12,.15,.06,8), mGold);
    cbb.position.set(.65,1.37,.1); g.add(cbb);
    // incense
    (function() {
      const ig = new T.Group();
      ig.add(boxAt(.5,.06,.12,mWoodD, 0,.03,0));
      const stick = new T.Mesh(new T.CylinderGeometry(.015,.015,.6,4), mIncense);
      stick.position.set(.1,.25,0); stick.rotation.z = -.3; stick.castShadow = true; ig.add(stick);
      for (var i = 0; i < 3; i++) {
        const s = box(.04,.04,.04,mSmoke);
        s.position.set(.1+i*.05, .55+i*.15, (Math.random()-.5)*.1);
        s.userData.isSmoke = true; s.userData.baseY = s.position.y; s.userData.offset = i * .7;
        ig.add(s);
      }
      ig.position.set(-.6, 1.35, .2);
      g.add(ig);
    })();
    g.position.set(2, 0, -2.5);
    room.add(g);
  })();

  // ─── Chair ───
  (function() {
    const g = new T.Group();
    g.add(boxAt(.6,.08,.6,mWood, 0,.75,0));
    [[-.22,-.22],[.22,-.22],[-.22,.22],[.22,.22]].forEach(function(p) {
      const leg = box(.08,.75,.08,mWoodD); leg.position.set(p[0],.375,p[1]); g.add(leg);
    });
    g.add(boxAt(.6,.6,.08,mWood, 0,1.15,-.26));
    g.add(boxAt(.5,.08,.5,vm.cushion, 0,.83,.02));
    g.position.set(2, 0, -1.2); g.rotation.y = Math.PI;
    room.add(g);
  })();

  // ─── Side table + candles ───
  (function() {
    const g = new T.Group();
    g.add(boxAt(.7,.08,.7,mWoodD, 0,.8,0));
    g.add(boxAt(.12,.8,.12,mWood, 0,.4,0));
    g.add(boxAt(.5,.08,.5,mWood, 0,.04,0));
    g.add(mkCandle(.15,.84,.1,.4));
    g.add(mkCandle(-.15,.84,-.1,.55));
    g.position.set(-2.5, 0, 2.5);
    room.add(g);
  })();

  // ─── Floor candle holders ───
  function mkFloorCandle(x, z) {
    const g = new T.Group();
    const base = new T.Mesh(new T.CylinderGeometry(.15,.2,.1,8), mGold);
    base.position.set(0,.05,0); base.castShadow = true; g.add(base);
    const stem = new T.Mesh(new T.CylinderGeometry(.04,.06,.8,8), mGold);
    stem.position.set(0,.5,0); stem.castShadow = true; g.add(stem);
    const cup = new T.Mesh(new T.CylinderGeometry(.1,.04,.1,8), mGold);
    cup.position.set(0,.95,0); cup.castShadow = true; g.add(cup);
    g.add(mkCandle(0,1,0,.4));
    g.position.set(x, 0, z);
    return g;
  }
  room.add(mkFloorCandle(-3, -2));
  room.add(mkFloorCandle(3.2, 1));

  // ─── Plants ───
  function mkPlant(x, z) {
    const g = new T.Group();
    const pot = new T.Mesh(new T.CylinderGeometry(.25,.18,.4,8), vm.pot);
    pot.position.set(0,.2,0); pot.castShadow = true; g.add(pot);
    const soil = new T.Mesh(new T.CylinderGeometry(.23,.23,.05,8), mWoodD);
    soil.position.set(0,.4,0); g.add(soil);
    [[0,.6,0],[.12,.55,.08],[-.1,.58,-.08],[.05,.7,-.05],[-.08,.65,.06]].forEach(function(p) {
      const leaf = box(.15,.2,.15, Math.random() > .4 ? mPlantG : mPlantD);
      leaf.position.set(p[0],p[1],p[2]); leaf.rotation.y = Math.random()*Math.PI; g.add(leaf);
    });
    g.position.set(x, 0, z);
    return g;
  }
  room.add(mkPlant(3, -2.5));
  room.add(mkPlant(-3.2, 3));

  // ─── Meditation cushion ───
  (function() {
    const g = new T.Group();
    const base = new T.Mesh(new T.CylinderGeometry(.45,.5,.2,8), vm.cushion);
    base.position.set(0,.1,0); base.castShadow = true; base.receiveShadow = true; g.add(base);
    const tp = new T.Mesh(new T.CylinderGeometry(.35,.45,.12,8), vm.cushionAlt);
    tp.position.set(0,.26,0); tp.castShadow = true; g.add(tp);
    g.position.set(1, 0, 2);
    room.add(g);
  })();

  // ─── Extra bits ───
  const dRug = box(1.5,.03,1,vm.cushion);
  dRug.position.set(2,.015,-1.5); room.add(dRug);
  room.add(mkCrystals(-1.8, 3.1, -R/2+WT+.5));

  scene.add(room);

  // ─── Floating particles ───
  const particles = [];
  const pGeo = new T.BoxGeometry(.03,.03,.03);
  const pBaseMat = new T.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffaa00, emissiveIntensity: .8, transparent: true, opacity: .6 });
  for (var pi = 0; pi < 20; pi++) {
    const p = new T.Mesh(pGeo, pBaseMat.clone());
    p.position.set((Math.random()-.5)*6, 1+Math.random()*4, (Math.random()-.5)*6);
    p.userData.baseY = p.position.y;
    p.userData.speed = .3 + Math.random()*.5;
    p.userData.offset = Math.random()*Math.PI*2;
    p.userData.driftX = (Math.random()-.5)*.5;
    p.userData.driftZ = (Math.random()-.5)*.5;
    scene.add(p); particles.push(p);
  }

  // ─── Collect animatables ───
  const flames = [], smokePs = [];
  scene.traverse(function(c) {
    if (c.userData.isFlame) flames.push(c);
    if (c.userData.isSmoke) smokePs.push(c);
  });

  // ─── Animation loop ───
  const clock = new T.Clock();
  var animId;
  function animate() {
    animId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    for (var fi = 0; fi < flames.length; fi++) {
      const f = flames[fi];
      f.scale.set(.8+Math.sin(t*8+fi)*.2, .8+Math.sin(t*6+fi*.7)*.3, .8+Math.cos(t*7+fi*.5)*.2);
      f.position.x += Math.sin(t*10+fi)*.001;
    }
    for (var si = 0; si < smokePs.length; si++) {
      const s = smokePs[si];
      s.position.y = s.userData.baseY + Math.sin(t*.8+s.userData.offset)*.15;
      s.position.x += Math.sin(t*.5+s.userData.offset)*.001;
      s.material.opacity = .1 + Math.sin(t*.6+s.userData.offset)*.1;
    }
    for (var pj = 0; pj < particles.length; pj++) {
      const p = particles[pj], o = p.userData.offset;
      p.position.y = p.userData.baseY + Math.sin(t*p.userData.speed+o)*.5;
      p.position.x += Math.sin(t*.3+o)*.002*p.userData.driftX;
      p.position.z += Math.cos(t*.3+o)*.002*p.userData.driftZ;
      p.material.opacity = .3 + Math.sin(t*1.5+o)*.3;
      p.rotation.y = t*.5 + o;
    }
    warmGlow.intensity = .4 + Math.sin(t*2)*.15;
    renderer.render(scene, camera);
  }
  animate();

  // ─── Controller ───
  function setVibe(v) {
    const c = VIBES[v] || VIBES.mystic;
    vm.wallL.color.setHex(c.wallL);
    vm.wallR.color.setHex(c.wallR);
    vm.trim.color.setHex(c.trim);
    vm.carpet.color.setHex(c.carpet);
    vm.cushion.color.setHex(c.cushion);
    vm.cushionAlt.color.setHex(c.cushionAlt);
    vm.rugEdge.color.setHex(c.rugEdge);
    vm.pot.color.setHex(c.pot);
    scene.background.setHex(c.bg);
  }
  if (initialVibe) setVibe(initialVibe);

  function projectPoint(x, y, z) {
    const v = new T.Vector3(x, y, z).project(camera);
    return {
      sx: Math.round((v.x * .5 + .5) * W),
      sy: Math.round((-v.y * .5 + .5) * H),
    };
  }

  function dispose() {
    cancelAnimationFrame(animId);
    renderer.dispose();
    scene.traverse(function(c) {
      if (c.geometry) c.geometry.dispose();
      if (c.material) {
        if (Array.isArray(c.material)) c.material.forEach(function(mm) { mm.dispose(); });
        else c.material.dispose();
      }
    });
  }

  // ─── Placeable item factories ───
  const placedItems = {};

  function mkItemCrystal(id) {
    const g = new T.Group();
    const colors = {
      amethyst: { main: 0x9b6dd6, dark: 0x5a2c8a, emissive: 0x6a3d9a },
      quartz:   { main: 0xf4f0e0, dark: 0xb8b0a0, emissive: 0xddddcc },
      selenite: { main: 0xfefcf2, dark: 0xd8d2b8, emissive: 0xeeeedd },
      obsidian: { main: 0x1a1a26, dark: 0x000000, emissive: 0x222233 },
    };
    const c = colors[id] || colors.amethyst;
    const mat = new T.MeshStandardMaterial({ color: c.main, emissive: c.emissive, emissiveIntensity: .15, roughness: .3, metalness: .2 });
    const matD = new T.MeshStandardMaterial({ color: c.dark, roughness: .4 });
    // main crystal
    const geo = new T.ConeGeometry(.12, .55, 5);
    const m = new T.Mesh(geo, mat); m.position.set(0, .28, 0); m.castShadow = true; g.add(m);
    // small shard
    const s1 = new T.Mesh(new T.ConeGeometry(.06, .3, 4), mat);
    s1.position.set(.1, .15, .05); s1.rotation.z = .3; s1.castShadow = true; g.add(s1);
    const s2 = new T.Mesh(new T.ConeGeometry(.05, .25, 4), matD);
    s2.position.set(-.08, .13, -.04); s2.rotation.z = -.25; s2.castShadow = true; g.add(s2);
    // base
    const base = box(.2, .06, .2, matD); base.position.set(0, .03, 0); g.add(base);
    return g;
  }

  function mkItemCandle(id) {
    const g = new T.Group();
    const tall = id === 'candle-tall';
    const h = tall ? .6 : .35;
    const r = tall ? .06 : .1;
    // holder
    const holder = new T.Mesh(new T.CylinderGeometry(r + .04, r + .06, .08, 8), mGold);
    holder.position.set(0, .04, 0); holder.castShadow = true; g.add(holder);
    // wax
    const body = new T.Mesh(new T.CylinderGeometry(r, r, h, 8), mCandle);
    body.position.set(0, .08 + h / 2, 0); body.castShadow = true; g.add(body);
    // flame
    const fl = new T.Mesh(new T.ConeGeometry(.03, .1, 6), mFlame);
    fl.position.set(0, .08 + h + .05, 0); fl.userData.isFlame = true; g.add(fl);
    // glow
    const glow = new T.PointLight(0xffaa44, .3, 2);
    glow.position.set(0, .08 + h + .1, 0); g.add(glow);
    return g;
  }

  function mkItemIncense(id) {
    const g = new T.Group();
    // tray
    const tray = box(.35, .04, .1, mWoodD); tray.position.set(0, .02, 0); g.add(tray);
    // stick
    const stick = new T.Mesh(new T.CylinderGeometry(.012, .012, .45, 4), mIncense);
    stick.position.set(.08, .2, 0); stick.rotation.z = -.25; stick.castShadow = true; g.add(stick);
    // smoke puffs
    for (var i = 0; i < 3; i++) {
      var sp = new T.Mesh(new T.BoxGeometry(.03, .03, .03), mSmoke.clone());
      sp.position.set(.08 + i * .03, .42 + i * .12, (Math.random() - .5) * .06);
      sp.userData.isSmoke = true; sp.userData.baseY = sp.position.y; sp.userData.offset = i * .8;
      g.add(sp); smokePs.push(sp);
    }
    return g;
  }

  function mkItemTarot() {
    const g = new T.Group();
    var cardMat = new T.MeshStandardMaterial({ color: 0x1a1040, roughness: .5 });
    var cardBack = new T.MeshStandardMaterial({ color: 0x2a1850, roughness: .5 });
    // 3 cards on stand
    var stand = box(.5, .06, .3, mWoodD); stand.position.set(0, .03, 0); g.add(stand);
    for (var i = -1; i <= 1; i++) {
      var card = box(.12, .18, .01, i === 0 ? cardMat : cardBack);
      card.position.set(i * .15, .15, 0);
      card.rotation.z = i * .1;
      card.castShadow = true; g.add(card);
    }
    // gold trim on center card
    var trim = box(.13, .19, .005, mGold);
    trim.position.set(0, .15, .008); g.add(trim);
    return g;
  }

  function mkItemPlant(id) {
    const g = new T.Group();
    // pot
    var pot = new T.Mesh(new T.CylinderGeometry(.1, .08, .18, 6), vm.pot);
    pot.position.set(0, .09, 0); pot.castShadow = true; g.add(pot);
    var rim = new T.Mesh(new T.CylinderGeometry(.11, .1, .03, 6), vm.pot);
    rim.position.set(0, .19, 0); g.add(rim);
    // foliage
    var leafMat = new T.MeshStandardMaterial({ color: id === 'lavender' ? 0x7a6aaa : 0xd4c8a0, roughness: .7 });
    var stemMat = new T.MeshStandardMaterial({ color: 0x4a7a3a, roughness: .8 });
    for (var i = 0; i < 5; i++) {
      var angle = (i / 5) * Math.PI * 2;
      var stem = new T.Mesh(new T.CylinderGeometry(.01, .01, .25 + Math.random() * .15, 3), stemMat);
      stem.position.set(Math.cos(angle) * .04, .3, Math.sin(angle) * .04);
      stem.rotation.z = Math.cos(angle) * .3;
      stem.rotation.x = Math.sin(angle) * .3;
      g.add(stem);
      var leaf = new T.Mesh(new T.SphereGeometry(.05, 4, 4), leafMat);
      leaf.position.set(Math.cos(angle) * .08, .4 + Math.random() * .08, Math.sin(angle) * .08);
      leaf.castShadow = true; g.add(leaf);
    }
    return g;
  }

  function mkItemOrb() {
    const g = new T.Group();
    // base
    var base = new T.Mesh(new T.CylinderGeometry(.1, .12, .05, 8), mGold);
    base.position.set(0, .025, 0); g.add(base);
    var ring = new T.Mesh(new T.TorusGeometry(.1, .015, 8, 16), mGold);
    ring.position.set(0, .08, 0); ring.rotation.x = Math.PI / 2; g.add(ring);
    // sphere
    var orb = new T.Mesh(new T.SphereGeometry(.1, 16, 16), mCrBall);
    orb.position.set(0, .15, 0); orb.castShadow = true; g.add(orb);
    return g;
  }

  function mkItemWall(id) {
    const g = new T.Group();
    if (id === 'moon-art') {
      // frame
      g.add(boxAt(.6, .5, .04, mWoodD, 0, 0, 0));
      var inner = new T.MeshStandardMaterial({ color: 0x0a0a2a, roughness: .9 });
      g.add(boxAt(.52, .42, .02, inner, 0, 0, .02));
      // crescent moon
      var moon = new T.Mesh(new T.TorusGeometry(.1, .03, 8, 16, Math.PI * 1.4), mGold);
      moon.position.set(0, .05, .04); moon.rotation.z = .5; g.add(moon);
    } else {
      // star map frame
      g.add(boxAt(.55, .55, .04, mWoodD, 0, 0, 0));
      var bg = new T.MeshStandardMaterial({ color: 0x0e0e28, roughness: .9 });
      g.add(boxAt(.47, .47, .02, bg, 0, 0, .02));
      // stars as tiny cubes
      for (var i = 0; i < 8; i++) {
        var st = new T.Mesh(new T.BoxGeometry(.02, .02, .02),
          new T.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffaa00, emissiveIntensity: .5 }));
        st.position.set((Math.random() - .5) * .35, (Math.random() - .5) * .35, .04);
        g.add(st);
      }
    }
    return g;
  }

  function buildItem(itemId) {
    if (itemId.startsWith('candle')) return mkItemCandle(itemId);
    if (itemId.startsWith('incense')) return mkItemIncense(itemId);
    if (itemId === 'tarot-stand') return mkItemTarot();
    if (itemId === 'orb') return mkItemOrb();
    if (itemId === 'moon-art' || itemId === 'star-map') return mkItemWall(itemId);
    if (itemId === 'lavender' || itemId === 'pampas') return mkItemPlant(itemId);
    return mkItemCrystal(itemId);
  }

  function placeItem(zoneId, itemId, wx, wy, wz, isWall) {
    removeItem(zoneId);
    var g = buildItem(itemId);
    var sc = isWall ? 1.3 : 1.6;
    g.scale.set(sc, sc, sc);
    g.position.set(wx, wy, wz);
    if (isWall) {
      if (wx < 0) { g.rotation.y = Math.PI / 2; }
    }
    room.add(g);
    placedItems[zoneId] = g;
    // re-collect animatables
    flames.length = 0; smokePs.length = 0;
    scene.traverse(function(c) {
      if (c.userData.isFlame) flames.push(c);
      if (c.userData.isSmoke) smokePs.push(c);
    });
  }

  function removeItem(zoneId) {
    if (placedItems[zoneId]) {
      room.remove(placedItems[zoneId]);
      placedItems[zoneId].traverse(function(c) {
        if (c.geometry) c.geometry.dispose();
        if (c.material) c.material.dispose();
      });
      delete placedItems[zoneId];
    }
  }

  return { setVibe, projectPoint, placeItem, removeItem, dispose };
};

})();
