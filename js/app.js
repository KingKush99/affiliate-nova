document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('.panel').forEach(panel=>{
    document.addEventListener('click', e=>{
      if(!panel.contains(e.target)) panel.style.display='none';
    });
  });
});
