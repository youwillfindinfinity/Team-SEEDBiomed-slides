/**
 * SEEDBiomed Scientific Presentation Template - test.js
 * Author:    Roland V. Bumbuc, on behalf of SEEDBiomed
 * Copyright: (c) SEEDBiomed. All rights reserved.
 *
 * Pre-PR test suite. Run from the repo root:
 *   npm test
 *
 * Requires Node.js 18+ (uses the built-in node:test runner).
 */

'use strict';

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

// ---------------------------------------------------------------------------
// 1. File presence
// ---------------------------------------------------------------------------
describe('Required files exist', () => {
  const required = [
    'SEEDBiomed Template.html',
    'README.md',
    'package.json',
    'scripts/deck-stage.js',
    'scripts/export-pptx.js',
    'assets/seed-mark.png',
    'assets/fonts/fonts.css',
    '.github/ruleset-protect-main.json',
  ];

  for (const file of required) {
    test(file, () => {
      assert.ok(exists(file), `Missing: ${file}`);
    });
  }
});

// ---------------------------------------------------------------------------
// 2. Font files
// ---------------------------------------------------------------------------
describe('Font files exist', () => {
  const fonts = [
    'dm-serif-display-italic-latin-ext.woff2',
    'dm-serif-display-italic-latin.woff2',
    'dm-serif-display-normal-latin-ext.woff2',
    'dm-serif-display-normal-latin.woff2',
    'ibm-plex-mono-400-cyrillic-ext.woff2',
    'ibm-plex-mono-400-cyrillic.woff2',
    'ibm-plex-mono-400-vietnamese.woff2',
    'ibm-plex-mono-400-latin-ext.woff2',
    'ibm-plex-mono-400-latin.woff2',
    'ibm-plex-mono-500-cyrillic-ext.woff2',
    'ibm-plex-mono-500-cyrillic.woff2',
    'ibm-plex-mono-500-vietnamese.woff2',
    'ibm-plex-mono-500-latin-ext.woff2',
    'ibm-plex-mono-500-latin.woff2',
    'ibm-plex-mono-600-cyrillic-ext.woff2',
    'ibm-plex-mono-600-cyrillic.woff2',
    'ibm-plex-mono-600-vietnamese.woff2',
    'ibm-plex-mono-600-latin-ext.woff2',
    'ibm-plex-mono-600-latin.woff2',
    'inter-cyrillic-ext.woff2',
    'inter-cyrillic.woff2',
    'inter-greek-ext.woff2',
    'inter-greek.woff2',
    'inter-vietnamese.woff2',
    'inter-latin-ext.woff2',
    'inter-latin.woff2',
  ];

  for (const font of fonts) {
    test(font, () => {
      assert.ok(exists(`assets/fonts/${font}`), `Missing font: ${font}`);
    });
  }

  test('all font files are non-empty', () => {
    for (const font of fonts) {
      const size = fs.statSync(path.join(ROOT, 'assets/fonts', font)).size;
      assert.ok(size > 1000, `Font file looks empty or corrupt: ${font} (${size} bytes)`);
    }
  });
});

