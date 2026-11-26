/* Easter egg: drag the page down past the top and HOLD. The page slides down to reveal an 8-bit, letterboxed
   anime-game cutscene in the gap: an extreme close-up of Neil's eyes opening... and transforming into a monster.
   Let go and the page springs back and the scene resets. Nothing is drawn over the page itself. */
(function () {
  if (window.nbPeek) return;
  var doc = document.documentElement;
  var css = '' +
    'html{overscroll-behavior-y:contain}' +
    '.nb-pull{position:fixed!important;top:0;left:0;right:0;height:0;overflow:hidden;z-index:1000!important;background:#0d0b0a;pointer-events:none;width:auto!important}' +
    '.nb-pull canvas{position:absolute;left:0;top:0;width:100%;height:100%;image-rendering:pixelated;image-rendering:crisp-edges}' +
    '.nb-pull:after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.22) 0 1px,transparent 1px 3px);mix-blend-mode:multiply}' +
    '.nb-pull-say{position:absolute;left:0;right:0;bottom:calc(var(--bar,6px) + 4px);text-align:center;font:400 9px/1.4 "Press Start 2P",monospace;letter-spacing:.06em;color:#fff8f2;text-shadow:2px 2px 0 #000;z-index:2;white-space:nowrap}' +
    '@media(min-width:861px){.nb-pull-say{font-size:12px}}' +
    '.nb-pull-say.hot{color:#ffcf3a}' +
    'body.nb-pulling .nav .nav-right{visibility:hidden}' +
    'body.nb-pulling>.nb-move{transform:translate3d(0,var(--nb-pull,0px),0)}' +
    'body.nb-release>.nb-move{transition:transform .38s cubic-bezier(.2,.8,.2,1)}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var box = document.createElement('div'); box.className = 'nb-pull'; box.setAttribute('aria-hidden', 'true');
  var cv = document.createElement('canvas'); box.appendChild(cv);
  var say = document.createElement('div'); say.className = 'nb-pull-say'; box.appendChild(say);
  var ctx = cv.getContext('2d');
  var reduce = matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fontLoaded = false;
  function loadFont() {
    if (fontLoaded) return; fontLoaded = true;
    var l = document.createElement('link'); l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'; document.head.appendChild(l);
  }

  // ---------- palette & helpers ----------
  function hex(h) { return [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16)]; }
  var C = {
    skin: hex('#c68a5e'), skinHi: hex('#dba27a'), skinLo: hex('#9c6443'), skinDeep: hex('#6f4530'),
    mSkin: hex('#3f6b47'), mSkinHi: hex('#6a9a55'), mSkinLo: hex('#24412f'), mScale: hex('#18301f'),
    sclera: hex('#f3ede2'), scleraLo: hex('#c9bfb0'), mSclera: hex('#f1d23a'), mScleraLo: hex('#b8801c'),
    iris: hex('#4a2c1c'), irisHi: hex('#7a4a2c'), mIris: hex('#e0261b'), mIrisHi: hex('#ff8a1f'),
    ink: hex('#120c09'), brow: hex('#2a1a12'), mBrow: hex('#5e0f12'), white: hex('#ffffff'), vein: hex('#c4301f'), black: hex('#000000')
  };
  var BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  function bayer(x, y) { return (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16; }

  var img = null, lw = 0, lh = 0, PX = 3;
  function setSize(w, h) {
    PX = w < 600 ? 3 : w < 1100 ? 5 : 7;
    var nw = Math.ceil(w / PX), nh = Math.max(1, Math.ceil(h / PX));
    if (nw !== lw || nh !== lh) { lw = nw; lh = nh; cv.width = lw; cv.height = lh; img = ctx.createImageData(lw, lh); }
  }
  function put(x, y, c) {
    x |= 0; y |= 0; if (x < 0 || y < 0 || x >= lw || y >= lh) return;
    var i = (y * lw + x) * 4, d = img.data; d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255;
  }
  function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }

  // ---------- the scene ----------
  // s = { open 0..1, look -1..1, m 0..1 (monster dither), glow 0..1, fade 0..1 (black→lit), shake px, flash bool }
  function scene(s) {
    var cx = lw / 2 + s.shake, cy = Math.round(lh / 2) + 1;
    var ew = Math.min(40, Math.round(lw * 0.24), Math.round(lh * 0.95)), eh = Math.round(ew * 0.42);
    var gap = Math.round(ew * 0.72), lx = cx - gap / 2 - ew / 2, rx = cx + gap / 2 + ew / 2;
    for (var y = 0; y < lh; y++) for (var x = 0; x < lw; x++) {
      var mon = bayer(x, y) < s.m;
      // skin with a soft pixel vignette and, once monstrous, a diamond scale pattern
      var dxn = (x - cx) / (lw / 2), dyn = (y - cy) / (lh / 2 + 6), v = dxn * dxn * .55 + dyn * dyn * .6;
      var c;
      if (mon) {
        var sc = ((x + y * 2) % 8 === 0) || ((x - y * 2 + 64) % 8 === 0);
        c = sc ? C.mScale : (v > .55 ? C.mSkinLo : (y < cy - eh && bayer(x, y) < .25 ? C.mSkinHi : C.mSkin));
      } else {
        c = v > .7 ? C.skinDeep : v > .45 ? (bayer(x, y) < (v - .45) * 3 ? C.skinLo : C.skin) : (dyn < -.35 && bayer(x, y) < .3 ? C.skinHi : C.skin);
      }
      put(x, y, c);
    }
    // nose bridge shadow between the eyes
    for (var y2 = cy - 2; y2 < lh; y2++) put(cx + 2, y2, bayer(cx, y2) < s.m ? C.mSkinLo : C.skinLo);
    eye(lx, cy, ew, eh, s, -1); eye(rx, cy, ew, eh, s, 1);
    // letterbox bars
    var bar = Math.max(2, Math.round(lh * 0.08));
    for (var by = 0; by < bar; by++) for (var bx = 0; bx < lw; bx++) { put(bx, by, C.black); put(bx, lh - 1 - by, C.black); }
    box.style.setProperty('--bar', (bar * PX) + 'px');
    // fade-in from black, done as a dither so it stays 8-bit
    if (s.fade < 1) for (var fy = 0; fy < lh; fy++) for (var fx = 0; fx < lw; fx++) if (bayer(fx, fy) >= s.fade) put(fx, fy, C.black);
    if (s.flash) for (var qy = 0; qy < lh; qy++) for (var qx = 0; qx < lw; qx++) if (bayer(qx, qy) < .75) put(qx, qy, C.white);
    ctx.putImageData(img, 0, 0);
  }
  function eye(ex, ey, w, h, s, side) {
    var half = w / 2, o = s.open, m = s.m;
    // brow: thick, slanting down toward the nose; sharper and redder as he turns
    var tilt = 0.12 + 0.28 * m;
    for (var x = -half - 2; x <= half + 1; x++) {
      var t = (x * side + half) / w;                       // 0 at the nose side, 1 at the temple
      var by = ey - h * 0.95 - 3 - Math.round((1 - t) * -tilt * w * 0.5) - Math.round(t * 2) + Math.round(tilt * w * 0.5 * (1 - t));
      var thick = 3 + (m > .5 ? 1 : 0) - (t > .85 ? 1 : 0);
      for (var k = 0; k < thick; k++) put(ex + x, by + k, bayer(ex + x, by + k) < m ? C.mBrow : C.brow);
    }
    // almond shape; lids close vertically
    for (var x2 = -half; x2 <= half; x2++) {
      var u = Math.abs(x2) / half, shape = Math.pow(Math.max(0, 1 - u * u), 0.75);
      var top = Math.round(-h * 0.55 * shape * o), bot = Math.round(h * 0.42 * shape * o);
      var px = ex + x2;
      if (o > 0.05) for (var y = top; y <= bot; y++) {
        var py = ey + y, mon = bayer(px, py) < m;
        var c = mon ? (y > bot - 2 ? C.mScleraLo : C.mSclera) : (y < top + 2 ? C.scleraLo : C.sclera);
        // veins creep in from the corners during the change
        if (m > 0.15 && u > 0.55 && ((x2 * 3 + y * 5) & 7) === 0 && bayer(px, py) < m * 1.2) c = C.vein;
        // iris & pupil
        var ix = x2 - Math.round(s.look * half * 0.42), iy = y + 1;
        var ir = Math.round(h * 0.55), d2 = ix * ix + iy * iy;
        if (d2 <= ir * ir) {
          c = mon ? mix(C.mIris, C.mIrisHi, s.glow * (d2 > (ir - 2) * (ir - 2) ? 1 : 0.4)) : (d2 > (ir - 1.5) * (ir - 1.5) ? C.iris : (iy < 0 ? C.irisHi : C.iris));
          var pr = Math.max(1, Math.round(ir * 0.45));
          var inPupil = m > 0.5 ? (Math.abs(ix) < (m > .8 ? 0.8 : 1.3) && Math.abs(iy) <= ir - 1) : (d2 <= pr * pr);
          if (inPupil) c = C.ink;
        }
        put(px, py, c);
      }
      // upper lash line: thick ink, with an anime wing at the outer corner
      var ly = ey + top - 1;
      put(px, ly, C.ink); put(px, ly - 1, C.ink); if (u < .7) put(px, ly - 2, C.ink);
      if (o > 0.05) put(px, ey + bot + 1, bayer(px, ey) < m ? C.mSkinLo : C.skinLo);
    }
    // wing flick at the temple
    var wx = ex + side * (half + 1);
    for (var k2 = 0; k2 < 4; k2++) { put(wx + side * k2, ey - 1 - k2, C.ink); put(wx + side * k2, ey - 2 - k2, C.ink); }
    // catch-lights (classic anime sparkle), gone once he's a monster
    if (o > 0.6 && m < 0.6) {
      var hx = ex + Math.round(s.look * half * 0.42) - 2, hy = ey - Math.round(h * 0.25);
      put(hx, hy, C.white); put(hx + 1, hy, C.white); put(hx, hy + 1, C.white); put(hx + 1, hy + 1, C.white); put(hx + 3, hy + 3, C.white);
    }
    // monster glow halo
    if (m > 0.8 && s.glow > 0.5) for (var gx = -2; gx <= 2; gx++) put(ex + Math.round(s.look * half * 0.42) + gx, ey - Math.round(h * 0.55) - 2, C.mIrisHi);
  }

  // ---------- timeline (only advances while held open) ----------
  function step(n, t) { return Math.floor(Math.min(1, Math.max(0, t)) * n) / n; }
  function stateAt(t) {
    var s = { open: 0, look: 0, m: 0, glow: 0, fade: 1, shake: 0, flash: false };
    s.fade = step(4, t / 0.5);
    s.open = step(4, (t - 0.55) / 0.8);
    if (t > 1.5 && t < 1.8) s.look = -1; else if (t > 1.8 && t < 2.1) s.look = 1;
    if (t > 2.2 && t < 2.32) s.open = 0.25;                       // blink
    if (t > 2.5) s.open = 1;
    if (t > 2.6 && t < 2.68 && !reduce) s.flash = true;
    s.m = step(8, (t - 2.65) / 0.9);
    if (!reduce && t > 2.6 && t < 3.6) s.shake = ((t * 30) | 0) % 2 ? 1 : -1;
    s.glow = t > 3.5 ? (Math.sin(t * 7) > 0 ? 1 : 0.6) : 0;
    if (t > 3.6) s.look = Math.sin(t * 1.3) > 0.6 ? 0.6 : Math.sin(t * 1.3) < -0.6 ? -0.6 : 0;
    return s;
  }
  function caption(t, pull, need) {
    if (pull < need) { say.className = 'nb-pull-say'; return pull > 40 ? 'KEEP PULLING...' : ''; }
    if (t < 0.6) return '. . .';
    if (t < 1.4) return '...WHO WOKE ME?';
    if (t < 2.5) return 'OH. IT’S YOU.';
    if (t < 3.5) { say.className = 'nb-pull-say hot'; return '!!!'; }
    say.className = 'nb-pull-say hot'; return 'BOSS BATTLE: SENIOR DESIGNER';
  }

  // ---------- pulling the page down ----------
  var pull = 0, held = 0, last = 0, raf = 0, movers = [], active = false;
  function maxPull() { return Math.min(260, Math.round(innerHeight * 0.36)); }
  function begin() {
    if (active) return; active = true; loadFont();
    if (!box.parentNode) document.body.appendChild(box);
    movers = [].filter.call(document.body.children, function (el) {
      if (el === box || el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'LINK') return false;
      return getComputedStyle(el).position !== 'fixed';
    });
    movers.forEach(function (el) { el.classList.add('nb-move'); });
    document.body.classList.remove('nb-release'); document.body.classList.add('nb-pulling');
    held = 0; last = performance.now(); raf = requestAnimationFrame(tick);
  }
  function setPull(px) {
    pull = Math.max(0, Math.min(maxPull(), px));
    document.body.style.setProperty('--nb-pull', pull + 'px');
    box.style.height = pull + 'px';
  }
  function end() {
    if (!active) return;
    document.body.classList.add('nb-release'); setPull(0);
    setTimeout(function () {
      if (pull > 0) return;
      active = false; cancelAnimationFrame(raf);
      document.body.classList.remove('nb-pulling', 'nb-release');
      movers.forEach(function (el) { el.classList.remove('nb-move'); }); movers = [];
      held = 0;
    }, 400);
  }
  function tick(now) {
    var dt = Math.min(0.1, (now - last) / 1000); last = now;
    var need = maxPull() * 0.62;
    if (pull >= need) held += dt; else held = Math.max(0, held - dt * 3);   // let go a little and it rewinds
    if (pull > 0) {
      setSize(innerWidth, pull);
      scene(stateAt(held));
      var txt = caption(held, pull, need); if (say.textContent !== txt) say.textContent = txt;
    }
    if (active) raf = requestAnimationFrame(tick);
  }
  function resist(d) { var M = maxPull(); return M * (1 - Math.exp(-d / (M * 1.1))); }

  // at the very top? (checks the page and any scrolling box the gesture started in)
  function atTop(t) {
    if (scrollY > 0) return false;
    for (var n = t; n && n.nodeType === 1 && n !== document.body; n = n.parentElement) {
      if (n.scrollTop > 0) { var oy = getComputedStyle(n).overflowY; if (oy === 'auto' || oy === 'scroll') return false; }
    }
    return true;
  }

  // touch: drag down from the very top and hold
  var y0 = null;
  addEventListener('touchstart', function (e) { y0 = (e.touches.length === 1 && atTop(e.target)) ? e.touches[0].clientY : null; }, { passive: true });
  addEventListener('touchmove', function (e) {
    if (y0 === null) return;
    var d = e.touches[0].clientY - y0;
    if (d <= 0 || !atTop(e.target)) { if (active) setPull(0); return; }
    if (e.cancelable) e.preventDefault();          // our pull replaces the browser's rubber-band
    begin(); setPull(resist(d));
  }, { passive: false });
  addEventListener('touchend', function () { y0 = null; end(); }, { passive: true });
  addEventListener('touchcancel', function () { y0 = null; end(); }, { passive: true });

  // mouse wheel / trackpad: keep scrolling up at the top to pull it open; stop and it springs back
  var topSince = scrollY <= 0 ? Date.now() - 1000 : 0, acc = 0, idle = 0;
  addEventListener('scroll', function (e) { var t = e.target && e.target.nodeType === 1 ? e.target : null; var y = t ? t.scrollTop : scrollY; if (y <= 0) { if (!topSince) topSince = Date.now(); } else { topSince = 0; } }, { passive: true, capture: true });
  addEventListener('wheel', function (e) {
    if (!atTop(e.target) || !topSince || Date.now() - topSince < 450) return;
    var dy = e.deltaY * (e.deltaMode === 1 ? 33 : 1);
    if (dy >= 0 && !active) return;
    e.preventDefault();
    if (!active) { acc = 0; begin(); }
    acc = Math.max(0, acc - dy * 0.9); setPull(resist(acc));
    if (acc <= 0) { end(); return; }
    clearTimeout(idle); idle = setTimeout(end, 700);
  }, { passive: false });

  window.nbPeek = function (ms) {                       // console/test helper: open and hold for ms
    begin(); setPull(maxPull()); setTimeout(end, ms || 6000);
  };
})();
