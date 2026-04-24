// =============================================
// MUSIC MODULE — Ambient Sounds (MP3 via Cloudinary)
// =============================================
const MusicModule = (function () {

  const ambientAudios = new Map();
  const ambientVolumes = new Map();

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

  function getOrCreateAudio(sound) {
    if (!ambientAudios.has(sound)) {
      const audio = new Audio(SOUND_FILES[sound]);
      audio.loop = true;
      audio.volume = (ambientVolumes.get(sound) ?? 70) / 100;
      ambientAudios.set(sound, audio);
    }
    return ambientAudios.get(sound);
  }

  // Toggle a sound on/off — called by toggle button click
  function toggleNoise(sound) {
    const audio = getOrCreateAudio(sound);
    if (!audio.paused) {
      audio.pause();
      syncToggleUI(sound, false);
    } else {
      audio.play().catch(() =>
        showCustomAlert(`Could not play "${sound}" sound. Check your internet connection.`)
      );
      syncToggleUI(sound, true);
    }
  }

  // Sync all buttons with matching data-sound across both pages
  function syncToggleUI(sound, playing) {
    document.querySelectorAll(`.noise-toggle-btn[data-sound="${sound}"], .setup-noise-btn[data-sound="${sound}"]`)
      .forEach(btn => btn.classList.toggle('active', playing));
  }

  function stopAllNoises() {
    ambientAudios.forEach((audio, sound) => {
      audio.pause();
      audio.currentTime = 0;
      syncToggleUI(sound, false);
    });
  }

  // Wire all toggle buttons in a container
  function wireToggleBtns(selector) {
    document.querySelectorAll(selector).forEach(btn => {
      const sound = btn.dataset.sound;
      if (!sound) return;
      btn.addEventListener('click', () => toggleNoise(sound));
    });
  }

  function stopAllAudio() { stopAllNoises(); }

  function init() {
    wireToggleBtns('#timerPage .noise-toggle-btn');
    wireToggleBtns('#tab-music .setup-noise-btn');
    document.getElementById('stopAllNoisesBtn')?.addEventListener('click', stopAllNoises);
    document.getElementById('stopAllPreviewBtn')?.addEventListener('click', stopAllNoises);
  }

  // Stubs for compatibility
  function loadPlaylist() {}
  function updateDisplay() {}
  function addSong() { return Promise.resolve(false); }

  return { init, loadPlaylist, updateDisplay, stopAllAudio, addSong };
})();
