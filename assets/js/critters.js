// 8-bit desert critters for the footer: a roadrunner that dashes across and a jackrabbit that hops the other way.
(function () {
  var canvas = document.querySelector('.critters');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var PAL = { K: '#3a2a22', R: '#b5583a', T: '#d29468', W: '#f7f3ec', D: '#7a3a25' };

  // Sprites face right; '.' is transparent.
  var RUNNER = [
    [
      '..........KK....',
      '.........KKK....',
      '........KKKKK...',
      '........KKWKKKKK',
      'K.......KKKK....',
      'KK.....KKKK.....',
      '.KK..KKKKKK.....',
      '..KKKKTKTKK.....',
      '...KKKKKKK......',
      '......K.K.......',
      '.....K...K......',
      '....KK...KK.....'
    ],
    [
      '..........KK....',
      '.........KKK....',
      '........KKKKK...',
      '........KKWKKKKK',
      'K.......KKKK....',
      'KK.....KKKK.....',
      '.KK..KKKKKK.....',
      '..KKKKTKTKK.....',
      '...KKKKKKK......',
      '......KK........',
      '.......KK.......',
      '......KK.KK.....'
    ]
  ];
  var RABBIT = [
    [ // crouched
      '..........R.R.',
      '..........R.R.',
      '..........RRR.',
      '.........RRRRR',
      '.........RRWRR',
      '..RRRRRRRRRRRD',
      '.RRRRRRRRRRR..',
      'RRRRRRRRRRR...',
      'TRRRRRRRRRR...',
      '.RRRRRRRRRR...',
      '..RRR..RRR....',
      '.DDDD..DDD....'
    ],
    [ // mid-leap
      '...........R.R',
      '...........R.R',
      '...........RRR',
      '..........RRRR',
      '..........RRWR',
      '...RRRRRRRRRRD',
      '.RRRRRRRRRRR..',
      'TRRRRRRRRRR...',
      'RRR......RRR..',
      'DD........RR..',
      '...........D..',
      '..............'
    ]
  ];

  var px = 4, W = 0, H = 0, dpr = 1;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    px = W < 640 ? 3 : 4;
  }
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
  function ground() {
    // dotted ASCII-style ground line the critters stand on
    ctx.fillStyle = '#c9b49a';
    var gy = H - 3;
    for (var x = 0; x < W; x += px * 3) ctx.fillRect(x, gy, px * 2, 2);
  }

  // Roadrunner: dash right, pause, dash again. Jackrabbit: hops left in arcs.
  var rr = { x: -80, state: 'run', t: 0, pause: 0 };
  var jr = { x: 0, hopT: 0, rest: 0 };
  function reset() { rr.x = -80; jr.x = W + 40; }

  var last = 0, running = false, visible = false;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function frame(now) {
    if (!running) return;
    var dt = Math.min(50, now - (last || now)); last = now;
    ctx.clearRect(0, 0, W, H);
    ground();
    var base = H - 4 - 12 * px;

    // roadrunner
    if (rr.pause > 0) { rr.pause -= dt; }
    else {
      rr.x += dt * 0.42;
      rr.t += dt;
      if (rr.x > W + 80) { rr.x = -80 - Math.random() * 200; }
      else if (Math.random() < 0.002 && rr.x > 40 && rr.x < W - 120) rr.pause = 600 + Math.random() * 900;
    }
    var legs = rr.pause > 0 ? 0 : Math.floor(rr.t / 80) % 2;
    sprite(RUNNER[legs], rr.x, base, false);

    // jackrabbit
    if (jr.rest > 0) {
      jr.rest -= dt;
      sprite(RABBIT[0], jr.x, base, true);
    } else {
      jr.hopT += dt;
      var d = 520, k = jr.hopT / d;
      if (k >= 1) { jr.hopT = 0; jr.rest = 250 + Math.random() * 1400; k = 1; }
      var lift = Math.sin(Math.PI * k) * 7 * px;
      jr.x -= dt * 0.16;
      if (jr.x < -80) jr.x = W + 40 + Math.random() * 240;
      sprite(RABBIT[k > 0.08 && k < 0.92 ? 1 : 0], jr.x, base - lift, true);
    }
    requestAnimationFrame(frame);
  }
  function start() { if (running || reduce) return; running = true; last = 0; requestAnimationFrame(frame); }
  function stop() { running = false; }
  function staticPose() {
    ctx.clearRect(0, 0, W, H); ground();
    var base = H - 4 - 12 * px;
    sprite(RUNNER[0], W * 0.18, base, false);
    sprite(RABBIT[0], W * 0.72, base, true);
  }

  resize(); reset();
  if (reduce) staticPose();
  window.addEventListener('resize', function () { resize(); if (reduce) staticPose(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; visible ? start() : stop(); }).observe(canvas);
  } else start();
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else if (visible) start(); });
})();
