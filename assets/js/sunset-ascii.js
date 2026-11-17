// ASCII sunset backdrop: a scroll-driven take on Giedre Ju's "Sunset Waves Scroll" (CodePen), drawn as colored characters.
(function () {
  var WAVES = [
    { base: 46, swing: 4, speed: 1, step: 14, bg: '#d39467', fg: '#f7dcbf', ramp: '-~=' },
    { base: 38, swing: 5, speed: -1, step: 18, bg: '#a65f3f', fg: '#f0b48c', ramp: '=+*' },
    { base: 30, swing: 6, speed: 2, step: 22, bg: '#4a3026', fg: '#d0915f', ramp: '*#%' },
    { base: 22, swing: 6, speed: -2, step: 26, bg: '#f2ebe0', fg: '#bfa585', ramp: '.:-' }
  ];
  var BARS = 60;
  WAVES.forEach(function (w) {
    w.amp = []; w.off = [];
    for (var i = 0; i < BARS; i++) { w.amp.push(0.5 + Math.random() * 0.4); w.off.push((Math.random() * 10 - 5) * Math.PI / 180); }
  });
  var SKY_RAMP = '.·:-=+*';
  var SUN_RAMP = '%#@#%';

  function hex(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function rgb(c) { return 'rgb(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ')'; }
  function hash(x, y) { var n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return n - Math.floor(n); }
  var SKY = [hex('#f6e7cf'), hex('#ecc9a2'), hex('#c98a5e')];
  var SUN = hex('#a94f32'), SUN_HI = hex('#ffc9a3'), SUN_LO = hex('#e98a5f');

  var scene = document.createElement('div');
  scene.className = 'sunset';
  scene.setAttribute('aria-hidden', 'true');
  var canvas = document.createElement('canvas');
  canvas.className = 'sunset-canvas';
  scene.appendChild(canvas);
  var name = document.createElement('div');
  name.className = 'sunset-name';
  name.innerHTML = '<p class="k">Art Director · Brand Architect</p><p class="n">Neil Bernardo</p>';
  scene.appendChild(name);
  document.body.insertBefore(scene, document.body.firstChild);
  document.body.classList.add('has-sunset');
  var ctx = canvas.getContext('2d');
  var W = 0, H = 0, cw = 0, ch = 0, cols = 0, rows = 0, font = '';

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var size = W < 640 ? 11 : 13;
    font = size + 'px "SF Mono", Menlo, Consolas, monospace';
    ctx.font = font;
    cw = Math.ceil(ctx.measureText('M').width); ch = Math.round(size * 1.15);
    cols = Math.ceil(W / cw); rows = Math.ceil(H / ch);
    ctx.textBaseline = 'top';
  }

  function draw(p) {
    var vh = H / 100, a = p * 1440 * Math.PI / 180;
    var mobile = W < 860;
    var sunX = W / 2, sunY = (mobile ? 42 : 46) * vh + p * 42 * vh, sunR = (mobile ? 20 : 24) * vh;
    // wave tops per layer per column (quantized to rows)
    var tops = WAVES.map(function (w) {
      var t = new Array(cols);
      for (var c = 0; c < cols; c++) {
        var bi = Math.min(BARS - 1, Math.floor((c * cw + cw / 2) / W * BARS));
        var hgt = w.base * vh + Math.sin(a * w.speed + (bi + 1) * w.step * Math.PI / 180 + w.off[bi]) * w.swing * vh * w.amp[bi];
        t[c] = Math.floor((H - hgt) / ch);
      }
      return t;
    });
    ctx.font = font;
    for (var r = 0; r < rows; r++) {
      var y = r * ch;
      for (var c = 0; c < cols; c++) {
        var x = c * cw, layer = -1;
        for (var l = WAVES.length - 1; l >= 0; l--) { if (r >= tops[l][c]) { layer = l; break; } }
        var bg, fg, glyph;
        if (layer >= 0) {
          var w = WAVES[layer], depth = r - tops[layer][c];
          bg = w.bg; fg = w.fg;
          glyph = depth === 0 ? w.ramp.charAt(2) : w.ramp.charAt((c + r) % 2 === 0 ? 1 : 0);
          if (depth % 4 === 3) glyph = ' ';
        } else {
          var dx = (x + cw / 2 - sunX) / sunR, dy = (y + ch / 2 - sunY) / sunR;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d <= 1) {
            var shade = mix(SUN_HI, SUN_LO, (dy + 1) / 2);
            bg = rgb(SUN); fg = rgb(shade);
            glyph = SUN_RAMP.charAt(Math.floor(hash(c, r) * SUN_RAMP.length));
          } else {
            var t = Math.min(1, (d - 1) / 3.2);
            var base = t < 0.5 ? mix(SKY[0], SKY[1], t * 2) : mix(SKY[1], SKY[2], (t - 0.5) * 2);
            bg = rgb(base);
            var glow = Math.max(0, 1 - (d - 1) * 1.4);
            var n = hash(c, r);
            var idx = Math.max(0, Math.min(SKY_RAMP.length - 1, Math.floor(glow * 5 + n * 2.2)));
            glyph = SKY_RAMP.charAt(idx);
            fg = rgb(mix(base, hex('#a8532f'), 0.32 + glow * 0.4));
          }
        }
        ctx.fillStyle = bg; ctx.fillRect(x, y, cw, ch);
        if (glyph !== ' ') { ctx.fillStyle = fg; ctx.fillText(glyph, x, y); }
      }
    }
  }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ticking = false;
  function update() {
    ticking = false;
    var total = document.documentElement.scrollHeight - window.innerHeight;
    var p = reduce ? 0.12 : (total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0);
    scene.style.setProperty('--p', p.toFixed(4));
    scene.style.setProperty('--sink', (p * 42).toFixed(2) + 'vh');
    draw(p);
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('resize', function () { resize(); onScroll(); });
  if (!reduce) window.addEventListener('scroll', onScroll, { passive: true });
  resize(); update();
})();
