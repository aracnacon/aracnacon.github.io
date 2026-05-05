(function () {
  const IDLE_MS = 2 * 60 * 1000; // 2 minutes
  let idleTimer;

  // ── All 5 theme color sets (matches splash.js) ────────────────────
  const NEON     = ['#1e90ff', '#e8651a', '#39ff14', '#0077b6', '#ff2d95'];
  const BODY     = ['#1e90ff', '#e8651a', '#39ff14', '#f0f8ff', '#00e5ff'];
  const INNER    = ['#1e90ff', '#3d0000', '#39ff14', '#f0f8ff', '#00e5ff'];
  const CONTRAST = ['#00cfff', '#ff1a1a', '#a5d6a7', '#48a9d4', '#b026ff'];
  const LIMB     = ['#1e90ff', '#e8651a', '#4caf50', '#0077b6', '#b026ff'];

  const CYCLE      = 4000;
  const TEXT_CYCLE = 10000;

  function kf(name, normalFn, pulseFn) {
    const stops = [];
    for (let i = 0; i < 5; i++) {
      const base = i * 20;
      stops.push(`  ${base}% { ${normalFn(i)} }`);
      if (pulseFn) {
        stops.push(`  ${base + 17}% { ${normalFn(i)} }`);
        stops.push(`  ${base + 19}% { ${pulseFn(i)} }`);
      }
    }
    stops.push(`  100% { ${normalFn(0)} }`);
    return `@keyframes ${name} {\n${stops.join('\n')}\n}`;
  }

  const WAVE_CYCLE = 50;
  const AT_STEP    = 0.12;
  const BH_OFFSET  = 2.2;
  const BH_STEP    = 0.12;

  function waveText(text, waveName, neonAnim, step, baseDelay = 0) {
    return [...text].map((ch, i) => {
      const delay = (baseDelay + i * step).toFixed(2);
      return `<span style="animation: ${waveName} ${WAVE_CYCLE}s ease-in-out ${delay}s infinite, ${neonAnim};">${ch === ' ' ? '&nbsp;' : ch}</span>`;
    }).join('');
  }

  const armDefs = [
    ['idle-phone-arm-group',    ['path21','path22','path23','rect54']],
    ['idle-plug-arm-group',     ['path25','path26']],
    ['idle-wrench1-arm-group',  ['path35','path36']],
    ['idle-wrench2-arm-group',  ['path38','path39']],
    ['idle-hammer-arm-group',   ['path31','path32','path33']],
    ['idle-magglass-arm-group', ['path27','path28','path29','path51']],
    ['idle-gear-leg-group',     ['path41','path42','ellipse49']],
    ['idle-brief-leg-group',    ['path44','path45','path49','rect51','rect52','rect53']],
  ];
  const OUTER_IDS = ['path13','path14','path15','path16'];
  const TOOL_IDS  = ['path2','path3','path4'];

  function showIdleSplash() {
    // Don't stack splashes
    if (document.getElementById('idle-splash-screen')) return;

    // ── Inject styles (only once) ─────────────────────────────────
    if (!document.getElementById('idle-splash-style')) {
      const style = document.createElement('style');
      style.id = 'idle-splash-style';
      style.textContent = `
        #idle-splash-screen {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: none;
          transition: all 3000ms ease-out;
        }
        #idle-splash-screen.dissolve {
          opacity: 0;
          filter: blur(16px);
          pointer-events: none;
        }
        #idle-spider-wrap {
          width: 14rem;
          height: 14rem;
        }
        #idle-spider-wrap svg {
          width: 100%;
          height: 100%;
        }
        .idle-arm-group { transform-box: fill-box; }
        #idle-phone-arm-group    { transform-origin: 0%   100%; animation: pivot-r 2.0s 0.0s ease-in-out infinite alternate; }
        #idle-plug-arm-group     { transform-origin: 0%   100%; animation: pivot-r 2.5s 0.4s ease-in-out infinite alternate; }
        #idle-wrench1-arm-group  { transform-origin: 100% 100%; animation: pivot-l 3.2s 0.2s ease-in-out infinite alternate; }
        #idle-wrench2-arm-group  { transform-origin: 100% 100%; animation: pivot-l 2.7s 1.0s ease-in-out infinite alternate; }
        #idle-hammer-arm-group   { transform-origin: 100% 0%;   animation: pivot-l 2.2s 0.6s ease-in-out infinite alternate; }
        #idle-magglass-arm-group { transform-origin: 100% 0%;   animation: pivot-l 2.4s 0.5s ease-in-out infinite alternate; }
        #idle-gear-leg-group     { transform-origin: 0%   0%;   animation: pivot-r 3.0s 0.8s ease-in-out infinite alternate; }
        #idle-brief-leg-group    { transform-origin: 0%   0%;   animation: pivot-r 2.8s 1.2s ease-in-out infinite alternate; }
        #idle-splash-screen .splash-title {
          margin-top: 2rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 2.5rem;
          font-weight: 300;
          letter-spacing: 0.35em;
          text-transform: uppercase;
        }
        #idle-splash-screen .splash-subtitle {
          margin-top: 0.75rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        ${kf('idle-title-neon-cycle',
            i => `color: ${NEON[i]}; text-shadow: 0 0 10px ${NEON[i]}, 0 0 25px ${NEON[i]}, 0 0 50px ${NEON[i]};`,
            i => `color: #fff;       text-shadow: 0 0 20px #fff, 0 0 50px ${NEON[i]}, 0 0 100px ${NEON[i]};`)}
        ${kf('idle-subtitle-neon-cycle',
            i => `color: ${NEON[i]}; text-shadow: 0 0 8px ${NEON[i]}, 0 0 18px ${NEON[i]}, 0 0 35px ${NEON[i]};`,
            i => `color: #fff;       text-shadow: 0 0 15px #fff, 0 0 35px ${NEON[i]}, 0 0 70px ${NEON[i]};`)}
        ${kf('idle-neon-glow-cycle',
            i => `stroke: ${NEON[i]}; filter: drop-shadow(0 0 6px ${NEON[i]}) drop-shadow(0 0 16px ${NEON[i]}) drop-shadow(0 0 30px ${NEON[i]});`,
            i => `stroke: #fff; filter: drop-shadow(0 0 20px #fff) drop-shadow(0 0 50px ${NEON[i]}) drop-shadow(0 0 90px ${NEON[i]});`)}
        ${kf('idle-spark-cycle',
            i => `stroke: ${NEON[i]}; filter: drop-shadow(0 0 6px ${NEON[i]}) drop-shadow(0 0 16px ${NEON[i]}) drop-shadow(0 0 4px #fff);`,
            i => `stroke: #fff; filter: drop-shadow(0 0 20px #fff) drop-shadow(0 0 50px ${NEON[i]}) drop-shadow(0 0 90px ${NEON[i]});`)}
        ${kf('idle-body-fill-cycle',
            i => `fill: ${BODY[i]};`,
            i => `fill: #ffffff;`)}
        ${kf('idle-inner-fill-cycle',
            i => `fill: ${INNER[i]};`,
            i => `fill: #ffffff;`)}
        ${kf('idle-limb-cycle',
            i => `fill: ${BODY[i]}; stroke: ${LIMB[i]};`,
            i => `fill: #fff; stroke: #fff;`)}
        ${kf('idle-contrast-cycle',
            i => `fill: ${CONTRAST[i]}; filter: drop-shadow(0 0 6px ${CONTRAST[i]}) drop-shadow(0 0 14px ${CONTRAST[i]});`,
            i => `fill: #fff; filter: drop-shadow(0 0 20px #fff) drop-shadow(0 0 50px ${CONTRAST[i]}) drop-shadow(0 0 80px ${CONTRAST[i]});`)}
        .idle-circuit-glow {
          animation:
            idle-circuit-breathe 1.2s ease-in-out infinite alternate,
            idle-neon-glow-cycle ${CYCLE}ms linear infinite;
        }
        @keyframes idle-circuit-breathe {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .idle-outer-bulb {
          animation: idle-contrast-cycle ${CYCLE}ms linear infinite;
        }
        .idle-outer-bulb.bulb-on {
          animation: idle-bulb-settle 1.5s ease-out forwards !important;
        }
        @keyframes idle-bulb-settle {
          0%   { fill: #444; filter: none; }
          5%   { fill: #fff; filter: drop-shadow(0 0 30px #fff) drop-shadow(0 0 60px #fff) drop-shadow(0 0 90px #fff); }
          30%  { fill: #fffde7; filter: drop-shadow(0 0 16px #fff) drop-shadow(0 0 35px #fff); }
          100% { fill: #fff8e1; filter: drop-shadow(0 0 5px #fff) drop-shadow(0 0 14px #fff); }
        }
        @keyframes idle-text-wave-big {
          0%          { transform: translateY(0); }
          1%          { transform: translateY(-22px); }
          2%          { transform: translateY(0); }
          2.01%, 100% { transform: translateY(0); }
        }
        @keyframes idle-text-wave {
          0%          { transform: translateY(0); }
          1%          { transform: translateY(-14px); }
          2%          { transform: translateY(0); }
          2.01%, 100% { transform: translateY(0); }
        }
        #idle-splash-screen .splash-title span,
        #idle-splash-screen .splash-subtitle span {
          display: inline-block;
        }
      `;
      document.head.appendChild(style);
    }

    // ── Build splash DOM ──────────────────────────────────────────
    const splash = document.createElement('div');
    splash.id = 'idle-splash-screen';
    splash.innerHTML = `
      <div id="idle-spider-wrap"></div>
      <span class="splash-title">${waveText('AracnaTech',    'idle-text-wave-big', `idle-title-neon-cycle ${TEXT_CYCLE}ms linear infinite`,    AT_STEP, 0)}</span>
      <span class="splash-subtitle">${waveText('Brandon Hixson', 'idle-text-wave',     `idle-subtitle-neon-cycle ${TEXT_CYCLE + 3000}ms linear infinite`, BH_STEP, BH_OFFSET)}</span>
    `;
    document.body.prepend(splash);

    // ── Load spider SVG ───────────────────────────────────────────
    fetch('images/spiderTrace.svg')
      .then(r => r.text())
      .then(svgText => {
        const wrap = document.getElementById('idle-spider-wrap');
        if (!wrap) return;
        wrap.innerHTML = svgText;
        const svgEl = wrap.querySelector('svg');

        TOOL_IDS.forEach(id => {
          const el = svgEl.getElementById(id);
          if (el) el.style.display = 'none';
        });

        ['path23','path49','ellipse49','rect51','rect52','rect53'].forEach(id => {
          const el = svgEl.getElementById(id);
          if (el) { el.style.fill = '#000'; el.style.stroke = 'none'; }
        });

        armDefs.forEach(([groupId, pathIds]) => {
          const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          g.id = groupId;
          g.classList.add('idle-arm-group');
          pathIds.forEach(id => {
            const el = svgEl.getElementById(id);
            if (el) g.appendChild(el);
          });
          svgEl.appendChild(g);
        });

        svgEl.querySelectorAll('[style*="fill:#808080"]').forEach(e => {
          if (e.id !== 'path17') {
            e.style.fill = BODY[0];
            e.style.animation = `idle-body-fill-cycle ${CYCLE}ms linear infinite`;
          }
        });

        const limbIds = [
          'path20','path21','path24','path25','path40','path41',
          'path43','path44','path27','path28','path30','path31',
          'path34','path35','path37','path38',
        ];
        limbIds.forEach(id => {
          const el = svgEl.getElementById(id);
          if (el) {
            el.style.fill        = BODY[0];
            el.style.stroke      = LIMB[0];
            el.style.strokeWidth = '8';
            el.style.animation   = `idle-limb-cycle ${CYCLE}ms linear infinite`;
          }
        });

        OUTER_IDS.forEach(id => {
          const el = svgEl.getElementById(id);
          if (el) el.classList.add('idle-outer-bulb');
        });

        const innerBody = svgEl.getElementById('path17');
        if (innerBody) {
          innerBody.style.fill      = INNER[0];
          innerBody.style.animation = `idle-inner-fill-cycle ${CYCLE}ms linear infinite`;

          const circuitGlow = innerBody.cloneNode(true);
          circuitGlow.removeAttribute('id');
          circuitGlow.style.cssText = `fill:none;stroke:${NEON[0]};stroke-width:5`;
          circuitGlow.classList.add('idle-circuit-glow');
          svgEl.appendChild(circuitGlow);

          const spark = innerBody.cloneNode(true);
          spark.removeAttribute('id');
          spark.style.cssText = `fill:none;stroke:${NEON[0]};stroke-width:3`;
          spark.classList.add('idle-electric-spark');
          svgEl.appendChild(spark);

          requestAnimationFrame(() => requestAnimationFrame(() => {
            const len      = spark.getTotalLength();
            const pulse    = len * 0.12;
            const sparkCycle = 900;

            const st = document.createElement('style');
            st.textContent = `
              .idle-electric-spark {
                stroke-dasharray: ${pulse.toFixed(1)} ${(len - pulse).toFixed(1)};
                stroke-dashoffset: ${len.toFixed(1)};
                animation:
                  idle-spark-travel ${sparkCycle}ms linear infinite,
                  idle-spark-cycle ${CYCLE}ms linear infinite;
              }
              @keyframes idle-spark-travel { to { stroke-dashoffset: 0; } }
            `;
            document.head.appendChild(st);

            const bulbDuration = 1500;
            const pauseBetween = 400;
            let bulbInterval;
            function fireSequence() {
              bulbInterval = setTimeout(() => {
                OUTER_IDS.forEach(id => {
                  const el = svgEl.getElementById(id);
                  if (el) el.classList.add('bulb-on');
                });
                bulbInterval = setTimeout(() => {
                  OUTER_IDS.forEach(id => {
                    const el = svgEl.getElementById(id);
                    if (el) el.classList.remove('bulb-on');
                  });
                  fireSequence();
                }, bulbDuration);
              }, sparkCycle * 2);
            }
            fireSequence();

            // Store cleanup ref on the splash element
            splash._clearBulb = () => clearTimeout(bulbInterval);
          }));
        }
      })
      .catch(() => {}); // silently fail if SVG can't load

    // ── Dismiss: dissolve in place, restart idle timer ────────────
    let gone = false;
    function dissolve() {
      if (gone) return;
      gone = true;
      if (splash._clearBulb) splash._clearBulb();
      splash.classList.add('dissolve');
      setTimeout(() => {
        splash.remove();
        resetTimer(); // restart 2-min clock after dismiss
      }, 3000);
    }

    splash.addEventListener('click', dissolve);
    splash.addEventListener('touchend', dissolve, { passive: true });
  }

  // ── Idle timer management ─────────────────────────────────────────
  function resetTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(showIdleSplash, IDLE_MS);
  }

  ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'].forEach(evt => {
    document.addEventListener(evt, resetTimer, { passive: true });
  });

  resetTimer(); // start the clock
})();
