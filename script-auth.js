// Account entry point. Guest mode remains fully available while cloud setup is deferred.
const AuthModule = (() => {
  let initialized = false;
  function bootApp() {
    if (initialized) return;
    initialized = true;
    document.dispatchEvent(new CustomEvent('letsfocus:ready'));
  }
  function openAccount() {
    if (document.getElementById('accountDialog')) return;
    const previous = document.activeElement;
    const dialog = document.createElement('dialog');
    dialog.id = 'accountDialog'; dialog.className = 'account-dialog';
    dialog.setAttribute('aria-labelledby','accountTitle');
    dialog.setAttribute('aria-describedby','accountDescription');
    dialog.innerHTML = `<span class="account-eyebrow">YOUR FOCUS CAFÉ</span>
      <h2 id="accountTitle">A place for your progress</h2>
      <p id="accountDescription">You’re using LetsFocus as a guest. Your goals and study progress are saved in this browser.</p>
      <div class="account-coming"><strong>Google sign-in is coming</strong><p>Account setup is still in progress. Cloud saving and Google Calendar aren’t connected yet.</p></div>
      <p class="account-local-note">For now, use Export in the Goal Area settings to back up your progress or move it to another device.</p>
      <button type="button" class="account-continue">Continue as guest</button>`;
    document.body.appendChild(dialog);
    dialog.querySelector('button').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('keydown',e=>e.stopPropagation());
    dialog.addEventListener('close',()=>{dialog.remove();previous?.focus();},{once:true});
    dialog.showModal(); dialog.querySelector('button').focus();
  }
  function init() {
    const button=document.getElementById('accountBtn');
    button?.addEventListener('click',openAccount);
    button?.setAttribute('aria-haspopup','dialog');
    button?.setAttribute('title','Account options — sign-in coming soon');
    bootApp();
  }
  return {init,bootApp,openAccount};
})();
