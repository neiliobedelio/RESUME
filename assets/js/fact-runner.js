// Every 15 seconds a bigger, more detailed 8-bit roadrunner sprints along the bottom of the page
// (about 4 seconds edge to edge) holding a sign with a random fact about Neil.
(function () {
// @@fact-runner-start
function startFactRunner(host) {
  var FACTS = [
    ['Favorite genre of music', 'All genres'],
    ['Favorite athlete', 'Steph Curry'],
    ['Favorite hobby', 'Saturday morning basketball'],
    ['Years designing', '35'],
    ['Favorite favorite', 'Cats'],
    ['Favorite kung fu master', 'Bruce Lee'],
    ['Philosophy', '\u201cEmbrace the struggle\u201d']
  ];
  var EVERY = 15000, CROSS = 4000;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return function () {};

  var PAL = { K: '#2c211b', B: '#6b4a36', b: '#8a6448', T: '#d29468', W: '#f7f3ec', R: '#e0875c', Y: '#c98f3a' };
  var W32 = 32;
  var BODY = [
    '......................KK',
    '.....................KKK',
    '....................KKKKK',
    '...................KKBKKKK',
    '...................KBBBBKK',
    '..................KBBWKBBK',
    '..................KBRRBBBKKKKKK',
    '..................KBBBBBBKYYYYYK',
    'K.................KBBBBBKKKKKKK',
    'KK...............KBTTBBK',
    '.KK.............KBTTTBBK',
    '.KbK..........KKBTWTBBK',
    '..KbK.....KKKKBBTTTBBBK',
    '...KbK..KKBBBBWBBTTBBK',
    '....KbKKBBWBBbBBWBBBK',
    '.....KBBBBbBWBBBBBBK',
    '......KKBBWBBBbBWBK',
    '........KKKBBBBKKK'
  ];
  var LEGS = [
    ['..........K...K', '.........K.....K', '........K.......K', '.......K.........K', '......KK.........KK', '.....K.K.........K.K'],
    ['...........K.K', '...........K.K', '..........K...K', '..........K...K', '.........KK..KK', '........K.K.K.K'],
    ['...........KK', '..........K..K', '.........K....K', '........K......K', '.......KK.......KK', '......K.K.......K.K']
  ];
  function pad(r) { while (r.length < W32) r += '.'; return r; }
  var FRAMES = LEGS.map(function (legs) { return BODY.concat(legs).map(pad); });
  var CYCLE = [0, 1, 2, 1];

  var px = window.innerWidth < 640 ? 2 : 3;
  var bw = W32 * px, bh = FRAMES[0].length * px;

  var wrap = document.createElement('div');
  wrap.setAttribute('aria-hidden', 'true');
  wrap.style.cssText = 'position:absolute; left:0; bottom:4px; z-index:3; pointer-events:none; display:none; will-change:transform;';
  // Wooden plank sign: rough, uneven ends (pointing the way he runs) with a dark outline and wood grain.
  var SHAPE = 'polygon(3% 10%, 9% 4%, 30% 6%, 62% 0%, 86% 3%, 100% 52%, 88% 100%, 55% 95%, 22% 99%, 4% 93%, 7% 78%, 0% 63%, 6% 50%, 1% 34%, 5% 22%)';
  var sign = document.createElement('div');
  sign.style.cssText = 'position:absolute; bottom:' + (bh + 14) + 'px; left:' + (bw - 2 * px) + 'px; transform:translateX(-50%); ' +
    'filter: drop-shadow(2px 0 0 #6b3a22) drop-shadow(-2px 0 0 #6b3a22) drop-shadow(0 2px 0 #6b3a22) drop-shadow(0 -2px 0 #6b3a22) drop-shadow(3px 4px 0 rgba(60,30,18,0.35));';
  var plank = document.createElement('div');
  plank.style.cssText = 'clip-path:' + SHAPE + '; background: repeating-linear-gradient(176deg, rgba(122,58,37,0) 0 9px, rgba(122,58,37,0.16) 9px 10px, rgba(122,58,37,0) 10px 17px), linear-gradient(180deg, #e9a46a, #d98a4e); ' +
    'padding:9px 30px 10px 22px; white-space:nowrap; text-align:center; position:relative;';
  var label = document.createElement('div');
  label.style.cssText = "font:600 10px/1.2 'Inter',system-ui,sans-serif; letter-spacing:0.12em; text-transform:uppercase; color:#6b3a22;";
  var value = document.createElement('div');
  value.style.cssText = "font:800 22px/1 'Big Shoulders Display','Arial Narrow',sans-serif; text-transform:uppercase; letter-spacing:0.5px; color:#3a1f12; margin-top:3px;";
  var nailL = document.createElement('i'), nailR = document.createElement('i');
  [nailL, nailR].forEach(function (n, i) { n.style.cssText = 'position:absolute; top:50%; ' + (i ? 'right:20px;' : 'left:12px;') + ' width:4px; height:4px; margin-top:-2px; border-radius:50%; background:#8a4a28; box-shadow:0 0 0 1px rgba(255,220,180,0.35);'; });
  plank.appendChild(nailL); plank.appendChild(nailR); plank.appendChild(label); plank.appendChild(value);
  sign.appendChild(plank);
  var stick = document.createElement('div');
  stick.style.cssText = 'position:absolute; left:' + (bw - 3.5 * px) + 'px; bottom:' + (bh - 7 * px) + 'px; width:' + (2 * px) + 'px; height:' + (7 * px + 20) + 'px; background:#b8703f; box-shadow: 0 0 0 2px #6b3a22;';
  var canvas = document.createElement('canvas');
  canvas.width = bw; canvas.height = bh;
  canvas.style.cssText = 'display:block; width:' + bw + 'px; height:' + bh + 'px; image-rendering:pixelated;';
  wrap.appendChild(stick); wrap.appendChild(sign); wrap.appendChild(canvas);
  host.appendChild(wrap);
  var ctx = canvas.getContext('2d');

  function drawBird(f) {
    ctx.clearRect(0, 0, bw, bh);
    var rows = FRAMES[f];
    for (var r = 0; r < rows.length; r++) for (var c = 0; c < W32; c++) {
      var ch = rows[r].charAt(c);
      if (ch === '.') continue;
      ctx.fillStyle = PAL[ch]; ctx.fillRect(c * px, r * px, px, px);
    }
  }

  var bag = [];
  function nextFact() {
    if (!bag.length) { bag = FACTS.slice(); for (var i = bag.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = bag[i]; bag[i] = bag[j]; bag[j] = t; } }
    return bag.pop();
  }

  var raf = null, timer = null, t0 = 0, running = false;
  function run() {
    if (running || document.hidden) return;
    var fact = nextFact();
    label.textContent = fact[0]; value.textContent = fact[1];
    wrap.style.display = 'block';
    var signHalf = sign.offsetWidth / 2;
    var from = -bw - signHalf - 20, to = host.clientWidth + signHalf + 20;
    running = true; t0 = 0;
    function step(now) {
      if (!t0) t0 = now;
      var k = (now - t0) / CROSS;
      if (k >= 1) { wrap.style.display = 'none'; running = false; return; }
      var f = CYCLE[Math.floor((now - t0) / 70) % CYCLE.length];
      drawBird(f);
      var bob = (f === 1 ? -px : 0);
      wrap.style.transform = 'translate3d(' + (from + (to - from) * k).toFixed(1) + 'px,' + bob + 'px,0)';
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  var visible = false, lastRun = -Infinity, kick = null, io = null;
  var _run = run;
  run = function () { if (!visible) return; lastRun = Date.now(); _run(); };
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (e) {
      visible = e[0].isIntersecting;
      if (visible && Date.now() - lastRun > EVERY) { clearTimeout(kick); kick = setTimeout(run, 1200); }
    }, { threshold: 0.35 });
    io.observe(host);
  } else visible = true;
  timer = setInterval(function () { if (Date.now() - lastRun >= EVERY - 50) run(); }, 1000);
  return function () {
    clearInterval(timer); clearTimeout(kick); if (io) io.disconnect(); if (raf) cancelAnimationFrame(raf);
    if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
  };
}
// @@fact-runner-end
  var foot = document.querySelector('.site-footer');
  if (foot) startFactRunner(foot);
})();
