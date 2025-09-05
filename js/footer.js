
// Modal wiring + dummy content
const modal=document.getElementById('modal');
const title=document.getElementById('modalTitle');
const body=document.getElementById('modalBody');
document.querySelectorAll('[data-modal]').forEach(a=>a.addEventListener('click',e=>{
  e.preventDefault();
  title.textContent = a.textContent;
  body.innerHTML = '<p>Stub modal for '+a.textContent+'. Replace this text in js/footer.js with your actual content.</p>';
  modal.style.display='flex';
}));
document.getElementById('modalClose').onclick=()=> modal.style.display='none';
modal.addEventListener('click',e=>{ if(e.target===modal) modal.style.display='none';});
