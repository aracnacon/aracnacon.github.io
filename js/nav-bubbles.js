(function () {
  function init() {
    const spiderLink = document.querySelector('nav a[aria-label="Spider Game"]');
    const themeLink  = document.querySelector('nav a.theme-toggle');
    if (!spiderLink || !themeLink) return;

    const spiderLabel = document.createElement('span');
    spiderLabel.className = 'nav-try-me nav-try-me-spider';
    spiderLabel.textContent = 'Try Me!';
    spiderLink.appendChild(spiderLabel);

    const themeLabel = document.createElement('span');
    themeLabel.className = 'nav-try-me nav-try-me-theme';
    themeLabel.textContent = 'Try Me!';
    themeLink.appendChild(themeLabel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
