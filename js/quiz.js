
(()=>{
let bank=[
  {name:'NovaAngel',img:'https://picsum.photos/seed/nova/600/400'},
  {name:'CosmixKai',img:'https://picsum.photos/seed/cosmix/600/400'},
  {name:'DuoVibes',img:'https://picsum.photos/seed/duo/600/400'},
  {name:'Creator5',img:'https://picsum.photos/seed/c5/600/400'},
  {name:'Creator7',img:'https://picsum.photos/seed/c7/600/400'}
];
let idx=0, score=0, timer=5, handle=null, total=10;
const img=document.getElementById('qImg');
const tEl=document.getElementById('timer');
const feedback=document.getElementById('qFeedback');
const input=document.getElementById('qInput');
const qIndex=document.getElementById('qIndex');
const qTotal=document.getElementById('qTotal');
document.getElementById('qStart').onclick=()=>{
  total=parseInt(document.getElementById('qCount').value,10);
  qTotal.textContent=total; idx=0; score=0; document.getElementById('qScore').textContent=0;
  next();
};
document.getElementById('qSkip').onclick=()=>{ next(); };
document.getElementById('qSubmit').onclick=()=>{ check(); };
function next(){
  if(idx>=total){ feedback.textContent='Done!'; clearInterval(handle); return; }
  const item=bank[idx%bank.length];
  img.src=item.img; input.value=''; feedback.textContent=''; qIndex.textContent=idx+1; startTimer();
}
function normalize(s){ return (s||'').toLowerCase().replace(/\s+/g,''); }
function check(){
  const item=bank[idx%bank.length];
  const a = normalize(input.value);
  const names = [normalize(item.name), normalize(item.name.split(/\s+/)[0]||''), normalize(item.name.split(/\s+/)[1]||'')].filter(Boolean);
  const ok = names.some(n=> n && (a===n || a.includes(n) || n.includes(a)));
  if(ok){ score++; document.getElementById('qScore').textContent=score; feedback.textContent='✅ Correct'; }
  else{ feedback.textContent='❌ '+item.name; }
  next(); idx++;
}
function startTimer(){
  clearInterval(handle); timer=5; tEl.textContent=timer;
  handle=setInterval(()=>{ timer--; tEl.textContent=timer; if(timer<=0){ clearInterval(handle); feedback.textContent='⏱ Time up'; idx++; next(); }},1000);
}
})();