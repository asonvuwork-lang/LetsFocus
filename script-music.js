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
    const audio = getOrCreateAudio(sound);
    if (!audio.paused) {
      audio.pause();
      syncToggleUI(sound, false);
    } else {
      audio.play().catch(() =>
        showCustomAlert('Could not play "' + sound + '" sound. Check your internet connection.')
      );
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
