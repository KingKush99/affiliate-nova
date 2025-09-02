
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
// age gate
(()=>{const ok=localStorage.getItem("an_age_ok"); if(!ok){$("#ageGate")?.classList.add("flex"); $("#ageGate")?.classList.remove("hidden");} $("#enterSite")?.addEventListener("click",()=>{$("#ageGate").classList.add("hidden"); localStorage.setItem("an_age_ok","1");});})();
// counters
function digits(n,el){if(!el) return; el.innerHTML=String(n).split("").map(d=>`<span class="digit">${d}</span>`).join("")}
(()=>{digits((Date.now()%5000+1000).toString().slice(0,4),$("#onlineDigits")); digits("111117",$("#visitorDigits"));})();
// wallet
const bal=()=>parseInt(localStorage.getItem("an_tokens")||"1000",10), setBal=v=>{localStorage.setItem("an_tokens",v); upd()}, upd=()=>["#tokenBalance","#walletBalance"].forEach(id=>{$(id)&&( $(id).textContent=bal());}); upd();
// search focus
document.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault(); $("#searchInput")?.focus();}});
// filters panel
$("#filterToggle")?.addEventListener("click",()=>$("#filters")?.classList.toggle("hidden"));

// ----- DATA + CARDS -----
let ROOMS=[]; const state={region:null,size:null,tags:[],gender:null,search:""};
function ok(r){if(state.gender&&r.gender!==state.gender) return false; if(state.region&&r.region!==state.region) return false;
 if(state.size){if(state.size==="Small"&&!(r.viewers<500))return false; if(state.size==="Mid"&&!(r.viewers>=500&&r.viewers<2000))return false; if(state.size==="High Traffic"&&!(r.viewers>=2000))return false;}
 if(state.tags.length&&!state.tags.every(t=>r.tags.includes(t))) return false;
 if(state.search&&!((r.name||'').toLowerCase().includes(state.search)||(r.title||'').toLowerCase().includes(state.search))) return false; return true;}
function render(){const g=$("#roomsGrid"); if(!g) return; const list=ROOMS.filter(ok); $("#resultCount")&&( $("#resultCount").textContent=`${list.length} rooms` ); g.innerHTML=""; list.forEach(r=>{const el=document.createElement("a"); el.href=`room.html?id=${encodeURIComponent(r.id)}`; el.className="block rounded-xl overflow-hidden bg-surface border border-white/10 hover:border-white/20 transition";
el.innerHTML=`<div class='relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900 grid place-items-center'><span class='text-4xl font-black opacity-20'>${(r.name[0]||'A').toUpperCase()}</span><span class='absolute top-2 right-2 px-2 py-1 text-xs rounded bg-black/60 border border-white/10'>${(r.viewers||0).toLocaleString()} watching</span></div>
<div class='p-3'><div class='flex items-center gap-2'><h3 class='font-semibold truncate'>${r.name}</h3><span class='ml-auto text-xs px-2 py-1 rounded bg-white/10'>${r.gender}</span></div><p class='text-sm text-slate-400 truncate'>${r.title}</p><div class='mt-1 flex items-center gap-3 text-xs text-slate-400'><span>🌎 ${r.region}</span><span>🏷️ ${r.tags.slice(0,2).join(", ")}</span><span class='ml-auto'>💎 ${r.rate}/min</span></div></div>`; g.append(el);});}
function renderLB(){const w=$("#leaderboard"); if(!w) return; let list=ROOMS.slice(); const gs=$("#lbGender")?.value, rs=$("#lbRegion")?.value, sort=$("#lbSort")?.value; if(gs) list=list.filter(r=>r.gender===gs); if(rs) list=list.filter(r=>r.region===rs);
 list.sort((a,b)=> sort==="name"?a.name.localeCompare(b.name): sort==="rate"?(b.rate||0)-(a.rate||0):(b.viewers||0)-(a.viewers||0)); w.innerHTML=""; list.slice(0,9).forEach((r,i)=>{const el=document.createElement("a"); el.href=`room.html?id=${encodeURIComponent(r.id)}`; el.className="rounded-xl p-3 bg-surface border border-white/10 hover:border-white/20 transition block";
el.innerHTML=`<div class='flex items-center gap-3'><div class='w-10 h-10 rounded bg-gradient-to-br from-brand to-brand2 grid place-items-center font-black'>${i+1}</div><div class='flex-1'><div class='font-semibold'>${r.name}</div><div class='text-xs text-slate-400'>${r.region} • ${r.gender}</div></div><div class='text-right'><div class='font-mono'>${(r.viewers||0).toLocaleString()}</div><div class='text-xs text-slate-400'>viewers</div></div></div>`; w.append(el);});}
$$("header .chip[data-chip]").forEach(ch=>ch.addEventListener("click",()=>{const v=ch.dataset.chip; state.gender=(v==="All")?null:v; render(); renderLB();}));
$$(".f").forEach(b=>b.addEventListener("click",()=>{const f=b.dataset.f,v=b.dataset.v;if(f==="tags"){const i=state.tags.indexOf(v); if(i>=0){state.tags.splice(i,1); b.classList.remove("ring-2","ring-brand");} else{state.tags.push(v); b.classList.add("ring-2","ring-brand");}} else{state[f]=(state[f]===v)?null:v; $$(`.f[data-f='${f}']`).forEach(x=>x.classList.remove("ring-2","ring-brand")); if(state[f]) b.classList.add("ring-2","ring-brand");} render(); renderLB();}));
$("#clearFilters")?.addEventListener("click",()=>{state.region=state.size=null; state.tags=[]; $$(".f").forEach(x=>x.classList.remove("ring-2","ring-brand")); render(); renderLB();});
$("#searchInput")?.addEventListener("input",e=>{state.search=e.target.value.toLowerCase(); render(); renderLB();});
fetch("data/rooms.json").then(r=>r.json()).then(d=>{ROOMS=d; render(); renderLB();}).catch(e=>console.warn("Rooms load error",e));

