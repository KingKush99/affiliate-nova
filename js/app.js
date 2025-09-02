
const $=(s,c=document)=>c.querySelector(s); const $$=(s,c=document)=>[...c.querySelectorAll(s)];
// Age gate
(function(){const ok=localStorage.getItem("an_age_ok"); if(!ok){$("#ageGate")?.classList.add("flex"); $("#ageGate")?.classList.remove("hidden");} $("#enterSite")?.addEventListener("click",()=>{$("#ageGate")?.classList.add("hidden"); localStorage.setItem("an_age_ok","1");});})();
// Counters
function digits(n,el){el.innerHTML=String(n).split("").map(d=>`<span class="digit">${d}</span>`).join("")}
(function(){digits((Date.now()%5000+1000).toString().slice(0,4),$("#onlineDigits")); digits("111117",$("#visitorDigits"));})();
// Wallet badges
const bal=()=>parseInt(localStorage.getItem("an_tokens")||"1000",10); const setBal=v=>{localStorage.setItem("an_tokens",v); upd()}; function upd(){["#tokenBalance","#walletBalance"].forEach(id=>{const el=$(id); if(el) el.textContent=bal();});} upd();
// Search focus
document.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault(); $("#searchInput")?.focus();}});
// Filters sidebar
$("#filterToggle")?.addEventListener("click",()=>{$("#filters")?.classList.toggle("hidden");});
// Quiz
const quizModal=$("#quizModal"); $("#quizOpen")?.addEventListener("click",()=>quizModal?.classList.remove("hidden")); $("#quizClose")?.addEventListener("click",()=>quizModal?.classList.add("hidden"));
let quiz={tags:[]}; $$(".quiz").forEach(b=>b.addEventListener("click",()=>{const q=b.dataset.q,v=b.dataset.v;if(q==="tags"){const i=quiz.tags.indexOf(v); if(i>=0) quiz.tags.splice(i,1); else quiz.tags.push(v); b.classList.toggle("ring-2"); b.classList.toggle("ring-brand");} else{quiz[q]=v; $$(`.quiz[data-q='${q}']`).forEach(x=>x.classList.remove("ring-2","ring-brand")); b.classList.add("ring-2","ring-brand");}}));
$("#quizClear")?.addEventListener("click",()=>{quiz={tags:[]}; $$(".quiz").forEach(b=>b.classList.remove("ring-2","ring-brand"));});
$("#quizApply")?.addEventListener("click",()=>{localStorage.setItem("an_quiz",JSON.stringify(quiz)); quizModal?.classList.add("hidden"); render(); renderLB();});
// Chips
const state={region:null,size:null,tags:[],gender:null,search:""};
$$("header .chip[data-chip]").forEach(ch=>ch.addEventListener("click",()=>{const v=ch.dataset.chip; state.gender=(v==="All")?null:v; render(); renderLB();}));
// Buttons
$$(".f").forEach(b=>b.addEventListener("click",()=>{const f=b.dataset.f,v=b.dataset.v;if(f==="tags"){const i=state.tags.indexOf(v); if(i>=0){state.tags.splice(i,1); b.classList.remove("ring-2","ring-brand");} else{state.tags.push(v); b.classList.add("ring-2","ring-brand");}} else{state[f]=(state[f]===v)?null:v; $$(`.f[data-f='${f}']`).forEach(x=>x.classList.remove("ring-2","ring-brand")); if(state[f]) b.classList.add("ring-2","ring-brand");} render(); renderLB();}));
$("#clearFilters")?.addEventListener("click",()=>{state.region=state.size=null; state.tags=[]; $$(".f").forEach(x=>x.classList.remove("ring-2","ring-brand")); render(); renderLB();});
$("#searchInput")?.addEventListener("input",e=>{state.search=e.target.value.toLowerCase(); render(); renderLB();});
// Data
let ROOMS=[]; fetch("data/rooms.json").then(r=>r.json()).then(d=>{ROOMS=d; try{const q=JSON.parse(localStorage.getItem("an_quiz")||"{}"); if(q.gender) state.gender=q.gender; if(q.region) state.region=q.region; if(q.size) state.size=q.size; if(Array.isArray(q.tags)) state.tags=q.tags;}catch(_){}
render(); renderLB();});
function ok(r){ if(state.gender && r.gender!==state.gender) return false; if(state.region && r.region!==state.region) return false;
  if(state.size){ if(state.size==="Small" && !(r.viewers<500)) return false; if(state.size==="Mid" && !(r.viewers>=500&&r.viewers<2000)) return false; if(state.size==="High Traffic"&& !(r.viewers>=2000)) return false;}
  if(state.tags.length && !state.tags.every(t=>r.tags.includes(t))) return false;
  if(state.search && !(r.name.toLowerCase().includes(state.search)||r.title.toLowerCase().includes(state.search))) return false; return true; }
