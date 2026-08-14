(function () {
  var stage = document.querySelector('.logo-stage');
  if (!stage) return;

  var cols = Array.prototype.slice.call(stage.querySelectorAll('.logo-col'));
  if (!cols.length) return;

  var reels = cols.map(function (col) { return col.querySelector('.logo-reel'); });

  // The list of logos to cycle through comes from a data attribute set by
  // the template (fed from _data), so editing the rotation is a content
  // change, not a code change. A trailing duplicate of the first logo is
  // appended as an extra "frame" so the reel can always slide in one
  // direction (never reverse) and snap back invisibly once it passes that
  // duplicate — giving a seamless, continuous odometer loop.
  var logos = [];
  try {
    logos = JSON.parse(stage.getAttribute('data-logos') || '[]');
  } catch (e) {
    logos = [];
  }
  if (logos.length < 2) return;
  var frameSrcs = logos.concat([logos[0]]);
  var frameCount = frameSrcs.length;
  var framePct = 100 / frameCount;

  // The markup ships with a fixed 3 frames per column (built for the
  // original 2-logo rotation). Rebuild each reel's frames here so the count
  // — and each frame's height/position — always matches the actual logo
  // list, however many logos are configured.
  cols.forEach(function (col) {
    var reel = col.querySelector('.logo-reel');
    reel.style.height = (frameCount * 100) + '%';
    reel.innerHTML = '';
    frameSrcs.forEach(function (src, i) {
      var frame = document.createElement('div');
      frame.className = 'logo-frame';
      frame.style.top = (i * framePct) + '%';
      frame.style.height = framePct + '%';
      frame.style.backgroundImage = 'url("' + src + '")';
      reel.appendChild(frame);
    });
  });

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STEP_DURATION = 300; // matches the 0.3s ease-out transition
  var STEP_STAGGER = 90;   // ms delay between each column's start
  var TOTAL_ANIM_MS = STEP_STAGGER * (cols.length - 1) + STEP_DURATION;
  var CYCLE_MS = 3200;     // time between the start of each transition

  var slot = 0;
  var timer = null;
  var resetTimer = null;

  function setSlot(slotIndex, animate) {
    reels.forEach(function (reel) {
      if (!animate) reel.classList.add('no-transition');
      reel.style.transform = 'translateY(-' + (slotIndex * framePct) + '%)';
      if (!animate) {
        // force reflow so the transition-less jump applies immediately
        void reel.offsetWidth;
        reel.classList.remove('no-transition');
      }
    });
  }

  function advance() {
    slot += 1;
    setSlot(slot, true);

    // Once we've slid onto the duplicate frame at the end, wait for that
    // motion to finish, then snap back to the real first frame with no
    // transition — since both frames show the same image, the snap is
    // invisible and the reel appears to loop forever.
    if (slot === logos.length) {
      resetTimer = window.setTimeout(function () {
        slot = 0;
        setSlot(slot, false);
      }, TOTAL_ANIM_MS + 20);
    }
  }

  function start() {
    if (timer || logos.length < 2) return;
    timer = window.setInterval(advance, CYCLE_MS);
  }

  function stop() {
    if (timer) { window.clearInterval(timer); timer = null; }
    if (resetTimer) { window.clearTimeout(resetTimer); resetTimer = null; }
  }

  if (reduce) {
    reels.forEach(function (reel) { reel.style.transition = 'none'; });
  } else {
    start();
    stage.addEventListener('mouseenter', stop);
    stage.addEventListener('mouseleave', start);
    stage.addEventListener('focusin', stop);
    stage.addEventListener('focusout', start);
  }
})();
