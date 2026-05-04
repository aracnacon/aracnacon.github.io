(function () {
  const style = document.createElement('style');
  style.textContent = `
    #splash-screen {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: #000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: none;
      transition: all 1400ms ease-out;
    }
    #splash-screen.dissolve {
      opacity: 0;
      filter: blur(16px);
      pointer-events: none;
    }
    #splash-spider-wrap {
      width: 14rem;
      height: 14rem;
    }
    #splash-spider-wrap svg {
      width: 100%;
      height: 100%;
    }
    #phone-arm-group {
      transform-box: fill-box;
      transform-origin: 0% 100%;
      animation: phone-arm-pivot 2s ease-in-out infinite alternate;
    }
    @keyframes phone-arm-pivot {
      from { transform: rotate(-18deg); }
      to   { transform: rotate(18deg); }
    }
    #splash-screen .splash-title {
      margin-top: 2rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-size: 2.5rem;
      font-weight: 300;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.3);
    }
    #splash-screen .splash-subtitle {
      margin-top: 0.75rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.2);
    }
  `;
  document.head.appendChild(style);

  const splash = document.createElement('div');
  splash.id = 'splash-screen';
  splash.innerHTML = `
    <div id="splash-spider-wrap"></div>
    <span class="splash-title">AracnaTech</span>
    <span class="splash-subtitle">Brandon Hixson</span>
  `;
  document.body.prepend(splash);

  // Inline the SVG so we can animate internal elements
  fetch('images/spiderTrace.svg')
    .then(r => r.text())
    .then(svg => {
      const wrap = document.getElementById('splash-spider-wrap');
      wrap.innerHTML = svg;
      const svgEl = wrap.querySelector('svg');
      // Group the phone arm segments so they move as one unit
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.id = 'phone-arm-group';
      ['path21', 'path22', 'path23'].forEach(id => {
        const el = svgEl.getElementById(id);
        if (el) group.appendChild(el);
      });
      svgEl.appendChild(group);
    });

  let gone = false;
  function dissolve() {
    if (gone) return;
    gone = true;
    splash.classList.add('dissolve');
    setTimeout(() => splash.remove(), 1400);
  }

  splash.addEventListener('mousemove', dissolve);
})();
