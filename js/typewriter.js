/* ===== Typewriter Effect ===== */

(function () {
  var el = document.querySelector('.typewriter');
  if (!el) return;

  var text = el.getAttribute('data-text');
  if (!text) return;

  // Skip animation for reduced motion — show text immediately
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = text;
    return;
  }

  var cursor = document.createElement('span');
  cursor.className = 'cursor';
  el.appendChild(cursor);

  var i = 0;
  var delay = 1200; // wait for h1 entrance animation

  setTimeout(function type() {
    if (i < text.length) {
      el.insertBefore(document.createTextNode(text[i]), cursor);
      i++;
      setTimeout(type, 45);
    } else {
      setTimeout(function () { cursor.remove(); }, 2000);
    }
  }, delay);
})();
