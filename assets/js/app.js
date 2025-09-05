
// basic ui handlers
const grid = document.getElementById('roomsGrid');
const countEl = document.getElementById('roomsCount');
const menuBtn = document.getElementById('menuBtn');
const menuPanel = document.getElementById('menuPanel');
menuBtn.addEventListener('click',()=>menuPanel.classList.toggle('open'));

// chat
const chatBtn = document.getElementById('chatBtn');
const chatPanel = document.getElementById('chatPanel');
const chatClose = document.getElementById('chatClose');
chatBtn.addEventListener('click',()=>chatPanel.classList.toggle('open'));
chatClose.addEventListener('click',()=>chatPanel.classList.remove('open'));
document.getElementById('sendBtn').addEventListener('click',()=>{
  const inp = document.getElementById('chatInput');
  const text = inp.value.trim();
  if(!text) return;
  const div=document.createElement('div'); div.className='msg me'; div.textContent=text;
  document.getElementById('chatBody').append(div);
  inp.value='';
});
document.getElementById('filePick').addEventListener('change',(ev)=>{
  const body=document.getElementById('chatBody');
  [...ev.target.files].forEach(f=>{
    const url = URL.createObjectURL(f);
    let node;
    if(f.type.startsWith('video/')){
      node=document.createElement('video'); node.src=url; node.controls=true; node.style.maxWidth='100%';
    }else{
      node=document.createElement('img'); node.src=url; node.style.maxWidth='100%';
    }
    const wrap=document.createElement('div'); wrap.className='msg me'; wrap.append(node);
    body.append(wrap);
  });
});

// language
const i18n = {
  en:{
    welcome:"Welcome to Novelty Cams! How can I help?",
    liveNow:"Live Now"
  },
  es:{welcome:"¡Bienvenido a Novelty Cams! ¿En qué puedo ayudarte?", liveNow:"En vivo ahora"},
  fr:{welcome:"Bienvenue sur Novelty Cams ! Comment puis-je aider ?", liveNow:"En direct"},
  de:{welcome:"Willkommen bei Novelty Cams! Wie kann ich helfen?", liveNow:"Jetzt live"},
  it:{welcome:"Benvenuto su Novelty Cams! Come posso aiutarti?", liveNow:"In diretta"},
  pt:{welcome:"Bem-vindo ao Novelty Cams! Como posso ajudar?", liveNow:"Ao vivo agora"},
  ja:{welcome:"Novelty Camsへようこそ！どうしますか？", liveNow:"ライブ配信中"},
  ko:{welcome:"Novelty Cams에 오신 것을 환영합니다! 무엇을 도와드릴까요?", liveNow:"라이브"},
  zh:{welcome:"欢迎来到 Novelty Cams！我能帮您什么？", liveNow:"正在直播"},
  ru:{welcome:"Добро пожаловать в Novelty Cams! Чем помочь?", liveNow:"Сейчас в эфире"}
};
const langSelect=document.getElementById('langSelect');
function applyLang(l){
  const t=i18n[l]||i18n.en;
  document.getElementById('welcomeMsg').textContent=t.welcome;
  document.getElementById('chatTitle').textContent='Assistant';
  document.getElementById('liveNowTitle').textContent=t.liveNow;
  localStorage.setItem('lang',l);
}
langSelect.addEventListener('change',e=>applyLang(e.target.value));
applyLang(localStorage.getItem('lang')||'en'); langSelect.value=localStorage.getItem('lang')||'en';

// partner actions + fullscreen
window.partnerAction=function(act){
  const avatar=document.querySelector('.partner-avatar');
  avatar.style.animation='none';
  setTimeout(()=>{avatar.style.animation='breathe 3s infinite ease-in-out'},50);
}
document.getElementById('btnFullscreen').addEventListener('click',()=>{
  const el = document.getElementById('partner');
  if (document.fullscreenElement){ document.exitFullscreen(); }
  else { el.requestFullscreen && el.requestFullscreen(); }
});

// Rooms grid (demo data -> many cards)
async function loadRooms(){
  // generate dummy list in-memory to avoid fetch while still hosting fine
  const regions=['North America','South America','Europe','Asia'];
  const genders=['Women','Men','Couples','Trans'];
  const topics=['chatting','music','games','cosplay','just vibing'];
  const rooms=[];
  for(let i=1;i<=48;i++){
    rooms.push({
      name:'Creator'+i,
      region: regions[i%regions.length],
      label: genders[i%genders.length],
      watch: (500+Math.floor(Math.random()*6000)),
      rate: [6,12,18,30,60][i%5],
      tags: [topics[i%topics.length], topics[(i+2)%topics.length]]
    });
  }

  grid.innerHTML='';
  rooms.forEach(r=>{
    const card=document.createElement('article'); card.className='card';
    card.innerHTML=`
      <div class="thumb">C</div>
      <div class="meta">
        <div style="display:flex;justify-content:space-between"><strong>${r.name}</strong><span class="badge">${r.label}</span></div>
        <div class="badges">
          <span class="badge">${r.region}</span>
          <span class="badge">${r.tags[0]}</span>
          <span class="badge">${r.tags[1]}</span>
          <span class="badge">💠 ${r.rate}/min</span>
        </div>
      </div>
    `;
    grid.append(card);
  });
  countEl.textContent=rooms.length+' rooms';
}
loadRooms();

// footer link behavior: remember visited, and on hover after visiting -> red
document.querySelectorAll('.hoverable').forEach(a=>{
  a.addEventListener('click',()=>{
    a.dataset.visited='1';
    a.classList.add('visited-hover');
  });
});
