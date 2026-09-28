// A temporary calm view: saved panel positions and active audio remain untouched.
const FocusModeModule = (() => {
  let page, button, active = false;
  function setActive(value, restoreFocus = true) {
    const next = Boolean(value) && !!page && !page.classList.contains('hidden');
    if (next === active) return;
    if (next && typeof TimerLayoutModule !== 'undefined') TimerLayoutModule.finishEditing();
    active = next;
    page.classList.toggle('calm-focus-mode', active);
    button.textContent = active ? 'Exit focus mode' : 'Focus mode';
    button.setAttribute('aria-pressed', String(active));
    button.title = active ? 'Show all panels and layout controls' : 'Show just your timer and drink. Ambient sounds keep playing.';
    const notice = document.getElementById('focusModeNotice');
    notice.textContent = active ? 'Just your timer and drink. Ambient sounds keep playing.' : '';
    if (restoreFocus && !page.classList.contains('hidden')) button.focus({preventScroll:true});
  }
  function init() {
    page = document.getElementById('timerPage');
    const toolbar = page?.querySelector('.timer-layout-toolbar');
    if (!toolbar) return;
    button = document.createElement('button');
    button.id = 'focusModeToggle';
    button.type = 'button';
    button.textContent = 'Focus mode';
    button.setAttribute('aria-pressed', 'false');
    button.title = 'Show just your timer and drink. Ambient sounds keep playing.';
    button.addEventListener('click', () => setActive(!active));
    const notice = document.createElement('span');
    notice.id = 'focusModeNotice';
    notice.setAttribute('role', 'status');
    toolbar.append(button, notice);
    new MutationObserver(() => {
      if (page.classList.contains('hidden')) setActive(false, false);
    }).observe(page, {attributes:true, attributeFilter:['class']});
  }
  document.addEventListener('DOMContentLoaded', init);
  return {setActive, isActive: () => active};
})();
