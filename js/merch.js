const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const params = new URLSearchParams(location.search);
const state = {search:'', selected:{} };

async function loadData(){ try{ const res=await fetch('data/merch.json'); if(res.ok) return res.json(); }catch(e){} const inline=document.getElementById('MERCH_DATA'); return inline?JSON.parse(inline.textContent):[]; }
function badgeColor(name){
  const map={orange:'from-orange-500 to-amber-400',teal:'from-teal-500 to-emerald-400',violet:'from-violet-500 to-fuchsia-400',
             rose:'from-rose-500 to-pink-500',emerald:'from-emerald-500 to-lime-400',sky:'from-sky-500 to-cyan-400',
             amber:'from-amber-500 to-yellow-400',indigo:'from-indigo-500 to-violet-500'}; 
  return map[name]||'from-sky-500 to-indigo-500';
}
function chip(label,group){ const s=document.createElement('button'); s.className='px-2 py-1 text-xs rounded-full bg-white/10 border border-white/10 hover:bg-white/20'; s.textContent=label; s.dataset.group=group; s.dataset.value=label; return s; }
function addChips(container, values, group){ const el=$(container); el.innerHTML=''; values.forEach(v=>el.appendChild(chip(v,group))); el.addEventListener('click',e=>{const b=e.target.closest('button'); if(!b)return; const g=b.dataset.group,v=b.dataset.value; state.selected[g]??=new Set(); const set=state.selected[g]; set.has(v)?set.delete(v):set.add(v); render();}); }

function activeChips(){
  const box=$('#chips'); box.innerHTML='';
  Object.entries(state.selected).forEach(([g,set])=>{
    set.forEach(v=>{ const c=document.createElement('button'); c.className='px-2 py-1 text-xs rounded-full bg-sky-600/30 border border-sky-400/30'; c.textContent=v+' ✕'; c.onclick=()=>{set.delete(v); render();}; box.appendChild(c); });
  });
}

function card(p){ return `<a href="merch.html?id=${p.id}" class="rounded-2xl border border-white/10 bg-[#111827] block overflow-hidden">
  <div class="aspect-square bg-gradient-to-b ${badgeColor(p.colorTheme)} flex items-center justify-center">
    <img src="${p.image}" alt="${p.title}" class="w-2/3 opacity-90">
  </div>
  <div class="p-3">
    <div class="font-semibold">${p.title}</div>
    <div class="text-xs text-slate-300 mt-1">${p.tagline}</div>
    <div class="text-xs text-slate-400 mt-1">${p.category} • ${p.use} • ${p.popularity}</div>
    <div class="mt-2 text-sm">${'★'.repeat(Math.round(p.rating))}<span class="text-slate-400"> (${p.reviews})</span></div>
    <div class="mt-2 font-semibold">$${p.price.toFixed(2)}</div>
  </div></a>`; }

function match(p){ // filters + search
  const s=state.search.toLowerCase();
  const text=(p.title+' '+p.tagline+' '+p.category+' '+p.use+' '+p.popularity).toLowerCase();
  if(s && !text.includes(s)) return false;
  for(const [g,set] of Object.entries(state.selected)){
    if(set.size===0) continue;
    const val=(g==='Category')?p.category:(g==='Players')?p.players:(g==='Use')?p.use:(g==='Color')?p.colorTheme:p.popularity;
    if(!set.has(val)) return false;
  }
  return true;
}

async function render(){
  const data = await loadData();
  state.search = $('#q').value.trim();
  activeChips();
  const list = data.filter(match);
  $('#grid').innerHTML = list.map(card).join('');
}

function buildFilters(data){
  const cats=[...new Set(data.map(x=>x.category))];
  const players=[...new Set(data.map(x=>x.players))];
  const use=[...new Set(data.map(x=>x.use))];
  const colors=[...new Set(data.map(x=>x.colorTheme))];
  const pop=[...new Set(data.map(x=>x.popularity))];
  addChips('#fCategory', cats, 'Category');
  addChips('#fPlayers', players, 'Players');
  addChips('#fUse', use, 'Use');
  addChips('#fColor', colors, 'Color');
  addChips('#fPop', pop, 'Popularity');
}

function renderProduct(p){
  $('#catalog').classList.add('hidden');
  const b=badgeColor(p.colorTheme);
  $('#productView').classList.remove('hidden');
  $('#productView').innerHTML = `
  <section class="rounded-2xl border border-white/10 overflow-hidden">
    <!-- Hero -->
    <div class="p-8 bg-gradient-to-b ${b} flex flex-col items-center">
      <img src="${p.image}" alt="${p.title}" class="w-[420px] max-w-full drop-shadow-2xl mb-4">
      <button class="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-semibold shadow-lg">Add to Cart — $${p.price.toFixed(2)}</button>
    </div>
    <!-- Details -->
    <div class="p-6 bg-[#0b0f19]">
      <h1 class="text-2xl font-bold">${p.title}</h1>
      <div class="text-slate-300">${p.tagline}</div>
      <div class="mt-4 rounded-xl border border-white/10 bg-[#111827] p-4">
        <div class="grid sm:grid-cols-2 gap-3 text-sm">
          <div><span class="text-slate-400">Category:</span> ${p.category}</div>
          <div><span class="text-slate-400">Players:</span> ${p.players}</div>
          <div><span class="text-slate-400">Use:</span> ${p.use}</div>
          <div><span class="text-slate-400">Popularity:</span> ${p.popularity}</div>
          <div><span class="text-slate-400">Rating:</span> ${p.rating}★ (${p.reviews} reviews)</div>
        </div>
        <p class="mt-3 text-slate-300">${p.description}</p>
      </div>
      <!-- Tabs -->
      <div class="mt-4">
        <div class="flex gap-2 text-sm">
          <button class="tab px-3 py-2 rounded bg-white/10 border border-white/10" data-t="inside">What's Inside?</button>
          <button class="tab px-3 py-2 rounded bg-white/10 border border-white/10" data-t="how">How to Use</button>
          <button class="tab px-3 py-2 rounded bg-white/10 border border-white/10" data-t="reviews">Customer Reviews</button>
        </div>
        <div id="tabContent" class="mt-3 text-sm text-slate-300 rounded-xl border border-white/10 bg-[#111827] p-4"></div>
      </div>
      <div class="mt-6">
        <a href="merch.html" class="underline">← Back to merch</a>
      </div>
    </div>
  </section>`;

  const tabContent = (k)=>{
    if(k==='inside') return `<ul class="list-disc pl-5">${p.features.map(x=>`<li>${x}</li>`).join('')}</ul>`;
    if(k==='how') return `<ol class="list-decimal pl-5">${p.howTo.map(x=>`<li>${x}</li>`).join('')}</ol>`;
    return `<div>${'★'.repeat(Math.round(p.rating))} — ${p.reviews} reviews<br/><div class="mt-2">"${p.tagline}"</div></div>`;
  }
  const setTab=(k)=>$('#tabContent').innerHTML = tabContent(k);
  $$('.tab').forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.t)));
  setTab('inside');
}

(async function init(){
  const data=await loadData();
  // filters
  buildFilters(data);
  // search
  $('#q').addEventListener('input', render);
  $('#resetFilters').addEventListener('click', ()=>{state.selected={}; $('#q').value=''; render();});
  // product view?
  const id=params.get('id');
  if(id){ const p=data.find(x=>x.id===id); if(p) return renderProduct(p); }
  render();
})();