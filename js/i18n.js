
const I18N = {
  cache:{},
  current:'en',
  async load(lang){
    const res = await fetch(`data/i18n/${lang}.json`);
    if(!res.ok) throw new Error('i18n fetch failed');
    const j = await res.json();
    I18N.cache = j; I18N.current = lang;
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(I18N.cache[key]) el.textContent = I18N.cache[key];
    });
    const welcome = I18N.cache['chat_welcome'] || 'Welcome!';
    const chatWelcome = document.getElementById('chat-welcome');
    if(chatWelcome) chatWelcome.textContent = welcome;
  }
};