function render(){const g=$("#roomsGrid"); if(!g) return; const list=ROOMS.filter(ok); $("#resultCount")&&( $("#resultCount").textContent=`${list.length} rooms` ); g.innerHTML=""; list.forEach(r=>{const el=document.createElement("a"); el.href=`room.html?id=${encodeURIComponent(r.id)}`; el.className="block rounded-xl overflow-hidden bg-surface border border-white/10 hover:border-white/20 transition shadow-card";
el.innerHTML=`<div class='relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center'><div class='absolute inset-0' style="background:radial-gradient(circle at 30% 20%, rgba(14,165,233,.2), transparent 50%), radial-gradient(circle at 70% 70%, rgba(56,189,248,.2), transparent 50%);"></div><span class='relative text-4xl font-black opacity-20'>${(r.name[0]||"A").toUpperCase()}</span><span class='absolute top-2 right-2 px-2 py-1 text-xs rounded bg-black/60 border border-white/10'>${(r.viewers||0).toLocaleString()} watching</span></div>
<div class='p-3'><div class='flex items-center gap-2'><h3 class='font-semibold truncate'>${r.name}</h3><span class='ml-auto text-xs px-2 py-1 rounded bg-white/10'>${r.gender}</span></div><p class='text-sm text-slate-400 truncate'>${r.title}</p><div class='mt-1 flex items-center gap-3 text-xs text-slate-400'><span>🌎 ${r.region}</span><span>🏷️ ${r.tags.slice(0,2).join(", ")}</span><span class='ml-auto'>💎 ${r.rate}/min</span></div></div>`; g.append(el);});}
function renderLB(){const w=$("#leaderboard"); if(!w) return; let list=ROOMS.slice(); const gs=$("#lbGender")?.value, rs=$("#lbRegion")?.value, sort=$("#lbSort")?.value; if(gs) list=list.filter(r=>r.gender===gs); if(rs) list=list.filter(r=>r.region===rs);
list.sort((a,b)=> sort==="name"?a.name.localeCompare(b.name): sort==="rate"?(b.rate||0)-(a.rate||0):(b.viewers||0)-(a.viewers||0)); w.innerHTML=""; list.slice(0,9).forEach((r,i)=>{const el=document.createElement("a"); el.href=`room.html?id=${encodeURIComponent(r.id)}`; el.className="rounded-xl p-3 bg-surface border border-white/10 hover:border-white/20 transition block";
el.innerHTML=`<div class='flex items-center gap-3'><div class='w-10 h-10 rounded bg-gradient-to-br from-brand to-brand2 grid place-items-center font-black'>${i+1}</div><div class='flex-1'><div class='font-semibold'>${r.name}</div><div class='text-xs text-slate-400'>${r.region} • ${r.gender}</div></div><div class='text-right'><div class='font-mono'>${(r.viewers||0).toLocaleString()}</div><div class='text-xs text-slate-400'>viewers</div></div></div>`; w.append(el);});}
const P=new URLSearchParams(location.search); if(location.pathname.endsWith("room.html")){fetch("data/rooms.json").then(r=>r.json()).then(rooms=>{const id=P.get("id"); const room=rooms.find(x=>x.id===id)||rooms[0]; $("#roomTitle").textContent=room.name; $("#roomCategory").textContent=room.gender; $("#viewerCount").textContent=`${room.viewers.toLocaleString()} watching`; $("#chatViewers").textContent=`${room.viewers.toLocaleString()} in room`;
(room.tips||[]).forEach(t=>{const row=document.createElement("div"); row.className="flex items-center justify-between gap-3"; row.innerHTML=`<span class='text-sm'>${t.label}</span><span class='text-sm font-mono'>${t.amount}💎</span>`; $("#tipMenu").append(row);});
const v=$("#player"); const ov=$("#playerOverlay"); v.src=room.streamUrl; v.addEventListener("loadeddata",()=>ov?.classList.add("hidden"));
const box=$("#chatMessages"); const add=(f,t,me=false)=>{const w=document.createElement("div"); w.className='text-sm'; w.innerHTML=`<span class='font-semibold ${me?'text-brand':'text-white'}'>${f}</span> <span class='text-slate-300'>${t}</span>`; box.append(w); box.scrollTop=box.scrollHeight;}; add(room.name,"Welcome to the room 💜"); ["Be nice and tip!","Where are you from?","Don't forget to follow."].forEach(t=>add(room.name,t));
$("#chatSend")?.addEventListener("click",()=>{const i=$("#chatInput"); const v=(i.value||'').trim(); if(!v) return; add('You',v,true); i.value='';});
$("#buyTokens")?.addEventListener("click",()=>{setBal(bal()+500)}); $("#sendTipBtn")?.addEventListener("click",()=>{const cost=100, b=bal(); if(b<cost) return alert('Not enough tokens — use "Get Demo Tokens".'); setBal(b-cost); const w=document.createElement('div'); w.className='text-sm'; w.innerHTML=`<span class='font-semibold text-brand'>System</span> <span class='text-slate-300'>You tipped 100 ✨</span>`; $("#chatMessages").append(w);});});}