// ---------------------------------------------------------------------------
// 3. HTML integrity
// ---------------------------------------------------------------------------
describe('HTML file', () => {
  const html = read('SEEDBiomed Template.html');

  test('has no Google Fonts CDN references', () => {
    assert.ok(!html.includes('fonts.googleapis.com'), 'Found fonts.googleapis.com');
    assert.ok(!html.includes('fonts.gstatic.com'),   'Found fonts.gstatic.com');
  });

  test('loads fonts from local assets', () => {
    assert.ok(html.includes('assets/fonts/fonts.css'), 'Missing local fonts.css link');
  });

  test('loads deck-stage from scripts/', () => {
    assert.ok(html.includes('src="scripts/deck-stage.js"'), 'deck-stage.js not loaded from scripts/');
  });

  test('has authorship HTML comment', () => {
    assert.ok(html.includes('Roland V. Bumbuc'), 'Missing author name in HTML comment');
    assert.ok(html.includes('SEEDBiomed'), 'Missing SEEDBiomed in HTML comment');
  });

  test('has author meta tag', () => {
    assert.ok(html.includes('name="author"'), 'Missing <meta name="author">');
  });

  test('has copyright meta tag', () => {
    assert.ok(html.includes('name="copyright"'), 'Missing <meta name="copyright">');
  });

  test('contains all three colour themes', () => {
    assert.ok(html.includes('theme-white'), 'Missing white theme slides');
    assert.ok(html.includes('theme-black'), 'Missing black theme slides');
    // teal is the default (no theme class) — check for the deck-stage element
    assert.ok(html.includes('<deck-stage'), 'Missing <deck-stage> element');
  });

  test('has 39 slide sections (13 per theme)', () => {
    const matches = html.match(/<section\s[^>]*class="slide/g) || [];
    assert.equal(matches.length, 39, `Expected 39 slides, found ${matches.length}`);
  });

  test('no stray raw-named woff2 files referenced', () => {
    // Raw Google filenames start with -F6, -nF, or UcC
    assert.ok(!/-F6\w+\.woff2/.test(html), 'Found raw Google font filename in HTML');
    assert.ok(!/-nF\w+\.woff2/.test(html), 'Found raw Google font filename in HTML');
    assert.ok(!/UcC\w+\.woff2/.test(html),  'Found raw Google font filename in HTML');
  });
});

// ---------------------------------------------------------------------------
// 4. fonts.css integrity
// ---------------------------------------------------------------------------
describe('fonts.css', () => {
  const css = read('assets/fonts/fonts.css');

  test('contains no external URLs', () => {
    assert.ok(!css.includes('https://'), 'fonts.css contains an external URL');
    assert.ok(!css.includes('http://'),  'fonts.css contains an external URL');
  });

  test('references all three font families', () => {
    assert.ok(css.includes("'DM Serif Display'"),  'Missing DM Serif Display');
    assert.ok(css.includes("'IBM Plex Mono'"),      'Missing IBM Plex Mono');
    assert.ok(css.includes("'Inter'"),              'Missing Inter');
  });

  test('every url() in fonts.css points to an existing file', () => {
    const refs = [...css.matchAll(/url\('([^']+\.woff2)'\)/g)].map(m => m[1]);
    assert.ok(refs.length > 0, 'No woff2 url() references found in fonts.css');
    for (const ref of refs) {
      assert.ok(
        exists(`assets/fonts/${ref}`),
        `fonts.css references missing file: ${ref}`
      );
    }
  });
});

// ---------------------------------------------------------------------------
// 5. Copyright headers in scripts
// ---------------------------------------------------------------------------
describe('Copyright headers', () => {
  for (const script of ['scripts/deck-stage.js', 'scripts/export-pptx.js']) {
    test(`${script} has copyright block`, () => {
      const src = read(script);
      assert.ok(src.includes('Roland V. Bumbuc'), `Missing author in ${script}`);
      assert.ok(src.includes('SEEDBiomed'),       `Missing SEEDBiomed in ${script}`);
      assert.ok(src.includes('All rights reserved'), `Missing rights statement in ${script}`);
    });
  }
});

// ---------------------------------------------------------------------------
// 6. package.json
// ---------------------------------------------------------------------------
describe('package.json', () => {
  const pkg = JSON.parse(read('package.json'));

  test('has author field', () => {
    assert.ok(pkg.author, 'Missing author field');
    assert.ok(pkg.author.includes('Roland V. Bumbuc'), 'Author name incorrect');
  });

  test('license is UNLICENSED', () => {
    assert.equal(pkg.license, 'UNLICENSED');
  });

  test('is marked private', () => {
    assert.equal(pkg.private, true);
  });

  test('requires Node 18+', () => {
    assert.ok(pkg.engines && pkg.engines.node, 'Missing engines.node');
    assert.ok(pkg.engines.node.includes('18'), 'Node engine should require 18+');
  });

  test('export scripts point to scripts/', () => {
    for (const [name, cmd] of Object.entries(pkg.scripts || {})) {
      if (name.startsWith('export')) {
        assert.ok(
          cmd.includes('scripts/export-pptx.js'),
          `npm script "${name}" does not reference scripts/export-pptx.js`
        );
      }
    }
  });

  test('puppeteer and pptxgenjs are declared as dependencies', () => {
    assert.ok(pkg.dependencies && pkg.dependencies.puppeteer, 'Missing puppeteer dependency');
    assert.ok(pkg.dependencies && pkg.dependencies.pptxgenjs, 'Missing pptxgenjs dependency');
  });
});

// ---------------------------------------------------------------------------
// 7. No stray files in root or assets root
// ---------------------------------------------------------------------------
describe('Folder hygiene', () => {
  test('no raw-named woff2 files in repo root', () => {
    const rootFiles = fs.readdirSync(ROOT);
    const stray = rootFiles.filter(f => f.endsWith('.woff2'));
    assert.deepEqual(stray, [], `Stray woff2 files found in root: ${stray.join(', ')}`);
  });

  test('no woff2 files loose in assets/ root', () => {
    const assetsFiles = fs.readdirSync(path.join(ROOT, 'assets'));
    const stray = assetsFiles.filter(f => f.endsWith('.woff2'));
    assert.deepEqual(stray, [], `Stray woff2 files in assets/: ${stray.join(', ')}`);
  });

  test('uploads/ directory does not exist', () => {
    assert.ok(!exists('uploads'), 'uploads/ should have been removed');
  });

  test('assets/brand/ exists', () => {
    assert.ok(exists('assets/brand'), 'assets/brand/ is missing');
  });

  test('assets/affiliations/ exists', () => {
    assert.ok(exists('assets/affiliations'), 'assets/affiliations/ is missing');
  });
});
