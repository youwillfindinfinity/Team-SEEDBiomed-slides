/**
 * SEEDBiomed Scientific Presentation Template - export-pptx.js
 * Author:    Roland V. Bumbuc, on behalf of SEEDBiomed
 * Copyright: (c) SEEDBiomed. All rights reserved.
 * Licence:   Proprietary. Redistribution, resale, or rebranding without
 *            written permission from SEEDBiomed is prohibited.
 *
 * export-pptx.js - convert the SEEDBiomed HTML deck into a .pptx
 *
 * Renders every slide at 1920x1080 and places one full-bleed image per slide.
 * Slides are flat images (not editable text in PowerPoint).
 *
 * SETUP (run once in this folder):
 *   npm install
 *
 * RUN (from the repo root):
 *   npm run export
 *   node scripts/export-pptx.js "SEEDBiomed Template.html" seedbiomed.pptx
 *   # optional 3rd arg: theme filter - teal | white | black | all (default all)
 *   node scripts/export-pptx.js "SEEDBiomed Template.html" seedbiomed-white.pptx white
 */

const path = require('path');
const puppeteer = require('puppeteer');
const PptxGenJS = require('pptxgenjs');

// Resolve INPUT relative to the repo root (one level up from scripts/)
const REPO_ROOT = path.resolve(__dirname, '..');
const INPUT   = process.argv[2] || 'SEEDBiomed Template.html';
const OUTPUT  = process.argv[3] || 'deck.pptx';
const THEME   = (process.argv[4] || 'all').toLowerCase();   // teal | white | black | all

const W = 1920, H = 1080;          // slide design size
const SCALE = 2;                   // 2x for crisp images

(async () => {
  const fileUrl = 'file://' + path.resolve(REPO_ROOT, INPUT);
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: SCALE });

  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  // let the deck-stage component define + fonts load
  await page.waitForSelector('deck-stage > section');
  await new Promise(r => setTimeout(r, 1500));

  // Drop the component's auto-scaling so each slide renders at true 1920x1080,
  // and collect the slide labels so we can filter by theme.
  const labels = await page.evaluate(() => {
    const ds = document.querySelector('deck-stage');
    ds.setAttribute('noscale', '');               // deck-stage drops its shadow-DOM scale
    const secs = [...document.querySelectorAll('deck-stage > section')];
    return secs.map(s => s.getAttribute('data-screen-label') || '');
  });

  // Decide which slide indices to export based on the theme filter.
  const want = (lbl) => {
    const l = lbl.toLowerCase();
    if (THEME === 'all')   return true;
    if (THEME === 'white') return l.includes('white');
    if (THEME === 'black') return l.includes('black');
    if (THEME === 'teal')  return !l.includes('white') && !l.includes('black');
    return true;
  };
  const indices = labels.map((l, i) => ({ l, i })).filter(o => want(o.l)).map(o => o.i);

  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'HD', width: 13.333, height: 7.5 }); // 16:9 inches
  pptx.layout = 'HD';

  for (const i of indices) {
    // Show only slide i, force it to full size, and report its on-screen rect.
    const rect = await page.evaluate((idx) => {
      const secs = [...document.querySelectorAll('deck-stage > section')];
      secs.forEach((s, k) => {
        s.style.display = (k === idx) ? 'block' : 'none';
        s.style.opacity = (k === idx) ? '1' : '0';
      });
      const s = secs[idx];
      s.style.position = 'absolute';
      s.style.left = '0'; s.style.top = '0';
      s.style.width = '1920px'; s.style.height = '1080px';
      const r = s.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height };
    }, i);

    await new Promise(r => setTimeout(r, 400)); // settle layout/images

    const buf = await page.screenshot({
      type: 'png',
      clip: { x: Math.max(0, rect.x), y: Math.max(0, rect.y), width: W, height: H },
    });

    const slide = pptx.addSlide();
    slide.addImage({
      data: 'image/png;base64,' + buf.toString('base64'),
      x: 0, y: 0, w: 13.333, h: 7.5,
    });
    console.log(`captured ${labels[i]}  (slide index ${i})`);
  }

  await browser.close();
  await pptx.writeFile({ fileName: OUTPUT });
  console.log(`\n✅ wrote ${OUTPUT}  —  ${indices.length} slides`);
})().catch(e => { console.error(e); process.exit(1); });
