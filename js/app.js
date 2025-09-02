
const $ = (s, c=document)=>c.querySelector(s);
const $$ = (s, c=document)=>[...c.querySelectorAll(s)];
const params = new URLSearchParams(location.search);
(function initAgeGate(){const ok = localStorage.getItem("an_age_ok"); if(!ok){$("#ageGate")?.classList.remove("hidden"); $("#ageGate")?.classList.add("flex");} $("#enterSite")?.addEventListener("click", ()=>{localStorage.setItem("an_age_ok","1"); $("#ageGate")?.classList.add("hidden");});})();

function getTokens(){return parseInt(localStorage.getItem("an_tokens")||"1000",10);} 
function setTokens(v){localStorage.setItem("an_tokens", String(v)); updateTokenBadges();}
function updateTokenBadges(){const bal=getTokens(); $("#tokenBalance") && ($("#tokenBalance").textContent=String(bal)); $("#walletBalance") && ($("#walletBalance").textContent=String(bal));}
updateTokenBadges();
$("#tokensBtn")?.addEventListener("click", ()=> alert("Demo wallet. Use 'Get Demo Tokens' on a room page to add tokens."));

document.addEventListener("keydown",(e)=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault(); $("#searchInput")?.focus();}});

$("#filterToggle")?.addEventListener("click", ()=>{const aside=$("#filters"); if(!aside) return; if(aside.classList.contains("hidden")) aside.classList.remove("hidden"); else aside.classList.add("hidden");});

const quizModal=$("#quizModal");
$("#quizOpen")?.addEventListener("click", ()=> quizModal?.classList.remove("hidden"));
$("#quizClose")?.addEventListener("click", ()=> quizModal?.classList.add("hidden"));
$("#quizClear")?.addEventListener("click", ()=>{$$(".quiz").forEach(b=>b.classList.remove("ring-2","ring-brand")); quizAnswers={tags:[]};});
let quizAnswers={tags:[]};
$$(".quiz").forEach(btn=>{btn.addEventListener("click", ()=>{const q=btn.dataset.q, v=btn.dataset.v; if(q==="tags"){ if(quizAnswers.tags.includes(v)){quizAnswers.tags=quizAnswers.tags.filter(x=>x!==v); btn.classList.remove("ring-2","ring-brand");} else {quizAnswers.tags.push(v); btn.classList.add("ring-2","ring-brand");}} else {quizAnswers[q]=v; $$(`.quiz[data-q='${q}']`).forEach(b=>b.classList.remove("ring-2","ring-brand")); btn.classList.add("ring-2","ring-brand");}})});
$("#quizApply")?.addEventListener("click", ()=>{localStorage.setItem("an_quiz", JSON.stringify(quizAnswers)); quizModal?.classList.add("hidden"); applyFilters();});

$$("header .chip[data-chip]").forEach(chip=>{chip.addEventListener("click", ()=>{const v=chip.dataset.chip; if(v==="All") delete state.gender; else state.gender=v; renderRooms();});});

const state={region:null,size:null,tags:[],gender:null,search:""};
$$(".f").forEach(b=> b.addEventListener("click", ()=>{const f=b.dataset.f, v=b.dataset.v; if(f==="tags"){ if(state.tags.includes(v)){state.tags=state.tags.filter(x=>x!==v); b.classList.remove("ring-2","ring-brand");} else {state.tags.push(v); b.classList.add("ring-2","ring-brand");}} else {state[f]=(state[f]===v)?null:v; $$(`.f[data-f='${f}']`).forEach(x=>x.classList.remove("ring-2","ring-brand")); if(state[f]) b.classList.add("ring-2","ring-brand"); } renderRooms();}));
$("#clearFilters")?.addEventListener("click", ()=>{state.region=state.size=null; state.tags=[]; $$(".f").forEach(x=>x.classList.remove("ring-2","ring-brand")); renderRooms();});
$("#searchInput")?.addEventListener("input",(e)=>{state.search=e.target.value.toLowerCase(); renderRooms();});

let ROOMS=[];
async function loadRooms(){const grid=$("#roomsGrid"); if(!grid) return; try{const res=await fetch("data/rooms.json"); ROOMS=await res.json();} catch(e){ROOMS=[];} try{const q=JSON.parse(localStorage.getItem("an_quiz")||"{}"); if(q.gender) state.gender=q.gender; if(q.region) state.region=q.region; if(q.size) state.size=q.size; if(Array.isArray(q.tags)) state.tags=q.tags;}catch(_){ } renderRooms();}
function applyFilters(){renderRooms();}
function matchRoom(r){ if(state.gender && r.gender!==state.gender) return false; if(state.region && r.region!==state.region) return false; if(state.size){ if(state.size==="Small" && !(r.viewers<500)) return false; if(state.size==="Mid" && !(r.viewers>=500 && r.viewers<2000)) return false; if(state.size==="High Traffic" && !(r.viewers>=2000)) return false; } if(state.tags.length>0 && !state.tags.every(t=> r.tags.includes(t))) return false; if(state.search && !(r.name.toLowerCase().includes(state.search) || r.title.toLowerCase().includes(state.search))) return false; return true;}
function renderRooms(){const grid=$("#roomsGrid"); if(!grid) return; const list=ROOMS.filter(matchRoom); $("#resultCount") && ($("#resultCount").textContent=`${list.length} rooms`); grid.innerHTML=""; list.forEach(r=>{const ref=localStorage.getItem("an_ref_code"); const url=`room.html?id=${encodeURIComponent(r.id)}${ref?`&ref=${encodeURIComponent(ref)}`:""}`; const el=document.createElement("a"); el.href=url; el.className="card block rounded-xl overflow-hidden bg-surface border border-white/10 hover:border-white/20 transition shadow-card"; el.innerHTML=`
  <div class="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
    <div class="absolute inset-0" style="background: radial-gradient(circle at 30% 20%, rgba(14,165,233,0.2), transparent 50%), radial-gradient(circle at 70% 70%, rgba(56,189,248,0.2), transparent 50%);"></div>
    <span class="relative text-4xl font-black opacity-20">${(r.name[0]||"A").toUpperCase()}</span>
    <span class="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-black/60 border border-white/10">${r.viewers.toLocaleString()} watching</span>
  </div>
  <div class="p-3">
    <div class="flex items-center gap-2">
      <h3 class="font-semibold truncate">${r.name}</h3>
      <span class="ml-auto text-xs px-2 py-1 rounded bg-white/10">${r.gender}</span>
    </div>
    <p class="text-sm text-slate-400 truncate">${r.title}</p>
    <div class="mt-1 flex items-center gap-3 text-xs text-slate-400">
      <span>🌎 ${r.region}</span>
      <span>🏷️ ${r.tags.slice(0,2).join(", ")}</span>
      <span class="ml-auto">💎 ${r.rate}/min</span>
    </div>
  </div>`; grid.append(el);});}
