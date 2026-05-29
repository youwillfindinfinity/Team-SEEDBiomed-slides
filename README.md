# SEEDBiomed Presentation Template

An HTML scientific-presentation template. One file, no build step. Open it in a browser and present, or export to PowerPoint.

- **3 colour themes** in one deck: Teal (default), White, Black
- **13 slide layouts** per theme (title, agenda, methods, results, figures, contributors, conclusions, ...)
- An **image-only full-bleed** slide
- Built-in **"Slide Brief"** prompts that guide what goes on each slide
- A one-class **blank mode** (hide all logos/branding)
- A **PowerPoint export** script (`scripts/export-pptx.js`)
- A deck-wide **minimum 18 px** text size

> **If you use this template, please star the repo.**
> Contributions are welcome. Open a pull request (see [Contributing](#contributing)).

---

## Quick start

### Presenting (no install needed)

1. Clone or download the repo.
2. Open **`SEEDBiomed Template.html`** in any modern browser.
3. Edit text directly in the HTML (or in an editor that shows a live preview).

Everything lives in that one HTML file plus an `assets/` folder for images.

### Exporting to PowerPoint (Node.js required)

Requires **[Node.js 18+](https://nodejs.org)**. Install once, then export any time.

```bash
# install dependencies (run once, creates node_modules/)
npm install

# export all themes to seedbiomed.pptx
npm run export

# export a single theme
npm run export:teal
npm run export:white
npm run export:black

# export with a custom output name
node scripts/export-pptx.js "SEEDBiomed Template.html" my-talk.pptx white
```

> **First run note:** `npm install` downloads Puppeteer and a bundled copy of Chromium (around 200 MB). This is a one-time download.

See [section 8](#8-exporting-to-powerpoint-export-pptxjs) for full export options and troubleshooting.

---

## 1. How the deck is organised

- The file holds **39 slides = 13 slides x 3 colour themes**:
  - **Teal** (the default): slides 1 to 13
  - **White**: slides 14 to 26
  - **Black**: slides 27 to 39
- Each slide is one `<section class="slide ...">` block, sitting inside `<deck-stage>`.
- The three themes are **independent copies**. Editing the teal slide does **not** change the white or black versions; change each where you want it to differ.

**Theme is set by a class on the section:**
| Theme | Class on `<section>` |
|-------|----------------------|
| Teal  | `class="slide ..."` (no theme class) |
| White | `class="slide theme-white ..."` |
| Black | `class="slide theme-black ..."` |

**Other slide modifiers you will see:**
- `deep`: a darker background variant (used for title/section/conclusion slides)
- `fullbleed`: the image-only slide (just an image and logo, no text)

---

## 2. Changing the brand logo (SEEDBiomed)

The brand appears in three places: the small **footer** mark on every slide, the large faint **watermark** on title/closing slides, and the **full-bleed** slide. They all point at one file:

```
assets/seed-mark.png
```

**To replace the brand logo everywhere at once:** drop your new logo into `assets/` with the **same filename** (`seed-mark.png`), overwriting it. Every slide updates automatically with no HTML editing needed.

- Use a **transparent PNG** so it works on teal, white, and black backgrounds.
- A simple icon/mark (not the full logo with text) works best at footer size.

**The word "SEEDBiomed"** next to the mark is separate text. To rename the brand, find `SEEDBiomed` in the footers (and the title-slide eyebrow) and replace it.

> The SEEDBiomed name and logo are brand assets. See [Licence and copyright](#licence--copyright) before reusing them.

---

## 3. Blank mode: hide all logos

The template ships with two standard states, so you can choose branded or completely blank:

| State | How to set it | What you get |
|-------|---------------|--------------|
| **Branded** (default) | `<body>` | SEEDBiomed mark and wordmark in footers, watermarks, full-bleed brand |
| **Blank** (no logos) | `<body class="no-branding">` | every logo, watermark and wordmark hidden; only page numbers and your content remain |

To switch the **whole deck** (all 39 slides, all themes) to blank, add the class to the single `<body>` tag near the top of the file:
```html
<body class="no-branding">
```
Remove the class to go back to branded. That one edit is all that is needed.

> Page numbers stay in place (they move to the right when branding is hidden). The full-bleed slide becomes a pure image with no logo overlay.

### Optional: partner / affiliation logos
A partner-logo wall (white "chips" on the acknowledgements slide, plus a strip on the title slide) is **not** part of the standard template, but the building blocks are in the repo and it can be switched on. Institution logo files live in `assets/affiliations/`. **Before using any of them, read [Third-party logos and trademarks](#third-party-logos--trademarks).**

---

## 4. Editing text

Find the text in the HTML and edit it. The semantic classes:

- **Slide title:** `<h1 class="display">` or `<h2 class="display">`
- **Intro line under a title:** `<p class="lead">`
- **Body text:** `class="body-copy"`
- *Italic words* in a heading go gold automatically: `<em>like this</em>`
- The **"Slide Brief"** boxes (the gold-edged guidance prompts) use `class="brief"`. Delete the whole `<div class="brief">...</div>` on a slide once you have written real content, or leave them as a guide.

**Text size rule:** keep everything at 18 px or above (set deck-wide). Headlines and body text are much larger.

---

## 5. Images / figures

Empty image areas are **placeholders** marked `class="ph"` (the dashed boxes with a "Drag an image here" label). To use a real image, replace the placeholder `<div class="ph">...</div>` with:
```html
<img src="assets/my-figure.png" alt="" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">
```
Put your figure files anywhere in `assets/`.

---

## 6. Colours (advanced)

The palette is defined once as CSS variables near the top of the file (inside `<style>`), and each theme overrides them. Key tokens:

| Token | Meaning |
|-------|---------|
| `--bg` / `--bg-deep` | slide background (normal / "deep" variant) |
| `--text` / `--text-secondary` / `--text-muted` | text colours |
| `--amber` | gold accent (eyebrows, italics, page numbers) |
| `--cyan` | cyan accent (the "O", dots) |
| `--hairline` | thin divider lines |

To recolour a theme, edit its block: `:root { ... }` (teal), `.slide.theme-white { ... }`, or `.slide.theme-black { ... }`. Use the existing tokens in your slides (`color: var(--amber)`) rather than hard-coding new colours, so themes stay consistent.

---

## 7. Adding, removing, reordering slides

- **Reorder / skip / delete:** use the thumbnail rail in the live preview. Drag to reorder, right-click for skip/delete.
- **Add a slide by hand:** copy an existing `<section class="slide ...">...</section>` block and paste it where you want it. Keep the theme class consistent with its neighbours.
- The **page numbers** in footers (e.g. `12 / 13`) are typed text. Update them if you add or remove slides.

---

## 8. Exporting to PowerPoint (`scripts/export-pptx.js`)

The deck stays as HTML and does **not** auto-convert. To get a `.pptx`, run the included script `scripts/export-pptx.js`. It opens the HTML in a headless browser, renders each slide at 1920x1080, and writes one slide image per page into a PowerPoint file. Slides come out as flat images, so they are not editable text inside PowerPoint.

### Install the dependencies (once)
You need [Node.js 18+](https://nodejs.org) installed. Then, in this folder, run:
```bash
npm install
```
This installs `puppeteer` (headless Chrome) and `pptxgenjs`, as listed in `package.json`. Puppeteer downloads a bundled copy of Chromium on the first run (around 200 MB, one-time only).

### Run the export
```bash
# using the npm shortcuts
npm run export          # all themes, output: seedbiomed.pptx
npm run export:teal     # teal only,  output: seedbiomed-teal.pptx
npm run export:white    # white only, output: seedbiomed-white.pptx
npm run export:black    # black only, output: seedbiomed-black.pptx

# or call the script directly for a custom output name
node scripts/export-pptx.js "SEEDBiomed Template.html" my-talk.pptx white
```
The three arguments are: **input HTML**, **output filename**, **theme filter** (optional, defaults to `all`).

### Editing the script directly
Open `scripts/export-pptx.js`. The settings you are most likely to change are the constants near the top:

| Constant | What it does | Try changing it to... |
|----------|--------------|---------------------|
| `INPUT`  | default input file if you do not pass one | your HTML filename |
| `OUTPUT` | default output `.pptx` name | `"my-deck.pptx"` |
| `THEME`  | default theme filter | `'teal'`, `'white'`, `'black'`, or `'all'` |
| `W`, `H` | slide pixel size (design is 1920x1080) | leave unless your design size differs |
| `SCALE`  | image resolution multiplier | `3` for sharper output (bigger files), `1` for smaller |

Other common changes inside the file:
- **Filter slides differently:** the `want(lbl)` function decides which slides are included, based on each slide's `data-screen-label`.
- **Settling time:** if images or fonts are not fully rendered in a capture, increase the `setTimeout` delays (the `1500` after load, and the `400` per slide).
- **Headless on/off:** change `headless: 'new'` to `headless: false` to watch it run in a visible browser window, which is useful for debugging.

> Common failure causes: Node or Puppeteer out of date (`npm install puppeteer@latest`), or the input filename not matching exactly. Mind spaces and capitalisation, and always quote the filename.

---

## Licence and copyright

**© SEEDBiomed. All rights reserved.**

The SEEDBiomed **name, logo, brand mark (`assets/seed-mark.png`), wordmark, and overall visual identity** are the property of SEEDBiomed and are **not** covered by any open-source licence. You may **use and adapt this template for your own presentations**, but you may **not**:

- redistribute or pass off the SEEDBiomed brand assets as your own, or
- imply that your work is produced, endorsed, or affiliated with SEEDBiomed without permission.

If you reuse the template for a non-SEEDBiomed talk, replace the brand mark and wordmark (see [section 2](#2-changing-the-brand-logo-seedbiomed)) or switch on [blank mode](#3-blank-mode-hide-all-logos).

*This section is provided for clarity and is **not legal advice**.*

---

## Third-party logos and trademarks

The `assets/affiliations/` folder may contain **institution and organisation logos that are the property of their respective owners**. They are included **for identification and affiliation purposes only**. Their presence here:

- does **not** transfer any rights in those logos,
- does **not** imply endorsement of this template by those organisations, and
- does **not** grant you permission to use them.

**Each logo remains the property of its respective owner.** If you fork or reuse this template, **remove any logo you do not have the right to display.** When in doubt, contact the organisation's brand or communications office.

| File | Belongs to |
|------|-----------|
| `AMS_VU_UMC.png` | Amsterdam UMC |
| `EramusMC.png` | Erasmus MC, Rotterdam |
| `RUMC.png` | Radboud University Medical Centre (Radboudumc) |
| `UMC.png` | UMC Utrecht |
| `UUtrecht.png` | Utrecht University |
| `UVA.png` | University of Amsterdam |
| `NKUA.png` | National and Kapodistrian University of Athens |
| `QUB.png` | Queen's University Belfast |
| `acta.png` | ACTA (Academic Centre for Dentistry Amsterdam) |
| `RKZ.png` | Rode Kruis Ziekenhuis (Red Cross Hospital), Beverwijk |
| `oncode_logo.jpg` | Oncode Institute |
| `vermeulen_logo.jpg` | Vermeulen Lab |
| `InformaticsLab42.png` | Lab42 |
| `metahealth.png` | MetaHealth |
| `CSL.png` | CSL |
| `ADBC.jpeg` | ADBC |
| `NBS.jpeg` | NBS |

> The logo and trademark for each entry remain the property of that organisation regardless of how it is labelled here.

---

## Contributing

This is a public repo and contributions are welcome.

- **Star the repo** if you use it. It helps others find the template.
- **Open a pull request** for improvements: new slide layouts, theme tweaks, export-script fixes, accessibility, or documentation.
- **Open an issue** for bugs or requests.

**Please follow these conventions in any pull request:**
- Maintain **three-theme parity**: apply layout changes to teal, white, and black.
- Keep the **minimum 18 px** text size.
- **Do not commit third-party logos** (or any brand assets) you do not have the right to distribute. Pull requests that add such files may be rejected.
- Keep the deck a **single HTML file** with assets under `assets/`.

---

## Disclaimer

This template is provided "as is", without warranty of any kind. You are responsible for ensuring you have the rights to any logos, images, fonts, or content you add to your own version. Nothing in this README constitutes legal advice.
