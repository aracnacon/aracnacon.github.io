#!/usr/bin/env node
// Generates per-theme static spider SVG icons from spiderTrace.svg.
// Run: node generate-spider-icons.js
// Output: images/icons/spider-{theme}.svg

const fs   = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'images', 'spiderTrace.svg');
const outDir  = path.join(__dirname, 'images', 'icons');

fs.mkdirSync(outDir, { recursive: true });

// IDs from spider-bg.js
const TOOL_IDS = [
  'path2','path3','path4','path26','path22','path23','rect54',
  'path42','ellipse49','path45','path49','rect51','rect52','rect53',
  'path29','path51','path32','path33','path36','path39',
];
const OUTER_IDS = ['path13','path14','path15','path16'];
const LIMB_IDS  = [
  'path20','path21','path24','path25','path40','path41',
  'path43','path44','path27','path28','path30','path31',
  'path34','path35','path37','path38',
];

const THEMES = {
  midnight: { body: '#1e90ff', inner: '#1e90ff', neon: '#1e90ff', contrast: '#00cfff', limb: '#1e90ff' },
  ember:    { body: '#e8651a', inner: '#3d0000', neon: '#e8651a', contrast: '#ff1a1a', limb: '#e8651a' },
  forest:   { body: '#39ff14', inner: '#39ff14', neon: '#4caf50', contrast: '#a5d6a7', limb: '#4caf50' },
  arctic:   { body: '#f0f8ff', inner: '#f0f8ff', neon: '#0077b6', contrast: '#48a9d4', limb: '#0077b6' },
  miami:    { body: '#00e5ff', inner: '#00e5ff', neon: '#ff2d95', contrast: '#b026ff', limb: '#b026ff' },
};

const raw = fs.readFileSync(svgPath, 'utf8');

for (const [name, c] of Object.entries(THEMES)) {
  const css = `
    ${TOOL_IDS.map(id => `#${id}`).join(', ')} { display: none !important; }
    [style*="fill:#808080"] { fill: ${c.body} !important; }
    [style*="fill:#ffffff"] { fill: ${c.body} !important; }
    #path17 {
      fill: ${c.inner} !important;
      filter: drop-shadow(0 0 8px ${c.neon}) drop-shadow(0 0 20px ${c.neon});
    }
    ${OUTER_IDS.map(id => `#${id}`).join(', ')} {
      fill: ${c.contrast} !important;
      filter: drop-shadow(0 0 6px ${c.contrast}) drop-shadow(0 0 14px ${c.contrast});
    }
    ${LIMB_IDS.map(id => `#${id}`).join(', ')} {
      fill: ${c.body} !important;
      stroke: ${c.limb} !important;
      stroke-width: 8 !important;
    }
  `;

  // Inject <style> into the self-closing <defs> tag
  let out = raw.replace(/<defs\s[^>]*\/>/, `<defs id="defs1"><style>${css}</style></defs>`);

  // Crop to the body viewport used by the crawling spider
  out = out.replace(/viewBox="[^"]*"/, 'viewBox="80 140 860 730"');

  const dest = path.join(outDir, `spider-${name}.svg`);
  fs.writeFileSync(dest, out);
  console.log(`✓  images/icons/spider-${name}.svg`);
}
