(function () {
  const now       = Date.now();
  sessionStorage.setItem('splash_last', now);

  // ── All 5 theme color sets ─────────────────────────────────────
  // Order: Midnight, Ember, Forest, Arctic, Miami
  const NEON     = ['#1e90ff', '#e8651a', '#39ff14', '#0077b6', '#ff2d95'];
  const BODY     = ['#1e90ff', '#e8651a', '#39ff14', '#f0f8ff', '#00e5ff'];
  const INNER    = ['#1e90ff', '#3d0000', '#39ff14', '#f0f8ff', '#00e5ff'];
  const CONTRAST = ['#00cfff', '#ff1a1a', '#a5d6a7', '#48a9d4', '#b026ff'];
  const LIMB     = ['#1e90ff', '#e8651a', '#4caf50', '#0077b6', '#b026ff'];

  const CYCLE      = 4000;  // ms — spider color rotation
  const TEXT_CYCLE = 10000; // ms — title glow rotation (slower)

  // Build a @keyframes block cycling through 5 values.
  // pulseFn (optional): adds a bright spike just before each transition.
  //   hold at base+17% → spike at base+19% → next color at base+20%
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
      transition: all 3000ms ease-out;
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
    .arm-group { transform-box: fill-box; }
    #phone-arm-group    { transform-origin: 0%   100%; animation: pivot-r 2.0s 0.0s ease-in-out infinite alternate; }
    #plug-arm-group     { transform-origin: 0%   100%; animation: pivot-r 2.5s 0.4s ease-in-out infinite alternate; }
    #wrench1-arm-group  { transform-origin: 100% 100%; animation: pivot-l 3.2s 0.2s ease-in-out infinite alternate; }
    #wrench2-arm-group  { transform-origin: 100% 100%; animation: pivot-l 2.7s 1.0s ease-in-out infinite alternate; }
    #hammer-arm-group   { transform-origin: 100% 0%;   animation: pivot-l 2.2s 0.6s ease-in-out infinite alternate; }
    #magglass-arm-group { transform-origin: 100% 0%;   animation: pivot-l 2.4s 0.5s ease-in-out infinite alternate; }
    #gear-leg-group     { transform-origin: 0%   0%;   animation: pivot-r 3.0s 0.8s ease-in-out infinite alternate; }
    #brief-leg-group    { transform-origin: 0%   0%;   animation: pivot-r 2.8s 1.2s ease-in-out infinite alternate; }
    @keyframes pivot-r { from { transform: rotate(-15deg); } to { transform: rotate(15deg);  } }
    @keyframes pivot-l { from { transform: rotate(15deg);  } to { transform: rotate(-15deg); } }

    /* ── Text ───────────────────────────────────────────────────── */
    #splash-screen .splash-title {
      margin-top: 2rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-size: 2.5rem;
      font-weight: 300;
      letter-spacing: 0.35em;
      text-transform: uppercase;
    }
    #splash-screen .splash-subtitle {
      margin-top: 0.75rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
    }

    /* ── Title neon glow cycle (slower) ────────────────────────── */
    ${kf('title-neon-cycle',
        i => `color: ${NEON[i]}; text-shadow: 0 0 10px ${NEON[i]}, 0 0 25px ${NEON[i]}, 0 0 50px ${NEON[i]};`,
        i => `color: #fff;       text-shadow: 0 0 20px #fff, 0 0 50px ${NEON[i]}, 0 0 100px ${NEON[i]};`)}
    ${kf('subtitle-neon-cycle',
        i => `color: ${NEON[i]}; text-shadow: 0 0 8px ${NEON[i]}, 0 0 18px ${NEON[i]}, 0 0 35px ${NEON[i]};`,
        i => `color: #fff;       text-shadow: 0 0 15px #fff, 0 0 35px ${NEON[i]}, 0 0 70px ${NEON[i]};`)}

    /* ── Neon color cycles ──────────────────────────────────────── */
    ${kf('neon-glow-cycle',
        i => `stroke: ${NEON[i]}; filter: drop-shadow(0 0 6px ${NEON[i]}) drop-shadow(0 0 16px ${NEON[i]}) drop-shadow(0 0 30px ${NEON[i]});`,
        i => `stroke: #fff; filter: drop-shadow(0 0 20px #fff) drop-shadow(0 0 50px ${NEON[i]}) drop-shadow(0 0 90px ${NEON[i]});`)}
    ${kf('spark-cycle',
        i => `stroke: ${NEON[i]}; filter: drop-shadow(0 0 6px ${NEON[i]}) drop-shadow(0 0 16px ${NEON[i]}) drop-shadow(0 0 4px #fff);`,
        i => `stroke: #fff; filter: drop-shadow(0 0 20px #fff) drop-shadow(0 0 50px ${NEON[i]}) drop-shadow(0 0 90px ${NEON[i]});`)}
    ${kf('body-fill-cycle',
        i => `fill: ${BODY[i]};`,
        i => `fill: #ffffff;`)}
    ${kf('inner-fill-cycle',
        i => `fill: ${INNER[i]};`,
        i => `fill: #ffffff;`)}
    ${kf('limb-cycle',
        i => `fill: ${BODY[i]}; stroke: ${LIMB[i]};`,
        i => `fill: #fff; stroke: #fff;`)}
    ${kf('contrast-cycle',
        i => `fill: ${CONTRAST[i]}; filter: drop-shadow(0 0 6px ${CONTRAST[i]}) drop-shadow(0 0 14px ${CONTRAST[i]});`,
        i => `fill: #fff; filter: drop-shadow(0 0 20px #fff) drop-shadow(0 0 50px ${CONTRAST[i]}) drop-shadow(0 0 80px ${CONTRAST[i]});`)}

    /* ── Circuit glow ───────────────────────────────────────────── */
    .circuit-glow {
      animation:
        circuit-breathe 1.2s ease-in-out infinite alternate,
        neon-glow-cycle ${CYCLE}ms linear infinite;
    }
    @keyframes circuit-breathe {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    /* ── Outer body (resting — cycles contrast colors) ──────────── */
    .outer-bulb {
      animation: contrast-cycle ${CYCLE}ms linear infinite;
    }
    .outer-bulb.bulb-on {
      animation: bulb-settle 1.5s ease-out forwards !important;
    }
    @keyframes bulb-settle {
      0%   { fill: #444; filter: none; }
      5%   { fill: #fff; filter: drop-shadow(0 0 30px #fff) drop-shadow(0 0 60px #fff) drop-shadow(0 0 90px #fff); }
      30%  { fill: #fffde7; filter: drop-shadow(0 0 16px #fff) drop-shadow(0 0 35px #fff); }
      100% { fill: #fff8e1; filter: drop-shadow(0 0 5px #fff) drop-shadow(0 0 14px #fff); }
    }

    /* ── Text wave — single pass then long pause ───────────────── */
    /* Wave lives in first 2% of the 50s cycle (~1s), rest is hold  */
    @keyframes text-wave-big {
      0%          { transform: translateY(0); }
      1%          { transform: translateY(-22px); }
      2%          { transform: translateY(0); }
      2.01%, 100% { transform: translateY(0); }
    }
    @keyframes text-wave {
      0%          { transform: translateY(0); }
      1%          { transform: translateY(-14px); }
      2%          { transform: translateY(0); }
      2.01%, 100% { transform: translateY(0); }
    }
    .splash-title span, .splash-subtitle span {
      display: inline-block;
    }
  `;
  document.head.appendChild(style);

  // Timing constants
  const WAVE_CYCLE = 50;    // seconds — full cycle (wave + 45s pause)
  const AT_STEP    = 0.12;  // stagger between AracnaTech letters
  const BH_OFFSET  = 2.2;   // BH starts after AT's last letter finishes (10 * 0.12 + 1s = 2.2s)
  const BH_STEP    = 0.12;  // stagger between Brandon Hixson letters

  // Build letter spans: each gets staggered wave + continuous neon cycle
  function waveText(text, waveName, neonAnim, step, baseDelay = 0) {
    return [...text].map((ch, i) => {
      const delay = (baseDelay + i * step).toFixed(2);
      return `<span style="animation: ${waveName} ${WAVE_CYCLE}s ease-in-out ${delay}s infinite, ${neonAnim};">${ch === ' ' ? '&nbsp;' : ch}</span>`;
    }).join('');
  }

  const splash = document.createElement('div');
  splash.id = 'splash-screen';
  splash.innerHTML = `
    <div id="splash-spider-wrap"></div>
    <span class="splash-title">${waveText('AracnaTech',    'text-wave-big', `title-neon-cycle ${TEXT_CYCLE}ms linear infinite`,    AT_STEP, 0)}</span>
    <span class="splash-subtitle">${waveText('Brandon Hixson', 'text-wave',     `subtitle-neon-cycle ${TEXT_CYCLE + 3000}ms linear infinite`, BH_STEP, BH_OFFSET)}</span>
  `;
  document.body.prepend(splash);

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

  const OUTER_IDS = ['path13','path14','path15','path16'];
  const TOOL_IDS  = ['path2','path3','path4'];

  fetch('images/spiderTrace.svg')
    .then(r => r.text())
    .then(svg => {
      const wrap = document.getElementById('splash-spider-wrap');
      wrap.innerHTML = svg;
      const svgEl = wrap.querySelector('svg');

      // Hide background trace layer
      TOOL_IDS.forEach(id => {
        const el = svgEl.getElementById(id);
        if (el) el.style.display = 'none';
      });

      // Cutout fills match splash background
      ['path23','path49','ellipse49','rect51','rect52','rect53'].forEach(id => {
        const el = svgEl.getElementById(id);
        if (el) { el.style.fill = '#000'; el.style.stroke = 'none'; }
      });

      // Group arm/leg pivots
      armDefs.forEach(([groupId, pathIds]) => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.id = groupId;
        g.classList.add('arm-group');
        pathIds.forEach(id => {
          const el = svgEl.getElementById(id);
          if (el) g.appendChild(el);
        });
        svgEl.appendChild(g);
      });

      // ── Theme-cycling body fills ───────────────────────────────
      // Structural gray body parts
      svgEl.querySelectorAll('[style*="fill:#808080"]').forEach(e => {
        if (e.id !== 'path17') {
          e.style.fill = BODY[0];
          e.style.animation = `body-fill-cycle ${CYCLE}ms linear infinite`;
        }
      });

      // Limb paths — stroke + fill cycle
      const limbIds = [
        'path20','path21','path24','path25','path40','path41',
        'path43','path44','path27','path28','path30','path31',
        'path34','path35','path37','path38',
      ];
      limbIds.forEach(id => {
        const el = svgEl.getElementById(id);
        if (el) {
          el.style.fill      = BODY[0];
          el.style.stroke    = LIMB[0];
          el.style.strokeWidth = '8';
          el.style.animation = `limb-cycle ${CYCLE}ms linear infinite`;
        }
      });

      // Outer body — contrast color cycle
      OUTER_IDS.forEach(id => {
        const el = svgEl.getElementById(id);
        if (el) el.classList.add('outer-bulb');
      });

      // ── Electric inner-body circuit ────────────────────────────
      const innerBody = svgEl.getElementById('path17');
      if (innerBody) {
        innerBody.style.fill      = INNER[0];
        innerBody.style.animation = `inner-fill-cycle ${CYCLE}ms linear infinite`;

        // Circuit glow outline
        const circuitGlow = innerBody.cloneNode(true);
        circuitGlow.removeAttribute('id');
        circuitGlow.style.cssText = `fill:none;stroke:${NEON[0]};stroke-width:5`;
        circuitGlow.classList.add('circuit-glow');
        svgEl.appendChild(circuitGlow);

        // Traveling spark
        const spark = innerBody.cloneNode(true);
        spark.removeAttribute('id');
        spark.style.cssText = `fill:none;stroke:${NEON[0]};stroke-width:3`;
        spark.classList.add('electric-spark');
        svgEl.appendChild(spark);

        requestAnimationFrame(() => requestAnimationFrame(() => {
          const len   = spark.getTotalLength();
          const pulse = len * 0.12;
          const sparkCycle = 900;

          const st = document.createElement('style');
          st.textContent = `
            .electric-spark {
              stroke-dasharray: ${pulse.toFixed(1)} ${(len - pulse).toFixed(1)};
              stroke-dashoffset: ${len.toFixed(1)};
              animation:
                spark-travel ${sparkCycle}ms linear infinite,
                spark-cycle ${CYCLE}ms linear infinite;
            }
            @keyframes spark-travel { to { stroke-dashoffset: 0; } }
          `;
          document.head.appendChild(st);

          // Bulb fire sequence
          const bulbDuration  = 1500;
          const pauseBetween  = 400;
          function fireSequence() {
            setTimeout(() => {
              OUTER_IDS.forEach(id => {
                const el = svgEl.getElementById(id);
                if (el) el.classList.add('bulb-on');
              });
              setTimeout(() => {
                OUTER_IDS.forEach(id => {
                  const el = svgEl.getElementById(id);
                  if (el) el.classList.remove('bulb-on');
                });
                setTimeout(fireSequence, pauseBetween);
              }, bulbDuration);
            }, sparkCycle * 2);
          }
          fireSequence();
        }));
      }
    });

  let gone = false;
  function dissolve() {
    if (gone) return;
    gone = true;
    splash.classList.add('dissolve');
    setTimeout(() => splash.remove(), 3000);
  }

  splash.addEventListener('click', dissolve);
})();
