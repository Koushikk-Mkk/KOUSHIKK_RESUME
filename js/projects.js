/**
 * projects.js — Category filter for project cards
 */

const Projects = {
  init() {
    const filtersContainer = document.getElementById('project-filters');
    const grid = document.getElementById('project-grid');
    if (!filtersContainer || !grid) return;

    const cards = grid.querySelectorAll('.project-card');
    const categories = new Set(['all']);
    cards.forEach((card) => categories.add(card.dataset.category));

    // Build filter buttons
    filtersContainer.innerHTML = Array.from(categories).map((cat) => {
      const label = cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1);
      const active = cat === 'all' ? ' active' : '';
      return `<button class="filter-btn${active}" data-filter="${cat}">${label}</button>`;
    }).join('');

    filtersContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;

      const filter = btn.dataset.filter;

      // Update active button
      filtersContainer.querySelectorAll('.filter-btn').forEach((b) => {
        b.classList.toggle('active', b === btn);
      });

      // Filter cards
      cards.forEach((card) => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
        if (match) {
          card.classList.remove('filter-show');
          void card.offsetWidth; // reflow for animation restart
          card.classList.add('filter-show');
        }
      });
    });
  }
};
