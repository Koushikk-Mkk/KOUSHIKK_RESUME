/**
 * contact.js — Contact form validation and mailto submit
 */

const Contact = {
  contactData: null,

  init(contact) {
    this.contactData = contact;
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => this.handleSubmit(e));
  },

  validateField(id, validator, errorMsg) {
    const input = document.getElementById(id);
    const error = document.getElementById(`${id}-error`);
    const valid = validator(input.value.trim());

    input.classList.toggle('error', !valid);
    if (error) {
      error.classList.toggle('visible', !valid);
      if (!valid && errorMsg) error.textContent = errorMsg;
    }
    return valid;
  },

  validateForm() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const nameValid = this.validateField('name', (v) => v.length >= 2);
    const emailValid = this.validateField('email', (v) => emailRegex.test(v));
    const subjectValid = this.validateField('subject', (v) => v.length >= 3);
    const messageValid = this.validateField('message', (v) => v.length >= 10);

    return nameValid && emailValid && subjectValid && messageValid;
  },

  handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) return;

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    const formAction = this.contactData?.formAction;

    if (formAction) {
      // External form service (e.g. Formspree)
      const form = document.getElementById('contact-form');
      form.action = formAction;
      form.method = 'POST';
      form.submit();
      return;
    }

    // mailto fallback for static hosting
    const to = this.contactData?.email || '';
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const success = document.getElementById('form-success');
    if (success) success.classList.add('visible');

    window.location.href = mailto;
  }
};
