async function run(){
  const res=await fetch(new URL('./data/tags.json',location.href)); const data=await res.json();
  const grid=document.getElementById('tagGrid'), sortSel=document.getElementById('tagSort'), q=document.getElementById('tagSearch');
  function render(){
    let list=data.filter(t=>!q.value||t.name.toLowerCase().includes(q.value.toLowerCase()));
    const k=sortSel.value;
    list.sort((a,b)=>k==='alpha'?a.name.localeCompare(b.name):k==='viewers'?b.viewers-a.viewers:b.rooms-a.rooms||b.viewers-a.viewers);
    grid.innerHTML=list.map(t=>`<a href="index.html?tag=${encodeURIComponent(t.name)}" class="rounded-2xl border border-white/10 bg-[#111827] p-3 block">
      <div class="font-semibold">#${t.name}</div>
      <div class="text-xs text-slate-400 mt-1">${t.rooms} rooms • ${t.viewers.toLocaleString()} viewers</div>
    </a>`).join('');
  }
  sortSel.onchange=render; q.oninput=render; render();
}
document.addEventListener('DOMContentLoaded', run);