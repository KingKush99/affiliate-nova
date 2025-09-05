
(()=>{
let level=3, xp=3000, needed=6000;
const xpFill=document.getElementById('xpFill'), lvl=document.getElementById('level'), lbl=document.getElementById('xpLabel');
function redraw(){
  lvl.textContent=level; lbl.textContent=xp+' / '+needed; xpFill.style.width=Math.min(100, (xp/needed)*100)+'%';
}
document.getElementById('addXp').onclick=()=>{
  xp += 250;
  if(xp>=needed){ level++; xp=0; needed = Math.min(1000*1000, (level+1)*1000*(level+1)/2); }
  redraw();
};
redraw();
})();