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
  var EVERY = 15000, CROSS = 7000;
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
  wrap.style.cssText = 'position:absolute; left:0; bottom:4px; z-index:3; pointer-events:none; user-select:none; display:none; will-change:transform;';
  // 8-bit wooden plank sign: drawn pixel by pixel — jagged broken left end, arrow point on the right,
  // dark outline, a few grain dashes and nails, and a blocky 5x7 pixel font.
  // condensed 3px-wide pixel font (M, N, W a little wider), 7px tall
  var FONT = {
    "A":[".#.", "#.#", "#.#", "###", "#.#", "#.#", "#.#"],
    "B":["##.", "#.#", "#.#", "##.", "#.#", "#.#", "##."],
    "C":[".##", "#..", "#..", "#..", "#..", "#..", ".##"],
    "D":["##.", "#.#", "#.#", "#.#", "#.#", "#.#", "##."],
    "E":["###", "#..", "#..", "##.", "#..", "#..", "###"],
    "F":["###", "#..", "#..", "##.", "#..", "#..", "#.."],
    "G":[".##", "#..", "#..", "#.#", "#.#", "#.#", ".##"],
    "H":["#.#", "#.#", "#.#", "###", "#.#", "#.#", "#.#"],
    "I":["###", ".#.", ".#.", ".#.", ".#.", ".#.", "###"],
    "J":["..#", "..#", "..#", "..#", "..#", "#.#", ".#."],
    "K":["#.#", "#.#", "##.", "#..", "##.", "#.#", "#.#"],
    "L":["#..", "#..", "#..", "#..", "#..", "#..", "###"],
    "M":["#...#", "##.##", "#.#.#", "#.#.#", "#...#", "#...#", "#...#"],
    "N":["#..#", "##.#", "##.#", "#.##", "#.##", "#..#", "#..#"],
    "O":[".#.", "#.#", "#.#", "#.#", "#.#", "#.#", ".#."],
    "P":["##.", "#.#", "#.#", "##.", "#..", "#..", "#.."],
    "Q":[".#.", "#.#", "#.#", "#.#", "#.#", "##.", ".##"],
    "R":["##.", "#.#", "#.#", "##.", "#.#", "#.#", "#.#"],
    "S":[".##", "#..", "#..", ".#.", "..#", "..#", "##."],
    "T":["###", ".#.", ".#.", ".#.", ".#.", ".#.", ".#."],
    "U":["#.#", "#.#", "#.#", "#.#", "#.#", "#.#", "###"],
    "V":["#.#", "#.#", "#.#", "#.#", "#.#", ".#.", ".#."],
    "W":["#...#", "#...#", "#...#", "#.#.#", "#.#.#", "##.##", "#...#"],
    "X":["#.#", "#.#", "#.#", ".#.", "#.#", "#.#", "#.#"],
    "Y":["#.#", "#.#", "#.#", ".#.", ".#.", ".#.", ".#."],
    "Z":["###", "..#", "..#", ".#.", "#..", "#..", "###"],
    "0":[".#.", "#.#", "#.#", "#.#", "#.#", "#.#", ".#."],
    "1":[".#.", "##.", ".#.", ".#.", ".#.", ".#.", "###"],
    "2":["##.", "..#", "..#", ".#.", "#..", "#..", "###"],
    "3":["##.", "..#", "..#", ".#.", "..#", "..#", "##."],
    "4":["#.#", "#.#", "#.#", "###", "..#", "..#", "..#"],
    "5":["###", "#..", "#..", "##.", "..#", "..#", "##."],
    "6":[".##", "#..", "#..", "##.", "#.#", "#.#", ".#."],
    "7":["###", "..#", "..#", ".#.", ".#.", ".#.", ".#."],
    "8":[".#.", "#.#", "#.#", ".#.", "#.#", "#.#", ".#."],
    "9":[".#.", "#.#", "#.#", ".##", "..#", "..#", "##."],
    "\"":["#.#", "#.#", "...", "...", "...", "...", "..."],
    "'":["#", "#", ".", ".", ".", ".", "."],
    ".":[".", ".", ".", ".", ".", ".", "#"],
    "-":["...", "...", "...", "###", "...", "...", "..."],
    " ":["..", "..", "..", "..", "..", "..", ".."]
  };
  function glyph(ch) { ch = ch.toUpperCase(); if (ch === '“' || ch === '”') ch = '"'; if (ch === '’') ch = "'"; return FONT[ch] || FONT[' ']; }
  function textWidth(str) { var w = 0; for (var i = 0; i < str.length; i++) w += glyph(str.charAt(i))[0].length + 1; return Math.max(0, w - 1); }

  var SC = { line: '#5a2e1a', wood: '#d98a4e', light: '#eaa96e', grain: '#bf7039', nail: '#5a2e1a', label: '#7a3a1e', text: '#2c160c' };
  var sign = document.createElement('canvas');
  sign.style.cssText = 'position:absolute; left:' + (bw - 2 * px) + 'px; bottom:' + (bh + 12) + 'px; transform:translateX(-50%); image-rendering:pixelated;';
  var sctx = sign.getContext('2d');
  function drawSign(lab, val) {
    var tw = Math.max(textWidth(lab), textWidth(val));
    var H = 23, mid = (H - 1) / 2, body = tw + 13, point = 7;
    var Wd = body + point + 1;
    var mask = [], y, x;
    // jagged, broken-looking left edge (stepped, a little random) and an arrow point on the right
    var jag = [], j = 1;
    for (y = 0; y < H; y++) { if (y % 3 === 0) j = Math.max(0, Math.min(3, j + (Math.random() < 0.5 ? -1 : 1))); jag.push(j); }
    for (y = 0; y < H; y++) {
      mask.push([]);
      var right = body + Math.round(point * (1 - Math.abs(y - mid) / (mid + 1)));
      if (y === 0 || y === H - 1) right -= 2;
      for (x = 0; x < Wd; x++) mask[y].push(x >= jag[y] && x <= right);
    }
    // a chipped notch on the top edge
    var nx = 6 + Math.floor(Math.random() * Math.max(1, tw - 10));
    mask[0][nx] = mask[0][nx + 1] = mask[1][nx] = false;
    sign.width = Wd * px; sign.height = H * px;
    sign.style.width = Wd * px + 'px'; sign.style.height = H * px + 'px';
    sctx.clearRect(0, 0, sign.width, sign.height);
    function put(cx, cy, c) { sctx.fillStyle = c; sctx.fillRect(cx * px, cy * px, px, px); }
    function inside(cx, cy) { return cy >= 0 && cy < H && cx >= 0 && cx < Wd && mask[cy][cx]; }
    for (y = 0; y < H; y++) for (x = 0; x < Wd; x++) {
      if (!mask[y][x]) continue;
      var edge = !inside(x - 1, y) || !inside(x + 1, y) || !inside(x, y - 1) || !inside(x, y + 1);
      put(x, y, edge ? SC.line : (!inside(x, y - 2) ? SC.light : SC.wood));
    }
    // grain dashes + nails
    for (var g = 0; g < 6; g++) {
      var gy = [3, 10, 19][g % 3] + (g > 2 ? 1 : 0), gx = 4 + Math.floor(Math.random() * Math.max(1, body - 12)), gl = 2 + Math.floor(Math.random() * 4);
      for (x = gx; x < gx + gl; x++) if (inside(x, gy) && inside(x, gy - 1) && inside(x, gy + 1)) put(x, gy, SC.grain);
    }
    put(jag[Math.round(mid)] + 2, Math.round(mid), SC.nail); put(body - 1, Math.round(mid), SC.nail);
    // text: label line, then the fact
    function write(str, ty, col) {
      var cx = Math.round(6 + (tw - textWidth(str)) / 2);
      for (var i = 0; i < str.length; i++) {
        var gl2 = glyph(str.charAt(i));
        for (var r = 0; r < 7; r++) for (var c = 0; c < gl2[r].length; c++) if (gl2[r].charAt(c) === '#') put(cx + c, ty + r, col);
        cx += gl2[0].length + 1;
      }
    }
    write(lab, 3, SC.label);
    write(val, 13, SC.text);
  }
  var stick = document.createElement('div');
  stick.style.cssText = 'position:absolute; left:' + (bw - 4 * px) + 'px; bottom:' + (bh - 7 * px) + 'px; width:' + (2 * px) + 'px; height:' + (7 * px + 16) + 'px; background:#b8703f; border-left:' + px + 'px solid #5a2e1a; border-right:' + px + 'px solid #5a2e1a;';
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

  // Click the sign (or the bird) to stop it in its tracks; click again and it carries on.
  var raf = null, timer = null, running = false, paused = false, elapsed = 0, last = 0, from = 0, to = 0;
  [sign, canvas, stick].forEach(function (el) { el.style.pointerEvents = 'auto'; el.style.cursor = 'pointer'; });
  wrap.title = 'Click to stop / go';
  wrap.addEventListener('click', function () { if (running) { paused = !paused; last = 0; } });
  function place(f) {
    drawBird(f);
    var bob = (f === 1 ? -px : 0);
    wrap.style.transform = 'translate3d(' + (from + (to - from) * Math.min(1, elapsed / CROSS)).toFixed(1) + 'px,' + bob + 'px,0)';
  }
  function step(now) {
    if (!last) last = now;
    if (!paused) elapsed += now - last;
    last = now;
    if (elapsed >= CROSS) { wrap.style.display = 'none'; running = false; paused = false; return; }
    place(paused ? 0 : CYCLE[Math.floor(elapsed / 80) % CYCLE.length]);
    raf = requestAnimationFrame(step);
  }
  function run() {
    if (running || document.hidden) return;
    var fact = nextFact();
    drawSign(fact[0], fact[1]);
    wrap.style.display = 'block';
    var signHalf = sign.width / 2;
    from = -bw - signHalf - 20; to = host.clientWidth + signHalf + 20;
    running = true; paused = false; elapsed = 0; last = 0;
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
  timer = setInterval(function () { if (!running && Date.now() - lastRun >= EVERY - 50) run(); }, 1000);
  return function () {
    clearInterval(timer); clearTimeout(kick); if (io) io.disconnect(); if (raf) cancelAnimationFrame(raf);
    if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
  };
}
// @@fact-runner-end
  var foot = document.querySelector('.site-footer');
  if (foot) startFactRunner(foot);
})();
