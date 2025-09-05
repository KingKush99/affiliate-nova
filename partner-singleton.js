// js/partner-singleton.js
// Keep only one virtual partner on the page
document.addEventListener('DOMContentLoaded', () => {
  const viewers = document.querySelectorAll('[data-partner-viewer]');
  viewers.forEach((el, i) => { if (i > 0) el.remove(); });
});
