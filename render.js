/**
 * render.js — Builds DOM sections from resume.json data
 */

const Render = {
  data: null,

  /** Escape HTML to prevent XSS from JSON content */
  esc(str) {
    if (!str) return '';
    const el = document.createElement('span');
    el.textContent = str;
    return el.innerHTML;
  },

  /** Render navigation links */
  renderNav() {
    const menu = document.getElementById('nav-menu');
    if (!menu || !this.data.nav) return;

    menu.innerHTML = this.data.nav.map(item => `
      <li><a href="#${item.id}" class="nav__link" data-section="${item.id}">${this.esc(item.label)}</a></li>
    `).join('');

    // Hide research nav if no publications
    if (!this.data.publications || this.data.publications.length === 0) {
      const researchLink = menu.querySelector('[data-section="research"]');
      if (researchLink) researchLink.parentElement.remove();
    }
  },

  /** Render hero section */
  renderHero() {
    const { profile } = this.data;
    const section = document.getElementById('hero');
    if (!section) return;

    section.innerHTML = `
      <div class="container hero__inner">
        <div class="hero__content reveal">
          <p class="hero__greeting">Hello, I'm</p>
          <h1 class="hero__name">${this.esc(profile.name)}</h1>
          <p class="hero__designation">${this.esc(profile.designation)}</p>
          <div class="hero__typing" id="typing-text" aria-live="polite"></div>
          <p class="hero__intro">${this.esc(profile.intro)}</p>
          <div class="hero__actions">
            <a href="#contact" class="btn btn--primary">Get In Touch</a>
            <a href="${this.esc(profile.resumeUrl)}" class="btn btn--outline" download>
              <i class="fa-solid fa-download"></i> Download Resume
            </a>
          </div>
        </div>
        <div class="hero__image reveal reveal-delay-1">
          <img src="${this.esc(profile.photo)}" alt="${this.esc(profile.name)}" class="hero__photo" width="280" height="280">
        </div>
      </div>
    `;
  },

  /** Render about section */
  renderAbout() {
    const { about, profile } = this.data;
    const section = document.getElementById('about');
    if (!section) return;

    const highlights = (about.highlights || []).map(h => `
      <li class="about__highlight reveal">
        <i class="fa-solid fa-check-circle"></i>
        <span>${this.esc(h)}</span>
      </li>
    `).join('');

    section.innerHTML = `
      <div class="container">
        <div class="section__header reveal">
          <span class="section__label">About Me</span>
          <h2 class="section__title">Who I Am</h2>
        </div>
        <div class="about__grid">
          <div class="about__text reveal">
            <p>${this.esc(about.summary)}</p>
          </div>
          <ul class="about__highlights">${highlights}</ul>
        </div>
      </div>
    `;
  },

  /** Render education timeline */
  renderEducation() {
    const section = document.getElementById('education');
    if (!section) return;

    const items = this.data.education.map((edu, i) => `
      <div class="timeline__item reveal reveal-delay-${Math.min(i + 1, 3)}">
        <div class="timeline__dot"></div>
        <span class="timeline__period">${this.esc(edu.period)}</span>
        <h3 class="timeline__title">${this.esc(edu.degree)}</h3>
        <p class="timeline__subtitle">${this.esc(edu.institution)} — ${this.esc(edu.location)}</p>
        <p class="timeline__details">${this.esc(edu.details)}</p>
      </div>
    `).join('');

    section.innerHTML = `
      <div class="container">
        <div class="section__header reveal">
          <span class="section__label">Education</span>
          <h2 class="section__title">Academic Background</h2>
        </div>
        <div class="timeline">${items}</div>
      </div>
    `;
  },

  /** Render work experience timeline */
  renderExperience() {
    const section = document.getElementById('experience');
    if (!section) return;

    const items = this.data.experience.map((exp, i) => {
      const bullets = (exp.description || []).map(d => `<li>${this.esc(d)}</li>`).join('');
      return `
        <div class="timeline__item reveal reveal-delay-${Math.min(i + 1, 3)}">
          <div class="timeline__dot"></div>
          <span class="timeline__period">${this.esc(exp.period)}</span>
          <h3 class="timeline__title">${this.esc(exp.title)}</h3>
          <p class="timeline__subtitle">${this.esc(exp.company)}</p>
          <ul class="timeline__list">${bullets}</ul>
        </div>
      `;
    }).join('');

    section.innerHTML = `
      <div class="container">
        <div class="section__header reveal">
          <span class="section__label">Experience</span>
          <h2 class="section__title">Work & Internships</h2>
        </div>
        <div class="timeline">${items}</div>
      </div>
    `;
  },

  /** Render skills with progress bars */
  renderSkills() {
    const section = document.getElementById('skills');
    if (!section || !this.data.skills) return;

    const renderGroup = (title, icon, skills) => {
      const bars = skills.map(skill => `
        <div class="skill reveal">
          <div class="skill__header">
            <span class="skill__name"><i class="${this.esc(skill.icon)}"></i> ${this.esc(skill.name)}</span>
            <span class="skill__level">${skill.level}%</span>
          </div>
          <div class="skill__bar">
            <div class="skill__fill" data-level="${skill.level}" style="--level: ${skill.level}%"></div>
          </div>
        </div>
      `).join('');

      return `
        <div>
          <h3 class="skills__group-title"><i class="${icon}"></i> ${title}</h3>
          ${bars}
        </div>
      `;
    };

    section.innerHTML = `
      <div class="container">
        <div class="section__header reveal">
          <span class="section__label">Skills</span>
          <h2 class="section__title">Technical & Soft Skills</h2>
        </div>
        <div class="skills__grid">
          ${renderGroup('Technical Skills', 'fa-solid fa-code', this.data.skills.technical || [])}
          ${renderGroup('Languages & Soft Skills', 'fa-solid fa-users', this.data.skills.soft || [])}
        </div>
      </div>
    `;
  },

  /** Render certification cards */
  renderCertifications() {
    const section = document.getElementById('certifications');
    if (!section) return;

    const cards = (this.data.certifications || []).map((cert, i) => `
      <div class="card reveal reveal-delay-${Math.min(i + 1, 3)}">
        <div class="card__icon"><i class="fa-solid fa-certificate"></i></div>
        <h3 class="card__title">${this.esc(cert.name)}</h3>
        <p class="card__meta">${this.esc(cert.issuer)} · ${this.esc(cert.date)}</p>
        <p class="card__desc">${this.esc(cert.description || '')}</p>
        ${cert.url ? `<a href="${this.esc(cert.url)}" class="card__link" target="_blank" rel="noopener">View Certificate <i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''}
      </div>
    `).join('');

    section.innerHTML = `
      <div class="container">
        <div class="section__header reveal">
          <span class="section__label">Certifications</span>
          <h2 class="section__title">Credentials & Recognition</h2>
        </div>
        <div class="card-grid card-grid--3">${cards}</div>
      </div>
    `;
  },

  /** Render project cards (filter buttons added by projects.js) */
  renderProjects() {
    const section = document.getElementById('projects');
    if (!section) return;

    const cards = (this.data.projects || []).map((proj, i) => {
      const tags = (proj.tags || []).map(t => `<span class="tag">${this.esc(t)}</span>`).join('');
      const statusClass = proj.status === 'ongoing' ? 'project-card__status--ongoing' : 'project-card__status--completed';
      const statusLabel = proj.status === 'ongoing' ? 'Ongoing' : 'Completed';

      return `
        <article class="project-card reveal reveal-delay-${Math.min(i % 3 + 1, 3)}" data-category="${this.esc(proj.category)}">
          <img src="${this.esc(proj.image)}" alt="${this.esc(proj.title)}" class="project-card__image" loading="lazy" width="400" height="180">
          <div class="project-card__body">
            <span class="project-card__status ${statusClass}">${statusLabel}</span>
            <h3 class="project-card__title">${this.esc(proj.title)}</h3>
            <p class="project-card__desc">${this.esc(proj.description)}</p>
            <div class="project-card__tags">${tags}</div>
            <div class="project-card__links">
              ${proj.liveUrl ? `<a href="${this.esc(proj.liveUrl)}" target="_blank" rel="noopener" class="card__link"><i class="fa-solid fa-external-link"></i> Live Demo</a>` : ''}
              ${proj.repoUrl ? `<a href="${this.esc(proj.repoUrl)}" target="_blank" rel="noopener" class="card__link"><i class="fa-brands fa-github"></i> Source</a>` : ''}
            </div>
          </div>
        </article>
      `;
    }).join('');

    section.innerHTML = `
      <div class="container">
        <div class="section__header reveal">
          <span class="section__label">Projects</span>
          <h2 class="section__title">Projects & Research Work</h2>
        </div>
        <div class="project-filters" id="project-filters"></div>
        <div class="card-grid card-grid--3" id="project-grid">${cards}</div>
      </div>
    `;
  },

  /** Render achievements */
  renderAchievements() {
    const section = document.getElementById('achievements');
    if (!section) return;

    const cards = (this.data.achievements || []).map((ach, i) => `
      <div class="achievement-card reveal reveal-delay-${Math.min(i % 3 + 1, 3)}">
        <div class="achievement-card__icon"><i class="fa-solid fa-trophy"></i></div>
        <div>
          <p class="achievement-card__year">${this.esc(ach.year)}</p>
          <h3 class="achievement-card__title">${this.esc(ach.title)}</h3>
          <p class="achievement-card__desc">${this.esc(ach.description)}</p>
        </div>
      </div>
    `).join('');

    section.innerHTML = `
      <div class="container">
        <div class="section__header reveal">
          <span class="section__label">Achievements</span>
          <h2 class="section__title">Awards & Activities</h2>
        </div>
        <div class="card-grid">${cards}</div>
      </div>
    `;
  },

  /** Render research & publications (hidden if empty) */
  renderResearch() {
    const section = document.getElementById('research');
    if (!section) return;

    const pubs = this.data.publications || [];
    if (pubs.length === 0) {
      section.style.display = 'none';
      return;
    }

    const cards = pubs.map((pub, i) => {
      const statusBadge = pub.status === 'ongoing'
        ? '<span class="project-card__status project-card__status--ongoing">In Progress</span>'
        : '<span class="project-card__status project-card__status--completed">Published</span>';

      return `
        <div class="publication-card reveal reveal-delay-${Math.min(i + 1, 3)}">
          ${statusBadge}
          <h3 class="publication-card__title">${this.esc(pub.title)}</h3>
          <p class="publication-card__journal">${this.esc(pub.journal)}</p>
          <p class="publication-card__year">${this.esc(pub.year)}</p>
          ${pub.url ? `<a href="${this.esc(pub.url)}" class="card__link" target="_blank" rel="noopener">Read Paper <i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''}
        </div>
      `;
    }).join('');

    section.innerHTML = `
      <div class="container">
        <div class="section__header reveal">
          <span class="section__label">Research</span>
          <h2 class="section__title">Publications & Research Papers</h2>
        </div>
        <div class="card-grid">${cards}</div>
      </div>
    `;
  },

  /** Render contact section with form */
  renderContact() {
    const { contact } = this.data;
    const section = document.getElementById('contact');
    if (!section) return;

    section.innerHTML = `
      <div class="container">
        <div class="section__header reveal">
          <span class="section__label">Contact</span>
          <h2 class="section__title">Get In Touch</h2>
          <p class="section__subtitle">Feel free to reach out for collaborations, internships, or research opportunities.</p>
        </div>
        <div class="contact__grid">
          <div class="contact__info">
            <div class="contact-card reveal">
              <div class="contact-card__icon"><i class="fa-solid fa-envelope"></i></div>
              <div>
                <p class="contact-card__label">Email</p>
                <p class="contact-card__value"><a href="mailto:${this.esc(contact.email)}">${this.esc(contact.email)}</a></p>
              </div>
            </div>
            <div class="contact-card reveal reveal-delay-1">
              <div class="contact-card__icon"><i class="fa-solid fa-phone"></i></div>
              <div>
                <p class="contact-card__label">Phone</p>
                <p class="contact-card__value"><a href="tel:${this.esc(contact.phone.replace(/\s/g, ''))}">${this.esc(contact.phone)}</a></p>
              </div>
            </div>
            <div class="contact-card reveal reveal-delay-2">
              <div class="contact-card__icon"><i class="fa-brands fa-linkedin"></i></div>
              <div>
                <p class="contact-card__label">LinkedIn</p>
                <p class="contact-card__value"><a href="${this.esc(contact.linkedin)}" target="_blank" rel="noopener">koushikk-mkk</a></p>
              </div>
            </div>
            ${contact.github ? `
            <div class="contact-card reveal reveal-delay-3">
              <div class="contact-card__icon"><i class="fa-brands fa-github"></i></div>
              <div>
                <p class="contact-card__label">GitHub</p>
                <p class="contact-card__value"><a href="${this.esc(contact.github)}" target="_blank" rel="noopener">GitHub Profile</a></p>
              </div>
            </div>` : ''}
            <div class="contact-card reveal">
              <div class="contact-card__icon"><i class="fa-solid fa-location-dot"></i></div>
              <div>
                <p class="contact-card__label">Location</p>
                <p class="contact-card__value">${this.esc(contact.location)}</p>
              </div>
            </div>
          </div>
          <form class="form reveal" id="contact-form" novalidate>
            <div class="form__success" id="form-success">Thank you! Your message has been prepared. Your email client will open shortly.</div>
            <div class="form__group">
              <label class="form__label" for="name">Name</label>
              <input class="form__input" type="text" id="name" name="name" required placeholder="Your name">
              <span class="form__error" id="name-error">Please enter your name.</span>
            </div>
            <div class="form__group">
              <label class="form__label" for="email">Email</label>
              <input class="form__input" type="email" id="email" name="email" required placeholder="your@email.com">
              <span class="form__error" id="email-error">Please enter a valid email address.</span>
            </div>
            <div class="form__group">
              <label class="form__label" for="subject">Subject</label>
              <input class="form__input" type="text" id="subject" name="subject" required placeholder="Subject">
              <span class="form__error" id="subject-error">Please enter a subject.</span>
            </div>
            <div class="form__group">
              <label class="form__label" for="message">Message</label>
              <textarea class="form__textarea" id="message" name="message" required placeholder="Your message..." minlength="10"></textarea>
              <span class="form__error" id="message-error">Please enter a message (at least 10 characters).</span>
            </div>
            <button type="submit" class="btn btn--primary">
              <i class="fa-solid fa-paper-plane"></i> Send Message
            </button>
          </form>
        </div>
      </div>
    `;
  },

  /** Render footer with social links */
  renderFooter() {
    const { contact, profile } = this.data;
    const footer = document.getElementById('footer');
    if (!footer) return;

    const year = new Date().getFullYear();
    const socialLinks = [
      { icon: 'fa-brands fa-linkedin', url: contact.linkedin, label: 'LinkedIn' },
      { icon: 'fa-solid fa-envelope', url: `mailto:${contact.email}`, label: 'Email' },
    ];
    if (contact.github) {
      socialLinks.push({ icon: 'fa-brands fa-github', url: contact.github, label: 'GitHub' });
    }

    footer.innerHTML = `
      <div class="container footer__inner">
        <div class="footer__social">
          ${socialLinks.map(s => `
            <a href="${this.esc(s.url)}" aria-label="${this.esc(s.label)}" target="_blank" rel="noopener">
              <i class="${s.icon}"></i>
            </a>
          `).join('')}
        </div>
        <p class="footer__copy">&copy; ${year} ${this.esc(profile.name)}. All rights reserved.</p>
      </div>
    `;
  },

  /** Update SEO meta tags from JSON */
  updateSEO() {
    const { seo, profile } = this.data;
    if (!seo) return;

    document.title = seo.title || `${profile.name} | Resume`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.content = seo.description;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = seo.title;
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = seo.description;

    const resumeBtn = document.getElementById('nav-resume-btn');
    if (resumeBtn && profile.resumeUrl) resumeBtn.href = profile.resumeUrl;
  },

  /** Render all sections */
  renderAll(data) {
    this.data = data;
    this.updateSEO();
    this.renderNav();
    this.renderHero();
    this.renderAbout();
    this.renderEducation();
    this.renderExperience();
    this.renderSkills();
    this.renderCertifications();
    this.renderProjects();
    this.renderAchievements();
    this.renderResearch();
    this.renderContact();
    this.renderFooter();
  }
};
