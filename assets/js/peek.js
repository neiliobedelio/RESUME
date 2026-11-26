/* Easter egg: pull down past the top of the page and Neil is caught hanging from the top of your screen. */
(function () {
  var PAL = {"K": "#211d18", "S": "#c68a5e", "s": "#a26a45", "h": "#e2ab80", "W": "#fff8f2", "B": "#2e231c", "R": "#8a3326", "H": "#6e5d50", "m": "#8f8378", "G": "#2f6fbf", "g": "#9fd4ff", "M": "#5a3a2a", "C": "#34405a", "c": "#4f5e7d", "d": "#262f44", "T": "#6d717b", "Z": "#d4d8de"};
  var FR = {"calm": "KKKKKK....................KKKKKK|KSSSSK....................KSSSSK|KShShK....................KShShK|KSSSSK....................KSSSSK|KKKKKK....................KKKKKK|.KCcK.......KKKKKKKK.......KCcK.|.KCCK.....KKhhhhSSSSKK.....KCCK.|.KCcK....KhhhhhSSSSSSSK....KCcK.|.KCCK...KKKKKKKKKKKKKKKK...KCCK.|.KCcK...KGgGGGKKKKGgGGGK...KCcK.|.KCCK..KHKGGGKSSSSKGGGKHK..KCCK.|.KCcK..KHSKKKSSSSSSKKKSHsK.KCcK.|.KCCK.KKHSSSSSSSSSSSSSSHsKKKCCK.|.KCcKKsKHBBBBSSSSSSBBBBSsKsKCcK.|.KCCKKsKSSSSSSSSSSSSSSSSsKsKCCK.|.KCcK.KKSSKKKSSSSSSKKKSSsKKKCcK.|.KCCK..KSMSSSSSssSSSSSSSsK.KCCK.|.KCcK..KsSSSSSSssSSSSSSSsK.KCcK.|.KCCK...KSSSSmmmmmmSSSSsK..KCCK.|.KCcK...KsSSSmKKKKmSSSsK...KCcK.|.KCCK....KsSSSmmmmSSSsK....KCCK.|.KCcK.....KKsSSmmSSsKK.....KCcK.|.KCCK......KKsSSSSsKK......KCCK.|.KCcK...KKKcccKTTKcccKKK...KCcK.|.KCCK.KKCCccCCKTTKCCccCCKK.KCCK.|.KCcKKCCCCcCCCCKZKCCCCcCCCKKCcK.|....KCCcCCCCCCCKZKCCCCCCcCCK....|....KCcCCCCCCCCKZKCCCCCCCcCK....|....KCCCCCCCCCCKZKCCCCCCCCCK....|................................|................................|................................|................................|................................|................................", "shock": "KKKKKK....................KKKKKK|KSSSSK....................KSSSSK|KShShK....................KShShK|KSSSSK....................KSSSSK|KKKKKK....................KKKKKK|.KCcK.......KKKKKKKK.......KCcK.|.KCCK.....KKhhhhSSSSKK.....KCCK.|.KCcK....KhhhhhSSSSSSSK....KCcK.|.KCCK...KKKKKKKKKKKKKKKK...KCCK.|.KCcK...KGgGGGKKKKGgGGGK...KCcK.|.KCCK..KHKGGGKSSSSKGGGKHK..KCCK.|.KCcK..KHSKKKSSSSSSKKKSHsK.KCcK.|.KCCK.KKHSSSSSSSSSSSSSSHsKKKCCK.|.KCcKKsKBBBBSSSSSSSSBBBBKsKKCcK.|.KCCKKsKSSSSSSSSSSSSSSSSsKsKCCK.|.KCcK.KKSWWWSSSSSSSSWWWSsKKKCcK.|.KCCK..KSWKWSSSssSSSWKWSsK.KCCK.|.KCcK..KsWWWSSSssSSSWWWSsK.KCcK.|.KCCK...KSSSSmmmmmmSSSSsK..KCCK.|.KCcK...KsSSSmKRRKmSSSsK...KCcK.|.KCCK....KsSSmKKKKmSSsK....KCCK.|.KCcK.....KKsSSmmSSsKK.....KCcK.|.KCCK......KKsSSSSsKK......KCCK.|.KCcK...KKKcccKTTKcccKKK...KCcK.|.KCCK.KKCCccCCKTTKCCccCCKK.KCCK.|.KCcKKCCCCcCCCCKZKCCCCcCCCKKCcK.|....KCCcCCCCCCCKZKCCCCCCcCCK....|....KCcCCCCCCCCKZKCCCCCCCcCK....|....KCCCCCCCCCCKZKCCCCCCCCCK....|................................|................................|................................|................................|................................|................................", "grinA": "KKKKKK..........................|KSSSSK..........................|KShShK..........................|KSSSSK..........................|KKKKKK..........................|.KCcK.......KKKKKKKK............|.KCCK.....KKhhhhSSSSKK..........|.KCcK....KhhhhhSSSSSSSK.........|.KCCK...KKKKKKKKKKKKKKKK........|.KCcK...KGgGGGKKKKGgGGGK........|.KCCK..KHKGGGKSSSSKGGGKHK..KKKKK|.KCcK..KHSKKKSSSSSSKKKSHsK.KSSSK|.KCCK.KKHSSSSSSSSSSSSSSHsKKKShSK|.KCcKKsKHBBBBSSSSSSBBBBSsKsKSSSK|.KCCKKsKSSSSSSSSSSSSSSSSsKsKKKKK|.KCcK.KKSSKKKSSSSSSKKKSSsKK.KCcK|.KCCK..KSMSSSSSssSSSSSSSsK..KCCK|.KCcK..KsSSSSSSssSSSSSSSsK..KCcK|.KCCK...KSSmmmmmmmmmmSSsK...KCCK|.KCcK...KsSKWWWWWWWWKSsK...KCcK.|.KCCK....KsSKKKKKKKKSsK....KCCK.|.KCcK.....KKsSSmmSSsKK.....KCcK.|.KCCK......KKsSSSSsKK......KCCK.|.KCcK...KKKcccKTTKcccKKK...KCcK.|.KCCK.KKCCccCCKTTKCCccCCKK.KCCK.|.KCcKKCCCCcCCCCKZKCCCCcCCCKKCcK.|....KCCcCCCCCCCKZKCCCCCCcCCK....|....KCcCCCCCCCCKZKCCCCCCCcCK....|....KCCCCCCCCCCKZKCCCCCCCCCK....|................................|................................|................................|................................|................................|................................", "grinB": "KKKKKK..........................|KSSSSK..........................|KShShK..........................|KSSSSK..........................|KKKKKK..........................|.KCcK.......KKKKKKKK............|.KCCK.....KKhhhhSSSSKK..........|.KCcK....KhhhhhSSSSSSSK.........|.KCCK...KKKKKKKKKKKKKKKK........|.KCcK...KGgGGGKKKKGgGGGK........|.KCCK..KHKGGGKSSSSKGGGKHKKKKKK..|.KCcK..KHSKKKSSSSSSKKKSHsKSSSK..|.KCCK.KKHSSSSSSSSSSSSSSHsKShSK..|.KCcKKsKHBBBBSSSSSSBBBBSsKSSSK..|.KCCKKsKSSSSSSSSSSSSSSSSsKKKKK..|.KCcK.KKSSKKKSSSSSSKKKSSsKKCcK..|.KCCK..KSMSSSSSssSSSSSSSsKKCCK..|.KCcK..KsSSSSSSssSSSSSSSsKKCcK..|.KCCK...KSSmmmmmmmmmmSSsK.KCCK..|.KCcK...KsSKWWWWWWWWKSsK...KCcK.|.KCCK....KsSKKKKKKKKSsK....KCCK.|.KCcK.....KKsSSmmSSsKK.....KCcK.|.KCCK......KKsSSSSsKK......KCCK.|.KCcK...KKKcccKTTKcccKKK...KCcK.|.KCCK.KKCCccCCKTTKCCccCCKK.KCCK.|.KCcKKCCCCcCCCCKZKCCCCcCCCKKCcK.|....KCCcCCCCCCCKZKCCCCCCcCCK....|....KCcCCCCCCCCKZKCCCCCCCcCK....|....KCCCCCCCCCCKZKCCCCCCCCCK....|................................|................................|................................|................................|................................|................................"};
  var W = 32, H = 35;
  var css = '' +
    'html{overscroll-behavior-y:contain}' +
    '.nb-peek{position:fixed!important;top:0;left:clamp(16px,14vw,180px);width:auto!important;z-index:1000!important;pointer-events:none;transform:translateY(-110%);visibility:hidden}' +
    '.nb-peek canvas{display:block;width:calc(32px*var(--px));height:calc(35px*var(--px));image-rendering:pixelated;image-rendering:crisp-edges}' +
    '.nb-peek{--px:3}@media(min-width:861px){.nb-peek{--px:4}}' +
    '.nb-peek.in{visibility:visible;transform:translateY(0);transition:transform .42s steps(6,end)}' +
    '.nb-peek.out{visibility:visible;transform:translateY(-110%);transition:transform .32s steps(5,end)}' +
    '.nb-peek.jolt canvas{animation:nbJolt .5s steps(2,end)}' +
    '@keyframes nbJolt{0%{transform:translate(0,-6px)}25%{transform:translate(-3px,0)}50%{transform:translate(3px,-3px)}75%{transform:translate(-2px,0)}100%{transform:none}}' +
    '.nb-peek-bang{position:absolute;left:calc(100% - 4px);top:calc(9px*var(--px));font:400 calc(8px*var(--px))/1 "Press Start 2P",monospace;color:#b5583a;text-shadow:2px 2px 0 #211d18;opacity:0}' +
    '.nb-peek.shock .nb-peek-bang{opacity:1}' +
    '.nb-peek-say{position:absolute;left:calc(100% + 10px);top:calc(14px*var(--px));white-space:nowrap;font:400 10px/1.5 "Press Start 2P",monospace;letter-spacing:.02em;color:#211d18;background:#fff8f2;border:3px solid #211d18;padding:8px 10px;box-shadow:4px 4px 0 #211d18;opacity:0}' +
    '.nb-peek-say:before{content:"";position:absolute;left:-9px;top:10px;width:6px;height:6px;background:#211d18;box-shadow:3px 3px 0 #211d18}' +
    '.nb-peek.say .nb-peek-say{opacity:1}' +
    '.nb-peek-say small{display:block;font-size:7px;color:#9c4b30;margin-top:4px}' +
    '@media(prefers-reduced-motion:reduce){.nb-peek.in,.nb-peek.out{transition:none}.nb-peek.jolt canvas{animation:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var el = document.createElement('div'); el.className = 'nb-peek'; el.setAttribute('aria-hidden', 'true');
  var cv = document.createElement('canvas'); cv.width = W; cv.height = H; el.appendChild(cv);
  var bang = document.createElement('span'); bang.className = 'nb-peek-bang'; bang.textContent = '!'; el.appendChild(bang);
  var say = document.createElement('span'); say.className = 'nb-peek-say'; say.innerHTML = 'YOU FOUND ME!<small>PLAYER 2 HAS ENTERED</small>'; el.appendChild(say);
  var ctx = cv.getContext('2d');
  function draw(name) {
    ctx.clearRect(0, 0, W, H);
    var rows = FR[name].split('|');
    for (var y = 0; y < rows.length; y++) for (var x = 0; x < W; x++) {
      var c = PAL[rows[y][x]]; if (!c) continue; ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1);
    }
  }
  var fontLoaded = false;
  function loadFont() {
    if (fontLoaded) return; fontLoaded = true;
    var l = document.createElement('link'); l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'; document.head.appendChild(l);
  }

  var busy = false, timers = [];
  function at(ms, fn) { timers.push(setTimeout(fn, ms)); }
  function play() {
    if (busy) return; busy = true; loadFont();
    if (!el.parentNode) document.body.appendChild(el);
    draw('calm'); el.className = 'nb-peek';
    void el.offsetWidth;                                  // restart transitions
    el.className = 'nb-peek in';
    at(750, function () { draw('shock'); el.className = 'nb-peek in shock jolt'; });
    at(1650, function () {
      el.className = 'nb-peek in say'; var f = 0;
      draw('grinA');
      var wave = setInterval(function () { draw(++f % 2 ? 'grinB' : 'grinA'); }, 200); timers.push(wave);
      at(2300, function () { clearInterval(wave); draw('grinA'); });
    });
    at(4200, function () { el.className = 'nb-peek out'; });
    at(4600, function () { el.className = 'nb-peek'; timers.forEach(clearTimeout); timers = []; busy = false; });
  }
  window.nbPeek = play;                                   // handy for testing in the console

  // 1) iPhone / Safari: the page bounces past the top (scroll position goes negative)
  addEventListener('scroll', function () { if (scrollY < -40) play(); }, { passive: true });
  // 2) touch screens: a firm pull-down that starts at the very top
  var ty = null;
  addEventListener('touchstart', function (e) { ty = scrollY <= 0 ? e.touches[0].clientY : null; }, { passive: true });
  addEventListener('touchmove', function (e) { if (ty !== null && scrollY <= 0 && e.touches[0].clientY - ty > 90) { ty = null; play(); } }, { passive: true });
  // 3) mouse / trackpad: keep scrolling up after you have already reached the top
  var topSince = scrollY <= 0 ? Date.now() - 1000 : 0, pull = 0, last = 0;
  addEventListener('scroll', function () { if (scrollY <= 0) { if (!topSince) topSince = Date.now(); } else { topSince = 0; pull = 0; } }, { passive: true });
  addEventListener('wheel', function (e) {
    if (scrollY > 0 || e.deltaY >= 0 || !topSince || Date.now() - topSince < 450) return;
    var now = Date.now(); if (now - last > 600) pull = 0; last = now;
    pull += -e.deltaY * (e.deltaMode === 1 ? 33 : 1);
    if (pull > 280) { pull = 0; play(); }
  }, { passive: true });
})();
