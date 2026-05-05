#!/usr/bin/env node
// Captures the splash screen animation and exports as an animated GIF.
// Output: images/icons/splash-spider.gif
// Run: node capture-splash-gif.js

const puppeteer  = require('puppeteer');
const http       = require('http');
const fs         = require('fs');
const path       = require('path');
const { execSync } = require('child_process');
const os         = require('os');

const ROOT     = __dirname;
const OUT_GIF  = path.join(ROOT, 'images', 'icons', 'splash-spider.gif');
const FRAMES_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'splash-frames-'));

// ── Capture settings ────────────────────────────────────────────────
const WIDTH      = 400;   // px — viewport & output size
const HEIGHT     = 400;
const FPS        = 12;    // frames per second
const DURATION_S = 20;    // capture 1 full 5-theme cycle (5 × 4s)
const SETTLE_MS  = 800;   // wait after page load before capturing

// ── Tiny static HTTP server ──────────────────────────────────────────
const MIME = {
  '.html': 'text/html', '.js': 'text/javascript',
  '.css': 'text/css',   '.svg': 'image/svg+xml',
  '.png': 'image/png',  '.gif': 'image/gif',
  '.mp4': 'video/mp4',  '.webm': 'video/webm',
};

const server = http.createServer((req, res) => {
  const filePath = path.join(ROOT, req.url === '/' ? '/index.html' : req.url);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end(); return; }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

const PORT = 54321;

(async () => {
  server.listen(PORT);
  console.log(`Server on http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-web-security'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 });

  // Patch sessionStorage so splash always shows
  await page.evaluateOnNewDocument(() => {
    const _get = sessionStorage.getItem.bind(sessionStorage);
    sessionStorage.getItem = (k) => k === 'splash_last' ? null : _get(k);
  });

  await page.goto(`http://localhost:${PORT}/splash-dev.html`, { waitUntil: 'networkidle0' });

  // Wait for SVG to load and animations to start
  await new Promise(r => setTimeout(r, SETTLE_MS));

  const totalFrames = DURATION_S * FPS;
  const interval    = 1000 / FPS;
  console.log(`Capturing ${totalFrames} frames at ${FPS}fps (${DURATION_S}s)…`);

  for (let i = 0; i < totalFrames; i++) {
    const framePath = path.join(FRAMES_DIR, `frame${String(i).padStart(5, '0')}.png`);
    await page.screenshot({ path: framePath, clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });
    if (i % FPS === 0) process.stdout.write(`  ${i / FPS}s / ${DURATION_S}s\r`);
    await new Promise(r => setTimeout(r, interval));
  }
  console.log(`\nCapture complete — ${totalFrames} frames saved.`);

  await browser.close();
  server.close();

  // ── Assemble GIF with ffmpeg ───────────────────────────────────────
  console.log('Building GIF with ffmpeg…');
  const palette = path.join(FRAMES_DIR, 'palette.png');

  // 1. Generate optimised palette
  execSync(
    `ffmpeg -y -framerate ${FPS} -i "${FRAMES_DIR}/frame%05d.png" ` +
    `-vf "scale=400:-1:flags=lanczos,palettegen=stats_mode=diff" "${palette}"`,
    { stdio: 'inherit' }
  );

  // 2. Render GIF using palette
  execSync(
    `ffmpeg -y -framerate ${FPS} -i "${FRAMES_DIR}/frame%05d.png" -i "${palette}" ` +
    `-lavfi "scale=400:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" ` +
    `"${OUT_GIF}"`,
    { stdio: 'inherit' }
  );

  // Cleanup
  fs.rmSync(FRAMES_DIR, { recursive: true });

  const size = (fs.statSync(OUT_GIF).size / 1024).toFixed(0);
  console.log(`\n✓  images/icons/splash-spider.gif  (${size} KB)`);
})();
