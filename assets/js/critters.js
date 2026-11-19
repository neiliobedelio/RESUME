// 8-bit desert strip for the footer: rocks, agave, quail and a lizard placed at random,
// plus a roadrunner and a jackrabbit who wander until the roadrunner spots the rabbit,
// then chase each other back and forth a few times before going back to minding their own business.
(function () {
// @@critters-start
function startCritters(canvas) {
  var ctx = canvas.getContext('2d');
  var PAL = {
    K: '#3a2a22', R: '#b5583a', T: '#d29468', W: '#f7f3ec', D: '#7a3a25',
    G: '#b3a08a', S: '#8a7a68', H: '#d4c4ae',            // rocks
    A: '#7f9a6a', a: '#5d7a4f',                         // agave
    L: '#9a7444', l: '#6e5232',                         // lizard
    Q: '#6d5a4a', q: '#4a3c31', B: '#b8a48c',           // quail
    Y: '#e0875c'                                        // "!" when spotted
  };

  var RUNNER = [
    ['..........KK....', '.........KKK....', '........KKKKK...', '........KKWKKKKK', 'K.......KKKK....', 'KK.....KKKK.....',
     '.KK..KKKKKK.....', '..KKKKTKTKK.....', '...KKKKKKK......', '......K.K.......', '.....K...K......', '....KK...KK.....'],
    ['..........KK....', '.........KKK....', '........KKKKK...', '........KKWKKKKK', 'K.......KKKK....', 'KK.....KKKK.....',
     '.KK..KKKKKK.....', '..KKKKTKTKK.....', '...KKKKKKK......', '......KK........', '.......KK.......', '......KK.KK.....']
  ];
  var RABBIT = [
    ['..........R.R.', '..........R.R.', '..........RRR.', '.........RRRRR', '.........RRWRR', '..RRRRRRRRRRRD',
     '.RRRRRRRRRRR..', 'RRRRRRRRRRR...', 'TRRRRRRRRRR...', '.RRRRRRRRRR...', '..RRR..RRR....', '.DDDD..DDD....'],
    ['...........R.R', '...........R.R', '...........RRR', '..........RRRR', '..........RRWR', '...RRRRRRRRRRD',
     '.RRRRRRRRRRR..', 'TRRRRRRRRRR...', 'RRR......RRR..', 'DD........RR..', '...........D..', '..............']
  ];
  // sitting up (ears up / one ear flopped), shown while the rabbit takes a break
  var RABBIT_SIT = [
    ['.......R.R....', '.......R.R....', '.......R.R....', '.......RRR....', '......RRRRR...', '......RRWRRD..', '.....RRRRRR...',
     '....RRRRRR....', '...RRRRRRR....', '..TRRRRRRR....', '...RRRRRRR....', '...DDD.DDD....'],
    ['........R.....', '.......R.R....', '.......R.R....', '.......RRR....', '......RRRRR...', '......RRWRRD..', '.....RRRRRR...',
     '....RRRRRR....', '...RRRRRRR....', '..TRRRRRRR....', '...RRRRRRR....', '...DDD.DDD....']
  ];
  var ROCKS = [
    ['...GGGG...', '..GHHGGG..', '.GHGGGGSG.', 'GGGGGGGSSG', 'SSSSSSSSSS'],
    ['..GGG..', '.GHGGS.', 'GGGGGSS', 'SSSSSSS'],
    ['.....GGGG.....', '...GGHHGGGG...', '..GHHGGGGGSG..', '.GGGGGGGGGSSG.', 'GGGGGGGGGGGSSG', 'SSSSSSSSSSSSSS']
  ];
  var AGAVE = [
    ['......A......', '...A..A..A...', '....A.A.A....', 'A...AaAaA...A', '.A..AaAaA..A.', '..AAaAAAaAA..', '...AAaAaAA...', '....AaAaA....', '.....AAA.....'],
    ['....A....', '.A..A..A.', '..A.A.A..', 'A.AaAaA.A', '.AAaAaAA.', '..AaAaA..', '...AAA...']
  ];
  var LIZARD = [
    ['............', '........LLl.', 'LLLL.LLLLLLL', '....l..l....'],
    ['........LLl.', '.......LLLL.', 'LLLL.LLLL...', '....l..l....']
  ];
  var QUAIL = [
    ['..q.....', '.qQ.....', '.QQQ....', 'QQWQBBB.', '.QQQBBBB', '..QQQQQ.', '...q.q..'],
    ['........', '..q.....', '.qQ.....', '.QQQBBB.', 'QWQQBBBB', '..QQQQQ.', '...q.q..']
  ];
  var BANG = ['YY', 'YY', 'YY', '..', 'YY'];

  var px = 4, W = 0, H = 0, ground = 0;
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    px = W < 640 ? 3 : 4;
    ground = H - 6;
  }
  function wOf(rows) { return rows[0].length * px; }
  function hOf(rows) { return rows.length * px; }
  function sprite(rows, x, y, flip) {
    var w = rows[0].length;
    for (var r = 0; r < rows.length; r++) {
      for (var c = 0; c < w; c++) {
        var ch = rows[r].charAt(flip ? w - 1 - c : c);
        if (ch === '.') continue;
        ctx.fillStyle = PAL[ch];
        ctx.fillRect(Math.round(x + c * px), Math.round(y + r * px), px, px);
      }
    }
  }
  function onGround(rows, x, flip, lift) { sprite(rows, x, ground - hOf(rows) - (lift || 0), flip); }

  // ---- random scenery (new arrangement every visit) ----
  var props = [], fauna = [];
  function layout() {
    props = []; fauna = [];
    var slots = Math.max(5, Math.floor(W / 150));
    for (var i = 0; i < slots; i++) {
      var x = (i + 0.15 + Math.random() * 0.7) * (W / slots);
      var kind = Math.random() < 0.5 ? 'rock' : 'agave';
      var rows = kind === 'rock' ? ROCKS[Math.floor(Math.random() * ROCKS.length)] : AGAVE[Math.floor(Math.random() * AGAVE.length)];
      props.push({ rows: rows, x: Math.round(x - wOf(rows) / 2), kind: kind });
    }
    // a lizard basking on top of one rock
    var rock = props.filter(function (p) { return p.kind === 'rock'; })[0] || props[0];
    fauna.push({ type: 'lizard', x: rock.x + wOf(rock.rows) / 2 - wOf(LIZARD[0]) / 2, perch: hOf(rock.rows) - px, t: Math.random() * 3000, flip: Math.random() < 0.5 });
    // a couple of quail pecking around
    for (var q = 0; q < 2; q++) fauna.push({ type: 'quail', x: Math.random() * (W - 40), dir: Math.random() < 0.5 ? 1 : -1, t: Math.random() * 2000, peck: 0 });
  }
  function groundLine() {
    ctx.fillStyle = '#c9b49a';
    for (var x = 0; x < W; x += px * 3) ctx.fillRect(x, ground, px * 2, 2);
  }

  // ---- the two leads ----
  var rr = { x: 0, dir: 1, t: 0, pause: 0, bang: 0 };
  var jr = { x: 0, dir: -1, hopT: 0, rest: 0, lift: 0, fast: false, sit: 0, sitT: 0 };
  var chase = null, cooldown = 4000;
  function placeLeads() {
    rr.x = W * 0.12; rr.dir = 1; rr.pause = 0;
    jr.x = W * 0.8; jr.dir = -1; jr.rest = 600;
  }

  function hop(dt, speed, period) {
    if (jr.sit > 0) { jr.sit -= dt; jr.sitT += dt; jr.lift = 0; return; }
    if (jr.rest > 0) { jr.rest -= dt; jr.lift = 0; return; }
    jr.hopT += dt;
    var k = jr.hopT / period;
    if (k >= 1) { jr.hopT = 0; k = 0; if (!jr.fast) { jr.rest = 250 + Math.random() * 1400; if (Math.random() < 0.15) jr.dir *= -1; if (Math.random() < 0.22) { jr.sit = 2500 + Math.random() * 3500; jr.sitT = 0; } } }
    jr.lift = Math.sin(Math.PI * k) * (jr.fast ? 9 : 7) * px;
    jr.x += jr.dir * dt * speed;
  }
  function bounce(o, w) {
    if (o.x < 8) { o.x = 8; o.dir = 1; }
    if (o.x > W - w - 8) { o.x = W - w - 8; o.dir = -1; }
  }

  function step(dt) {
    var rw = wOf(RUNNER[0]), jw = wOf(RABBIT[0]);
    if (!chase) {
      cooldown -= dt;
      // roadrunner wanders: trots, pauses, sometimes turns around
      if (rr.pause > 0) rr.pause -= dt;
      else {
        rr.x += rr.dir * dt * 0.18; rr.t += dt;
        if (Math.random() < 0.003) rr.pause = 500 + Math.random() * 1200;
        if (Math.random() < 0.0015) rr.dir *= -1;
      }
      bounce(rr, rw);
      hop(dt, 0.12, 520);
      bounce(jr, jw);
      // does the roadrunner see the rabbit? (facing it and fairly close)
      var gap = (jr.x - rr.x) * rr.dir;
      if (cooldown <= 0 && gap > 0 && gap < Math.min(320, W * 0.45)) {
        chase = { legs: 0, maxLegs: 3 + Math.floor(Math.random() * 2), leader: 'jr', wait: 650 };
        rr.bang = 650; rr.pause = 0;
      }
    } else if (chase.wait > 0) {
      chase.wait -= dt;               // the "!" beat before the chase
      if (chase.wait <= 0) { jr.dir = rr.dir; jr.fast = true; jr.rest = 0; jr.sit = 0; }
    } else {
      // whoever leads runs flat out; the other follows; at the wall they swap roles and come back
      var d = rr.dir; rr.t += dt;
      rr.x += d * dt * (chase.leader === 'rr' ? 0.5 : 0.44);
      hop(dt, chase.leader === 'jr' ? 0.5 : 0.44, 300);
      jr.dir = d;
      var front = chase.leader === 'jr' ? jr : rr, fw = chase.leader === 'jr' ? jw : rw;
      if ((d > 0 && front.x > W - fw - 8) || (d < 0 && front.x < 8)) {
        chase.legs++;
        rr.dir *= -1; jr.dir = rr.dir;
        chase.leader = chase.leader === 'jr' ? 'rr' : 'jr';
        if (chase.legs >= chase.maxLegs) {
          chase = null; jr.fast = false; jr.rest = 900; rr.pause = 1200;
          jr.dir = -rr.dir; cooldown = 20000 + Math.random() * 15000;
        }
      }
      rr.x = Math.max(4, Math.min(W - rw - 4, rr.x));
      jr.x = Math.max(4, Math.min(W - jw - 4, jr.x));
    }
    if (rr.bang > 0) rr.bang -= dt;

    // small fauna
    fauna.forEach(function (f) {
      f.t += dt;
      if (f.type === 'quail') {
        if (f.peck > 0) f.peck -= dt;
        else {
          f.x += f.dir * dt * 0.03;
          if (Math.random() < 0.004) f.peck = 400 + Math.random() * 700;
          if (Math.random() < 0.002 || f.x < 4 || f.x > W - 40) f.dir *= -1;
        }
      }
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    groundLine();
    props.forEach(function (p) { onGround(p.rows, p.x, false); });
    fauna.forEach(function (f) {
      if (f.type === 'lizard') {
        var up = Math.floor(f.t / 700) % 4 === 1; // occasional push-up
        sprite(LIZARD[up ? 1 : 0], f.x, ground - f.perch - hOf(LIZARD[0]), f.flip);
      } else {
        var bob = f.peck > 0 ? (Math.floor(f.t / 160) % 2) : 0;
        onGround(QUAIL[bob], f.x, f.dir < 0);
      }
    });
    var moving = rr.pause <= 0 && !(chase && chase.wait > 0);
    var legs = moving ? Math.floor(rr.t / (chase ? 60 : 110)) % 2 : 0;
    onGround(RUNNER[legs], rr.x, rr.dir < 0);
    if (rr.bang > 0) sprite(BANG, rr.x + (rr.dir > 0 ? 9 : 4) * px, ground - hOf(RUNNER[0]) - 7 * px, false);
    if (jr.sit > 0) {
      var flop = Math.floor(jr.sitT / 900) % 3 === 2; // ear twitch now and then
      onGround(RABBIT_SIT[flop ? 1 : 0], jr.x, jr.dir < 0);
    } else {
      var airborne = jr.lift > px;
      onGround(RABBIT[airborne ? 1 : 0], jr.x, jr.dir < 0, jr.lift);
    }
  }

  var last = 0, running = false, visible = false;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function frame(now) {
    if (!running) return;
    var dt = Math.min(50, now - (last || now)); last = now;
    step(dt); draw();
    requestAnimationFrame(frame);
  }
  function start() { if (running || reduce) return; running = true; last = 0; requestAnimationFrame(frame); }
  function stop() { running = false; }

  resize(); layout(); placeLeads(); draw();
  function onResize() { var oldW = W; resize(); if (Math.abs(W - oldW) > 40) { layout(); placeLeads(); } draw(); }
  window.addEventListener('resize', onResize);
  var io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (e) { visible = e[0].isIntersecting; visible ? start() : stop(); });
    io.observe(canvas);
  } else start();
  function onVis() { if (document.hidden) stop(); else if (visible) start(); }
  document.addEventListener('visibilitychange', onVis);
  return function () { stop(); if (io) io.disconnect(); document.removeEventListener('visibilitychange', onVis); window.removeEventListener('resize', onResize); };
}
// @@critters-end
  var el = document.querySelector('.critters');
  if (el) startCritters(el);
})();
