(function () {
  const THEME_VIDEOS = {
    'default':      'videos/theme-midnight.mp4',
    'theme-ember':  'videos/theme-ember.mp4',
    'theme-forest': 'videos/theme-forest.mp4',
    'theme-arctic': 'videos/theme-arctic.mp4',
    'theme-miami':  'videos/theme-miami.mp4',
  };

  // ── Video element ───────────────────────────────────────────────
  const video = document.createElement('video');
  video.id        = 'video-bg';
  video.autoplay  = true;
  video.muted     = true;
  video.loop      = true;
  video.playsInline = true;
  document.body.prepend(video);

  // ── Dark overlay ────────────────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.id = 'video-bg-overlay';
  document.body.prepend(overlay);

  // ── Frost (Arctic only) ──────────────────────────────────────────

  // Deterministic RNG (mulberry32)
  function rng(seed) {
    let s = seed | 0;
    return function () {
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Draw one jagged crack branch, recursively splitting
  function drawBranch(ctx, x, y, angle, length, rand, alpha, depth) {
    if (length < 10 || depth > 4) return;

    const segs = 3 + Math.floor(rand() * 3);
    const segLen = length / segs;
    let cx = x, cy = y, dir = angle;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    for (let i = 0; i < segs; i++) {
      dir += (rand() - 0.5) * 0.7;
      cx  += Math.cos(dir) * segLen;
      cy  += Math.sin(dir) * segLen;
      ctx.lineTo(cx, cy);
    }
    ctx.strokeStyle = `rgba(220, 242, 255, ${(alpha * (1 - depth * 0.18)).toFixed(2)})`;
    ctx.lineWidth   = Math.max(0.4, 1.8 - depth * 0.35);
    ctx.stroke();

    // Sub-branches
    const midX = x + (cx - x) * (0.4 + rand() * 0.3);
    const midY = y + (cy - y) * (0.4 + rand() * 0.3);
    if (rand() < 0.75)
      drawBranch(ctx, midX, midY, angle + (rand() > 0.5 ? 1 : -1) * (0.4 + rand() * 0.6),
        length * (0.35 + rand() * 0.25), rand, alpha, depth + 1);
    if (rand() < 0.5)
      drawBranch(ctx, cx, cy, angle + (rand() > 0.5 ? 1 : -1) * (0.3 + rand() * 0.5),
        length * (0.25 + rand() * 0.2), rand, alpha, depth + 1);
  }

  function drawFrost(canvas, progress) {
    const w = canvas.width  = window.innerWidth;
    const h = canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    if (progress < 0.02) return;

    const reach = Math.min(w, h) * 0.85 * progress;

    // ── Edge frost bands (top, bottom, left, right) ──────────────
    const edgeAlpha = (0.65 * progress).toFixed(3);
    const edgeSize  = Math.min(w, h) * 0.58 * progress;

    [
      { x0: 0,   y0: 0,   x1: 0,   y1: edgeSize  },  // top
      { x0: 0,   y0: h,   x1: 0,   y1: h - edgeSize }, // bottom
      { x0: 0,   y0: 0,   x1: edgeSize,   y1: 0   },  // left
      { x0: w,   y0: 0,   x1: w - edgeSize, y1: 0 },  // right
    ].forEach(({ x0, y0, x1, y1 }) => {
      const g = ctx.createLinearGradient(x0, y0, x1, y1);
      g.addColorStop(0,   `rgba(215, 238, 255, ${edgeAlpha})`);
      g.addColorStop(0.5, `rgba(210, 235, 255, ${(edgeAlpha * 0.4).toFixed(3)})`);
      g.addColorStop(1,   'rgba(210, 235, 255, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    });

    // ── Corner glow patches ──────────────────────────────────────
    const corners = [
      { x: 0, y: 0 }, { x: w, y: 0 },
      { x: 0, y: h }, { x: w, y: h },
    ];
    corners.forEach(({ x, y }, ci) => {
      const grad = ctx.createRadialGradient(x, y, 0, x, y, reach);
      grad.addColorStop(0,   `rgba(200, 230, 255, ${(0.68 * progress).toFixed(2)})`);
      grad.addColorStop(0.6, `rgba(210, 235, 255, ${(0.22 * progress).toFixed(2)})`);
      grad.addColorStop(1,   'rgba(210, 235, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Just 1-2 subtle cracks per corner
      const r = rng(ci * 7919 + 31);
      const angle = [Math.PI*0.25, Math.PI*0.75, -Math.PI*0.25, -Math.PI*0.75][ci];
      const numCracks = 1 + Math.floor(progress * 2);
      for (let i = 0; i < numCracks; i++) {
        const dir = angle + (r() - 0.5) * 0.5;
        const len = reach * (0.3 + r() * 0.3);
        drawBranch(ctx, x, y, dir, len, r, 0.12 + progress * 0.15, 0);
      }
    });
  }

  let frostCanvas   = null;
  let frostProgress = 0;

  function showFrost() {
    if (frostCanvas) return;
    frostCanvas = document.createElement('canvas');
    frostCanvas.id = 'frost-overlay';
    document.body.appendChild(frostCanvas);
  }

  function hideFrost() {
    if (!frostCanvas) return;
    frostCanvas.remove();
    frostCanvas   = null;
    frostProgress = 0;
  }

  function updateFrost() {
    if (!frostCanvas || !video.duration) return;
    // Only ever increase — frost builds up and stays at full
    const p = video.currentTime / video.duration;
    if (p > frostProgress) {
      frostProgress = p;
      drawFrost(frostCanvas, frostProgress);
    }
  }

  video.addEventListener('timeupdate', updateFrost);
  window.addEventListener('resize', () => {
    if (frostCanvas) drawFrost(frostCanvas, frostProgress);
  });

  // ── Theme detection ─────────────────────────────────────────────
  function getTheme() {
    for (const cls of document.documentElement.classList) {
      if (THEME_VIDEOS[cls]) return cls;
    }
    return 'default';
  }

  let currentTheme = null;

  function applyTheme(theme) {
    if (theme === currentTheme) return;
    currentTheme = theme;

    video.src = THEME_VIDEOS[theme];
    video.load();
    video.play().catch(() => {});
    document.body.style.backgroundImage = 'none';

    if (theme === 'theme-arctic') showFrost();
    else hideFrost();
  }

  applyTheme(getTheme());

  new MutationObserver(() => applyTheme(getTheme()))
    .observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
})();
