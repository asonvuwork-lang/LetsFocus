// Presentation only: session accounting stays in TimerModule.
const SessionCompletionModule = (() => {
  let active = null;
  function formatDuration(seconds) {
    const value = Math.max(0, Math.floor(Number(seconds) || 0));
    const hours = Math.floor(value / 3600), minutes = Math.floor(value % 3600 / 60), remainder = value % 60;
    return hours ? `${hours}h ${minutes}m` : minutes ? `${minutes}m ${remainder}s` : `${remainder}s`;
  }
  function show(options = {}) {
    if (active) active.close();
    const previousFocus = document.activeElement;
    const dialog = document.createElement('dialog');
    dialog.className = 'session-completion';
    dialog.setAttribute('aria-labelledby', 'sessionCompletionTitle');
    dialog.innerHTML = `<div class="completion-drink" aria-hidden="true"></div>
      <p class="completion-eyebrow">A moment well spent</p>
      <h2 id="sessionCompletionTitle"></h2><p class="completion-goal"></p>
      <div class="completion-stats"><div><strong class="completion-time"></strong><span>focused</span></div><div><strong class="completion-beans"></strong><span>beans earned</span></div></div>
      <p class="completion-message">Enjoy your creation. Choose what feels right next.</p>
      <div class="completion-actions"><button type="button" data-action="break">Take a break</button><button type="button" data-action="continue">Continue</button><button type="button" data-action="finish">Finish</button></div>`;
    dialog.querySelector('h2').textContent = options.goalComplete ? 'Goal complete!' : 'Your session is complete';
    dialog.querySelector('.completion-goal').textContent = options.goal || 'Time for yourself';
    dialog.querySelector('.completion-time').textContent = formatDuration(options.focusedSeconds);
    dialog.querySelector('.completion-beans').textContent = `+${Math.max(0, Math.floor(Number(options.beansEarned) || 0))}`;
    const source = document.querySelector('#drinkScene');
    if (source && source.childElementCount) {
      const clone = source.cloneNode(true);
      const ids = new Map();
      [clone, ...clone.querySelectorAll('[id]')].forEach(node => { if (node.id) { const old = node.id; node.id = `completion-${old}`; ids.set(old,node.id); } });
      // SVG paint servers must point at the cloned drink, never the live timer.
      [clone, ...clone.querySelectorAll('*')].forEach(node => {
        for (const attribute of [...node.attributes]) {
          let value = attribute.value;
          for (const [old, replacement] of ids) {
            value = value.split(`url(#${old})`).join(`url(#${replacement})`);
            if ((attribute.name === 'href' || attribute.name === 'xlink:href') && value === `#${old}`) value = `#${replacement}`;
          }
          node.setAttribute(attribute.name,value);
        }
      });
      dialog.querySelector('.completion-drink').append(clone);
    } else dialog.querySelector('.completion-drink').textContent = '☕';
    let interval = null, revealTimer = null, closed = false;
    function close() {
      if (closed) return;
      closed = true; clearInterval(interval); clearTimeout(revealTimer); dialog.close(); dialog.remove(); active = null;
      if (previousFocus?.isConnected) previousFocus.focus({preventScroll:true});
    }
    function choose(callback) { if (closed) return; close(); callback?.(); }
    const breakButton = dialog.querySelector('[data-action="break"]');
    breakButton.addEventListener('click', () => {
      if (interval) return;
      const endsAt = Date.now() + 5 * 60 * 1000;
      breakButton.disabled = true;
      dialog.querySelector('.completion-eyebrow').textContent = 'You have earned a breather';
      const message = dialog.querySelector('.completion-message');
      const tick = () => {
        const left = Math.max(0,Math.ceil((endsAt - Date.now()) / 1000));
        breakButton.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2,'0')} break`;
        message.textContent = left ? 'Stretch, rest your eyes, or enjoy a sip. Continue whenever you are ready.' : 'Break complete. Ready when you are.';
        if (!left) { clearInterval(interval); interval = null; breakButton.textContent = 'Break complete'; message.setAttribute('role','status'); }
      };
      tick(); interval = setInterval(tick,1000);
      dialog.querySelector('[data-action="continue"]').focus();
    });
    dialog.querySelector('[data-action="continue"]').addEventListener('click', () => choose(options.onContinue));
    dialog.querySelector('[data-action="finish"]').addEventListener('click', () => choose(options.onFinish));
    dialog.addEventListener('cancel', event => { event.preventDefault(); choose(options.onFinish); });
    dialog.addEventListener('keydown', event => event.stopPropagation());
    document.body.append(dialog); active = {close};
    function reveal() {
      if (closed) return;
      if (document.getElementById('timerPage')?.classList.contains('hidden')) { close(); return; }
      if (typeof XPModule !== 'undefined' && XPModule.isCelebrating?.()) {
        revealTimer = setTimeout(reveal,200); return;
      }
      dialog.showModal();
      dialog.querySelector('[data-action="break"]').focus();
    }
    reveal();
  }
  return {show, formatDuration};
})();
