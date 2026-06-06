/**
 * typing.js — Animated typing effect for hero section
 */

const Typing = {
  element: null,
  phrases: [],
  phraseIndex: 0,
  charIndex: 0,
  isDeleting: false,
  timer: null,

  init(phrases) {
    this.element = document.getElementById('typing-text');
    if (!this.element || !phrases || phrases.length === 0) return;

    this.phrases = phrases;
    this.type();
  },

  type() {
    const current = this.phrases[this.phraseIndex];
    const displayText = this.isDeleting
      ? current.substring(0, this.charIndex - 1)
      : current.substring(0, this.charIndex + 1);

    this.charIndex = this.isDeleting ? this.charIndex - 1 : this.charIndex + 1;

    this.element.innerHTML = displayText + '<span class="cursor">&nbsp;</span>';

    let delay = this.isDeleting ? 40 : 80;

    if (!this.isDeleting && this.charIndex === current.length) {
      delay = 2000;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
      delay = 500;
    }

    this.timer = setTimeout(() => this.type(), delay);
  }
};
