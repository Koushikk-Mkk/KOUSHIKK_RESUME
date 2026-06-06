/**
 * Builds standalone.html — one self-contained file for sharing via phone/email.
 * Embeds all CSS, JS, resume data, images, and PDF as data URIs.
 *
 * Run: node scripts/build-standalone.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'standalone.html');

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function readBinary(file) {
  return fs.readFileSync(path.join(ROOT, file));
}

function toDataUri(buffer, mime) {
  return `data:${mime};base64,${buffer.toString('base64')}`;
}

function mimeFor(file) {
  const ext = path.extname(file).toLowerCase();
  const map = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.webp': 'image/webp',
  };
  return map[ext] || 'application/octet-stream';
}

function embedAsset(relativePath) {
  const full = path.join(ROOT, relativePath);
  if (!fs.existsSync(full)) {
    console.warn(`Warning: missing asset ${relativePath}`);
    return relativePath;
  }
  const buf = readBinary(relativePath);
  return toDataUri(buf, mimeFor(relativePath));
}

// --- CSS ---
const cssFiles = [
  'css/variables.css',
  'css/base.css',
  'css/layout.css',
  'css/components.css',
  'css/animations.css',
  'css/background.css',
];
const css = cssFiles.map(read).join('\n\n');

// --- Resume data with embedded assets ---
const data = JSON.parse(read('data/resume.json'));

if (data.profile) {
  if (data.profile.photo) data.profile.photo = embedAsset(data.profile.photo);
  if (data.profile.resumeUrl) data.profile.resumeUrl = embedAsset(data.profile.resumeUrl);
}

if (Array.isArray(data.projects)) {
  data.projects.forEach((p) => {
    if (p.image) p.image = embedAsset(p.image);
  });
}

const resumeDataScript = `window.RESUME_DATA = ${JSON.stringify(data)};`;

// --- JS (order matters) ---
const jsFiles = [
  'js/background.js',
  'js/render.js',
  'js/theme.js',
  'js/typing.js',
  'js/projects.js',
  'js/contact.js',
  'js/main.js',
];
const js = jsFiles.map(read).join('\n\n');

// --- HTML shell (from index.html body structure) ---
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Koushikk M — Mechanical Engineer specializing in NDT, automotive design, and structural testing.">
  <meta name="author" content="Koushikk M">
  <meta name="keywords" content="Mechanical Engineer, NDT, Structural Testing, CAD, Koushikk M">
  <meta property="og:title" content="Koushikk M | Mechanical Engineer">
  <meta property="og:description" content="Mechanical Engineer with expertise in structural testing, NDT, and sustainable technologies.">
  <meta property="og:type" content="website">
  <title>Koushikk M | Mechanical Engineer</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
${css}
  </style>
</head>
<body>
  <div class="bg-waves" id="bg-waves" aria-hidden="true">
    <div class="bg-waves__glow bg-waves__glow--orange"></div>
    <div class="bg-waves__glow bg-waves__glow--red"></div>
    <svg class="bg-waves__svg bg-waves__svg--bottom" viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ff6600" stop-opacity="0.35"/>
          <stop offset="50%" stop-color="#ff0040" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#ff6600" stop-opacity="0.35"/>
        </linearGradient>
      </defs>
      <path fill="url(#waveGrad1)" d="M0,60 C150,100 350,20 600,60 C850,100 1050,20 1200,60 L1200,120 L0,120 Z"/>
      <path fill="url(#waveGrad1)" d="M0,80 C150,40 350,100 600,70 C850,40 1050,100 1200,75 L1200,120 L0,120 Z" opacity="0.6"/>
    </svg>
    <svg class="bg-waves__svg bg-waves__svg--bottom-2" viewBox="0 0 1200 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="rgba(255,0,64,0.18)" d="M0,50 C200,90 400,10 600,50 C800,90 1000,10 1200,50 L1200,100 L0,100 Z"/>
      <path fill="rgba(255,102,0,0.14)" d="M0,65 C200,25 400,80 600,55 C800,20 1000,75 1200,60 L1200,100 L0,100 Z"/>
    </svg>
    <svg class="bg-waves__svg bg-waves__svg--top" viewBox="0 0 1200 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="rgba(255,102,0,0.12)" d="M0,40 C300,0 600,70 900,30 C1050,10 1150,50 1200,35 L1200,0 L0,0 Z"/>
      <path fill="rgba(255,0,64,0.1)" d="M0,25 C250,60 550,5 850,40 C1000,55 1100,15 1200,30 L1200,0 L0,0 Z"/>
    </svg>
    <canvas class="bg-waves__canvas" id="wave-canvas"></canvas>
  </div>

  <header class="header" id="header">
    <nav class="nav container" aria-label="Main navigation">
      <a href="#hero" class="nav__logo">KM</a>
      <button class="nav__toggle" id="nav-toggle" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav__menu" id="nav-menu"></ul>
      <div class="nav__actions">
        <button class="btn btn--icon" id="theme-toggle" aria-label="Toggle dark mode">
          <i class="fa-solid fa-moon"></i>
        </button>
        <a href="#" class="btn btn--primary btn--sm" id="nav-resume-btn" download="Koushikk-M-Resume.pdf">
          <i class="fa-solid fa-download"></i> Resume
        </a>
      </div>
    </nav>
  </header>

  <main>
    <section id="hero" class="hero section"></section>
    <section id="about" class="section section--alt"></section>
    <section id="education" class="section"></section>
    <section id="experience" class="section section--alt"></section>
    <section id="skills" class="section"></section>
    <section id="certifications" class="section section--alt"></section>
    <section id="projects" class="section"></section>
    <section id="achievements" class="section section--alt"></section>
    <section id="research" class="section"></section>
    <section id="contact" class="section section--alt"></section>
  </main>

  <footer class="footer" id="footer"></footer>

  <script>
${resumeDataScript}
  </script>
  <script>
${js}
  </script>
</body>
</html>
`;

fs.writeFileSync(OUT, html, 'utf8');
const sizeMB = (fs.statSync(OUT).size / (1024 * 1024)).toFixed(2);
console.log(`Created standalone.html (${sizeMB} MB)`);
console.log('Share this ONE file to any phone or laptop — everything is embedded inside.');