// ----- Room page wiring -----
const P=new URLSearchParams(location.search);
if(location.pathname.endsWith("room.html")){fetch("data/rooms.json").then(r=>r.json()).then(rooms=>{const id=P.get("id"); const room=rooms.find(x=>x.id===id)||rooms[0];
$("#roomTitle").textContent=room.name; $("#roomCategory").textContent=room.gender; $("#viewerCount").textContent=`${room.viewers.toLocaleString()} watching`; $("#chatViewers").textContent=`${room.viewers.toLocaleString()} in room`;
(room.tips||[]).forEach(t=>{const row=document.createElement("div"); row.className="flex items-center justify-between gap-3"; row.innerHTML=`<span class='text-sm'>${t.label}</span><span class='text-sm font-mono'>${t.amount}💎</span>`; $("#tipMenu").append(row);});
const v=$("#player"); const ov=$("#playerOverlay"); v.src=room.streamUrl; v.addEventListener("loadeddata",()=>ov?.classList.add("hidden"));
const box=$("#chatMessages"); const add=(f,t,me=false)=>{const w=document.createElement("div"); w.className='text-sm'; w.innerHTML=`<span class='font-semibold ${me?'text-brand':'text-white'}'>${f}</span> <span class='text-slate-300'>${t}</span>`; box.append(w); box.scrollTop=box.scrollHeight;}; add(room.name,"Welcome to the room 💜"); ["Be nice and tip!","Where are you from?","Don't forget to follow."].forEach(t=>add(room.name,t));
$("#chatSend")?.addEventListener("click",()=>{const i=$("#chatInput"), v=(i.value||'').trim(); if(!v) return; add('You',v,true); i.value='';});
$("#buyTokens")?.addEventListener("click",()=>{setBal(bal()+500)}); $("#sendTipBtn")?.addEventListener("click",()=>{const cost=100, b=bal(); if(b<cost) return alert('Not enough tokens — use \"Get Demo Tokens\".'); setBal(b-cost); add('System','You tipped 100 ✨',true);});}).catch(e=>console.warn("Room wiring failed",e));}