loadRooms();

async function loadRoom(){const playerEl=$("#player"); if(!playerEl) return; const id=params.get("id"); const res=await fetch("data/rooms.json"); const rooms=await res.json(); const room=rooms.find(r=>r.id===id) || rooms[0]; $("#roomTitle").textContent=room.name; $("#roomCategory").textContent=room.gender; $("#viewerCount").textContent=`${room.viewers.toLocaleString()} watching`; $("#chatViewers").textContent=`${room.viewers.toLocaleString()} in room`; const tipMenu=$("#tipMenu"); (room.tips||[]).forEach(t=>{const row=document.createElement("div"); row.className="flex items-center justify-between gap-3"; row.innerHTML=`<span class="text-sm">${t.label}</span><span class="text-sm font-mono">${t.amount}💎</span>`; tipMenu.append(row);}); const overlay=$("#playerOverlay"); const src=room.streamUrl; function ready(){overlay?.classList.add("hidden");} document.querySelector("#player").src=src; document.querySelector("#player").addEventListener("loadeddata", ready);
  const chatBox=$("#chatMessages"); const addMsg=(from,text,me=false)=>{const wrap=document.createElement("div"); wrap.className="text-sm"; wrap.innerHTML=`<span class="font-semibold ${me?'text-brand':'text-white'}">${from}</span> <span class="text-slate-300">${text}</span>`; chatBox.append(wrap); chatBox.scrollTop=chatBox.scrollHeight; }; addMsg(room.name,"Welcome to the room 💜"); ["Be nice and tip!","Where are you from?","Don't forget to follow."].forEach(t=>addMsg(room.name,t)); $("#chatSend")?.addEventListener("click", ()=>{const inp=$("#chatInput"); const v=(inp.value||"").trim(); if(!v) return; addMsg("You", v, true); inp.value="";});
  updateTokenBadges(); $("#buyTokens")?.addEventListener("click", ()=> setTokens(getTokens()+500)); $("#sendTipBtn")?.addEventListener("click", ()=>{const cost=100; const bal=getTokens(); if(bal<cost) return alert("Not enough tokens. Use 'Get Demo Tokens'."); setTokens(bal-cost); const chatBox=$("#chatMessages"); const wrap=document.createElement("div"); wrap.className="text-sm"; wrap.innerHTML=`<span class="font-semibold text-brand">System</span> <span class="text-slate-300">You tipped 100 ✨</span>`; chatBox.append(wrap);});}
loadRoom();

function initAffiliatePage(){if(!$("#refLink")) return; const myRef=localStorage.getItem("an_ref_code")||Math.random().toString(36).slice(2,8); localStorage.setItem("an_ref_code", myRef); $("#refCode").textContent=myRef; const base=location.origin+location.pathname.replace(/[^/]+$/,""); $("#refLink").value=`${base}index.html?ref=${encodeURIComponent(myRef)}`; $("#copyRef")?.addEventListener("click", async ()=>{await navigator.clipboard.writeText($("#refLink").value); alert("Copied!");}); const clicks=parseInt(localStorage.getItem("an_stat_clicks")||"0",10); const su=parseInt(localStorage.getItem("an_stat_su")||"0",10); const p=parseInt(localStorage.getItem("an_stat_p")||"0",10); $("#statClicks").textContent=clicks; $("#statSignups").textContent=su; $("#statPurchases").textContent=p; $("#fakeTraffic")?.addEventListener("click", ()=>{localStorage.setItem("an_stat_clicks", String(clicks+Math.floor(Math.random()*10+1))); localStorage.setItem("an_stat_su", String(su+Math.floor(Math.random()*3))); localStorage.setItem("an_stat_p", String(p+Math.floor(Math.random()*2))); location.reload();});}
initAffiliatePage();

$("#creatorForm")?.addEventListener("submit",(e)=>{e.preventDefault(); const data=Object.fromEntries(new FormData(e.target).entries()); const list=JSON.parse(localStorage.getItem("an_applications")||"[]"); list.push({...data, ts: Date.now()}); localStorage.setItem("an_applications", JSON.stringify(list)); alert("Application received (demo). We'll email you."); location.href="index.html";});
