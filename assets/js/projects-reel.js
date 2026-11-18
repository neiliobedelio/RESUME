// Projects page hero reel: plays muted and looping with no controls.
// Visitors who prefer reduced motion see the still poster frame instead.
(function () {
  var video = document.querySelector('.projects-reel-video');
  if (!video) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  video.preload = 'auto';
  var p = video.play();
  if (p && p.catch) p.catch(function () {});
})();
