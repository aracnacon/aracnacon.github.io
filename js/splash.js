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

    /* ── Arm animations ─────────────────────────────────────────── */
    .arm-group {
      transform-box: fill-box;
    }

    #phone-arm-group   { transform-origin: 0%    100%; animation: pivot-r  2.0s  0.0s  ease-in-out infinite alternate; }
    #plug-arm-group    { transform-origin: 0%    100%; animation: pivot-r  2.5s  0.4s  ease-in-out infinite alternate; }
    #wrench1-arm-group { transform-origin: 100%  100%; animation: pivot-l  3.2s  0.2s  ease-in-out infinite alternate; }
    #wrench2-arm-group { transform-origin: 100%  100%; animation: pivot-l  2.7s  1.0s  ease-in-out infinite alternate; }
    #hammer-arm-group  { transform-origin: 100%  0%;   animation: pivot-l  2.2s  0.6s  ease-in-out infinite alternate; }
    #magglass-arm-group{ transform-origin: 100%  0%;   animation: pivot-l  2.4s  0.5s  ease-in-out infinite alternate; }
    #gear-leg-group    { transform-origin: 0%    0%;   animation: pivot-r  3.0s  0.8s  ease-in-out infinite alternate; }
    #brief-leg-group   { transform-origin: 0%    0%;   animation: pivot-r  2.8s  1.2s  ease-in-out infinite alternate; }

    @keyframes pivot-r {
      from { transform: rotate(-15deg); }
      to   { transform: rotate(15deg); }
    }
    @keyframes pivot-l {
      from { transform: rotate(15deg); }
      to   { transform: rotate(-15deg); }
    }

    /* ── Text ───────────────────────────────────────────────────── */
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

  // Each entry: [groupId, [path ids to move], cssClass]
  const armDefs = [
    ['phone-arm-group',    ['path21','path22','path23','rect54']],
    ['plug-arm-group',     ['path25','path26']],
    ['wrench1-arm-group',  ['path35','path36']],
    ['wrench2-arm-group',  ['path38','path39']],
    ['hammer-arm-group',   ['path31','path32','path33']],
    ['magglass-arm-group', ['path27','path28','path29','path51']],
    ['gear-leg-group',     ['path41','path42','ellipse49']],
    ['brief-leg-group',    ['path44','path45','path49','rect51','rect52','rect53']],
  ];

  fetch('images/spiderTrace.svg')
    .then(r => r.text())
    .then(svg => {
      const wrap = document.getElementById('splash-spider-wrap');
      wrap.innerHTML = svg;
      const svgEl = wrap.querySelector('svg');

      // Hide the static background trace layer (path2/3/4 in Top layer)
      ['path2','path3','path4'].forEach(id => {
        const el = svgEl.getElementById(id);
        if (el) el.style.display = 'none';
      });

      // Fill cutout shapes with black to match splash background
      ['path23','path49','ellipse49','rect51','rect52','rect53'].forEach(id => {
        const el = svgEl.getElementById(id);
        if (el) { el.style.fill = '#000000'; el.style.stroke = 'none'; }
      });

      armDefs.forEach(([groupId, pathIds]) => {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.id = groupId;
        group.classList.add('arm-group');
        pathIds.forEach(id => {
          const el = svgEl.getElementById(id);
          if (el) group.appendChild(el);
        });
        svgEl.appendChild(group);
      });
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
