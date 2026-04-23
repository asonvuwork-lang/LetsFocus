// =============================================
// MUSIC MODULE — YouTube embed player + MP3 Ambient
// =============================================
const MusicModule = (function () {

  let playlist = JSON.parse(localStorage.getItem('musicPlaylist')) || [];
  let idx = 0;
  let isPlaying = false;

  const DEFAULT_YT_API_KEY = 'AIzaSyDW2nPYCACfvUo78Kfo68sEfZE1Q3T8s9g';
  function getApiKey() { return localStorage.getItem('ytApiKey') || DEFAULT_YT_API_KEY; }

  const ambientAudios = new Map();
  const ambientVolumes = new Map();
  const SOUND_FILES = {
    rain: '../sounds/rain.mp3', thunder: '../sounds/thunder.mp3',
    ocean: '../sounds/ocean.mp3', forest: '../sounds/forest.mp3',
    fire: '../sounds/fire.mp3', coffee: '../sounds/coffee.mp3',
    wind: '../sounds/wind.mp3', writing: '../sounds/writing.mp3',
    fan: '../sounds/fan.mp3', ac: '../sounds/ac.mp3',
  };

  // ── URL helpers ────────────────────────────
  function getYTId(url) {
    if (!url) return null;
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/))([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  }

  async function deriveTitleFromUrl(url) {
    const ytId = getYTId(url);
    if (ytId) {
      return fetch(`https://www.youtube.com/oembed?url=https://youtube.com/watch?v=${ytId}&format=json`)
        .then(r => r.json()).then(d => d.title || null).catch(() => null);
    }
    const parts = url.split('/');
    const filename = parts[parts.length - 1].split('?')[0];
    return decodeURIComponent(filename).replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') || 'Track';
  }

  // ── Embed player ───────────────────────────
  // Loads the YouTube iframe directly into the card with full native controls
  function loadEmbed(trackIdx) {
    if (!playlist.length) return;
    idx = ((trackIdx % playlist.length) + playlist.length) % playlist.length;
    const track = playlist[idx];
    const ytId = getYTId(track.url);

    const container = document.getElementById('ytEmbedContainer');
    const placeholder = document.getElementById('ytEmbedPlaceholder');
    if (!container) return;

    if (ytId) {
      container.innerHTML = `<iframe
        id="ytMainEmbed"
        width="100%" height="200"
        src="https://www.youtube.com/embed/${ytId}?autoplay=1&controls=1&rel=0&modestbranding=1&fs=0&iv_load_policy=3"
        allow="autoplay; encrypted-media"
        allowfullscreen
        frameborder="0"
        style="border-radius:10px;display:block;"></iframe>`;
      if (placeholder) placeholder.style.display = 'none';
      container.style.display = 'block';
    } else {
      // Direct mp3 file
      container.innerHTML = `<audio controls autoplay style="width:100%;border-radius:10px;margin-top:4px;">
        <source src="${track.url}"></audio>`;
      if (placeholder) placeholder.style.display = 'none';
      container.style.display = 'block';
    }

    isPlaying = true;
    updateDisplay();
    renderQueue();
    renderPlaylistSetup();
  }

  function nextTrack()     { if (playlist.length) loadEmbed(idx + 1); }
  function previousTrack() { if (playlist.length) loadEmbed(idx - 1); }

  function stopMusic() {
    const container = document.getElementById('ytEmbedContainer');
    if (container) container.innerHTML = '';
    const placeholder = document.getElementById('ytEmbedPlaceholder');
    if (placeholder) placeholder.style.display = 'flex';
    isPlaying = false;
    updateDisplay();
  }

  function stopAllAudio() { stopMusic(); stopAllNoises(); }

  // ── Display ────────────────────────────────
  function updateDisplay() {
    const current = playlist.length ? (playlist[idx]?.title || `Track ${idx + 1}`) : 'No Song Loaded';
    const nextTitle = playlist.length > 1
      ? (playlist[(idx + 1) % playlist.length]?.title || `Track ${(idx + 1) % playlist.length + 1}`)
      : '—';
    const el = document.getElementById('songTitle');
    if (el) el.textContent = current;
    const nextEl = document.getElementById('upNextTitle');
    if (nextEl) nextEl.textContent = nextTitle;
    const ti = document.getElementById('trackIndexDisplay');
    if (ti) ti.textContent = playlist.length ? `${idx + 1} / ${playlist.length}` : '0 / 0';
    // Vinyl spin
    document.getElementById('vinylRecord')?.classList.toggle('spinning', isPlaying);
  }

  // ── Queue / playlist rendering ─────────────
  function renderQueue() {
    const list = document.getElementById('queueList');
    if (!list) return;
    if (!playlist.length) {
      list.innerHTML = '<p class="empty-queue">Queue is empty — add songs in Music Setup</p>';
      return;
    }
    list.innerHTML = '';
    playlist.forEach((t, i) => {
      const item = document.createElement('div');
      item.className = 'queue-item' + (i === idx ? ' current' : '');
      item.innerHTML = `<span class="queue-item-num">${i === idx ? '▶' : (i + 1)}</span>
        <span class="queue-item-title">${escHtml(t.title)}</span>
        <button class="queue-item-del" data-index="${i}">&times;</button>`;
      item.querySelector('.queue-item-del').addEventListener('click', e => {
        e.stopPropagation(); removeSong(parseInt(e.target.dataset.index));
      });
      item.addEventListener('click', e => {
        if (e.target.classList.contains('queue-item-del')) return;
        loadEmbed(i);
      });
      list.appendChild(item);
    });
  }

  function renderPlaylistSetup() {
    const list = document.getElementById('playlistList');
    const count = document.getElementById('playlistCount');
    if (!list) return;
    if (count) count.textContent = `${playlist.length} song${playlist.length !== 1 ? 's' : ''}`;
    if (!playlist.length) {
      list.innerHTML = '<p class="empty-playlist">No songs yet. Search above!</p>';
      return;
    }
    list.innerHTML = '';
    playlist.forEach((t, i) => {
      const item = document.createElement('div');
      item.className = 'playlist-item' + (i === idx ? ' current' : '');
      item.innerHTML = `<span class="playlist-item-num">${i + 1}</span>
        <span class="playlist-item-title" title="${escHtml(t.title)}">${escHtml(t.title)}</span>
        <button class="playlist-item-del" data-index="${i}">&times;</button>`;
      item.querySelector('.playlist-item-del').addEventListener('click', e => {
        e.stopPropagation(); removeSong(parseInt(e.target.dataset.index));
      });
      list.appendChild(item);
    });
  }

  function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── Playlist management ────────────────────
  function save() { localStorage.setItem('musicPlaylist', JSON.stringify(playlist)); }

  function loadPlaylist() {
    playlist = JSON.parse(localStorage.getItem('musicPlaylist')) || [];
    updateDisplay();
    renderQueue();
    renderPlaylistSetup();
  }

  async function addSong(url, titleOverride) {
    if (!url || !url.trim()) return false;
    url = url.trim();
    const ytId = getYTId(url);
    if (!ytId && !url.match(/\.(mp3|ogg|wav|aac|flac)(\?.*)?$/i)) {
      showCustomAlert('Please use a YouTube URL or direct audio file link.\n\nExample: https://youtube.com/watch?v=...');
      return false;
    }
    const title = titleOverride || await deriveTitleFromUrl(url) || ('Track ' + (playlist.length + 1));
    playlist.push({ url, title });
    save(); loadPlaylist();
    return true;
  }

  function removeSong(i) {
    const wasPlaying = (i === idx && isPlaying);
    playlist.splice(i, 1);
    if (idx >= playlist.length) idx = Math.max(0, playlist.length - 1);
    save();
    if (wasPlaying) stopMusic();
    else { loadPlaylist(); }
  }

  function clearPlaylist() { stopMusic(); playlist = []; idx = 0; save(); loadPlaylist(); }

  // ── YouTube Data API search ────────────────
  async function searchYouTube(query) {
    const resultsEl = document.getElementById('searchResults');
    if (!resultsEl) return;

    // Direct URL
    const ytId = getYTId(query);
    if (ytId || query.match(/^https?:\/\//)) {
      resultsEl.innerHTML = '<p class="search-hint searching">🔍 Fetching info...</p>';
      const title = await deriveTitleFromUrl(query);
      showSearchResults([{
        id: ytId, title: title || query, author: '', duration: '',
        thumb: ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : '',
        url: ytId ? `https://www.youtube.com/watch?v=${ytId}` : query
      }], resultsEl);
      return;
    }

    resultsEl.innerHTML = '<p class="search-hint searching">🔍 Searching YouTube...</p>';
    try {
      const key = getApiKey();
      const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=${encodeURIComponent(query)}&key=${key}`
      );
      if (!searchRes.ok) {
        const err = await searchRes.json().catch(() => ({}));
        resultsEl.innerHTML = `<p class="search-hint">Search error: ${err?.error?.message || searchRes.status}</p>`;
        return;
      }
      const data = await searchRes.json();
      if (!data.items?.length) {
        resultsEl.innerHTML = '<p class="search-hint">No results. Try different keywords.</p>';
        return;
      }

      // Fetch durations
      const ids = data.items.map(i => i.id.videoId).join(',');
      let durations = {};
      try {
        const vRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${ids}&key=${key}`);
        const vData = await vRes.json();
        vData.items?.forEach(v => { durations[v.id] = parseDuration(v.contentDetails.duration); });
      } catch {}

      showSearchResults(data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        author: item.snippet.channelTitle,
        duration: durations[item.id.videoId] || '',
        thumb: item.snippet.thumbnails?.default?.url || `https://img.youtube.com/vi/${item.id.videoId}/default.jpg`,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`
      })), resultsEl);
    } catch (err) {
      resultsEl.innerHTML = `<p class="search-hint">Search failed: ${err.message}</p>`;
    }
  }

  function parseDuration(iso) {
    const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!m) return '';
    const h = parseInt(m[1]||0), min = parseInt(m[2]||0), s = parseInt(m[3]||0);
    return h > 0 ? `${h}:${String(min).padStart(2,'0')}:${String(s).padStart(2,'0')}` : `${min}:${String(s).padStart(2,'0')}`;
  }

  function showSearchResults(results, container) {
    container.innerHTML = '';
    results.forEach(r => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.innerHTML = `
        ${r.thumb ? `<img class="search-thumb" src="${r.thumb}" alt="" onerror="this.style.display='none'">` : ''}
        <div class="search-result-info">
          <div class="search-result-title">${escHtml(r.title)}</div>
          <div class="search-result-meta">${escHtml(r.author)}${r.duration ? ' · ' + r.duration : ''}</div>
        </div>
        <button class="search-add-btn">+ Add</button>`;
      item.querySelector('.search-add-btn').addEventListener('click', async (e) => {
        await addSong(r.url, r.title);
        e.target.textContent = '✓';
        e.target.disabled = true;
        e.target.style.cssText = 'background:#22c55e;cursor:default;color:white;';
      });
      container.appendChild(item);
    });
  }

  // ── Ambient Sounds ─────────────────────────
  function wireNoiseItems(selector) {
    document.querySelectorAll(selector).forEach(item => {
      const sound = item.dataset.sound; if (!sound) return;
      item.querySelector('.noise-play-btn')?.addEventListener('click', () => toggleNoise(sound, item));
      item.querySelector('.noise-volume')?.addEventListener('input', e => setNoiseVol(sound, e.target.value));
    });
  }

  function getOrCreateAudio(sound) {
    if (!ambientAudios.has(sound)) {
      const audio = new Audio(SOUND_FILES[sound]);
      audio.loop = true;
      audio.volume = (ambientVolumes.get(sound) ?? 50) / 100;
      ambientAudios.set(sound, audio);
    }
    return ambientAudios.get(sound);
  }

  function toggleNoise(sound, item) {
    const audio = getOrCreateAudio(sound);
    if (!audio.paused) { audio.pause(); syncNoiseUI(sound, false); }
    else {
      const vol = item.querySelector('.noise-volume')?.value ?? 50;
      ambientVolumes.set(sound, parseInt(vol));
      audio.volume = parseInt(vol) / 100;
      audio.play().catch(() => showCustomAlert(`Sound file not found.\nExpected at: ${SOUND_FILES[sound]}`));
      syncNoiseUI(sound, true);
    }
  }

  function setNoiseVol(sound, vol) {
    ambientVolumes.set(sound, parseInt(vol));
    const audio = ambientAudios.get(sound);
    if (audio) audio.volume = parseInt(vol) / 100;
    document.querySelectorAll(`.noise-item[data-sound="${sound}"] .noise-volume, .setup-noise-item[data-sound="${sound}"] .noise-volume`)
      .forEach(s => { if (s.value !== String(vol)) s.value = vol; });
  }

  function syncNoiseUI(sound, playing) {
    document.querySelectorAll(`.noise-item[data-sound="${sound}"], .setup-noise-item[data-sound="${sound}"]`).forEach(item => {
      item.classList.toggle('playing', playing);
      const btn = item.querySelector('.noise-play-btn');
      if (btn) { btn.classList.toggle('playing', playing); btn.textContent = playing ? '⏸' : '▶'; }
    });
  }

  function stopAllNoises() {
    ambientAudios.forEach(a => { a.pause(); a.currentTime = 0; });
    document.querySelectorAll('.noise-item, .setup-noise-item').forEach(item => {
      item.classList.remove('playing');
      const btn = item.querySelector('.noise-play-btn');
      if (btn) { btn.classList.remove('playing'); btn.textContent = '▶'; }
    });
  }

  // ── Init ───────────────────────────────────
  function init() {
    loadPlaylist();

    // Prev / Next buttons
    document.getElementById('prevBtn')?.addEventListener('click', previousTrack);
    document.getElementById('nextBtn')?.addEventListener('click', nextTrack);

    // Ambient
    document.getElementById('stopAllNoisesBtn')?.addEventListener('click', stopAllNoises);
    document.getElementById('stopAllPreviewBtn')?.addEventListener('click', stopAllNoises);
    wireNoiseItems('#timerPage .noise-item');
    wireNoiseItems('#tab-music .setup-noise-item');

    // Setup tab search + add
    const setupInput = document.getElementById('setupMusicUrl');
    const doSetupSearch = async () => {
      const q = setupInput?.value?.trim();
      if (!q) return;
      // If it's a direct URL, add it; otherwise search
      if (getYTId(q) || q.match(/^https?:\/\//)) {
        if (await addSong(q)) setupInput.value = '';
      } else {
        searchYouTube(q);
      }
    };
    document.getElementById('setupAddSongBtn')?.addEventListener('click', doSetupSearch);
    setupInput?.addEventListener('keypress', e => { if (e.key === 'Enter') { e.preventDefault(); doSetupSearch(); } });

    // Clear playlist
    document.getElementById('clearPlaylistBtn')?.addEventListener('click', async () => {
      if (await showConfirm('Clear entire playlist?')) clearPlaylist();
    });

    // Clear queue (inside queue list if present)
    document.getElementById('clearQueueBtn')?.addEventListener('click', async () => {
      if (await showConfirm('Clear the entire queue?')) clearPlaylist();
    });

    updateDisplay();
  }

  return { init, loadPlaylist, updateDisplay, stopAllAudio, addSong };
})();
