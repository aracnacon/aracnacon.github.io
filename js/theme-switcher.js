/* ── Theme Switcher ────────────────────────────────────────────
   Cycles through 5 visual themes and persists the choice
   in localStorage so it survives navigation and refresh.
   ──────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  var themes = [
    { className: '',              label: 'Midnight Blue' },
    { className: 'theme-ember',   label: 'Ember'         },
    { className: 'theme-forest',  label: 'Forest'        },
    { className: 'theme-arctic',  label: 'Arctic'        },
    { className: 'theme-royal',   label: 'Royal Purple'  }
  ];

  var STORAGE_KEY = 'aracna-theme';

  /* ── helpers ─────────────────────────────────────────────── */

  function getSavedIndex() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) return 0;
    var idx = parseInt(saved, 10);
    return (idx >= 0 && idx < themes.length) ? idx : 0;
  }

  function applyTheme(index) {
    var root = document.documentElement;

    // Strip any existing theme class
    themes.forEach(function (t) {
      if (t.className) root.classList.remove(t.className);
    });

    // Apply new theme class (default has no class)
    if (themes[index].className) {
      root.classList.add(themes[index].className);
    }

    localStorage.setItem(STORAGE_KEY, index);

    // Update button label
    var btn = document.querySelector('.theme-switcher');
    if (btn) {
      btn.querySelector('.theme-label').textContent = themes[index].label;
    }
  }

  /* ── apply saved theme immediately (before paint) ────────── */

  var currentIndex = getSavedIndex();
  applyTheme(currentIndex);

  /* ── wire up button once DOM is ready ────────────────────── */

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('.theme-switcher');
    if (!btn) return;

    // Set initial label
    btn.querySelector('.theme-label').textContent = themes[currentIndex].label;

    btn.addEventListener('click', function () {
      currentIndex = (currentIndex + 1) % themes.length;
      applyTheme(currentIndex);
    });
  });
})();
