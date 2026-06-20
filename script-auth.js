// =============================================
// AUTH MODULE — Login / Logout / User State
// =============================================
const AuthModule = (function () {

  let initialized = false;

  // ---- Build login overlay ----
  function buildLoginOverlay() {
    if (document.getElementById('authOverlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'authOverlay';
    overlay.innerHTML = `
      <style>
        #authOverlay {
          position: fixed; inset: 0; z-index: 99999;
          background: linear-gradient(160deg, #2a1a0a 0%, #1a0e06 50%, #2a1a0a 100%);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif;
        }
        .auth-card {
          background: rgba(245,241,235,0.06);
          border: 1.5px solid rgba(212,165,116,0.2);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          max-width: 400px; width: 90%;
          text-align: center;
          backdrop-filter: blur(10px);
          box-shadow: 0 24px 60px rgba(0,0,0,0.5);
          animation: authCardIn 0.6s cubic-bezier(0.175,0.885,0.32,1.275);
        }
        @keyframes authCardIn {
          from { opacity:0; transform:translateY(30px) scale(0.95); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        .auth-logo { font-size: 3.5rem; margin-bottom: 0.5rem; }
        .auth-title {
          font-size: 2rem; color: #f5e8d0; font-style: italic;
          margin-bottom: 0.4rem; letter-spacing: 0.5px;
        }
        .auth-subtitle {
          font-family: 'Source Sans Pro', sans-serif;
          font-size: 0.9rem; color: rgba(212,165,116,0.6);
          margin-bottom: 2.5rem; line-height: 1.5;
        }
        .auth-google-btn {
          display: flex; align-items: center; justify-content: center; gap: 12px;
          width: 100%; padding: 14px 20px;
          background: #fff; border: none; border-radius: 14px;
          font-family: 'Source Sans Pro', sans-serif;
          font-size: 1rem; font-weight: 600; color: #3a3a3a;
          cursor: pointer; transition: all 0.2s ease;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
          margin-bottom: 16px;
        }
        .auth-google-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }
        .auth-google-btn:active { transform: translateY(0); }
        .auth-google-icon {
          width: 22px; height: 22px; flex-shrink: 0;
        }
        .auth-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 16px 0; color: rgba(212,165,116,0.3);
          font-family: 'Source Sans Pro', sans-serif; font-size: 0.8rem;
        }
        .auth-divider::before, .auth-divider::after {
          content: ''; flex: 1; height: 1px;
          background: rgba(212,165,116,0.15);
        }
        .auth-guest-btn {
          background: none; border: 1.5px solid rgba(212,165,116,0.2);
          border-radius: 12px; padding: 11px 20px; width: 100%;
          font-family: 'Playfair Display', serif; font-size: 0.9rem;
          color: rgba(212,165,116,0.55); cursor: pointer;
          transition: all 0.2s ease;
        }
        .auth-guest-btn:hover {
          border-color: rgba(212,165,116,0.4); color: rgba(212,165,116,0.8);
          background: rgba(212,165,116,0.06);
        }
        .auth-note {
          margin-top: 1.5rem;
          font-family: 'Source Sans Pro', sans-serif;
          font-size: 0.75rem; color: rgba(212,165,116,0.3);
          line-height: 1.5;
        }
        .auth-loading {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          color: rgba(212,165,116,0.6);
          font-family: 'Source Sans Pro', sans-serif; font-size: 0.9rem;
        }
        .auth-spinner {
          width: 20px; height: 20px; border-radius: 50%;
          border: 2px solid rgba(212,165,116,0.2);
          border-top-color: #d4a574;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      </style>

      <div class="auth-card">
        <div class="auth-logo">☕</div>
        <div class="auth-title">LetsFocus</div>
        <div class="auth-subtitle">Your personal focus café.<br>Sign in to sync your goals across devices.</div>

        <div id="authContent">
          <button class="auth-google-btn" id="googleSignInBtn">
            <svg class="auth-google-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div class="auth-divider">or</div>

          <button class="auth-guest-btn" id="guestModeBtn">
            Continue as Guest (local only)
          </button>

          <div class="auth-note">
            Sign in to sync your goals, XP, and stats across all your devices.
            Guest mode saves data locally — no account needed.
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('#googleSignInBtn').addEventListener('click', async () => {
      const content = overlay.querySelector('#authContent');
      content.innerHTML = '<div class="auth-loading"><div class="auth-spinner"></div> Redirecting to Google…</div>';
      await SupabaseModule.signInWithGoogle();
    });

    overlay.querySelector('#guestModeBtn').addEventListener('click', () => {
      localStorage.setItem('letsfocus_guest_mode', '1');
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.4s ease';
      setTimeout(() => { overlay.remove(); bootApp(); }, 400);
    });
  }

  // ---- User avatar / account pill in header ----
  function buildUserPill(user) {
    const existing = document.getElementById('userPill');
    if (existing) existing.remove();

    const pill = document.createElement('div');
    pill.id = 'userPill';
    pill.style.cssText = `
      display:flex;align-items:center;gap:8px;
      background:rgba(212,165,116,0.12);
      border:1.5px solid rgba(212,165,116,0.25);
      border-radius:20px; padding:5px 12px 5px 6px;
      cursor:pointer; transition:all 0.2s ease;
      font-family:'Source Sans Pro',sans-serif;
    `;

    const avatar = user.user_metadata?.avatar_url;
    const name = user.user_metadata?.full_name || user.email || 'Guest';
    const firstName = name.split(' ')[0];

    pill.innerHTML = `
      ${avatar
        ? `<img src="${avatar}" style="width:24px;height:24px;border-radius:50%;object-fit:cover;" alt="avatar">`
        : `<div style="width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#d4a574,#8b6f47);display:flex;align-items:center;justify-content:center;font-size:0.7rem;color:#fff;font-weight:700;">${firstName[0].toUpperCase()}</div>`
      }
      <span style="font-size:0.8rem;color:rgba(212,165,116,0.8);max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${firstName}</span>
      <span style="font-size:0.65rem;color:rgba(212,165,116,0.4);">▼</span>
    `;

    // Dropdown on click
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      const existing = document.getElementById('userDropdown');
      if (existing) { existing.remove(); return; }

      const dd = document.createElement('div');
      dd.id = 'userDropdown';
      dd.style.cssText = `
        position:fixed;
        top:${pill.getBoundingClientRect().bottom + 8}px;
        right:16px;
        background:rgba(245,241,235,0.98);
        border-radius:14px; padding:8px;
        box-shadow:0 8px 24px rgba(139,111,71,0.25);
        border:1.5px solid rgba(139,111,71,0.2);
        min-width:180px; z-index:10000;
        font-family:'Playfair Display',serif;
      `;
      dd.innerHTML = `
        <div style="padding:8px 10px 10px;border-bottom:1px solid rgba(139,111,71,0.1);margin-bottom:6px;">
          <div style="font-size:0.78rem;color:#4a3429;font-weight:600;">${name}</div>
          <div style="font-size:0.68rem;color:rgba(107,81,57,0.55);margin-top:2px;">${user.email || ''}</div>
        </div>
        <button id="ddSyncBtn" style="display:block;width:100%;padding:8px 10px;background:none;border:none;text-align:left;font-family:'Playfair Display',serif;font-size:0.82rem;color:#6b5139;cursor:pointer;border-radius:8px;">☁ Sync now</button>
        <button id="ddSignOutBtn" style="display:block;width:100%;padding:8px 10px;background:none;border:none;text-align:left;font-family:'Playfair Display',serif;font-size:0.82rem;color:#dc2626;cursor:pointer;border-radius:8px;">↩ Sign out</button>
      `;

      document.body.appendChild(dd);
      dd.querySelector('#ddSyncBtn').addEventListener('click', async () => {
        dd.remove();
        showCustomAlert('☁ Syncing…');
        await SupabaseModule.syncAllUp();
        showCustomAlert('✅ Synced!');
      });
      dd.querySelector('#ddSignOutBtn').addEventListener('click', async () => {
        dd.remove();
        const ok = await showConfirm('Sign out? Your data is saved to your account.');
        if (ok) SupabaseModule.signOut();
      });
      document.addEventListener('click', () => dd.remove(), { once: true });
    });

    const headerActions = document.querySelector('.header-actions');
    if (headerActions) headerActions.prepend(pill);
  }

  // ---- Boot app after auth confirmed ----
  function bootApp() {
    if (initialized) return;
    initialized = true;
    // Fire custom event so script-main.js can init all modules
    document.dispatchEvent(new CustomEvent('letsfocus:ready'));
  }

  // ---- Show sync status indicator ----
  let syncIndicator = null;
  function showSyncStatus(msg, isError = false) {
    if (!syncIndicator) {
      syncIndicator = document.createElement('div');
      syncIndicator.id = 'syncStatus';
      syncIndicator.style.cssText = `
        position:fixed;bottom:20px;left:50%;transform:translateX(-50%);
        background:rgba(245,241,235,0.95);border-radius:20px;
        padding:6px 18px;font-family:'Source Sans Pro',sans-serif;
        font-size:0.78rem;color:#6b5139;
        box-shadow:0 4px 14px rgba(139,111,71,0.2);
        border:1px solid rgba(139,111,71,0.15);
        z-index:9999;transition:opacity 0.3s ease;
        pointer-events:none;
      `;
      document.body.appendChild(syncIndicator);
    }
    syncIndicator.textContent = msg;
    syncIndicator.style.color = isError ? '#dc2626' : '#6b5139';
    syncIndicator.style.opacity = '1';
    clearTimeout(syncIndicator._timeout);
    syncIndicator._timeout = setTimeout(() => {
      if (syncIndicator) syncIndicator.style.opacity = '0';
    }, 2500);
  }

  // ---- Main init ----
  async function init() {
    SupabaseModule.init();

    // ---- Safe sync trigger via CustomEvent (replaces localStorage.setItem monkeypatch) ----
    // Any module that saves important data dispatches: document.dispatchEvent(new CustomEvent('letsfocus:datasave', { detail: { key } }))
    // Auth listens here and forwards to Supabase — no prototype mutation needed.
    const SYNC_KEYS = new Set(['goals','letsfocus_categories_v2','letsfocus_stats','letsfocus_xp','letsfocus_bill_positions']);
    function wireSyncListener() {
      document.addEventListener('letsfocus:datasave', (e) => {
        if (SYNC_KEYS.has(e.detail?.key)) {
          SupabaseModule.scheduleSyncUp();
          showSyncStatus('☁ Saving…');
        }
      });
    }

    // Listen for auth changes
    SupabaseModule.onAuthChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const user = session.user;
        buildUserPill(user);
        // Pull cloud data down
        showSyncStatus('☁ Loading your data…');
        await SupabaseModule.syncAllDown();
        showSyncStatus('✅ Synced');
        // Migrate any local data if this is first login
        await SupabaseModule.migrateLocalData();
        bootApp();
        wireSyncListener();

      } else if (event === 'SIGNED_OUT') {
        document.getElementById('userPill')?.remove();
      }
    });

    // Check existing session
    const session = await SupabaseModule.getSession();
    const isGuest = localStorage.getItem('letsfocus_guest_mode') === '1';

    if (session) {
      buildUserPill(session.user);
      showSyncStatus('☁ Loading your data…');
      await SupabaseModule.syncAllDown();
      showSyncStatus('✅ Synced');
      bootApp();
      wireSyncListener();
    } else if (isGuest) {
      bootApp();
    } else {
      buildLoginOverlay();
    }
  }

  return { init, bootApp, showSyncStatus };
})();
