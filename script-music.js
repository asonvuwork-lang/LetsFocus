// =============================================
// MUSIC MODULE — Ambient Sounds (MP3 via Cloudinary)
// =============================================
const MusicModule = (function () {

  const ambientAudios = new Map();
  const ambientVolumes = new Map();
  const STORAGE_KEY = 'letsfocus_volumes';

  const SOUND_FILES = {
    rain:     'https://res.cloudinary.com/diyqurzvq/video/upload/v1776996128/rain_otcmzn.mp3',
    thunder:  'https://res.cloudinary.com/diyqurzvq/video/upload/v1776996118/thunder_mz7jxe.mp3',
    ocean:    'https://res.cloudinary.com/diyqurzvq/video/upload/v1776996115/ocean_gedg9j.mp3',
    forest:   'https://res.cloudinary.com/diyqurzvq/video/upload/v1776996123/forest_pauzav.mp3',
    fire:     'https://res.cloudinary.com/diyqurzvq/video/upload/v1776996116/fire_kfsnyi.mp3',
    coffee:   'https://res.cloudinary.com/diyqurzvq/video/upload/v1776996109/coffee_szybju.mp3',
    wind:     'https://res.cloudinary.com/diyqurzvq/video/upload/v1776996120/wind_duqzyi.mp3',
    writing:  'https://res.cloudinary.com/diyqurzvq/video/upload/v1776996120/writing_o0e7vi.mp3',
    keyboard: 'https://res.cloudinary.com/diyqurzvq/video/upload/v1776996477/typing_j9jjie.mp3',
    ac:       'https://res.cloudinary.com/diyqurzvq/video/upload/v1776996118/ac_nhvrqh.mp3',
  };

  // ---- Sound-toggle cooldown guard ----
  // Rapid clicking was racing play()/pause() on the same <audio> element:
  // pause() would abort an in-flight play() promise, which rejected and
  // looked identical to a real network/load failure, triggering the
  // "Could not play... Check your internet connection." alert for no reason.
  // This guard ignores repeat clicks on a sound until the previous
  // play/pause transition has settled, and shows a small cooldown wipe
  // animation on the button so the pause is visible instead of silent.
  //
  // Everything the overlay needs (positioning + the keyframe) is applied
  // here in JS rather than relying on rules in styles-main.css — the
  // button's own size/layout in the stylesheet is untouched, and the
  // overlay can never accidentally squash it even if the two files ever
  // drift out of sync again.
  const SOUND_COOLDOWN_MS = 450;
  const busySounds = new Set();

  let _cooldownKeyframeInjected = false;
  function ensureCooldownKeyframe() {
    if (_cooldownKeyframeInjected) return;
    _cooldownKeyframeInjected = true;
    const style = document.createElement('style');
    style.textContent = '@keyframes ntbCooldownDrain { from { transform: scaleY(1); } to { transform: scaleY(0); } }';
    document.head.appendChild(style);
  }

  function triggerSoundCooldown(sound) {
    ensureCooldownKeyframe();
    document.querySelectorAll('.noise-toggle-btn[data-sound="' + sound + '"], .setup-noise-btn[data-sound="' + sound + '"]')
      .forEach(btn => {
        // Host the overlay without ever changing the button's own box size.
        // IMPORTANT: do NOT set overflow:hidden here — verified in a real
        // browser that it collapses this flex-column button's auto-computed
        // height (~64px -> ~24px), clipping the label. Not needed anyway:
        // the overlay covers the button exactly and has its own
        // border-radius, so corners look right without clipping the parent.
        btn.style.position = btn.style.position || 'relative';

        let overlay = btn.querySelector('.ntb-cooldown-overlay');
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.className = 'ntb-cooldown-overlay';
          overlay.style.cssText =
            'position:absolute; left:0; right:0; top:0; bottom:0;' +
            'background:rgba(190,190,190,0.55); transform-origin:bottom;' +
            'pointer-events:none; border-radius:inherit; z-index:2;';
          btn.appendChild(overlay);
        }
        overlay.style.animation = 'none';
        void overlay.offsetWidth; // reflow — restarts the animation from scratch
        overlay.style.animation = 'ntbCooldownDrain ' + SOUND_COOLDOWN_MS + 'ms linear forwards';
      });
  }

  // ---- Volume persistence ----
  function loadStoredVolumes() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      Object.entries(saved).forEach(([sound, vol]) => ambientVolumes.set(sound, Number(vol)));
    } catch(e) {}
  }

  function saveVolume(sound, vol) {
    ambientVolumes.set(sound, vol);
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      saved[sound] = vol;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch(e) {}
  }

  function getVolume(sound) {
    return ambientVolumes.has(sound) ? ambientVolumes.get(sound) : 50;
  }

  // ---- Audio ----
  function getOrCreateAudio(sound) {
    if (!ambientAudios.has(sound)) {
      const audio = new Audio(SOUND_FILES[sound]);
      audio.loop = true;
      audio.volume = getVolume(sound) / 100;
      ambientAudios.set(sound, audio);
    }
    return ambientAudios.get(sound);
  }

  function toggleNoise(sound) {
    if (busySounds.has(sound)) return; // still cooling down from the last click — ignore
    busySounds.add(sound);
    triggerSoundCooldown(sound);
    setTimeout(() => busySounds.delete(sound), SOUND_COOLDOWN_MS);

    const audio = getOrCreateAudio(sound);
    if (!audio.paused) {
      audio.pause();
      syncToggleUI(sound, false);
    } else {
      audio.play().catch((err) => {
        // AbortError just means a pause() interrupted this play() a moment
        // later (a fast toggle) — not a real failure, so don't alarm the user.
        if (err && err.name === 'AbortError') return;
        showCustomAlert('Could not play "' + sound + '" sound. Check your internet connection.');
      });
      syncToggleUI(sound, true);
    }
  }

  // ---- Sync button active state + show/hide slider ----
  function syncToggleUI(sound, playing) {
    document.querySelectorAll('.noise-toggle-btn[data-sound="' + sound + '"], .setup-noise-btn[data-sound="' + sound + '"]')
      .forEach(btn => btn.classList.toggle('active', playing));

    // Reveal slider only on timer page
    document.querySelectorAll('#timerPage .ntb-wrap[data-sound="' + sound + '"]')
      .forEach(wrap => wrap.classList.toggle('slider-visible', playing));
  }

  function stopAllNoises() {
    ambientAudios.forEach((audio, sound) => {
      audio.pause();
      audio.currentTime = 0;
      syncToggleUI(sound, false);
    });
  }

  // ---- Wire buttons ----
  function wireToggleBtns(selector) {
    document.querySelectorAll(selector).forEach(btn => {
      const sound = btn.dataset.sound;
      if (!sound) return;
      btn.addEventListener('click', () => toggleNoise(sound));
    });
  }

  // ---- Wire volume sliders (timer page only) ----
  function wireVolumeSliders() {
    document.querySelectorAll('#timerPage .ntb-volume-slider').forEach(slider => {
      const sound = slider.dataset.sound;
      if (!sound) return;
      slider.value = getVolume(sound);
      slider.addEventListener('input', (e) => {
        const vol = Number(e.target.value);
        saveVolume(sound, vol);
        if (ambientAudios.has(sound)) ambientAudios.get(sound).volume = vol / 100;
      });
      slider.addEventListener('click', (e) => e.stopPropagation());
    });
  }

  function stopAllAudio() { stopAllNoises(); }

  function init() {
    loadStoredVolumes();
    wireToggleBtns('#timerPage .noise-toggle-btn');
    wireToggleBtns('#tab-music .setup-noise-btn');
    wireVolumeSliders();
    document.getElementById('stopAllNoisesBtn')?.addEventListener('click', stopAllNoises);
    document.getElementById('stopAllPreviewBtn')?.addEventListener('click', stopAllNoises);
  }

  function loadPlaylist() {}
  function updateDisplay() {}
  function addSong() { return Promise.resolve(false); }

  return { init, loadPlaylist, updateDisplay, stopAllAudio, addSong };
})();
