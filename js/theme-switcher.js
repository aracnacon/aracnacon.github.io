/* ── Theme Switcher ────────────────────────────────────────────
   Cycles through 5 visual themes and persists the choice
   in localStorage so it survives navigation and refresh.
   ──────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  var themes = [
    { className: '',              label: 'Midnight Blue', icon: 'fa-palette'             },
    { className: 'theme-ember',   label: 'Ember',         icon: 'fa-fire-flame-curved'   },
    { className: 'theme-forest',  label: 'Forest',        icon: 'fa-seedling'            },
    { className: 'theme-arctic',  label: 'Arctic',        icon: 'fa-snowflake'           },
    { className: 'theme-miami',   label: 'Miami Glow',    icon: 'fa-wand-magic-sparkles' }
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

    // Update button label and icon
    var btn = document.querySelector('.theme-switcher');
    if (btn) {
      btn.querySelector('.theme-label').textContent = themes[index].label;

      var icon = btn.querySelector('i');
      if (icon) {
        var classes = icon.className.split(' ');
        icon.className = classes.filter(function(c) {
          return c === 'fa-solid' || !c.startsWith('fa-');
        }).join(' ');
        icon.classList.add(themes[index].icon);
      }
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
