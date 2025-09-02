
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
// age gate
(()=>{const ok=localStorage.getItem("an_age_ok"); if(!ok){$("#ageGate")?.classList.add("flex"); $("#ageGate")?.classList.remove("hidden");} $("#enterSite")?.addEventListener("click",()=>{$("#ageGate").classList.add("hidden"); localStorage.setItem("an_age_ok","1");});})();
// counters
function digits(n,el){el.innerHTML=String(n).split("").map(d=>`<span class="digit">${d}</span>`).join("")}
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
fetch("data/rooms.json").then(r=>r.json()).then(d=>{ROOMS=d; render(); renderLB();});

// ----- Room page wiring -----
const P=new URLSearchParams(location.search);
if(location.pathname.endsWith("room.html")){fetch("data/rooms.json").then(r=>r.json()).then(rooms=>{const id=P.get("id"); const room=rooms.find(x=>x.id===id)||rooms[0];
$("#roomTitle").textContent=room.name; $("#roomCategory").textContent=room.gender; $("#viewerCount").textContent=`${room.viewers.toLocaleString()} watching`; $("#chatViewers").textContent=`${room.viewers.toLocaleString()} in room`;
(room.tips||[]).forEach(t=>{const row=document.createElement("div"); row.className="flex items-center justify-between gap-3"; row.innerHTML=`<span class='text-sm'>${t.label}</span><span class='text-sm font-mono'>${t.amount}💎</span>`; $("#tipMenu").append(row);});
const v=$("#player"); const ov=$("#playerOverlay"); v.src=room.streamUrl; v.addEventListener("loadeddata",()=>ov?.classList.add("hidden"));
const box=$("#chatMessages"); const add=(f,t,me=false)=>{const w=document.createElement("div"); w.className='text-sm'; w.innerHTML=`<span class='font-semibold ${me?'text-brand':'text-white'}'>${f}</span> <span class='text-slate-300'>${t}</span>`; box.append(w); box.scrollTop=box.scrollHeight;}; add(room.name,"Welcome to the room 💜"); ["Be nice and tip!","Where are you from?","Don't forget to follow."].forEach(t=>add(room.name,t));
$("#chatSend")?.addEventListener("click",()=>{const i=$("#chatInput"), v=(i.value||'').trim(); if(!v) return; add('You',v,true); i.value='';});
$("#buyTokens")?.addEventListener("click",()=>{setBal(bal()+500)}); $("#sendTipBtn")?.addEventListener("click",()=>{const cost=100, b=bal(); if(b<cost) return alert('Not enough tokens — use \"Get Demo Tokens\".'); setBal(b-cost); add('System','You tipped 100 ✨',true);});});}

// ----- QUIZ (image + type name with fuzzy match) -----
let QUIZ=[], qi=0, score=0;
function norm(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');}
function splitName(n){n=(n||'').trim(); const parts=n.split(/\s+/); const last=parts.pop()||''; const first=parts.join(' '); return {first,last};}
function dist(a,b){ // Levenshtein
  const m=a.length,n=b.length; if(!m) return n; if(!n) return m; const dp=new Array(n+1).fill(0); for(let j=0;j<=n;j++) dp[j]=j;
  for(let i=1;i<=m;i++){let prev=dp[0], tmp; dp[0]=i; for(let j=1;j<=n;j++){tmp=dp[j]; const cost=(a[i-1]===b[j-1])?0:1; dp[j]=Math.min(dp[j]+1, dp[j-1]+1, prev+cost); prev=tmp;}}
  return dp[n];
}
function matchAnswer(input, person){
  const {first,last}=splitName(person.name||'');
  const aliases=[ norm(last), norm(first+' '+last), norm(first+last) ];
  const ans=norm(input);
  return aliases.some(a=> ans===a || dist(ans,a) <= Math.max(1, Math.floor(a.length*0.2)) );
}
function showQuiz(){
  const it=QUIZ[qi]; if(!it) return endQuiz();
  $("#quizImg").src=it.img; $("#quizGuess").value=''; $("#quizFeedback").textContent=''; $("#quizProgress").textContent=`${qi+1} / ${QUIZ.length} — Score: ${score}`;
  $("#quizModal").classList.remove("hidden"); $("#quizGuess").focus();
}
function endQuiz(){ $("#quizWrap").innerHTML=`<div class='text-center space-y-3'><div class='text-2xl font-bold'>Finished!</div><div>Score: ${score} / ${QUIZ.length}</div><button id='quizRestart' class='px-4 py-2 rounded-xl bg-brand'>Restart</button></div>`; $("#quizRestart")?.addEventListener("click",startQuiz); }
function startQuiz(){
  fetch('data/quiz.json').then(r=>r.json()).then(data=>{QUIZ=data.sort(()=>Math.random()-0.5); qi=0; score=0; showQuiz();});
}
$("#quizSubmit")?.addEventListener("click",()=>{const g=$("#quizGuess").value; if(!g) return; const ok=matchAnswer(g, QUIZ[qi]); if(ok){score++; $("#quizFeedback").innerHTML=`<span class='text-emerald-400 font-semibold'>Correct!</span> ${QUIZ[qi].name}`;} else {$("#quizFeedback").innerHTML=`<span class='text-rose-400 font-semibold'>Not quite.</span> Answer: ${QUIZ[qi].name}`;}
  qi++; setTimeout(showQuiz,700);
});
$("#quizGuess")?.addEventListener("keydown",e=>{if(e.key==='Enter') $("#quizSubmit").click();});
$("#quizSkip")?.addEventListener("click",()=>{qi++; showQuiz();});
$("#quizReveal")?.addEventListener("click",()=>{$("#quizFeedback").innerHTML=`<span class='text-slate-300'>${QUIZ[qi].name}</span>`;});
