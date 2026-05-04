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
      opacity: 0.6;
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
      animation: sb-breathe 2s ease-in-out infinite alternate;
      filter: drop-shadow(0 0 2px #00ffcc);
    }
    @keyframes sb-breathe {
      from { opacity: 0.08; }
      to   { opacity: 0.3;  }
    }
    .sb-spark {
      filter: drop-shadow(0 0 2px #00ffcc) drop-shadow(0 0 4px #fff);
    }
    .sb-outer-bulb.sb-bulb-on {
      animation: sb-bulb 1.5s ease-out forwards;
    }
    @keyframes sb-bulb {
      0%   { fill: #808080; filter: none; }
      5%   { fill: #ffffff; filter: drop-shadow(0 0 20px #fff) drop-shadow(0 0 40px #ffe57a); }
      30%  { fill: #fffde7; filter: drop-shadow(0 0 10px #ffe57a) drop-shadow(0 0 20px #ffe57a); }
      100% { fill: #fff8e1; filter: drop-shadow(0 0 3px #ffe57a) drop-shadow(0 0 8px #ffe57a); }
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

      // Electric inner body
      const inner = svg.getElementById('path17');
      if (inner) {
        inner.style.fill = '#0d0d0d';

        const glow = inner.cloneNode(true);
        glow.removeAttribute('id');
        glow.style.cssText = 'fill:none;stroke:#00ffcc;stroke-width:3';
        glow.classList.add('sb-circuit-glow');
        svg.appendChild(glow);

        const spark = inner.cloneNode(true);
        spark.removeAttribute('id');
        spark.style.cssText = 'fill:none;stroke:#e0ffff;stroke-width:2';
        spark.classList.add('sb-spark');
        svg.appendChild(spark);

        OUTER_IDS.forEach(id => {
          const p = svg.getElementById(id);
          if (p) p.classList.add('sb-outer-bulb');
        });

        requestAnimationFrame(() => requestAnimationFrame(() => {
          const len   = spark.getTotalLength();
          const pulse = len * 0.07;
          const cycle = 1600;

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
