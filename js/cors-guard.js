// js/cors-guard.js
(function(){
  if (location.protocol === 'file:') {
    console.warn('file:// mode: fetch() to local JSON is blocked by browsers. Run a local server or use GitHub Pages.');
    const tip = document.createElement('div');
    tip.style.cssText='position:fixed;bottom:12px;left:12px;right:12px;padding:12px;background:#1a1a22;color:#ffe8e8;border:1px solid #7a4040;border-radius:10px;z-index:99999;font:14px/1.45 system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif';
    tip.innerHTML='Local file mode detected. Start a local server (e.g. <code>python -m http.server</code>) or push to GitHub Pages. Relative paths like <code>./data/rooms.json</code> will then work.';
    document.addEventListener('DOMContentLoaded',()=>document.body.appendChild(tip));
  }
})();