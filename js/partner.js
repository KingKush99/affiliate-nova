
(()=>{
const log = (msg)=>{
  const box=document.getElementById('chatLog'); const p=document.createElement('p'); p.textContent=msg; box.appendChild(p); box.scrollTop=box.scrollHeight;
};
document.querySelectorAll('button[data-act]').forEach(b=>b.addEventListener('click',()=>{
  const act=b.dataset.act;
  animate(act); log('Partner: *'+act+'*');
}));
document.getElementById('vSend').onclick=()=>{
  const i=document.getElementById('vMsg');
  if(!i.value.trim()) return;
  log('You: '+i.value.trim());
  i.value='';
};
function animate(type){
  const eyeL=document.getElementById('eyeL'); const eyeR=document.getElementById('eyeR'); const mouth=document.getElementById('mouth');
  if(type==='wink'){ eyeR.setAttribute('r','1'); setTimeout(()=>eyeR.setAttribute('r','4'),500); }
  if(type==='smile'){ mouth.setAttribute('d','M85 85 Q100 100 115 85'); setTimeout(()=>mouth.setAttribute('d','M85 85 Q100 95 115 85'),800); }
  if(type==='wave'){ document.getElementById('avatarBox').style.transform='rotate(2deg)'; setTimeout(()=>document.getElementById('avatarBox').style.transform='rotate(0)',500); }
  if(type==='nod'){ document.getElementById('avatarBox').style.transform='translateY(3px)'; setTimeout(()=>document.getElementById('avatarBox').style.transform='translateY(0)',400); }
}
})();