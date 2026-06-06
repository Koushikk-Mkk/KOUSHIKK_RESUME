/**
 * main.js — Bootstrap: load resume data, init modules, scroll-spy, mobile nav
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Start background immediately — does not depend on resume data
  Background.init();

  try {
    const data = await loadResumeData();
    Render.renderAll(data);

    Theme.init();
    Typing.init(data.profile.typingPhrases);
    Projects.init();
    Contact.init(data.contact);

    initScrollReveal();
    initScrollSpy();
    initMobileNav();
    initHeaderScroll();
  } catch (err) {
    console.error('Error loading resume:', err);
    document.body.innerHTML = `
      <div style="padding:4rem;text-align:center;font-family:sans-serif;">
        <h1>Unable to load resume</h1>
        <p>Could not load resume data. Make sure <code>data/resume-data.js</code> exists.</p>
        <p style="color:#64748b;font-size:0.9rem;">${err.message}</p>
      </div>
    `;
  }
});

/**
 * Load resume data — uses resume-data.js (file://) with fetch fallback (http/https)
 */
async function loadResumeData() {
  if (window.RESUME_DATA) {
    return window.RESUME_DATA;
  }

  const response = await fetch('data/resume.json');
  if (!response.ok) throw new Error('Failed to fetch resume.json');
  return response.json();
}

/** Intersection Observer for scroll-reveal animations */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const skillFills = document.querySelectorAll('.skill__fill');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  skillFills.forEach((el) => skillObserver.observe(el));
}

/** Highlight active nav link on scroll */
function initScrollSpy() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.dataset.section === id);
          });
        }
      });
    },
    { threshold: 0.3, rootMargin: `-${getHeaderHeight()}px 0px -50% 0px` }
  );

  sections.forEach((section) => spyObserver.observe(section));
}

/** Mobile hamburger menu toggle */
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });

  menu.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav__link')) {
      menu.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/** Add shadow to header on scroll */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('header--scrolled', window.scrollY > 20);
  }, { passive: true });
}

function getHeaderHeight() {
  return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 64;
}
