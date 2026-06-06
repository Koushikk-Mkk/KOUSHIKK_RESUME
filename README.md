# Koushikk M — Personal Resume Website

A modern, responsive personal resume website built with vanilla HTML, CSS, and JavaScript.

## Share to Phone or Another Laptop

**Do NOT send only `index.html`** — it needs the `css/`, `js/`, `data/`, and `assets/` folders to work.

Use one of these methods instead:

| Method | What to share | Works on phone? |
|--------|---------------|-----------------|
| **GitHub Pages (best)** | Live URL: `https://YOUR_USERNAME.github.io/repo-name/` | Yes |
| **Single file** | `standalone.html` (entire site in one file) | Yes |
| **Full folder** | Zip the whole `resume-website` folder | Yes (after unzip) |

### Option A — GitHub Pages URL (recommended)

Deploy to GitHub (see below), then share your live link on WhatsApp, email, or LinkedIn. It loads exactly the same on any device with internet.

### Option B — Send `standalone.html`

This file has **everything embedded** — CSS, JavaScript, your photo, PDF, waves, and all content.

1. After updating content, rebuild:
   ```bash
   npm run build:standalone
   ```
2. Send `standalone.html` via WhatsApp, email, Google Drive, etc.
3. Open it in Chrome/Safari on any phone or laptop.

### Option C — Zip the project folder

Zip the entire `resume-website` folder (not just `index.html`). Extract on the other device and open `index.html`.

---

## Deploy to GitHub

### Step 1 — Create a GitHub repository

1. Go to [github.com/new](https://github.com/new)
2. Name it e.g. `koushikk-resume`
3. Leave it **Public**, do **not** add README (we already have one)
4. Click **Create repository**

### Step 2 — Push your code

```bash
cd C:\Users\Admin\Desktop\resume-website
git init
git add .
git commit -m "Add personal resume website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/koushikk-resume.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### Step 3 — Enable GitHub Pages

1. Open your repo on GitHub → **Settings** → **Pages**
2. **Source:** Deploy from branch → `main` → `/ (root)` → **Save**
3. Wait 1–2 minutes. Your site is live at:
   `https://YOUR_USERNAME.github.io/koushikk-resume/`

Share that URL — it works on phones, laptops, and tablets.

---

## Project Structure

```
resume-website/
├── index.html              # Main site (use with full folder or GitHub Pages)
├── standalone.html         # Single-file version for sharing
├── css/                    # Stylesheets
├── js/                     # JavaScript modules
├── data/
│   ├── resume.json         # Edit resume content here
│   └── resume-data.js      # Auto-synced loader for index.html
├── assets/
│   ├── resume.pdf
│   └── images/
├── scripts/
│   └── build-standalone.js # Builds standalone.html
└── package.json
```

## Updating Content

1. Edit `data/resume.json`
2. Sync for `index.html`:
   ```bash
   npm run sync:data
   ```
3. Rebuild portable single file:
   ```bash
   npm run build:standalone
   ```
4. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update resume content"
   git push
   ```

## Local Preview

**Double-click `index.html`** (needs the full folder) or run:

```bash
npx serve .
```

## Features

- Neon orange/red theme with animated wave background
- Dark / light mode toggle
- Typing animation, project filters, contact form
- Download resume PDF button
- Mobile responsive

## License

Personal use. Content © Koushikk M.
