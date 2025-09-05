const $=s=>document.querySelector(s);
const state={q:'',cat:new Set(),rate:new Set()};
const data=[
  {id:'a1',name:'Blob Bots',cat:'Game',rating:5,desc:'Eat, grow, dominate.'},
  {id:'a2',name:'Classic War',cat:'Strategy',rating:4,desc:'Flip cards to win.'},
  {id:'a3',name:'Cosmic Jackpot',cat:'Casino',rating:4,desc:'Huge stack jackpot.'},
  {id:'a4',name:'Big Fish',cat:'Game',rating:5,desc:'Become the biggest fish.'},
  {id:'a5',name:'Memory Match',cat:'Puzzle',rating:4,desc:'Test your memory.'},
  {id:'a6',name:'Mini Basketball',cat:'Sports',rating:3,desc:'Casual hoops.'},
  {id:'a7',name:'Sea Square',cat:'Puzzle',rating:5,desc:'Match-3 with betting.'},
  {id:'a8',name:'WordWeaver',cat:'Word',rating:4,desc:'Fast word duels.'},
  {id:'a9',name:'Snakes & Ladders',cat:'Board',rating:3,desc:'2–6 players.'}
];
function pill(v,g){const b=document.createElement('button');b.className='px-2 py-1 text-xs rounded-full bg-white/10 border border-white/10';b.textContent=v;b.dataset.g=g; b.onclick=()=>{const set=g==='Category'?state.cat:state.rate; set.has(v)?set.delete(v):set.add(v); render();}; return b;}
function chips(){const box=$('#achips');box.innerHTML='';[...state.cat].forEach(v=>{const b=pill(v,'Category');b.onclick=()=>{state.cat.delete(v);render();}; box.appendChild(b)});[...state.rate].forEach(v=>{const b=pill(v,'Rating≥');b.onclick=()=>{state.rate.delete(v);render();}; box.appendChild(b)});}
function card(a){return `<a href='#' class='rounded-2xl border border-white/10 bg-[#111827] p-4 block'><div class='text-lg font-semibold'>${a.name}</div><p class='text-sm text-slate-400 mt-1'>${a.desc}</p><div class='mt-2 text-sm'>${'★'.repeat(a.rating)}</div><button class='mt-3 px-3 py-2 rounded bg-white/10 border border-white/10'>Open</button></a>`}
function match(a){if(state.q && !(a.name+a.desc).toLowerCase().includes(state.q)) return false; if(state.cat.size && !state.cat.has(a.cat)) return false; if(state.rate.size){const min=Math.max(...[...state.rate]); if(a.rating<min) return false;} return true;}
function render(){state.q=$('#aq').value.trim().toLowerCase(); chips(); $('#agrid').innerHTML=data.filter(match).map(card).join('');}
(function init(){const cats=[...new Set(data.map(x=>x.cat))]; const ratings=[3,4,5]; cats.forEach(v=>document.getElementById('afCategory').appendChild(pill(v,'Category'))); ratings.forEach(v=>document.getElementById('afRating').appendChild(pill(String(v),'Rating≥'))); $('#aq').addEventListener('input',render); document.getElementById('areset').addEventListener('click',()=>{state.q='';state.cat.clear();state.rate.clear();$('#aq').value='';render();}); render();})();