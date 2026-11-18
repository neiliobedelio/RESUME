// Projects page hero reel: autoplays muted unless the visitor prefers reduced motion,
// with a pause/play control (WCAG 2.2.2 for motion longer than five seconds).
(function () {
  var video = document.querySelector('.projects-reel-video');
  var toggle = document.querySelector('.projects-reel-toggle');
  if (!video || !toggle) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function sync() {
    var paused = video.paused;
    toggle.textContent = paused ? 'Play reel' : 'Pause reel';
    toggle.setAttribute('aria-pressed', paused ? 'true' : 'false');
  }

  toggle.hidden = false;
  toggle.addEventListener('click', function () {
    if (video.paused) { video.play(); } else { video.pause(); }
  });
  video.addEventListener('play', sync);
  video.addEventListener('pause', sync);

  if (!reduce) {
    video.preload = 'auto';
    var p = video.play();
    if (p && p.catch) p.catch(sync);
  }
  sync();
})();