// ----- QUIZ (robust loader + typo-tolerant match) -----
let QUIZ=[], qi=0, score=0;
const DEFAULT_QUIZ=[
  {name:"Streamer Alpha", img:"assets/quiz/1.svg"},
  {name:"Creator Beta", img:"assets/quiz/2.svg"},
  {name:"Gamer Gamma", img:"assets/quiz/3.svg"}
];
function norm(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');}
function splitName(n){n=(n||'').trim(); const parts=n.split(/\s+/); const last=parts.pop()||''; const first=parts.join(' '); return {first,last};}
function dist(a,b){ const m=a.length,n=b.length; if(!m) return n; if(!n) return m; const dp=new Array(n+1); for(let j=0;j<=n;j++) dp[j]=j;
  for(let i=1;i<=m;i++){let prev=dp[0], tmp; dp[0]=i; for(let j=1;j<=n;j++){tmp=dp[j]; const cost=(a[i-1]===b[j-1])?0:1; dp[j]=Math.min(dp[j]+1, dp[j-1]+1, prev+cost); prev=tmp;}} return dp[n]; }
function matchAnswer(input, person){
  const {first,last}=splitName(person.name||'');
  const aliases=[ norm(last), norm(first+' '+last), norm(first+last) ];
  const ans=norm(input);
  return aliases.some(a=> ans===a || dist(ans,a) <= Math.max(1, Math.floor(a.length*0.2)) );
}
function getQuizData(){
  const url=`data/quiz.json?nocache=${Date.now()}`;
  return fetch(url,{cache:'no-store'})
    .then(r=>{ if(!r.ok) throw new Error(`${r.status}`); return r.json(); })
    .catch(err=>{ console.warn("Quiz fetch failed, using defaults. Reason:", err); return DEFAULT_QUIZ; });
}
function preloadImages(list){ return Promise.allSettled(list.map(it=>new Promise(res=>{const img=new Image(); img.onload=()=>res(true); img.onerror=()=>res(false); img.src=it.img;}))); }
function showQuiz(){ const modal=$("#quizModal"); if(!modal) return;
  const it=QUIZ[qi]; if(!it){ return endQuiz(); }
  $("#quizImg").src=it.img; $("#quizGuess").value=''; $("#quizFeedback").textContent=''; $("#quizProgress").textContent=`${qi+1} / ${QUIZ.length} — Score: ${score}`;
  modal.classList.remove("hidden"); $("#quizGuess").focus();
}
function endQuiz(){ const wrap=$("#quizWrap"); if(!wrap) return; wrap.innerHTML=`<div class='text-center space-y-3'><div class='text-2xl font-bold'>Finished!</div><div>Score: ${score} / ${QUIZ.length}</div><button id='quizRestart' class='px-4 py-2 rounded-xl bg-brand'>Restart</button></div>`; $("#quizRestart")?.addEventListener("click",startQuiz); }
function startQuiz(){
  const modal=$("#quizModal"); if(!modal) return;
  getQuizData().then(data=>{ QUIZ=data.slice().sort(()=>Math.random()-0.5); return preloadImages(QUIZ); })
    .then(()=>{ qi=0; score=0; showQuiz(); })
    .catch(e=>{ console.warn("Quiz init failed",e); $("#quizFeedback")&&( $("#quizFeedback").textContent='Unable to start quiz.' ); modal.classList.remove("hidden"); });
}
$("#quizOpen")?.addEventListener("click",(e)=>{e.preventDefault(); startQuiz();});
$("#quizClose")?.addEventListener("click",()=>$("#quizModal")?.classList.add("hidden"));
$("#quizSubmit")?.addEventListener("click",()=>{ if(!QUIZ.length) return; const g=$("#quizGuess").value; if(!g) return; const ok=matchAnswer(g, QUIZ[qi]); if(ok){score++; $("#quizFeedback").innerHTML=`<span class='text-emerald-400 font-semibold'>Correct!</span> ${QUIZ[qi].name}`;} else {$("#quizFeedback").innerHTML=`<span class='text-rose-400 font-semibold'>Not quite.</span> Answer: ${QUIZ[qi].name}`;} qi++; setTimeout(showQuiz,700);});
$("#quizGuess")?.addEventListener("keydown",e=>{if(e.key==='Enter') $("#quizSubmit").click();});
$("#quizSkip")?.addEventListener("click",()=>{ if(!QUIZ.length) return; qi++; showQuiz(); });
$("#quizReveal")?.addEventListener("click",()=>{ if(!QUIZ.length) return; $("#quizFeedback").innerHTML=`<span class='text-slate-300'>${QUIZ[qi].name}</span>`; });


// ===== XP / LEVEL SYSTEM (0..1000) =====
const XP_KEY="an_xp", START_KEY="an_start", FRIENDS_KEY="an_friends", QUIZ_LOG="an_quiz_scores";
function getXP(){ return parseInt(localStorage.getItem(XP_KEY)||"0",10); }
function setXP(v){ localStorage.setItem(XP_KEY, Math.max(0, Math.min(v, totalForLevel(1000)))); }
function ensureStart(){ if(!localStorage.getItem(START_KEY)) localStorage.setItem(START_KEY,new Date().toISOString().slice(0,10)); }
function totalForLevel(n){ n=Math.max(0,Math.min(1000,n)); return Math.floor(1000*n*(n+1)/2); }     // cumulative XP to reach level n
function levelFromXP(xp){ const n = Math.floor((Math.sqrt(1+8*(xp/1000))-1)/2); return Math.max(0, Math.min(1000, n)); }
function nextGap(level){ return 1000*(level+1); }   // XP to go from L -> L+1
function progressInfo(){
  const xp=getXP(); const L=levelFromXP(xp);
  const currBase=totalForLevel(L), gap=nextGap(L);
  const into=xp-currBase, need=Math.max(0, gap-into);
  return {xp, L, currBase, gap, into, need, nextTotal:currBase+gap};
}
function grantXP(amount, reason=""){ setXP(getXP()+amount); console.log(`+${amount} XP`, reason); renderProfile(); renderTopLevels(); }

// ===== QUIZ SCORE PERSISTENCE =====
// Store each run: {correct,total,ms,ts,score}
function saveQuizResult(correct,total,ms){
  try{
    const list = JSON.parse(localStorage.getItem(QUIZ_LOG)||"[]");
    // Ranking: correct desc, time asc — to satisfy "correct trumps time"
    // A single 'score' value that follows that ordering:
    const score = correct*1e9 - ms;   // larger is better
    list.push({correct,total,ms,ts:Date.now(),score});
    localStorage.setItem(QUIZ_LOG, JSON.stringify(list));
  }catch(_){}
}
function getBestQuizScore(){ try{ const list=JSON.parse(localStorage.getItem(QUIZ_LOG)||"[]"); if(!list.length) return null; list.sort((a,b)=> b.score-a.score); return list[0]; }catch(_){ return null; } }
function getQuizStats(){ try{ const list=JSON.parse(localStorage.getItem(QUIZ_LOG)||"[]"); const taken=list.length; const best=getBestQuizScore(); return {taken,best}; }catch(_){ return {taken:0,best:null}; } }

// Wire this into existing QUIZ flow
let __quizStart=0, __quizCorrect=0, __quizTotal=0;
const _startQuizOrig = (typeof startQuiz==="function") ? startQuiz : null;
if(_startQuizOrig){
  window.startQuiz = function(){
    __quizStart=Date.now(); __quizCorrect=0; __quizTotal=0;
    return _startQuizOrig();
  }
}
const _showQuizOrig = (typeof showQuiz==="function") ? showQuiz : null;
if(_showQuizOrig){
  window.showQuiz = function(){
    if(Array.isArray(window.QUIZ)) __quizTotal = window.QUIZ.length;
    return _showQuizOrig();
  }
}
// Hook into submit
const _matchAnswerOrig = (typeof matchAnswer==="function") ? matchAnswer : null;
if(_matchAnswerOrig){
  window.matchAnswer = function(input, person){
    const ok = _matchAnswerOrig(input, person);
    if(ok) __quizCorrect++;
    return ok;
  }
}
const _endQuizOrig = (typeof endQuiz==="function") ? endQuiz : null;
if(_endQuizOrig){
  window.endQuiz = function(){
    const ms = Math.max(0, Date.now() - __quizStart);
    saveQuizResult(__quizCorrect, __quizTotal, ms);
    // grant XP for finishing
    grantXP(400, "Quiz complete");
    return _endQuizOrig();
  }
}

// ===== PROFILE PAGE WIRING =====
function renderProfile(){
  if(!location.pathname.endsWith("profile.html")) return;
  ensureStart();
  const info = progressInfo();
  const pct = Math.min(100, Math.round(100*info.into / Math.max(1,info.gap)));
  $("#levelNum").textContent = info.L;
  $("#xpBar").style.width = pct + "%";
  $("#xpNow").textContent = (info.into).toLocaleString();
  $("#xpNext").textContent = (info.gap).toLocaleString();
  $("#totalXP").textContent = info.xp.toLocaleString();
  $("#startDate").textContent = localStorage.getItem(START_KEY) || "—";

  const q = getQuizStats();
  $("#quizTaken") && ($("#quizTaken").textContent = q.taken);
  $("#friendCount") && ($("#friendCount").textContent = (parseInt(localStorage.getItem(FRIENDS_KEY)||"0",10)));
  // Simple task count demo
  $("#taskCount").textContent = `${Math.min(4, Math.floor(info.into/Math.max(1,Math.ceil(info.gap/4))))}/4`;

  if(info.L>=1000){
    // simple reward banner
    if(!document.getElementById("rewardBanner")){
      const b=document.createElement("div"); b.id="rewardBanner"; b.className="mt-4 p-4 rounded-xl bg-emerald-600/20 border border-emerald-500/40";
      b.innerHTML="<div class='font-semibold text-emerald-300'>Max Level Achieved!</div><div class='text-sm text-emerald-200'>You unlocked the Legendary Reward — check your inbox for details.</div>";
      document.querySelector("main section").append(b);
    }
  }
}
document.addEventListener("click",(e)=>{
  const el=e.target.closest(".earn");
  if(el){ const v=parseInt(el.dataset.xp||"0",10); grantXP(v, "Action"); }
});
$("#resetXP")?.addEventListener("click",()=>{ setXP(0); renderProfile(); });

// ===== LEADERBOARD TABS (Models / Levels / Quizzers) =====
function renderTopLevels(){
  const wrap = document.getElementById("leaderboard");
  if(!wrap || !document.getElementById("lbTabs")) return; // only on index
  // Build sample users, include local user with current XP
  const meXP = getXP();
  const sample = Array.from({length:12}).map((_,i)=>({name:`User${i+1}`, xp: Math.floor(Math.random()*totalForLevel(50))}));
  sample.push({name:"You", xp: meXP});
  sample.sort((a,b)=> b.xp-a.xp);
  // Render
  wrap.innerHTML = "";
  sample.slice(0,9).forEach((u,i)=>{
    const L = levelFromXP(u.xp);
    const el=document.createElement("div"); el.className="rounded-xl p-3 bg-surface border border-white/10";
    el.innerHTML = `<div class='flex items-center gap-3'><div class='w-10 h-10 rounded bg-gradient-to-br from-brand to-brand2 grid place-items-center font-black'>${i+1}</div>
      <div class='flex-1'><div class='font-semibold'>${u.name}</div><div class='text-xs text-slate-400'>Level ${L} • ${u.xp.toLocaleString()} XP</div></div></div>`;
    wrap.append(el);
  });
}
function renderTopQuizzers(){
  const wrap = document.getElementById("leaderboard"); if(!wrap) return;
  const list = JSON.parse(localStorage.getItem(QUIZ_LOG)||"[]");
  // create some dummy competitors
  while(list.length<12){
    const right = Math.floor(50+Math.random()*50);
    const ms = Math.floor(30+Math.random()*600)*1000;
    const score = right*1e9 - ms; // same scoring rule
    list.push({correct:right,total:100,ms,ts:Date.now()-Math.random()*1e7,score,name:`User${list.length+1}`});
  }
  list.forEach((x,i)=>x.name = x.name || (i===0?"You":"User"+(i+1)));
  list.sort((a,b)=> b.score-a.score);
  wrap.innerHTML="";
  list.slice(0,9).forEach((r,i)=>{
    const el=document.createElement("div"); el.className="rounded-xl p-3 bg-surface border border-white/10";
    const time = (r.ms/1000).toFixed(1)+"s";
    el.innerHTML = `<div class='flex items-center gap-3'>
      <div class='w-10 h-10 rounded bg-gradient-to-br from-brand to-brand2 grid place-items-center font-black'>${i+1}</div>
      <div class='flex-1'><div class='font-semibold'>${r.name||"You"}</div>
      <div class='text-xs text-slate-400'>Correct ${r.correct}/${r.total} • Time ${time}</div></div></div>`;
    wrap.append(el);
  });
}
function renderTopModels(){
  // reuse existing leaderboard of ROOMS (viewers)
  renderLB();
}
// Tab click wiring
(function(){
  const tabs = document.getElementById("lbTabs");
  if(!tabs) return;
  tabs.addEventListener("click",(e)=>{
    const btn=e.target.closest("button[data-tab]"); if(!btn) return;
    $$("button[data-tab]").forEach(b=>b.classList.remove("bg-white/10"));
    btn.classList.add("bg-white/10");
    const t=btn.dataset.tab;
    if(t==="models") renderTopModels();
    if(t==="levels") renderTopLevels();
    if(t==="quizzers") renderTopQuizzers();
  });
})();
// Auto-render on load for profile or index
document.addEventListener("DOMContentLoaded", ()=>{ renderProfile(); if(document.getElementById("lbTabs")){ renderTopModels(); } });



// ---------- Settings Modal (Quiz) injected at runtime ----------
(function injectQuizSettings(){
  const html = `
  <div id="quizSettings" class="fixed inset-0 hidden z-50">
    <div class="absolute inset-0 bg-black/70"></div>
    <div class="relative mx-auto mt-16 w-[94%] max-w-xl bg-surface border border-white/10 rounded-2xl p-6">
      <div class="flex items-center justify-between mb-3"><h3 class="text-xl font-semibold">Quiz Settings</h3><button id="qsClose" class="px-2 py-1 rounded bg-white/10">✕</button></div>
      <div class="space-y-4 text-sm">
        <div>
          <div class="text-slate-300 mb-1">Questions</div>
          <div class="flex gap-2 flex-wrap" id="qsCount">
            ${[10,25,50,100].map(n=>`<label class="chip"><input type="radio" name="qsN" value="${n}" class="mr-1"> ${n}</label>`).join('')}
          </div>
        </div>
        <div>
          <div class="text-slate-300 mb-1">Mode</div>
          <label class="chip mr-2"><input type="radio" name="qsMode" value="single" class="mr-1" checked> Single player</label>
          <label class="chip"><input type="radio" name="qsMode" value="local2" class="mr-1"> Local multiplayer (pass & play)</label>
          <div class="mt-2 grid grid-cols-2 gap-2" id="qsPlayers" style="display:none">
            <input id="p1Name" class="px-3 py-2 rounded-xl bg-surface border border-white/10" placeholder="Player 1 (You)">
            <input id="p2Name" class="px-3 py-2 rounded-xl bg-surface border border-white/10" placeholder="Player 2 name">
          </div>
          <div class="mt-2 text-xs text-slate-400">Each question has <b>5 seconds</b>. Timeouts are counted as incorrect.</div>
        </div>
        <div>
          <div class="text-slate-300 mb-1">Image Bank</div>
          <p class="text-xs text-slate-400">Add pairs in the format <code>Name | ImageURL</code>, one per line. The URLs can point to your CDN or public storage. (No explicit images are included in this demo.)</p>
          <textarea id="bankInput" class="w-full h-28 mt-2 px-3 py-2 rounded-xl bg-surface border border-white/10" placeholder="Jane Doe | https://.../jane.jpg"></textarea>
          <div class="flex items-center gap-2 mt-2"><button id="bankImport" class="px-3 py-2 rounded-xl bg-slate-700">Import into Bank</button><span id="bankCount" class="text-xs text-slate-400">0 in bank</span></div>
        </div>
        <div class="flex gap-2">
          <button id="qsStart" class="px-4 py-2 rounded-xl bg-brand">Start</button>
          <button id="qsCancel" class="px-4 py-2 rounded-xl bg-slate-700">Cancel</button>
        </div>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
  const modal=$("#quizSettings");
  $("#qsClose")?.addEventListener("click",()=>modal.classList.add("hidden"));
  $("#qsCancel")?.addEventListener("click",()=>modal.classList.add("hidden"));
  document.addEventListener("change",(e)=>{
    if(e.target.name==="qsMode"){
      const two=e.target.value==="local2"; $("#qsPlayers").style.display=two?'grid':'none';
    }
  });
  $("#bankImport")?.addEventListener("click",()=>{
    const txt=$("#bankInput").value||"";
    const rows=txt.split(/\n+/).map(s=>s.trim()).filter(Boolean);
    const add=[];
    rows.forEach(line=>{
      const m=line.split("|"); if(m.length>=2){
        add.push({name:m[0].trim(), img:m.slice(1).join("|").trim()});
      }
    });
    const key="nc_bank"; const cur=JSON.parse(localStorage.getItem(key)||"[]");
    const merged=[...cur, ...add].slice(-10000); // cap 10k
    localStorage.setItem(key, JSON.stringify(merged));
    $("#bankCount").textContent = merged.length+" in bank";
  });
  $("#qsStart")?.addEventListener("click",()=>{
    const n = parseInt((document.querySelector("input[name='qsN']:checked")?.value)||"10",10);
    const mode = (document.querySelector("input[name='qsMode']:checked")?.value)||"single";
    const p1 = $("#p1Name").value.trim() || "You";
    const p2 = $("#p2Name").value.trim() || "Player 2";
    modal.classList.add("hidden");
    launchQuiz({n,mode,p1,p2});
  });
  $("#quizOpen")?.addEventListener("click",(e)=>{e.preventDefault(); $("#bankCount").textContent=(JSON.parse(localStorage.getItem('nc_bank')||'[]').length||0)+' in bank'; modal.classList.remove("hidden");});
})();

// --- Quiz data selection: prefer user bank, fallback to data/quiz.json ---
async function pickQuizSet(N){
  const bank = JSON.parse(localStorage.getItem("nc_bank")||"[]");
  let pool = Array.isArray(bank)&&bank.length ? bank : await fetch('data/quiz.json?nocache='+Date.now(),{cache:'no-store'}).then(r=>r.json()).catch(()=>DEFAULT_QUIZ);
  pool = pool.filter(x=>x && x.name && x.img);
  // sample without replacement
  const out=[]; const used=new Set(); while(out.length<Math.min(N,pool.length)){
    const i=Math.floor(Math.random()*pool.length); if(used.has(i)) continue; used.add(i); out.push(pool[i]);
  }
  return out;
}

// --- Timed quiz runner with 5s timer & local multiplayer + ELO ---
const ELO_KEY="nc_elo";
function getElo(name){ const all=JSON.parse(localStorage.getItem(ELO_KEY)||"{}"); return all[name]||1000; }
function setElo(name,val){ const all=JSON.parse(localStorage.getItem(ELO_KEY)||"{}"); all[name]=Math.round(val); localStorage.setItem(ELO_KEY, JSON.stringify(all)); }
function eloUpdate(aRating,bRating,aScore){ // aScore: 1 win, .5 draw, 0 loss
  const K=32; const Qa=Math.pow(10, aRating/400), Qb=Math.pow(10, bRating/400);
  const Ea=Qa/(Qa+Qb);
  const newA = aRating + K*(aScore - Ea);
  const newB = bRating + K*((1-aScore) - (1-Ea));
  return [newA,newB];
}
async function launchQuiz({n,mode,p1,p2}){
  const data = await pickQuizSet(n);
  window.QUIZ = data; // reuse existing vars
  let idx=0, correctA=0, correctB=0, total=data.length;
  let currPlayer= 'A'; // for local2
  const start = Date.now();
  function updateUI(){
    $("#quizProgress").textContent = `${idx+1} / ${total} — ${currPlayer==='A'?p1:p2}`;
  }
  function ask(){
    if(idx>=total){ return finish(); }
    $("#quizImg").src = data[idx].img;
    $("#quizGuess").value='';
    $("#quizFeedback").textContent='';
    updateUI();
    $("#quizModal").classList.remove("hidden");
    // 5s timer
    let left=5;
    const feedback=$("#quizFeedback");
    feedback.classList.add("text-slate-400");
    feedback.textContent=`${left}s`;
    const t = setInterval(()=>{
      left--; feedback.textContent=`${left}s`;
      if(left<=0){ clearInterval(t); timeUp(); }
    },1000);
    function cleanup(){ clearInterval(t); }
    function timeUp(){ cleanup(); judge(""); }
    function judge(g){
      const ok = matchAnswer(g || "", data[idx]);
      if(ok){ if(mode==='local2'){ if(currPlayer==='A') correctA++; else correctB++; } else { correctA++; } }
      $("#quizFeedback").innerHTML = (ok?`<span class='text-emerald-400 font-semibold'>Correct!</span>`:`<span class='text-rose-400 font-semibold'>Not quite.</span>`) + ` ${data[idx].name}`;
      setTimeout(()=>{
        idx++;
        if(mode==='local2'){ currPlayer = (currPlayer==='A'?'B':'A'); }
        ask();
      },400);
    }
    $("#quizSubmit").onclick = ()=>{ const g=$("#quizGuess").value; cleanup(); judge(g); };
    $("#quizGuess").onkeydown = (e)=>{ if(e.key==='Enter'){ cleanup(); judge($("#quizGuess").value); } };
    $("#quizSkip").onclick = ()=>{ cleanup(); judge(""); };
    $("#quizReveal").onclick = ()=>{ $("#quizFeedback").innerHTML=`<span class='text-slate-300'>${data[idx].name}</span>`; };
  }
  function finish(){
    $("#quizModal").classList.add("hidden");
    const ms = Date.now()-start;
    // scoring rule: correct trumps time; we store each player's run
    if(mode==='single'){
      saveQuizResult(correctA,total,ms);
      grantXP(400,"Quiz complete");
    }else{
      // each player gets a record; same total and time for simplicity
      const msPer = Math.max(1, Math.round(ms/2));
      // Store
      saveQuizResult(correctA,total,msPer);
      const recB = {correct:correctB,total,ms:msPer,ts:Date.now(),score:correctB*1e9-msPer};
      const list = JSON.parse(localStorage.getItem(QUIZ_LOG)||"[]"); list.push(recB); localStorage.setItem(QUIZ_LOG, JSON.stringify(list));
      // ELO
      const aRating=getElo(p1), bRating=getElo(p2);
      let aScore = (correctA===correctB)?0.5:(correctA>correctB?1:0);
      const [newA, newB] = eloUpdate(aRating,bRating,aScore);
      setElo(p1,newA); setElo(p2,newB);
      grantXP(200, "Multiplayer match"); // smaller XP per player
      alert(`${p1}: ${correctA}/${total} | ${p2}: ${correctB}/${total}\nELO: ${Math.round(aRating)}→${Math.round(newA)} vs ${Math.round(bRating)}→${Math.round(newB)}`);
    }
    renderTopQuizzers();
    renderTopLevels();
  }
  ask();
}

// --- Extra leaderboards: Donors + integrated "Your Rank" & "Friends" ---
function getFriendsList(){ try{ return JSON.parse(localStorage.getItem("an_friends_list")||"[]"); }catch(_){ return []; } }
function setFriendsList(arr){ localStorage.setItem("an_friends_list", JSON.stringify(arr.slice(0,200))); }
function sampleFriendsIfEmpty(){ if(!getFriendsList().length){ setFriendsList(["Alex","Sam","Taylor","Jordan","Casey"]); } }
sampleFriendsIfEmpty();

function getDonations(){ try{ return JSON.parse(localStorage.getItem("nc_donations")||"{}"); }catch(_){ return {}; } }
function setDonation(user,amount){ const m=getDonations(); m[user]=(m[user]||0)+amount; localStorage.setItem("nc_donations", JSON.stringify(m)); }

function rankList(list, meName=null, friendsOnly=false){
  const arr=list.slice();
  // compute position
  arr.sort((a,b)=> (b.score??b.value??0) - (a.score??a.value??0));
  const top10 = arr.slice(0,10);
  let myEntry = null, myPos = null;
  if(meName){
    const idx = arr.findIndex(x=>x.name===meName);
    if(idx>=0){ myPos = idx+1; myEntry = arr[idx]; }
  }
  if(friendsOnly){
    const friends = new Set(getFriendsList());
    return {list: top10.filter(x=>friends.has(x.name)), myEntry, myPos};
  }
  return {list: top10, myEntry, myPos};
}

function renderTopDonors(){
  const wrap = document.getElementById("leaderboard"); if(!wrap) return;
  const donations = getDonations();
  // seed demo donors
  if(Object.keys(donations).length<8){
    ["Alex","Sam","Taylor","Jordan","Casey","Riley","Quinn","Avery","Morgan","Jamie","Parker","Finley"].forEach((n,i)=>{
      donations[n] = donations[n] || Math.floor(100+i*50+Math.random()*4000);
    });
    donations["You"] = donations["You"] || Math.floor(Math.random()*500);
    localStorage.setItem("nc_donations", JSON.stringify(donations));
  }
  const arr = Object.entries(donations).map(([name,val])=>({name,value:val}));
  const ranked = rankList(arr, "You", false);
  wrap.innerHTML="";
  ranked.list.forEach((u,i)=>{
    const el=document.createElement("div"); el.className="rounded-xl p-3 bg-surface border border-white/10";
    el.innerHTML=`<div class='flex items-center gap-3'><div class='w-10 h-10 rounded bg-gradient-to-br from-brand to-brand2 grid place-items-center font-black'>${i+1}</div><div class='flex-1'><div class='font-semibold'>${u.name}</div><div class='text-xs text-slate-400'>Donated ${u.value.toLocaleString()} 💎</div></div></div>`;
    wrap.append(el);
  });
  // my rank
  if(ranked.myPos){ const b=document.createElement("div"); b.className="mt-3 text-xs text-slate-400"; b.textContent=`Your rank: #${ranked.myPos} — ${ranked.myEntry.value.toLocaleString()} 💎`; wrap.append(b); }
}

// Add a simple control block for leaderboard filters (Top / Friends / Me)
(function addLBControls(){
  const host=document.getElementById("lbTabs");
  if(!host) return;
  const ctl=document.createElement("div"); ctl.id="lbView"; ctl.className="ml-auto flex items-center gap-2 text-xs";
  ctl.innerHTML=`<button class="px-2 py-1 rounded bg-white/10" data-view="top">Top 10</button><button class="px-2 py-1 rounded" data-view="friends">Friends</button><button class="px-2 py-1 rounded" data-view="me">Me</button>`;
  host.parentElement.append(ctl);
  ctl.addEventListener("click",(e)=>{
    const b=e.target.closest("button[data-view]"); if(!b) return;
    $$("#lbView button").forEach(x=>x.classList.remove("bg-white/10")); b.classList.add("bg-white/10");
    const tab=document.querySelector("#lbTabs .bg-white\\/10")?.dataset.tab || "models";
    if(tab==="models") renderTopModels();
    if(tab==="levels") renderTopLevels();
    if(tab==="quizzers") renderTopQuizzers();
    if(tab==="donors") renderTopDonors();
  });
})();

// Add a "Donors" tab
(function addDonorTab(){
  const tabs=document.getElementById("lbTabs");
  if(!tabs) return;
  const btn=document.createElement("button"); btn.className="px-3 py-1 rounded"; btn.dataset.tab="donors"; btn.textContent="Donors";
  tabs.append(btn);
  tabs.addEventListener("click",(e)=>{
    const b=e.target.closest("button[data-tab='donors']"); if(!b) return;
    $$("button[data-tab]").forEach(x=>x.classList.remove("bg-white/10")); b.classList.add("bg-white/10");
    renderTopDonors();
  });
})();

