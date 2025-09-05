(function(){
  function open(id){document.getElementById(id)?.classList.remove('hidden');}
  function close(id){document.getElementById(id)?.classList.add('hidden');}
  document.addEventListener('click', (e)=>{
    const o = e.target.closest('[data-modal-open]');
    const c = e.target.closest('[data-modal-close]');
    if(o){e.preventDefault();open(o.getAttribute('data-modal-open'));}
    if(c){e.preventDefault();close(c.getAttribute('data-modal-close'));}
    if(e.target.classList.contains('modal-overlay')){e.preventDefault();e.target.classList.add('hidden');}
  });
  // Disable Account confirmation
  window.confirmDisableAccount = function(){
    const ok = confirm('Are you sure you want to disable your account? This cannot be undone.');
    if(ok) alert('Your account has been scheduled for deletion (demo).');
  }
})();