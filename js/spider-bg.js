(function () {
  // ── Styles ──────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #spider-bg {
      position: fixed;
      top: 0;
      left: 0;
      width: 110px;
      height: 110px;
      z-index: 50;
      opacity: 0.8;
      pointer-events: none;
      will-change: transform;
    }
    #spider-bg svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    /* ── Limb walk cycle ── */
    .sb-limb { transform-box: fill-box; }

    #sb-phone,    #sb-gear     { transform-origin: 0%   100%; animation: sb-walk-a 0.14s linear infinite; }
    #sb-wrench1,  #sb-magglass { transform-origin: 100% 100%; animation: sb-walk-a 0.14s linear infinite; }
    #sb-plug,     #sb-brief    { transform-origin: 0%   0%;   animation: sb-walk-b 0.14s linear infinite; }
    #sb-wrench2,  #sb-hammer   { transform-origin: 100% 0%;   animation: sb-walk-b 0.14s linear infinite; }

    @keyframes sb-walk-a {
      0%   { transform: rotate(-8deg); }
      50%  { transform: rotate( 8deg); }
      100% { transform: rotate(-8deg); }
    }
    @keyframes sb-walk-b {
      0%   { transform: rotate( 8deg); }
      50%  { transform: rotate(-8deg); }
      100% { transform: rotate( 8deg); }
    }

    #spider-bg.sb-idle .sb-limb { animation-play-state: paused; }

    /* ── Electric body ── */
    .sb-circuit-glow {
      animation: sb-breathe 1.2s ease-in-out infinite alternate;
    }
    @keyframes sb-breathe {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    .sb-outer-bulb.sb-bulb-on {
      animation: sb-bulb 1.5s ease-out forwards;
    }
  `;
  document.head.appendChild(style);

  // ── Container ───────────────────────────────────────────────────
  const el = document.createElement('div');
  el.id = 'spider-bg';
  document.body.appendChild(el);

  const TOOL_IDS = [
    'path2','path3','path4',
    'path26',
    'path22','path23','rect54',
    'path42','ellipse49',
    'path45','path49','rect51','rect52','rect53',
    'path29','path51',
    'path32','path33',
    'path36',
    'path39'
  ];

  const LIMBS = [
    ['sb-phone',    ['path20','path21']],
    ['sb-plug',     ['path24','path25']],
    ['sb-gear',     ['path40','path41']],
    ['sb-brief',    ['path43','path44']],
    ['sb-magglass', ['path27','path28']],
    ['sb-hammer',   ['path30','path31']],
    ['sb-wrench1',  ['path34','path35']],
    ['sb-wrench2',  ['path37','path38']],
  ];

  const OUTER_IDS = ['path13','path14','path15','path16'];

  // ── Theme color ─────────────────────────────────────────────────
  const THEME_COLORS = {
    'theme-ember':  '#e8651a',
    'theme-forest': '#4caf50',
    'theme-arctic': '#0077b6',
    'theme-miami':  '#ff2d95',
  };

  const CONTRAST_COLORS = {
    'theme-ember':  '#ff1a1a',  // neon crimson (neon maroon bulb)
    'theme-forest': '#a5d6a7',  // light green outer
    'theme-arctic': '#48a9d4',  // icy blue outer glow
    'theme-miami':  '#b026ff',  // neon purple outer
  };

  // Structural body fill (legs, outer shell)
  const BODY_FILL_COLORS = {
    'theme-ember':  '#e8651a',  // ember orange
    'theme-forest': '#39ff14',  // neon green
    'theme-arctic': '#f0f8ff',  // ice white
    'theme-miami':  '#00e5ff',  // neon blue
  };

  // Inner circuit body fill (path17) — falls back to BODY_FILL_COLORS if not specified
  const INNER_BODY_COLORS = {
    'theme-ember':  '#3d0000',  // deep maroon
  };

  // Per-theme limb stroke color — falls back to THEME_COLORS if not specified
  const LIMB_COLORS = {
    'theme-miami':  '#b026ff',  // neon purple legs
  };

  function getBodyFillColor() {
    const cls = document.documentElement.className;
    for (const [key, color] of Object.entries(BODY_FILL_COLORS)) {
      if (cls.includes(key)) return color;
    }
    return '#1e90ff'; // midnight default
  }

  function getThemeColor() {
    const cls = document.documentElement.className;
    for (const [key, color] of Object.entries(THEME_COLORS)) {
      if (cls.includes(key)) return color;
    }
    return '#1e90ff'; // Midnight default
  }

  function getContrastColor() {
    const cls = document.documentElement.className;
    for (const [key, color] of Object.entries(CONTRAST_COLORS)) {
      if (cls.includes(key)) return color;
    }
    return '#00cfff'; // bright electric blue bulb
  }

  function getInnerBodyColor() {
    const cls = document.documentElement.className;
    for (const [key, color] of Object.entries(INNER_BODY_COLORS)) {
      if (cls.includes(key)) return color;
    }
    return getBodyFillColor();
  }

  function getLimbColor() {
    const cls = document.documentElement.className;
    for (const [key, color] of Object.entries(LIMB_COLORS)) {
      if (cls.includes(key)) return color;
    }
    return getThemeColor();
  }

  let glowEl = null, sparkEl = null, innerEl = null;
  let lastNeonColor = '', lastBodyFill = '', lastInnerFill = '';
  let bodyEls = [];   // structural gray body parts (excludes path17)
  let limbEls = [];   // limb path elements
  const neonStyle = document.createElement('style');
  document.head.appendChild(neonStyle);

  function applyNeonColor(color) {
    const contrast    = getContrastColor();
    const bodyFill    = getBodyFillColor();
    neonStyle.textContent = `
      .sb-circuit-glow { filter: drop-shadow(0 0 6px ${color}) drop-shadow(0 0 16px ${color}) drop-shadow(0 0 30px ${color}); }
      .sb-spark { filter: drop-shadow(0 0 6px ${color}) drop-shadow(0 0 16px ${color}) drop-shadow(0 0 4px #fff) drop-shadow(0 0 1px #fff); }
      @keyframes sb-bulb {
        0%   { fill: ${bodyFill}; filter: none; }
        5%   { fill: #ffffff; filter: drop-shadow(0 0 30px #fff) drop-shadow(0 0 60px ${contrast}) drop-shadow(0 0 90px ${contrast}); }
        30%  { fill: #fffde7; filter: drop-shadow(0 0 16px ${contrast}) drop-shadow(0 0 35px ${contrast}); }
        100% { fill: #fff8e1; filter: drop-shadow(0 0 5px ${contrast}) drop-shadow(0 0 14px ${contrast}); }
      }
    `;
    if (glowEl) glowEl.style.stroke = color;
    if (sparkEl) sparkEl.style.stroke = color;
    // Tint structural body parts
    if (bodyFill !== lastBodyFill) {
      bodyEls.forEach(e => { e.style.fill = bodyFill; });
      lastBodyFill = bodyFill;
    }
    // Inner circuit body — separate color per theme
    const innerFill = getInnerBodyColor();
    if (innerFill !== lastInnerFill) {
      if (innerEl) innerEl.style.fill = innerFill;
      lastInnerFill = innerFill;
    }
    // Tint limb paths — use per-theme limb color if defined
    const limbColor = getLimbColor();
    limbEls.forEach(e => {
      e.style.stroke = limbColor;
      e.style.strokeWidth = '1.5';
      e.style.fill = bodyFill;
    });
    lastNeonColor = color;
  }

  fetch('images/spiderTrace.svg')
    .then(r => r.text())
    .then(raw => {
      el.innerHTML = raw;
      const svg = el.querySelector('svg');
      svg.setAttribute('viewBox', '80 140 860 730');

      // Hide tools
      TOOL_IDS.forEach(id => {
        const p = svg.getElementById(id);
        if (p) p.style.display = 'none';
      });

      // Group limbs for walk animation
      LIMBS.forEach(([gid, ids]) => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.id = gid;
        g.classList.add('sb-limb');
        ids.forEach(id => {
          const p = svg.getElementById(id);
          if (p) g.appendChild(p);
        });
        svg.appendChild(g);
      });

      // Collect structural gray body elements (fill:#808080) for theme tinting
      // Exclude path17 (inner body — handled separately as dark circuit base)
      svg.querySelectorAll('[style*="fill:#808080"]').forEach(e => {
        if (e.id !== 'path17') bodyEls.push(e);
      });

      // Collect limb path elements (inside walk groups) for colored stroke
      LIMBS.forEach(([, ids]) => {
        ids.forEach(id => {
          const p = svg.getElementById(id);
          if (p) limbEls.push(p);
        });
      });

      // Electric inner body
      const inner = svg.getElementById('path17');
      if (inner) {
        innerEl = inner;
        inner.style.fill = getInnerBodyColor();

        const glow = inner.cloneNode(true);
        glow.removeAttribute('id');
        glow.setAttribute('fill', 'none');
        glow.setAttribute('stroke-width', '5');
        glow.classList.add('sb-circuit-glow');
        svg.appendChild(glow);
        glowEl = glow;

        const spark = inner.cloneNode(true);
        spark.removeAttribute('id');
        spark.setAttribute('fill', 'none');
        spark.setAttribute('stroke-width', '3');
        spark.classList.add('sb-spark');
        svg.appendChild(spark);
        sparkEl = spark;

        applyNeonColor(getThemeColor());

        OUTER_IDS.forEach(id => {
          const p = svg.getElementById(id);
          if (p) p.classList.add('sb-outer-bulb');
        });

        requestAnimationFrame(() => requestAnimationFrame(() => {
          const len   = spark.getTotalLength();
          const pulse = len * 0.12;
          const cycle = 900;

          const st = document.createElement('style');
          st.textContent = `
            .sb-spark {
              stroke-dasharray: ${pulse.toFixed(1)} ${(len - pulse).toFixed(1)};
              stroke-dashoffset: ${len.toFixed(1)};
              animation: sb-spark-run ${cycle}ms linear infinite;
            }
            @keyframes sb-spark-run { to { stroke-dashoffset: 0; } }
          `;
          document.head.appendChild(st);

          function fireBulb() {
            setTimeout(() => {
              OUTER_IDS.forEach(id => {
                const p = svg.getElementById(id);
                if (p) p.classList.add('sb-bulb-on');
              });
              setTimeout(() => {
                OUTER_IDS.forEach(id => {
                  const p = svg.getElementById(id);
                  if (p) p.classList.remove('sb-bulb-on');
                });
                setTimeout(fireBulb, 400);
              }, 1500);
            }, cycle * 2);
          }
          fireBulb();
        }));
      }

      startCrawl();
    });

  // ── Crawl logic ─────────────────────────────────────────────────
  const SIZE   = 110;
  const SPEED  = 3;
  let x, y, targetX, targetY, angle = 270, running = false;
  let idleTimer = null;

  function W() { return window.innerWidth;  }
  function H() { return window.innerHeight; }

  function setTransform(nx, ny, deg) {
    x = nx; y = ny; angle = deg;
    el.style.transform = `translate(${x}px,${y}px) rotate(${deg}deg)`;
  }

  function pickTarget() {
    const pad = SIZE * 1.5;
    targetX = pad + Math.random() * (W() - SIZE - pad * 2);
    targetY = pad + Math.random() * (H() - SIZE - pad * 2);
  }

  function idle() {
    el.classList.add('sb-idle');
    running = false;
    idleTimer = setTimeout(dash, 800 + Math.random() * 2500);
  }

  function dash() {
    clearTimeout(idleTimer);
    el.classList.remove('sb-idle');
    pickTarget();
    running = true;
  }

  function tick() {
    requestAnimationFrame(tick);
    const c = getThemeColor();
    if (c !== lastNeonColor) applyNeonColor(c);
    if (!running) return;

    const dx = targetX - x;
    const dy = targetY - y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    let delta = targetAngle - angle;
    if (delta >  180) delta -= 360;
    if (delta < -180) delta += 360;
    const newAngle = angle + delta * 0.12;

    if (dist < SPEED + 2) {
      setTransform(targetX, targetY, newAngle);
      idle();
      return;
    }

    setTransform(
      x + (dx / dist) * SPEED,
      y + (dy / dist) * SPEED,
      newAngle
    );
  }

  function startCrawl() {
    // Start from a random edge
    const edge = Math.floor(Math.random() * 4);
    if (edge === 0) { x = Math.random() * W(); y = -SIZE; }
    else if (edge === 1) { x = W() + SIZE; y = Math.random() * H(); }
    else if (edge === 2) { x = Math.random() * W(); y = H() + SIZE; }
    else              { x = -SIZE; y = Math.random() * H(); }

    pickTarget();
    angle = Math.atan2(targetY - y, targetX - x) * (180 / Math.PI) + 90;
    setTransform(x, y, angle);
    running = true;
    requestAnimationFrame(tick);
  }

})();
