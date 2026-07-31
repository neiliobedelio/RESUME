(function () {
  var el = document.querySelector('.hero-ascii');
  if (!el) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var text = el.textContent;
  el.textContent = '';
  var frag = document.createDocumentFragment();
  var count = 0;
  for (var idx = 0; idx < text.length; idx++) {
    var ch = text[idx];
    if (ch.trim() === '') {
      frag.appendChild(document.createTextNode(ch));
    } else {
      var span = document.createElement('span');
      span.className = 'ascii-char';
      span.textContent = ch;
      if (reduce) {
        span.style.opacity = '1';
      } else {
        span.style.animationDelay = (count * 5) + 'ms';
      }
      count++;
      frag.appendChild(span);
    }
  }
  el.appendChild(frag);
})();
