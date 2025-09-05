
async function loadRooms(){
  const res = await fetch('data/rooms.json');
  const data = await res.json();
  const grid = document.getElementById('room-grid');
  grid.innerHTML='';
  data.sort((a,b)=>b.watching-a.watching);
  data.forEach(r=>{
    const card = document.createElement('div');
    card.className='card';
    card.innerHTML = `
      <div class="count">${r.watching.toLocaleString()} watching</div>
      <div class="meta">
        <div><strong>${r.name}</strong><span class="badge">${r.gender}</span></div>
        <div>${r.region} · ${r.rate}/min</div>
      </div>`;
    grid.appendChild(card);
  });
}
// hamburger
const hambBtn = ()=>document.getElementById('hamb-btn');
function toggleMenu(){ document.getElementById('menu').classList.toggle('open'); }
function toggleChat(){ document.getElementById('chat').classList.toggle('open'); }
// file uploads show thumbnails
function attachChat(){
  const input = document.getElementById('chat-file');
  input.addEventListener('change',()=>{
    const body = document.getElementById('chat-body');
    [...input.files].forEach(f=>{
      const item = document.createElement('div'); item.className='chat-msg';
      item.textContent = 'Attached: '+ f.name;
      body.appendChild(item);
    });
  });
}

function setVisitedHoverRule(){
  const style = document.createElement('style');
  style.innerHTML = `a:hover{color:var(--orange)} a:visited:hover{color:var(--red)}`;
  document.head.appendChild(style);
}
function buildOdometer(id, n){
  const host = document.getElementById(id);
  const digits = `${n}`.split('');
  const wrap = document.createElement('div'); wrap.className='digits';
  digits.forEach((d,i)=>{
    const span = document.createElement('div'); span.className='d'; span.textContent=d;
    wrap.appendChild(span);
  });
  host.innerHTML=''; host.appendChild(wrap);
}

document.addEventListener('DOMContentLoaded', async ()=>{
  setVisitedHoverRule();
  await I18N.load(localStorage.getItem('lang')||'en');
  await loadRooms();
  attachChat();
  buildOdometer('odo-online', 2469);
  buildOdometer('odo-all', 864089);
  document.getElementById('lang').addEventListener('change', async (e)=>{
    const v = e.target.value; localStorage.setItem('lang', v); await I18N.load(v);
  });
});
