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
    ['Favorite favorite', 'Cats']
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
  wrap.style.cssText = 'position:fixed; left:0; bottom:8px; z-index:60; pointer-events:none; display:none; will-change:transform;';
  var sign = document.createElement('div');
  sign.style.cssText = "position:absolute; bottom:" + (bh + 18) + "px; left:" + (bw - 2 * px) + "px; transform:translateX(-50%); " +
    "background:#fff6ea; border:3px solid #2c211b; box-shadow:4px 4px 0 #2c211b; padding:7px 12px 8px; white-space:nowrap; text-align:center; image-rendering:pixelated;";
  var label = document.createElement('div');
  label.style.cssText = "font:600 10px/1.2 'Inter',system-ui,sans-serif; letter-spacing:0.12em; text-transform:uppercase; color:#b5583a;";
  var value = document.createElement('div');
  value.style.cssText = "font:800 22px/1 'Big Shoulders Display','Arial Narrow',sans-serif; text-transform:uppercase; letter-spacing:0.5px; color:#211d18; margin-top:3px;";
  sign.appendChild(label); sign.appendChild(value);
  var stick = document.createElement('div');
  stick.style.cssText = 'position:absolute; left:' + (bw - 3 * px) + 'px; bottom:' + (bh - 7 * px) + 'px; width:' + px + 'px; height:' + (7 * px + 21) + 'px; background:#2c211b;';
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
    var from = -bw - signHalf - 20, to = window.innerWidth + signHalf + 20;
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
  timer = setInterval(run, EVERY);
  return function () {
    clearInterval(timer); if (raf) cancelAnimationFrame(raf);
    if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
  };
}
// @@fact-runner-end
  startFactRunner(document.body);
})();
