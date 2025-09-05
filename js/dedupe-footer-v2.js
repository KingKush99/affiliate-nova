// js/dedupe-footer-v2.js
// Stronger duplicate cleanup: keeps the FIRST footer-categories block,
// ensures the utilities row is below it, and removes any stray groups of
// category links rendered elsewhere in the footer.
(function(){
  'use strict';
  const ready = (fn)=> (document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn):fn());

  function closestWithin(el, stopEl){
    let n = el;
    while(n && n !== stopEl && n.parentElement){
      if(n.parentElement === stopEl) return n;
      n = n.parentElement;
    }
    return el;
  }

  ready(function(){
    const footer = document.querySelector('footer.site-footer') || document.querySelector('footer');
    if(!footer) return;

    const allBlocks = Array.from(footer.querySelectorAll('.footer-categories'));
    const first = allBlocks[0] || null;

    // Remove extra .footer-categories blocks
    if(allBlocks.length > 1){
      allBlocks.slice(1).forEach(b=>b.remove());
    }

    if(!first) return;

    // Ensure unique columns by heading text inside the first block
    const seen = new Set();
    Array.from(first.querySelectorAll('.footer-col h4')).forEach(h => {
      const key = (h.textContent||'').trim().toLowerCase();
      if(seen.has(key)){
        const col = h.closest('.footer-col');
        if(col) col.remove();
      }else seen.add(key);
    });

    // Move utilities under categories if needed
    const util = footer.querySelector('.footer-utilities');
    if(util){
      // if utilities appear before categories, move them after
      if(util.compareDocumentPosition(first) & Node.DOCUMENT_POSITION_FOLLOWING){
        footer.insertBefore(util, first.nextSibling);
      }
    }

    // Heuristic: remove any stray containers inside the footer that look like
    // "category groups" (lots of search links) but are NOT inside the first block.
    const isCatLink = 'a[href*="age="],a[href*="region="],a[href*="rate="],a[href*="status="],a[href*="category="]';
    const suspects = Array.from(footer.querySelectorAll('div,section,ul,nav'));
    suspects.forEach(node=>{
      if(first.contains(node)) return; // it's in the good block
      const count = node.querySelectorAll(isCatLink).length;
      if(count >= 3){ // looks like a duplicated category group
        const top = closestWithin(node, footer);
        if(top !== first && !first.contains(top)){
          top.remove();
        }
      }
    });
  });
})();