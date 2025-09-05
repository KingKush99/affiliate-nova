// js/dedupe-footer.js
// Removes duplicate footer category blocks and duplicate columns within a block.
(function(){
  'use strict';
  const onReady = (fn)=> (document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn):fn());

  onReady(function(){
    // 1) Keep only the first .footer-categories block on the page
    const blocks = Array.from(document.querySelectorAll('.footer-categories'));
    if (blocks.length > 1) {
      blocks.slice(1).forEach(b => b.remove());
    }

    // 2) Inside the first block, ensure unique columns by heading text
    const first = document.querySelector('.footer-categories');
    if (!first) return;

    const seen = new Set();
    Array.from(first.querySelectorAll('.footer-col h4')).forEach(h => {
      const key = (h.textContent || '').trim().toLowerCase();
      if (seen.has(key)) {
        // remove duplicate column
        const col = h.closest('.footer-col');
        if (col) col.remove();
      } else {
        seen.add(key);
      }
    });

    // 3) Make sure utilities row is below categories
    const util = document.querySelector('.footer-utilities');
    if (util && first && util.compareDocumentPosition(first) & Node.DOCUMENT_POSITION_FOLLOWING) {
      // utilities is above categories; move it under
      first.parentNode.insertBefore(util, first.nextSibling);
    }
  });
})();
