/* ── Theme Switcher ────────────────────────────────────────────
   Cycles through 5 visual themes. Picks a random theme on
   each new session (never the same as last visit). Manual
   clicks still cycle and persist within the session.
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

  var SESSION_KEY = 'aracna-theme';
  var LAST_KEY = 'aracna-theme-last';

  /* ── helpers ─────────────────────────────────────────────── */

  function getStartIndex() {
    // If already navigating within this session, keep the current theme
    var session = sessionStorage.getItem(SESSION_KEY);
    if (session !== null) {
      var idx = parseInt(session, 10);
      if (idx >= 0 && idx < themes.length) return idx;
    }

    // New session — pick a random theme different from last visit
    var last = localStorage.getItem(LAST_KEY);
    var lastIdx = last !== null ? parseInt(last, 10) : -1;
    var pick;
    do {
      pick = Math.floor(Math.random() * themes.length);
    } while (pick === lastIdx);

    // Remember this choice for the session and as the last-used theme
    sessionStorage.setItem(SESSION_KEY, pick);
    localStorage.setItem(LAST_KEY, pick);
    return pick;
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

    // Persist within session and remember as last-used
    sessionStorage.setItem(SESSION_KEY, index);
    localStorage.setItem(LAST_KEY, index);

    // Update all theme toggle icons on the page
    var toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(function (btn) {
      var icon = btn.querySelector('i');
      if (icon) {
        var classes = icon.className.split(' ');
        icon.className = classes.filter(function(c) {
          return c === 'fa-solid' || !c.startsWith('fa-');
        }).join(' ');
        icon.classList.add(themes[index].icon);
      }
    });
  }

  /* ── apply theme immediately (before paint) ────────────── */

  var currentIndex = getStartIndex();
  applyTheme(currentIndex);

  /* ── wire up button once DOM is ready ────────────────────── */

  document.addEventListener('DOMContentLoaded', function () {
    var toggles = document.querySelectorAll('.theme-toggle');
    if (!toggles.length) return;

    // Set initial icon
    applyTheme(currentIndex);

    toggles.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        currentIndex = (currentIndex + 1) % themes.length;
        applyTheme(currentIndex);
      });
    });
  });
})();
